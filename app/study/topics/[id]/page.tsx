import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../Study.module.css";
import { studyCurriculum } from "../../curriculum";

const trackNames = { COM: "Communication & Talking OSCE", CLN: "Clinical Examination", VID: "Video Interpretation", DEV: "Development", HMX: "History & Management" } as const;

export function generateStaticParams() {
  return studyCurriculum.map((unit) => ({ id: unit.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unit = studyCurriculum.find((item) => item.id === id);
  return { title: unit ? `${unit.id} ${unit.title} — ILAMA BLOOM Study` : "Study topic — ILAMA BLOOM", description: unit ? `${unit.title}: a public English Study learning unit in ${unit.domain}.` : "ILAMA BLOOM Study topic." };
}

export default async function StudyTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unit = studyCurriculum.find((item) => item.id === id);
  if (!unit) notFound();

  return <main className={styles.page}>
    <header className={styles.header}><Link href="/study" className={styles.wordmark}><img src="/ilama-bloom-logo.svg" alt="ILAMA BLOOM" /><span>STUDY</span></Link><nav aria-label="Study navigation"><Link href="/study">Overview</Link><Link href="/study/topics">All topics</Link></nav><span className={styles.headerMeta}>{unit.id}</span></header>
    <section className={styles.topicDetailHero} aria-labelledby="topic-title"><p className={styles.eyebrow}>{unit.id} · {trackNames[unit.track]}</p><h1 id="topic-title">{unit.title}</h1><p>{unit.domain}</p></section>
    <section className={styles.topicDetailBody}><div className={styles.topicStatus}><span className={styles.eyebrow}>PUBLIC RELEASE STATUS</span><strong>Clinically reviewed · publication preparation</strong><p>This topic belongs to the medically reviewed ILAMA BLOOM source set, with current online evidence checks and authorised clinical ownership recorded. The public map is the controlled entry point while the richer learning objects are staged.</p></div><div className={styles.topicDetailGrid}><article><b>Track</b><h2>{trackNames[unit.track]}</h2><p>English medical education for visitors and learners.</p></article><article><b>Domain</b><h2>{unit.domain}</h2><p>Organised within the canonical 350-unit register.</p></article><article><b>Next layer</b><h2>Structured learning object</h2><p>Objectives, practice, cases and examiner materials are being staged from the reviewed source set.</p></article></div><Link href="/study/topics" className={styles.secondaryLight}>← Back to all topics</Link></section>
    <footer className={styles.footer}><p>ILAMA BLOOM · STUDY</p><Link href="/study">Study overview ↗</Link></footer>
  </main>;
}

