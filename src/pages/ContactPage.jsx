import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { serviceAreas } from "../data/services.js";

function createEmailBody({ name, email, phone, company, service, timeline, project }) {
  return [
    `Name: ${name}`,
    `Reply email: ${email}`,
    `Phone / WhatsApp: ${phone}`,
    `Company / brand: ${company || "Not provided"}`,
    `Service: ${service}`,
    `Expected timeline: ${timeline || "Not provided"}`,
    "",
    "Project idea:",
    project,
  ].join("\n");
}

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service");
  const selectedService = serviceAreas.some(
    (service) => service.enquiryValue === requestedService,
  )
    ? requestedService
    : "";

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
    const phone = String(formData.get("phone") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const timeline = String(formData.get("timeline") ?? "").trim();
    const project = String(formData.get("project") ?? "").trim();
    const nameField = event.currentTarget.elements.namedItem("name");
    const projectField = event.currentTarget.elements.namedItem("project");
    const phoneField = event.currentTarget.elements.namedItem("phone");

    if (!name) {
      nameField.setCustomValidity("Enter your name to continue.");
      nameField.reportValidity();
      setStatus("Please add your name to continue.");
      return;
    }
    nameField.setCustomValidity("");

    if (!project) {
      projectField.setCustomValidity("Add a short description of your project.");
      projectField.reportValidity();
      setStatus("Please describe your project in a few words.");
      return;
    }
    projectField.setCustomValidity("");

    if (phone.replace(/\D/g, "").length < 7) {
      phoneField.setCustomValidity("Enter a phone or WhatsApp number with at least 7 digits.");
      phoneField.reportValidity();
      setStatus("Please enter a valid phone or WhatsApp number to continue.");
      return;
    }
    phoneField.setCustomValidity("");

    const params = new URLSearchParams({
      subject: `Project enquiry from ${name}`,
      body: createEmailBody({ name, email, phone, company, service, timeline, project }),
    });
    setStatus(
      "Your email app should open with a draft. Review and send it there to complete your enquiry.",
    );
    window.location.href = `mailto:${contactConfig.email}?${params.toString()}`;
  }

  const whatsAppHref = getWhatsAppHref();

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
                  <span className="contact-pending">Email contact unavailable</span>
                )}
              </div>
            </div>
            {contactConfig.phoneNumber && (
              <div className="contact-channel">
                <Phone aria-hidden="true" size={18} />
                <div>
                  <span>Phone</span>
                  <a href={`tel:+${contactConfig.phoneNumber}`}>{contactConfig.phoneDisplay}</a>
                </div>
              </div>
            )}
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
            <span className="story-label">TELL US ABOUT YOUR PROJECT</span>
            <span className="form-status-dot" aria-hidden="true" />
          </div>
          <label>
            <span>
              Your name <span aria-hidden="true" className="field-required">*</span>
            </span>
            <input
              autoComplete="name"
              maxLength={100}
              name="name"
              onChange={(event) => event.currentTarget.setCustomValidity("")}
              placeholder="Name"
              required
            />
          </label>
          <div className="form-field-pair">
            <label>
              <span>
                Your email <span aria-hidden="true" className="field-required">*</span>
              </span>
              <input
                autoComplete="email"
                maxLength={254}
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>
            <label>
              <span>
                Phone / WhatsApp <span aria-hidden="true" className="field-required">*</span>
              </span>
              <input
                autoComplete="tel"
                maxLength={30}
                minLength={7}
                name="phone"
                onChange={(event) => event.currentTarget.setCustomValidity("")}
                placeholder="+91 00000 00000"
                required
                type="tel"
              />
            </label>
          </div>
          <label>
            <span>
              Company / brand <span className="field-optional">(optional)</span>
            </span>
            <input autoComplete="organization" maxLength={120} name="company" placeholder="Company or brand name" />
          </label>
          <label>
            <span>
              What do you need? <span aria-hidden="true" className="field-required">*</span>
            </span>
            <select defaultValue={selectedService} key={selectedService} name="service" required>
              <option disabled value="">Choose a service</option>
              {serviceAreas.map((service) => (
                <option key={service.id} value={service.enquiryValue}>
                  {service.label}
                </option>
              ))}
              <option value="A mix of social and video services">
                A mix of services
              </option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </label>
          <label>
            <span>
              Expected timeline <span className="field-optional">(optional)</span>
            </span>
            <select defaultValue="" name="timeline">
              <option value="">Choose a timeline</option>
              <option value="As soon as possible">As soon as possible</option>
              <option value="Within 2–4 weeks">Within 2–4 weeks</option>
              <option value="Within 1–3 months">Within 1–3 months</option>
              <option value="Flexible / to discuss">Flexible / to discuss</option>
            </select>
          </label>
          <label>
            <span>
              Project description <span aria-hidden="true" className="field-required">*</span>
            </span>
            <textarea
              maxLength={2000}
              name="project"
              onChange={(event) => event.currentTarget.setCustomValidity("")}
              placeholder="A few words about your account, idea, shoot, or edit..."
              required
              rows="5"
            />
          </label>
          <button className="button button-gold form-submit" type="submit">
            Continue by email <ArrowUpRight aria-hidden="true" size={17} />
          </button>
          <p aria-live="polite" className="form-status" role="status">
            {status || "This opens an email draft on your device. The site does not store or send your details."}
          </p>
          {!contactConfig.email && (
            <p className="form-config-note">
              Email enquiries are unavailable. You can still contact the studio on WhatsApp.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
