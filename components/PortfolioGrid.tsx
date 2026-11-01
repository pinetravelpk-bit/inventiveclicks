'use client';
import {useCallback,useEffect,useState} from 'react';
import {X,ChevronLeft,ChevronRight,MapPin,Expand,Code2} from 'lucide-react';
import type {Project,Sector} from '../lib/portfolio';

function Browser({p,size}:{p:Project;size:'sm'|'lg'}){
  return <div className="pf-browser" style={{'--pf-accent':p.accent} as React.CSSProperties}>
    <div className="pf-bar" aria-hidden="true"><i/><i/><i/><span>{p.name}</span></div>
    <img src={`/portfolio/${p.slug}${size==='sm'?'-sm':''}.webp`} alt={`${p.name} website homepage`} width={size==='sm'?800:1440} height={size==='sm'?500:900} loading={size==='sm'?'lazy':undefined}/>
  </div>;
}

export default function PortfolioGrid({projects,sectors}:{projects:Project[];sectors:{id:Sector|'all';label:string}[]}){
  const [sector,setSector]=useState<Sector|'all'>('all');const [open,setOpen]=useState<number|null>(null);
  const shown=sector==='all'?projects:projects.filter(p=>p.sector===sector);
  const label=(s:Sector)=>sectors.find(x=>x.id===s)?.label||s;
  const step=useCallback((d:number)=>setOpen(i=>i==null?i:(i+d+shown.length)%shown.length),[shown.length]);
  useEffect(()=>{if(open==null)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null);if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)};addEventListener('keydown',k);document.body.style.overflow='hidden';return()=>{removeEventListener('keydown',k);document.body.style.overflow=''}},[open,step]);
  const cur=open!=null?shown[open]:null;
  return <>
    <div className="pf-filters" role="tablist" aria-label="Filter projects by industry">{sectors.map(s=>{const n=s.id==='all'?projects.length:projects.filter(p=>p.sector===s.id).length;return <button key={s.id} type="button" role="tab" aria-selected={sector===s.id} onClick={()=>setSector(s.id)}>{s.label}<span>{n}</span></button>})}</div>
    <div className="pf-grid">{shown.map((p,i)=><article key={p.slug} className="pf-card">
      <button type="button" className="pf-shot" onClick={()=>setOpen(i)} aria-label={`View larger screenshot of ${p.name}`}><Browser p={p} size="sm"/><span className="pf-zoom"><Expand size={16}/> View</span></button>
      <div className="pf-body">
        <div className="pf-meta"><span className="pf-sector">{label(p.sector)}</span><span className="pf-platform"><Code2 size={13}/>{p.platform}</span></div>
        <h3>{p.name}</h3>
        <p className="pf-market"><MapPin size={13}/>{p.market}</p>
        <p>{p.summary}</p>
        <ul className="pf-features">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
      </div>
    </article>)}</div>
    {cur&&<div className="pf-lightbox" role="dialog" aria-modal="true" aria-label={`${cur.name} screenshot`} onClick={()=>setOpen(null)}>
      <figure onClick={e=>e.stopPropagation()}><Browser p={cur} size="lg"/><figcaption><strong>{cur.name}</strong> · {label(cur.sector)} · {cur.market}</figcaption></figure>
      <button type="button" className="pf-lb-close" aria-label="Close" onClick={()=>setOpen(null)}><X/></button>
      <button type="button" className="pf-lb-prev" aria-label="Previous project" onClick={e=>{e.stopPropagation();step(-1)}}><ChevronLeft/></button>
      <button type="button" className="pf-lb-next" aria-label="Next project" onClick={e=>{e.stopPropagation();step(1)}}><ChevronRight/></button>
    </div>}
  </>;
}
