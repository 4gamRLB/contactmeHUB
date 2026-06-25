import React, { useState } from 'react';
import { Laptop, Cpu, CheckCircle } from 'lucide-react';

interface AutoDetectDeviceProps {
  onDetect: (detectedText: string, deviceBrowser: string) => void;
}

export default function AutoDetectDevice({ onDetect }: AutoDetectDeviceProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detected, setDetected] = useState(false);

  const detectDevice = () => {
    setIsDetecting(true);
    setDetected(false);

    setTimeout(() => {
      const userAgent = navigator.userAgent;
      const width = window.screen.width;
      const height = window.screen.height;
      const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Simple parsing logic for beginners
      let os = 'Unknown Operating System';
      if (userAgent.indexOf('Win') !== -1) os = 'Windows PC';
      if (userAgent.indexOf('Mac') !== -1) os = 'Apple Mac';
      if (userAgent.indexOf('X11') !== -1) os = 'Linux System';
      if (userAgent.indexOf('Linux') !== -1) os = 'Linux / Android Device';
      if (userAgent.indexOf('Android') !== -1) os = 'Android Phone / Tablet';
      if (userAgent.indexOf('like Mac') !== -1 || userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
        os = userAgent.indexOf('iPad') !== -1 ? 'Apple iPad' : 'Apple iPhone';
      }

      let browser = 'Unknown Web Browser';
      if (userAgent.indexOf('Chrome') !== -1) browser = 'Google Chrome';
      if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) browser = 'Apple Safari';
      if (userAgent.indexOf('Firefox') !== -1) browser = 'Mozilla Firefox';
      if (userAgent.indexOf('MSIE') !== -1 || !!(document as any).documentMode === true) browser = 'Internet Explorer';
      if (userAgent.indexOf('Edge') !== -1) browser = 'Microsoft Edge';

      const screenType = touchSupported ? (width < 768 ? 'Mobile Screen' : 'Tablet Screen') : 'Desktop Monitor';
      const connectionStatus = navigator.onLine ? 'Fully Online' : 'Offline / Intermittent Connection';

      // 1. Beginner-friendly descriptive text
      const descriptiveSummary = `I am using an ${os} with the ${browser} web browser. My screen size is ${width}x${height} pixels (${screenType}), and my connection is ${connectionStatus}.`;

      // 2. Map to original select option if possible
      let selectOptionValue = 'Other / Not sure';
      if (!touchSupported) {
        if (browser === 'Google Chrome') selectOptionValue = 'Desktop — Chrome';
        else if (browser === 'Mozilla Firefox') selectOptionValue = 'Desktop — Firefox';
        else if (browser === 'Apple Safari') selectOptionValue = 'Desktop — Safari';
        else if (browser === 'Microsoft Edge') selectOptionValue = 'Desktop — Edge';
      } else {
        if (os.includes('Android')) selectOptionValue = 'Mobile — Chrome (Android)';
        else if (os.includes('iPhone') || os.includes('iPad')) selectOptionValue = 'Mobile — Safari (iPhone/iPad)';
        else if (width >= 768) selectOptionValue = 'Tablet';
        else selectOptionValue = 'Mobile — Other';
      }

      onDetect(descriptiveSummary, selectOptionValue);
      setIsDetecting(false);
      setDetected(true);
      setTimeout(() => setDetected(false), 3000);
    }, 800);
  };

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={detectDevice}
        disabled={isDetecting}
        className="text-xs text-sage hover:text-sage-dark font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-sage/5 hover:bg-sage/10 px-3 py-1.5 rounded-lg border border-sage/20"
      >
        <Laptop className="w-3.5 h-3.5 animate-pulse" />
        {isDetecting ? 'Reading your device settings...' : '✨ Auto-Fill My Device Details'}
      </button>

      {detected && (
        <p className="mt-2 text-xs text-success flex items-center gap-1 font-semibold animate-fade-in">
          <CheckCircle className="w-3 h-3" /> Successfully filled in! No technical typing needed.
        </p>
      )}
    </div>
  );
}
