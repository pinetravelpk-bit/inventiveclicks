'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {AlertTriangle,CheckCircle2,XCircle,Info,Loader2,Printer,RotateCcw,ArrowRight,ExternalLink} from 'lucide-react';
import type {Report,Check,Status} from '../lib/audit';

const STEPS=['Loading the page','Checking HTTPS and security headers','Reading robots.txt and the sitemap','Analysing titles, headings and content','Checking structured data and AI readiness','Measuring page weight and images','Crawling internal pages','Testing links for errors','Scoring the results'];
const ICON:Record<Status,React.ReactNode>={pass:<CheckCircle2 size={18}/>,warn:<AlertTriangle size={18}/>,fail:<XCircle size={18}/>,info:<Info size={18}/>};
const tone=(s:number)=>s>=90?'good':s>=70?'ok':s>=50?'warn':'bad';

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
  const [report,setReport]=useState<Report|null>(null);

  useEffect(()=>{if(!loading)return;setStep(0);const t=setInterval(()=>setStep(s=>Math.min(s+1,STEPS.length-1)),deep?5500:2500);return()=>clearInterval(t)},[loading,deep]);

  async function run(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError('');setReport(null);
    try{
      const res=await fetch('/api/tools/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,deep})});
      const data=await res.json().catch(()=>({error:'The audit took too long. Try again without the deep scan.'}));
      if(!res.ok)throw new Error(data.error||'The audit failed.');
      setReport(data);setTimeout(()=>document.getElementById('audit-report')?.scrollIntoView({behavior:'smooth'}),50);
    }catch(err){setError(err instanceof Error?err.message:'The audit failed.')}
    finally{setLoading(false)}
  }

  const counts=report?report.categories.flatMap(c=>c.checks).reduce((a,c)=>{a[c.status]++;return a},{pass:0,warn:0,fail:0,info:0} as Record<Status,number>):null;

  return <div className="audit-tool">
    <form className="audit-form" onSubmit={run}>
      <label htmlFor="audit-url" className="sr-only">Website address</label>
      <input id="audit-url" required value={url} onChange={e=>setUrl(e.target.value)} placeholder="Enter a website, e.g. yourbusiness.com" inputMode="url" autoComplete="url" maxLength={300}/>
      <button className="primary" type="submit" disabled={loading}>{loading?<><Loader2 size={17} className="spin"/> Auditing…</>:<>Run free audit <ArrowRight size={17}/></>}</button>
      <label className="checkbox-label"><input type="checkbox" checked={deep} onChange={e=>setDeep(e.target.checked)}/> Deep scan: also crawl up to 25 pages and test links (takes up to a minute)</label>
    </form>

    {loading&&<div className="audit-progress" role="status"><Loader2 size={22} className="spin"/><div><strong>{STEPS[step]}…</strong><p>{deep?'A deep scan usually takes 20–60 seconds.':'This usually takes 5–15 seconds.'} Please keep this page open.</p></div></div>}
    {error&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {error}</p>}

    {report&&counts&&<section id="audit-report" className="audit-report" aria-live="polite">
      <div className="audit-summary">
        <Ring score={report.score}/>
        <div className="audit-summary-text">
          <span className={'audit-grade '+tone(report.score)}>Grade {report.grade}</span>
          <h2>{report.host}</h2>
          <p><a href={report.finalUrl} target="_blank" rel="nofollow noopener noreferrer">{report.finalUrl} <ExternalLink size={12}/></a></p>
          <p className="audit-meta">Audited {new Date(report.auditedAt).toLocaleString()} · {report.deep?`Deep scan of ${report.stats.pagesCrawled} pages`:'Single page'} · {(report.durationMs/1000).toFixed(1)} s</p>
          <div className="audit-counts"><span className="fail">{counts.fail} critical</span><span className="warn">{counts.warn} warnings</span><span className="pass">{counts.pass} passed</span></div>
        </div>
        <div className="audit-actions"><button type="button" className="outline" onClick={()=>window.print()}><Printer size={15}/> Save as PDF</button><button type="button" className="outline" onClick={()=>{setReport(null);window.scrollTo({top:0,behavior:'smooth'})}}><RotateCcw size={15}/> New audit</button></div>
      </div>

      <div className="audit-stats">
        {[['Response time',report.stats.ttfb+' ms'],['Page weight',report.stats.pageWeightKb+' KB'],['Words',String(report.stats.words)],['Images',String(report.stats.images)],['Internal links',String(report.stats.internalLinks)],['Links checked',String(report.stats.linksChecked)]].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}
      </div>

      {report.psi&&<div className="audit-psi">{[['Performance',report.psi.performance],['Accessibility',report.psi.accessibility],['Best practices',report.psi.bestPractices],['SEO',report.psi.seo]].map(([k,v])=><div key={k as string}><Ring score={v as number} size={84}/><span>{k}</span></div>)}<p>Google PageSpeed (mobile): LCP {report.psi.lcp} · CLS {report.psi.cls} · TBT {report.psi.tbt}</p></div>}

      <div className="audit-cats">{report.categories.map(c=><a key={c.id} href={'#cat-'+c.id} className={'audit-cat '+tone(c.score)}><Ring score={c.score} size={64}/><span>{c.label}</span></a>)}</div>

      {report.priorities.length>0&&<div className="audit-block"><h3>Top priorities</h3><ol className="audit-checks priority">{report.priorities.map(p=><CheckRow key={p.category+p.id} c={{...p,label:`${p.label} · ${p.category}`}}/>)}</ol></div>}

      {report.categories.map(cat=>{const open=cat.checks.filter(c=>c.status==='fail'||c.status==='warn');const rest=cat.checks.filter(c=>c.status==='pass'||c.status==='info');return <div key={cat.id} id={'cat-'+cat.id} className="audit-block">
        <h3>{cat.label} <span className={'audit-pill '+tone(cat.score)}>{cat.score}/100</span></h3>
        {open.length>0?<ul className="audit-checks">{open.map(c=><CheckRow key={c.id} c={c}/>)}</ul>:<p className="audit-allgood"><CheckCircle2 size={16}/> No problems found in this area.</p>}
        {rest.length>0&&<details className="audit-passed"><summary>{rest.length} passed and informational checks</summary><ul className="audit-checks">{rest.map(c=><CheckRow key={c.id} c={c}/>)}</ul></details>}
      </div>})}

      {report.brokenLinks.length>0&&<div className="audit-block"><h3>Broken links</h3><div className="tool-table-wrap"><table className="tool-table"><thead><tr><th>URL</th><th>Type</th><th>Status</th></tr></thead><tbody>{report.brokenLinks.map(b=><tr key={b.url}><td><a href={b.url} target="_blank" rel="nofollow noopener noreferrer">{b.url}</a></td><td>{b.internal?'Internal':'External'}</td><td className="num">{b.status||b.error}</td></tr>)}</tbody></table></div></div>}

      {report.deep&&report.pages.length>1&&<div className="audit-block"><h3>Pages scanned ({report.pages.length})</h3><div className="tool-table-wrap"><table className="tool-table"><thead><tr><th>Page</th><th>Status</th><th>Time</th><th>Words</th><th>Issues</th></tr></thead><tbody>{report.pages.map(p=><tr key={p.url}><td><a href={p.url} target="_blank" rel="nofollow noopener noreferrer">{p.url.replace(/^https?:\/\/[^/]+/,'')||'/'}</a><small>{p.title||'No title'}</small></td><td className="num">{p.status||'—'}</td><td className="num">{p.ms} ms</td><td className="num">{p.words}</td><td>{p.issues.length?<span className="audit-issues">{p.issues.join(' · ')}</span>:<span className="status verified">OK</span>}</td></tr>)}</tbody></table></div></div>}

      <div className="audit-cta"><div><h3>Want these issues fixed?</h3><p>Our SEO and web team can fix the problems in this report and help you rank higher.</p></div><Link className="primary" href="/contact?service=SEO">Get help with this audit <ArrowRight size={17}/></Link></div>
    </section>}
  </div>;
}
