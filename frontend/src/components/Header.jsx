export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Plant Disease Detector</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">How It Works</a>
            <a href="https://github.com/kv-creates/plant-disease-detector" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">GitHub</a>
          </nav>
        </div>
      </div>
    </header>
  )
}