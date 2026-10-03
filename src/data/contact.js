const configuredEmail = import.meta.env.VITE_PUBLIC_EMAIL?.trim() ?? "";
const configuredWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";

export const contactConfig = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail)
    ? configuredEmail
    : "",
  whatsAppNumber: configuredWhatsApp.length >= 7 ? configuredWhatsApp : "",
};
