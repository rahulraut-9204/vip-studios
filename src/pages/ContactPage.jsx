import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { contactConfig } from "../data/contact.js";

function createEmailBody({ name, email, service, project }) {
  return [
    `Name: ${name}`,
    `Reply email: ${email}`,
    `Service: ${service}`,
    "",
    "Project idea:",
    project,
  ].join("\n");
}

export default function ContactPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("");

    if (!contactConfig.email) {
      setStatus(
        "Enquiry email is not configured yet. Add a verified public email in VITE_PUBLIC_EMAIL before launch.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const project = String(formData.get("project") ?? "").trim();
    const subject = encodeURIComponent(`Project enquiry from ${name}`);
    const body = encodeURIComponent(createEmailBody({ name, email, service, project }));
    window.location.href = `mailto:${contactConfig.email}?subject=${subject}&body=${body}`;
    setStatus("Your email app should open with a draft. Send it there to complete your enquiry.");
  }

  const whatsAppHref = contactConfig.whatsAppNumber
    ? `https://wa.me/${contactConfig.whatsAppNumber}?text=${encodeURIComponent("Hi VIP StudioS, I'd like to talk about a project.")}`
    : "";

  return (
    <section className="page-section page-gutter contact-page">
      <div className="contact-grid">
        <div className="contact-copy">
          <h1>
            Let&apos;s make
            <br />
            something
            <br />
            <span>move.</span>
          </h1>
          <p className="page-lede">
            Tell us what your social accounts need, what you want to film, or
            where a stronger edit could take you.
          </p>
          <div className="contact-channels">
            <div className="contact-channel">
              <Mail aria-hidden="true" size={18} />
              <div>
                <span>Email</span>
                {contactConfig.email ? (
                  <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
                ) : (
                  <span className="contact-pending">Public email to be supplied</span>
                )}
              </div>
            </div>
            <div className="contact-channel">
              <MessageCircle aria-hidden="true" size={18} />
              <div>
                <span>WhatsApp</span>
                {whatsAppHref ? (
                  <a href={whatsAppHref} rel="noreferrer" target="_blank">
                    Open a conversation <ArrowUpRight aria-hidden="true" size={13} />
                  </a>
                ) : (
                  <span className="contact-pending">Number to be supplied</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <form className="enquiry-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="story-label">YOUR FIRST NOTE</span>
            <span className="form-status-dot" aria-hidden="true" />
          </div>
          <label>
            <span>Your name</span>
            <input autoComplete="name" name="name" placeholder="Name" required />
          </label>
          <label>
            <span>Your email</span>
            <input
              autoComplete="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>
          <label>
            <span>What do you need?</span>
            <select defaultValue="" name="service" required>
              <option disabled value="">Choose a service</option>
              <option value="Social strategy, planning & account management">
                Social strategy &amp; account management
              </option>
              <option value="Video shoots">Video shoots</option>
              <option value="Professional editing">Professional editing</option>
              <option value="A mix of social and video services">
                A mix of services
              </option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </label>
          <label>
            <span>What are you thinking about?</span>
            <textarea
              name="project"
              placeholder="A few words about your account, idea, shoot, or edit..."
              required
              rows="5"
            />
          </label>
          <button className="button button-gold form-submit" type="submit">
            Prepare enquiry <ArrowUpRight aria-hidden="true" size={17} />
          </button>
          <p aria-live="polite" className="form-status" role="status">
            {status || "The form opens a local email draft; it does not store or send your details to a server."}
          </p>
          {!contactConfig.email && (
            <p className="form-config-note">
              Contact email placeholder: configure <code>VITE_PUBLIC_EMAIL</code> before publishing.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
