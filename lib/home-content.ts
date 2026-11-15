// Long-form homepage content. Written for people first, and structured so search engines
// and AI assistants can quote it: question-style headings, direct answers, lists and facts.
// Figures here are things we can count on this site (services, platforms, projects, checks).

export const heroLead='Inventive Clicks is a creative and performance digital agency. We plan and deliver SEO, paid advertising, social media, e-commerce marketing, web development, branding, content and remote staffing for businesses in Pakistan and the United States, with one brief, one team and one measure of success: more enquiries, more customers and a brand people remember.';

export const whyIntro=[
  'Most businesses do not have a traffic problem, a design problem or a content problem in isolation. They have a growth problem that touches all three. A campaign sends people to a page that does not convince them. A beautiful website says nothing about what makes the business different. A content calendar fills up with posts that nobody asked for. Inventive Clicks exists to join those pieces together, so that strategy, creative and technology pull in the same direction.',
  'We work as one team across thirty connected services. That means the person planning your Google Ads knows what the landing page will say, the developer building your website knows which pages need to rank, and the designer shaping your brand knows where it will appear. You get fewer handovers, fewer surprises and a clearer answer to the only question that matters: is this working?',
];

export const whyUs:[string,string][]=[
  ['Strategy before spend','We start with your business goal, audience and current numbers, then choose the channels. You never pay for activity that has no job to do.'],
  ['One team, thirty services','Search, paid media, social, e-commerce, websites, branding, content and staffing under one roof, so each piece supports the next instead of competing for budget.'],
  ['Built to be found','Every website and page we create is structured for Google, Bing and AI search from day one: clean code, fast loading, schema markup and content that answers real questions.'],
  ['Clear scope, clear owners','Each proposal lists the deliverables, review stages and who is responsible for what. You always know what is being made, by whom and when you will see it.'],
  ['Conversion is the point','Enquiry forms, WhatsApp flows, booking journeys and checkout paths are designed into the work, not bolted on at the end.'],
  ['Measured and reported','We agree what success looks like before we begin, then report against it in plain language: leads, sales, rankings, reach and what we will change next.'],
];

export const industries:{name:string;text:string;links:[string,string][]}[]=[
  {name:'Healthcare & clinics',text:'Appointment-led websites for primary care, internal medicine and wellness clinics, with insurance information, telemedicine pages and local search visibility so new patients can find and book you.',links:[['Web Development','/services/web-development'],['Local SEO','/services/seo']]},
  {name:'Staffing & recruitment',text:'Job boards, staffing agency websites and candidate journeys that handle search by role, city and category, backed by paid campaigns that reach employers and job seekers.',links:[['Remote Staffing','/services/remote-staffing'],['PPC','/services/ppc']]},
  {name:'Travel & hospitality',text:'Tour operators, hotels and resorts need trip search, galleries, seasonal offers and content that ranks for destinations. We build the platform and the campaigns around it.',links:[['Content Creation','/services/content-creation'],['Social Media','/services/social-media-marketing']]},
  {name:'E-commerce & marketplaces',text:'Shopify and WooCommerce stores plus Amazon, eBay, Etsy, Walmart and TikTok Shop listings, with product content, feeds and paid campaigns planned around margin.',links:[['E-Commerce Solutions','/services/e-commerce-solutions'],['Amazon Marketing','/platforms/amazon']]},
  {name:'Professional & financial services',text:'Tax relief, legal, consulting and B2B firms that depend on trust: lead-generation websites, authoritative content, review strategy and paid search that filters for intent.',links:[['Digital Marketing','/services/digital-marketing'],['Brand Strategy','/services/brand-strategy']]},
  {name:'Local & service businesses',text:'Restaurants, salons, repair services and local retailers that live on Google Maps and WhatsApp. We fix the basics first: Business Profile, reviews, citations, fast mobile pages and click-to-call.',links:[['SEO','/services/seo'],['Graphics & Branding','/services/graphics-branding']]},
  {name:'Startups & SaaS',text:'Launch pages, product explainers, brand identity and acquisition campaigns that explain a complex product simply and track every sign-up back to its source.',links:[['Influencer Marketing','/services/influencer-marketing'],['UI/UX Design','/services/ui-ux-design']]},
];

export const process:[string,string,string[]][]=[
  ['Discover','We learn your business, audience, competitors and current numbers, and we ask the questions a brief usually skips: what does a good customer look like, and what stops more of them from choosing you?',['Kick-off call','Audit of your website, listings and campaigns','Goals and success metrics']],
  ['Strategize','We turn that understanding into a plan with a defined scope: which channels, which pages, which messages, in what order, and who owns each part.',['Written proposal','Scope, timeline and review stages','Measurement plan']],
  ['Execute','Design, development, content and campaigns are produced in review stages, so you see work early and nothing reaches the public without your approval.',['Staged delivery','Review rounds','Launch checklist']],
  ['Review & grow','After launch we report against the agreed metrics, explain what the evidence says and recommend the next improvement, whether that is more content, a new campaign or a conversion fix.',['Plain-language reporting','Next-step recommendations','Ongoing optimisation']],
];

