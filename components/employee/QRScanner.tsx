'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Stop scanning after successful scan
          scanner.stop().then(() => {
            setIsScanning(false)
            onScan(decodedText)
          })
        },
        () => {
          // Ignore scan errors (no QR found)
        }
      )

      setIsScanning(true)
      setHasPermission(true)
    } catch (error: any) {
      console.error('Error starting scanner:', error)
      setHasPermission(false)
      if (onError) {
        onError(error.message || 'Failed to start camera')
      }
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop()
      setIsScanning(false)
    }
  }

  return (
    <div className="qr-scanner">
      <div id="qr-reader" className="scanner-viewport" />

      {!isScanning && (
        <div className="scanner-overlay">
          {hasPermission === false ? (
            <div className="permission-error">
              <p>Camera access denied</p>
              <p className="small">Please allow camera access to scan tickets</p>
            </div>
          ) : (
            <button onClick={startScanning} className="start-btn">
              Start Scanning
            </button>
          )}
        </div>
      )}

      {isScanning && (
        <button onClick={stopScanning} className="stop-btn">
          Stop Scanning
        </button>
      )}

      <style jsx>{`
        .qr-scanner {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        .scanner-viewport {
          width: 100%;
          min-height: 300px;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
        }
        .scanner-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 12px;
        }
        .permission-error {
          text-align: center;
          color: #ef4444;
        }
        .permission-error .small {
          font-size: 0.875rem;
          color: #888;
          margin-top: 8px;
        }
        .start-btn {
          padding: 16px 32px;
          background: linear-gradient(135deg, #ff1083 0%, #9b30ff 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 16, 131, 0.4);
        }
        .stop-btn {
          margin-top: 16px;
          padding: 12px 24px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .stop-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }
      `}</style>
    </div>
  )
}
