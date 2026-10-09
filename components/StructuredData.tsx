export const siteUrl='https://inventiveclicks.com';
export function JsonLd({data}:{data:Record<string,unknown>}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org',...data}).replace(/</g,'\\u003c')}}/>}
export function BreadcrumbData({items}:{items:{name:string;path:string}[]}){return <JsonLd data={{'@type':'BreadcrumbList',itemListElement:[{name:'Home',path:''},...items].map((i,index)=>({'@type':'ListItem',position:index+1,name:i.name,item:siteUrl+i.path}))}}/>}
// Page-level openGraph replaces the layout's, so pages spread these to keep the share image.
export const ogDefaults={siteName:'Inventive Clicks',locale:'en_US',images:[{url:'/opengraph-image.jpg',width:1200,height:630,alt:'Inventive Clicks: Bold Ideas. Brighter Results.'}]};