export const aiSearch={
  intro:'Search is changing. People now ask Google, ChatGPT, Perplexity, Claude and voice assistants full questions and expect a direct answer, often without visiting a website at all. Ranking on page one is no longer the whole job; your business also needs to be understood, trusted and quoted by the systems that write those answers.',
  points:[
    ['SEO','Technical health, fast pages, clear structure and content that matches what people search for. The foundation everything else stands on.'],
    ['AEO (answer engine optimisation)','Question-based headings, direct answers, FAQs and HowTo content, marked up so featured snippets and voice assistants can lift them.'],
    ['GEO (generative engine optimisation)','Structured data, consistent brand facts, llms.txt, citations and in-depth content that AI models can read, trust and reference in generated answers.'],
    ['Local SEO','Google Business Profile, accurate name-address-phone details, reviews, local pages and LocalBusiness schema so you appear in map results and “near me” searches.'],
  ],
  close:'We build all four into every website and content plan. You can see where your own site stands in about a minute with our free Website Deep Audit, which checks more than 100 points across SEO, AEO, GEO, local SEO, speed, security and links.',
};

export const local={
  intro:'Inventive Clicks works from Pakistan with clients across Pakistan and the United States. Our team collaborates online, so location is never a barrier, but local knowledge still matters: what a customer in Islamabad searches for is not what a patient in Texas searches for.',
  pk:['Islamabad','Rawalpindi','Lahore','Karachi','Peshawar','Faisalabad'],
  us:['Texas','Arkansas','New York','and remote clients nationwide'],
  points:['Local SEO and Google Business Profile optimisation for Pakistani cities and US metro areas','Bilingual understanding of Pakistani audiences for Urdu-speaking markets','Campaign timing, pricing and payment flows suited to each market','WhatsApp-first enquiry journeys for Pakistan; call and form journeys for the US'],
};

export const homeFaq:[string,string][]=[
  ['What does Inventive Clicks do?','Inventive Clicks is a digital marketing and web development agency. We provide SEO, PPC and paid social advertising, social media marketing, e-commerce and marketplace marketing, website and app development, branding and graphic design, content creation, influencer marketing and remote staffing, delivered as one connected plan.'],
  ['Which industries do you work with?','Our recent work includes healthcare clinics, staffing and recruitment agencies, job boards, travel companies and resorts, tax and professional services, local service businesses and e-commerce brands. The approach adapts to each industry; the discipline of clear scope and measurement stays the same.'],
  ['Do you work with businesses outside Pakistan?','Yes. We work with clients in Pakistan and the United States, and we are set up to collaborate remotely with calls, shared review links and plain-language reporting. Time zones are agreed at the start of each project.'],
  ['How much do your services cost?','Every project is scoped individually, because a five-page clinic website and a multi-country job portal are very different pieces of work. After a short discovery call we send a written proposal with the deliverables, timeline and fees, so there are no surprises later.'],
  ['How long does a website take?','A focused business website typically takes four to eight weeks from brief to launch, including design reviews and content. Larger platforms with search, listings or accounts take longer and are planned in phases so you can launch a first version sooner.'],
  ['Can I combine several services?','Yes, and most clients do. A new website is usually paired with SEO and content; a product launch often combines branding, paid ads and influencer marketing. One proposal covers the whole scope with clear responsibilities for each part.'],
  ['What is the difference between SEO, AEO and GEO?','SEO helps your pages rank in traditional search results. AEO (answer engine optimisation) structures content so search engines and voice assistants can give it as a direct answer. GEO (generative engine optimisation) helps AI tools such as ChatGPT, Perplexity and Google AI Overviews understand, trust and cite your business. We build all three into our work.'],
  ['Will I own my website, ad accounts and content?','Yes. Websites are built in your name on hosting you control, advertising accounts belong to you and all content, designs and source files are handed over. If we ever part ways, you keep everything.'],
  ['How do you report results?','We agree the metrics before work starts, then report against them at a set rhythm: enquiries, sales, rankings, traffic, reach, cost per lead or whatever fits the goal. Each report explains what changed, why, and what we recommend next.'],
  ['How do I get started?','Send us a short brief through the contact page or on WhatsApp: what your business does, who you want to reach, what needs to improve and any deadline. We will reply with questions, a suggested scope and a proposal.'],
];

export const toolsPromo={
  title:'Free Website Deep Audit',
  text:'Enter any website address and get a score across SEO, AEO, GEO, local SEO, speed, security, links and broken pages, with step-by-step fixes. It takes about a minute and checks more than 100 points.',
};
export const influencerPromo={
  title:'Influencer network',
  text:'Creators can join our network for free; brands can brief us on a campaign and receive a shortlist of relevant creators, managed from brief to reporting.',
};
