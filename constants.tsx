
import React from 'react';

export const GEMINI_MODEL = 'gemini-3-flash-preview';
export const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';

// App Logo Reference
export const APP_LOGO = 'agrix_logo.png';

// Local references to the brand logos provided
export const BRAND_LOGOS: Record<string, string> = {
  'Coromandel': 'coromandel_logo.png',
  'IFFCO': 'iffco_logo.png',
  'BASF': 'basf_logo.png',
  'Syngenta': 'syngenta_logo.png',
  'Dow': 'dow_logo.png',
  'Bayer': 'bayer_logo.png'
};

export const BRAND_COLORS: Record<string, string> = {
  'Bayer': '#0091df',
  'Syngenta': '#003d7c',
  'Corteva': '#0054a6',
  'BASF': '#004a96',
  'FMC': '#e31b23',
  'UPL': '#f15a22',
  'Coromandel': '#f37021',
  'IFFCO': '#00843d',
  'Dow': '#e31b23'
};

export const TRANSLATIONS = {
  en: {
    title: "AGRO",
    subtitle: "DOC",
    heroTitle: "Heal Your Crops",
    heroGradient: "In Real-Time",
    heroDesc: "Scan any plant leaf to detect pests, diseases, and nutrient deficiencies with expert precision.",
    smartScan: "Smart Scan",
    useCamera: "Use Camera",
    uploadPhoto: "Upload Photo",
    fromFiles: "From Files",
    aiAnalyzing: "AI ANALYZING...",
    scanningBio: "Scanning Biology",
    refDb: "Cross-referencing global disease database...",
    talkExpert: "Talk to Agrix Expert",
    expertDesc: "Get voice guidance in your language",
    obs: "Observations",
    protocol: "AI Protocol",
    products: "Care Products",
    prevention: "Preventive Strategies",
    newDiag: "Run New Diagnostic",
    systemFault: "System Fault",
    reboot: "REBOOT SYSTEM",
    back: "Go Back",
    initializing: "Initializing Lens...",
    focus: "Focus on leaf surface",
    connecting: "Connecting to Expert...",
    active: "Expert is Listening",
    stop: "End Call",
    contactUs: "Contact Us",
    viewDetails: "View Product Details",
    partners: "Trusted Crop Care Partners",
    testimonialsTitle: "What Our Farmers Say",
    testimonialsSubtitle: "Real Impact, Real Yields",
    testimonials: [
      {
        name: "Rajesh Kumar",
        location: "Punjab, India",
        text: "AgroDoc saved my wheat crop from a rust infestation. The diagnosis was instant and the treatment worked perfectly!",
        impact: "Yield increased by 15%"
      },
      {
        name: "Sarah Jenkins",
        location: "California, USA",
        text: "The precision of the leaf scan is incredible. It detected a nutrient deficiency that three local experts missed.",
        impact: "Saved $2000 in fertilizer"
      },
      {
        name: "Amit Sharma",
        location: "Madhya Pradesh",
        text: "Talking to the Agrix Expert in Hindi made all the difference. It felt like having a scientist right in my field.",
        impact: "Recovered 80% of damaged crop"
      }
    ]
  },
  hi: {
    title: "एग्रो",
    subtitle: "डॉक",
    heroTitle: "फसलों का उपचार करें",
    heroGradient: "असली समय में",
    heroDesc: "विशेषज्ञ सटीकता के साथ कीटों, रोगों और पोषक तत्वों की कमी का पता लगाने के लिए किसी भी पौधे की पत्ती को स्कैन करें।",
    smartScan: "स्मार्ट स्कैन",
    useCamera: "कैमरा चलाएं",
    uploadPhoto: "फोटो अपलोड करें",
    fromFiles: "फाइलों से",
    aiAnalyzing: "एआई विश्लेषण कर रहा है...",
    scanningBio: "जीव विज्ञान स्कैनिंग",
    refDb: "वैश्विक रोग डेटाबेस के साथ मिलान...",
    talkExpert: "एग्रिक्स विशेषज्ञ से बात करें",
    expertDesc: "अपनी भाषा में मौखिक मार्गदर्शन प्राप्त करें",
    obs: "अवलोकन (Observations)",
    protocol: "एआई उपचार (Protocol)",
    products: "देखभाल के उत्पाद",
    prevention: "निवारक रणनीतियां",
    newDiag: "नई जांच शुरू करें",
    systemFault: "सिस्टम त्रुटि",
    reboot: "सिस्टम रीबूट करें",
    back: "पीछे जाएं",
    initializing: "लेंस शुरू हो रहा है...",
    focus: "पत्ती की सतह पर ध्यान दें",
    connecting: "विशेषज्ञ से जुड़ रहे हैं...",
    active: "विशेषज्ञ सुन रहे हैं",
    stop: "कॉल समाप्त करें",
    contactUs: "संपर्क करें",
    viewDetails: "उत्पाद विवरण देखें",
    partners: "विश्वसनीय फसल देखभाल भागीदार",
    testimonialsTitle: "हमारे किसानों के अनुभव",
    testimonialsSubtitle: "सच्चा प्रभाव, बेहतर उपज",
    testimonials: [
      {
        name: "राजेश कुमार",
        location: "पंजाब, भारत",
        text: "एग्रोडॉक ने मेरी गेहूं की फसल को रस्ट से बचाया। निदान तुरंत था और उपचार ने पूरी तरह से काम किया!",
        impact: "उपज में 15% की वृद्धि"
      },
      {
        name: "सारा जेनकिंस",
        location: "कैलिफ़ोर्निया, यूएसए",
        text: "पत्ती स्कैन की सटीकता अविश्वसनीय है। इसने पोषक तत्वों की कमी का पता लगाया जो स्थानीय विशेषज्ञ नहीं देख पाए।",
        impact: "उर्वरक में $2000 की बचत"
      },
      {
        name: "अमित शर्मा",
        location: "मध्य प्रदेश",
        text: "हिंदी में एग्रिक्स एक्सपर्ट से बात करने से बहुत फर्क पड़ा। ऐसा लगा जैसे खेत में ही कोई वैज्ञानिक हो।",
        impact: "80% खराब फसल बचाई"
      }
    ]
  }
};

export const SYSTEM_INSTRUCTION = `
You are an expert plant pathologist and agricultural consultant. 
Identify any diseases, pests, or nutrient deficiencies from the provided plant image.
If the plant is healthy, clearly state that.
Return response in structured JSON format.
Always find REAL, CURRENT agricultural products from major brands (Bayer, Syngenta, Corteva, BASF, FMC, UPL, Coromandel, IFFCO).
For each product, provide a highly descriptive 'productImageUrl' and 'brandLogoUrl' if possible.
`;

export const LIVE_SYSTEM_INSTRUCTION = `
You are "Agrix Expert", a friendly and highly knowledgeable agricultural specialist. 
You help farmers diagnose plant issues and provide practical advice on crop health.
You speak clearly and concisely.
IMPORTANT: You must respond in the user's preferred language (either English or Hindi).
If the user is showing or talking about a specific plant health result, guide them through the treatment steps and recommend the products mentioned.
Keep your answers helpful and empathetic to the challenges of farming.
`;

export const Icons = {
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Leaf: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 2 8a7 7 0 0 1-7 7c-1.1 0-2.1-.2-3-.6M11 20l1-5M11 20l-4-4"/></svg>
  ),
  Voice: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
  ),
  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  )
};
