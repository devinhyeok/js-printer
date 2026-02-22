export default function Cover() {
  return (
    <div
      className="slide flex flex-col items-center justify-center text-center px-24"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      }}
    >
      <h1 className="text-7xl font-black tracking-tight leading-tight text-white mb-6">
        JS Printer
      </h1>

      <p className="text-2xl mb-12" style={{ color: 'rgba(255,255,255,0.85)' }}>
        MDX 기반 문서 · 프레젠테이션 PDF 제작 도구
      </p>

      <div
        className="w-16 h-px mb-8"
        style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
      />

      <p className="text-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
        2026 · js-printer
      </p>
    </div>
  )
}
