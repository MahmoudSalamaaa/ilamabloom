"use client";
import {useEffect,useState} from "react";
import {authClient} from "../../lib/auth/client";
type Food={id:string;name:string;category:string;portion:string;carbohydrate:string;source?:string;confidence?:string;reviewed_at?:string};
const empty:Food={id:"",name:"",category:"",portion:"",carbohydrate:"",source:"ILAMA BLOOM educational reference",confidence:"estimated"};
export default function AdminPage(){
 const {data:session}=authClient.useSession();
 const [foods,setFoods]=useState<Food[]>([]),[form,setForm]=useState<Food>(empty),[message,setMessage]=useState(""),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false);
 const load=()=>fetch("/api/admin/foods").then(async r=>{const d=await r.json();if(r.ok)setFoods(d.foods||[]);else setMessage("لا تملك صلاحية إدارة المحتوى.")}).catch(()=>setMessage("تعذر تحميل الأطعمة الآن.")).finally(()=>setLoading(false));
 useEffect(()=>{if(session)load();else setLoading(false)},[session]);
 const update=(key:keyof Food,value:string)=>setForm(current=>({...current,[key]:value}));
 const save=async(e:React.FormEvent)=>{e.preventDefault();setMessage("");setSaving(true);try{const r=await fetch("/api/admin/foods",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(form)});const d=await r.json();if(r.ok){setMessage("تم حفظ المرجع وتسجيل المراجع.");setForm(empty);load()}else setMessage(d.error||"تعذر الحفظ.")}catch{setMessage("تعذر الاتصال بقاعدة البيانات.")}finally{setSaving(false)}};
 const remove=async(id:string)=>{if(!confirm("هل تريد حذف هذا المرجع؟"))return;const r=await fetch("/api/admin/foods",{method:"DELETE",headers:{"content-type":"application/json"},body:JSON.stringify({id})});if(r.ok){setMessage("تم حذف المرجع.");load()}else setMessage("تعذر الحذف.")};
 if(!session)return <main className="adminPage" dir="rtl" lang="ar"><section className="adminCard"><small>إدارة المحتوى</small><h1>راجع المراجع.</h1><p>سجّل الدخول بالحساب المسموح له قبل تعديل بيانات دليل الأكل.</p><a href="/auth/sign-in?next=%2Fadmin">تسجيل الدخول</a></section></main>;
 return <main className="adminPage" dir="rtl" lang="ar"><section className="adminCard"><small>إدارة · دليل الأكل</small><h1>راجع المراجع.</h1><p>كل تعديل يُحفظ في قاعدة بيانات إيلاما بلوم مع بريد الحساب الذي راجعه وتاريخ المراجعة.</p><form onSubmit={save} aria-label="نموذج مرجع طعام">
  <label>المعرّف<input required value={form.id} onChange={e=>update("id",e.target.value)} placeholder="مثل: koshari" /></label>
  <label>اسم الطعام<input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="كشري" /></label>
  <label>الفئة<input required value={form.category} onChange={e=>update("category",e.target.value)} placeholder="Mixed dishes" /></label>
  <label>الكمية<input required value={form.portion} onChange={e=>update("portion",e.target.value)} placeholder="طبق واحد" /></label>
  <label>الكربوهيدرات<input required value={form.carbohydrate} onChange={e=>update("carbohydrate",e.target.value)} placeholder="≈ 70–90 جم" /></label>
  <label>المصدر<input value={form.source||""} onChange={e=>update("source",e.target.value)} placeholder="بطاقة المنتج / مرجع تعليمي" /></label>
  <label>درجة الثقة<select value={form.confidence||"estimated"} onChange={e=>update("confidence",e.target.value)}><option value="estimated">تقدير تعليمي</option><option value="label">من بطاقة المنتج</option><option value="variable">متغير حسب الوصفة</option></select></label>
  <button type="submit" disabled={saving}>{saving?"جارٍ الحفظ…":"حفظ المرجع"}</button>
 </form><p className="adminMessage" role="status">{message}</p><div className="adminFoods">{loading?<p>جارٍ تحميل الأطعمة…</p>:foods.length?foods.map(f=><article key={f.id}><div><b>{f.name}</b><small>{f.category} · {f.portion} · {f.carbohydrate}</small><small>{f.source||"مرجع إيلاما بلوم"} · {f.confidence||"estimated"}</small></div><button type="button" onClick={()=>setForm({...empty,...f})}>تعديل</button><button type="button" onClick={()=>remove(f.id)}>حذف</button></article>):<p>لا توجد مراجع بعد. أضف أول مرجع من النموذج.</p>}</div></section></main>;
}

