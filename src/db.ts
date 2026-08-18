import { CatProfile, HistoryRecord } from './types';

function getUserId(): number | null {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id, 10) : null;
}

export function getActiveCatId(): string | null {
  return localStorage.getItem('activeCatId');
}

export function setActiveCatId(catId: string): void {
  localStorage.setItem('activeCatId', catId);
}

export async function getAuthState(): Promise<boolean> {
  return !!getUserId();
}

export async function setAuthState(isLoggedIn: boolean, userId?: number): Promise<void> {
  if (isLoggedIn && userId) {
    localStorage.setItem('userId', userId.toString());
  } else {
    localStorage.removeItem('userId');
    localStorage.removeItem('activeCatId');
  }
}

export async function getProfiles(): Promise<CatProfile[]> {
  const userId = getUserId();
  if (!userId) return [];
  try {
    const res = await fetch(`/api/profiles?userId=${userId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getProfile(catId?: string): Promise<CatProfile | null> {
  const userId = getUserId();
  if (!userId) return null;
  const url = catId 
    ? `/api/profile?userId=${userId}&catId=${encodeURIComponent(catId)}`
    : `/api/profile?userId=${userId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveProfile(profile: CatProfile): Promise<CatProfile | null> {
  const userId = getUserId();
  if (!userId) return null;
  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...profile })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.profile?.id) {
      setActiveCatId(data.profile.id);
    }
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function deleteProfile(catId: string): Promise<CatProfile[]> {
  const userId = getUserId();
  if (!userId) return [];
  try {
    const res = await fetch('/api/profile', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, catId })
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.remaining || [];
  } catch {
    return [];
  }
}

export async function getHistory(catId?: string): Promise<HistoryRecord[]> {
  const userId = getUserId();
  if (!userId) return [];
  const url = catId && catId !== 'all'
    ? `/api/history?userId=${userId}&catId=${encodeURIComponent(catId)}`
    : `/api/history?userId=${userId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function addHistoryRecord(record: HistoryRecord): Promise<void> {
  const userId = getUserId();
  if (!userId) return;
  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...record })
    });
  } catch (err) {
    console.error("Failed to add history record:", err);
  }
}

export async function clearData(): Promise<void> {
  const userId = getUserId();
  if (!userId) return;
  try {
    await fetch('/api/clear-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch {}
  setAuthState(false);
}
