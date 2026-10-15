"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";

type RecordItem = { id: string; title: string; date: string; notes: string; createdAt: string };

export default function LocalRecordBook({ storageKey, heading, description, buttonLabel, emptyTitle, emptyDescription }: {
  storageKey: string; heading: string; description: string; buttonLabel: string; emptyTitle: string; emptyDescription: string;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const subscribe = useCallback((notify: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) notify();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("evs-records-change", notify);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("evs-records-change", notify);
    };
  }, [storageKey]);

  const getSnapshot = useCallback(() => {
    try { return window.localStorage.getItem(storageKey) ?? "[]"; } catch { return "[]"; }
  }, [storageKey]);

  const serialized = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = useMemo<RecordItem[]>(() => {
    try {
      const parsed: unknown = JSON.parse(serialized);
      return Array.isArray(parsed) ? parsed as RecordItem[] : [];
    } catch { return []; }
  }, [serialized]);

  function save(next: RecordItem[]) {
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Browser storage may be unavailable. */ }
    window.dispatchEvent(new Event("evs-records-change"));
  }

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    const recordDate = date || new Date().toLocaleDateString("en-CA");
    save([{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: title.trim(), date: recordDate, notes: notes.trim(), createdAt: new Date().toISOString() }, ...items]);
    setTitle("");
    setDate("");
    setNotes("");
  }

  return (
    <div className="record-layout">
      <section className="panel-card record-form-panel">
        <div className="panel-heading"><div><h2>{heading}</h2><p>{description}</p></div><span className="panel-icon">＋</span></div>
        <form className="record-form" onSubmit={addRecord}>
          <label>Title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Battery inspection" maxLength={100} /></label>
          <label>Date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What was checked, changed, or observed?" rows={4} maxLength={2000} /></label>
          <button className="primary-action" type="submit">{buttonLabel}</button>
          <p className="local-storage-note">Saved in this browser only. It is not uploaded or shared with the team.</p>
        </form>
      </section>
      <section className="panel-card record-list-panel">
        <div className="panel-heading"><div><h2>Saved records</h2><p>{`${items.length} entr${items.length === 1 ? "y" : "ies"} on this device`}</p></div><span className="panel-icon">☷</span></div>
        {items.length === 0 ? (
          <div className="record-empty"><span className="empty-icon">☷</span><strong>{emptyTitle}</strong><p>{emptyDescription}</p></div>
        ) : (
          <div className="record-list">{items.map((item) => (
            <article className="record-item" key={item.id}>
              <div className="record-item-top"><div><time>{item.date}</time><h3>{item.title}</h3></div><button className="quiet-action" type="button" onClick={() => save(items.filter((record) => record.id !== item.id))} aria-label={`Delete ${item.title}`}>Delete</button></div>
              {item.notes && <p>{item.notes}</p>}
            </article>
          ))}</div>
        )}
      </section>
    </div>
  );
}
