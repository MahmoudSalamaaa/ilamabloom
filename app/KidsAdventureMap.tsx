import styles from "./KidsAdventureMap.module.css";

type World = { name: string; nameAr: string; icon: string; note: string; noteAr: string; tone: string };

const worlds: World[] = [
  { name: "Food Garden", nameAr: "حديقة الطعام", icon: "✿", note: "Notice what grows, where it comes from, and how families enjoy it.", noteAr: "اكتشف ما الذي ينمو، وأين يبدأ، وكيف تستمتع به العائلات.", tone: "garden" },
  { name: "Move Mountain", nameAr: "جبل الحركة", icon: "⌁", note: "Find playful ways to move, pause, and try again in your own way.", noteAr: "اكتشف طرقًا مرحة للحركة والراحة والمحاولة بطريقتك.", tone: "move" },
  { name: "Body Bay", nameAr: "خليج الجسد", icon: "≈", note: "Meet body signals, senses, and everyday energy with kindness.", noteAr: "تعرّف إلى إشارات الجسد والحواس والطاقة اليومية بلطف.", tone: "body" },
  { name: "Sleepy Moon", nameAr: "قمر الراحة", icon: "☾", note: "Explore how rest and sleep fit into a growing day.", noteAr: "اكتشف كيف تدخل الراحة والنوم في يوم مليء بالنمو.", tone: "sleep" },
  { name: "Kitchen Lab", nameAr: "معمل المطبخ", icon: "⌂", note: "Bring familiar foods, questions, and family stories together.", noteAr: "اجمع الأطعمة المألوفة والأسئلة وحكايات العائلة.", tone: "kitchen" },
];

export default function KidsAdventureMap({ ar }: { ar: boolean }) {
  return (
    <section className={styles.map} dir={ar ? "rtl" : "ltr"} aria-labelledby="kids-adventure-map-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>{ar ? "خريطة المغامرة · عالم الأطفال" : "THE ADVENTURE MAP · KIDS WORLD"}</p>
        <h2 id="kids-adventure-map-title">{ar ? "خمس عوالم صغيرة للفضول الكبير." : "Five little worlds for big curiosity."}</h2>
        <p>{ar ? "خريطة عائلية تجمع الطعام والحركة والجسد والراحة والمطبخ — بلا أحكام أو مقارنة." : "A family map for food, movement, body, rest, and the kitchen — without judgement or comparison."}</p>
      </div>
      <ol className={styles.worlds} aria-label={ar ? "عوالم المغامرة الخمسة" : "The five adventure worlds"}>
        {worlds.map((world, index) => (
          <li className={`${styles.world} ${styles[world.tone]}`} key={world.name}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.icon} aria-hidden="true">{world.icon}</span>
            <h3>{ar ? world.nameAr : world.name}</h3>
            <p>{ar ? world.noteAr : world.note}</p>
          </li>
        ))}
      </ol>
      <p className={styles.note}>{ar ? "هذه خريطة للتعلّم والاستكشاف؛ الأنشطة الموجودة تظل ضمن ألعاب الصفحة أدناه." : "This is a learning map; playable activities remain in the game collection below."}</p>
    </section>
  );
}
