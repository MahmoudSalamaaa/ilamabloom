"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {useAdventureState,useKidsJourney} from "./KidsJourney";
import {moveGoal} from "../lib/kids/gameplay";
import PoseMotionTracker from "./PoseMotionTracker";
import {OptionalCamera,type CameraState} from "../lib/kids/camera";
import styles from "./MoveAdventures.module.css";
type L={ar:string;en:string};
type Move={id:string;icon:string;title:L;instruction:L;alternative:L;goal:number;action:L};
const games:Move[]=[
{id:"butterfly",icon:"🦋",title:{ar:"صيد الفراشات",en:"Butterfly Garden"},instruction:{ar:"افرد دراعك يمين وشمال براحتك.",en:"Reach gently left and right."},alternative:{ar:"حرك إيد واحدة أو بص للاتجاه.",en:"Move one hand or look toward a side."},goal:6,action:{ar:"فراشة وصلت للزهرة",en:"Butterfly reached a flower"}},
{id:"forest",icon:"🌳",title:{ar:"مغامرة الغابة",en:"Forest Adventure"},instruction:{ar:"امشي في مكانك أو حرك رجليك وأنت قاعد.",en:"March in place or move your legs while seated."},alternative:{ar:"حرك دراعك بالتبادل.",en:"Alternate your arms."},goal:8,action:{ar:"خطوة في الغابة",en:"Forest step"}},
{id:"dance",icon:"🎵",title:{ar:"ارقص مع إيلاما",en:"Dance with Ilama"},instruction:{ar:"اتحرك على الإيقاع بطريقتك.",en:"Move to the rhythm your own way."},alternative:{ar:"حرك إيديك أو كتافك.",en:"Move hands or shoulders."},goal:8,action:{ar:"حركة رقص",en:"Dance move"}},
{id:"fish",icon:"🐟",title:{ar:"اتحرك زي السمكة",en:"Swim Like a Fish"},instruction:{ar:"حرك دراعاتك برفق كأنك بتسبح.",en:"Gently move your arms like swimming."},alternative:{ar:"حرك كفوف إيديك.",en:"Move your hands."},goal:6,action:{ar:"موجة جديدة",en:"New wave"}},
{id:"flower",icon:"🌻",title:{ar:"زهرة الشمس",en:"Growing Sunflower"},instruction:{ar:"افرد جسمك وارفع دراعاتك بالراحة من غير ألم.",en:"Stretch comfortably and lift your arms without pain."},alternative:{ar:"افتح كفوفك وارفع إيد واحدة.",en:"Open your hands or lift one arm."},goal:5,action:{ar:"الزهرة كبرت",en:"Flower grew"}},
{id:"harvest",icon:"🧺",title:{ar:"رقصة الحصاد",en:"Harvest Dance"},instruction:{ar:"امد إيدك ناحية المحصول الخيالي.",en:"Reach gently for imaginary crops."},alternative:{ar:"مد إيد واحدة وأنت قاعد.",en:"Reach with one arm while seated."},goal:6,action:{ar:"محصول اتحصد",en:"Crop collected"}},
{id:"mirror",icon:"🪞",title:{ar:"مراية إيلامو",en:"Mirror Me"},instruction:{ar:"قلد الحركة: إيد فوق، إيد جنب، خطوة بسيطة.",en:"Copy: arm up, arm sideways, a small step."},alternative:{ar:"قلد بإيد واحدة أو حركة رأس.",en:"Copy with one arm or a head movement."},goal:6,action:{ar:"حركة اتقلدت",en:"Move copied"}},
{id:"family",icon:"👨‍👩‍👧",title:{ar:"حفلة حركة الأسرة",en:"Family Movement Party"},instruction:{ar:"اختاروا حركة لطيفة واعملوها سوا.",en:"Choose a gentle move and do it together."},alternative:{ar:"صفقوا أو حركوا إيديكم سوا.",en:"Clap or move hands together."},goal:6,action:{ar:"حركة جماعية",en:"Family move"}}
];
function MovementScene({game,count,goal,running,ar}:{game:Move;count:number;goal:number;running:boolean;ar:boolean}){
 const prompts:Record<string,[string,string][]>= {
  butterfly:[['مد إيدك ناحية اليمين براحتك','Reach gently to your right'],['مد إيدك ناحية الشمال براحتك','Reach gently to your left']],
  forest:[['خطوة صغيرة أو حركة دراع','A small step or an arm move'],['بدّل للناحية التانية لو يناسبك','Try the other side if comfortable']],
  dance:[['اختار حركة تحبها','Choose a move you enjoy'],['حركة إيد أو كتف تكفي','A hand or shoulder move is enough']],
  fish:[['حرك إيديك كموجة هادية','Move your hands like a gentle wave'],['جرّب موجة تانية بطريقتك','Try another wave your way']],
  flower:[['افتح إيديك كأن الزهرة بتفتح','Open your hands like a flower'],['ارفع إيد واحدة لو تحب','Lift one hand if you like']],
  harvest:[['امد إيدك للمحصول الخيالي','Reach toward an imaginary crop'],['حركة بسيطة تكفي','A small movement is enough']],
  mirror:[['ارفع إيد واحدة برفق','Gently lift one hand'],['مد إيد واحدة للجانب','Reach one hand to the side']],
  family:[['اختاروا حركة بسيطة سوا','Choose a simple move together'],['كل واحد يتحرك بالطريقة المناسبة له','Everyone can move their own way']]
 };
 const coach=prompts[game.id][count%2];
 return <div className={styles.scene} data-kind={game.id} data-running={running&&count<goal} aria-label={ar?'مشهد الحركة':'Movement scene'} role="group"><div className={styles.sceneSymbol} aria-hidden="true">{game.icon}</div><img className={styles.guide} src={game.id==='mirror'||game.id==='forest'?'/kids/ilamo.webp':'/kids/ilama.webp'} alt=""/><div className={styles.sceneGoal} aria-hidden="true">{Array.from({length:goal},(_,i)=><span key={i} data-found={i<count}>{i<count?'✓':game.icon}</span>)}</div><p className={styles.coach}>{count>=goal?(ar?'اكتشاف جميل! خد راحة براحتك.':'Lovely discovery! Rest whenever you like.'):(ar?coach[0]:coach[1])}</p></div>;
}
export default function MoveAdventures({ar,onComplete}:{ar:boolean;onComplete?:()=>void}){
 const journey=useKidsJourney(),[pace,setPace]=useState<'gentle'|'regular'|'extended'>(journey.active?.age_band==='under-8'?'gentle':'regular');
 const [guardianConfirmed,setGuardianConfirmed]=useState(false),[tracking,setTracking]=useState(false),[videoNode,setVideoNode]=useState<HTMLVideoElement|null>(null),[selected,setSelected]=useState<Move|null>(null),[count,setCount]=useState(0),[running,setRunning]=useState(false),[mode,setMode]=useState<'manual'|'camera'>('manual'),[camera,setCamera]=useState<CameraState>('off');
 const world=useRef<HTMLElement|null>(null);
 const video=useRef<HTMLVideoElement|null>(null),cameraSession=useRef<OptionalCamera|null>(null);
 const makeCamera=()=>new OptionalCamera(()=>navigator.mediaDevices?.getUserMedia?navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false}):Promise.reject(Error('unavailable')),setCamera,()=>{setTracking(false);setRunning(false);if(video.current)video.current.srcObject=null});
 if(!cameraSession.current)cameraSession.current=makeCamera();
 const attachVideo=useCallback((node:HTMLVideoElement|null)=>{video.current=node;setVideoNode(node)},[]),t=(x:L)=>ar?x.ar:x.en;
 const stopCamera=()=>{cameraSession.current?.stop();setTracking(false);if(video.current)video.current.srcObject=null;setVideoNode(null)};
 useEffect(()=>{if(!cameraSession.current)cameraSession.current=makeCamera();return()=>{cameraSession.current?.dispose();cameraSession.current=null;if(video.current)video.current.srcObject=null}},[]);
 useEffect(()=>{const hidden=()=>{if(document.hidden){setRunning(false);stopCamera()}};document.addEventListener('visibilitychange',hidden);return()=>document.removeEventListener('visibilitychange',hidden)},[]);
 useEffect(()=>{if(!world.current||!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(records=>{if(!records[0]?.isIntersecting){setRunning(false);stopCamera()}});observer.observe(world.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{const session=cameraSession.current,media=session?.stream;if(camera==='ready'&&videoNode&&media&&session){videoNode.srcObject=media;videoNode.play().catch(()=>{if(cameraSession.current===session&&session.stream===media&&video.current===videoNode){stopCamera();setCamera('error')}})}},[camera,videoNode]);
 const begin=(g:Move)=>{setGuardianConfirmed(false);setSelected(g);setCount(0);setRunning(false);stopCamera();setMode('manual')};
 const cameraOn=()=>cameraSession.current?.start(guardianConfirmed);
 const close=()=>{setRunning(false);stopCamera();setSelected(null)};
 const [completed,setCompleted,ready]=useAdventureState<string[]>('movement',[]),goal=selected?moveGoal(selected.goal,pace):1,finish=!!selected&&count>=goal;
 useEffect(()=>{if(finish&&selected){setCompleted(old=>old.includes(selected.id)?old:[...old,selected.id]);onComplete?.()}},[finish,onComplete]);
 useEffect(()=>{if(finish){setRunning(false);stopCamera()}},[finish]);
 const completeMove=()=>{if(selected&&running&&ready)setCount(n=>Math.min(goal,n+1))};
 return <section ref={world} dir={ar?'rtl':'ltr'} aria-label={ar?'مغامرات الحركة':'Movement adventures'} className={styles.world}>
 <h2>{ar?'💃 مغامرات إيلاما المتحركة':'💃 ILAMA Move Adventures'}</h2><p>{ar?'ثماني ألعاب تشجعك تتحرك بطريقتك. مفيش سباق أو خسارة.':'Eight movement adventures. Move your way, with no races or penalties.'}</p>
 {!selected&&<fieldset className={styles.difficulty}><legend>{ar?'اختار طول الجولة، بدون مقارنة':'Choose a round length, without comparison'}</legend>{(['gentle','regular','extended'] as const).map(p=><button type="button" key={p} aria-pressed={pace===p} onClick={()=>setPace(p)}>{p==='gentle'?(ar?'قصيرة وهادئة':'Short and gentle'):p==='extended'?(ar?'جولة أطول لو حابب':'Longer if you like'):(ar?'جولة عادية':'Regular round')}</button>)}</fieldset>}
 {!selected?<div className={styles.games}>{games.map(g=><button key={g.id} type="button" disabled={!ready} onClick={()=>begin(g)}><span className={styles.gameIcon} aria-hidden="true">{g.icon}</span><span className={styles.gameTitle}>{t(g.title)} {completed.includes(g.id)?'🌟':''}</span><small>{t(g.instruction)}</small></button>)}</div>:<article className={styles.activity}>
 <button type="button" onClick={close}>{ar?'← كل الألعاب':'← All games'}</button><h3>{selected.icon} {t(selected.title)}</h3><p>{t(selected.instruction)}</p><p className={styles.alternative}><strong>{ar?'بديل مناسب: ':'Accessible alternative: '}</strong>{t(selected.alternative)}</p>
 <MovementScene game={selected} count={count} goal={goal} running={running} ar={ar}/><p className={styles.sceneHint}>{ar?'الحركة الصغيرة أو التأكيد اليدوي كفاية. تقدر تاخد راحة في أي وقت.':'A small movement or manual confirmation is enough. You can pause anytime.'}</p>
 <div className={styles.choices}><button type="button" aria-pressed={mode==='manual'} onClick={()=>{setMode('manual');stopCamera()}}>{ar?'العب بدون كاميرا':'Play without camera'}</button><button type="button" disabled={finish} aria-pressed={mode==='camera'} onClick={()=>{setRunning(false);setMode('camera')}}>{ar?'معاينة الكاميرا (اختياري)':'Camera preview (optional)'}</button></div>
 {mode==='camera'&&<div className={styles.camera}><p>{ar?'فيديو الكاميرا بيتم التعامل معاه على جهازك. تتبع الحركة تجريبي وبيحمّل ملفات نموذج خارجي. مفيش تسجيل أو رفع فيديو في الكود. لازم موافقة ولي الأمر، واللعب اليدوي متاح.':'Camera video stays on this device; optional experimental pose tracking downloads third-party model files. No recording or video upload is implemented. A guardian should approve camera use. Manual play remains available.'}</p>
 {(camera==='off'||camera==='error')&&!finish&&<><label><input type="checkbox" checked={guardianConfirmed} onChange={e=>setGuardianConfirmed(e.target.checked)}/>{ar?'أنا ولي الأمر وأوافق على استخدام الكاميرا اختياريًا':'I am the guardian and consent to optional camera use'}</label><button type="button" disabled={!guardianConfirmed} onClick={cameraOn}>{ar?'شغّل الكاميرا بموافقة ولي الأمر':'Enable camera with guardian consent'}</button></>}
 {camera==='loading'&&<><p role="status">{ar?'جاري طلب الإذن. تقدر تلغي وتلعب بدون كاميرا.':'Requesting permission. You can cancel and play without a camera.'}</p><button type="button" onClick={()=>{setMode('manual');stopCamera()}}>{ar?'إلغاء طلب الكاميرا':'Cancel camera request'}</button></>}
 {camera==='error'&&<p role="status">{ar?'الكاميرا غير متاحة؛ اللعب بدونها شغال.':'Camera unavailable; camera-free play still works.'}</p>}
 {camera==='ready'&&<><video ref={attachVideo} autoPlay muted playsInline/><div className={styles.choices}><button type="button" aria-pressed={tracking} onClick={()=>setTracking(v=>!v)}>{tracking?(ar?'إيقاف تتبع الحركة':'Stop motion tracking'):(ar?'تشغيل تتبع الحركة':'Start motion tracking')}</button><button type="button" onClick={stopCamera}>{ar?'اقفل الكاميرا':'Turn camera off'}</button></div><PoseMotionTracker enabled={tracking&&running&&!finish} video={videoNode} kind={selected.id==='butterfly'?'reach':selected.id==='forest'?'march':selected.id==='dance'?'dance':selected.id==='fish'?'swim':selected.id==='flower'?'stretch':selected.id==='harvest'?'harvest':selected.id==='mirror'?'mirror':'family'} onMove={completeMove} onStatus={()=>{}} ar={ar}/></>}
 </div>}
 <div className={styles.feedback}><div role="status" aria-live="polite"><strong>{count} / {goal}</strong> · {count?t(selected.action):(ar?'خد وقتك':'Take your time')}</div><div className={styles.track} aria-hidden="true"><span style={{width:count/goal*100+'%'}}/></div></div>
 {finish?<div role="status" className={styles.finished}><h4>{ar?'أحسنت! خلصت المغامرة 🌟':'Adventure complete! 🌟'}</h4><p>{ar?'خد راحة واشرب مياه لو محتاج. مش لازم تبدأ لعبة تانية دلوقتي.':'Take a break and drink water if needed. There’s no need to start another game now.'}</p><button type="button" onClick={close}>{ar?'العودة للألعاب':'Back to games'}</button></div>:<div className={styles.choices}>{!running?<button type="button" className={styles.primary} disabled={!ready} onClick={()=>setRunning(true)}>{ar?'ابدأ الحركة':'Start moving'}</button>:<><button type="button" className={styles.primary} onClick={completeMove}>{ar?'✓ عملت الحركة':'✓ I did the move'}</button><button type="button" className={styles.pause} onClick={()=>{setRunning(false);stopCamera()}}>{ar?'استراحة':'Pause'}</button></>}</div>}
 </article>}
 <p className={styles.safety}>{ar?'اختار مساحة آمنة وخليك مع شخص بالغ لو محتاج. توقف عند الألم أو الدوخة. مفيش حركات إجبارية، والجلوس مسموح.':'Use a safe space and adult help when needed. Stop if you feel pain or dizzy. No mandatory movements; seated alternatives are welcome.'}</p>
 </section>;
}
