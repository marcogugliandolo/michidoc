export interface CatProfile {
  id?: string;
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

export interface PainHistoryRecord {
  id: string;
  catId?: string;
  date: number;
  type: "pain";
  photoUrl?: string;
  photoUrl2?: string;
  result: PainResult;
}

export interface BCSHistoryRecord {
  id: string;
  catId?: string;
  date: number;
  type: "bcs";
  photoUrl?: string;
  photoUrl2?: string;
  result: BCSResult;
}

export type HistoryRecord = PainHistoryRecord | BCSHistoryRecord;
