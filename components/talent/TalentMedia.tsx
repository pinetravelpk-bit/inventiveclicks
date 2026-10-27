'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {X,ChevronLeft,ChevronRight,Play} from 'lucide-react';

type Hero={desktop:string;desktopPoster:string;mobile:string;mobilePoster:string};

// Background montage: portrait cut on phones, landscape on larger screens; still image when
// the visitor prefers reduced motion.
export function HeroVideo({hero}:{hero:Hero}){
  const [src,setSrc]=useState<{video:string|null;poster:string}|null>(null);
  useEffect(()=>{
    const pick=()=>{const mobile=matchMedia('(max-aspect-ratio: 4/5)').matches;const still=matchMedia('(prefers-reduced-motion: reduce)').matches;setSrc({video:still?null:mobile?hero.mobile:hero.desktop,poster:mobile?hero.mobilePoster:hero.desktopPoster})};
    pick();const mq=matchMedia('(max-aspect-ratio: 4/5)');mq.addEventListener('change',pick);return()=>mq.removeEventListener('change',pick);
  },[hero]);
  if(!src)return <div className="tz-hero-media" style={{backgroundImage:`url(${hero.desktopPoster})`}}/>;
  return src.video?<video key={src.video} className="tz-hero-media" src={src.video} poster={src.poster} autoPlay muted loop playsInline aria-hidden="true"/>:<div className="tz-hero-media" style={{backgroundImage:`url(${src.poster})`}}/>;
}

type Photo={file:string;cat:string;w:number;h:number};
export function TalentGallery({photos,cats,base}:{photos:Photo[];cats:{id:string;label:string}[];base:string}){
  const [cat,setCat]=useState('all');const [open,setOpen]=useState<number|null>(null);
  const shown=cat==='all'?photos:photos.filter(p=>p.cat===cat);
  const step=useCallback((d:number)=>setOpen(i=>i==null?i:(i+d+shown.length)%shown.length),[shown.length]);
  useEffect(()=>{if(open==null)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null);if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)};addEventListener('keydown',k);document.body.style.overflow='hidden';return()=>{removeEventListener('keydown',k);document.body.style.overflow=''}},[open,step]);
  const label=(c:string)=>cats.find(x=>x.id===c)?.label||c;
  return <>
    <div className="tz-filters" role="tablist" aria-label="Filter portfolio">{cats.map(c=><button key={c.id} role="tab" type="button" aria-selected={cat===c.id} onClick={()=>{setCat(c.id);setOpen(null)}}>{c.label}</button>)}</div>
    <div className="tz-grid">{shown.map((p,i)=><button type="button" key={p.file} className="tz-photo" onClick={()=>setOpen(i)} aria-label={`Open ${label(p.cat)} photo ${i+1} of ${shown.length}`}>
      <img src={`${base}/thumbs/${p.file}.webp`} alt={`Maria Zeb, ${label(p.cat).toLowerCase()} photo`} width={640} height={800} loading="lazy"/><span>{label(p.cat)}</span>
    </button>)}</div>
    {open!=null&&shown[open]&&<div className="tz-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={()=>setOpen(null)}>
      <img src={`${base}/gallery/${shown[open].file}.webp`} alt={`Maria Zeb, ${label(shown[open].cat).toLowerCase()} photo`} width={shown[open].w} height={shown[open].h} onClick={e=>e.stopPropagation()}/>
      <button type="button" className="tz-lb-close" aria-label="Close" onClick={()=>setOpen(null)}><X/></button>
      <button type="button" className="tz-lb-prev" aria-label="Previous photo" onClick={e=>{e.stopPropagation();step(-1)}}><ChevronLeft/></button>
      <button type="button" className="tz-lb-next" aria-label="Next photo" onClick={e=>{e.stopPropagation();step(1)}}><ChevronRight/></button>
      <span className="tz-lb-count">{open+1} / {shown.length}</span>
    </div>}
  </>;
}

type Reel={file:string;title:string;cat:string;src:string;poster:string};
export function TalentReels({reels}:{reels:Reel[]}){
  const [open,setOpen]=useState<Reel|null>(null);const ref=useRef<HTMLVideoElement>(null);
  useEffect(()=>{if(!open)return;const k=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null)};addEventListener('keydown',k);document.body.style.overflow='hidden';ref.current?.play().catch(()=>{});return()=>{removeEventListener('keydown',k);document.body.style.overflow=''}},[open]);
  return <>
    <div className="tz-reels">{reels.map(r=><button type="button" key={r.file} className="tz-reel" onClick={()=>setOpen(r)} aria-label={`Play video: ${r.title}`}>
      <img src={r.poster} alt="" loading="lazy" width={540} height={960}/><span className="tz-play"><Play size={22}/></span><span className="tz-reel-meta"><small>{r.cat}</small>{r.title}</span>
    </button>)}</div>
    {open&&<div className="tz-lightbox" role="dialog" aria-modal="true" aria-label={open.title} onClick={()=>setOpen(null)}>
      <video ref={ref} src={open.src} poster={open.poster} controls playsInline onClick={e=>e.stopPropagation()}/>
      <button type="button" className="tz-lb-close" aria-label="Close" onClick={()=>setOpen(null)}><X/></button>
    </div>}
  </>;
}
