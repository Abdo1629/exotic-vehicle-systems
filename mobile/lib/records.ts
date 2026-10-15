import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "evs.mobile.test-records.v1";

export type TestRecord = {
  id: string;
  title: string;
  note: string;
  createdAt: string;
};

export async function getRecords(): Promise<TestRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is TestRecord =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "title" in item &&
        "note" in item &&
        "createdAt" in item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.note === "string" &&
        typeof item.createdAt === "string",
    );
  } catch {
    return [];
  }
}

export async function addRecord(title: string, note: string): Promise<TestRecord[]> {
  const existing = await getRecords();
  const record: TestRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };
  const updated = [record, ...existing].slice(0, 100);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeRecord(id: string): Promise<TestRecord[]> {
  const updated = (await getRecords()).filter((record) => record.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
