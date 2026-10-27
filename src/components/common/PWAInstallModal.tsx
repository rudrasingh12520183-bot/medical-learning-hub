import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Sparkles,
  Apple,
  FileDown,
  MessageCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [downloadedLauncher, setDownloadedLauncher] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'android' | 'ios' | 'qrcode'>('download');

  if (!isOpen) return null;

  // Use the canonical public app preview URL or window.location.href
  const appUrl = typeof window !== 'undefined'
    ? window.location.origin === 'http://localhost:3000' || window.location.origin.includes('ais-dev-')
      ? 'https://ais-pre-4dd2ua7spw3bb4cqxqcox7-258247988582.asia-southeast1.run.app'
      : window.location.href
    : 'https://ais-pre-4dd2ua7spw3bb4cqxqcox7-258247988582.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Medical Learning Hub',
          text: 'Open and install Medical Learning Hub on your phone!',
          url: appUrl,
        });
      } catch (err) {
        // User cancelled or aborted
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadLauncher = () => {
    const launcherHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Medical Learning Hub</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0284c7">
  <link rel="icon" type="image/svg+xml" href="${appUrl}/icon.svg">
  <meta http-equiv="refresh" content="0; url=${appUrl}">
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0284c7, #1e1b4b);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 32px 24px;
      max-width: 400px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: #ffffff;
      color: #0284c7;
      text-decoration: none;
      font-weight: bold;
      border-radius: 12px;
    }
  </style>
  <script>
    window.location.replace("${appUrl}");
  </script>
</head>
<body>
  <div class="card">
    <div style="font-size: 40px; margin-bottom: 12px;">🩺</div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px;">Medical Learning Hub</h2>
    <p style="font-size: 13px; opacity: 0.9; margin: 0;">Launching your clinical education app...</p>
    <a href="${appUrl}" class="btn">Open App Directly</a>
  </div>
</body>
</html>`;
    const blob = new Blob([launcherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Medical-Learning-Hub-App-Launcher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedLauncher(true);
    setTimeout(() => setDownloadedLauncher(false), 3000);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    '🩺 Study Medicine, Gynecology & Obstetrics on Medical Learning Hub!\nInstall the app on your phone here: ' + appUrl
  )}`;

  // QR code for easy instant mobile camera scanning
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(appUrl)}&color=0284c7`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 ring-2 ring-white/20 shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/icon.svg"
                alt="App Icon"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold tracking-tight">
                  Medical Learning Hub
                </h3>
                <span className="text-[10px] font-bold uppercase bg-white/20 px-1.5 py-0.2 rounded">
                  Phone App
                </span>
              </div>
              <p className="text-xs text-sky-100">
                Install as a phone app with home screen icon
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 text-xs">
          {/* Quick Install Action Banner */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Instant 1-Click Install Ready!
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Your browser supports adding Medical Learning Hub straight to your home screen now.
                </p>
              </div>

              <button
                onClick={handleNativeInstall}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Install Now</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
              <span>
                <strong>App is installed!</strong> You can launch Medical Learning Hub directly from your home screen or apps drawer anytime.
              </span>
            </div>
          )}

          {/* Shareable App Link */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Direct Phone App URL:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send to WhatsApp</span>
              </a>

              <button
                onClick={handleShare}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share App Link</span>
              </button>
            </div>
          </div>

          {/* Platform Guide Tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => setActiveTab('download')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1 ${
                  activeTab === 'download'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Downloads</span>
              </button>

              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1 ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1 ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone</span>
              </button>

              <button
                onClick={() => setActiveTab('qrcode')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1 ${
                  activeTab === 'qrcode'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Code</span>
              </button>
            </div>

            {/* TAB 0: Download Links */}
            {activeTab === 'download' && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 bg-white dark:bg-slate-900">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Download className="w-4 h-4 text-sky-600" />
                  App Download & Quick Install Options
                </h4>

                <div className="space-y-2.5">
                  {/* Download launcher option */}
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sky-900 dark:text-sky-200 text-xs">
                        Download Mobile App Launcher (.html)
                      </div>
                      <div className="text-[11px] text-sky-700 dark:text-sky-400">
                        Saves an instant phone launcher file with icon configured.
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadLauncher}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        downloadedLauncher
                          ? 'bg-emerald-600 text-white'
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                      }`}
                    >
                      {downloadedLauncher ? <Check className="w-3.5 h-3.5" /> : <FileDown className="w-3.5 h-3.5" />}
                      <span>{downloadedLauncher ? 'Downloaded!' : 'Download'}</span>
                    </button>
                  </div>

                  {/* Android Web APK explanation */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      Why Progressive Web App (PWA) is Better than APK:
                    </div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                      <li><strong>Instant Install:</strong> Installs immediately without waiting for a 150MB APK download.</li>
                      <li><strong>Full Screen App:</strong> Runs with its own dedicated window and MedHub icon—no browser URL bar.</li>
                      <li><strong>Zero Permissions Warning:</strong> 100% safe, verified by Google Chrome & Apple Safari standards.</li>
                      <li><strong>Always Updated:</strong> Any updates entered by your administrator reflect immediately.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: Android Guide */}
            {activeTab === 'android' && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    How to get the App icon on Android Phone:
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <ol className="space-y-2.5 text-slate-600 dark:text-slate-300 pl-4 list-decimal text-xs leading-relaxed">
                  <li>
                    Open the app link in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.
                  </li>
                  <li>
                    Tap the <strong>three dots menu (⋮)</strong> in the top-right corner of Chrome.
                  </li>
                  <li>
                    Select <strong>&quot;Install app&quot;</strong> (or <strong>&quot;Add to Home screen&quot;</strong>).
                  </li>
                  <li>
                    Tap <strong>&quot;Install&quot;</strong> when prompted.
                  </li>
                  <li className="font-semibold text-sky-700 dark:text-sky-300">
                    Done! The <strong>Medical Learning Hub</strong> icon appears right on your phone home screen alongside WhatsApp and YouTube, opening in full-screen with offline support!
                  </li>
                </ol>
              </div>
            )}

            {/* TAB 2: iOS Guide */}
            {activeTab === 'ios' && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Apple className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  How to get the App icon on iPhone or iPad:
                </h4>
                <ol className="space-y-2.5 text-slate-600 dark:text-slate-300 pl-4 list-decimal text-xs leading-relaxed">
                  <li>
                    Open this app link in <strong>Safari</strong> on your iPhone or iPad.
                  </li>
                  <li>
                    Tap the <strong>Share button</strong> (the square with an arrow pointing upward at the bottom bar of Safari).
                  </li>
                  <li>
                    Scroll down the share menu and tap <strong>&quot;Add to Home Screen&quot;</strong> (with the ➕ icon).
                  </li>
                  <li>
                    Tap <strong>&quot;Add&quot;</strong> in the top-right corner.
                  </li>
                  <li className="font-semibold text-sky-700 dark:text-sky-300">
                    Done! The <strong>MedHub</strong> icon appears directly on your iPhone home screen!
                  </li>
                </ol>
              </div>
            )}

            {/* TAB 3: QR Code */}
            {activeTab === 'qrcode' && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Scan this QR code with your phone camera to open the app on your phone immediately:
                </p>
                <div className="inline-block p-3 bg-white rounded-2xl border border-slate-200 shadow-sm mx-auto">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code for phone app"
                    className="w-44 h-44 mx-auto object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-500 font-mono break-all">
                  {appUrl}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDownloadLauncher}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Launcher</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

