'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {AlertTriangle,CheckCircle2,XCircle,Info,Loader2,Printer,RotateCcw,ArrowRight,ExternalLink,Lock,Unlock} from 'lucide-react';
import type {Report,Check,Status} from '../lib/audit';
import type {Preview} from '../lib/audit/leads';

const STEPS=['Loading the page','Checking HTTPS and security headers','Reading robots.txt and the sitemap','Analysing titles, headings and content','Checking local business signals','Looking up domain age and authority','Checking AEO, GEO and AI readiness','Measuring page weight and images','Crawling internal pages','Testing links and broken pages','Scoring the results'];
const ICON:Record<Status,React.ReactNode>={pass:<CheckCircle2 size={18}/>,warn:<AlertTriangle size={18}/>,fail:<XCircle size={18}/>,info:<Info size={18}/>};
const tone=(s:number)=>s>=90?'good':s>=70?'ok':s>=50?'warn':'bad';
const LEAD_KEY='ic-audit-lead';

function Ring({score,size=148}:{score:number;size?:number}){
  const r=size/2-10,len=2*Math.PI*r;
  return <svg className={'audit-ring '+tone(score)} width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Score ${score} out of 100`}>
    <circle cx={size/2} cy={size/2} r={r} className="track"/>
    <circle cx={size/2} cy={size/2} r={r} className="bar" strokeDasharray={len} strokeDashoffset={len*(1-score/100)} transform={`rotate(-90 ${size/2} ${size/2})`}/>
    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle">{score}</text>
  </svg>;
}

function CheckRow({c}:{c:Check}){return <li className={'audit-check '+c.status}><span className="audit-icon">{ICON[c.status]}</span><div><strong>{c.label}</strong><p>{c.detail}</p>{c.fix&&(c.status==='fail'||c.status==='warn')&&<p className="audit-fix"><b>How to fix:</b> {c.fix}</p>}</div></li>}

export default function SiteAudit(){
  const [url,setUrl]=useState(''),[deep,setDeep]=useState(true);
  const [loading,setLoading]=useState(false),[step,setStep]=useState(0),[error,setError]=useState('');
  const [prev,setPrev]=useState<Preview|null>(null),[report,setReport]=useState<Report|null>(null);
  const [lead,setLead]=useState({name:'',email:'',phone:''}),[unlocking,setUnlocking]=useState(false),[leadError,setLeadError]=useState('');

  useEffect(()=>{try{const s=localStorage.getItem(LEAD_KEY);if(s)setLead(JSON.parse(s))}catch{/* storage unavailable */}},[]);
  useEffect(()=>{if(!loading)return;setStep(0);const t=setInterval(()=>setStep(s=>Math.min(s+1,STEPS.length-1)),deep?4500:1800);return()=>clearInterval(t)},[loading,deep]);

  async function run(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError('');setPrev(null);setReport(null);setLeadError('');
    try{
      const res=await fetch('/api/tools/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,deep})});
      const data=await res.json().catch(()=>({error:'The audit took too long. Try again without the deep scan.'}));
      if(!res.ok)throw new Error(data.error||'The audit failed.');
      setPrev(data);setTimeout(()=>document.getElementById('audit-report')?.scrollIntoView({behavior:'smooth'}),50);
    }catch(err){setError(err instanceof Error?err.message:'The audit failed.')}
    finally{setLoading(false)}
  }

  async function unlock(e:React.FormEvent){
    e.preventDefault();if(!prev)return;setUnlocking(true);setLeadError('');
    try{
      const res=await fetch('/api/tools/audit/unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:prev.id,...lead})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Something went wrong.');
      try{localStorage.setItem(LEAD_KEY,JSON.stringify(lead))}catch{/* storage unavailable */}
      setReport(data);setTimeout(()=>document.getElementById('audit-full')?.scrollIntoView({behavior:'smooth'}),50);
    }catch(err){setLeadError(err instanceof Error?err.message:'Something went wrong.')}
    finally{setUnlocking(false)}
  }

  const reset=()=>{setPrev(null);setReport(null);window.scrollTo({top:0,behavior:'smooth'})};
  const counts=prev?.counts;

  return <div className="audit-tool">
    <form className="audit-form" onSubmit={run}>
      <label htmlFor="audit-url" className="sr-only">Website address</label>
      <input id="audit-url" required value={url} onChange={e=>setUrl(e.target.value)} placeholder="Enter a website, e.g. yourbusiness.com" inputMode="url" autoComplete="url" maxLength={300}/>
      <button className="primary" type="submit" disabled={loading}>{loading?<><Loader2 size={17} className="spin"/> Auditing…</>:<>Run free audit <ArrowRight size={17}/></>}</button>
      <label className="checkbox-label"><input type="checkbox" checked={deep} onChange={e=>setDeep(e.target.checked)}/> Deep scan: also crawl up to 25 pages and test links (takes up to a minute)</label>
    </form>

    {loading&&<div className="audit-progress" role="status"><Loader2 size={22} className="spin"/><div><strong>{STEPS[step]}…</strong><p>{deep?'A deep scan usually takes 20–60 seconds.':'This usually takes 5–20 seconds.'} Please keep this page open.</p></div></div>}
    {error&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {error}</p>}

    {prev&&counts&&<section id="audit-report" className="audit-report" aria-live="polite">
      <div className="audit-summary">
        <Ring score={prev.score}/>
        <div className="audit-summary-text">
          <span className={'audit-grade '+tone(prev.score)}>Grade {prev.grade}</span>
          <h2>{prev.host}</h2>
          <p><a href={prev.finalUrl} target="_blank" rel="nofollow noopener noreferrer">{prev.finalUrl} <ExternalLink size={12}/></a></p>
          <p className="audit-meta">Audited {new Date(prev.auditedAt).toLocaleString()} · {prev.deep?`Deep scan of ${prev.stats.pagesCrawled} pages`:'Single page'} · {prev.totalChecks} checks · {(prev.durationMs/1000).toFixed(1)} s</p>
          <div className="audit-counts"><span className="fail">{counts.fail} critical</span><span className="warn">{counts.warn} warnings</span><span className="pass">{counts.pass} passed</span></div>
        </div>
        <div className="audit-actions">{report&&<button type="button" className="outline" onClick={()=>window.print()}><Printer size={15}/> Save as PDF</button>}<button type="button" className="outline" onClick={reset}><RotateCcw size={15}/> New audit</button></div>
      </div>

      <div className="audit-stats">
        {[['Response time',prev.stats.ttfb+' ms'],['Page weight',prev.stats.pageWeightKb+' KB'],['Words',String(prev.stats.words)],['Pages scanned',String(prev.stats.pagesCrawled)],['Links checked',String(prev.stats.linksChecked)],['Popularity rank',prev.stats.trancoRank?'#'+prev.stats.trancoRank.toLocaleString('en-US'):'Not top 1M'],['Domain age',prev.stats.domainAgeYears==null?'—':prev.stats.domainAgeYears+' yrs']].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}
      </div>

      <div className="audit-cats">{prev.categories.map(c=><a key={c.id} href={report?'#cat-'+c.id:'#audit-unlock'} className={'audit-cat '+tone(c.score)}><Ring score={c.score} size={64}/><span>{c.label}<small>{c.issues?`${c.issues} issue${c.issues===1?'':'s'}`:'No issues'}</small></span></a>)}</div>

      {!report&&<div id="audit-unlock" className="audit-locked">
        <div className="audit-teaser" aria-hidden="true">
          <h3>Top problems found</h3>
          <ul className="audit-checks">{prev.teaser.map(t=><li key={t.label} className={'audit-check '+t.status}><span className="audit-icon">{ICON[t.status]}</span><div><strong>{t.label} · {t.category}</strong><p className="blurred">The detail and step-by-step fix for this issue are in your full report.</p></div></li>)}
            {[1,2,3].map(i=><li key={i} className="audit-check warn blurred"><span className="audit-icon">{ICON.warn}</span><div><strong>Hidden issue</strong><p>Unlock the full report to see this issue and how to fix it.</p></div></li>)}</ul>
        </div>
        <form className="brief-form audit-lead" onSubmit={unlock}>
          <span className="audit-lock-icon"><Lock size={22}/></span>
          <h3>See your complete audit</h3>
          <p>Add your name, email and phone number to unlock all {prev.totalChecks} checks: every issue with step-by-step fixes across SEO, GEO, AEO, AI search, local SEO, off-page, on-page, speed, technical SEO, security, links and broken pages{prev.deep&&prev.stats.pagesCrawled>1?`, plus the site-wide scan of ${prev.stats.pagesCrawled} pages`:''}.</p>
          <label>Full name<input required autoComplete="name" value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})} placeholder="Your name" maxLength={100}/></label>
          <label>Email address<input required type="email" autoComplete="email" value={lead.email} onChange={e=>setLead({...lead,email:e.target.value})} placeholder="you@company.com" maxLength={254}/></label>
          <label>Phone number <small>Include country code</small><input required type="tel" inputMode="tel" autoComplete="tel" value={lead.phone} onChange={e=>setLead({...lead,phone:e.target.value})} placeholder="e.g. +92 3XX XXXXXXX" maxLength={25}/></label>
          {leadError&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {leadError}</p>}
          <button className="primary" type="submit" disabled={unlocking}>{unlocking?<><Loader2 size={17} className="spin"/> Unlocking…</>:<><Unlock size={17}/> Show my complete audit</>}</button>
          <p className="audit-consent">By continuing, you agree that Inventive Clicks may contact you about this audit and our services. See our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
        </form>
      </div>}

      {report&&<div id="audit-full" className="audit-full">
        {report.psi&&<div className="audit-psi">{[['Performance',report.psi.performance],['Accessibility',report.psi.accessibility],['Best practices',report.psi.bestPractices],['SEO',report.psi.seo]].map(([k,v])=><div key={k as string}><Ring score={v as number} size={84}/><span>{k}</span></div>)}<p>Google PageSpeed (mobile): LCP {report.psi.lcp} · CLS {report.psi.cls} · TBT {report.psi.tbt}</p></div>}

        {report.priorities.length>0&&<div className="audit-block"><h3>Top priorities</h3><ol className="audit-checks priority">{report.priorities.map(p=><CheckRow key={p.category+p.id} c={{...p,label:`${p.label} · ${p.category}`}}/>)}</ol></div>}

        {report.categories.map(cat=>{const open=cat.checks.filter(c=>c.status==='fail'||c.status==='warn');const rest=cat.checks.filter(c=>c.status==='pass'||c.status==='info');return <div key={cat.id} id={'cat-'+cat.id} className="audit-block">
          <h3>{cat.label} <span className={'audit-pill '+tone(cat.score)}>{cat.score}/100</span></h3>
          {open.length>0?<ul className="audit-checks">{open.map(c=><CheckRow key={c.id} c={c}/>)}</ul>:<p className="audit-allgood"><CheckCircle2 size={16}/> No problems found in this area.</p>}
          {rest.length>0&&<details className="audit-passed"><summary>{rest.length} passed and informational checks</summary><ul className="audit-checks">{rest.map(c=><CheckRow key={c.id} c={c}/>)}</ul></details>}
        </div>})}

        {report.brokenLinks.length>0&&<div className="audit-block"><h3>Broken links and pages</h3><div className="tool-table-wrap"><table className="tool-table"><thead><tr><th>URL</th><th>Type</th><th>Status</th></tr></thead><tbody>{report.brokenLinks.map(b=><tr key={b.url}><td><a href={b.url} target="_blank" rel="nofollow noopener noreferrer">{b.url}</a></td><td>{b.internal?'Internal':'External'}</td><td className="num">{b.status||b.error}</td></tr>)}</tbody></table></div></div>}

        {report.deep&&report.pages.length>1&&<div className="audit-block"><h3>Pages scanned ({report.pages.length})</h3><div className="tool-table-wrap"><table className="tool-table"><thead><tr><th>Page</th><th>Status</th><th>Time</th><th>Words</th><th>Issues</th></tr></thead><tbody>{report.pages.map(p=><tr key={p.url}><td><a href={p.url} target="_blank" rel="nofollow noopener noreferrer">{p.url.replace(/^https?:\/\/[^/]+/,'')||'/'}</a><small>{p.title||'No title'}</small></td><td className="num">{p.status||'—'}</td><td className="num">{p.ms} ms</td><td className="num">{p.words}</td><td>{p.issues.length?<span className="audit-issues">{p.issues.join(' · ')}</span>:<span className="status verified">OK</span>}</td></tr>)}</tbody></table></div></div>}

        <div className="audit-cta"><div><h3>Want these issues fixed?</h3><p>Our SEO and web team can fix the problems in this report and help you rank higher on Google and in AI answers.</p></div><Link className="primary" href="/contact?service=SEO">Get help with this audit <ArrowRight size={17}/></Link></div>
      </div>}
    </section>}
  </div>;
}
