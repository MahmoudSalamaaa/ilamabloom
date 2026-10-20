"use client";

import { useMemo, useState } from "react";
import styles from "../Study.module.css";
import { studyCurriculum } from "../curriculum";

const trackNames = { COM: "Communication & Talking OSCE", CLN: "Clinical Examination", VID: "Video Interpretation", DEV: "Development", HMX: "History & Management" } as const;

export default function StudyTopicsBrowser() {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("ALL");
  const [domain, setDomain] = useState("ALL");
  const domains = useMemo(() => Array.from(new Set(studyCurriculum.map((unit) => unit.domain))), []);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return studyCurriculum.filter((unit) => {
      const matchesQuery = !needle || `${unit.id} ${unit.title} ${unit.domain} ${trackNames[unit.track]}`.toLowerCase().includes(needle);
      return matchesQuery && (track === "ALL" || unit.track === track) && (domain === "ALL" || unit.domain === domain);
    });
  }, [domain, query, track]);

  return <>
    <div className={styles.topicFilters} aria-label="Filter Study topics">
      <label><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, code or domain" /></label>
      <label><span>Track</span><select value={track} onChange={(event) => setTrack(event.target.value)}><option value="ALL">All tracks</option>{Object.entries(trackNames).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
      <label><span>Domain</span><select value={domain} onChange={(event) => setDomain(event.target.value)}><option value="ALL">All domains</option>{domains.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <p aria-live="polite"><strong>{filtered.length}</strong> of {studyCurriculum.length} topics</p>
    </div>
    <div className={styles.fullTopicGrid}>{filtered.map((unit) => <article key={unit.id} className={styles.topicCard}><span>{unit.id} · {trackNames[unit.track]}</span><h2>{unit.title}</h2><p>{unit.domain}</p><small>Planned learning unit · public map</small></article>)}</div>
    {filtered.length === 0 && <p className={styles.emptyTopics}>No topics match this search. Try a broader term or reset a filter.</p>}
  </>;
}

