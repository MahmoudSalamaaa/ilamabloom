export type StudyUnit = {
  id: string;
  track: "COM" | "CLN" | "VID" | "DEV" | "HMX";
  domain: string;
  sequence: number;
  title: string;
  status: "planned";
};

type Domain = { name: string; count: number; topics: string[] };

const plan: Record<StudyUnit["track"], Domain[]> = {
  COM: [
    { name: "Breaking bad news", count: 15, topics: ["Preparation and setting", "Warning shots", "Checking understanding", "Responding to emotion", "Silence and pacing", "Explaining uncertainty", "Shared next steps", "Prognosis conversations", "Serious chronic diagnosis", "Unexpected deterioration", "Death and dying", "Sibling and family communication", "Safety-netting", "Follow-up planning", "Integrated station"] },
    { name: "Diagnosis and treatment explanations", count: 20, topics: ["New diagnosis", "Tests and results", "Medication explanation", "Inhaler technique", "Antibiotics", "Surgery", "Hospital admission", "Discharge plan", "Side effects", "Adherence", "Long-term condition", "Rare disease", "Genetic result", "Uncertainty", "Risk and benefit", "Alternative options", "Red flags", "Written information", "Teach-back", "Integrated station"] },
    { name: "Consent and shared decisions", count: 10, topics: ["Consent foundations", "Capacity and assent", "Child-centred consent", "Parental responsibility", "Benefits and risks", "Alternatives", "Refusal", "Emergency treatment", "Documentation", "Integrated station"] },
    { name: "Difficult conversations", count: 12, topics: ["Anger", "Complaint", "Blame", "Denial", "Distrust", "Language barrier", "Cultural difference", "Safeguarding disclosure", "Conflict between carers", "Repeated attendance", "Remote consultation", "Integrated station"] },
    { name: "Empathy and rapport", count: 10, topics: ["Opening", "Agenda setting", "Active listening", "Empathic reflection", "Normalising", "Checking concerns", "Child-friendly language", "Non-verbal communication", "Closing", "Integrated station"] },
    { name: "Ethics, confidentiality and safeguarding", count: 12, topics: ["Confidentiality", "Gillick competence", "Safeguarding threshold", "Neglect", "Physical abuse", "Sexual abuse", "Online risk", "Domestic abuse", "Information sharing", "Professional boundaries", "Disagreement", "Integrated station"] },
    { name: "Colleague, student and handover", count: 11, topics: ["SBAR handover", "Escalation", "Feedback", "Difficult colleague", "Teaching", "Supervision", "Team conflict", "Multidisciplinary meeting", "Referral letter", "Telephone advice", "Integrated station"] },
    { name: "Adolescent communication", count: 10, topics: ["Private time", "Confidentiality limits", "Mental health", "Substances", "Sexual health", "Eating concerns", "Risk assessment", "Chronic illness", "Transition", "Integrated station"] },
  ],
  CLN: [
    { name: "Neurology", count: 22, topics: ["General neurological screen", "Cranial nerves", "Motor system", "Tone", "Power", "Reflexes", "Coordination", "Gait", "Sensory examination", "Cerebellar signs", "Upper motor neuron pattern", "Lower motor neuron pattern", "Seizure assessment", "Headache assessment", "Developmental neurology", "Neurocutaneous signs", "Infant neurological exam", "Coma assessment", "Weakness", "Ataxia", "Regression", "Integrated station"] },
    { name: "Cardiology", count: 20, topics: ["General inspection", "Pulse", "Blood pressure", "Precordial examination", "Heart sounds", "Murmurs", "Heart failure", "Cyanosis", "Clubbing", "Perfusion", "ECG approach", "Congenital heart disease", "Palpitations", "Syncope", "Chest pain", "Rheumatic disease", "Post-operative review", "Infant examination", "Exercise tolerance", "Integrated station"] },
    { name: "Respiratory", count: 15, topics: ["Inspection", "Work of breathing", "Respiratory rate", "Oxygen assessment", "Chest expansion", "Percussion", "Auscultation", "Wheeze", "Stridor", "Crackles", "Asthma review", "Cystic fibrosis", "Respiratory failure", "Infant examination", "Integrated station"] },
    { name: "Abdominal", count: 15, topics: ["Inspection", "Palpation", "Liver", "Spleen", "Kidneys", "Masses", "Ascites", "Bowel sounds", "Hernia", "Jaundice", "Acute abdomen", "Inflammatory bowel disease", "Nutrition and growth", "Infant abdomen", "Integrated station"] },
    { name: "Musculoskeletal", count: 15, topics: ["pGALS", "pREMS", "Gait", "Hip", "Knee", "Ankle", "Shoulder", "Elbow", "Wrist and hand", "Spine", "Joints in JIA", "Limp", "Muscle weakness", "Bone pain", "Integrated station"] },
    { name: "Syndromes", count: 13, topics: ["Dysmorphism approach", "Down syndrome", "Turner syndrome", "Marfan pattern", "Noonan pattern", "Neurofibromatosis", "Skeletal dysplasia", "Connective tissue signs", "Genetic examination", "Growth pattern", "Developmental phenotype", "Photographic description", "Integrated station"] },
    { name: "General examination", count: 10, topics: ["First impression", "Growth and nutrition", "Hydration", "Pallor and jaundice", "Rash", "Lymph nodes", "Temperature", "Pain assessment", "Safeguarding observation", "Integrated station"] },
  ],
  VID: [
    { name: "Neurology video", count: 12, topics: ["Seizure description", "Abnormal movements", "Ataxia", "Gait", "Weakness", "Tone", "Tremor", "Regression", "Eye movements", "Infant behaviour", "Cerebral palsy pattern", "Integrated interpretation"] },
    { name: "Respiratory video", count: 10, topics: ["Work of breathing", "Wheeze", "Stridor", "Cough", "Apnoea", "Cyanosis", "Exercise limitation", "Inhaler use", "Respiratory distress", "Integrated interpretation"] },
    { name: "Development video", count: 10, topics: ["Gross motor", "Fine motor", "Language", "Social interaction", "Play", "Attention", "Hearing response", "Vision", "Adaptive skills", "Integrated interpretation"] },
    { name: "Syndrome video", count: 10, topics: ["Facial features", "Posture", "Hands and feet", "Gait phenotype", "Behavioural phenotype", "Growth phenotype", "Skin signs", "Joint laxity", "Dysmorphism description", "Integrated interpretation"] },
    { name: "Other video", count: 8, topics: ["Feeding", "Swallowing", "Pain behaviour", "Communication", "Safeguarding context", "Functional mobility", "Parent-child interaction", "Integrated interpretation"] },
  ],
  DEV: [
    { name: "Gross motor", count: 8, topics: ["Milestones", "Head control", "Sitting", "Standing", "Walking", "Running", "Asymmetry", "Integrated assessment"] },
    { name: "Fine motor", count: 6, topics: ["Reach and grasp", "Transfer", "Pincer grip", "Drawing", "Tool use", "Integrated assessment"] },
    { name: "Language and hearing", count: 6, topics: ["Pre-verbal communication", "First words", "Sentences", "Understanding", "Hearing concern", "Integrated assessment"] },
    { name: "Social and adaptive", count: 6, topics: ["Attachment", "Social reciprocity", "Play", "Self-care", "School function", "Integrated assessment"] },
    { name: "Global delay", count: 5, topics: ["Recognition", "History", "Examination", "Investigation", "Family plan"] },
    { name: "Neurodevelopment", count: 5, topics: ["Autism", "ADHD", "Learning difficulty", "Behaviour", "Neurodiversity"] },
    { name: "Assessment", count: 4, topics: ["Developmental history", "Standardised tools", "Context and culture", "Integrated assessment"] },
  ],
  HMX: [
    { name: "Respiratory and cardiac", count: 10, topics: ["Breathlessness", "Cough", "Wheeze", "Chest pain", "Syncope", "Palpitations", "Murmur", "Cyanosis", "Exercise tolerance", "Integrated management"] },
    { name: "Neurodevelopment", count: 10, topics: ["Headache", "Seizure", "Weakness", "Developmental concern", "Regression", "Behaviour", "School difficulty", "Sleep", "Neurodisability", "Integrated management"] },
    { name: "GI, renal and endocrine", count: 10, topics: ["Abdominal pain", "Vomiting", "Diarrhoea", "Constipation", "Urinary symptoms", "Oedema", "Polyuria", "Growth failure", "Puberty", "Integrated management"] },
    { name: "Infections and acute care", count: 8, topics: ["Fever", "Sepsis", "Rash", "Dehydration", "Limp", "Acute pain", "Immunisation", "Integrated management"] },
    { name: "Neonatal, growth and nutrition", count: 6, topics: ["Newborn concern", "Feeding", "Weight faltering", "Short stature", "Obesity", "Integrated management"] },
    { name: "Complex care and safeguarding", count: 6, topics: ["Complex child", "Disability", "Palliative care", "Safeguarding", "Family stress", "Integrated management"] },
  ],
};

export const studyCurriculum: StudyUnit[] = Object.entries(plan).flatMap(([track, domains]) => {
  let sequence = 0;
  return domains.flatMap((domain) => domain.topics.map((title) => ({ id: `${track}-${String(++sequence).padStart(3, "0")}`, track: track as StudyUnit["track"], domain: domain.name, sequence, title, status: "planned" as const })));
});

export const curriculumTotals = Object.fromEntries(Object.keys(plan).map((track) => [track, studyCurriculum.filter((unit) => unit.track === track).length]));

if (studyCurriculum.length !== 350) throw new Error(`Study curriculum must contain 350 units; found ${studyCurriculum.length}`);

