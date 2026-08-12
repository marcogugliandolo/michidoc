import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let db: ReturnType<typeof Database>;

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
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      name TEXT,
      age TEXT,
      breed TEXT,
      photoUrl TEXT
    );
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      date INTEGER,
      type TEXT,
      photoUrl TEXT,
      photoUrl2 TEXT,
      result TEXT
    );
  `);

  // Seed default user for testing if it doesn't exist
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get("marco");
  if (!user) {
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("marco", "marco2026");
  }
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// DB Endpoints
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare("SELECT id FROM users WHERE username = ? AND password = ?").get(username, password) as { id: number } | undefined;
    if (user) {
      res.json({ success: true, userId: user.id });
    } else {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const userId = req.query.userId;
    const profile = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId);
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/profile", async (req, res) => {
  try {
    const { userId, name, age, breed, photoUrl } = req.body;
    const existing = db.prepare("SELECT id FROM profiles WHERE user_id = ?").get(userId);
    if (existing) {
      db.prepare("UPDATE profiles SET name = ?, age = ?, breed = ?, photoUrl = ? WHERE user_id = ?").run(name, age, breed, photoUrl, userId);
    } else {
      db.prepare("INSERT INTO profiles (user_id, name, age, breed, photoUrl) VALUES (?, ?, ?, ?, ?)").run(userId, name, age, breed, photoUrl);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const userId = req.query.userId;
    const records = db.prepare("SELECT * FROM history WHERE user_id = ? ORDER BY date DESC").all(userId) as any[];
    // Parse result JSON strings back to objects
    const parsed = records.map(r => ({
      ...r,
      result: JSON.parse(r.result)
    }));
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/history", async (req, res) => {
  try {
    const { id, userId, date, type, photoUrl, photoUrl2, result } = req.body;
    db.prepare(
      "INSERT INTO history (id, user_id, date, type, photoUrl, photoUrl2, result) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(id, userId, date, type, photoUrl, photoUrl2, JSON.stringify(result));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/clear-data", async (req, res) => {
  try {
    const { userId } = req.body;
    db.prepare("DELETE FROM profiles WHERE user_id = ?").run(userId);
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
