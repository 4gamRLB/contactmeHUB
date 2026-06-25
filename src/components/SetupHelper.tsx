import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle, CheckCircle, HelpCircle, ArrowRight, Play, ExternalLink } from 'lucide-react';

const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    // 1. Open the active spreadsheet and grab the first sheet tab
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheets()[0];
    
    // 2. Read the information sent from your Contact Hub
    var parameter = e.parameter;
    
    // 3. Make sure headers are ready in the spreadsheet
    var headers = [];
    if (sheet.getLastColumn() > 0) {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    
    var standardHeaders = ["submittedAt", "formType", "name", "email"];
    standardHeaders.forEach(function(h) {
      if (headers.indexOf(h) === -1) {
        headers.push(h);
      }
    });
    
    // Append any extra form question fields to our sheet headers
    for (var key in parameter) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
      }
    }
    
    // If sheet is completely brand new, write the headers first
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#FFF1F2");
    } else {
      // Update header row to include any newly discovered fields
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // 4. Fill in the columns with our form values
    var rowData = headers.map(function(headerName) {
      return parameter[headerName] || "";
    });
    
    sheet.appendRow(rowData);
    
    // 5. Send an email notification to Rachel (ogrlbdesigns@gmail.com)
    var creatorEmail = "ogrlbdesigns@gmail.com";
    var emailSubject = "🌸 New Contact Hub Message: " + (parameter.formType || "Inquiry");
    
    var emailBody = "Hello Rachel!\\n\\n" +
                    "A reader has submitted a message on your Contact & Help Hub.\\n\\n" +
                    "--- SUBMISSION DETAILS ---\\n";
                    
    for (var key in parameter) {
      var label = key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
      emailBody += label + ": " + parameter[key] + "\\n";
    }
    
    emailBody += "--------------------------\\n\\n" +
                 "This information has also been saved inside your Google Spreadsheet.\\n" +
                 "Have a beautiful day!";
                 
    MailApp.sendEmail({
      to: creatorEmail,
      subject: emailSubject,
      body: emailBody
    });
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;

interface SetupHelperProps {
  scriptUrl: string;
  onSaveScriptUrl: (url: string) => void;
  bookTitle: string;
  bookAmazonUrl: string;
  bookDescription: string;
  onSaveBookDetails: (title: string, amazonUrl: string, description: string) => void;
  freebieUrl: string;
  onSaveFreebieUrl: (url: string) => void;
}

export default function SetupHelper({ 
  scriptUrl, 
  onSaveScriptUrl,
  bookTitle,
  bookAmazonUrl,
  bookDescription,
  onSaveBookDetails,
  freebieUrl,
  onSaveFreebieUrl
}: SetupHelperProps) {
  const [urlInput, setUrlInput] = useState(scriptUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state for customizations
  const [bTitle, setBTitle] = useState(bookTitle);
  const [bAmazonUrl, setBAmazonUrl] = useState(bookAmazonUrl);
  const [bDescription, setBDescription] = useState(bookDescription);
  const [fUrl, setFUrl] = useState(freebieUrl);
  const [customSavedSuccess, setCustomSavedSuccess] = useState(false);

  useEffect(() => {
    setUrlInput(scriptUrl);
  }, [scriptUrl]);

  useEffect(() => {
    setBTitle(bookTitle);
  }, [bookTitle]);

  useEffect(() => {
    setBAmazonUrl(bookAmazonUrl);
  }, [bookAmazonUrl]);

  useEffect(() => {
    setBDescription(bookDescription);
  }, [bookDescription]);

  useEffect(() => {
    setFUrl(freebieUrl);
  }, [freebieUrl]);

  // Helper to extract ASIN (10-character Amazon Identifier) from a URL or text input
  const extractAsin = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^[A-Z0-9]{10}$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
    const dpMatch = trimmed.match(/\/dp\/([A-Z0-9]{10})/i);
    if (dpMatch && dpMatch[1]) {
      return dpMatch[1].toUpperCase();
    }
    const gpMatch = trimmed.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (gpMatch && gpMatch[1]) {
      return gpMatch[1].toUpperCase();
    }
    const asinMatch = trimmed.match(/asin=([A-Z0-9]{10})/i);
    if (asinMatch && asinMatch[1]) {
      return asinMatch[1].toUpperCase();
    }
    return null;
  };

  const handleSave = () => {
    onSaveScriptUrl(urlInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const runTestSubmission = async () => {
    if (!scriptUrl) {
      setTestStatus('error');
      setTestLogs(['Error: You must save an Apps Script URL first!']);
      return;
    }

    setTestStatus('testing');
    setTestLogs(['Preparing sample contact form submission...', 'Form Type: App Issue', 'Name: "Rachel (Test User)"', 'Email: "ogrlbdesigns@gmail.com"']);

    try {
      // Build test payload
      const payload: Record<string, string> = {
        formType: 'App Issue (Diagnostic Test)',
        submittedAt: new Date().toISOString(),
        name: 'Rachel (Diagnostic Test)',
        email: 'ogrlbdesigns@gmail.com',
        app_name: 'Contact Hub Diagnostician',
        device_browser: 'Diagnostic Helper',
        what_happened: 'Running a self-test of the Contact Hub to verify Google Sheets Integration.',
        error_code: 'None - Diagnostic Success!',
        frequency: 'Just once'
      };

      setTestLogs(prev => [...prev, 'Sending secure request to your Google Apps Script URL...']);

      // Because Google Apps Script doesn't return CORS headers by default for all requests unless configured, 
      // we use 'no-cors' so that the browser successfully completes the request without throwing an error!
      // This matches the behaviour of the original form iframe posting.
      const formBody = new URLSearchParams();
      Object.entries(payload).forEach(([key, val]) => {
        formBody.append(key, val);
      });

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString()
      });

      setTestLogs(prev => [
        ...prev,
        'Request successfully broadcasted to Google Sheets!',
        '✅ Step 1 complete: Web browser sent the message.',
        '📬 Step 2 check: Open your Google Sheet to verify a new row has appeared.',
        '✉️ Step 3 check: Check your email (ogrlbdesigns@gmail.com) for the confirmation message!'
      ]);
      setTestStatus('success');
    } catch (error: any) {
      console.error(error);
      setTestLogs(prev => [
        ...prev,
        `❌ Error: Failed to communicate with Apps Script. Details: ${error?.message || 'Unknown network error'}`
      ]);
      setTestStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-md p-6 md:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b border-[#F4EFE6] pb-5">
        <div className="p-3 rounded-xl bg-gold-light text-gold shrink-0">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-[#2D241E]">Creator Setup &amp; Test Panel</h2>
          <p className="text-sm text-[#7B7068]">Set up your Google Forms system without writing a single line of code.</p>
        </div>
      </div>

      {/* Info Warning */}
      <div className="bg-sage-light border border-sage/30 rounded-xl p-5 mb-8 flex gap-4 items-start">
        <div className="bg-white text-sage-dark p-1.5 rounded-full shadow-sm shrink-0 mt-0.5">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-serif text-sage-dark font-bold text-base mb-1">How does this app stay 100% free?</h4>
          <p className="text-[#2D241E] text-sm leading-relaxed">
            Instead of paying for expensive form hosting plans (which can cost $20+ every month), your app connects directly to your personal <strong>Google Sheets</strong> and <strong>Gmail</strong>. This means your form is 100% free forever, can handle thousands of submissions, and saves your data privately in your Google Drive!
          </p>
        </div>
      </div>

      {/* Script URL Input */}
      <div className="bg-[#FDFBF7] border border-[#F4EFE6] rounded-xl p-5 md:p-6 mb-8">
        <h3 className="font-serif text-lg text-[#2D241E] font-bold mb-2 flex items-center gap-2">
          🌸 1. Save Your Apps Script URL
        </h3>
        <p className="text-xs text-[#7B7068] mb-4">
          Once you complete the Google Apps Script setup, paste your <strong>Web App URL</strong> below. 
          The app will save this in your browser so you don't have to change any code files!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
            placeholder="https://script.google.com/macros/s/.../exec"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-sage hover:bg-sage-dark text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-colors"
          >
            <Save className="w-4 h-4" /> Save Link
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-3 text-xs font-bold text-success flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Link successfully saved! The form is ready to use.
          </div>
        )}
      </div>

      {/* Diagnostic testing */}
      <div className="bg-[#FDFBF7] border border-[#F4EFE6] rounded-xl p-5 md:p-6 mb-8">
        <h3 className="font-serif text-lg text-[#2D241E] font-bold mb-2 flex items-center gap-2">
          🧪 2. Run a Live Connection Test
        </h3>
        <p className="text-xs text-[#7B7068] mb-4">
          Want to make sure everything works? Click this button to send a safe, simulated test submission. 
          If successful, a new line will instantly appear in your Google Sheet!
        </p>

        <button
          onClick={runTestSubmission}
          disabled={testStatus === 'testing'}
          className={`px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
            testStatus === 'testing'
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gold hover:bg-[#b8943c] text-[#2D241E]'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          {testStatus === 'testing' ? 'Testing Link...' : 'Test Connection'}
        </button>

        {/* Test Console Log */}
        {testStatus !== 'idle' && (
          <div className="mt-5 rounded-lg border border-[#F4EFE6] bg-neutral-900 text-[#E8F0EB] p-4 font-mono text-xs leading-relaxed max-h-[220px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
              <span className="text-neutral-400 font-sans font-bold">Diagnostic Terminal Logs</span>
              <span className={`h-2.5 w-2.5 rounded-full ${
                testStatus === 'testing' ? 'bg-amber-400 animate-ping' :
                testStatus === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
              }`} />
            </div>
            <div className="space-y-1.5">
              {testLogs.map((log, index) => (
                <div key={index} className={log.startsWith('✅') || log.startsWith('📬') || log.startsWith('✉️') ? 'text-emerald-400' : log.startsWith('❌') ? 'text-rose-400' : 'text-neutral-300'}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎨 3. Customize Promo Book & Freebie Links */}
      <div className="bg-[#FDFBF7] border border-[#F4EFE6] rounded-xl p-5 md:p-6 mb-8">
        <h3 className="font-serif text-lg text-[#2D241E] font-bold mb-2 flex items-center gap-2">
          🎨 3. Customize Promo Book & Freebie Links
        </h3>
        <p className="text-xs text-[#7B7068] mb-5">
          Keep your reader concierge fresh! Modify the prominent "Just Released" book details and update your active "Free Coloring Pages PDF" link.
        </p>

        <div className="space-y-5">
          {/* Section: Freebie url */}
          <div>
            <label className="block text-xs font-bold text-[#2D241E] uppercase tracking-wide mb-1.5">
              🎁 Monthly Freebie Link (Google Drive / Dropbox)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-xs bg-white text-[#2D241E]"
                placeholder="https://drive.google.com/drive/folders/..."
                value={fUrl}
                onChange={(e) => setFUrl(e.target.value)}
              />
              <button
                onClick={() => {
                  onSaveFreebieUrl(fUrl.trim());
                  setCustomSavedSuccess(true);
                  setTimeout(() => setCustomSavedSuccess(false), 3000);
                }}
                className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer transition-colors"
              >
                Save Freebie
              </button>
            </div>
          </div>

          <hr className="border-linen" />

          {/* Section: Just Released Book Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              📚 "Just Released" Book Customizer
            </h4>

            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1">
                Amazon Listing URL / Book Link
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-xs bg-white text-[#2D241E]"
                placeholder="https://www.amazon.com/dp/B0H1J759P6"
                value={bAmazonUrl}
                onChange={(e) => setBAmazonUrl(e.target.value)}
              />
              {(() => {
                const asin = extractAsin(bAmazonUrl);
                if (asin) {
                  return (
                    <div className="mt-1 text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span>✓ Detected ASIN:</span> <code className="font-mono bg-emerald-50 px-1 rounded">{asin}</code>
                      <span className="text-neutral-400">| Cover will auto-update using this Amazon code.</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="mt-1 text-[10px] text-amber-600 font-medium">
                      ⚠ No direct ASIN detected. A stylized placeholder cover with your custom title will be shown.
                    </div>
                  );
                }
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-xs bg-white text-[#2D241E]"
                  placeholder="The Big Allergen-Safe Picnic"
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">
                  Book Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-xs bg-white text-[#2D241E] resize-y"
                  placeholder="A descriptive synopsis..."
                  value={bDescription}
                  onChange={(e) => setBDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  onSaveBookDetails(bTitle.trim(), bAmazonUrl.trim(), bDescription.trim());
                  setCustomSavedSuccess(true);
                  setTimeout(() => setCustomSavedSuccess(false), 3000);
                }}
                className="px-5 py-2.5 bg-sage hover:bg-sage-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" /> Save Book Details
              </button>
            </div>
          </div>
        </div>

        {customSavedSuccess && (
          <div className="mt-3 text-xs font-bold text-success flex items-center gap-1 animate-fade-in">
            <CheckCircle className="w-4 h-4" /> Customizations successfully saved! All cards are updated.
          </div>
        )}
      </div>

      {/* Step by step manual check */}
      <div className="border border-neutral-100 rounded-xl p-5">
        <h3 className="font-serif text-[#2D241E] font-bold text-lg mb-4">📝 Simple Step-By-Step Setup Guide:</h3>
        
        <div className="space-y-4 text-sm text-[#2D241E] leading-relaxed">
          <div className="flex gap-3">
            <span className="h-6 w-6 rounded-full bg-sage-light text-sage-dark text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <p className="font-bold">Create a Google Sheet</p>
              <p className="text-xs text-[#7B7068]">Go to Google Sheets and make a blank spreadsheet. Name it <strong>RLB Contact Hub Submissions</strong>.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="h-6 w-6 rounded-full bg-sage-light text-sage-dark text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold">Paste our Google Apps Script</p>
              <p className="text-xs text-[#7B7068] mb-2">
                In your Google Sheet, click on <strong>Extensions</strong> → <strong>Apps Script</strong>. Delete any code you see, click the button below to copy our helper code, paste it inside the editor, and save (press Ctrl+S / Cmd+S).
              </p>
              <div className="relative bg-neutral-900 rounded-lg p-3 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-[140px] border border-neutral-800">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
                    alert("🌸 Rachel's Apps Script code successfully copied to your clipboard!");
                  }}
                  className="absolute top-2 right-2 bg-sage hover:bg-sage-dark text-[10px] text-white font-bold py-1 px-2.5 rounded border border-sage cursor-pointer transition-colors"
                >
                  Copy Script Code
                </button>
                <pre>{APPS_SCRIPT_CODE}</pre>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="h-6 w-6 rounded-full bg-sage-light text-sage-dark text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <div className="flex-1">
              <p className="font-bold">Deploy &amp; Authorize permissions</p>
              <p className="text-xs text-[#7B7068] mb-3">
                In the Apps Script editor, click <strong>Deploy</strong> → <strong>New Deployment</strong>. Click the gear icon and choose <strong>Web App</strong>. Set "Execute as" to <strong>Me</strong> and "Who has access" to <strong>Anyone</strong>. Click <strong>Deploy</strong>.
              </p>
              
              <div className="bg-amber-50/75 border border-amber-200 rounded-lg p-3.5 space-y-2.5 text-xs text-amber-900 mb-2">
                <p className="font-bold flex items-center gap-1 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  How to complete the "Authorize Access" popups safely:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>Click the blue <strong>"Authorize access"</strong> button on your screen.</li>
                  <li>Select your Google Account (email address) from the list.</li>
                  <li>
                    <strong>Bypass the scary warning screen:</strong> Google will say <em>"Google hasn't verified this app."</em> This is completely normal since you wrote this private code. Click the small <strong>"Advanced"</strong> link in the bottom-left corner, then click <strong>"Go to Untitled project (unsafe)"</strong> at the bottom.
                  </li>
                  <li>Click the blue <strong>"Allow"</strong> button to let the form write to your sheet and send email notifications.</li>
                </ol>
              </div>

              <p className="text-xs text-[#7B7068]">
                Finally, copy the completed <strong>Web App URL</strong> (it starts with <code>https://script.google.com/macros/s/...</code>), paste it into the box at the top of this desk, and click save!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
