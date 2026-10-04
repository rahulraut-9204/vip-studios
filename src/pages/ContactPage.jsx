import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";

function createEmailBody(data) {
  return [
    `Name: ${data.name}`,
    `Company / brand: ${data.company || "Not provided"}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone / WhatsApp: ${data.phone || "Not provided"}`,
    `Website / Instagram: ${data.social || "Not provided"}`,
    `Service: ${data.service || "Not selected"}`,
    `Video type: ${data.videoType || "Not provided"}`,
    `Preferred timing: ${data.deadline || "Not provided"}`,
    `Reference links: ${data.references || "Not provided"}`,
    "",
    "Project brief:",
    data.requirements || "Not provided",
  ].join("\n");
}

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "";
  const validService = serviceOfferings.some((service) => service.enquiryValue === requestedService)
    ? requestedService
    : "";
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'd like to discuss a project. I'll share the brief and requirements here.",
  );

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("");

    const form = event.currentTarget;
    const fields = new FormData(form);
    if (String(fields.get("websiteTrap") || "").trim()) return;
    if (!form.reportValidity()) {
      setStatus("Check the required fields and correct any invalid details.");
      return;
    }

    const data = Object.fromEntries(
      [
        "name",
        "company",
        "email",
        "phone",
        "social",
        "service",
        "videoType",
        "deadline",
        "references",
        "requirements",
      ].map((key) => [key, String(fields.get(key) || "").trim()]),
    );

    const emailField = form.elements.namedItem("email");
    const phoneField = form.elements.namedItem("phone");
    if (!data.email && !data.phone) {
      setStatus("Add an email address or phone number so the studio can reply.");
      emailField.setCustomValidity("Enter an email or phone number.");
      phoneField.setCustomValidity("Enter an email or phone number.");
      emailField.reportValidity();
      return;
    }
    emailField.setCustomValidity("");
    phoneField.setCustomValidity("");
    if (data.phone && data.phone.replace(/\D/g, "").length < 7) {
      phoneField.setCustomValidity("Enter at least 7 digits, or clear the phone field.");
      phoneField.reportValidity();
      setStatus("Check the phone number or clear it and leave an email address instead.");
      return;
    }

    if (!contactConfig.email) {
      setStatus("Email enquiries are not configured. Please use WhatsApp if available.");
      return;
    }

    const subject = `Project brief from ${data.name}`;
    const params = new URLSearchParams({
      subject,
      body: createEmailBody(data),
    });
    setStatus(
      "Your email app should open with a draft. Review it and press Send to deliver your brief; this website does not store or submit the form.",
    );
    trackEvent("project_brief_draft_opened", { service_name: data.service });
    window.location.href = `mailto:${contactConfig.email}?${params.toString()}`;
  }

  function clearContactValidation(event) {
    const form = event.currentTarget.form;
    form.elements.namedItem("email").setCustomValidity("");
    form.elements.namedItem("phone").setCustomValidity("");
  }

  return (
    <section className="studio-page studio-contact-page">
      <div className="studio-contact-layout">
        <div className="studio-contact-copy">
          <p className="studio-location">CONTENT · SOCIAL · VIDEO · DIGITAL</p>
          <h1>
            Tell us about
            <br />
            your <span>project.</span>
          </h1>
          <p>
            Tell us what you want to create, manage or improve. A little context
            helps us shape the right scope and next step.
          </p>
          <div className="studio-contact-methods">
            <div>
              <Mail aria-hidden="true" size={17} />
              <span>Email</span>
              {contactConfig.email ? (
                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
              ) : (
                <span className="studio-contact-unavailable">Email not configured</span>
              )}
            </div>
            {contactConfig.phoneNumber && (
              <div>
                <Phone aria-hidden="true" size={17} />
                <span>Phone</span>
                <a href={`tel:+${contactConfig.phoneNumber}`}>{contactConfig.phoneDisplay}</a>
              </div>
            )}
            <div>
              <MessageCircle aria-hidden="true" size={17} />
              <span>WhatsApp</span>
              {whatsAppHref ? (
                <a href={whatsAppHref} rel="noreferrer" target="_blank">
                  Start a conversation <ArrowUpRight aria-hidden="true" size={13} />
                </a>
              ) : (
                <span className="studio-contact-unavailable">Number not configured</span>
              )}
            </div>
          </div>
        </div>

        <form className="studio-brief-form" noValidate onSubmit={handleSubmit}>
          <div className="studio-form-heading">
            <h2>Project brief</h2>
            <p>Required fields are marked. Share only what you know so far.</p>
          </div>
          <label>
            Name <span aria-hidden="true">*</span>
            <input autoComplete="name" maxLength={100} name="name" required />
          </label>
          <div className="studio-form-pair">
            <label>
              Company / brand
              <input autoComplete="organization" maxLength={120} name="company" />
            </label>
            <label>
              Website / Instagram
              <input autoComplete="url" maxLength={200} name="social" placeholder="https://" />
            </label>
          </div>
          <div className="studio-form-pair">
            <label>
              Email
              <input
                autoComplete="email"
                maxLength={254}
                name="email"
                onChange={clearContactValidation}
                type="email"
              />
            </label>
            <label>
              Phone / WhatsApp
              <input
                autoComplete="tel"
                maxLength={30}
                name="phone"
                onChange={clearContactValidation}
                type="tel"
              />
            </label>
          </div>
          <p className="studio-field-hint">Add at least one reply method: email or phone.</p>
          <label>
            Service required <span aria-hidden="true">*</span>
            <select defaultValue={validService} name="service" required>
              <option value="">Choose a service</option>
              {serviceOfferings.map((service) => (
                <option key={service.slug} value={service.enquiryValue}>{service.title}</option>
              ))}
              <option value="A mix of services">A mix of services</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </label>
          <div className="studio-form-pair">
            <label>
              Content format
              <select defaultValue="" name="videoType">
                <option value="">Choose a format</option>
                <option>Reels / short-form video</option>
                <option>YouTube video</option>
                <option>Podcast episode</option>
                <option>Brand or campaign content</option>
                <option>Long-form video</option>
                <option>Other / not sure</option>
              </select>
            </label>
            <label>
              Preferred timing
              <input maxLength={100} name="deadline" placeholder="Date or preferred timing" />
            </label>
          </div>
          <label>
            Reference links
            <textarea maxLength={1000} name="references" placeholder="Paste links to examples or relevant material" rows={2} />
          </label>
          <label>
            Project brief <span aria-hidden="true">*</span>
            <textarea
              maxLength={3000}
              name="requirements"
              placeholder="What do you need? Share the context, service and requirements you already know."
              required
              rows={5}
            />
          </label>
          <label aria-hidden="true" className="studio-trap-field" tabIndex="-1">
            Website
            <input autoComplete="off" name="websiteTrap" tabIndex="-1" />
          </label>
          <button className="button button-gold studio-submit" type="submit">
            Open project brief <ArrowUpRight aria-hidden="true" size={17} />
          </button>
          <p aria-live="polite" className="studio-form-status" role="status">
            {status || "Your device opens an email draft for you to review and send. The site does not submit or retain the brief."}
          </p>
        </form>
      </div>
    </section>
  );
}
