"use client";

import { useState, useEffect, useRef } from "react";

/* ── Section Data ─────────────────────────────────────────────────── */

interface TermsSection {
  id: string;
  number: string;
  title: string;

  content: React.ReactNode;
}

const sections: TermsSection[] = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",

    content: (
      <>
        <p>
          By accessing, browsing, or using the HomeFixPro platform — including
          our website, mobile application, and any related services — you
          acknowledge that you have read, understood, and agree to be bound by
          these Terms and Conditions.
        </p>
        <p>
          If you do not agree with any part of these terms, you must not use our
          platform. Your continued use of HomeFixPro after any updates to these
          terms constitutes your acceptance of the revised terms.
        </p>
        <div className="terms-highlight">
          <strong>Important:</strong> We recommend reviewing these terms
          periodically. Using our services after changes are posted means you
          accept those changes.
        </div>
      </>
    ),
  },
  {
    id: "eligibility",
    number: "02",
    title: "User Eligibility",

    content: (
      <>
        <p>
          To use HomeFixPro, you must be at least 18 years of age and legally
          capable of entering into binding agreements. By registering, you
          confirm that you meet these eligibility requirements.
        </p>
        <h3>Registration Accuracy</h3>
        <p>
          You must provide accurate, current, and complete information during the
          registration process. This includes your full name, email address,
          phone number, and service location details.
        </p>
        <h3>Account Security</h3>
        <p>
          You are solely responsible for maintaining the confidentiality of your
          account credentials. Any activity that occurs under your account is
          your responsibility. If you suspect unauthorized access, notify us
          immediately at{" "}
          <span className="text-gold">support@homefixpro.com</span>.
        </p>
        <ul>
          <li>Keep your password secure and do not share it with others</li>
          <li>Use a strong, unique password for your HomeFixPro account</li>
          <li>Log out from shared or public devices after each session</li>
          <li>
            Notify us immediately if you detect any unauthorized activity
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "services",
    number: "03",
    title: "Services Offered",

    content: (
      <>
        <p>
          HomeFixPro operates as an intermediary platform that connects customers
          with qualified, independent technicians and service professionals for
          home repair and maintenance needs.
        </p>
        <h3>Platform Role</h3>
        <p>
          We facilitate the connection between customers and technicians. While
          we vet and verify our service professionals, HomeFixPro itself does not
          directly perform any repair or maintenance services.
        </p>
        <h3>Service Availability</h3>
        <ul>
          <li>
            Availability of technicians may vary based on your location,
            requested service type, and time of booking
          </li>
          <li>
            Certain services may not be available in all areas — we are
            continuously expanding our coverage
          </li>
          <li>
            We reserve the right to modify, suspend, or discontinue any service
            offering at any time with reasonable notice
          </li>
        </ul>
        <div className="terms-highlight">
          HomeFixPro is a marketplace platform. The actual services are provided
          by independent technicians, not by HomeFixPro directly.
        </div>
      </>
    ),
  },
  {
    id: "booking",
    number: "04",
    title: "Booking Policy",

    content: (
      <>
        <p>
          When booking a service through HomeFixPro, you agree to provide
          accurate and detailed information about the service required to ensure
          the best possible match with a qualified technician.
        </p>
        <h3>Booking Requirements</h3>
        <ul>
          <li>
            Provide a clear and accurate description of the issue or service
            needed
          </li>
          <li>
            Specify the correct service address with any relevant access
            instructions
          </li>
          <li>
            Select your preferred date and time from the available slots
          </li>
          <li>
            Include photos or additional details when prompted to help
            technicians prepare
          </li>
        </ul>
        <h3>Scheduling</h3>
        <p>
          You can schedule services for your preferred date and time, subject to
          technician availability. We will confirm your booking and provide
          technician details before the scheduled appointment.
        </p>
        <p>
          Booking confirmations are sent via email and in-app notifications. It
          is your responsibility to verify all booking details upon receiving the
          confirmation.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    number: "05",
    title: "Pricing & Payments",

    content: (
      <>
        <p>
          HomeFixPro strives to maintain transparent and fair pricing for all
          services offered through our platform.
        </p>
        <h3>Service Charges</h3>
        <ul>
          <li>
            Service charges vary depending on the type, complexity, and duration
            of the service requested
          </li>
          <li>
            Estimated pricing is displayed before you confirm your booking
          </li>
          <li>
            Any additional charges (e.g., for extra parts, extended labor) will
            be clearly communicated and require your approval before service
            completion
          </li>
        </ul>

        <h3>Taxes & Fees</h3>
        <p>
          All prices displayed are exclusive of applicable taxes unless stated
          otherwise. GST and any applicable platform fees will be itemized
          separately in your invoice.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    number: "06",
    title: "Cancellation & Rescheduling",

    content: (
      <>
        <p>
          We understand that plans change. HomeFixPro provides flexible
          cancellation and rescheduling options to accommodate your needs.
        </p>
        <h3>Cancellation Policy</h3>
        <ul>
          <li>
            <strong>Free cancellation:</strong> Cancel at no charge up to 4
            hours before the scheduled service time
          </li>
          <li>
            <strong>Late cancellation:</strong> Cancellations made within 4
            hours of the scheduled time may incur a cancellation fee of up to
            20% of the service charge
          </li>
          <li>
            <strong>No-show:</strong> If you are unavailable at the scheduled
            time without prior notice, you may be charged up to 50% of the
            service fee
          </li>
        </ul>
        <h3>Rescheduling</h3>
        <ul>
          <li>
            Rescheduling is free if done at least 2 hours before the scheduled
            time
          </li>
          <li>
            You can reschedule up to 2 times per booking — after that, you will
            need to place a new booking
          </li>
          <li>
            Rescheduled appointments are subject to technician availability
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "technician",
    number: "07",
    title: "Technician Responsibilities",

    content: (
      <>
        <p>
          All technicians on the HomeFixPro platform are expected to uphold the
          highest standards of professionalism and quality.
        </p>
        <h3>Professional Standards</h3>
        <ul>
          <li>
            Arrive on time and maintain professional conduct throughout the
            service
          </li>
          <li>
            Provide quality workmanship and use appropriate tools and materials
          </li>
          <li>
            Clearly communicate the scope of work, estimated time, and any
            additional costs before beginning service
          </li>
          <li>
            Clean up the work area upon completing the service
          </li>
        </ul>
        <h3>Verification & Onboarding</h3>
        <p>
          Before onboarding, all technicians must complete our verification
          process, which includes:
        </p>
        <ul>
          <li>Identity verification with government-issued ID</li>
          <li>Background checks and police verification</li>
          <li>Skill assessment and qualification verification</li>
          <li>Completion of our platform orientation program</li>
        </ul>
      </>
    ),
  },
  {
    id: "customer",
    number: "08",
    title: "Customer Responsibilities",

    content: (
      <>
        <p>
          As a customer, you play an important role in ensuring a smooth and safe
          service experience for everyone involved.
        </p>
        <h3>Your Obligations</h3>
        <ul>
          <li>
            Provide safe, clean, and accessible entry to the service location
          </li>
          <li>
            Ensure someone 18 years or older is present at the location during
            the service
          </li>
          <li>
            Provide accurate and complete descriptions of the issue requiring
            attention
          </li>
          <li>
            Treat technicians with respect and courtesy
          </li>
        </ul>
        <h3>Misuse & Fraud Prevention</h3>
        <div className="terms-highlight">
          <strong>Warning:</strong> Fake bookings, fraudulent claims,
          harassment, or any form of misuse of the platform will result in
          immediate account suspension and may lead to legal action.
        </div>
        <p>
          HomeFixPro reserves the right to investigate and take appropriate
          action against accounts suspected of fraudulent or abusive behavior.
        </p>
      </>
    ),
  },
  {
    id: "emergency",
    number: "09",
    title: "Emergency Service Policy",

    content: (
      <>
        <p>
          HomeFixPro offers an emergency service option for urgent home repair
          needs that require immediate attention — such as plumbing leaks,
          electrical hazards, or broken locks.
        </p>
        <h3>Priority Handling</h3>
        <ul>
          <li>
            Emergency requests are prioritized in our system and assigned to the
            nearest available qualified technician
          </li>
          <li>
            Response times may vary depending on technician availability, your
            location, and current demand
          </li>
          <li>
            We aim to dispatch a technician within 60 minutes of an emergency
            request, though this is not guaranteed
          </li>
        </ul>
        <h3>Emergency Pricing</h3>
        <p>
          Emergency service requests may carry additional surcharges due to
          priority dispatch and off-hours availability. These charges will be
          clearly displayed before you confirm the booking.
        </p>
      </>
    ),
  },
  {
    id: "safety",
    number: "10",
    title: "Safety Guidelines",

    content: (
      <>
        <p>
          Your safety is our top priority. HomeFixPro implements multiple safety
          measures and encourages users to stay vigilant.
        </p>
        <h3>Verification</h3>
        <ul>
          <li>
            Always verify the technician&apos;s identity using the details
            provided in your booking confirmation (name, photo, and OTP)
          </li>
          <li>
            Technicians will carry a HomeFixPro ID badge — request to see it
            before allowing entry
          </li>
          <li>
            You can track your technician&apos;s arrival in real-time through the
            app
          </li>
        </ul>
        <h3>Reporting Concerns</h3>
        <p>
          If you experience or witness any suspicious, unsafe, or inappropriate
          behavior, report it immediately through:
        </p>
        <ul>
          <li>
            The in-app <strong>Report &amp; Safety</strong> button (available during
            and after service)
          </li>
          <li>
            Our 24/7 safety hotline:{" "}
            <span className="text-gold">+91 XXXXX XXXXX</span>
          </li>
          <li>
            Email:{" "}
            <span className="text-gold">safety@homefixpro.com</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "refund",
    number: "11",
    title: "Refund Policy",

    content: (
      <>
        <p>
          HomeFixPro is committed to customer satisfaction. If you are not
          satisfied with a service, our refund policy ensures a fair resolution.
        </p>
        <h3>Refund Eligibility</h3>
        <ul>
          <li>
            <strong>Service not completed:</strong> Full refund if the
            technician fails to complete the agreed-upon service
          </li>
          <li>
            <strong>Quality issues:</strong> Partial or full refund if the
            service quality does not meet reasonable standards (assessed on a
            case-by-case basis)
          </li>
          <li>
            <strong>Duplicate charges:</strong> Full refund for any erroneous or
            duplicate charges
          </li>
          <li>
            <strong>Technician no-show:</strong> Full refund if the assigned
            technician does not arrive
          </li>
        </ul>
        <h3>Refund Timeline</h3>
        <p>
          Approved refunds are processed within 5–7 business days to the
          original payment method. Wallet credit refunds are processed
          instantly.
        </p>
        <div className="terms-highlight">
          To request a refund, go to <strong>My Bookings → Select Booking →
            Request Refund</strong>, or contact our support team within 48 hours of
          service completion.
        </div>
      </>
    ),
  },
  {
    id: "liability",
    number: "12",
    title: "Limitation of Liability",

    content: (
      <>
        <p>
          While HomeFixPro strives to provide a reliable and high-quality
          platform, there are certain limitations to our liability.
        </p>
        <h3>Platform Liability</h3>
        <ul>
          <li>
            HomeFixPro is not liable for any direct, indirect, incidental, or
            consequential damages arising from the use of services booked
            through our platform
          </li>
          <li>
            We are not liable for damages caused by circumstances beyond our
            reasonable control, including natural disasters, power failures, or
            third-party service disruptions
          </li>
          <li>
            Service outcomes may vary depending on the nature of the repair,
            condition of existing equipment, and other factors outside our
            control
          </li>
        </ul>
        <h3>Warranty</h3>
        <p>
          HomeFixPro provides a 30-day service warranty on most repairs. If the
          same issue recurs within 30 days of the original service, we will
          arrange a follow-up visit at no additional cost. Warranty terms may
          vary by service type.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    number: "13",
    title: "Privacy & Data Protection",

    content: (
      <>
        <p>
          HomeFixPro respects your privacy and is committed to protecting your
          personal data in accordance with applicable privacy laws and
          regulations.
        </p>
        <h3>Data Collection & Usage</h3>
        <ul>
          <li>
            We collect only the information necessary to provide and improve our
            services — including your name, contact details, location, and
            service history
          </li>
          <li>
            Your data is used solely for service delivery, communication,
            personalization, and platform improvement
          </li>
          <li>
            We do not sell, rent, or trade your personal information to third
            parties for marketing purposes
          </li>
        </ul>
        <h3>Data Security</h3>
        <p>
          We employ industry-standard security measures — including encryption,
          secure servers, and access controls — to protect your personal
          information from unauthorized access, alteration, or disclosure.
        </p>
        <p>
          For full details, please read our{" "}
          <a href="/privacy" className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "prohibited",
    number: "14",
    title: "Prohibited Activities",

    content: (
      <>
        <p>
          The following activities are strictly prohibited on the HomeFixPro
          platform. Violation may result in immediate account suspension or
          termination.
        </p>
        <ul>
          <li>
            Placing fake, misleading, or fraudulent bookings
          </li>
          <li>
            Harassing, threatening, or abusing technicians, support staff, or
            other users
          </li>
          <li>
            Attempting to exploit, hack, reverse-engineer, or misuse the
            platform or its systems
          </li>
          <li>
            Using the platform to engage in any unlawful or illegal activities
          </li>
          <li>
            Circumventing the platform to negotiate directly with technicians to
            avoid service fees
          </li>
          <li>
            Creating multiple accounts to abuse promotions or referral programs
          </li>
          <li>
            Posting false reviews or manipulating rating systems
          </li>
        </ul>
        <div className="terms-highlight">
          <strong>Zero tolerance:</strong> HomeFixPro maintains a zero-tolerance
          policy for harassment and abuse. Violations will be reported to the
          appropriate authorities.
        </div>
      </>
    ),
  },
  {
    id: "suspension",
    number: "15",
    title: "Account Suspension & Termination",

    content: (
      <>
        <p>
          HomeFixPro reserves the right to suspend, restrict, or permanently
          terminate any user account that violates these Terms and Conditions.
        </p>
        <h3>Grounds for Suspension</h3>
        <ul>
          <li>Violation of any provision of these Terms and Conditions</li>
          <li>
            Engaging in prohibited activities as outlined in Section 14
          </li>
          <li>
            Repeated cancellations, no-shows, or disruptive behavior
          </li>
          <li>
            Providing false or misleading information during registration or
            booking
          </li>
          <li>Non-payment or payment fraud</li>
        </ul>
        <h3>Appeal Process</h3>
        <p>
          If your account has been suspended, you may file an appeal by
          contacting our support team at{" "}
          <span className="text-gold">appeals@homefixpro.com</span> with your
          account details and the reason for your appeal. Appeals are reviewed
          within 7 business days.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "16",
    title: "Changes to Terms",

    content: (
      <>
        <p>
          HomeFixPro may update or modify these Terms and Conditions from time
          to time to reflect changes in our services, legal requirements, or
          business practices.
        </p>
        <h3>Notification</h3>
        <ul>
          <li>
            We will notify users of significant changes via email, in-app
            notifications, or a prominent notice on our website
          </li>
          <li>
            Minor updates may be posted directly to this page without individual
            notification
          </li>
          <li>
            The &quot;Last updated&quot; date at the top of this page reflects the most
            recent revision
          </li>
        </ul>
        <p>
          Your continued use of HomeFixPro after changes are posted constitutes
          acceptance of the updated terms. If you disagree with any changes, you
          should discontinue use of the platform and contact us to deactivate
          your account.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "17",
    title: "Contact Information",

    content: (
      <>
        <p>
          If you have any questions, concerns, or feedback regarding these Terms
          and Conditions, please don&apos;t hesitate to reach out to us.
        </p>
        <h3>Customer Support</h3>
        <div className="terms-contact-grid">
          <div className="terms-contact-card">
            <span className="terms-contact-label">Email</span>
            <span className="text-gold">support@homefixpro.com</span>
          </div>
          <div className="terms-contact-card">
            <span className="terms-contact-label">Phone</span>
            <span className="text-gold">+91 XXXXX XXXXX</span>
          </div>
          <div className="terms-contact-card">
            <span className="terms-contact-label">Hours</span>
            <span className="text-text-primary">Mon – Sat, 9 AM – 7 PM IST</span>
          </div>
          <div className="terms-contact-card">
            <span className="terms-contact-label">Address</span>
            <span className="text-text-primary">Mangalore, Karnataka, India</span>
          </div>
        </div>
        <h3>Grievance Redressal</h3>
        <p>
          For grievances or escalated complaints, please contact our Grievance
          Officer:
        </p>
        <ul>
          <li>
            <strong>Name:</strong> Grievance Officer, HomeFixPro
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <span className="text-gold">grievance@homefixpro.com</span>
          </li>
          <li>
            <strong>Response time:</strong> We acknowledge all grievances within
            48 hours and aim to resolve them within 15 business days
          </li>
        </ul>
      </>
    ),
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* Intersection observer to track visible section */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    for (const section of sections) {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex gap-12 lg:gap-16">
      {/* ── Sidebar Navigation (desktop) ───────────────────── */}
      <aside className="hidden lg:block w-72 shrink-0">
        <nav className="sticky top-8" id="terms-nav">
          <h2 className="text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-6">
            Table of Contents
          </h2>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  id={`nav-${section.id}`}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-3
                    ${activeSection === section.id
                      ? "bg-gold/10 text-gold border border-border-gold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent"
                    }
                  `}
                >
                  <span className="text-[10px] font-mono text-text-muted w-5">
                    {section.number}
                  </span>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ── Sections ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Mobile TOC */}
        <details className="lg:hidden mb-10 group" id="terms-mobile-nav">
          <summary className="flex items-center justify-between px-5 py-4 rounded-xl bg-surface border border-border cursor-pointer text-text-primary text-sm font-semibold">
            <span>📑 Table of Contents</span>
            <svg
              className="w-4 h-4 text-text-muted transition-transform duration-200 group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <nav className="mt-2 px-2">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      scrollToSection(section.id);
                      /* Close details on click */
                      const details = document.getElementById(
                        "terms-mobile-nav"
                      ) as HTMLDetailsElement | null;
                      if (details) details.open = false;
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:text-gold hover:bg-surface-hover transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <span className="text-[10px] font-mono text-text-muted w-5">
                      {section.number}
                    </span>
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        {/* Section cards */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
              className="terms-section scroll-mt-8"
              style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
            >
              {/* Section header */}
              <div className="flex items-center gap-4 mb-6">

                <div>
                  <span className="block text-[10px] font-mono font-semibold tracking-widest uppercase text-gold-muted">
                    Section {section.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* Section body */}
              <div className="terms-body">{section.content}</div>
            </section>
          ))}
        </div>

        {/* ── Consent / Checkbox Preview ─────────────────────── */}
        <div className="mt-16 p-8 rounded-2xl bg-surface border border-border" id="terms-consent-preview">
          <h2 className="text-lg font-heading font-bold text-text-primary mb-2">
            Consent Checkbox
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            The following checkbox is displayed during signup and service
            booking:
          </p>
          <div className="flex items-start gap-3 p-5 rounded-xl bg-obsidian border border-border-gold">
            <input
              type="checkbox"
              id="terms-agree-preview"
              className="mt-0.5 w-5 h-5 rounded-md border-2 border-gold accent-gold cursor-pointer"
              readOnly
            />
            <label
              htmlFor="terms-agree-preview"
              className="text-sm text-text-secondary leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <a
                href="/terms"
                className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </a>{" "}
              of HomeFixPro.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
