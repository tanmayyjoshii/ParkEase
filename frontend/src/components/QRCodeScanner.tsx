import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startScanner = () => {
    if (!containerRef.current) return;

    try {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // QR code detected
          stopScanner();
          onScan(decodedText);
        },
        (errorMessage) => {
          // Error handling is done by the library
          console.log(errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      setError('Failed to start camera scanner. Please check camera permissions.');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full max-w-lg max-h-lg bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Scan QR Code</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scanner Container */}
        <div className="pt-16 h-full">
          <div 
            ref={containerRef}
            id="qr-reader"
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm p-4 border-t">
          <p className="text-sm text-gray-600 text-center">
            Position the QR code within the scanning area
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute top-20 left-4 right-4 z-20 p-4 bg-red-500 text-white rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {!isScanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Starting camera...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QRCodeScanner; 