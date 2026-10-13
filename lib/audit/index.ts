// Website Deep Audit engine. Runs on our own server with no paid API keys: fetches the
// page, robots.txt, sitemap and llms.txt, checks resources and links, crawls up to 25
// internal pages, and adds free off-page signals (Tranco, RDAP, Internet Archive,
// Wikidata). Google PageSpeed is added only when PAGESPEED_API_KEY is set.
import {parse,type HTMLElement} from 'node-html-parser';
import {safeFetch,mapLimit,type FetchResult} from './net';
import {offPageSignals} from './offpage';

export type Status='pass'|'warn'|'fail'|'info';
export type Check={id:string;label:string;status:Status;detail:string;fix?:string;value?:string;weight:number};
export type Category={id:string;label:string;score:number;checks:Check[]};
export type PageRow={url:string;status:number;ms:number;title:string;description:string;h1:number;words:number;canonical:string;noindex:boolean;redirected:boolean;issues:string[]};
export type BrokenLink={url:string;status:number;error?:string;from:string;internal:boolean};
export type Report={url:string;finalUrl:string;host:string;auditedAt:string;durationMs:number;score:number;grade:string;deep:boolean;
  categories:Category[];priorities:(Check&{category:string})[];pages:PageRow[];brokenLinks:BrokenLink[];
  stats:{ttfb:number;htmlKb:number;pageWeightKb:number;requests:number;internalLinks:number;externalLinks:number;images:number;words:number;schemaTypes:string[];pagesCrawled:number;linksChecked:number;trancoRank:number|null;domainAgeYears:number|null};
  psi?:{performance:number;accessibility:number;bestPractices:number;seo:number;lcp:string;cls:string;tbt:string;fcp:string}};

