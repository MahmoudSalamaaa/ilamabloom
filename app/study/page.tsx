import Link from "next/link";
import styles from "./Study.module.css";
import { curriculumTotals, studyCurriculum } from "./curriculum";

export const metadata = {
  title: "Study — ILAMA BLOOM",
  description: "A public English medical-learning map for paediatric communication, clinical examination and reasoning.",
  alternates: { canonical: "https://www.ilamabloom.com/study" },
};

const academyUrl = "https://academy.ilamabloom.com/study";

const tracks = [
  { code: "COM", count: 100, title: "Communication & Talking OSCE", copy: "Explain, listen, empathise and structure difficult clinical conversations." },
  { code: "CLN", count: 110, title: "Clinical Examination", copy: "Build safe, repeatable examination patterns from first look to focused findings." },
  { code: "VID", count: 50, title: "Video Interpretation", copy: "Recognise movement, behaviour, breathing and developmental signals." },
  { code: "DEV", count: 40, title: "Development", copy: "Connect developmental milestones with context, observation and safeguarding." },
  { code: "HMX", count: 50, title: "History & Management", copy: "Turn a clinical story into priorities, differentials and safe next steps." },
];

const featuredTopics = studyCurriculum.slice(0, 9).map((unit) => [unit.track, unit.title, `${unit.domain} · ${unit.title} — a structured English learning unit with objectives, practice and review.`]);

export default function StudyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="ILAMA BLOOM home">ILAMA BLOOM <span>STUDY</span></Link>
        <nav aria-label="Study navigation"><Link href="#curriculum">Curriculum</Link><Link href="#topics">Topics</Link><Link href="#safety">Standards</Link></nav>
        <span className={styles.headerMeta}>ENGLISH MEDICAL EDUCATION</span>
      </header>

      <section className={styles.hero} aria-labelledby="study-title">
        <div className={styles.heroCopy}><p className={styles.eyebrow}>STUDY · A PUBLIC MAP FOR CLINICAL LEARNING</p><h1 id="study-title">Learn to make the next conversation <em>clearer.</em></h1><p className={styles.lede}>A structured English learning space for paediatric communication, examination, development, video interpretation and clinical reasoning.</p><div className={styles.heroActions}><a href="#curriculum" className={styles.primary}>Explore the curriculum <span>↘</span></a><a href={academyUrl} className={styles.secondary} target="_blank" rel="noreferrer">Authorised Academy access <span>↗</span></a></div><p className={styles.draftNote}>Public visitor guide. Full Academy workspace is restricted to authorised users.</p></div>
        <div className={styles.heroIndex} aria-label="Curriculum total"><strong>{studyCurriculum.length}</strong><span>canonical learning<br />units</span></div>
      </section>

      <section className={styles.visitorNote} aria-labelledby="visitor-note-title"><div><p className={styles.eyebrow}>For visitors first</p><h2 id="visitor-note-title">Start with the map.</h2></div><p>This public Study experience lets visitors understand the learning architecture and browse representative topics. Medical teaching is presented in English for clarity and consistency.</p><p>Clinical content is educational, not medical advice. Topic-level release requires source tracking, current evidence review and named clinical ownership.</p></section>

      <section id="curriculum" className={styles.curriculum} aria-labelledby="curriculum-title"><div className={styles.sectionIntro}><div><p className={styles.eyebrow}>01 / The curriculum map</p><h2 id="curriculum-title">Five rooms.<br /><em>One whole practice.</em></h2></div><p>Every unit now has a stable code and domain in the canonical register. The public map shows the shape of the programme before deeper learning objects are released.</p></div><div className={styles.trackGrid}>{tracks.map((track) => <article key={track.code} className={styles.trackCard}><span className={styles.trackCode}>{track.code}</span><strong>{curriculumTotals[track.code]}</strong><h3>{track.title}</h3><p>{track.copy}</p><span className={styles.trackLine} /><small>Canonical register · {track.count} planned units</small></article>)}</div></section>

      <section id="topics" className={styles.topicSection} aria-labelledby="topics-title"><div className={styles.sectionIntro}><div><p className={styles.eyebrow}>02 / Featured topics</p><h2 id="topics-title">Browse the <em>learning field.</em></h2></div><p>These representative topic cards show how Study moves from recognition to communication, action and reflection.</p></div><div className={styles.topicGrid}>{featuredTopics.map(([track, title, copy]) => <article key={title} className={styles.topicCard}><span>{track}</span><h3>{title}</h3><p>{copy}</p><a href={academyUrl} target="_blank" rel="noreferrer">Open authorised learning ↗</a></article>)}</div></section>

      <section id="safety" className={styles.safety} aria-labelledby="safety-title"><div><p className={styles.eyebrow}>03 / Learning standards</p><h2 id="safety-title">Practice with care.</h2></div><div className={styles.safetyGrid}><article><b>01</b><h3>English medical copy</h3><p>The public medical-learning layer uses consistent English terminology so the learner can focus on meaning and clinical communication.</p></article><article><b>02</b><h3>Separate role and examiner</h3><p>Future simulations keep the patient role, clinical facts and examiner feedback as separate layers.</p></article><article><b>03</b><h3>Review before release</h3><p>Medical claims, thresholds and safety instructions require current evidence and named review ownership.</p></article></div></section>

      <footer className={styles.footer}><p>ILAMA BLOOM · STUDY</p><Link href="/">Return to ILAMA BLOOM ↗</Link></footer>
    </main>
  );
}

