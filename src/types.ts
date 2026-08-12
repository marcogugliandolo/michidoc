export interface CatProfile {
  name: string;
  age: string;
  breed?: string;
  photoUrl: string; // Base64 or Blob URL
}

export interface PainResult {
  level: "Ninguno" | "Leve" | "Moderado" | "Alto";
  explanation: string;
  recommendation: string;
}

export interface BCSResult {
  score: number;
  status: "Bajo peso" | "Peso ideal" | "Sobrepeso" | "Obesidad";
  explanation: string;
  recommendation: string;
}

export interface HistoryRecord {
  id: string;
  date: number;
  type: "pain" | "bcs";
  photoUrl?: string; // thumbnail
  photoUrl2?: string; // for bcs side image
  result: PainResult | BCSResult;
}
