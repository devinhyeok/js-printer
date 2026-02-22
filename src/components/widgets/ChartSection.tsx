import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  name: string
  value: number
}

interface ChartSectionProps {
  title?: string
  data: ChartData[]
}

export function ChartSection({ title, data }: ChartSectionProps) {
  return (
    <div className="no-break my-6">
      {title && (
        <p className="text-sm font-bold mb-2 text-gray-700 text-center">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
