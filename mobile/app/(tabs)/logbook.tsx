import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addRecord, getRecords, removeRecord, type TestRecord } from "../../lib/records";
import { theme } from "../../lib/theme";
import { Card, Heading, Pill, Screen } from "../../components/Screen";

export default function LogbookScreen() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setRecords(await getRecords());
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const save = async () => {
    if (!title.trim() || !note.trim() || saving) return;
    setSaving(true);
    try {
      setRecords(await addRecord(title, note));
      setTitle("");
      setNote("");
    } catch {
      Alert.alert("Could not save", "The note could not be stored on this device.");
    } finally {
      setSaving(false);
    }
  };

  const remove = (record: TestRecord) => {
    Alert.alert("Delete note?", record.title, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { void removeRecord(record.id).then(setRecords); } },
    ]);
  };

  return (
    <Screen>
      <Heading title="Test log." subtitle="Keep engineering notes and test-session observations on this device." />
      <Card>
        <View style={styles.formHeader}><Text style={styles.formTitle}>New entry</Text><Pill>DEVICE ONLY</Pill></View>
        <TextInput value={title} onChangeText={setTitle} placeholder="Session title" placeholderTextColor={theme.colors.subtle} maxLength={80} style={styles.input} accessibilityLabel="Session title" />
        <TextInput value={note} onChangeText={setNote} placeholder="Conditions, observations, issues…" placeholderTextColor={theme.colors.subtle} maxLength={1200} multiline textAlignVertical="top" style={[styles.input, styles.noteInput]} accessibilityLabel="Test notes" />
        <Pressable onPress={() => void save()} disabled={!title.trim() || !note.trim() || saving} style={({ pressed }) => [styles.saveButton, (!title.trim() || !note.trim() || saving) && styles.disabledButton, pressed && styles.pressed]}>
          {saving ? <ActivityIndicator color={theme.colors.background} /> : <Text style={styles.saveText}>Save entry</Text>}
        </Pressable>
        <Text style={styles.helper}>Entries stay on this phone. They are not synced or backed up to a team server.</Text>
      </Card>
      <View style={styles.listHeader}><Text style={styles.listTitle}>Recent entries</Text><Text style={styles.count}>{records.length} / 100</Text></View>
      {loading ? <ActivityIndicator color={theme.colors.accent} /> : records.length === 0 ? (
        <Card><Text style={styles.emptyTitle}>No entries yet</Text><Text style={styles.emptyText}>Add the first note after a bench check or team test session.</Text></Card>
      ) : records.map((record) => (
        <Card key={record.id}>
          <View style={styles.recordHeader}><Text style={styles.recordTitle}>{record.title}</Text><Pressable onPress={() => remove(record)} accessibilityRole="button" accessibilityLabel={`Delete ${record.title}`}><Text style={styles.delete}>Delete</Text></Pressable></View>
          <Text style={styles.date}>{new Date(record.createdAt).toLocaleString()}</Text>
          <Text style={styles.recordNote}>{record.note}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  formTitle: { color: theme.colors.text, fontSize: 15, fontWeight: "700" },
  input: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, color: theme.colors.text, paddingHorizontal: 13, paddingVertical: 12, fontSize: 13 },
  noteInput: { minHeight: 100 },
  saveButton: { minHeight: 46, borderRadius: 12, backgroundColor: theme.colors.accent, alignItems: "center", justifyContent: "center" },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.75 },
  saveText: { color: "#0B171B", fontWeight: "800", fontSize: 13 },
  helper: { color: theme.colors.subtle, fontSize: 10, lineHeight: 15 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 },
  listTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
  count: { color: theme.colors.subtle, fontSize: 11 },
  emptyTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 14 },
  emptyText: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  recordHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  recordTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 14, flex: 1 },
  delete: { color: theme.colors.danger, fontSize: 11, fontWeight: "700" },
  date: { color: theme.colors.subtle, fontSize: 10 },
  recordNote: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
});
