// Business phone and WhatsApp (same number). Env var can override the WhatsApp number.
export const businessWhatsApp=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'923435853835').replace(/D/g,'');
export const hasWhatsApp=/^[1-9]d{7,14}$/.test(businessWhatsApp);
export const businessPhone={display:'0343 5853835',international:'+92 343 5853835',href:'tel:+923435853835'};
export function whatsappHref(message='Hello Inventive Clicks, I would like to discuss a project.'){return hasWhatsApp?`https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`:'/contact#whatsapp-contact'}
