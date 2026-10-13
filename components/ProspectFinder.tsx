'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,ListChecks,Download,ShieldCheck,AlertTriangle,ExternalLink,Loader2} from 'lucide-react';
import type {Prospect} from '../lib/prospects';

type Providers={moz:boolean;openPageRank:boolean;search:boolean};
type SortKey='da'|'pa'|'spamScore'|'openPageRank'|'domain';
const STATUS:Record<Prospect['verification']['status'],string>={verified:'Verified',redirects:'Redirects',parked:'Parked',unreachable:'Unreachable',error:'Error'};

function spamClass(s:number|null){return s==null?'':s<=30?'good':s<=60?'warn':'bad'}

export default function ProspectFinder(){
  const [mode,setMode]=useState<'keyword'|'domains'>('keyword');
  const [keyword,setKeyword]=useState(''),[location,setLocation]=useState(''),[domains,setDomains]=useState('');
  const [loading,setLoading]=useState(false),[error,setError]=useState(''),[warnings,setWarnings]=useState<string[]>([]);
  const [results,setResults]=useState<Prospect[]|null>(null);
  const [providers,setProviders]=useState<Providers|null>(null);
  const [minDa,setMinDa]=useState(0),[maxSpam,setMaxSpam]=useState(100),[verifiedOnly,setVerifiedOnly]=useState(true);
  const [sort,setSort]=useState<{key:SortKey;desc:boolean}>({key:'da',desc:true});

  useEffect(()=>{fetch('/api/tools/prospects').then(r=>r.json()).then(d=>{setProviders(d.providers);if(!d.providers.search)setMode('domains')}).catch(()=>{})},[]);

  async function run(e:React.FormEvent){
    e.preventDefault();setLoading(true);setError('');setWarnings([]);setResults(null);
    try{
      const res=await fetch('/api/tools/prospects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(mode==='keyword'?{mode,keyword,location}:{mode,domains})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Something went wrong.');
      setResults(data.results);setWarnings(data.warnings||[]);
    }catch(err){setError(err instanceof Error?err.message:'Something went wrong.')}
    finally{setLoading(false)}
  }

  const shown=useMemo(()=>{
    if(!results)return [];
    const rows=results.filter(r=>(!verifiedOnly||r.verification.status==='verified')&&(r.da==null||r.da>=minDa)&&(r.spamScore==null||r.spamScore<=maxSpam));
    const dir=sort.desc?-1:1;
    return rows.sort((a,b)=>{if(sort.key==='domain')return a.domain.localeCompare(b.domain)*dir;const x=a[sort.key],y=b[sort.key];if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;return (x-y)*dir});
  },[results,verifiedOnly,minDa,maxSpam,sort]);

  function header(key:SortKey,label:string){const active=sort.key===key;return <th aria-sort={active?(sort.desc?'descending':'ascending'):'none'}><button type="button" onClick={()=>setSort({key,desc:active?!sort.desc:key!=='spamScore'&&key!=='domain'})}>{label}{active?(sort.desc?' ↓':' ↑'):''}</button></th>}

  function exportCsv(){
    const head=['Domain','DA','PA','Spam Score %','Linking root domains','Open PageRank','Status','HTTPS','Title','Guest post page','Note'];
    const esc=(v:unknown)=>`"${String(v??'').replace(/"/g,'""')}"`;
    const lines=[head,...shown.map(r=>[r.domain,r.da,r.pa,r.spamScore,r.linkingDomains,r.openPageRank,STATUS[r.verification.status],r.verification.https?'Yes':'No',r.verification.title,r.guestPostUrl,r.verification.note])].map(l=>l.map(esc).join(','));
    const url=URL.createObjectURL(new Blob(['﻿'+lines.join('\n')],{type:'text/csv'}));
    const a=document.createElement('a');a.href=url;a.download=`backlink-prospects-${new Date().toISOString().slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  return <div className="prospect-tool">
    <div className="tool-tabs" role="tablist" aria-label="Choose how to find websites">
      <button role="tab" type="button" aria-selected={mode==='keyword'} onClick={()=>setMode('keyword')}><Search size={16}/> Find by keyword</button>
      <button role="tab" type="button" aria-selected={mode==='domains'} onClick={()=>setMode('domains')}><ListChecks size={16}/> Check my list</button>
    </div>
    <form className="brief-form tool-form" onSubmit={run}>
      {mode==='keyword'?<>
        {providers&&!providers.search&&<p className="tool-note"><AlertTriangle size={16}/> Keyword discovery is not switched on yet. Use “Check my list” for now.</p>}
        <div className="form-pair">
          <label>Niche or keyword<input required value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="e.g. digital marketing, travel, health" maxLength={80}/></label>
          <label>Location <small>Optional</small><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Pakistan, UK, Dubai" maxLength={40}/></label>
        </div>
        <p className="tool-hint">We search for sites in your niche that accept guest posts, then check each one’s authority, spam signals and whether it is live.</p>
      </>:<label>Domains to check <small>One per line or comma-separated · up to 50</small><textarea required value={domains} onChange={e=>setDomains(e.target.value)} placeholder={'example.com\nanother-site.com'} rows={6}/></label>}
      <button className="primary" type="submit" disabled={loading||(mode==='keyword'&&providers?.search===false)}>{loading?<><Loader2 size={17} className="spin"/> Checking websites…</>:<>{mode==='keyword'?'Find websites':'Check domains'}</>}</button>
    </form>

    {error&&<p className="tool-error" role="alert"><AlertTriangle size={16}/> {error}</p>}
    {warnings.map(w=><p className="tool-note" key={w}><AlertTriangle size={16}/> {w}</p>)}

    {results&&<section className="tool-results" aria-live="polite">
      <div className="tool-filters">
        <label>Min DA<input type="number" min={0} max={100} value={minDa} onChange={e=>setMinDa(Number(e.target.value)||0)}/></label>
        <label>Max spam score %<input type="number" min={0} max={100} value={maxSpam} onChange={e=>setMaxSpam(Number(e.target.value)||0)}/></label>
        <label className="checkbox-label"><input type="checkbox" checked={verifiedOnly} onChange={e=>setVerifiedOnly(e.target.checked)}/> Verified sites only</label>
        <span className="tool-count">{shown.length} of {results.length} websites</span>
        <button type="button" className="outline" onClick={exportCsv} disabled={!shown.length}><Download size={15}/> Download CSV</button>
      </div>
      <div className="tool-table-wrap"><table className="tool-table">
        <thead><tr>{header('domain','Website')}{header('da','DA')}{header('pa','PA')}{header('spamScore','Spam score')}{header('openPageRank','Open PageRank')}<th>Status</th><th>Guest post</th></tr></thead>
        <tbody>{shown.map(r=><tr key={r.domain}>
          <td><a href={r.verification.finalUrl||`https://${r.domain}`} target="_blank" rel="nofollow noopener noreferrer">{r.domain} <ExternalLink size={12}/></a>{r.verification.title&&<small>{r.verification.title}</small>}</td>
          <td className="num">{r.da??'—'}</td><td className="num">{r.pa??'—'}</td>
          <td className={'num spam '+spamClass(r.spamScore)}>{r.spamScore==null?'—':r.spamScore+'%'}</td>
          <td className="num">{r.openPageRank==null?'—':r.openPageRank.toFixed(1)}</td>
          <td><span className={'status '+r.verification.status} title={r.verification.note}>{r.verification.status==='verified'&&<ShieldCheck size={13}/>}{STATUS[r.verification.status]}</span>{r.verification.note&&r.verification.status!=='verified'&&<small>{r.verification.note}</small>}</td>
          <td>{r.guestPostUrl?<a href={r.guestPostUrl} target="_blank" rel="nofollow noopener noreferrer">View page</a>:'—'}</td>
        </tr>)}</tbody>
      </table>{!shown.length&&<p className="tool-empty">No websites match these filters.</p>}</div>
      <p className="tool-attribution">DA, PA and Spam Score data from <a href="https://moz.com" target="_blank" rel="noopener">Moz</a>. Open PageRank from <a href="https://www.domcop.com/openpagerank/" target="_blank" rel="noopener">Open PageRank</a>. “Verified” means the homepage loaded over HTTPS on this domain and does not look parked. Always review a site before outreach.</p>
    </section>}
  </div>;
}
