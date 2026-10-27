// Maria Zeb talent profile: content for /influencers/maria-zeb.
// Media lives in public/talent/maria-zeb/ (gallery/, thumbs/, video/), prepared from the
// photos and videos supplied by Inventive Clicks.
const base='/talent/maria-zeb';

export const maria={
  slug:'maria-zeb',
  name:'Maria Zeb',
  roles:['Singer','Model','Content Creator','Host'],
  intro:'Maria Zeb is a versatile and passionate artist, bringing creativity, confidence, and elegance to every platform she represents.',
  bio:[
    'As a female singer, model, content creator, and host, she combines her love for music, fashion, and entertainment to create a distinctive identity in the industry.',
    'With a captivating screen presence, expressive personality, and a natural ability to connect with audiences, Maria Zeb strives to deliver memorable performances, engaging content, and professional hosting experiences.',
    'Her ambition is to inspire through her artistry, explore new creative opportunities, and establish herself as a recognizable name in the entertainment and fashion industry.',
  ],
  // Confirm before relying on: handle taken from Maria's own Instagram story tags.
  socials:[{label:'Instagram',url:'https://www.instagram.com/mariazeb__/'}],
  portrait:`${base}/portrait.webp`,
  hero:{desktop:`${base}/video/hero-desktop.mp4`,desktopPoster:`${base}/video/hero-desktop.jpg`,mobile:`${base}/video/hero-mobile.mp4`,mobilePoster:`${base}/video/hero-mobile.jpg`},
};

export const roleCards=[
  {title:'Singer',image:`${base}/thumbs/stage-19.webp`,text:'Live vocal performances that bring energy to festivals, concerts and private events.'},
  {title:'Model',image:`${base}/thumbs/fashion-07.webp`,text:'Fashion, couture and brand shoots delivered with confidence and elegance.'},
  {title:'Content Creator',image:`${base}/thumbs/outdoor-35.webp`,text:'Engaging content across music, fashion and lifestyle for brands and audiences.'},
  {title:'Host',image:`${base}/thumbs/hosting-41.webp`,text:'Professional hosting for shows, events and brand experiences.'},
];

// Stages listed only where Maria's own posters or photos show the event.
export const stages=[
  {event:'DreamFest 2025',detail:'Emerging Artist line-up · Jinnah Sports Complex · 17 October',poster:`${base}/gallery/posters-44.webp`},
  {event:'DreamFest 2025',detail:'Artists line-up · 17 October',poster:`${base}/gallery/posters-43.webp`},
  {event:'Islamabad Fem Festival',detail:'Fem Stars · performing live',poster:`${base}/gallery/posters-45.webp`},
  {event:'Gravity Fest',detail:'Live on the Gravity stage',poster:`${base}/gallery/posters-46.webp`},
];