const AI_BOTS=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-SearchBot','PerplexityBot','Google-Extended','Applebot-Extended','CCBot'];
const SOCIAL:[string,RegExp][]=[['Facebook',/facebook\.com\//i],['Instagram',/instagram\.com\//i],['LinkedIn',/linkedin\.com\/(company|in)\//i],['X / Twitter',/(twitter|x)\.com\//i],['YouTube',/youtube\.com\//i],['TikTok',/tiktok\.com\//i],['Pinterest',/pinterest\.[a-z.]+\//i]];
const LOCAL_TYPES=/LocalBusiness|ProfessionalService|Store|Restaurant|MedicalBusiness|Dentist|Physician|LegalService|Attorney|HomeAndConstructionBusiness|AutomotiveBusiness|FinancialService|RealEstateAgent|TravelAgency|LodgingBusiness|HealthAndBeautyBusiness|EducationalOrganization|FoodEstablishment|SportsActivityLocation/i;
const c=(id:string,label:string,status:Status,detail:string,fix?:string,value?:string,weight=1):Check=>({id,label,status,detail,fix,value,weight});
const kb=(b:number)=>Math.round(b/102.4)/10;
const text=(el:HTMLElement|null|undefined)=>(el?.text||'').replace(/\s+/g,' ').trim();
const plural=(n:number,w:string)=>`${n} ${w}${n===1?'':'s'}`;

function absolute(href:string|undefined,base:string){if(!href)return null;try{const u=new URL(href.trim(),base);if(!/^https?:$/.test(u.protocol))return null;u.hash='';return u.toString()}catch{return null}}
const sameSite=(a:string,b:string)=>a.replace(/^www\./,'')===b.replace(/^www\./,'');

function bodyText(root:HTMLElement){const body=root.querySelector('body')||root;const clone=parse(body.toString());clone.querySelectorAll('script,style,noscript,svg,template').forEach(n=>n.remove());return text(clone)}
const countWords=(t:string)=>t.split(' ').filter(w=>/[\p{L}\p{N}]/u.test(w)).length;

type Node=Record<string,unknown>;
function schema(root:HTMLElement){
  const nodes:Node[]=[];let invalid=0;
  const walk=(n:unknown)=>{if(Array.isArray(n))return n.forEach(walk);if(n&&typeof n==='object'){const o=n as Node;if(o['@type'])nodes.push(o);if(o['@graph'])walk(o['@graph']);for(const v of Object.values(o))if(v&&typeof v==='object')walk(v)}};
  for(const s of root.querySelectorAll('script[type="application/ld+json"]')){try{walk(JSON.parse(s.rawText))}catch{invalid++}}
  const typeOf=(o:Node)=>(Array.isArray(o['@type'])?o['@type']:[o['@type']]).map(String);
  const types=[...new Set(nodes.flatMap(typeOf))];
  if(root.querySelector('[itemtype]'))types.push('Microdata');
  return {nodes,types,invalid,typeOf};
}

function pageInfo(url:string,html:string){
  const root=parse(html,{comment:false,blockTextElements:{script:true,style:true,noscript:true}});
  const meta=(n:string)=>root.querySelector(`meta[name="${n}" i]`)?.getAttribute('content')?.trim()||root.querySelector(`meta[property="${n}" i]`)?.getAttribute('content')?.trim()||'';
  return {root,title:text(root.querySelector('title')),description:meta('description'),robots:meta('robots').toLowerCase(),
    canonical:absolute(root.querySelector('link[rel="canonical" i]')?.getAttribute('href'),url)||'',h1:root.querySelectorAll('h1').length,meta};
}

function robotsBlocks(robots:string,bot:string){
  const groups:{agents:string[];rules:string[]}[]=[];let cur:{agents:string[];rules:string[]}|null=null;let last='';
  for(const raw of robots.split(/\r?\n/)){const line=raw.replace(/#.*/,'').trim();const m=line.match(/^([a-z-]+)\s*:\s*(.*)$/i);if(!m)continue;const k=m[1].toLowerCase(),v=m[2].trim();
    if(k==='user-agent'){if(!cur||last!=='user-agent'){cur={agents:[],rules:[]};groups.push(cur)}cur.agents.push(v.toLowerCase())}
    else if(cur&&(k==='disallow'||k==='allow'))cur.rules.push(k+':'+v);last=k}
  const g=groups.filter(g=>g.agents.some(a=>a!=='*'&&bot.toLowerCase().includes(a)));const use=g.length?g:groups.filter(g=>g.agents.includes('*'));
  const rules=use.flatMap(g=>g.rules);return rules.includes('disallow:/')&&!rules.includes('allow:/');
}

function readability(t:string){
  const sentences=t.split(/[.!?]+\s/).filter(s=>countWords(s)>2);const w=countWords(t);if(!sentences.length||w<50)return null;
  const syl=t.toLowerCase().split(/\s+/).reduce((s,word)=>s+Math.max(1,(word.replace(/[^a-z]/g,'').replace(/e$/,'').match(/[aeiouy]+/g)||[]).length),0);
  return {ease:Math.round(206.835-1.015*(w/sentences.length)-84.6*(syl/w)),avgSentence:Math.round(w/sentences.length)};
}

function score(checks:Check[]){const scored=checks.filter(x=>x.status!=='info');const total=scored.reduce((s,x)=>s+x.weight,0);if(!total)return 100;return Math.round(scored.reduce((s,x)=>s+x.weight*(x.status==='pass'?1:x.status==='warn'?0.5:0),0)/total*100)}
const grade=(s:number)=>s>=90?'A':s>=80?'B':s>=70?'C':s>=60?'D':'F';

async function pagespeed(url:string){
  const key=process.env.PAGESPEED_API_KEY;if(!key)return undefined;
  try{const q=new URLSearchParams({url,strategy:'mobile',key});['performance','accessibility','best-practices','seo'].forEach(x=>q.append('category',x));
    const r=await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?'+q,{signal:AbortSignal.timeout(55000)});if(!r.ok)return undefined;
    const j=await r.json() as {lighthouseResult:{categories:Record<string,{score:number}>;audits:Record<string,{displayValue?:string}>}};const L=j.lighthouseResult;const s=(k:string)=>Math.round((L.categories[k]?.score||0)*100);const a=(k:string)=>L.audits[k]?.displayValue||'—';
    return {performance:s('performance'),accessibility:s('accessibility'),bestPractices:s('best-practices'),seo:s('seo'),lcp:a('largest-contentful-paint'),cls:a('cumulative-layout-shift'),tbt:a('total-blocking-time'),fcp:a('first-contentful-paint')};
  }catch{return undefined}
}

export async function runAudit(input:string,deep:boolean):Promise<Report>{
  const started=Date.now();
  const main=await safeFetch(input,{timeout:15000});
  if(!main.headers) throw new Error(main.error==='Host does not resolve to a public server'?'We could not find that website. Check the address and try again.':`We could not reach that website (${main.error||'no response'}).`);
  const finalUrl=main.url;const U=new URL(finalUrl);const origin=U.origin;const host=U.hostname;const H=main.headers;
  const isHtml=/html/i.test(H.get('content-type')||'')||/<html/i.test(main.body.slice(0,2000));
  const P=pageInfo(finalUrl,isHtml?main.body:'');const root=P.root;
  const pageText=bodyText(root);const wc=countWords(pageText);
  const S=schema(root);const types=S.types;

  // Links and resources on the page
  const anchorEls=root.querySelectorAll('a[href]');
  const anchors=anchorEls.map(a=>({raw:a.getAttribute('href')||'',href:absolute(a.getAttribute('href'),finalUrl),rel:(a.getAttribute('rel')||'').toLowerCase(),text:text(a)||a.querySelector('img')?.getAttribute('alt')||a.getAttribute('aria-label')||a.getAttribute('title')||''}));
  const web=anchors.filter(a=>a.href) as {raw:string;href:string;rel:string;text:string}[];
  const internal=[...new Set(web.filter(a=>sameSite(new URL(a.href).hostname,host)).map(a=>a.href))];
  const external=[...new Set(web.filter(a=>!sameSite(new URL(a.href).hostname,host)).map(a=>a.href))];
  const scripts=root.querySelectorAll('script[src]').map(s=>absolute(s.getAttribute('src'),finalUrl)).filter(Boolean) as string[];
  const inlineJs=root.querySelectorAll('script:not([src])').map(s=>s.rawText).join('\n');
  const allJs=scripts.join(' ')+' '+inlineJs;
  const styles=root.querySelectorAll('link[rel~="stylesheet" i]').map(s=>absolute(s.getAttribute('href'),finalUrl)).filter(Boolean) as string[];
  const imgs=root.querySelectorAll('img');
  const imgSrcs=imgs.map(i=>absolute(i.getAttribute('src')||i.getAttribute('data-src'),finalUrl)).filter(Boolean) as string[];
  const headBlocking=(root.querySelector('head')?.querySelectorAll('script[src]')||[]).filter(s=>!s.hasAttribute('async')&&!s.hasAttribute('defer')&&s.getAttribute('type')!=='module').length;

  const httpUrl='http://'+host+'/';
  const altHost=host.startsWith('www.')?host.slice(4):'www.'+host;
  const rand='ic-audit-'+Math.random().toString(36).slice(2,10);
  const [httpRes,altRes,robotsRes,llmsRes,soft404,psi,off]=await Promise.all([
    safeFetch(httpUrl,{readBody:false,timeout:8000}),
    safeFetch('https://'+altHost+'/',{readBody:false,timeout:8000}),
    safeFetch(origin+'/robots.txt',{timeout:8000,maxBytes:300_000}),
    safeFetch(origin+'/llms.txt',{timeout:8000,maxBytes:200_000}),
    safeFetch(origin+'/'+rand,{timeout:8000,maxBytes:50_000}),
    pagespeed(finalUrl),
    offPageSignals(host),
  ]);
  const robots=robotsRes.status===200&&!/<html/i.test(robotsRes.body.slice(0,500))?robotsRes.body:'';
  const sitemapUrls=[...robots.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map(m=>m[1]);
  const sitemapRes=await safeFetch(sitemapUrls[0]||origin+'/sitemap.xml',{timeout:10000,maxBytes:5_000_000});
  const sitemapOk=sitemapRes.status===200&&/<(urlset|sitemapindex)/i.test(sitemapRes.body);
  const sitemapLocs=sitemapOk?[...sitemapRes.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m=>m[1].replace(/&amp;/g,'&')):[];
  const isIndex=/<sitemapindex/i.test(sitemapRes.body);

  // Resource sizes (first 30 assets)
  const assets=[...new Set([...scripts,...styles,...imgSrcs])].slice(0,30);
  const assetRes=await mapLimit(assets,8,a=>safeFetch(a,{method:'HEAD',readBody:false,timeout:8000}));
  const assetBytes=assetRes.reduce((s,r)=>s+(r.bytes||0),0);
  const bigImages=imgSrcs.filter(src=>{const r=assetRes[assets.indexOf(src)];return r&&r.bytes>300_000});
  const legacyImgs=imgSrcs.filter(s=>/\.(jpe?g|png|gif|bmp)(\?|$)/i.test(s)).length;

  // Deep crawl: up to 25 more internal pages from links and the sitemap
  const pages:PageRow[]=[];const seen=new Set([finalUrl]);
  const rowFor=(r:FetchResult,url:string):PageRow=>{
    const info=pageInfo(url,r.body);const w=r.status<400?countWords(bodyText(info.root)):0;const noindex=/noindex/.test(info.robots)||/noindex/i.test(r.headers?.get('x-robots-tag')||'');const issues:string[]=[];
    if(r.status>=400||r.status===0)issues.push(r.status?`HTTP ${r.status}`:(r.error||'No response'));
    else{if(!info.title)issues.push('Missing title');if(!info.description)issues.push('Missing meta description');if(info.h1===0)issues.push('No H1');if(info.h1>1)issues.push('Multiple H1s');if(w<300)issues.push('Thin content');if(!info.canonical)issues.push('No canonical');if(noindex)issues.push('noindex');if((r.ttfb??r.ms)>1500)issues.push('Slow response');if(r.chain.length)issues.push('Reached via redirect')}
    return {url,status:r.status,ms:r.ttfb??r.ms,title:info.title,description:info.description,h1:info.h1,words:w,canonical:info.canonical,noindex,redirected:r.chain.length>0,issues};
  };
  pages.push({...rowFor(main,finalUrl),redirected:false,issues:rowFor(main,finalUrl).issues.filter(i=>i!=='Reached via redirect')});
  if(deep){
    let queue=[...internal,...sitemapLocs.filter(()=>!isIndex)].filter(u=>{try{const x=new URL(u);return sameSite(x.hostname,host)&&!/\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|xml|txt|css|js)(\?|$)/i.test(x.pathname)}catch{return false}});
    while(pages.length<26&&queue.length&&Date.now()-started<40000){
      const batch=[...new Set(queue)].filter(u=>!seen.has(u)).slice(0,Math.min(5,26-pages.length));queue=queue.filter(u=>!batch.includes(u));
      if(!batch.length)break;batch.forEach(u=>seen.add(u));
      const res=await mapLimit(batch,5,u=>safeFetch(u,{timeout:9000,maxBytes:1_500_000}));
      res.forEach((r,i)=>{if(r.headers&&!/html/i.test(r.headers.get('content-type')||'html'))return;pages.push(rowFor(r,batch[i]));
        if(r.status<400&&r.body){const more=parse(r.body).querySelectorAll('a[href]').map(a=>absolute(a.getAttribute('href'),r.url)).filter((u):u is string=>!!u&&sameSite(new URL(u).hostname,host));queue.push(...more)}});
    }
  }

  // Broken links: internal links not already crawled, plus external links
  const crawled=new Map(pages.map(p=>[p.url,p.status]));
  const toCheck=[...internal.filter(u=>!crawled.has(u)).slice(0,deep?40:25).map(u=>({u,internal:true})),...external.slice(0,deep?20:12).map(u=>({u,internal:false}))];
  const linkRes=Date.now()-started<50000?await mapLimit(toCheck,10,({u})=>safeFetch(u,{method:'HEAD',readBody:false,timeout:7000}).then(r=>[405,403,501].includes(r.status)?safeFetch(u,{timeout:7000,maxBytes:20_000}):r)):[];
  const brokenLinks:BrokenLink[]=[
    ...pages.filter(p=>p.status>=400||p.status===0).map(p=>({url:p.url,status:p.status,from:finalUrl,internal:true,error:p.status?undefined:'No response'})),
    ...linkRes.map((r,i)=>({r,l:toCheck[i]})).filter(({r,l})=>r.status===404||r.status===410||r.status>=500||(r.status===0&&l.internal)).map(({r,l})=>({url:l.u,status:r.status,error:r.error,from:finalUrl,internal:l.internal})),
  ].slice(0,60);
  const redirectedLinks=linkRes.filter((r,i)=>toCheck[i].internal&&r.chain.length>0).length+pages.filter(p=>p.redirected).length;

  // ---------- shared facts ----------
  const https=U.protocol==='https:';
  const ttfb=main.ttfb??main.ms;
  const enc=(H.get('content-encoding')||'').toLowerCase();
  const csp=H.get('content-security-policy')||'';
  const serverHdr=H.get('server')||'';const powered=H.get('x-powered-by')||'';
  const mixed=https?root.querySelectorAll('img[src^="http:" i],script[src^="http:" i],iframe[src^="http:" i],link[href^="http:" i][rel~="stylesheet" i],source[src^="http:" i]').length:0;
  const headings=root.querySelectorAll('h1,h2,h3,h4,h5,h6');const levels=headings.map(h=>Number(h.tagName[1]));
  const skipped=levels.some((lv,i)=>i>0&&lv>levels[i-1]+1);
  const altMissing=imgs.filter(i=>!i.hasAttribute('alt')).length;
  const noDims=imgs.filter(i=>!(i.getAttribute('width')&&i.getAttribute('height'))&&!/width|height|aspect-ratio/i.test(i.getAttribute('style')||'')).length;
  const lazy=imgs.filter(i=>i.getAttribute('loading')==='lazy').length;
  const noindex=/noindex/.test(P.robots)||/noindex/i.test(H.get('x-robots-tag')||'');
  const emptyAnchors=web.filter(a=>!a.text.trim()).length;
  const httpRedirects=httpRes.chain.length>0&&httpRes.url.startsWith('https://');
  const altConsistent=altRes.headers?new URL(altRes.url).hostname===host:null;
  const blockedBots=robots?AI_BOTS.filter(b=>robotsBlocks(robots,b)):[];
  const blocksAll=robots?robotsBlocks(robots,'Googlebot'):false;
  const llmsOk=llmsRes.status===200&&!/<html/i.test(llmsRes.body.slice(0,500))&&llmsRes.body.trim().length>20;
  const orgNode=S.nodes.find(n=>S.typeOf(n).some(t=>/Organization|Corporation|LocalBusiness/.test(t)||LOCAL_TYPES.test(t)));
  const localNode=S.nodes.find(n=>S.typeOf(n).some(t=>LOCAL_TYPES.test(t)));
  const sameAs=[orgNode?.sameAs].flat().filter(Boolean) as string[];
  const hasFaq=types.includes('FAQPage');
  const titleLen=P.title.length,descLen=P.description.length;
  const crawledOk=pages.filter(p=>p.status>0&&p.status<400);
  const viewport=root.querySelector('meta[name="viewport" i]')?.getAttribute('content')||'';
  const lang=root.querySelector('html')?.getAttribute('lang')||'';
  const questions=headings.filter(h=>/\?\s*$/.test(text(h))||/^(what|how|why|when|where|who|which|can|do|does|is|are|should)\b/i.test(text(h)));
  const answered=questions.filter(h=>{const n=h.nextElementSibling;const w=n?countWords(text(n)):0;return n&&/^(P|DIV|UL|OL)$/.test(n.tagName)&&w>=15&&w<=120}).length;
  const lists=root.querySelectorAll('ul li,ol li').length;const tables=root.querySelectorAll('table').length;
  const phoneLinks=root.querySelectorAll('a[href^="tel:" i]').length;
  const phoneText=/(\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/.test(pageText);
  const mapLink=web.some(a=>/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|maps\.apple\.com|bing\.com\/maps/i.test(a.href))||root.querySelectorAll('iframe[src*="google.com/maps" i],iframe[src*="maps.google" i]').length>0;
  const linkTo=(re:RegExp)=>internal.some(u=>re.test(new URL(u).pathname));
  const socials=SOCIAL.filter(([,re])=>web.some(a=>re.test(a.href))||sameAs.some(s=>re.test(s))).map(([n])=>n);
  const author=P.meta('author')||S.nodes.find(n=>n.author)?.author||root.querySelector('[rel="author"],.author,[itemprop="author"]');
  const modified=P.meta('article:modified_time')||String(S.nodes.find(n=>n.dateModified)?.dateModified||'')||H.get('last-modified')||'';
  const year=new Date().getFullYear();const copyright=new RegExp(`(©|copyright)[^\\n]{0,40}${year}`,'i').test(pageText);
  const numbers=(pageText.match(/\b\d+(\.\d+)?\s?(%|percent|x|k|m|million|billion|years?|customers|clients|projects)\b/gi)||[]).length;
  const authorityLinks=external.filter(u=>/\.(gov|edu)(\.[a-z]{2})?\//i.test(u)||/wikipedia\.org|who\.int|nih\.gov|google\.com\/search\/docs|developers\.google\.com|w3\.org/i.test(u)).length;
  const read=readability(pageText);
  const h1Text=text(root.querySelector('h1')).toLowerCase();const titleWords=P.title.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>3);
  const titleH1Overlap=h1Text&&titleWords.some(w=>h1Text.includes(w));
  const analytics=[[/googletagmanager\.com\/gtm|GTM-[A-Z0-9]+/,'Google Tag Manager'],[/gtag\(|googletagmanager\.com\/gtag|G-[A-Z0-9]{6,}/,'Google Analytics 4'],[/clarity\.ms/,'Microsoft Clarity'],[/plausible\.io|umami|matomo|fathom|simpleanalytics/i,'Privacy analytics'],[/connect\.facebook\.net|fbq\(/,'Meta Pixel'],[/hotjar/i,'Hotjar']].filter(([re])=>(re as RegExp).test(allJs)).map(([,n])=>n as string);
  const verify=[['google-site-verification','Google Search Console'],['msvalidate.01','Bing Webmaster Tools'],['facebook-domain-verification','Meta'],['p:domain_verify','Pinterest']].filter(([n])=>P.meta(n)).map(([,l])=>l);
  const og=['og:title','og:description','og:image'].filter(k=>!P.meta(k));
  const unlabeled=root.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').filter(el=>{const id=el.getAttribute('id');return !el.getAttribute('aria-label')&&!el.getAttribute('aria-labelledby')&&!el.getAttribute('title')&&!(id&&root.querySelector(`label[for="${id}"]`))&&!el.closest('label')&&!el.getAttribute('placeholder')}).length;
  const unnamedButtons=root.querySelectorAll('button').filter(b=>!text(b)&&!b.getAttribute('aria-label')&&!b.getAttribute('title')).length;
  const iframesNoTitle=root.querySelectorAll('iframe').filter(f=>!f.getAttribute('title')).length;
  const ageYears=off.registered?Math.floor((Date.now()-Date.parse(off.registered))/31557600000):null;
  const archiveYears=off.firstArchived?year-Number(off.firstArchived.slice(0,4)):null;

  // ---------- categories ----------
  const seo:Check[]=[
    main.status===200?c('status','Page status','pass','The page returns HTTP 200.',undefined,'200',3):c('status','Page status','fail',`The page returns HTTP ${main.status}.`,'Make sure the page returns 200 OK.',String(main.status),3),
    noindex?c('noindex','Indexable','fail','The page is set to noindex, so it will not appear in Google.','Remove “noindex” from the robots meta tag or X-Robots-Tag header.',undefined,3):c('noindex','Indexable','pass','The page can be indexed.',undefined,undefined,3),
    !P.title?c('title','Title tag','fail','No title tag found.','Add a unique title of 30–60 characters with your main keyword.',undefined,3):titleLen<30||titleLen>60?c('title','Title tag','warn',`Title is ${titleLen} characters: “${P.title}”.`,'Keep titles between 30 and 60 characters so they are not cut off in search results.',String(titleLen),2):c('title','Title tag','pass',`“${P.title}” (${titleLen} characters).`,undefined,String(titleLen),2),
    !P.description?c('description','Meta description','fail','No meta description.','Add a 70–160 character description that tells searchers what they will get.',undefined,2):descLen<70||descLen>160?c('description','Meta description','warn',`Description is ${descLen} characters.`,'Aim for 70–160 characters.',String(descLen)):c('description','Meta description','pass',`${descLen} characters: “${P.description.slice(0,110)}${descLen>110?'…':''}”`,undefined,String(descLen)),
    P.h1===1?c('h1','H1 heading','pass',`One H1: “${text(root.querySelector('h1')).slice(0,90)}”.`,undefined,undefined,2):P.h1===0?c('h1','H1 heading','fail','No H1 heading on the page.','Add one H1 that states the page’s main topic.',undefined,2):c('h1','H1 heading','warn',`${P.h1} H1 headings found.`,'Use a single H1 per page; use H2/H3 for sections.'),
    titleH1Overlap?c('title-h1','Title and H1 match','pass','The title and H1 share the main topic.'):c('title-h1','Title and H1 match','warn','The title and H1 do not share keywords.','Use your main keyword in both the title and the H1.'),
    skipped?c('heading-order','Heading structure','warn','Some heading levels are skipped (for example H2 to H4).','Use headings in order so search engines and screen readers understand the structure.'):c('heading-order','Heading structure','pass',`${plural(levels.length,'heading')} in a logical order.`),
    P.canonical?c('canonical','Canonical URL','pass',`Canonical: ${P.canonical}`):c('canonical','Canonical URL','warn','No canonical tag.','Add <link rel="canonical"> pointing to the preferred URL to avoid duplicate content.'),
    imgs.length===0?c('alt','Image alt text','info','No images on the page.'):altMissing?c('alt','Image alt text','warn',`${altMissing} of ${imgs.length} images have no alt attribute.`,'Describe each meaningful image in its alt text; use alt="" for decorative ones.',String(altMissing)):c('alt','Image alt text','pass',`All ${imgs.length} images have alt attributes.`),
    /[A-Z]/.test(U.pathname)||U.pathname.includes('_')||U.search.length>40?c('url','URL structure','warn','The URL has capitals, underscores or long parameters.','Use short, lowercase, hyphenated URLs.'):c('url','URL structure','pass','Clean, readable URL.'),
    internal.length<3?c('internal-links','Internal links','warn',`Only ${plural(internal.length,'internal link')}.`,'Link to your important pages so visitors and crawlers can find them.'):c('internal-links','Internal links','pass',`${internal.length} internal links.`),
    root.querySelector('link[rel~="icon" i]')?c('favicon','Favicon','pass','Favicon declared.'):c('favicon','Favicon','warn','No favicon link found.','Add a favicon so your brand shows in browser tabs and Google results.'),
  ];

  const technical:Check[]=[
    main.chain.length>1?c('redirects','Redirect chain','warn',`${main.chain.length} redirects before the final page: ${[...main.chain.map(h=>h.status),main.status].join(' → ')}.`,'Link straight to the final URL; each extra redirect slows the page and wastes crawl budget.'):c('redirects','Redirect chain','pass',main.chain.length?'One redirect to the final URL.':'No redirects.'),
    robots?(blocksAll?c('robots','robots.txt','fail','robots.txt blocks all search engines from the site.','Remove “Disallow: /” for User-agent: * unless the site should be hidden.',undefined,3):c('robots','robots.txt','pass','robots.txt found and allows crawling.',undefined,undefined,2)):c('robots','robots.txt','warn','No robots.txt file.','Add /robots.txt with a Sitemap: line.',undefined,2),
    sitemapOk?c('sitemap','XML sitemap','pass',isIndex?`Sitemap index with ${plural(sitemapLocs.length,'child sitemap')}.`:`Sitemap lists ${plural(sitemapLocs.length,'URL')}.`,undefined,undefined,2):c('sitemap','XML sitemap','warn','No XML sitemap found at robots.txt or /sitemap.xml.','Create a sitemap.xml, list it in robots.txt and submit it in Google Search Console.',undefined,2),
    robots&&sitemapOk&&!sitemapUrls.length?c('sitemap-robots','Sitemap in robots.txt','warn','The sitemap is not referenced in robots.txt.','Add “Sitemap: https://yoursite/sitemap.xml” to robots.txt.'):c('sitemap-robots','Sitemap in robots.txt',sitemapUrls.length?'pass':'info',sitemapUrls.length?'robots.txt points to the sitemap.':'Not applicable.'),
    altConsistent===null?c('www','www / non-www','info',`${altHost} did not respond.`):altConsistent?c('www','www / non-www','pass',`${altHost} redirects to ${host}.`):c('www','www / non-www','warn',`${altHost} does not redirect to ${host}.`,'Pick one version and 301-redirect the other to avoid duplicate sites in Google.'),
    ttfb<=600?c('ttfb','Server response time','pass',`${ttfb} ms to first byte.`,undefined,ttfb+' ms',2):ttfb<=1500?c('ttfb','Server response time','warn',`${ttfb} ms to first byte.`,'Aim for under 600 ms: use caching, a CDN or faster hosting.',ttfb+' ms',2):c('ttfb','Server response time','fail',`${ttfb} ms to first byte.`,'The server is slow. Add page caching, a CDN, or upgrade hosting.',ttfb+' ms',2),
    /br|gzip|zstd|deflate/.test(enc)?c('compression','Compression','pass',`Served with ${enc}.`):c('compression','Compression','warn','HTML is not compressed.','Enable Brotli or Gzip compression on the server.'),
    /^\s*<!doctype html/i.test(main.body)?c('doctype','HTML doctype','pass','<!DOCTYPE html> present.'):c('doctype','HTML doctype','warn','Missing <!DOCTYPE html>.','Start the page with <!DOCTYPE html>.'),
    root.querySelector('meta[charset]')||/charset/i.test(H.get('content-type')||'')?c('charset','Character encoding','pass','Encoding declared.'):c('charset','Character encoding','warn','No character encoding declared.','Add <meta charset="utf-8">.'),
    S.invalid?c('schema-valid','Structured data validity','fail',`${plural(S.invalid,'JSON-LD block')} could not be parsed.`,'Fix the JSON syntax and test it in Google’s Rich Results Test.',undefined,2):c('schema-valid','Structured data validity','pass',types.length?'All JSON-LD blocks parse correctly.':'No JSON-LD to validate.'),
    root.querySelectorAll('link[rel="alternate" i][hreflang]').length?c('hreflang','Hreflang','info',`${plural(root.querySelectorAll('link[rel="alternate" i][hreflang]').length,'hreflang tag')} for international versions.`):c('hreflang','Hreflang','info','No hreflang tags (only needed for multi-language sites).'),
  ];

  const htmlKb=kb(main.bytes);const weightKb=kb(main.bytes+assetBytes);
  const performance:Check[]=[
    htmlKb<=200?c('html-size','HTML size','pass',`${htmlKb} KB.`):htmlKb<=1000?c('html-size','HTML size','warn',`${htmlKb} KB of HTML.`,'Reduce inline code and unused markup.'):c('html-size','HTML size','fail',`${htmlKb} KB of HTML.`,'The HTML is very large; remove inline data and unused markup.'),
    weightKb<=2000?c('weight','Page weight','pass',`About ${weightKb} KB including ${assets.length} checked files.`,undefined,undefined,2):weightKb<=5000?c('weight','Page weight','warn',`About ${weightKb} KB.`,'Compress images and remove unused scripts.',undefined,2):c('weight','Page weight','fail',`About ${weightKb} KB.`,'The page is heavy; compress images, lazy-load below-the-fold media and cut unused JavaScript.',undefined,2),
    scripts.length+styles.length<=25?c('requests','Script and style files','pass',`${scripts.length} scripts, ${styles.length} stylesheets.`):c('requests','Script and style files','warn',`${scripts.length} scripts and ${styles.length} stylesheets.`,'Combine or remove files; each one adds a network request.'),
    headBlocking?c('render-blocking','Render-blocking scripts','warn',`${plural(headBlocking,'script')} in <head> without async or defer.`,'Add defer (or async) to scripts in the <head> so the page can render sooner.',String(headBlocking)):c('render-blocking','Render-blocking scripts','pass','No blocking scripts in <head>.'),
    imgs.length===0?c('img-format','Modern image formats','info','No images.'):legacyImgs>imgs.length/2?c('img-format','Modern image formats','warn',`${legacyImgs} of ${imgs.length} images use JPG/PNG/GIF.`,'Serve images as WebP or AVIF; they are typically 25–50% smaller.'):c('img-format','Modern image formats','pass','Most images use modern formats.'),
    bigImages.length?c('img-size','Large images','warn',`${plural(bigImages.length,'image')} over 300 KB.`,'Resize and compress large images to the size they are displayed at.',String(bigImages.length)):c('img-size','Large images','pass','No images over 300 KB among those checked.'),
    imgs.length===0?c('img-dims','Image dimensions','info','No images.'):noDims>2?c('img-dims','Image dimensions','warn',`${noDims} images have no width/height.`,'Set width and height on images to prevent layout shift (CLS).'):c('img-dims','Image dimensions','pass','Images declare their size.'),
    imgs.length<5?c('lazy','Lazy loading','info',`${plural(imgs.length,'image')} on the page.`):lazy?c('lazy','Lazy loading','pass',`${lazy} images lazy-load.`):c('lazy','Lazy loading','warn','No images use loading="lazy".','Add loading="lazy" to images below the fold.'),
    H.get('cache-control')?c('cache','Browser caching','info',`Cache-Control: ${H.get('cache-control')}`):c('cache','Browser caching','warn','No Cache-Control header on the page.','Set caching headers so returning visitors load the site faster.'),
  ];
  if(psi)performance.unshift(c('psi','Google PageSpeed (mobile)',psi.performance>=90?'pass':psi.performance>=50?'warn':'fail',`Performance score ${psi.performance}. LCP ${psi.lcp}, CLS ${psi.cls}, TBT ${psi.tbt}.`,'Work through the PageSpeed Insights suggestions, starting with the largest image and unused JavaScript.',String(psi.performance),3));

  const mobile:Check[]=[
    viewport?c('viewport','Mobile viewport','pass','Viewport meta tag present.',undefined,undefined,3):c('viewport','Mobile viewport','fail','No viewport meta tag, so the page will not scale on phones.','Add <meta name="viewport" content="width=device-width, initial-scale=1">.',undefined,3),
    /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport)?c('zoom','Pinch to zoom','warn','Zooming is disabled on mobile.','Remove user-scalable=no and maximum-scale=1 so people can zoom.'):c('zoom','Pinch to zoom','pass','Visitors can zoom the page.'),
    lang?c('lang','Language attribute','pass',`lang="${lang}"`):c('lang','Language attribute','warn','The <html> tag has no lang attribute.','Add lang="en" (or your language) to the <html> tag.'),
    unlabeled?c('labels','Form labels','warn',`${plural(unlabeled,'form field')} without a label.`,'Give every input a <label> or aria-label.',String(unlabeled)):c('labels','Form labels','pass','Form fields are labelled.'),
    unnamedButtons?c('buttons','Button names','warn',`${plural(unnamedButtons,'button')} without text or aria-label.`,'Add text or aria-label to icon-only buttons.'):c('buttons','Button names','pass','Buttons have accessible names.'),
    emptyAnchors>2?c('anchor-text','Link text','warn',`${plural(emptyAnchors,'link')} have no readable text.`,'Give every link descriptive text or an aria-label.'):c('anchor-text','Link text','pass','Links have readable text.'),
    iframesNoTitle?c('iframe-title','Embedded frames','warn',`${plural(iframesNoTitle,'iframe')} without a title.`,'Add a title attribute to each iframe.'):c('iframe-title','Embedded frames','pass','Iframes are titled or none used.'),
    root.querySelector('a[href^="#main" i],a.skip-link,a[class*="skip" i]')?c('skip','Skip link','pass','A “skip to content” link is present.'):c('skip','Skip link','info','No skip-to-content link (helps keyboard users).'),
  ];

  const security:Check[]=[
    https?c('https','HTTPS','pass','The page loads securely over HTTPS.',undefined,undefined,3):c('https','HTTPS','fail','The page does not use HTTPS, so browsers mark it “Not secure”.','Install an SSL certificate (free with Let’s Encrypt) and redirect all traffic to https://.',undefined,3),
    httpRes.headers?(httpRedirects?c('http-redirect','HTTP to HTTPS redirect','pass','http:// redirects to https://.',undefined,undefined,2):c('http-redirect','HTTP to HTTPS redirect','fail','The http:// version does not redirect to https://.','Add a permanent (301) redirect from http:// to https://.',undefined,2)):c('http-redirect','HTTP to HTTPS redirect','info','The http:// version did not respond, so the redirect could not be tested.'),
    H.get('strict-transport-security')?c('hsts','HSTS header','pass','Strict-Transport-Security is set.'):c('hsts','HSTS header','warn','No Strict-Transport-Security header.','Add “Strict-Transport-Security: max-age=31536000”.'),
    csp?c('csp','Content Security Policy','pass','A Content-Security-Policy header is set.'):c('csp','Content Security Policy','warn','No Content-Security-Policy header.','Add a Content-Security-Policy to limit where scripts and styles can load from.'),
    H.get('x-content-type-options')?c('xcto','X-Content-Type-Options','pass','Set to prevent MIME sniffing.'):c('xcto','X-Content-Type-Options','warn','Header missing.','Add “X-Content-Type-Options: nosniff”.'),
    H.get('x-frame-options')||/frame-ancestors/i.test(csp)?c('xfo','Clickjacking protection','pass','X-Frame-Options or frame-ancestors is set.'):c('xfo','Clickjacking protection','warn','The page can be embedded in other sites’ frames.','Add “X-Frame-Options: SAMEORIGIN” or a CSP frame-ancestors rule.'),
    H.get('referrer-policy')?c('referrer','Referrer-Policy','pass','Set.'):c('referrer','Referrer-Policy','warn','Header missing.','Add “Referrer-Policy: strict-origin-when-cross-origin”.'),
    H.get('permissions-policy')?c('permissions','Permissions-Policy','pass','Set.'):c('permissions','Permissions-Policy','info','No Permissions-Policy header (optional hardening).'),
    mixed?c('mixed','Mixed content','fail',`${plural(mixed,'resource')} load over insecure http:// on an https page.`,'Change those resource URLs to https://.',String(mixed),2):c('mixed','Mixed content','pass','No insecure resources found.'),
    /\d/.test(serverHdr)||powered?c('server-leak','Server version exposed','warn',`Headers reveal ${[serverHdr&&`Server: ${serverHdr}`,powered&&`X-Powered-By: ${powered}`].filter(Boolean).join(', ')}.`,'Hide software versions in server headers.'):c('server-leak','Server version exposed','pass','No software versions exposed in headers.'),
  ];

  const addr=localNode?.address as Node|undefined;
  const local:Check[]=[
    localNode?c('local-schema','LocalBusiness schema','pass',`${S.typeOf(localNode).join(', ')} schema found.`,undefined,undefined,3):c('local-schema','LocalBusiness schema','warn','No LocalBusiness (or similar) schema.','If you serve customers in an area, add LocalBusiness schema with name, address, phone, hours and map location.',undefined,3),
    addr&&(addr.streetAddress||addr.addressLocality)?c('local-address','Address in schema','pass',[addr.streetAddress,addr.addressLocality,addr.addressCountry].filter(Boolean).join(', ')):c('local-address','Address in schema','warn','No postal address in structured data.','Add a PostalAddress that exactly matches your Google Business Profile.',undefined,2),
    localNode?.telephone||orgNode?.telephone?c('local-phone-schema','Phone in schema','pass',String(localNode?.telephone||orgNode?.telephone)):c('local-phone-schema','Phone in schema','warn','No telephone in structured data.','Add your business phone number to the schema.'),
    phoneLinks?c('click-to-call','Click-to-call','pass',`${plural(phoneLinks,'tel: link')} for mobile callers.`):phoneText?c('click-to-call','Click-to-call','warn','A phone number appears but is not clickable.','Wrap phone numbers in <a href="tel:+...">.'):c('click-to-call','Click-to-call','warn','No phone number found on the page.','Show your phone number (NAP) on every page, usually in the header or footer.'),
    localNode?.geo?c('geo','Map coordinates','pass','GeoCoordinates set in schema.'):c('geo','Map coordinates','info','No GeoCoordinates in schema (helps map results).'),
    localNode?.openingHoursSpecification||localNode?.openingHours?c('hours','Opening hours','pass','Opening hours in schema.'):c('hours','Opening hours','info','No opening hours in schema.'),
    mapLink?c('maps','Google Maps / Business Profile link','pass','The page links to or embeds a map listing.'):c('maps','Google Maps / Business Profile link','warn','No link to Google Maps or your Business Profile.','Link to your Google Business Profile or embed a map on the contact page.'),
    linkTo(/contact/i)?c('contact','Contact page','pass','A contact page is linked.'):c('contact','Contact page','warn','No contact page linked from this page.','Link a contact page with your full name, address and phone.'),
    localNode?.areaServed||orgNode?.areaServed?c('area','Service area','pass','areaServed is set in schema.'):c('area','Service area','info','No areaServed in schema.'),
  ];

  const offpage:Check[]=[
    off.trancoRank!=null?c('tranco','Website popularity (Tranco)','pass',`Ranked #${off.trancoRank.toLocaleString('en-US')} among the world’s top 1 million websites.`,undefined,'#'+off.trancoRank,2):c('tranco','Website popularity (Tranco)','warn','Not in the world’s top 1 million websites yet.','Grow brand searches and traffic with content, PR and link building.',undefined,2),
    ageYears!=null?c('age','Domain age',ageYears>=2?'pass':'warn',`Registered ${off.registered?.slice(0,10)} (${ageYears<1?'under a year':plural(ageYears,'year')} old).`,ageYears<2?'New domains take time to earn trust; keep publishing and building quality links.':undefined,String(ageYears)):c('age','Domain age','info','Registration date not published for this domain extension.'),
    archiveYears!=null?c('history','Web history','pass',`First archived ${off.firstArchived} by the Internet Archive.`):c('history','Web history','info','No Internet Archive history found.'),
    off.wikidata?c('entity','Knowledge graph entity','pass',`Wikidata: ${off.wikidata.label}${off.wikidata.description?' – '+off.wikidata.description:''} (${off.wikidata.id}).`,undefined,undefined,2):c('entity','Knowledge graph entity','warn','No Wikidata entity lists this site as its official website.','Build brand mentions and, when notable, a Wikidata entry; it helps Google and AI recognise your brand.',undefined,2),
    socials.length>=3?c('socials','Social profiles','pass',`Linked: ${socials.join(', ')}.`,undefined,undefined,2):socials.length?c('socials','Social profiles','warn',`Only ${socials.join(', ')} linked.`,'Link your active social profiles from the site and in sameAs schema.',undefined,2):c('socials','Social profiles','fail','No social media profiles linked.','Create and link your brand profiles (LinkedIn, Facebook, Instagram, YouTube).',undefined,2),
    sameAs.length?c('sameas','sameAs in schema','pass',`${plural(sameAs.length,'profile')} listed in Organization sameAs.`):c('sameas','sameAs in schema','warn','No sameAs profiles in the Organization schema.','List your official profiles in sameAs so search engines connect them to your brand.'),
    c('backlinks','Backlink profile','info','Backlink counts need a commercial link index (Ahrefs, Semrush or Moz). Ask us for a full backlink audit.'),
  ];

  const aeo:Check[]=[
    hasFaq?c('faq','FAQ schema','pass','FAQPage schema found.',undefined,undefined,2):c('faq','FAQ schema','warn','No FAQPage schema.','Add a visible FAQ and mark it up with FAQPage schema; answer engines often quote it.',undefined,2),
    questions.length>=2?c('questions','Question-based headings','pass',`${plural(questions.length,'heading')} phrased as questions.`):c('questions','Question-based headings','warn',questions.length?'Only one heading is phrased as a question.':'No headings are phrased as questions.','Use headings that match how people ask (“How much does…?”, “What is…?”).'),
    questions.length&&answered>=Math.ceil(questions.length/2)?c('answers','Direct answers','pass',`${answered} questions are followed by a short, direct answer.`,undefined,undefined,2):c('answers','Direct answers','warn','Questions are not followed by short, direct answers.','Answer each question in the first 40–60 words below its heading, then expand.',undefined,2),
    lists>=3?c('lists','Lists and steps','pass',`${plural(lists,'list item')} on the page.`):c('lists','Lists and steps','warn','Few or no bullet or numbered lists.','Use lists for steps, features and comparisons; they are easy to quote.'),
    tables?c('tables','Comparison tables','pass',`${plural(tables,'table')} on the page.`):c('tables','Comparison tables','info','No tables (useful for pricing or comparisons).'),
    types.some(t=>/HowTo|QAPage|Speakable/.test(t))?c('howto','HowTo / Q&A schema','pass',types.filter(t=>/HowTo|QAPage|Speakable/.test(t)).join(', ')):c('howto','HowTo / Q&A schema','info','No HowTo or QAPage schema (use for step-by-step guides).'),
    P.description&&descLen>=70?c('summary','Answer-ready summary','pass','The meta description gives a clear summary.'):c('summary','Answer-ready summary','warn','No clear summary of the page.','Write a 1–2 sentence summary in the meta description and opening paragraph.'),
  ];

  const geo:Check[]=[
    !robots?c('ai-bots','AI crawler access','pass','No robots.txt, so AI crawlers are allowed.',undefined,undefined,3):blockedBots.length?c('ai-bots','AI crawler access','fail',`robots.txt blocks ${blockedBots.join(', ')}.`,'Allow AI search crawlers if you want to appear in ChatGPT, Claude, Perplexity and Google AI answers.',String(blockedBots.length),3):c('ai-bots','AI crawler access','pass','ChatGPT, Claude, Perplexity and Google AI crawlers are allowed.',undefined,undefined,3),
    llmsOk?c('llms','llms.txt','pass','/llms.txt found.',undefined,undefined,2):c('llms','llms.txt','warn','No /llms.txt file.','Add an llms.txt summary of your business and key pages for AI assistants.',undefined,2),
    types.length?c('schema','Structured data','pass',`Found: ${types.slice(0,8).join(', ')}.`,undefined,undefined,2):c('schema','Structured data','fail','No structured data (schema.org) found.','Add JSON-LD schema (Organization, LocalBusiness, Service, Article) so AI understands the page.',undefined,2),
    orgNode?c('org','Brand entity schema','pass',`${S.typeOf(orgNode).join(', ')} with ${orgNode.logo?'logo':'no logo'}${sameAs.length?' and profiles':''}.`,undefined,undefined,2):c('org','Brand entity schema','warn','No Organization schema describing your brand.','Add Organization schema with name, logo, description, contact and sameAs profiles.',undefined,2),
    numbers>=3?c('facts','Facts and statistics','pass',`${plural(numbers,'specific figure')} in the content.`):c('facts','Facts and statistics','warn','Few specific facts or figures.','AI answers prefer content with concrete numbers, results and sources.'),
    authorityLinks?c('citations','Cites authoritative sources','pass',`${plural(authorityLinks,'link')} to authoritative sources.`):c('citations','Cites authoritative sources','info','No links to authoritative sources (.gov, .edu, research).'),
    modified||copyright?c('fresh','Content freshness','pass',modified?`Last updated: ${String(modified).slice(0,25)}.`:`Copyright notice shows ${year}.`):c('fresh','Content freshness','warn','No sign of when the content was last updated.','Show “last updated” dates and add dateModified to your schema.'),
    wc>=600?c('depth','Content depth for AI','pass',`About ${wc} words.`):c('depth','Content depth for AI','warn',`About ${wc} words.`,'AI tools favour thorough pages; cover the topic in more depth (600+ words).'),
  ];

  const content:Check[]=[
    wc<300?c('words','Word count','warn',`About ${wc} words of text.`,'Pages with very little text rarely rank; add helpful detail that answers visitors’ questions.',String(wc),2):c('words','Word count','pass',`About ${wc} words of text.`,undefined,String(wc),2),
    read==null?c('readability','Readability','info','Not enough text to measure.'):read.ease>=50?c('readability','Readability','pass',`Reading ease ${read.ease}/100, average ${read.avgSentence} words per sentence.`):c('readability','Readability','warn',`Reading ease ${read.ease}/100, average ${read.avgSentence} words per sentence.`,'Use shorter sentences and simpler words.'),
    author?c('author','Author or expert info','pass','Author information is present.'):c('author','Author or expert info','warn','No author or expert information.','Show who wrote or reviewed the content and their expertise (E-E-A-T).'),
    linkTo(/about/i)?c('about','About page','pass','An About page is linked.'):c('about','About page','warn','No About page linked.','Link an About page that explains who you are and why to trust you.'),
    linkTo(/privacy/i)?c('privacy','Privacy policy','pass','A privacy policy is linked.'):c('privacy','Privacy policy','warn','No privacy policy linked.','Add and link a privacy policy; it is a basic trust signal.'),
    linkTo(/terms|conditions/i)?c('terms','Terms page','pass','Terms are linked.'):c('terms','Terms page','info','No terms and conditions page linked.'),
    root.querySelectorAll('h2').length>=2?c('sections','Scannable sections','pass',`${plural(root.querySelectorAll('h2').length,'H2 section')}.`):c('sections','Scannable sections','warn','Fewer than two H2 sections.','Break content into clear H2 sections.'),
    imgs.length||root.querySelector('video,iframe[src*="youtube" i]')?c('media','Images and video','pass',`${plural(imgs.length,'image')}${root.querySelector('video,iframe[src*="youtube" i]')?' and video':''}.`):c('media','Images and video','warn','No images or video.','Add relevant images or video to support the content.'),
  ];

  const social:Check[]=[
    og.length?c('og','Open Graph tags','warn',`Missing ${og.join(', ')}.`,'Add Open Graph tags so links look good on Facebook, LinkedIn and WhatsApp.',undefined,2):c('og','Open Graph tags','pass','Open Graph title, description and image are set.',undefined,undefined,2),
    P.meta('twitter:card')?c('twitter','X (Twitter) card','pass',`twitter:card = ${P.meta('twitter:card')}.`):c('twitter','X (Twitter) card','warn','No twitter:card tag.','Add <meta name="twitter:card" content="summary_large_image">.'),
    analytics.some(a=>/Google|Clarity|Privacy/.test(a))?c('analytics','Analytics','pass',`Detected: ${analytics.join(', ')}.`,undefined,undefined,2):c('analytics','Analytics','warn','No analytics detected.','Install Google Analytics 4 (or another analytics tool) to measure traffic and conversions.',undefined,2),
    verify.length?c('verification','Search console verification','pass',`Verified with ${verify.join(', ')}.`):c('verification','Search console verification','info','No verification meta tags (you may have verified by DNS instead).'),
    analytics.includes('Meta Pixel')?c('pixel','Ad tracking pixel','pass','Meta Pixel detected.'):c('pixel','Ad tracking pixel','info','No Meta Pixel detected (needed only if you run Meta ads).'),
  ];

  const links:Check[]=[
    c('links-total','Links on the page','info',`${internal.length} internal, ${external.length} external.`),
    brokenLinks.filter(b=>b.internal).length?c('broken-internal','Broken internal links','fail',`${plural(brokenLinks.filter(b=>b.internal).length,'broken internal link')}.`,'Fix or redirect the broken URLs listed in this report.',String(brokenLinks.filter(b=>b.internal).length),3):c('broken-internal','Broken internal links','pass',`No broken internal links among ${toCheck.filter(t=>t.internal).length+pages.length} checked.`,undefined,undefined,3),
    brokenLinks.filter(b=>!b.internal).length?c('broken-external','Broken external links','warn',`${plural(brokenLinks.filter(b=>!b.internal).length,'broken external link')}.`,'Update or remove links to pages that no longer exist.'):c('broken-external','Broken external links','pass',`No broken external links among ${toCheck.filter(t=>!t.internal).length} checked.`),
    web.filter(a=>a.rel.includes('nofollow')&&sameSite(new URL(a.href).hostname,host)).length?c('nofollow','Internal nofollow','warn','Some internal links are nofollow.','Remove nofollow from internal links so link value flows through your site.'):c('nofollow','Internal nofollow','pass','No internal nofollow links.'),
    external.filter(u=>u.startsWith('http:')).length?c('insecure-links','Insecure external links','info',`${plural(external.filter(u=>u.startsWith('http:')).length,'link')} to http:// sites.`):c('insecure-links','Insecure external links','pass','External links use HTTPS.'),
  ];

  const errorPages=pages.filter(p=>p.status>=400||p.status===0);
  const broken:Check[]=[
    errorPages.length?c('error-pages','Pages returning errors','fail',`${plural(errorPages.length,'page')} return 4xx/5xx errors or no response.`,'Fix these pages or 301-redirect them to the closest live page.',String(errorPages.length),3):c('error-pages','Pages returning errors','pass',`All ${pages.length} scanned pages load.`,undefined,undefined,3),
    soft404.status===404||soft404.status===410?c('404','404 handling','pass','Missing pages correctly return 404.',undefined,undefined,2):c('404','404 handling','warn',`A page that does not exist returned HTTP ${soft404.status||'no response'} instead of 404.`,'Return a real 404 status for missing pages (soft 404s confuse search engines).',undefined,2),
    soft404.body&&/<a [^>]*href=["']\/["']/i.test(soft404.body)?c('404-page','Helpful 404 page','pass','The 404 page links back to the site.'):c('404-page','Helpful 404 page','info','The 404 page has no link back to the homepage.'),
    redirectedLinks?c('internal-redirects','Internal links that redirect','warn',`${plural(redirectedLinks,'internal link')} point to a URL that redirects.`,'Update internal links to point straight at the final URL.'):c('internal-redirects','Internal links that redirect','pass','Internal links point straight at final URLs.'),
  ];

  const categories:Category[]=[
    {id:'seo',label:'On-page SEO',checks:seo,score:0},
    {id:'technical',label:'Technical SEO',checks:technical,score:0},
    {id:'performance',label:'Speed & performance',checks:performance,score:0},
    {id:'mobile',label:'Mobile & accessibility',checks:mobile,score:0},
    {id:'security',label:'Security',checks:security,score:0},
    {id:'local',label:'Local SEO / Local business',checks:local,score:0},
    {id:'offpage',label:'Off-page & authority',checks:offpage,score:0},
    {id:'aeo',label:'AEO (answer engines)',checks:aeo,score:0},
    {id:'geo',label:'GEO & AI search',checks:geo,score:0},
    {id:'content',label:'Content & E-E-A-T',checks:content,score:0},
    {id:'social',label:'Social & tracking',checks:social,score:0},
    {id:'links',label:'Links',checks:links,score:0},
    {id:'broken',label:'Broken pages',checks:broken,score:0},
  ];
  if(deep&&pages.length>1){
    const dup=(k:'title'|'description')=>{const m=new Map<string,number>();crawledOk.forEach(p=>p[k]&&m.set(p[k],(m.get(p[k])||0)+1));return [...m.values()].filter(n=>n>1).reduce((s,n)=>s+n,0)};
    const n=(f:(p:PageRow)=>boolean)=>crawledOk.filter(f).length;
    const site:Check[]=[
      c('crawled','Pages scanned','info',`${pages.length} pages crawled (${crawledOk.length} loaded).`),
      dup('title')?c('dup-title','Duplicate titles','warn',`${dup('title')} pages share a title with another page.`,'Give every page a unique title.',undefined,2):c('dup-title','Duplicate titles','pass','All titles are unique.',undefined,undefined,2),
      dup('description')?c('dup-desc','Duplicate descriptions','warn',`${dup('description')} pages share a meta description.`,'Write a unique description for each page.'):c('dup-desc','Duplicate descriptions','pass','All descriptions are unique.'),
      n(p=>!p.title)?c('miss-title','Missing titles','fail',`${n(p=>!p.title)} pages have no title.`,'Add a title to every page.',undefined,2):c('miss-title','Missing titles','pass','Every page has a title.',undefined,undefined,2),
      n(p=>!p.description)?c('miss-desc','Missing descriptions','warn',`${n(p=>!p.description)} pages have no meta description.`,'Add descriptions to these pages.'):c('miss-desc','Missing descriptions','pass','Every page has a description.'),
      n(p=>p.h1!==1)?c('site-h1','H1 on every page','warn',`${n(p=>p.h1!==1)} pages have no H1 or more than one.`,'Use exactly one H1 per page.'):c('site-h1','H1 on every page','pass','Each page has one H1.'),
      n(p=>p.words<300&&!p.noindex)?c('thin','Thin pages','warn',`${n(p=>p.words<300&&!p.noindex)} pages have under 300 words.`,'Expand or merge thin pages.'):c('thin','Thin pages','pass','No thin pages found.'),
      n(p=>!p.canonical)?c('site-canonical','Canonical tags','warn',`${n(p=>!p.canonical)} pages have no canonical tag.`,'Add a self-referencing canonical to each page.'):c('site-canonical','Canonical tags','pass','Every page has a canonical tag.'),
      n(p=>p.noindex)?c('site-noindex','noindex pages','info',`${n(p=>p.noindex)} pages are set to noindex. Check this is intended.`):c('site-noindex','noindex pages','pass','No crawled page is blocked from indexing.'),
      n(p=>p.ms>1500)?c('slow','Slow pages','warn',`${n(p=>p.ms>1500)} pages took over 1.5 s to respond.`,'Add caching or optimise these pages.'):c('slow','Slow pages','pass','All pages responded within 1.5 s.'),
      sitemapOk&&!isIndex&&sitemapLocs.length?(()=>{const inMap=new Set(sitemapLocs.map(u=>u.replace(/\/$/,'')));const missing=crawledOk.filter(p=>!p.noindex&&!inMap.has(p.url.replace(/\/$/,''))).length;return missing?c('sitemap-coverage','Sitemap coverage','warn',`${plural(missing,'crawled page')} not listed in the sitemap.`,'Add every indexable page to your XML sitemap.'):c('sitemap-coverage','Sitemap coverage','pass','Crawled pages are listed in the sitemap.')})():c('sitemap-coverage','Sitemap coverage','info','Sitemap coverage could not be compared.'),
    ];
    categories.push({id:'site',label:'Site-wide (deep scan)',checks:site,score:0});
  }
  for(const cat of categories)cat.score=score(cat.checks);
  const weights:Record<string,number>={seo:3,technical:2.5,performance:2,mobile:1.5,security:1.5,local:1,offpage:1.5,aeo:1.5,geo:2,content:2,social:1,links:1.5,broken:2,site:2};
  const overall=Math.round(categories.reduce((s,x)=>s+x.score*weights[x.id],0)/categories.reduce((s,x)=>s+weights[x.id],0));
  const priorities=categories.flatMap(cat=>cat.checks.filter(x=>x.status==='fail'||x.status==='warn').map(x=>({...x,category:cat.label}))).sort((a,b)=>(a.status===b.status?0:a.status==='fail'?-1:1)||b.weight-a.weight).slice(0,12);

  return {url:input,finalUrl,host,auditedAt:new Date().toISOString(),durationMs:Date.now()-started,score:overall,grade:grade(overall),deep,categories,priorities,pages,brokenLinks,psi,
    stats:{ttfb,htmlKb,pageWeightKb:weightKb,requests:scripts.length+styles.length+imgSrcs.length,internalLinks:internal.length,externalLinks:external.length,images:imgs.length,words:wc,schemaTypes:types,pagesCrawled:pages.length,linksChecked:toCheck.length+pages.length,trancoRank:off.trancoRank,domainAgeYears:ageYears}};
}
