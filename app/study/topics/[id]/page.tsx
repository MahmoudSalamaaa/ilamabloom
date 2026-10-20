import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../Study.module.css";
import { studyCurriculum } from "../../curriculum";

const trackNames = { COM: "Communication & Talking OSCE", CLN: "Clinical Examination", VID: "Video Interpretation", DEV: "Development", HMX: "History & Management" } as const;

const trackGuidance = {
  COM: ["Frame the conversation", "Listen for the person’s priorities", "Close with a shared next step"],
  CLN: ["Prepare the patient and environment", "Use a consistent examination sequence", "Name findings before interpretation"],
  VID: ["Describe what is observable", "Separate observation from inference", "Choose a safe next question"],
  DEV: ["Start with context and strengths", "Observe function across settings", "Plan supportive follow-up"],
  HMX: ["Set the clinical priority", "Organise the story into a working picture", "Make the next step explicit"],
} as const;

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
  const position = studyCurriculum.findIndex((item) => item.id === unit.id);
  const previous = studyCurriculum[position - 1];
  const next = studyCurriculum[position + 1];
  const guidance = trackGuidance[unit.track];

  return <main className={styles.page}>
    <header className={styles.header}><Link href="/study" className={styles.wordmark}><img src="/ilama-bloom-logo.svg" alt="ILAMA BLOOM" /><span>STUDY</span></Link><nav aria-label="Study navigation"><Link href="/study">Overview</Link><Link href="/study/topics">All topics</Link></nav><span className={styles.headerMeta}>{unit.id}</span></header>
    <section className={styles.topicDetailHero} aria-labelledby="topic-title"><p className={styles.eyebrow}>{unit.id} · {trackNames[unit.track]}</p><h1 id="topic-title">{unit.title}</h1><p>{unit.domain}</p></section>
    <section className={styles.topicDetailBody}><div className={styles.topicStatus}><span className={styles.eyebrow}>PUBLIC RELEASE STATUS</span><strong>Clinically reviewed · publication preparation</strong><p>This topic belongs to the medically reviewed ILAMA BLOOM source set, with current online evidence checks and authorised clinical ownership recorded. The public map is the controlled entry point while the richer learning objects are staged.</p></div><div className={styles.topicDetailGrid}><article><b>Track</b><h2>{trackNames[unit.track]}</h2><p>English medical education for visitors and learners.</p></article><article><b>Domain</b><h2>{unit.domain}</h2><p>Organised within the canonical 350-unit register.</p></article><article><b>Register position</b><h2>{position + 1} / {studyCurriculum.length}</h2><p>A stable place in the public Study sequence.</p></article></div><section className={styles.learningScaffold} aria-labelledby="learning-scaffold-title"><div><span className={styles.eyebrow}>A useful first pass</span><h2 id="learning-scaffold-title">What to practise here.</h2><p>This is a navigation scaffold, not a substitute for the full teaching object. Use it to orient your practice while the reviewed source material is prepared for public release.</p></div><ol>{guidance.map((item, index) => <li key={item}><span>0{index + 1}</span><strong>{item}</strong></li>)}</ol></section><div className={styles.topicPager}><div>{previous ? <Link href={`/study/topics/${previous.id}`}>← {previous.id} · {previous.title}</Link> : <span>Start of register</span>}</div><Link href="/study/topics" className={styles.secondaryLight}>All 350 topics</Link><div>{next ? <Link href={`/study/topics/${next.id}`}>{next.id} · {next.title} →</Link> : <span>End of register</span>}</div></div></section>
    <footer className={styles.footer}><p>ILAMA BLOOM · STUDY</p><Link href="/study">Study overview ↗</Link></footer>
  </main>;
}

