'use client';
import {useState} from 'react';
import Link from 'next/link';
import {AlertTriangle,CheckCircle2,Loader2} from 'lucide-react';

export default function BookingForm({talent,talentName,types}:{talent:string;talentName:string;types:string[]}){
  const [sending,setSending]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setSending(true);setError('');
    const form=e.currentTarget;
    try{
      const res=await fetch('/api/influencers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'booking',talent,...Object.fromEntries(new FormData(form).entries())})});
      const data=await res.json().catch(()=>({error:'Something went wrong.'}));
      if(!res.ok)throw new Error(data.error||'Something went wrong.');
      setDone(true);form.reset();
    }catch(err){setError(err instanceof Error?err.message:'Something went wrong.')}
    finally{setSending(false)}
  }
  if(done)return <div className="tz-done" role="status"><CheckCircle2 size={34}/><h3>Booking request received</h3><p>Thank you. Our team will contact you about availability and the next steps for {talentName}.</p><button type="button" className="tz-btn ghost" onClick={()=>setDone(false)}>Send another request</button></div>;
  return <form className="tz-form" onSubmit={submit}>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field"/>
    <div className="tz-row">
      <label>Your name<input required name="name" autoComplete="name" maxLength={100}/></label>
      <label>Company / brand <small>Optional</small><input name="company" autoComplete="organization" maxLength={150}/></label>
    </div>
    <div className="tz-row">
      <label>Email<input required type="email" name="email" autoComplete="email" maxLength={254}/></label>
      <label>Phone / WhatsApp<input required type="tel" name="phone" inputMode="tel" autoComplete="tel" maxLength={25} placeholder="+92 3XX XXXXXXX"/></label>
    </div>
    <div className="tz-row">
      <label>Booking for<select required name="bookingType" defaultValue=""><option value="" disabled>Choose one</option>{types.map(t=><option key={t}>{t}</option>)}</select></label>
      <label>Event date <small>Optional</small><input type="date" name="eventDate"/></label>
    </div>
    <label>City / venue <small>Optional</small><input name="city" maxLength={120} placeholder="e.g. Islamabad, Serena Hotel"/></label>
    <label>Tell us about the booking<textarea required name="details" minLength={10} maxLength={1500} rows={4} placeholder="Event or campaign, audience, timings, budget range…"/></label>
    {error&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {error}</p>}
    <button className="tz-btn" type="submit" disabled={sending}>{sending?<><Loader2 size={16} className="spin"/> Sending…</>:`Book ${talentName}`}</button>
    <p className="tz-note">Your details go to the Inventive Clicks talent team and are used only for this booking. See our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
  </form>;
}
