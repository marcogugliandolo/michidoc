import { get, set, update } from 'idb-keyval';
import { CatProfile, HistoryRecord } from './types';

const PROFILE_KEY = 'michidoc_profile';
const HISTORY_KEY = 'michidoc_history';

export async function getProfile(): Promise<CatProfile | null> {
  return await get(PROFILE_KEY) || null;
}

export async function saveProfile(profile: CatProfile): Promise<void> {
  await set(PROFILE_KEY, profile);
}

export async function getHistory(): Promise<HistoryRecord[]> {
  return await get(HISTORY_KEY) || [];
}

export async function addHistoryRecord(record: HistoryRecord): Promise<void> {
  await update(HISTORY_KEY, (val = []) => [record, ...val]);
}

export async function clearData(): Promise<void> {
  await set(PROFILE_KEY, null);
  await set(HISTORY_KEY, []);
}
