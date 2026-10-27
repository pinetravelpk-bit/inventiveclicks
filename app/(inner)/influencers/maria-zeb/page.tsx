import type {Metadata} from 'next';
import Link from 'next/link';
import {Playfair_Display,Great_Vibes} from 'next/font/google';
import {Instagram,ChevronDown,Mic2,Camera,Sparkles,Tv} from 'lucide-react';
import {JsonLd,BreadcrumbData,siteUrl,ogDefaults} from '../../../../components/StructuredData';
import {HeroVideo,TalentGallery,TalentReels} from '../../../../components/talent/TalentMedia';
import BookingForm from '../../../../components/talent/BookingForm';
import {maria,roleCards,stages,gallery,galleryCats,reels,bookingTypes} from '../../../../lib/talent/maria-zeb';
import './talent.css';

const display=Playfair_Display({subsets:['latin'],weight:['400','600','700'],style:['normal','italic'],variable:'--tz-display'});
const script=Great_Vibes({subsets:['latin'],weight:'400',variable:'--tz-script'});

const url='/influencers/'+maria.slug;
const roleLine=maria.roles.join(' • ');
export const metadata:Metadata={
  title:`${maria.name} | ${roleLine}`,
  description:`${maria.name} is a singer, model, content creator and host. See her portfolio, live performances and videos, and book Maria for events, shoots, hosting and brand collaborations.`,
  alternates:{canonical:url},
  openGraph:{...ogDefaults,type:'profile',title:`${maria.name} | ${roleLine}`,description:maria.intro,url,images:[{url:'/talent/maria-zeb/og.jpg',width:1200,height:630,alt:`${maria.name}, ${roleLine}`}]},
  twitter:{card:'summary_large_image',images:['/talent/maria-zeb/og.jpg']},
};

const roleIcons=[Mic2,Camera,Sparkles,Tv];
const base='/talent/maria-zeb';

export default function MariaZeb(){return <div className={`tz ${display.variable} ${script.variable}`}>
  <JsonLd data={{'@type':'ProfilePage','@id':siteUrl+url+'#page',url:siteUrl+url,name:`${maria.name} | ${roleLine}`,mainEntity:{'@type':'Person','@id':siteUrl+url+'#person',name:maria.name,description:[maria.intro,...maria.bio].join(' '),jobTitle:maria.roles,image:siteUrl+maria.portrait,url:siteUrl+url,sameAs:maria.socials.map(s=>s.url)}}}/>
  <BreadcrumbData items={[{name:'Influencers',path:'/influencers'},{name:maria.name,path:url}]}/>

  <section className="tz-hero" aria-label={`${maria.name} introduction`}>
    <HeroVideo hero={maria.hero}/>
    <div className="tz-hero-shade"/>
    <div className="tz-hero-inner">
      <p className="tz-kicker">Inventive Clicks talent</p>
      <h1><span className="tz-brush" aria-hidden="true"/>{maria.name}</h1>
      <p className="tz-roles">{maria.roles.map((r,i)=><span key={r}>{i>0&&<i aria-hidden="true">•</i>}{r}</span>)}</p>
      <div className="tz-hero-actions"><a className="tz-btn" href="#book">Book Maria</a><a className="tz-btn ghost" href="#reels">Watch videos</a></div>
      <div className="tz-socials">{maria.socials.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener" aria-label={`${maria.name} on ${s.label}`}><Instagram size={17}/></a>)}</div>
    </div>
    <a className="tz-scroll" href="#about" aria-label="Scroll to about"><ChevronDown/></a>
  </section>

  <section id="about" className="tz-about tz-wrap">
    <div className="tz-portrait"><span className="tz-brush big" aria-hidden="true"/><img src={maria.portrait} alt={`Portrait of ${maria.name}`} width={788} height={1400}/></div>
    <div className="tz-about-copy">
      <p className="tz-script">Hello!</p>
      <h2>I’m {maria.name}</h2>
      <p className="tz-lead">{maria.intro}</p>
      {maria.bio.map(p=><p key={p.slice(0,20)}>{p}</p>)}
      <div className="tz-sign"><span className="tz-sign-name">{maria.name}</span><span className="tz-sign-role">{roleLine}</span></div>
      <a className="tz-btn" href="#book">Book Maria</a>
    </div>
  </section>

  <section className="tz-section tz-wrap" aria-labelledby="tz-roles-h">
    <header className="tz-head"><p className="tz-script">What she does</p><h2 id="tz-roles-h">Four stages. One artist.</h2></header>
    <div className="tz-role-grid">{roleCards.map((r,i)=>{const I=roleIcons[i];return <article key={r.title} className="tz-role">
      <img src={r.image} alt={`${maria.name} as a ${r.title.toLowerCase()}`} width={640} height={800} loading="lazy"/>
      <div><I size={22}/><h3>{r.title}</h3><p>{r.text}</p></div>
    </article>})}</div>
  </section>

  <section className="tz-section tz-stage" aria-labelledby="tz-stage-h">
    <div className="tz-wrap">
      <header className="tz-head"><p className="tz-script">Live</p><h2 id="tz-stage-h">On stage</h2><p className="tz-sub">Festivals and live shows where Maria has performed.</p></header>
      <div className="tz-stage-grid">{stages.map(s=><figure key={s.poster}><img src={s.poster} alt={`${s.event}: ${s.detail}`} loading="lazy" width={1050} height={1400}/><figcaption><strong>{s.event}</strong><span>{s.detail}</span></figcaption></figure>)}</div>
    </div>
  </section>

  <section id="portfolio" className="tz-section tz-wrap" aria-labelledby="tz-port-h">
    <header className="tz-head"><p className="tz-script">Portfolio</p><h2 id="tz-port-h">Fashion, stage &amp; studio</h2></header>
    <TalentGallery photos={gallery} cats={galleryCats} base={base}/>
  </section>

  <section id="reels" className="tz-section tz-wrap" aria-labelledby="tz-reels-h">
    <header className="tz-head"><p className="tz-script">Watch</p><h2 id="tz-reels-h">Reels &amp; performances</h2><p className="tz-sub">Tap a video to play it with sound.</p></header>
    <TalentReels reels={reels}/>
  </section>

  <section id="book" className="tz-section tz-book" aria-labelledby="tz-book-h">
    <div className="tz-wrap tz-book-grid">
      <div>
        <p className="tz-script">Let’s work together</p>
        <h2 id="tz-book-h">Book {maria.name}</h2>
        <p>For live performances, photoshoots and fashion campaigns, hosting and anchoring, brand collaborations and content creation. Bookings are managed by the Inventive Clicks talent team.</p>
        <ul className="tz-book-list">{bookingTypes.filter(t=>t!=='Other').map(t=><li key={t}>{t}</li>)}</ul>
        <p className="tz-back"><Link href="/influencers">← Back to the influencer network</Link></p>
      </div>
      <BookingForm talent={maria.slug} talentName={maria.name} types={bookingTypes}/>
    </div>
  </section>
</div>}
