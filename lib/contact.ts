// Set the confirmed business number in international format, digits only.
export const businessWhatsApp=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'').replace(/\D/g,'');
export const hasWhatsApp=/^[1-9]\d{7,14}$/.test(businessWhatsApp);
export function whatsappHref(message='Hello Inventive Clicks, I would like to discuss a project.'){return hasWhatsApp?`https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`:'/contact#whatsapp-contact'}
