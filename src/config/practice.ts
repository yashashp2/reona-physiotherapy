export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: 'activity' | 'running' | 'hands' | 'heart' | 'exercise' | 'mobility' | 'brain' | 'cupping';
  enabled: boolean;
  confirmed: boolean;
  image: string;
  suitable: string[];
  approach: string;
  benefit: string;
};
export type FAQ = { question: string; answer: string; confirmed: boolean };
export type Price = {
  title: string;
  serviceSlug?: string;
  enabled: boolean;
  confirmed: boolean;
  amountGBP: number | null;
  durationMinutes: number | null;
};
export const practice = {
  name: 'Reona Barretto',
  brand: 'Reona Barretto Physiotherapy',
  title: 'Physiotherapist',
  // Keep false until the owner has approved all content and legal documents.
  launchReady: false,
  biography:
    'I’m Reona, a physiotherapist with clinical experience in the UK and India. I bring together hands-on assessment, rehabilitation and exercise science to help you work towards the movement that matters to you.',
  philosophy:
    'I believe good physiotherapy starts with listening. Your priorities, daily life and confidence are part of the picture. My approach is to understand your needs, explain the options clearly and build a practical plan with you.',
  portrait: null as { src: string; alt: string } | null,
  qualifications: [
    {
      title: 'MSc Sports and Exercise Science',
      institution: 'University of Essex',
      detail: 'Merit · 2024',
    },
    {
      title: 'Bachelor of Physiotherapy',
      institution: 'Miraj Medical Centre, Wanless Hospital',
      detail: '2018–2023',
    },
  ],
  certifications: [
    'Certified Cupping Therapy Specialist',
    'UK Care Certificate',
    'DBS certificate',
  ],
  registrations: [
    {
      title: 'HCPC Registered',
      description: 'Health and Care Professions Council',
      number: null as string | null,
      verified: false,
      url: 'https://www.hcpc-uk.org/check-the-register/',
    },
    {
      title: 'CSP Member',
      description: 'Chartered Society of Physiotherapy',
      number: null as string | null,
      verified: false,
      url: 'https://www.csp.org.uk/public-patient/find-physiotherapist',
    },
  ],
  experience: [
    {
      role: 'Self-Employed Physiotherapist',
      organisation: 'Revitality Clinic',
      location: 'West Ruislip, UK',
      start: 'May 2026',
      end: 'Present' as string | null,
      summary:
        'Individual assessments, hands-on treatment, rehabilitation programmes and support with understanding and managing recovery.',
    },
    {
      role: 'Care Assistant & Team Leader',
      organisation: 'Care Circle',
      location: 'Colchester, UK',
      start: 'March 2023',
      end: null as string | null,
      summary:
        'Supporting people with everyday movement and independence, and coordinating person-centred care with families and other professionals.',
    },
    {
      role: 'Consultant Physiotherapist',
      organisation: 'Areopagus Wellness Centre',
      location: 'Mumbai, India',
      start: 'May 2023',
      end: 'September 2023' as string | null,
      summary:
        'Musculoskeletal assessment, manual therapy and tailored advice to support mobility and everyday function.',
    },
    {
      role: 'Physiotherapist',
      organisation: 'Wanless Hospital',
      location: 'Sangli, India',
      start: 'October 2022',
      end: 'April 2023' as string | null,
      summary:
        'Experience across hospital and community rehabilitation, including orthopaedic, neurological and post-operative care.',
    },
  ],
  contact: { email: null as string | null, phone: null as string | null },
  clinics: [] as { name: string; address: string; postcode: string }[],
  serviceAreas: [] as string[],
  workingHours: [] as string[],
  bookingUrl: null as string | null,
  socialLinks: [] as { label: string; url: string }[],
  cancellationPolicy: null as string | null,
  privacy: {
    controllerContact: null as string | null,
    retentionPeriod: null as string | null,
    lawfulBasis: null as string | null,
  },
  complaints: {
    contact: null as string | null,
    acknowledgementTime: null as string | null,
    responseTime: null as string | null,
  },
  testimonials: [] as { quote: string; name: string; authorised: boolean }[],
};
export const services: Service[] = [
  {
    slug: 'musculoskeletal-physiotherapy',
    title: 'Musculoskeletal physiotherapy',
    short: 'More ease in your everyday movement.',
    description:
      'An individual approach to concerns affecting muscles, joints and movement, with assessment at the centre of your care.',
    icon: 'activity',
    enabled: true,
    confirmed: false,
    image: '/images/assessment.jpg',
    suitable: ['Back and neck pain', 'Shoulder or knee concerns', 'Joint stiffness'],
    approach:
      'We would explore your movement, strength and daily activities, then discuss a plan that may include exercise, advice and hands-on treatment.',
    benefit:
      'The aim is to improve your ability and confidence to manage everyday tasks. Progress varies from person to person.',
  },
  {
    slug: 'sports-rehabilitation',
    title: 'Sports rehabilitation',
    short: 'A considered return to the things you love.',
    description:
      'Progressive rehabilitation shaped around your sport, your starting point and the activities you want to return to.',
    icon: 'running',
    enabled: true,
    confirmed: false,
    image: '/images/sports-rehabilitation.jpg',
    suitable: ['Sports injuries', 'Muscle strains', 'Returning to activity'],
    approach:
      'Assessment would consider the demands of your activity, followed by a graded programme and review of how you respond to exercise.',
    benefit:
      'Work towards strength, movement control and readiness for activity without promising a particular recovery date.',
  },
  {
    slug: 'manual-therapy',
    title: 'Manual therapy',
    short: 'Hands-on care, with a wider perspective.',
    description:
      'Hands-on techniques considered as part of an individual treatment plan, alongside movement and practical advice.',
    icon: 'hands',
    enabled: true,
    confirmed: false,
    image: '/images/manual-therapy.jpg',
    suitable: ['Muscle tension', 'Joint stiffness', 'Movement-related discomfort'],
    approach:
      'Following assessment and your consent, appropriate techniques may be discussed. Treatment is adapted to your comfort and response.',
    benefit:
      'May help with comfort and movement for some people. Hands-on care is considered in the context of your overall rehabilitation.',
  },
  {
    slug: 'post-operative-rehabilitation',
    title: 'Post-operative rehabilitation',
    short: 'Support for your next stage of recovery.',
    description:
      'Rehabilitation that takes account of your procedure, surgical guidance and individual recovery.',
    icon: 'heart',
    enabled: true,
    confirmed: false,
    image: '/images/exercise.jpg',
    suitable: ['Post-operative recovery', 'Reduced strength', 'Difficulty with everyday tasks'],
    approach:
      'Your surgical team’s precautions and rehabilitation guidance would inform the assessment, exercises and progression.',
    benefit:
      'The focus is on working towards everyday function at an appropriate pace. Suitability depends on your procedure and clinical advice.',
  },
  {
    slug: 'exercise-therapy',
    title: 'Exercise therapy',
    short: 'Purposeful movement. A plan that fits you.',
    description:
      'An achievable movement programme tailored to your needs, abilities and day-to-day life.',
    icon: 'exercise',
    enabled: true,
    confirmed: false,
    image: '/images/exercise.jpg',
    suitable: ['Reduced strength', 'Movement confidence', 'Rehabilitation goals'],
    approach:
      'We would establish a starting point, practise appropriate exercises and adjust the programme as your needs change.',
    benefit:
      'Aims to build capacity and confidence through a manageable programme, with guidance on how to progress.',
  },
  {
    slug: 'mobility-rehabilitation',
    title: 'Mobility & functional rehabilitation',
    short: 'Confidence in the movements that matter.',
    description:
      'Practical rehabilitation focused on walking, balance and the movements involved in daily life.',
    icon: 'mobility',
    enabled: true,
    confirmed: false,
    image: '/images/exercise.jpg',
    suitable: ['Reduced mobility', 'Balance difficulties', 'Everyday movement tasks'],
    approach:
      'Assessment would explore the activities you find difficult and consider strength, balance, your environment and any support you use.',
    benefit:
      'The aim is to support independence and safer movement. Further assessment or referral may be needed.',
  },
  {
    slug: 'neurological-rehabilitation',
    title: 'Neurological rehabilitation',
    short: 'Individual support for complex needs.',
    description:
      'A proposed service for movement difficulties associated with neurological conditions, subject to scope and suitability.',
    icon: 'brain',
    enabled: true,
    confirmed: false,
    image: '/images/exercise.jpg',
    suitable: ['Movement difficulties', 'Changes in balance', 'Functional rehabilitation needs'],
    approach:
      'Suitability would be considered individually, alongside your existing healthcare team and any specialist support needed.',
    benefit:
      'Goals are based on what matters to you and may focus on maintaining function or practising everyday movement.',
  },
  {
    slug: 'cupping-therapy',
    title: 'Cupping therapy',
    short: 'An optional approach, carefully considered.',
    description:
      'A proposed complementary treatment that would only be offered after discussion of suitability, risks and alternatives.',
    icon: 'cupping',
    enabled: true,
    confirmed: false,
    image: '/images/manual-therapy.jpg',
    suitable: ['People wishing to discuss a complementary approach'],
    approach:
      'Evidence for cupping is limited. It can leave temporary skin marks and is not appropriate for everyone. Benefits, risks and alternatives must be discussed before consent.',
    benefit:
      'No specific benefit or recovery outcome is promised. Cupping is not a substitute for assessment or appropriate medical care.',
  },
];
export function visibleServices() {
  return services.filter((s) => s.enabled && (!practice.launchReady || s.confirmed));
}
export const prices: Price[] = [
  {
    title: 'Initial physiotherapy assessment',
    enabled: true,
    confirmed: false,
    amountGBP: null,
    durationMinutes: null,
  },
  {
    title: 'Follow-up appointment',
    enabled: true,
    confirmed: false,
    amountGBP: null,
    durationMinutes: null,
  },
  {
    title: 'Sports rehabilitation session',
    serviceSlug: 'sports-rehabilitation',
    enabled: true,
    confirmed: false,
    amountGBP: null,
    durationMinutes: null,
  },
  { title: 'Home visit', enabled: true, confirmed: false, amountGBP: null, durationMinutes: null },
  {
    title: 'Online consultation',
    enabled: true,
    confirmed: false,
    amountGBP: null,
    durationMinutes: null,
  },
  {
    title: 'Cupping therapy',
    serviceSlug: 'cupping-therapy',
    enabled: true,
    confirmed: false,
    amountGBP: null,
    durationMinutes: null,
  },
];
export const conditions = [
  'Back pain',
  'Neck pain',
  'Shoulder pain',
  'Knee pain',
  'Sports injuries',
  'Muscle strains',
  'Joint stiffness',
  'Reduced mobility',
  'Post-operative recovery',
  'Balance and movement difficulties',
].map((title) => ({ title, confirmed: false, enabled: true }));
export const faqs: FAQ[] = [
  {
    question: 'What happens during the first appointment?',
    answer:
      'An initial physiotherapy assessment usually includes a conversation about your goals and relevant health history, followed by an assessment of movement. Findings and treatment options are discussed with you. Please share health information during your clinical appointment, rather than through this website.',
    confirmed: true,
  },
  {
    question: 'Do I need a GP referral?',
    answer:
      'Private physiotherapy can often be accessed without a GP referral. The practice’s referral arrangements and any insurer requirements need to be confirmed before booking.',
    confirmed: false,
  },
  {
    question: 'What should I wear?',
    answer:
      'Comfortable clothing that allows you to move is usually helpful. Your physiotherapist can advise on anything specific to your appointment. Your comfort and consent matter throughout assessment.',
    confirmed: true,
  },
  {
    question: 'How long does a session last?',
    answer:
      'Appointment durations are awaiting confirmation. The length and price of your session will need to be agreed before you book.',
    confirmed: false,
  },
  {
    question: 'How many sessions might I need?',
    answer:
      'This depends on your needs, goals and response to treatment. Your physiotherapist can discuss an initial plan after assessment and review it with you as you progress.',
    confirmed: true,
  },
  {
    question: 'Are home visits available?',
    answer:
      'Home visits are a potential future offering. Availability, service area and any additional fees are awaiting confirmation.',
    confirmed: false,
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Accepted payment methods and payment timing are awaiting confirmation. No payment is taken through this website.',
    confirmed: false,
  },
];
