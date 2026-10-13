// Curated link-building opportunities for the Backlink Prospect Finder.
// Every URL below was opened and confirmed live on 2026-10-13 (guest post pages were also
// checked for "write for us"/guidelines content). The tool re-checks each site when it is shown.
// Add entries only after opening the page yourself; remove ones that close.

export type Category = 'guest'|'directory'|'agency'|'business'|'blogging'|'profile'|'community';
export type Niche = 'marketing'|'tech'|'business'|'local';
export type Opportunity = {name:string; url:string; category:Category; niches:Niche[]|'all'; note:string; region?:string};

export const categories:{id:Category;label:string}[] = [
  {id:'guest',label:'Guest post sites'},
  {id:'directory',label:'Business directories & citations'},
  {id:'agency',label:'Agency & service listings'},
  {id:'business',label:'Business profiles & reviews'},
  {id:'blogging',label:'Blogging platforms'},
  {id:'profile',label:'Profile & portfolio sites'},
  {id:'community',label:'Communities & Q&A'},
];
export const niches:{id:Niche|'all';label:string}[] = [
  {id:'all',label:'All niches'},
  {id:'marketing',label:'Marketing & SEO'},
  {id:'tech',label:'Technology & web'},
  {id:'business',label:'Business & startups'},
  {id:'local',label:'Local business'},
];

