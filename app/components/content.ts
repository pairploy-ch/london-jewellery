export const MAISONS = [
  "Cartier",
  "Van Cleef & Arpels",
  "Tiffany & Co.",
  "Bvlgari",
  "Chopard",
  "Chanel",
];

export const STEPS = [
  {
    no: "01",
    title: "Submit Your Details",
    body: "Tell us about you and the piece — brand, item type, materials and any context you have.",
  },
  {
    no: "02",
    title: "Eligibility Check",
    body: "We confirm the piece falls within our service. Pieces outside our scope are flagged before payment.",
  },
  {
    no: "03",
    title: "Accept & Pay",
    body: "After agreeing to our Terms & Disclaimer, we send a secure Stripe payment link directly to your email.",
  },
];

export const ITEM_TYPES = [
  "Ring",
  "Necklace",
  "Bracelet",
  "Earrings",
  "Pendant",
  "Brooch",
  "Watch",
  "Cufflinks",
  "Other",
];

/* the ten labelled photo slots shown in the upload step */
export const PHOTO_SLOTS = [
  {
    no: "01",
    title: "Front View",
    desc: "Full view of the front side, sharp and well-lit.",
  },
  {
    no: "02",
    title: "Back View",
    desc: "Full view of the back side to see the overall structure.",
  },
  {
    no: "03",
    title: "Top View",
    desc: "View from directly above the piece.",
  },
  {
    no: "04",
    title: "Bottom View",
    desc: "View from directly beneath the piece.",
  },
  {
    no: "05",
    title: "Stamp / Engraving 1",
    desc: "Close-up of metal purity stamps, maker's marks, or logos.",
  },
  {
    no: "06",
    title: "Stamp / Engraving 2",
    desc: "Close-up of any additional markings or stamps.",
  },
  {
    no: "07",
    title: "Serial Number / Ref 1",
    desc: "Clear, legible close-up of any unique numbers, codes, or model refs.",
  },
  {
    no: "08",
    title: "Serial Number / Ref 2",
    desc: "Close-up of any secondary unique reference numbers.",
  },
  {
    no: "09",
    title: "Detailed Close-up",
    desc: "Macro shot of gemstones, settings, prongs, clasps, or internal mechanisms.",
  },
  {
    no: "10",
    title: "Additional Photos",
    desc: "Any extra photos, certificates, original box, receipts, or other details you wish to provide.",
  },
];

/* reassurance cards shown above the assessment form */
export const ASSESSMENT_FEATURES = [
  { title: "Independent", body: "Independent Assessment Approach" },
  { title: "48h Turnaround", body: "Digital Assessment Report" },
  { title: "Secure Payment", body: "Secure Payment Link via Stripe" },
  {
    title: "Professional Assessment",
    body: "Independent Review Based on Submitted Materials",
  },
];

/* assessment fee — single source of truth for both the UI and the
   server-side PaymentIntent. Amount is in the currency's smallest unit
   (pence for GBP). Adjust here to change the price. */
export const ASSESSMENT_FEE = {
  // Stripe requires the session total to convert to at least £0.30 (this
  // account settles in GBP) — ฿10 only converts to ~£0.23 and gets rejected
  // with "amount_too_small", so the test price is raised to ฿50 here.
  amount: 5000, // ฿50.00 (test price) — THB is charged in satang, so 50 baht = 5000
  currency: "thb",
  label: "฿50",
};

/* steps shown in the assessment flow progress indicator */
export const ASSESSMENT_STEPS = [
  { no: "01", title: "Your Details" },
  { no: "02", title: "Eligibility" },
  { no: "03", title: "Accept & Pay" },
  { no: "04", title: "Photographs" },
];

/* legal copy — shared by the Terms modal and the standalone legal pages */
export type LegalSection = {
  title: string;
  body?: string[];
  bullets?: string[];
};

