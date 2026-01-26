import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export function generateTicketCode(): string {
  // Generate a unique ticket code
  const timestamp = Date.now().toString(36)
  const random = uuidv4().replace(/-/g, '').substring(0, 8)
  return `VLC-${timestamp}-${random}`.toUpperCase()
}

export function createTicketQRData(ticketId: string, ticketCode: string): string {
  // Create the data that will be encoded in the QR
  return JSON.stringify({
    id: ticketId,
    code: ticketCode,
    v: 1, // Version for future compatibility
  })
}

export function parseTicketQRData(qrData: string): { id: string; code: string; v: number } | null {
  try {
    const data = JSON.parse(qrData)
    if (data.id && data.code) {
      return data
    }
    return null
  } catch {
    return null
  }
}
