import { CatProfile, HistoryRecord } from './types';

function getUserId(): number | null {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id, 10) : null;
}

export async function getAuthState(): Promise<boolean> {
  return !!getUserId();
}

export async function setAuthState(isLoggedIn: boolean, userId?: number): Promise<void> {
  if (isLoggedIn && userId) {
    localStorage.setItem('userId', userId.toString());
  } else {
    localStorage.removeItem('userId');
  }
}

export async function getProfile(): Promise<CatProfile | null> {
  const userId = getUserId();
  if (!userId) return null;
  const res = await fetch(`/api/profile?userId=${userId}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function saveProfile(profile: CatProfile): Promise<void> {
  const userId = getUserId();
  if (!userId) return;
  await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...profile })
  });
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const userId = getUserId();
  if (!userId) return [];
  const res = await fetch(`/api/history?userId=${userId}`);
  if (!res.ok) return [];
  return await res.json();
}

export async function addHistoryRecord(record: HistoryRecord): Promise<void> {
  const userId = getUserId();
  if (!userId) return;
  await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...record })
  });
}

export async function clearData(): Promise<void> {
  const userId = getUserId();
  if (!userId) return;
  await fetch('/api/clear-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  setAuthState(false);
}