export const galleryCats=[{id:'all',label:'All'},{id:'fashion',label:'Fashion'},{id:'bridal',label:'Bridal'},{id:'editorial',label:'Editorial'},{id:'stage',label:'Stage'},{id:'studio',label:'Studio'},{id:'outdoor',label:'Lifestyle'},{id:'hosting',label:'Hosting'}];
export type Photo={file:string;cat:string;w:number;h:number};
export const gallery:Photo[]=[
  {file:'bridal-47',cat:'bridal',w:590,h:886},
  {file:'bridal-48',cat:'bridal',w:590,h:886},
  {file:'bridal-49',cat:'bridal',w:590,h:886},
  {file:'bridal-50',cat:'bridal',w:590,h:886},
  {file:'bridal-51',cat:'bridal',w:590,h:885},
  {file:'editorial-52',cat:'editorial',w:854,h:1280},
  {file:'editorial-53',cat:'editorial',w:854,h:1280},
  {file:'editorial-54',cat:'editorial',w:854,h:1280},
  {file:'editorial-55',cat:'editorial',w:854,h:1280},
  {file:'editorial-56',cat:'editorial',w:854,h:1280},
  {file:'editorial-57',cat:'editorial',w:1280,h:854},
  {file:'editorial-58',cat:'editorial',w:854,h:1280},
  {file:'fashion-59',cat:'fashion',w:960,h:1280},
  {file:'fashion-60',cat:'fashion',w:960,h:1280},
  {file:'fashion-61',cat:'fashion',w:960,h:1280},
  {file:'fashion-62',cat:'fashion',w:360,h:480},
  {file:'fashion-63',cat:'fashion',w:360,h:480},
  {file:'fashion-64',cat:'fashion',w:360,h:480},
  {file:'fashion-65',cat:'fashion',w:360,h:480},
  {file:'fashion-66',cat:'fashion',w:360,h:480},
  {file:'fashion-01',cat:'fashion',w:647,h:1400},
  {file:'fashion-02',cat:'fashion',w:1050,h:1400},
  {file:'fashion-03',cat:'fashion',w:1050,h:1400},
  {file:'fashion-04',cat:'fashion',w:934,h:1400},
  {file:'fashion-05',cat:'fashion',w:934,h:1400},
  {file:'fashion-06',cat:'fashion',w:933,h:1400},
  {file:'fashion-07',cat:'fashion',w:933,h:1400},
  {file:'fashion-08',cat:'fashion',w:933,h:1400},
  {file:'fashion-09',cat:'fashion',w:932,h:1400},
  {file:'fashion-10',cat:'fashion',w:933,h:1400},
  {file:'fashion-11',cat:'fashion',w:1400,h:933},
  {file:'fashion-12',cat:'fashion',w:933,h:1400},
  {file:'fashion-13',cat:'fashion',w:1400,h:933},
  {file:'fashion-14',cat:'fashion',w:933,h:1400},
  {file:'stage-15',cat:'stage',w:592,h:1280},
  {file:'stage-16',cat:'stage',w:1400,h:934},
  {file:'stage-17',cat:'stage',w:934,h:1400},
  {file:'stage-18',cat:'stage',w:1400,h:934},
  {file:'stage-19',cat:'stage',w:853,h:1280},
  {file:'stage-20',cat:'stage',w:853,h:1280},
  {file:'stage-21',cat:'stage',w:853,h:1280},
  {file:'stage-22',cat:'stage',w:853,h:1280},
  {file:'stage-23',cat:'stage',w:853,h:1280},
  {file:'stage-24',cat:'stage',w:934,h:1400},
  {file:'studio-25',cat:'studio',w:592,h:1280},
  {file:'studio-26',cat:'studio',w:590,h:1280},
  {file:'studio-27',cat:'studio',w:933,h:1400},
  {file:'studio-28',cat:'studio',w:934,h:1400},
  {file:'studio-29',cat:'studio',w:1120,h:1400},
  {file:'studio-30',cat:'studio',w:1120,h:1400},
  {file:'studio-31',cat:'studio',w:788,h:1400},
  {file:'studio-32',cat:'studio',w:933,h:1400},
  {file:'outdoor-33',cat:'outdoor',w:854,h:1280},
  {file:'outdoor-34',cat:'outdoor',w:854,h:1280},
  {file:'outdoor-35',cat:'outdoor',w:934,h:1400},
  {file:'outdoor-36',cat:'outdoor',w:1050,h:1400},
  {file:'outdoor-37',cat:'outdoor',w:932,h:1400},
  {file:'outdoor-38',cat:'outdoor',w:932,h:1400},
  {file:'outdoor-39',cat:'outdoor',w:1052,h:1400},
  {file:'outdoor-40',cat:'outdoor',w:1052,h:1400},
  {file:'hosting-41',cat:'hosting',w:960,h:1280},
  {file:'hosting-42',cat:'hosting',w:1050,h:1400},
];
export const photoSrc=(p:Photo,size:'thumbs'|'gallery')=>`${base}/${size}/${p.file}.webp`;

export const reels=[
  {file:'reel-01',title:'Bridal elegance',cat:'Fashion'},
  {file:'reel-02',title:'After dark',cat:'Fashion'},
  {file:'reel-03',title:'Ivory couture',cat:'Fashion'},
  {file:'reel-04',title:'Mirror moment',cat:'Fashion'},
  {file:'reel-05',title:'Golden fields',cat:'Lifestyle'},
  {file:'reel-06',title:'Sohna',cat:'Lifestyle'},
  {file:'reel-07',title:'Ballroom',cat:'Fashion'},
  {file:'reel-08',title:'Red couture',cat:'Fashion'},
  {file:'reel-09',title:'Live on stage',cat:'Stage'},
  {file:'reel-10',title:'Crowd view',cat:'Stage'},
  {file:'reel-11',title:'Festival night',cat:'Stage'},
  {file:'reel-12',title:'Lights up',cat:'Stage'},
].map(r=>({...r,src:`${base}/video/${r.file}.mp4`,poster:`${base}/video/${r.file}.jpg`}));

export const bookingTypes=['Live performance','Modelling / photoshoot','Hosting / anchoring','Brand collaboration','Content creation','Other'];
