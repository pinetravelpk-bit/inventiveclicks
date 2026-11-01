// Website development portfolio shown on /portfolio. Screenshots live in public/portfolio/
// (<slug>.webp at 1440x900 and <slug>-sm.webp at 800x500). Live links are intentionally
// not published. Descriptions are based on each site's own content.
export type Sector='healthcare'|'staffing'|'travel'|'business';
export type Project={slug:string;name:string;sector:Sector;market:string;summary:string;features:string[];platform:string;accent:string};

export const sectors:{id:Sector|'all';label:string}[]=[
  {id:'all',label:'All projects'},
  {id:'healthcare',label:'Healthcare'},
  {id:'staffing',label:'Staffing & jobs'},
  {id:'travel',label:'Travel & hospitality'},
  {id:'business',label:'Business & finance'},
];

export const projects:Project[]=[
  {slug:'txmed',name:'TXMed Internal Medicine',sector:'healthcare',market:'Frisco, Texas, USA',platform:'WordPress',accent:'#1aa3e8',
    summary:'Website for a primary-care and internal-medicine practice, built around new-patient appointments, insurance information and telemedicine.',
    features:['Online appointment request','Patient portal & bill pay access','Insurance & services pages','Telemedicine information']},
  {slug:'primehealth',name:'Prime Health',sector:'healthcare',market:'Fort Smith, Arkansas, USA',platform:'WordPress',accent:'#e0393e',
    summary:'Wellness clinic website presenting primary care, advanced diagnostics, IV therapy, hormone and weight-loss programmes and memberships.',
    features:['Consultation booking','IV infusion menu','Membership plans','Service landing pages']},
  {slug:'pinetravel',name:'Pine Travel',sector:'travel',market:'Rawalpindi, Pakistan',platform:'Custom build',accent:'#1f7a2c',
    summary:'Travel platform for Northern Pakistan that brings tours, hotels and vehicle rentals together, with a trip search on the homepage.',
    features:['Trip search by destination & date','Tour packages','Hotel & 4x4 rental pages','Custom itinerary requests']},
  {slug:'addresx',name:'Addresx',sector:'business',market:'New York, USA',platform:'WordPress',accent:'#f26b1d',
    summary:'Local business directory and job board where people search businesses or jobs by category and location.',
    features:['Category & location search','Business listings','Job board','Listing plans for businesses']},
  {slug:'availjob',name:'AvailJob',sector:'staffing',market:'USA, Canada, UK, Germany, Australia, UAE & Switzerland',platform:'Next.js',accent:'#e8452c',
    summary:'International job portal covering seven countries, with search by city, region or remote work and a domestic staffing section.',
    features:['Job search by location','Company profiles','Remote job filters','Career & hiring guides']},
  {slug:'hirestaff',name:'HireStaff.pk',sector:'staffing',market:'Islamabad & Rawalpindi, Pakistan',platform:'Custom build',accent:'#f2a90f',
    summary:'Staffing agency website for verified domestic and corporate staff, designed to turn visitors into staff requests.',
    features:['Staff request flow','WhatsApp enquiries','Service & area pages','Trust & compliance section']},
  {slug:'rxdirect',name:'RX Direct',sector:'staffing',market:'Pakistan, multi-city',platform:'Custom build',accent:'#1f4fd1',
    summary:'Domestic staffing agency site with role and city search and a public staff verification check.',
    features:['Role & city search','Verification status checker','City landing pages','Jobs section']},
  {slug:'hirecook',name:'HireCook.pk',sector:'staffing',market:'Islamabad & Rawalpindi, Pakistan',platform:'Next.js',accent:'#e0632a',
    summary:'Cook hiring agency website with search by area and cuisine, a trial-cook process and city and cuisine pages.',
    features:['Area & cuisine search','Cuisine landing pages','City & area pages','WhatsApp enquiries']},
  {slug:'mrppc',name:'MrPPC.pk',sector:'business',market:'Islamabad, Pakistan',platform:'Custom build',accent:'#8cf13a',
    summary:'Personal-brand website for a PPC consultant, presenting search, social and marketplace advertising services.',
    features:['3D hero visuals','Service pages','Free audit lead form','Blog']},
  {slug:'pinepark',name:'Pine Park Hotel & Resort',sector:'travel',market:'Shogran, KPK, Pakistan',platform:'WordPress',accent:'#c9a53a',
    summary:'Mountain resort website showcasing rooms, cottages, the photo gallery and guest experiences.',
    features:['Rooms & rates','Photo gallery','Experiences pages','Booking enquiries']},
  {slug:'americantax',name:'American Tax Defense',sector:'business',market:'United States',platform:'WordPress (Elementor)',accent:'#c8202f',
    summary:'Lead-generation website for a tax-relief firm, explaining IRS programmes and driving free consultation requests.',
    features:['Consultation lead forms','Tax-problem pages','Resource centre','Secure enquiry forms']},
  {slug:'estaff',name:'eStaff.pk',sector:'staffing',market:'Pakistan, nationwide',platform:'Custom build',accent:'#00866c',
    summary:'Staffing and HR website for homes and businesses: domestic staff, recruitment, HR outsourcing, payroll and remote teams.',
    features:['Find staff / find a job search','Business solutions pages','City coverage pages','FAQ']},
];
