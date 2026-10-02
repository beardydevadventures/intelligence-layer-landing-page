// Defaults keep existing documents and the current page design working during migration.
export const defaultMarketingCopy = {
 homepageServicesHeading:'Practical systems.\nImmersive experiences.',
 homepageServicesIntroduction:'Choose the outcome you need. We shape the technology and delivery around it.',
 homepageIndustriesHeading:'Grounded in your operating world.',
 homepageIndustriesIntroduction:'From complex assets to people and processes, start with a challenge your organisation needs to solve.',
 homepageWorkHeading:'Ideas made\ninteractive.',
 homepageCredibilityHeading:'Built by the right team for the challenge.',
 homepageProductsHeading:'We build our own.',
 homepageCapabilityLine:'AI Automation · Enterprise AI Agents · XR · Digital Twins',
 servicesHeading:'Technology shaped around your problem.',
 servicesIntroduction:'Start with the outcome you need. We define the scope, test the assumptions and build a practical solution.',
 industriesHeading:'Start with the challenge in your sector.',
 industriesIntroduction:'These are potential applications of our services. Discovery checks the fit with your people, systems and operating requirements.',
 aboutDeliveryHeading:'Accountability from first conversation to delivery.',
 aboutEvidenceHeading:'See what we build.',
 aboutTeamHeading:'Meet the team',
 processHeading:'From possibility\nto practical.',
 processCtaLabel:'Start with a conversation',
 projectCtaLabel:'Start a project',
 serviceCtaLabel:'Discuss your project',
 serviceUseCasesHeading:'What can we build?',
 serviceCapabilitiesHeading:'What the solution can support.',
 serviceFaqHeading:'Before we build.',
 serviceProductionHeading:'Skills we can bring together',
 serviceDeliveryResponsibility:'Intelligence Layer leads the team and takes responsibility for the client relationship, project direction and overall delivery. Strategy, technical direction and delivery stay connected from the first conversation through to launch.',
 vrCtaLabel:'Build a VR experience',
 exploreServiceLabel:'Explore the service',
 compareServicesLabel:'Compare all services',
 exploreVrLabel:'Explore VR development',
 exploreIndustriesLabel:'Explore sector use cases and relevant services',
 viewWorkLabel:'View all work',
 aboutLinkLabel:'About Intelligence Layer',
 enquiryHeading:'What would you like to make possible?',
 enquiryIntroduction:'A few details help us understand the problem and prepare for a useful first conversation. You do not need a finished brief.',
 enquiryNextSteps:'We review your enquiry, follow up using your preferred contact method and discuss fit, constraints and a practical next step. Scope, fees and delivery arrangements are agreed before work begins.',
 enquiryEmailIntroduction:'Prefer email?',
 enquiryUnavailableCopy:'Online enquiries are being set up. Please email us to start a conversation.',
 enquiryInformationGuidance:'Please leave out confidential or sensitive project information at this stage.',
 enquiryDataHandlingCopy:'We use these details to respond to your project enquiry. Submission is handled through HubSpot. It does not subscribe you to marketing emails.',
 enquirySubmitLabel:'Send project enquiry',
 enquirySuccessHeading:'Thank you. Your enquiry has been received.',
 enquirySuccessCopy:'We will review the details and follow up using your preferred contact method to discuss the project and next steps.',
 enquirySuccessLinkLabel:'Explore our work while you wait',
};
export type MarketingCopy = typeof defaultMarketingCopy;
export type MarketingKey = keyof MarketingCopy;
export const marketingKeys = Object.keys(defaultMarketingCopy) as MarketingKey[];
export function marketingGroup(key: MarketingKey) {
 return key.startsWith('homepage') ? 'homepage' : key.startsWith('enquiry') ? 'enquiry' : /^(services|industries|about)/.test(key) && !key.endsWith('Label') ? 'pages' : 'callsToAction';
}
export const marketingTitle = (key: MarketingKey) => key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()).replace('Cta','CTA').replace('Vr','VR');
