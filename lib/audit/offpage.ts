// Off-page and authority signals from free public sources (no API keys):
// Tranco popularity rank, RDAP domain registration date, Internet Archive history
// and a Wikidata entity that lists the site as its official website.
const UA='InventiveClicksAudit/1.0 (+https://inventiveclicks.com/tools/website-audit)';
const MULTI_TLD=/\.(co|com|org|net|gov|edu|ac|gob|ltd|plc|nic|web|biz)\.[a-z]{2}$/i;

export function registrableDomain(host:string){const h=host.replace(/^www\./,'').toLowerCase();return h.split('.').slice(MULTI_TLD.test(h)?-3:-2).join('.')}

async function getJson<T>(url:string,timeout=10000):Promise<T|null>{
  try{const r=await fetch(url,{headers:{'User-Agent':UA,Accept:'application/json, application/rdap+json'},signal:AbortSignal.timeout(timeout)});return r.ok?await r.json() as T:null}catch{return null}
}

export type OffPage={domain:string;trancoRank:number|null;registered:string|null;firstArchived:string|null;wikidata:{id:string;label:string;description:string}|null};

export async function offPageSignals(host:string):Promise<OffPage>{
  const domain=registrableDomain(host);
  const [tranco,rdap,archive,wiki]=await Promise.all([
    getJson<{ranks?:{rank:number}[]}>(`https://tranco-list.eu/api/ranks/domain/${domain}`),
    getJson<{events?:{eventAction:string;eventDate:string}[]}>(`https://rdap.org/domain/${domain}`),
    getJson<string[][]>(`https://web.archive.org/cdx/search/cdx?url=${domain}&limit=1&output=json&fl=timestamp`,12000),
    (async()=>{
      for(const site of [`https://${domain}/`,`https://www.${domain}/`,`https://${domain}`,`https://www.${domain}`,`http://${domain}/`,`http://www.${domain}/`]){
        const q=await getJson<{query?:{search?:{title:string}[]}}>(`https://www.wikidata.org/w/api.php?action=query&list=search&srlimit=1&format=json&srsearch=${encodeURIComponent(`haswbstatement:P856=${site}`)}`,8000);
        const id=q?.query?.search?.[0]?.title;
        if(id){const e=await getJson<{entities?:Record<string,{labels?:{en?:{value:string}};descriptions?:{en?:{value:string}}}>}>(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=labels|descriptions&languages=en&format=json`,8000);const en=e?.entities?.[id];return {id,label:en?.labels?.en?.value||id,description:en?.descriptions?.en?.value||''}}
      }
      return null;
    })(),
  ]);
  const reg=rdap?.events?.find(e=>e.eventAction==='registration')?.eventDate||null;
  const ts=archive?.[1]?.[0];
  return {domain,trancoRank:tranco?.ranks?.[0]?.rank??null,registered:reg,firstArchived:ts?`${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)}`:null,wikidata:wiki};
}
