'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,ListChecks,Download,ShieldCheck,AlertTriangle,ExternalLink,Loader2,LayoutList} from 'lucide-react';
import type {Prospect} from '../lib/prospects';
import {categories,niches} from '../lib/link-opportunities';

type Providers={moz:boolean;openPageRank:boolean;search:boolean};
type Mode='curated'|'keyword'|'domains';
type SortKey='da'|'pa'|'spamScore'|'openPageRank'|'trancoRank'|'domain';
const STATUS:Record<Prospect['verification']['status'],string>={verified:'Verified',protected:'Live (protected)',redirects:'Redirects',parked:'Parked',unreachable:'Unreachable',error:'Error'};
const LIVE=new Set(['verified','protected']);
const CATEGORY=Object.fromEntries(categories.map(c=>[c.id,c.label]));
// Lower values are better for these columns, so they sort ascending first.
const ASC=new Set<SortKey>(['spamScore','trancoRank','domain']);

function spamClass(s:number|null){return s==null?'':s<=30?'good':s<=60?'warn':'bad'}

export default function ProspectFinder(){
  const [mode,setMode]=useState<Mode>('curated');
  const [niche,setNiche]=useState('all'),[cats,setCats]=useState<string[]>(categories.map(c=>c.id));
  const [keyword,setKeyword]=useState(''),[location,setLocation]=useState(''),[domains,setDomains]=useState('');
  const [loading,setLoading]=useState(false),[error,setError]=useState(''),[warnings,setWarnings]=useState<string[]>([]);
  const [results,setResults]=useState<Prospect[]|null>(null);
  const [providers,setProviders]=useState<Providers|null>(null);
  const [minDa,setMinDa]=useState(0),[maxSpam,setMaxSpam]=useState(100),[liveOnly,setLiveOnly]=useState(true);
  const [sort,setSort]=useState<{key:SortKey;desc:boolean}>({key:'trancoRank',desc:false});

  useEffect(()=>{fetch('/api/tools/prospects').then(r=>r.json()).then(d=>setProviders(d.providers)).catch(()=>{})},[]);

  async function run(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError('');setWarnings([]);setResults(null);
    const body=mode==='curated'?{mode,niche,categories:cats}:mode==='keyword'?{mode,keyword,location}:{mode,domains};
    try{
      const res=await fetch('/api/tools/prospects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Something went wrong.');
      setResults(data.results);setWarnings(data.warnings||[]);
      setSort(data.providers?.moz?{key:'da',desc:true}:{key:'trancoRank',desc:false});
    }catch(err){setError(err instanceof Error?err.message:'Something went wrong.')}
    finally{setLoading(false)}
  }

  const shown=useMemo(()=>{
    if(!results)return [];
    const rows=results.filter(r=>(!liveOnly||LIVE.has(r.verification.status))&&(r.da==null||r.da>=minDa)&&(r.spamScore==null||r.spamScore<=maxSpam));
    const dir=sort.desc?-1:1;
    const cmp=(a:Prospect,b:Prospect,key:SortKey,d:number)=>{if(key==='domain')return a.domain.localeCompare(b.domain)*d;const x=a[key],y=b[key];if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;return (x-y)*d};
    return rows.sort((a,b)=>cmp(a,b,sort.key,dir)||cmp(a,b,'trancoRank',1));
  },[results,liveOnly,minDa,maxSpam,sort]);

  function header(key:SortKey,label:string,title?:string){const active=sort.key===key;return <th aria-sort={active?(sort.desc?'descending':'ascending'):'none'} title={title}><button type="button" onClick={()=>setSort({key,desc:active?!sort.desc:!ASC.has(key)})}>{label}{active?(sort.desc?' ↓':' ↑'):''}</button></th>}

  function exportCsv(){
    const head=['Website','Domain','Type','Where to add your link','DA','PA','Spam Score %','Popularity rank (Tranco)','Open PageRank','Status','Region','Notes'];
    const esc=(v:unknown)=>`"${String(v??'').replace(/"/g,'""')}"`;
    const lines=[head,...shown.map(r=>[r.name||r.verification.title,r.domain,r.category?CATEGORY[r.category]:r.foundVia,r.guestPostUrl||r.verification.finalUrl,r.da,r.pa,r.spamScore,r.trancoRank,r.openPageRank,STATUS[r.verification.status],r.region,r.note||r.verification.note])].map(l=>l.map(esc).join(','));
    const url=URL.createObjectURL(new Blob(['﻿'+lines.join('\n')],{type:'text/csv'}));
    const a=document.createElement('a');a.href=url;a.download=`link-building-websites-${new Date().toISOString().slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  const toggleCat=(id:string)=>setCats(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);
  const tab=(m:Mode,icon:React.ReactNode,label:string)=><button role="tab" type="button" aria-selected={mode===m} onClick={()=>{setMode(m);setError('')}}>{icon} {label}</button>;
  const noMetrics=providers&&!providers.moz;

  return <div className="prospect-tool">
    <div className="tool-tabs" role="tablist" aria-label="Choose how to find websites">
      {tab('curated',<LayoutList size={16}/>,'Ready-made list')}
      {tab('keyword',<Search size={16}/>,'Search by keyword')}
      {tab('domains',<ListChecks size={16}/>,'Check my list')}
    </div>
    <form className="brief-form tool-form" onSubmit={run}>
      {mode==='curated'&&<>
        <label>Your niche<select value={niche} onChange={e=>setNiche(e.target.value)}>{niches.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select></label>
        <fieldset className="tool-cats"><legend>Where do you want links?</legend>{categories.map(c=><label key={c.id} className="checkbox-label"><input type="checkbox" checked={cats.includes(c.id)} onChange={()=>toggleCat(c.id)}/> {c.label}</label>)}</fieldset>
        <p className="tool-hint">A hand-checked list of real websites where you can add a link: guest post sites, directories, agency listings, profiles and communities. Each site is re-checked live when you search.</p>
      </>}
      {mode==='keyword'&&<>
        {providers&&!providers.search&&<p className="tool-note"><AlertTriangle size={16}/> Keyword search needs a search API key and is not switched on yet. Use the ready-made list for now.</p>}
        <div className="form-pair">
          <label>Niche or keyword<input required value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="e.g. digital marketing, travel, health" maxLength={80}/></label>
          <label>Location <small>Optional</small><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Pakistan, UK, Dubai" maxLength={40}/></label>
        </div>
      </>}
      {mode==='domains'&&<label>Domains to check <small>One per line or comma-separated · up to 50</small><textarea required value={domains} onChange={e=>setDomains(e.target.value)} placeholder={'example.com\nanother-site.com'} rows={6}/></label>}
      <button className="primary" type="submit" disabled={loading||(mode==='curated'&&!cats.length)||(mode==='keyword'&&providers?.search===false)}>{loading?<><Loader2 size={17} className="spin"/> Checking websites…</>:mode==='curated'?'Show websites':mode==='keyword'?'Find websites':'Check domains'}</button>
    </form>

    {error&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {error}</p>}
    {warnings.map(w=><p className="tool-note" key={w}><AlertTriangle size={16}/> {w}</p>)}

    {results&&<section className="tool-results" aria-live="polite">
      {noMetrics&&<p className="tool-note"><AlertTriangle size={16}/> DA, PA and Spam Score appear once the Moz connection is switched on. Until then, use the popularity rank: a lower number means a bigger website.</p>}
      <div className="tool-filters">
        <label>Min DA<input type="number" min={0} max={100} value={minDa} onChange={e=>setMinDa(Number(e.target.value)||0)}/></label>
        <label>Max spam score %<input type="number" min={0} max={100} value={maxSpam} onChange={e=>setMaxSpam(Number(e.target.value)||0)}/></label>
        <label className="checkbox-label"><input type="checkbox" checked={liveOnly} onChange={e=>setLiveOnly(e.target.checked)}/> Live sites only</label>
        <span className="tool-count">{shown.length} of {results.length} websites</span>
        <button type="button" className="outline" onClick={exportCsv} disabled={!shown.length}><Download size={15}/> Download CSV</button>
      </div>
      <div className="tool-table-wrap"><table className="tool-table">
        <thead><tr>{header('domain','Website')}<th>Type</th>{header('da','DA')}{header('pa','PA')}{header('spamScore','Spam score')}{header('trancoRank','Popularity rank','Tranco top-1M rank: lower is bigger')}<th>Status</th><th>Add your link</th></tr></thead>
        <tbody>{shown.map(r=><tr key={r.domain}>
          <td><strong className="tool-site">{r.name||r.domain}</strong><a href={`https://${r.domain}`} target="_blank" rel="nofollow noopener noreferrer">{r.domain} <ExternalLink size={12}/></a>{(r.note||(!r.name&&r.verification.title))&&<small title={r.note||r.verification.title}>{r.note||r.verification.title}</small>}</td>
          <td className="tool-type">{r.category?CATEGORY[r.category]:r.foundVia||'—'}{r.region&&<small>{r.region}</small>}</td>
          <td className="num">{r.da??'—'}</td><td className="num">{r.pa??'—'}</td>
          <td className={'num spam '+spamClass(r.spamScore)}>{r.spamScore==null?'—':r.spamScore+'%'}</td>
          <td className="num" title={r.trancoRank==null?'Not in the top 1 million websites':undefined}>{r.trancoRank==null?'1M+':'#'+r.trancoRank.toLocaleString('en-US')}</td>
          <td><span className={'status '+r.verification.status} title={r.verification.note}>{LIVE.has(r.verification.status)&&<ShieldCheck size={13}/>}{STATUS[r.verification.status]}</span>{r.verification.note&&!LIVE.has(r.verification.status)&&<small>{r.verification.note}</small>}</td>
          <td>{r.guestPostUrl?<a className="tool-go" href={r.guestPostUrl} target="_blank" rel="nofollow noopener noreferrer">{r.category==='guest'?'Guidelines':'Open'} <ExternalLink size={12}/></a>:'—'}</td>
        </tr>)}</tbody>
      </table>{!shown.length&&<p className="tool-empty">No websites match these filters.</p>}</div>
      <p className="tool-attribution">Popularity rank from the <a href="https://tranco-list.eu" target="_blank" rel="noopener">Tranco list</a>. DA, PA and Spam Score from <a href="https://moz.com" target="_blank" rel="noopener">Moz</a>. “Verified” means the page loaded over HTTPS on this domain and does not look parked; “Live (protected)” means the site is up but blocks automated checks. Always read a site’s rules before posting, and avoid paid or spammy links.</p>
    </section>}
  </div>;
}
