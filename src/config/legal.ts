import { practice } from './practice';
export type LegalDocument = {
  title: string;
  introduction: string;
  sections: { title: string; paragraphs: string[] }[];
};
export const legal: Record<string, LegalDocument> = {
  privacy: {
    title: 'Privacy notice',
    introduction:
      'How contact and appointment enquiry information is handled. This template must be completed and approved before enquiries are enabled.',
    sections: [
      {
        title: 'Who is responsible for your information?',
        paragraphs: [
          `The intended data controller is ${practice.brand}. Approved controller contact: ${practice.privacy.controllerContact || 'awaiting confirmation'}. The owner must confirm their legal identity and a suitable contact address before launch.`,
        ],
      },
      {
        title: 'What this website collects',
        paragraphs: [
          'The forms ask for your name, email address, telephone number and either appointment preferences or a practical enquiry topic. They do not ask for medical histories, diagnoses or symptoms. The privacy acknowledgement records that you have read this notice; it is not a marketing opt-in.',
          'When enabled, form information is processed by the website server and sent to the practice using Resend. A separate acknowledgement is sent to your email address. The website does not create patient records or store enquiry details in an application database. Information will nevertheless exist in email systems and service-provider records.',
        ],
      },
      {
        title: 'Purpose and lawful basis',
        paragraphs: [
          `The intended purpose is to respond to enquiries and arrange requested appointments. The owner must confirm the appropriate lawful basis before processing starts: ${practice.privacy.lawfulBasis || 'not yet configured'}. Do not assume that acknowledging this notice establishes the lawful basis. No marketing list is created by these forms.`,
        ],
      },
      {
        title: 'Security and abuse prevention',
        paragraphs: [
          'The server validates requests and limits repeated submissions. Rate-limit identifiers are derived from an IP address and email address using a secret-key hash and stored temporarily in Upstash Redis. These are pseudonymous identifiers, not anonymous data. Raw form bodies are not deliberately written to application logs.',
          'The hosting provider may process connection metadata, such as IP addresses and access logs. Provider logging, access control and retention settings must be reviewed by the practice.',
        ],
      },
      {
        title: 'Providers and international transfers',
        paragraphs: [
          'The intended providers are Vercel for hosting, Resend for email delivery and Upstash for abuse prevention. The practice must confirm the providers actually used, processing regions, contracts, sub-processors and any international transfer safeguards before launch. Any external booking provider has a separate privacy notice, which should be read before using it.',
        ],
      },
      {
        title: 'How long information is kept',
        paragraphs: [
          `Enquiry and provider retention period: ${practice.privacy.retentionPeriod || 'awaiting owner approval'}. The practice must set a proportionate schedule for email inboxes, delivery logs, backups and hosting logs, and implement deletion procedures. Rate-limit keys expire according to the configured sliding-window algorithm. Clinical record retention is outside the scope of this website.`,
        ],
      },
      {
        title: 'Your rights and choices',
        paragraphs: [
          'Depending on the circumstances, you may have rights to access, correct or erase your information, restrict or object to processing and request data portability. Where processing relies on consent, you may withdraw that consent. Contact the approved controller address to exercise your rights; it must be published before the forms are activated.',
          'You can complain to the UK Information Commissioner’s Office. Visit ico.org.uk for current guidance and complaint routes. No automated clinical decision-making or profiling is performed by this website.',
        ],
      },
      {
        title: 'Cookies and local storage',
        paragraphs: [
          'This application does not add analytics, advertising or non-essential tracking cookies. Form values are not saved to browser storage. If optional tracking is introduced, the owner must review the notice and implement appropriate consent controls before it runs. Hosting and external booking arrangements should be assessed separately.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms and conditions',
    introduction:
      'Draft website and appointment terms for owner review. Final practice terms must be provided before patients enter into an agreement.',
    sections: [
      {
        title: 'Using this website',
        paragraphs: [
          'This website provides general information about proposed physiotherapy services. It does not diagnose conditions, replace an individual clinical assessment or promise a particular recovery outcome. Do not use the forms for emergency or urgent clinical advice.',
        ],
      },
      {
        title: 'Appointment requests',
        paragraphs: [
          'Submitting a request does not reserve a time or create a confirmed appointment. The practice must confirm availability, suitability, location, duration, fees and applicable terms directly with you. No payment is collected on this website.',
        ],
      },
      {
        title: 'Services, fees and payments',
        paragraphs: [
          'Services labelled as proposed are not confirmed independent offerings. Prices, payment methods, appointment durations, home visits and online consultation arrangements are awaiting approval. Any additional fees must be made clear before you agree an appointment.',
        ],
      },
      {
        title: 'Cancellation and rescheduling',
        paragraphs: [
          practice.cancellationPolicy ||
            'The practice’s cancellation notice period, rescheduling arrangements, late-arrival policy and any charges have not yet been confirmed. These terms must be completed, clearly communicated and agreed before booking.',
        ],
      },
      {
        title: 'Clinical consent and suitability',
        paragraphs: [
          'Treatment decisions and consent are discussed during the clinical process. You may ask questions, decline treatment or withdraw consent. The practice must confirm its arrangements for safeguarding, chaperones, accessibility, age limits and referrals before launch.',
        ],
      },
      {
        title: 'External links and photography',
        paragraphs: [
          'External websites operate under their own terms and privacy notices. Stock photographs are illustrative and do not depict Reona, her patients or her clinic. A real portrait will only be used with approval.',
        ],
      },
      {
        title: 'Your statutory rights',
        paragraphs: [
          'Nothing in these draft terms is intended to exclude statutory consumer rights or liability that cannot lawfully be excluded. The owner must obtain appropriate review of business identity, governing law, cancellation rights and any distance-contract obligations before public use.',
        ],
      },
    ],
  },
  complaints: {
    title: 'Complaints procedure',
    introduction:
      'A proposed procedure for raising concerns about the practice. Contact details and response times require owner approval.',
    sections: [
      {
        title: 'Raise a concern',
        paragraphs: [
          `Please contact the approved complaints contact: ${practice.complaints.contact || 'not yet published'}. The website enquiry form has a “Privacy or complaints” topic once enabled. Use this only to request contact; do not include clinical information in a general enquiry.`,
        ],
      },
      {
        title: 'Explain what happened',
        paragraphs: [
          'When a suitable communication method has been agreed, explain what happened, when it occurred and the outcome you would like. The practice should offer reasonable communication adjustments and explain how to authorise someone to act on your behalf.',
        ],
      },
      {
        title: 'Acknowledgement and investigation',
        paragraphs: [
          `Proposed acknowledgement timeframe: ${practice.complaints.acknowledgementTime || 'awaiting confirmation'}. Proposed substantive response timeframe: ${practice.complaints.responseTime || 'awaiting confirmation'}. These are not currently service commitments.`,
          'The intended process is to acknowledge your concern, review the relevant information, discuss the findings and explain any action. If more time is required, the practice should explain why and agree an update. The final procedure must identify the responsible person.',
        ],
      },
      {
        title: 'If you remain dissatisfied',
        paragraphs: [
          'Ask the practice for its approved escalation route. Concerns about a registrant’s fitness to practise can be raised with the HCPC where appropriate; this is distinct from an ordinary service complaint. Data protection concerns may be raised with the Information Commissioner’s Office. The owner must confirm any applicable independent complaints or mediation scheme.',
        ],
      },
    ],
  },
  accessibility: {
    title: 'Accessibility statement',
    introduction:
      'We aim to make this website usable by as many people as possible. The implementation targets WCAG 2.2 AA; this is not a claim of certified conformance.',
    sections: [
      {
        title: 'Using the website',
        paragraphs: [
          'You should be able to navigate using a keyboard, see a visible focus indicator, use the skip-to-content link, enlarge text and use the site on small screens. Forms have associated labels and text error messages. Frequently asked questions use native expandable controls.',
          'Animation respects the reduced-motion preference on your device. Images have alternative text where meaningful, and decorative elements are hidden from assistive technology.',
        ],
      },
      {
        title: 'Known limitations',
        paragraphs: [
          'Automated testing does not establish full accessibility. The practice must review the site with assistive technology and users with access needs before launch. Third-party booking systems and linked registration directories are outside this website’s direct control. Native date-input behaviour varies between browsers and devices.',
        ],
      },
      {
        title: 'Request an adjustment or report a problem',
        paragraphs: [
          'Use the approved business contact details on the Contact page once published, or choose “Clinic access” in the enquiry form once enabled. Tell the practice which page or task caused a problem and what format or adjustment would help. A response timeframe must be confirmed by the owner.',
        ],
      },
      {
        title: 'Review and maintenance',
        paragraphs: [
          'This statement is a draft prepared with the website. The owner must record an approval date, accessibility review findings and a review schedule before launch. New content and integrations should be checked for accessibility as they are added.',
        ],
      },
    ],
  },
};
