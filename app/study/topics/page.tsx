import Link from "next/link";
import styles from "../Study.module.css";
import StudyTopicsBrowser from "./StudyTopicsBrowser";

export const metadata = {
  title: "All Study Topics — ILAMA BLOOM",
  description: "The complete public English register of 350 ILAMA BLOOM Study units.",
  alternates: { canonical: "https://www.ilamabloom.com/study/topics" },
};

export default function StudyTopicsPage() {
  return <main className={styles.page}>
    <header className={styles.header}><Link href="/study" className={styles.wordmark}>ILAMA BLOOM <span>STUDY</span></Link><nav aria-label="Study navigation"><Link href="/study#curriculum">Curriculum</Link><Link href="/study/topics">All topics</Link></nav><span className={styles.headerMeta}>350 ENGLISH UNITS</span></header>
    <section className={styles.topicSection} aria-labelledby="all-topics-title">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>PUBLIC REGISTER · 350 UNITS</p><h1 id="all-topics-title">The complete <em>learning field.</em></h1></div><p>Browse the canonical, clinically reviewed Study register by track and domain. Detailed objectives, cases, examiner rubrics and media are being staged from the authorised source set.</p></div>
      <StudyTopicsBrowser />
    </section>
    <footer className={styles.footer}><p>ILAMA BLOOM · STUDY</p><Link href="/study">Back to Study overview ↗</Link></footer>
  </main>;
}

