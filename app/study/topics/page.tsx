import Link from "next/link";
import styles from "../Study.module.css";
import { studyCurriculum } from "../curriculum";

export const metadata = {
  title: "All Study Topics — ILAMA BLOOM",
  description: "The complete public English register of 350 ILAMA BLOOM Study units.",
  alternates: { canonical: "https://www.ilamabloom.com/study/topics" },
};

const trackNames = { COM: "Communication & Talking OSCE", CLN: "Clinical Examination", VID: "Video Interpretation", DEV: "Development", HMX: "History & Management" } as const;

export default function StudyTopicsPage() {
  return <main className={styles.page}>
    <header className={styles.header}><Link href="/study" className={styles.wordmark}>ILAMA BLOOM <span>STUDY</span></Link><nav aria-label="Study navigation"><Link href="/study#curriculum">Curriculum</Link><Link href="/study/topics">All topics</Link></nav><span className={styles.headerMeta}>350 ENGLISH UNITS</span></header>
    <section className={styles.topicSection} aria-labelledby="all-topics-title">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>PUBLIC REGISTER · 350 UNITS</p><h1 id="all-topics-title">The complete <em>learning field.</em></h1></div><p>Browse the canonical Study register by track and domain. Detailed objectives, cases, examiner rubrics and media are released only after their evidence and ownership checks are complete.</p></div>
      <div className={styles.fullTopicGrid}>{studyCurriculum.map((unit) => <article key={unit.id} className={styles.topicCard}><span>{unit.id} · {trackNames[unit.track]}</span><h2>{unit.title}</h2><p>{unit.domain}</p><small>Planned learning unit · public map</small></article>)}</div>
    </section>
    <footer className={styles.footer}><p>ILAMA BLOOM · STUDY</p><Link href="/study">Back to Study overview ↗</Link></footer>
  </main>;
}

