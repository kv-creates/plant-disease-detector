export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Plant Disease Detector</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              An AI-powered tool for detecting plant diseases from leaf images.
              Built with React, FastAPI, and state-of-the-art vision models.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/kv-creates/plant-disease-detector" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">GitHub Repository</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Supported Models</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>OpenAI GPT-4 Vision</li>
              <li>Anthropic Claude 3 Opus</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Plant Disease Detector. Open source under MIT license.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/kv-creates" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">
              kv-creates
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}