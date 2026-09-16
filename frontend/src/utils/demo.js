// Offline demo results — used when backend is unreachable or demo mode is on.
// Deterministic per file so the same image gives the same demo story.

export function hashBytes(bytes) {
  let h = 2166136261
  for (let i = 0; i < bytes.length; i += 1) {
    h ^= bytes[i]
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export async function fileFingerprint(file) {
  const buf = new Uint8Array(await file.slice(0, 65536).arrayBuffer())
  return hashBytes(buf) % 3
}

const DEMO_RESULTS = [
  {
    disease: {
      name: 'Early Blight (Demo)',
      scientific_name: 'Alternaria solani',
      description:
        'Demo diagnosis: concentric brown rings and yellowing typical of early blight. Connect the backend with an API key for a live vision analysis.',
      severity: 'moderate',
      confidence: 0.78,
      affected_area: 'Lower leaves, progressing upward',
      symptoms: ['Dark brown spots with concentric rings', 'Yellowing halo around lesions', 'Lower-leaf drop'],
      treatment:
        'Demo guidance only — remove affected leaves, improve airflow, avoid overhead watering, and consult your extension officer before spraying.',
      prevention: 'Rotate crops, mulch to prevent soil splash, space plants, sanitize tools.',
    },
  },
  {
    disease: {
      name: 'Powdery Mildew (Demo)',
      scientific_name: 'Podosphaera xanthii',
      description:
        'Demo diagnosis: white powdery patches typical of powdery mildew. Connect the backend with an API key for a live vision analysis.',
      severity: 'mild',
      confidence: 0.71,
      affected_area: 'Upper leaf surfaces and young shoots',
      symptoms: ['White powdery patches', 'Leaf curl at margins', 'Stunted young growth'],
      treatment: 'Demo guidance only — prune lightly, improve sun and airflow, monitor weekly.',
      prevention: 'Resistant varieties, base watering, avoid excess nitrogen.',
    },
  },
  {
    disease: {
      name: 'Healthy Leaf (Demo)',
      scientific_name: null,
      description: 'Demo diagnosis: no clear disease signatures. Leaf looks healthy in this offline sample.',
      severity: 'mild',
      confidence: 0.66,
      affected_area: 'No significant affected area observed',
      symptoms: ['Uniform green color', 'No spots or wilting observed'],
      treatment: 'No treatment needed. Continue weekly monitoring.',
      prevention: 'Scout weekly, water at base, maintain spacing.',
    },
  },
]

export async function demoDetect(file, options = {}) {
  const idx = file ? await fileFingerprint(file).catch(() => 0) : 0
  const base = DEMO_RESULTS[idx % DEMO_RESULTS.length]
  // Simulate staged progress.
  await new Promise((r) => setTimeout(r, 900))
  return {
    success: true,
    demo: true,
    provider: options.provider || 'demo',
    detection_id: `demo_${Date.now().toString(36)}`,
    processing_time_ms: 900 + idx * 120,
    disease: {
      ...base.disease,
      treatment: options.include_treatment === false ? null : base.disease.treatment,
      prevention: options.include_prevention === false ? null : base.disease.prevention,
    },
  }
}

export const DEMO_SAMPLE_LABELS = ['Blight sample', 'Mildew sample', 'Healthy sample']
