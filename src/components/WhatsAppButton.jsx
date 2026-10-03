import { MessageCircle } from "lucide-react";
import { getWhatsAppHref } from "../data/contact.js";

export default function WhatsAppButton() {
  const href = getWhatsAppHref();

  if (!href) return null;

  return (
    <a
      aria-label="Chat with VIP StudioS on WhatsApp"
      className="whatsapp-float"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" size={21} />
      <span>WhatsApp</span>
    </a>
  );
}
