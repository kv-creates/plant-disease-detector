import { useState } from 'react'
import UploadZone from './components/UploadZone'
import ResultDisplay from './components/ResultDisplay'
import Header from './components/Header'
import Footer from './components/Footer'
import { detectDisease } from './utils/api'

function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState('openai')
  const [includeTreatment, setIncludeTreatment] = useState(true)
  const [includePrevention, setIncludePrevention] = useState(true)

  const handleImageSelect = (file) => {
    setImage(file)
    setResult(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!image) return

    setLoading(true)
    setError(null)

    try {
      const response = await detectDisease(image, {
        provider,
        include_treatment: includeTreatment,
        include_prevention: includePrevention,
      })
      setResult(response)
    } catch (err) {
      setError(err.message || 'Failed to analyze image')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Plant Disease Detector
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Upload a photo of a plant leaf to instantly identify diseases using AI vision models.
              Get detailed diagnosis, treatment options, and prevention tips in real time.
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            {result ? (
              <ResultDisplay
                result={result}
                onRetry={handleRetry}
                onNewAnalysis={handleRemoveImage}
              />
            ) : (
              <UploadZone
                image={image}
                preview={preview}
                loading={loading}
                error={error}
                onImageSelect={handleImageSelect}
                onRemoveImage={handleRemoveImage}
                onAnalyze={handleAnalyze}
                provider={provider}
                setProvider={setProvider}
                includeTreatment={includeTreatment}
                setIncludeTreatment={setIncludeTreatment}
                includePrevention={includePrevention}
                setIncludePrevention={setIncludePrevention}
              />
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🔍"
              title="Instant Analysis"
              description="Get real-time disease detection using state-of-the-art vision models"
            />
            <FeatureCard
              icon="📋"
              title="Detailed Reports"
              description="Comprehensive diagnosis with severity, symptoms, treatment, and prevention"
            />
            <FeatureCard
              icon="🤖"
              title="Multiple AI Providers"
              description="Choose between OpenAI GPT-4V and Anthropic Claude for analysis"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card p-6 text-center hover:shadow-md transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default App