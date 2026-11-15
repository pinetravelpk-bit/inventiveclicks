import Link from 'next/link';
import {Check,AlertTriangle,MapPin,Target,Wallet,ArrowRight} from 'lucide-react';
import {Tag} from './Inner';
import {serviceLongform} from '../lib/service-longform';
import {extras} from '../lib/longform/extras';
import {extras2} from '../lib/longform/extras2';

// Long-form, question-led sections for a service page. Renders nothing for services
// without an entry in lib/service-longform.ts, so pages degrade gracefully.
export default function ServiceLongform({slug,name}:{slug:string;name:string}){
  const L=serviceLongform[slug];if(!L)return null;// Keep acronyms such as SEO and PPC in capitals inside sentences.
  const lower=/^[A-Z0-9&/ ]+$/.test(name)?name:name.toLowerCase();const X=extras[slug];const Y=extras2[slug];
  return <div className="lf">
    <section className="container inner-section lf-why"><div className="section-top"><div><Tag>WHY IT MATTERS</Tag><h2>Why does {lower} matter now?</h2></div></div><div className="lf-prose">{L.why.map(p=><p key={p.slice(0,30)}>{p}</p>)}</div></section>

    <section className="container inner-section lf-split"><div><Tag>IS IT RIGHT FOR YOU?</Tag><h2>Who is {lower} for?</h2><p className="lf-muted">{name} delivers the most when one of these describes your situation.</p></div><ul className="lf-check">{L.audience.map(a=><li key={a}><Check size={16}/><span>{a}</span></li>)}</ul></section>

    <section className="container inner-section"><div className="section-top"><div><Tag>OUR APPROACH</Tag><h2>How do we approach {lower}?</h2></div><p>The work is shaped to your business, but the thinking follows the same path every time.</p></div><div className="lf-approach">{L.approach.map(([t,d],i)=><article className="lf-step reveal" key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section className="container inner-section lf-split lf-cost"><div><Tag>SCOPE & INVESTMENT</Tag><h2>What affects the cost and timeline?</h2><p className="lf-muted">Every proposal is priced from the work involved. These are the factors that move it most.</p></div><ul className="lf-check"><li className="lf-icon"><Wallet size={18}/></li>{L.cost.map(c=><li key={c}><Check size={16}/><span>{c}</span></li>)}</ul></section>

    <section className="container inner-section lf-measure"><div className="section-top"><div><Tag>RESULTS</Tag><h2>How do we measure {lower} success?</h2></div></div><div className="lf-measure-grid"><p className="large-copy">{L.measure.intro}</p><ul className="lf-metrics">{L.measure.metrics.map(m=><li key={m}><Target size={15}/>{m}</li>)}</ul></div></section>

    <section className="container inner-section lf-local"><div className="lf-local-head"><MapPin size={22}/><div><Tag>PAKISTAN & THE USA</Tag><h2>{name} for businesses in Pakistan and the United States</h2></div></div><div className="lf-prose lf-two">{L.local.map(p=><p key={p.slice(0,30)}>{p}</p>)}</div></section>

    <section className="container inner-section lf-split"><div><Tag>AVOID THE USUAL TRAPS</Tag><h2>Common {lower} mistakes we help you avoid</h2></div><ul className="lf-check lf-warn">{L.mistakes.map(m=><li key={m}><AlertTriangle size={16}/><span>{m}</span></li>)}</ul></section>

    {X&&<section className="container inner-section"><div className="section-top"><div><Tag>TYPICAL TIMELINE</Tag><h2>How long does {lower} take?</h2></div><p>Timelines depend on scope, but most engagements follow this shape.</p></div><div className="lf-approach lf-four">{X.timeline.map(([t,d],i)=><article className="lf-step reveal" key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>}

    {X&&<section className="container inner-section lf-split"><div><Tag>BEFORE WE START</Tag><h2>What should you prepare?</h2><p className="lf-muted">Having these ready makes the first weeks faster. If something is missing, we help you gather it.</p></div><ul className="lf-check">{X.prepare.map(p=><li key={p}><Check size={16}/><span>{p}</span></li>)}</ul></section>}

    {X&&<section className="container inner-section"><div className="section-top"><div><Tag>KEY TERMS</Tag><h2>{name} terms explained</h2></div><p>The words you will hear in proposals and reports, in plain language.</p></div><dl className="lf-glossary">{X.glossary.map(([t,d])=><div key={t} className="reveal"><dt>{t}</dt><dd>{d}</dd></div>)}</dl></section>}

    {Y&&<section className="container inner-section lf-split"><div><Tag>DO YOU NEED THIS NOW?</Tag><h2>Signs it is time for {lower}</h2></div><ul className="lf-check">{Y.signals.map(x=><li key={x}><Check size={16}/><span>{x}</span></li>)}</ul></section>}

    {Y&&<section className="container inner-section"><div className="section-top"><div><Tag>WAYS TO WORK TOGETHER</Tag><h2>How can you engage us for {lower}?</h2></div><p>Three common models; your proposal will recommend the one that fits.</p></div><div className="lf-approach">{Y.models.map(([t,d],i)=><article className="lf-step reveal" key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>}

    {Y&&<section className="container inner-section"><div className="section-top"><div><Tag>WORKS WELL WITH</Tag><h2>Which services connect with {lower}?</h2></div></div><div className="lf-route">{Y.related.map(([n,h,d])=><Link href={h} className="lf-route-card reveal" key={h}><strong>{n}</strong><span>{d}</span><em>Explore {n} <ArrowRight size={13}/></em></Link>)}</div></section>}

    <section className="container lf-band reveal ic-glow"><div><h2>Ready to plan your {lower}?</h2><p>Tell us your goal, current setup and deadline. We will reply with questions, a suggested scope and a written proposal.</p></div><Link className="primary" href={`/contact?service=${encodeURIComponent(name)}`}>Get a proposal <ArrowRight size={17}/></Link></section>
  </div>;
}

export function longformFaq(slug:string):[string,string][]{return serviceLongform[slug]?.faq||[]}
