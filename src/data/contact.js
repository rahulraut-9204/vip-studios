const configuredEmail = import.meta.env.VITE_PUBLIC_EMAIL?.trim() ?? "";
const configuredWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";

const formatPhone = (number) =>
  number.startsWith("91") && number.length === 12
    ? `+91 ${number.slice(2, 7)} ${number.slice(7)}`
    : `+${number}`;

export const contactConfig = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail)
    ? configuredEmail
    : "",
  whatsAppNumber: configuredWhatsApp.length >= 7 ? configuredWhatsApp : "",
  phoneNumber: configuredWhatsApp.length >= 7 ? configuredWhatsApp : "",
  phoneDisplay: configuredWhatsApp.length >= 7 ? formatPhone(configuredWhatsApp) : "",
};

export function getWhatsAppHref(
  message = "Hi VIP StudioS, I'd like to discuss a social media or video project.",
) {
  return contactConfig.whatsAppNumber
    ? `https://wa.me/${contactConfig.whatsAppNumber}?text=${encodeURIComponent(message)}`
    : "";
}