export const TERMS = {
  title: "Terms & Disclaimer",
  intro:
    "Welcome to London Jewellery Consult. By utilizing our online assessment services, you agree to the following terms and disclaimer:",
  sections: [
    {
      title: "Scope of Service",
      body: [
        "London Jewellery Consult provides an independent, visual-based consultation and assessment of fine jewellery. All findings and statements issued by us are professional opinions formulated solely from the high-resolution photographs submitted by the client.",
      ],
    },
    {
      title: "Limitations of Visual Assessment",
      body: [
        "This online service is conducted without physical or tactile inspection of the item. Therefore, our assessment is based strictly on the visual appearance within the submitted photographs and does not constitute a formal industry certificate or definitive verification of the item's physical characteristics.",
      ],
    },
    {
      title: "Limitation of Liability",
      body: [
        "Our consultation report is intended strictly for informational and educational purposes to assist the client. London Jewellery Consult shall not be held liable for any financial decisions, purchases, or sales made based on this online visual consultation.",
      ],
    },
    {
      title: "Payment & Refund Policy",
      body: [
        "Once payment has been received and the assessment, authentication, verification, research, or review process has commenced, fees are non-refundable.",
        "By purchasing our services, you acknowledge and agree that work begins upon receipt of payment. This includes time spent reviewing submitted information, conducting research, examining supporting materials, and performing assessment and verification activities.",
        "As our services involve professional time, expertise, and investigative work, no refund will be provided once the service process has started, regardless of the outcome of the assessment or whether the final result is “Unable to Verify”.",
        "This policy does not affect your statutory rights under applicable law.",
      ],
    },
  ] as LegalSection[],
};

export const PRIVACY = {
  title: "Privacy Policy",
  intro:
    "London Jewellery Consult (“we”, “our”, or “us”) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you use our online assessment services in accordance with the UK GDPR and the Data Protection Act 2018.",
  sections: [
    {
      title: "Information We Collect",
      body: [
        "We collect and process the following personal data provided directly by you when filling out our online assessment form:",
      ],
      bullets: [
        "Identity & Contact Data: Name, email address, and telephone number.",
        "Location & Address Data: Country and physical address.",
        "Assessment Data: Information regarding the jewellery item (metal type, brand, gemstone, item type) and any high-resolution photographs you submit for review.",
      ],
    },
    {
      title: "How We Use Your Information",
      body: [
        "We use your data strictly for professional purposes to deliver our services, including:",
      ],
      bullets: [
        "Providing independent online assessments, authentication research, and verification reports.",
        "Communicating with you regarding your submission and manual confirmation updates.",
        "Processing payments and maintaining professional business records.",
        "Complying with applicable legal and regulatory obligations in the United Kingdom.",
      ],
    },
    {
      title: "Payment Processing & Financial Data",
      body: [
        "To ensure maximum security, we do not store, collect, or process your credit card or payment card details on our servers. All financial transactions are processed securely through our third-party payment gateway, Stripe. Your payment information is governed strictly by Stripe’s own Privacy Policy.",
      ],
    },
    {
      title: "Sharing Your Information",
      body: [
        "We do not sell, rent, or trade your personal data to third parties. We may share your data only with trusted third-party service providers (such as Stripe for secure payment processing and our IT hosting infrastructure) who assist us in operating our website and conducting our business, subject to strict confidentiality agreements.",
      ],
    },
    {
      title: "Data Retention & Security",
      body: [
        "We implement strict technical and organisational security measures to protect your personal data and submitted photographs against unauthorised access, disclosure, or loss. In accordance with legal obligations and to support any potential future enquiries regarding our professional assessments, we will retain your personal data and submitted photographs for a period of six (6) years from the date of service completion, after which it will be securely deleted.",
      ],
    },
    {
      title: "Your Legal Rights",
      body: [
        "Under the UK GDPR, you have the right to access, correct, or request the restriction or deletion of your personal data. Please note that the right to erasure is not absolute; we may decline your deletion request if retaining your data and submitted photographs is required to comply with regulatory obligations or to exercise and defend potential legal claims within our 6-year retention period. To exercise any of these rights, please contact us directly via our official communication channels.",
      ],
    },
    {
      title: "Cookies",
      body: [
        "We use essential cookies and similar tracking technologies to ensure the proper functioning, security, and optimal performance of our website. These cookies do not collect sensitive personal information and are utilised solely to support the technical operations and delivery of our assessment services.",
      ],
    },
  ] as LegalSection[],
};

export const OUTCOMES = [
  {
    no: "01",
    title: "Verification Complete",
    body: "The piece has been reviewed and the assessment is complete based on the submitted materials.",
  },
  {
    no: "02",
    title: "Additional Information Required",
    body: "Further photographs or details are needed before the assessment can be finalised.",
  },
  {
    no: "03",
    title: "Unable to Verify",
    body: "The submitted materials are insufficient or the piece falls outside our scope of online assessment.",
  },
];
