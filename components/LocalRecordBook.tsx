"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type RecordItem = { id: string; title: string; date: string; notes: string; createdAt: string };

export default function LocalRecordBook({ storageKey, heading, description, buttonLabel, emptyTitle, emptyDescription }: {
  storageKey: string; heading: string; description: string; buttonLabel: string; emptyTitle: string; emptyDescription: string;
}) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved) as RecordItem[]);
    } catch { setItems([]); }
    setReady(true);
  }, [storageKey]);

  function save(next: RecordItem[]) {
    setItems(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Browser storage may be unavailable. */ }
  }

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    const next = [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: title.trim(), date, notes: notes.trim(), createdAt: new Date().toISOString() }, ...items];
    save(next);
    setTitle("");
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
        <div className="panel-heading"><div><h2>Saved records</h2><p>{ready ? `${items.length} entr${items.length === 1 ? "y" : "ies"} on this device` : "Loading local records"}</p></div><span className="panel-icon">☷</span></div>
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
