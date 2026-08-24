import { useState, useCallback, useRef } from 'react'

export default function UploadZone({
  image,
  preview,
  loading,
  error,
  onImageSelect,
  onRemoveImage,
  onAnalyze,
  provider,
  setProvider,
  includeTreatment,
  setIncludeTreatment,
  includePrevention,
  setIncludePrevention,
}) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onImageSelect(file)
      }
    }
  }, [onImageSelect])

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onImageSelect(file)
      }
    }
  }

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)')
      return false
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return false
    }

    return true
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (image && preview) {
    return (
      <div className="space-y-6">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          <img
            src={preview}
            alt="Selected leaf image"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onRemoveImage}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-lg transition-all duration-200"
            aria-label="Remove image"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="provider"
                value="openai"
                checked={provider === 'openai'}
                onChange={(e) => setProvider(e.target.value)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">OpenAI GPT-4V</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="provider"
                value="anthropic"
                checked={provider === 'anthropic'}
                onChange={(e) => setProvider(e.target.value)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Anthropic Claude</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTreatment}
                onChange={(e) => setIncludeTreatment(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Include Treatment</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includePrevention}
                onChange={(e) => setIncludePrevention(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Include Prevention</span>
            </label>
          </div>

          <button
            onClick={onAnalyze}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Image'
            )}
          </button>

          {error && (
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div
      className={`drop-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900">Upload Leaf Image</h3>
          <p className="text-gray-600 mt-1">Drag and drop or click to select a photo of a plant leaf</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Supported formats:</span>
          <span className="px-2 py-1 bg-gray-100 rounded">JPEG</span>
          <span className="px-2 py-1 bg-gray-100 rounded">PNG</span>
          <span className="px-2 py-1 bg-gray-100 rounded">WebP</span>
          <span className="text-gray-400">(Max 10MB)</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="provider"
              value="openai"
              checked={provider === 'openai'}
              onChange={(e) => setProvider(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">OpenAI GPT-4V</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="provider"
              value="anthropic"
              checked={provider === 'anthropic'}
              onChange={(e) => setProvider(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Anthropic Claude</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTreatment}
              onChange={(e) => setIncludeTreatment(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Include Treatment</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includePrevention}
              onChange={(e) => setIncludePrevention(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Include Prevention</span>
          </label>
        </div>
      </div>
    </div>
  )
}