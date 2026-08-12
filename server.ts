import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
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
