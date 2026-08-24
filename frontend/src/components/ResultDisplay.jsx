export default function ResultDisplay({ result, onRetry, onNewAnalysis }) {
  const { disease, processing_time_ms, success, error } = result

  if (!success || !disease) {
    return (
      <div className="result-card text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h3>
        <p className="text-gray-600 mb-6">{error || 'An unknown error occurred'}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onRetry} className="btn-primary">Try Again</button>
          <button onClick={onNewAnalysis} className="btn-outline">New Analysis</button>
        </div>
      </div>
    )
  }

  const severityClasses = {
    mild: 'severity-mild',
    moderate: 'severity-moderate',
    severe: 'severity-severe',
  }

  const confidencePercent = Math.round(disease.confidence * 100)

  return (
    <div className="result-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{disease.name}</h2>
          {disease.scientific_name && (
            <p className="text-gray-600 italic mt-1">{disease.scientific_name}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`${severityClasses[disease.severity]} capitalize`}>
            {disease.severity}
          </span>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <span>Confidence:</span>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="font-medium text-primary-600">{confidencePercent}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          title="Description"
          icon={<DescriptionIcon />}
        >
          <p className="text-gray-700 leading-relaxed">{disease.description}</p>
        </InfoCard>

        <InfoCard
          title="Affected Area"
          icon={<AreaIcon />}
        >
          <p className="text-gray-700">{disease.affected_area}</p>
        </InfoCard>

        <InfoCard
          title="Visible Symptoms"
          icon={<SymptomsIcon />}
        >
          <ul className="space-y-2">
            {disease.symptoms.map((symptom, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {symptom}
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard
          title="Confidence & Processing Time"
          icon={<ConfidenceIcon />}
        >
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Confidence Level</span>
                <span className="font-semibold text-gray-900">{confidencePercent}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Time</span>
              <span className="font-semibold text-gray-900">{processing_time_ms.toFixed(0)}ms</span>
            </div>
          </div>
        </InfoCard>
      </div>

      {disease.treatment && (
        <InfoCard
          title="Recommended Treatment"
          icon={<TreatmentIcon />}
          className="md:col-span-2"
        >
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{disease.treatment}</p>
        </InfoCard>
      )}

      {disease.prevention && (
        <InfoCard
          title="Prevention Measures"
          icon={<PreventionIcon />}
          className="md:col-span-2"
        >
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{disease.prevention}</p>
        </InfoCard>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-gray-100">
        <button onClick={onRetry} className="btn-outline">Re-analyze</button>
        <button onClick={onNewAnalysis} className="btn-primary">New Analysis</button>
      </div>
    </div>
  )
}

function InfoCard({ title, icon, children, className = '' }) {
  return (
    <div className={`${className} bg-gray-50 rounded-xl p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  )
}

function DescriptionIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  )
}

function SymptomsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function ConfidenceIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function TreatmentIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PreventionIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}