export const opportunities:Opportunity[] = [
  // Guest posts: editorial sites with published contributor guidelines
  {name:'Lilach Bullock',url:'https://www.lilachbullock.com/write-for-us/',category:'guest',niches:['marketing','business'],note:'Pitch first; SEO, content, social, PPC and AI topics'},
  {name:'Hunch',url:'https://www.hunchads.com/guest-post-guidelines',category:'guest',niches:['marketing'],note:'Performance marketing; original, non-AI writing; 1–2 links'},
  {name:'Post Affiliate Pro',url:'https://www.postaffiliatepro.com/write-for-post-affiliate-pro/',category:'guest',niches:['marketing'],note:'Affiliate and digital marketing topics'},
  {name:'Embarque',url:'https://www.embarque.io/guest-posts',category:'guest',niches:['marketing'],note:'SEO and content marketing; research-led posts'},
  {name:'TechWyse',url:'https://www.techwyse.com/write-for-us',category:'guest',niches:['marketing'],note:'Internet marketing; 1,000+ words, no self-promotion'},
  {name:'ClickSlice',url:'https://www.clickslice.co.uk/write-for-us/',category:'guest',niches:['marketing'],note:'SEO and e-commerce; 750+ words, original'},
  {name:'Growfusely',url:'https://growfusely.com/blog/write-for-us-content-marketing-and-seo/',category:'guest',niches:['marketing'],note:'Content marketing and SEO; long-form'},
  {name:'MarketingProfs',url:'https://www.marketingprofs.com/write-for-us',category:'guest',niches:['marketing','business'],note:'B2B marketing contributors'},
  {name:'SitePoint',url:'https://www.sitepoint.com/write-for-us/',category:'guest',niches:['tech'],note:'Web development tutorials and articles'},
  {name:'Smashing Magazine',url:'https://www.smashingmagazine.com/write-for-us/',category:'guest',niches:['tech'],note:'Web design and front-end articles'},
  {name:'HackerNoon',url:'https://hackernoon.com/p/publish',category:'guest',niches:['tech','business'],note:'Tech and startup stories; open submissions'},
  {name:'TechBullion',url:'https://techbullion.com/write-for-us/',category:'guest',niches:['tech','business'],note:'Fintech, tech and business news'},
  {name:'Addicted2Success',url:'https://addicted2success.com/write-for-us/',category:'guest',niches:['business'],note:'Entrepreneurship and self-improvement'},
  {name:'PriceOye Blog',url:'https://priceoye.pk/blog/write-for-us/',category:'guest',niches:['tech','local'],region:'Pakistan',note:'Gadgets, apps and tech tips; 500+ words, author bio link'},

  // Business directories and local citations
  {name:'Google Business Profile',url:'https://business.google.com/en-all/business-profile/',category:'directory',niches:'all',note:'Most important local listing; add website and services'},
  {name:'Bing Places for Business',url:'https://www.bing.com/forbusiness/',category:'directory',niches:'all',note:'Bing and Copilot local results'},
  {name:'Apple Business Connect',url:'https://businessconnect.apple.com/',category:'directory',niches:'all',note:'Apple Maps listing'},
  {name:'Yelp for Business',url:'https://biz.yelp.com/',category:'directory',niches:'all',note:'Business listing with website field'},
  {name:'Foursquare',url:'https://foursquare.com/',category:'directory',niches:'all',note:'Places data used by many apps'},
  {name:'Hotfrog',url:'https://www.hotfrog.com/',category:'directory',niches:'all',note:'Free business listing'},
  {name:'Brownbook',url:'https://www.brownbook.net/',category:'directory',niches:'all',note:'Free global business directory'},
  {name:'Manta',url:'https://www.manta.com/',category:'directory',niches:'all',region:'United States',note:'Small business directory'},
  {name:'Cylex',url:'https://www.cylex-uk.co.uk/',category:'directory',niches:'all',region:'United Kingdom',note:'Business directory'},
  {name:'BusinessList.pk',url:'https://www.businesslist.pk/',category:'directory',niches:['local','business','marketing','tech'],region:'Pakistan',note:'Pakistan business directory'},

  // Agency and service marketplaces
  {name:'Clutch',url:'https://clutch.co/',category:'agency',niches:['marketing','tech'],note:'Agency profile with reviews and website link'},
  {name:'GoodFirms',url:'https://www.goodfirms.co/',category:'agency',niches:['marketing','tech'],note:'Agency and software company profiles'},
  {name:'DesignRush',url:'https://www.designrush.com/',category:'agency',niches:['marketing','tech'],note:'Agency directory'},
  {name:'Sortlist',url:'https://www.sortlist.com/',category:'agency',niches:['marketing','tech'],note:'Agency marketplace'},
  {name:'Agency Spotter',url:'https://www.agencyspotter.com/',category:'agency',niches:['marketing'],note:'Agency directory'},
  {name:'The Manifest',url:'https://themanifest.com/',category:'agency',niches:['marketing','tech'],note:'Agency listings (Clutch network)'},
  {name:'TopDevelopers',url:'https://www.topdevelopers.co/',category:'agency',niches:['tech'],note:'Development company directory'},
  {name:'Semrush Agency Partners',url:'https://agencies.semrush.com/',category:'agency',niches:['marketing'],note:'Agency directory for Semrush users'},

  // Business profiles and reviews
  {name:'Trustpilot for Business',url:'https://business.trustpilot.com/',category:'business',niches:'all',note:'Review profile with website link'},
  {name:'Crunchbase',url:'https://www.crunchbase.com/',category:'business',niches:['business','tech','marketing'],note:'Company profile'},
  {name:'Bark',url:'https://www.bark.com/',category:'business',niches:['marketing','tech','local'],note:'Service provider profile'},
  {name:'ProvenExpert',url:'https://www.provenexpert.com/',category:'business',niches:'all',note:'Review profile'},
  {name:'F6S',url:'https://www.f6s.com/',category:'business',niches:['business','tech'],note:'Startup and company profile'},
  {name:'Wellfound',url:'https://wellfound.com/',category:'business',niches:['business','tech'],note:'Startup company profile and jobs'},
  {name:'Product Hunt',url:'https://www.producthunt.com/',category:'business',niches:['tech','business'],note:'Launch a product or tool'},

  // Blogging platforms (publish your own articles)
  {name:'Medium',url:'https://medium.com/',category:'blogging',niches:'all',note:'Articles with in-text links'},
  {name:'LinkedIn Articles',url:'https://www.linkedin.com/',category:'blogging',niches:'all',note:'Articles and company page website link'},
  {name:'Blogger',url:'https://www.blogger.com/about/',category:'blogging',niches:'all',note:'Free blog on blogspot.com'},
  {name:'WordPress.com',url:'https://wordpress.com/',category:'blogging',niches:'all',note:'Free blog on wordpress.com'},
  {name:'Tumblr',url:'https://www.tumblr.com/',category:'blogging',niches:'all',note:'Short-form blog'},
  {name:'Substack',url:'https://substack.com/',category:'blogging',niches:'all',note:'Newsletter and blog'},
  {name:'Vocal Media',url:'https://vocal.media/',category:'blogging',niches:'all',note:'Story publishing platform'},
  {name:'HubPages',url:'https://discover.hubpages.com/',category:'blogging',niches:'all',note:'Article publishing network'},
  {name:'Hashnode',url:'https://hashnode.com/',category:'blogging',niches:['tech'],note:'Developer blogging'},
  {name:'DEV Community',url:'https://dev.to/',category:'blogging',niches:['tech'],note:'Developer articles'},

  // Profile and portfolio sites
  {name:'GitHub',url:'https://github.com/',category:'profile',niches:['tech'],note:'Profile and repository website links'},
  {name:'Behance',url:'https://www.behance.net/',category:'profile',niches:['marketing','tech'],note:'Design portfolio'},
  {name:'Dribbble',url:'https://dribbble.com/',category:'profile',niches:['marketing','tech'],note:'Design portfolio'},
  {name:'Pinterest Business',url:'https://business.pinterest.com/',category:'profile',niches:'all',note:'Claimed website and pin links'},
  {name:'About.me',url:'https://about.me/',category:'profile',niches:'all',note:'Personal profile page'},
  {name:'Gravatar',url:'https://gravatar.com/',category:'profile',niches:'all',note:'Profile with website links'},
  {name:'Linktree',url:'https://linktr.ee/',category:'profile',niches:'all',note:'Link-in-bio page'},
  {name:'Issuu',url:'https://issuu.com/',category:'profile',niches:'all',note:'Publish PDFs and brochures'},
  {name:'SlideShare',url:'https://www.slideshare.net/',category:'profile',niches:'all',note:'Publish presentations'},

  // Communities and Q&A (add value first; links in answers where relevant)
  {name:'Quora',url:'https://www.quora.com/',category:'community',niches:'all',note:'Answers and profile link'},
  {name:'Reddit',url:'https://www.reddit.com/',category:'community',niches:'all',note:'Follow each subreddit’s link rules'},
  {name:'Indie Hackers',url:'https://www.indiehackers.com/',category:'community',niches:['business','tech'],note:'Founder community'},
  {name:'Warrior Forum',url:'https://www.warriorforum.com/',category:'community',niches:['marketing'],note:'Internet marketing forum; signature links'},
  {name:'Digital Point Forums',url:'https://forums.digitalpoint.com/',category:'community',niches:['marketing'],note:'Webmaster and SEO forum'},
  {name:'Hacker News',url:'https://news.ycombinator.com/',category:'community',niches:['tech','business'],note:'Submit genuinely useful launches and articles'},
  {name:'Webmasters Stack Exchange',url:'https://webmasters.stackexchange.com/',category:'community',niches:['marketing','tech'],note:'Q&A; profile website link'},
];
