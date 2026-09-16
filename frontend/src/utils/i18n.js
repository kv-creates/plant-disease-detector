// Minimal en/hi/mr strings. Persisted choice in localStorage.

const STRINGS = {
  en: {
    tagline: 'Snap a leaf, save your crop',
    subtitle: 'Upload a leaf photo for instant diagnosis with treatment and prevention.',
    analyze: 'Analyze image',
    analyzing: 'Analyzing…',
    demo: 'Try demo',
    history: 'Recent',
    library: 'Library',
    how: 'How it works',
    faq: 'FAQ',
  },
  hi: {
    tagline: 'पत्ते की फोटो, फसल की सुरक्षा',
    subtitle: 'रोग पहचान, उपचार और बचाव — तुरंत पाएं।',
    analyze: 'जांच करें',
    analyzing: 'जांच हो रही है…',
    demo: 'डेमो आज़माएं',
    history: 'हालिया',
    library: 'पुस्तकालय',
    how: 'कैसे काम करता है',
    faq: 'प्रश्न',
  },
  mr: {
    tagline: 'पानाचा फोटो, पिकाचे रक्षण',
    subtitle: 'रोग ओळख, उपचार आणि प्रतिबंध — लगेच मिळवा.',
    analyze: 'तपासा',
    analyzing: 'तपासत आहे…',
    demo: 'डेमो पहा',
    history: 'अलीकडील',
    library: 'ग्रंथालय',
    how: 'कसे काम करते',
    faq: 'प्रश्न',
  },
}

const KEY = 'pdd:locale:v1'

export function getLocale() {
  try {
    return localStorage.getItem(KEY) || 'en'
  } catch {
    return 'en'
  }
}

export function setLocale(locale) {
  try {
    localStorage.setItem(KEY, locale)
  } catch {
    /* ignore */
  }
}

export function t(locale, key) {
  const lang = STRINGS[locale] || STRINGS.en
  return lang[key] || STRINGS.en[key] || key
}

export const LOCALES = [
  { id: 'en', label: 'EN' },
  { id: 'hi', label: 'हिं' },
  { id: 'mr', label: 'मराठी' },
]
