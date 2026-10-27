'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {AlertTriangle,CheckCircle2,Loader2,Sparkles,Megaphone} from 'lucide-react';
import {platforms,niches,followerBands,budgetBands} from '../lib/influencers';

type Kind='influencer'|'brand';

export default function InfluencerForms(){
  const [kind,setKind]=useState<Kind>('influencer');
  const [sending,setSending]=useState(false),[error,setError]=useState(''),[done,setDone]=useState<Kind|null>(null);

  // /influencers#brands opens the brand form directly.
  useEffect(()=>{const sync=()=>{if(location.hash==='#brands')setKind('brand');if(location.hash==='#join')setKind('influencer')};sync();addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync)},[]);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setSending(true);setError('');
    const form=e.currentTarget;const fd=new FormData(form);
    const body:Record<string,unknown>={type:kind,...Object.fromEntries(fd.entries())};
    if(kind==='brand')body.platforms=fd.getAll('platforms');
    try{
      const res=await fetch('/api/influencers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await res.json().catch(()=>({error:'Something went wrong.'}));
      if(!res.ok)throw new Error(data.error||'Something went wrong.');
      setDone(kind);form.reset();
    }catch(err){setError(err instanceof Error?err.message:'Something went wrong.')}
    finally{setSending(false)}
  }

  if(done)return <div className="influencer-done" role="status"><CheckCircle2 size={34}/><h3>{done==='influencer'?'Thanks for applying to the network!':'Thanks, we have your campaign brief!'}</h3><p>{done==='influencer'?'Our team reviews every profile. If your audience fits a current or upcoming campaign, we will contact you by email, phone or WhatsApp.':'Our influencer team will review your goals and get back to you with suitable creators and next steps.'}</p><button type="button" className="outline" onClick={()=>{setDone(null);setError('')}}>Send another</button></div>;

  return <div className="influencer-forms">
    <div className="tool-tabs" role="tablist" aria-label="Choose a form">
      <button role="tab" type="button" aria-selected={kind==='influencer'} onClick={()=>{setKind('influencer');setError('')}}><Sparkles size={16}/> I’m an influencer</button>
      <button role="tab" type="button" aria-selected={kind==='brand'} onClick={()=>{setKind('brand');setError('')}}><Megaphone size={16}/> I’m a brand</button>
    </div>
    <form key={kind} className="brief-form" onSubmit={submit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field"/>
      {kind==='brand'&&<div className="form-pair">
        <label>Company or brand<input required name="company" autoComplete="organization" maxLength={150} placeholder="Your brand name"/></label>
        <label>Website <small>Optional</small><input name="brandWebsite" inputMode="url" maxLength={300} placeholder="yourbrand.com"/></label>
      </div>}
      <div className="form-pair">
        <label>{kind==='brand'?'Your name':'Full name'}<input required name="name" autoComplete="name" maxLength={100} placeholder="Your name"/></label>
        <label>Email address<input required type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@example.com"/></label>
      </div>
      {kind==='influencer'?<>
        <div className="form-pair">
          <label>Phone / WhatsApp <small>Include country code</small><input required type="tel" name="phone" inputMode="tel" autoComplete="tel" maxLength={25} placeholder="+92 3XX XXXXXXX"/></label>
          <label>City and country<input name="location" autoComplete="address-level2" maxLength={100} placeholder="e.g. Lahore, Pakistan"/></label>
        </div>
        <div className="form-pair">
          <label>Main platform<select required name="platform" defaultValue=""><option value="" disabled>Choose a platform</option>{platforms.map(p=><option key={p}>{p}</option>)}</select></label>
          <label>Profile link<input required name="profileUrl" type="url" inputMode="url" maxLength={300} placeholder="https://instagram.com/yourhandle"/></label>
        </div>
        <div className="form-pair">
          <label>Followers<select required name="followers" defaultValue=""><option value="" disabled>Choose a range</option>{followerBands.map(f=><option key={f}>{f}</option>)}</select></label>
          <label>Main niche<select required name="niche" defaultValue=""><option value="" disabled>Choose a niche</option>{niches.map(n=><option key={n}>{n}</option>)}</select></label>
        </div>
        <label>Other profiles <small>Optional · links to your other channels</small><input name="otherProfiles" maxLength={500} placeholder="TikTok, YouTube, etc."/></label>
        <label>Typical rate per post <small>Optional</small><input name="rate" maxLength={100} placeholder="e.g. PKR 25,000 per reel"/></label>
        <label>Tell us about your audience <small>Optional</small><textarea name="message" maxLength={1500} rows={4} placeholder="Who follows you, average views or engagement, brands you have worked with…"/></label>
      </>:<>
        <div className="form-pair">
          <label>Phone / WhatsApp <small>Include country code</small><input required type="tel" name="phone" inputMode="tel" autoComplete="tel" maxLength={25} placeholder="+92 3XX XXXXXXX"/></label>
          <label>Campaign budget<select name="budget" defaultValue="Not sure yet">{budgetBands.map(b=><option key={b}>{b}</option>)}</select></label>
        </div>
        <fieldset className="platform-picks"><legend>Platforms you are interested in</legend>{platforms.filter(p=>p!=='Other').map(p=><label key={p} className="checkbox-label"><input type="checkbox" name="platforms" value={p}/> {p}</label>)}</fieldset>
        <label>Audience niche<select name="niche" defaultValue=""><option value="">Any / not sure</option>{niches.map(n=><option key={n}>{n}</option>)}</select></label>
        <label>Campaign goal<textarea required name="goal" minLength={10} maxLength={1500} rows={4} placeholder="Product launch, awareness, app installs, sales… Who do you want to reach and when?"/></label>
      </>}
      {error&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {error}</p>}
      <button className="primary" type="submit" disabled={sending}>{sending?<><Loader2 size={17} className="spin"/> Sending…</>:kind==='influencer'?'Join the network':'Send campaign brief'}</button>
      <p className="form-note">We use these details only to contact you about influencer campaigns. See our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
    </form>
  </div>;
}
