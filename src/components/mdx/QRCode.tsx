import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  caption?: string
}

export function QRCode({ value, size = 128, caption }: QRCodeProps) {
  return (
    <div className="inline-flex flex-col items-center gap-2 my-4">
      <QRCodeSVG value={value} size={size} />
      {caption && <p className="text-xs text-gray-500 text-center">{caption}</p>}
    </div>
  )
}
