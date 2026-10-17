import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addRecord, getRecords, removeRecord, type TestRecord } from "../../lib/records";
import { useTheme, type ThemeColors } from "../../lib/theme";
import { Card, Heading, Pill, Screen } from "../../components/Screen";
import { useLocale } from "../../lib/i18n";

export default function LogbookScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const rtl = locale === "ar";
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
      Alert.alert(tr("Could not save", "تعذر الحفظ"), tr("The note could not be stored on this device.", "لم نتمكن من حفظ الملاحظة على هذا الجهاز."));
    } finally { setSaving(false); }
  };

  const remove = (record: TestRecord) => {
    Alert.alert(tr("Delete note?", "حذف الملاحظة؟"), record.title, [
      { text: tr("Cancel", "إلغاء"), style: "cancel" },
      { text: tr("Delete", "حذف"), style: "destructive", onPress: () => { void removeRecord(record.id).then(setRecords); } },
    ]);
  };

  return (
    <Screen>
      <Heading title={tr("Test log", "سجل الاختبارات")} subtitle={tr("Record test observations on this phone. Team sync is not connected yet.", "سجّل ملاحظات الاختبارات على الموبايل. مزامنة الفريق غير متاحة حتى الآن.")} />
      <Card>
        <View style={[styles.formHeader, rtl && styles.rowRtl]}><Text style={styles.formTitle}>{tr("New entry", "إضافة سجل")}</Text><Pill>{tr("DEVICE ONLY", "على الجهاز فقط")}</Pill></View>
        <TextInput value={title} onChangeText={setTitle} placeholder={tr("Session title", "عنوان الاختبار")} placeholderTextColor={colors.subtle} maxLength={80} style={[styles.input, rtl && styles.inputRtl]} accessibilityLabel={tr("Session title", "عنوان الاختبار")} textAlign={rtl ? "right" : "left"} />
        <TextInput value={note} onChangeText={setNote} placeholder={tr("Conditions, observations, issues…", "ظروف الاختبار والملاحظات والمشكلات…")} placeholderTextColor={colors.subtle} maxLength={1200} multiline textAlignVertical="top" style={[styles.input, styles.noteInput, rtl && styles.inputRtl]} accessibilityLabel={tr("Test notes", "ملاحظات الاختبار")} textAlign={rtl ? "right" : "left"} />
        <Pressable onPress={() => void save()} disabled={!title.trim() || !note.trim() || saving} style={({ pressed }) => [styles.saveButton, (!title.trim() || !note.trim() || saving) && styles.disabledButton, pressed && styles.pressed]}>
          {saving ? <ActivityIndicator color={colors.background} /> : <Text style={styles.saveText}>{tr("Save entry", "حفظ السجل")}</Text>}
        </Pressable>
        <Text style={[styles.helper, rtl && styles.textRtl]}>{tr("Entries stay on this phone. They are not synced or backed up to a team server.", "السجلات محفوظة على الموبايل فقط، ولا تتم مزامنتها أو نسخها احتياطيًا إلى خادم الفريق.")}</Text>
      </Card>
      <View style={[styles.listHeader, rtl && styles.rowRtl]}><Text style={styles.listTitle}>{tr("Recent entries", "أحدث السجلات")}</Text><Text style={styles.count}>{records.length} / 100</Text></View>
      {loading ? <ActivityIndicator color={colors.accent} /> : records.length === 0 ? (
        <Card><Text style={styles.emptyTitle}>{tr("No entries yet", "لا توجد سجلات بعد")}</Text><Text style={[styles.emptyText, rtl && styles.textRtl]}>{tr("Add the first note after a bench check or team test session.", "أضف أول ملاحظة بعد فحص أو جلسة اختبار للفريق.")}</Text></Card>
      ) : records.map((record) => (
        <Card key={record.id}>
          <View style={[styles.recordHeader, rtl && styles.rowRtl]}><Text style={[styles.recordTitle, rtl && styles.textRtl]}>{record.title}</Text><Pressable onPress={() => remove(record)} accessibilityRole="button" accessibilityLabel={tr(`Delete ${record.title}`, `حذف ${record.title}`)}><Text style={styles.delete}>{tr("Delete", "حذف")}</Text></Pressable></View>
          <Text style={[styles.date, rtl && styles.textRtl]}>{new Date(record.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</Text>
          <Text style={[styles.recordNote, rtl && styles.textRtl]}>{record.note}</Text>
        </Card>
      ))}
    </Screen>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowRtl: { flexDirection: "row-reverse" },
  textRtl: { textAlign: "right" },
  inputRtl: { writingDirection: "rtl" },
  formTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 15, fontWeight: "700" },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12, color: colors.text, paddingHorizontal: 13, paddingVertical: 12, fontSize: 13 },
  noteInput: { minHeight: 100 },
  saveButton: { minHeight: 46, borderRadius: 12, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.75 },
  saveText: { color: "#0B171B", fontWeight: "800", fontSize: 13 },
  helper: { color: colors.subtle, fontSize: 10, lineHeight: 16 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 },
  listTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontWeight: "700", fontSize: 16 },
  count: { color: colors.subtle, fontSize: 11 },
  emptyTitle: { color: colors.text, fontWeight: "700", fontSize: 14 },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  recordHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  recordTitle: { color: colors.text, fontWeight: "700", fontSize: 13, flex: 1 },
  delete: { color: colors.danger, fontSize: 11, fontWeight: "700" },
  date: { color: colors.subtle, fontSize: 10 },
  recordNote: { color: colors.muted, fontSize: 12, lineHeight: 19 },
});
}
