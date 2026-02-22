interface KPIItem {
  label: string
  value: string | number
  unit?: string
}

interface KPISectionProps {
  items: KPIItem[]
}

export function KPISection({ items }: KPISectionProps) {
  return (
    <div className="no-break grid grid-cols-3 gap-4 my-6">
      {items.map((item) => (
        <div key={item.label} className="border rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {item.value}
            {item.unit && <span className="text-lg ml-1">{item.unit}</span>}
          </div>
          <div className="text-sm text-gray-600 mt-2">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
