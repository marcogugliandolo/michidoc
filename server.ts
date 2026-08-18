import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import fs from "fs";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let db: ReturnType<typeof Database>;

// Security helper: Salted Scrypt cryptographic password hashing
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString("hex");
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const candidateHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(candidateHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

async function setupDB() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(path.join(dataDir, "michidoc.db"));

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      salt TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      age TEXT,
      breed TEXT,
      photoUrl TEXT
    );
    CREATE TABLE IF NOT EXISTS cats (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      name TEXT,
      age TEXT,
      breed TEXT,
      photoUrl TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      cat_id TEXT,
      date INTEGER,
      type TEXT,
      photoUrl TEXT,
      photoUrl2 TEXT,
      result TEXT
    );
  `);

  // Migration: If table has legacy 'password' column, migrate to hashed & salted columns
  try {
    const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
    const hasPasswordCol = tableInfo.some((col: any) => col.name === "password");
    const hasHashCol = tableInfo.some((col: any) => col.name === "password_hash");

    if (!hasHashCol) {
      db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT;");
      db.exec("ALTER TABLE users ADD COLUMN salt TEXT;");
      db.exec("ALTER TABLE users ADD COLUMN created_at INTEGER;");
    }

    if (hasPasswordCol) {
      // Migrate legacy plaintext entries into salted scrypt hashes
      const legacyUsers = db.prepare("SELECT id, password FROM users WHERE password IS NOT NULL AND password_hash IS NULL").all() as any[];
      for (const u of legacyUsers) {
        const { hash, salt } = hashPassword(u.password);
        db.prepare("UPDATE users SET password_hash = ?, salt = ?, created_at = ?, password = NULL WHERE id = ?").run(
          hash,
          salt,
          Date.now(),
          u.id
        );
      }
    }
  } catch (err) {
    console.error("Migration error (users):", err);
  }

  // Migrate legacy column in history table if needed
  try {
    db.exec("ALTER TABLE history ADD COLUMN cat_id TEXT;");
  } catch {}

  try {
    const legacyProfiles = db.prepare("SELECT * FROM profiles").all() as any[];
    for (const p of legacyProfiles) {
      if (p.name && p.photoUrl) {
        const catId = `cat_${p.user_id}_${p.id || 1}`;
        const exists = db.prepare("SELECT id FROM cats WHERE id = ?").get(catId);
        if (!exists) {
          db.prepare("INSERT INTO cats (id, user_id, name, age, breed, photoUrl, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
            catId,
            p.user_id,
            p.name,
            p.age,
            p.breed || 'Mestizo',
            p.photoUrl,
            Date.now()
          );
        }
      }
    }
  } catch {}
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Secure Login & Auto-Registration Endpoint (using cryptographic salted hashes)
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Por favor, ingresa tu usuario y contraseña." });
    }

    const trimmedUsername = String(username).trim();
    const rawPassword = String(password);

    // Look for existing user by username (case-insensitive)
    const user = db.prepare("SELECT id, password_hash, salt FROM users WHERE lower(username) = ?").get(trimmedUsername.toLowerCase()) as any;

    if (user && user.password_hash && user.salt) {
      // User exists: verify cryptographic hash
      const isValid = verifyPassword(rawPassword, user.password_hash, user.salt);
      if (isValid) {
        return res.json({ success: true, userId: user.id });
      } else {
        return res.status(401).json({ error: "Contraseña incorrecta. Por favor, verifica tus credenciales." });
      }
    } else if (!user) {
      // First-time registration: hash password securely with unique random salt
      const { hash, salt } = hashPassword(rawPassword);
      const result = db.prepare("INSERT INTO users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)").run(
        trimmedUsername,
        hash,
        salt,
        Date.now()
      );
      return res.json({ success: true, userId: Number(result.lastInsertRowid) });
    } else {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error en el servidor al autenticar." });
  }
});

// Get all cats for a user
app.get("/api/profiles", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.json([]);

    let cats = db.prepare("SELECT * FROM cats WHERE user_id = ? ORDER BY created_at ASC").all(userId) as any[];
    if (!cats || cats.length === 0) {
      // Fallback to legacy profiles table if any
      const legacy = db.prepare("SELECT * FROM profiles WHERE user_id = ?").all(userId) as any[];
      if (legacy && legacy.length > 0) {
        cats = legacy.map((p, idx) => ({
          id: `cat_${p.user_id}_${p.id || idx + 1}`,
          name: p.name,
          age: p.age,
          breed: p.breed,
          photoUrl: p.photoUrl
        }));
      }
    }
    res.json(cats || []);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const userId = req.query.userId;
    const catId = req.query.catId;
    if (!userId) return res.json(null);

    let cat;
    if (catId) {
      cat = db.prepare("SELECT * FROM cats WHERE user_id = ? AND id = ?").get(userId, catId);
    } else {
      cat = db.prepare("SELECT * FROM cats WHERE user_id = ? ORDER BY created_at ASC LIMIT 1").get(userId);
    }

    if (!cat) {
      // Fallback
      cat = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId);
    }

    res.json(cat || null);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/profile", async (req, res) => {
  try {
    const { userId, id, name, age, breed, photoUrl } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const catId = id || `cat_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const existing = db.prepare("SELECT id FROM cats WHERE id = ?").get(catId);

    if (existing) {
      db.prepare(
        "UPDATE cats SET name = ?, age = ?, breed = ?, photoUrl = ? WHERE id = ? AND user_id = ?"
      ).run(name, age, breed, photoUrl, catId, userId);
    } else {
      db.prepare(
        "INSERT INTO cats (id, user_id, name, age, breed, photoUrl, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(catId, userId, name, age, breed, photoUrl, Date.now());
    }

    const saved = db.prepare("SELECT * FROM cats WHERE id = ?").get(catId);
    res.json({ success: true, profile: saved });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/profile", async (req, res) => {
  try {
    const { userId, catId } = req.body;
    if (!userId || !catId) {
      return res.status(400).json({ error: "Missing userId or catId" });
    }

    db.prepare("DELETE FROM cats WHERE id = ? AND user_id = ?").run(catId, userId);
    db.prepare("DELETE FROM history WHERE cat_id = ? AND user_id = ?").run(catId, userId);
    
    // Check remaining cats
    const remaining = db.prepare("SELECT * FROM cats WHERE user_id = ? ORDER BY created_at ASC").all(userId);
    res.json({ success: true, remaining });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const userId = req.query.userId;
    const catId = req.query.catId;
    if (!userId) return res.json([]);

    let records: any[];
    if (catId && catId !== 'all') {
      records = db.prepare(
        "SELECT * FROM history WHERE user_id = ? AND (cat_id = ? OR cat_id IS NULL) ORDER BY date DESC"
      ).all(userId, catId) as any[];
    } else {
      records = db.prepare(
        "SELECT * FROM history WHERE user_id = ? ORDER BY date DESC"
      ).all(userId) as any[];
    }

    // Parse result JSON strings back to objects
    const parsed = records.map(r => ({
      ...r,
      catId: r.cat_id,
      result: typeof r.result === 'string' ? JSON.parse(r.result) : r.result
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/history", async (req, res) => {
  try {
    const { id, userId, catId, date, type, photoUrl, photoUrl2, result } = req.body;
    db.prepare(
      "INSERT INTO history (id, user_id, cat_id, date, type, photoUrl, photoUrl2, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(id, userId, catId || null, date, type, photoUrl, photoUrl2, JSON.stringify(result));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/clear-data", async (req, res) => {
  try {
    const { userId } = req.body;
    db.prepare("DELETE FROM profiles WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM cats WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM history WHERE user_id = ?").run(userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// APIs
app.post("/api/analyze-pain", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: `Analiza esta cara de gato usando la escala Feline Grimace Scale. Evalúa la posición de las orejas, tensión de bigotes, apertura de ojos y forma de la cabeza.
Devuelve un JSON con:
- "level": Nivel de dolor (debe ser exactamente uno de estos valores: "Ninguno", "Leve", "Moderado", "Alto").
- "explanation": Explicación corta y muy amigable (1-2 oraciones) de lo que observas, sin jerga veterinaria, dirigida al dueño de la mascota.
- "recommendation": Una recomendación clara y sencilla (ej. "Todo parece bien", "Vigílalo de cerca", "Consulta al veterinario pronto").
Recuerda añadir una advertencia de que esto es solo una guía orientativa y no sustituye al veterinario (esto lo agregaré yo en el frontend, así que limítate a los datos).`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendation: { type: Type.STRING },
          },
          required: ["level", "explanation", "recommendation"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error) {
    console.error("Error analyzing pain:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

app.post("/api/analyze-bcs", async (req, res) => {
  try {
    const { topImageBase64, sideImageBase64 } = req.body;
    if (!topImageBase64 || !sideImageBase64) {
      return res.status(400).json({ error: "Both top and side images are required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: topImageBase64,
            },
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: sideImageBase64,
            },
          },
          {
            text: `Analiza estas dos fotos del gato (una desde arriba y otra de perfil) usando la escala Body Condition Score (BCS 1-9).
Devuelve un JSON con:
- "score": Un número entero del 1 al 9 estimando la condición corporal.
- "status": Debe ser exactamente uno de: "Bajo peso", "Peso ideal", "Sobrepeso", "Obesidad".
- "explanation": Explicación corta y amable de por qué se asigna este score (ej. "Se le notan las costillas..." o "Tiene una cinturita perfecta...").
- "recommendation": Recomendación simple sobre su alimentación o actividad física.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            status: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendation: { type: Type.STRING },
          },
          required: ["score", "status", "explanation", "recommendation"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error) {
    console.error("Error analyzing BCS:", error);
    res.status(500).json({ error: "Failed to analyze images" });
  }
});

async function startServer() {
  await setupDB();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
