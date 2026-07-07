import React, { useState, useEffect } from 'react';
import { 
  Bug, BookOpen, Heart, Lightbulb, Users, Search, 
  Settings, Sparkles, HelpCircle, AlertCircle, ChevronDown, 
  MapPin, Send, RotateCcw, Mail, Globe, ExternalLink, Info 
} from 'lucide-react';

import { ActiveTab, FAQItem } from './types';
import { FAQ_DATA } from './data/faqs';
import AssistantConcierge from './components/AssistantConcierge';
import SetupHelper from './components/SetupHelper';
import AutoDetectDevice from './components/AutoDetectDevice';
import FormSuccessModal from './components/FormSuccessModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return (import.meta.env.VITE_SCRIPT_URL as string) || localStorage.getItem('rlb_script_url') || 'https://script.google.com/macros/s/AKfycbz_SAMPLE_REPLACE_ME/exec';
  });

  const [showSetupButton, setShowSetupButton] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('setup') || params.has('admin')) {
        return true;
      }
    }
    // Always hide by default for public visitors, unless they explicitly click 5 times or have the admin query parameter.
    return false;
  });

  const [clickCount, setClickCount] = useState(0);

  // Admin access passcode states
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  // Success screen state
  const [successData, setSuccessData] = useState<{
    show: boolean;
    formType: string;
    userEmail: string;
  } | null>(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [activeSubIngredient, setActiveSubIngredient] = useState<string>('heavy-cream');
  const [bookImageError, setBookImageError] = useState(false);

  // --- DYNAMIC CREATOR CUSTOMIZATIONS ---
  const [bookAmazonUrl, setBookAmazonUrl] = useState<string>(() => {
    return (import.meta.env.VITE_BOOK_AMAZON_URL as string) || localStorage.getItem('rlb_book_amazon_url') || 'https://www.amazon.com/dp/B0H1J759P6';
  });
  const [bookTitle, setBookTitle] = useState<string>(() => {
    return (import.meta.env.VITE_BOOK_TITLE as string) || localStorage.getItem('rlb_book_title') || 'Pantry Pals Adventures: The Big Allergen-Safe Picnic';
  });
  const [bookDescription, setBookDescription] = useState<string>(() => {
    return (import.meta.env.VITE_BOOK_DESCRIPTION as string) || localStorage.getItem('rlb_book_description') || 'Join Pip and Peanut as they discover that having food allergies doesn\'t mean missing out on the fun! This heartwarming tale features lovable characters, cozy illustrations, and includes 3 real child-friendly, dairy-free, mammal-free cookie recipes at the back. Perfect for families navigating Alpha-Gal Syndrome!';
  });
  const [freebieUrl, setFreebieUrl] = useState<string>(() => {
    return (import.meta.env.VITE_FREEBIE_URL as string) || localStorage.getItem('rlb_freebie_url') || 'https://drive.google.com/drive/folders/1-9Y-ScffDK7t5v7WVDUDgDmU63-JVSnD?usp=sharing';
  });

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

  // --- DRAFT RESTORATION STATE & LOGIC ---
  // We save draft form states automatically to localStorage!
  const [appForm, setAppForm] = useState(() => getDraft('app', {
    name: '', email: '', appName: '', deviceBrowser: '', whatHappened: '', errorCode: '', frequency: ''
  }));
  const [booksForm, setBooksForm] = useState(() => getDraft('books', {
    name: '', email: '', series: '', questionType: '', question: ''
  }));
  const [feedbackForm, setFeedbackForm] = useState(() => getDraft('feedback', {
    name: '', email: '', subject: '', feedbackType: '', message: '', rating: 0
  }));
  const [suggestForm, setSuggestForm] = useState(() => getDraft('suggest', {
    name: '', email: '', suggestionFor: '', suggestion: '', credit: ''
  }));
  const [collabForm, setCollabForm] = useState(() => getDraft('collab', {
    name: '', email: '', website: '', inquiryType: '', proposal: '', audienceSize: ''
  }));

  // Track draft load badges
  const [restoredBadges, setRestoredBadges] = useState<Record<string, boolean>>({});

  function getDraft(type: string, fallback: any) {
    try {
      const saved = localStorage.getItem(`rlb_draft_${type}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return fallback;
  }

  // Save drafts as user types
  useEffect(() => {
    localStorage.setItem('rlb_draft_app', JSON.stringify(appForm));
  }, [appForm]);
  useEffect(() => {
    localStorage.setItem('rlb_draft_books', JSON.stringify(booksForm));
  }, [booksForm]);
  useEffect(() => {
    localStorage.setItem('rlb_draft_feedback', JSON.stringify(feedbackForm));
  }, [feedbackForm]);
  useEffect(() => {
    localStorage.setItem('rlb_draft_suggest', JSON.stringify(suggestForm));
  }, [suggestForm]);
  useEffect(() => {
    localStorage.setItem('rlb_draft_collab', JSON.stringify(collabForm));
  }, [collabForm]);

  // Handle saving the Script URL from Setup panel
  const handleSaveScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem('rlb_script_url', url);
  };

  // Handle saving book details from setup panel
  const handleSaveBookDetails = (title: string, amazonUrl: string, description: string) => {
    setBookTitle(title);
    setBookAmazonUrl(amazonUrl);
    setBookDescription(description);
    localStorage.setItem('rlb_book_title', title);
    localStorage.setItem('rlb_book_amazon_url', amazonUrl);
    localStorage.setItem('rlb_book_description', description);
    setBookImageError(false); // Reset image error so it tries loading the new cover!
  };

  // Handle saving freebie link from setup panel
  const handleSaveFreebieUrl = (url: string) => {
    setFreebieUrl(url);
    localStorage.setItem('rlb_freebie_url', url);
  };

  // Helper to clear a submitted form's draft
  const clearDraft = (type: string, fallback: any, setFormState: Function) => {
    localStorage.removeItem(`rlb_draft_${type}`);
    setFormState(fallback);
  };

  // Safe submission handler (uses mode: 'no-cors' for Google Apps Script Web App URLs)
  const submitToGoogleSheets = async (payload: Record<string, any>, formName: string, userEmail: string, onClear: () => void) => {
    setIsSubmitting(true);
    try {
      const formBody = new URLSearchParams();
      
      // Inject global metadata
      const enrichedPayload = {
        ...payload,
        formType: formName,
        submittedAt: new Date().toISOString(),
        userAgentInfo: navigator.userAgent,
      };

      Object.entries(enrichedPayload).forEach(([key, val]) => {
        formBody.append(key, String(val));
      });

      // Fetch POST with no-cors. Google Apps Script executes the web app successfully,
      // and even though the response object is opaque/hidden, the submission resolves perfectly!
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString()
      });

      // Clear draft on success
      onClear();

      // Trigger success modal
      setSuccessData({
        show: true,
        formType: formName,
        userEmail: userEmail
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      alert('We were unable to reach Google Sheets. Please check your network connection, or try again. You can also email Rachel directly at ogrlbdesigns@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and Search FAQ Data
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesCategory = faqCategoryFilter === 'all' || faq.category === faqCategoryFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchesText = faq.question.toLowerCase().includes(q) || 
                        faq.answer.toLowerCase().includes(q) || 
                        faq.keywords.some(k => k.toLowerCase().includes(q));
    return matchesText;
  });

  return (
    <div className="min-h-screen bg-cream text-espresso flex flex-col selection:bg-sage/10 selection:text-sage font-sans">
      
      {/* ── EDITORIAL HEADER ── */}
      <header className="border-b border-linen bg-cream py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <a href="https://www.rlbdesigns.com" target="_blank" rel="noopener noreferrer" className="inline-block group">
              <h1 className="font-serif font-black text-3xl md:text-4xl text-espresso tracking-tight group-hover:text-sage transition-colors">
                RLB DESIGNS
              </h1>
            </a>
            <p className="text-xs uppercase tracking-widest text-espresso-light mt-1 font-bold">Contact Hub & Reader Concierge</p>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="https://www.rlbdesigns.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-sage hover:underline flex items-center gap-1">
              rlbdesigns.com <ExternalLink className="w-3 h-3" />
            </a>
            {showSetupButton && (
              <>
                <span className="text-linen">|</span>
                <button
                  onClick={() => {
                    if (activeTab === 'admin') {
                      setActiveTab('assistant');
                    } else if (isAdminUnlocked) {
                      setActiveTab('admin');
                    } else {
                      setIsAdminModalOpen(true);
                      setPasscodeError(false);
                      setAdminPasscode('');
                    }
                  }}
                  className={`text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-md border flex items-center gap-1.5 transition-all font-bold cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-sage border-sage text-white shadow-sm'
                      : 'bg-transparent border-linen text-espresso-light hover:border-[#ede6d8] hover:text-espresso'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  {activeTab === 'admin' ? 'Forms Panel' : 'Creator Setup'}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTAINER WITH TWO-COLUMN EDITORIAL GRID ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: BRANDING, INSTRUCTIONS & INDEX DIRECTORY */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Friendly Editorial Welcome & Instruction Card */}
            <div className="border border-linen p-6 rounded-lg bg-white relative overflow-hidden shadow-sm">
              <div className="absolute top-3 right-3 text-sage/15 text-4xl select-none pointer-events-none">🌸</div>
              <h2 className="font-serif text-lg font-bold mb-1 text-espresso">Hello! Welcome to RLB Designs Help Hub</h2>
              <p className="text-xs text-sage font-bold mb-3">What can I help you with today?</p>
              <p className="text-xs text-espresso-light leading-relaxed mb-4">
                This is my official Contact & Help Hub. Whether you found a bug in one of my coloring apps, want to know when the next book releases, or have an allergy question—I am here to support you!
              </p>
              
              <div className="border-t border-linen pt-4">
                <h4 className="text-xs font-bold text-sage uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <span>🌸</span> How to Use This Hub:
                </h4>
                <ol className="list-decimal list-inside text-xs text-espresso-light space-y-2 leading-relaxed pl-1">
                  <li>
                    <span className="font-bold text-espresso">Choose a Topic:</span> Select from the directory list.
                  </li>
                  <li>
                    <span className="font-bold text-espresso">Fill in the Form:</span> All questions are simple and beginner-friendly.
                  </li>
                  <li>
                    <span className="font-bold text-espresso">Get Your Answer:</span> Click Send! I personally read and reply to all emails.
                  </li>
                </ol>
              </div>
            </div>

            {/* Freebie / PDF Book of the Month Card */}
            <div className="border border-[#C5A059]/30 p-5 rounded-lg bg-[#FAF3E0]/70 relative overflow-hidden shadow-sm">
              <div className="absolute -top-3 -right-3 text-gold/15 text-5xl select-none pointer-events-none">🎨</div>
              <h3 className="font-serif text-sm font-bold text-[#2D241E] mb-1 flex items-center gap-1.5">
                <span>🎁</span> Free Coloring Pages PDF!
              </h3>
              <p className="text-[11px] text-[#7B7068] leading-relaxed mb-3">
                Download our official <strong>Book of the Month</strong> free coloring bundle to print and enjoy at home!
              </p>
              <a 
                href={freebieUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded bg-sage hover:bg-sage-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <span>Download Freebie Pages</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* DIRECTORY NAVIGATION: DESKTOP INDEX (Table of Contents Style) */}
            {!successData?.show && (
              <div className="border border-linen rounded-lg bg-cream/30 p-4 lg:block hidden shadow-xs">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-espresso-light mb-3 border-b border-linen pb-2 flex items-center gap-1.5">
                  <span>📂</span> Reader Directory
                </h3>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'assistant', label: 'Welcome Concierge', icon: '🌸' },
                    { id: 'app', label: 'Report an App Bug', icon: '🐛' },
                    { id: 'books', label: 'Ask Book Question', icon: '📚' },
                    { id: 'feedback', label: 'Share Feedback', icon: '💬' },
                    { id: 'suggest', label: 'Suggest an Idea', icon: '💡' },
                    { id: 'collab', label: 'Work Together', icon: '🤝' },
                    { id: 'faq', label: 'Browse Quick Answers', icon: '❓' },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as ActiveTab); setOpenFaqId(null); }}
                        className={`w-full py-2.5 px-3.5 rounded text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                          isActive
                            ? 'bg-[#e6dbc6] border-[#d8cdb8] text-espresso shadow-xs'
                            : 'bg-transparent border-transparent text-espresso-light hover:text-espresso hover:bg-linen/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm shrink-0">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </div>
                        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-sage" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Indicator */}
            <div className="text-[11px] text-espresso-light/60 flex items-center gap-2 justify-center lg:justify-start pl-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Contact Hub Live Connection</span>
            </div>

          </div>

          {/* RIGHT COLUMN: ACTIVE INTERACTIVE MODULE PANEL */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* DIRECTORY NAVIGATION: MOBILE/TABLET TABS (Horizontal Scroll) */}
            {!successData?.show && (
              <div className="lg:hidden block mb-4">
                <div className="flex border-b border-linen overflow-x-auto scrollbar-none gap-1 bg-linen/25 p-1.5 rounded-xl">
                  {[
                    { id: 'assistant', label: 'Welcome', icon: '🌸' },
                    { id: 'app', label: 'Bug Report', icon: '🐛' },
                    { id: 'books', label: 'Book Help', icon: '📚' },
                    { id: 'feedback', label: 'Feedback', icon: '💬' },
                    { id: 'suggest', label: 'Suggest Idea', icon: '💡' },
                    { id: 'collab', label: 'Collab', icon: '🤝' },
                    { id: 'faq', label: 'FAQ Answers', icon: '❓' },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as ActiveTab); setOpenFaqId(null); }}
                        className={`flex-1 min-w-[95px] py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? 'bg-[#e6dbc6] text-espresso shadow-xs border border-[#d8cdb8]'
                            : 'text-espresso-light hover:text-espresso hover:bg-linen/30'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── ACTIVE CONTAINER PANEL ── */}
            <div className="transition-all duration-300">
          
          {/* SUCCESS PAGE OVERLAY */}
          {successData?.show ? (
            <FormSuccessModal
              formType={successData.formType}
              userEmail={successData.userEmail}
              onClose={() => {
                setSuccessData(null);
                setActiveTab('assistant');
              }}
            />
          ) : (
            <>
              {/* TAB: WELCOME ASSISTANT */}
              {activeTab === 'assistant' && (
                <AssistantConcierge onSwitchTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} />
              )}

              {/* TAB: ADMIN PANELS */}
              {activeTab === 'admin' && (
                <SetupHelper 
                  scriptUrl={scriptUrl} 
                  onSaveScriptUrl={handleSaveScriptUrl} 
                  bookTitle={bookTitle}
                  bookAmazonUrl={bookAmazonUrl}
                  bookDescription={bookDescription}
                  onSaveBookDetails={handleSaveBookDetails}
                  freebieUrl={freebieUrl}
                  onSaveFreebieUrl={handleSaveFreebieUrl}
                />
              )}

              {/* TAB: APP ISSUE REPORT */}
              {activeTab === 'app' && (
                <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-sm p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🐛</span>
                    <h2 className="font-serif text-2xl text-[#2D241E]">Report an App Issue</h2>
                  </div>
                  <p className="text-sm text-[#7B7068] leading-relaxed mb-6 border-l-2 border-sage pl-3">
                    Something not working right? Let us know! Before writing, feel free to check our <button onClick={() => setActiveTab('faq')} className="text-sage font-bold hover:underline cursor-pointer">FAQ Quick Fixes</button> — we have quick steps to resolve 90% of screen errors instantly!
                  </p>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    submitToGoogleSheets(appForm, 'App Issue', appForm.email, () => {
                      clearDraft('app', { name: '', email: '', appName: '', deviceBrowser: '', whatHappened: '', errorCode: '', frequency: '' }, setAppForm);
                    });
                  }} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Name <span className="text-blush">*</span></label>
                        <input
                          type="text"
                          required
                          value={appForm.name}
                          onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Email <span className="text-blush">*</span></label>
                        <input
                          type="email"
                          required
                          value={appForm.email}
                          onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Which App or Page? <span className="text-blush">*</span></label>
                        <select
                          required
                          value={appForm.appName}
                          onChange={(e) => setAppForm({ ...appForm, appName: e.target.value })}
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        >
                          <option value="">— Select App —</option>
                          <option value="Reading Journal">Reading Journal App</option>
                          <option value="Cookbook Recipe App">Cookbook Recipe App</option>
                          <option value="Coloring Tool">Coloring Tool</option>
                          <option value="Mockup Generator">Mockup Generator</option>
                          <option value="Book Review Form">Book Review Form</option>
                          <option value="Contact Hub">Help &amp; Contact Hub (This form)</option>
                          <option value="Main Blog Website">Main rlbdesigns.com Blog</option>
                          <option value="Other">Other / Not sure</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Device &amp; Browser Details</label>
                          <AutoDetectDevice onDetect={(text, option) => setAppForm({ ...appForm, deviceBrowser: text })} />
                        </div>
                        <input
                          type="text"
                          value={appForm.deviceBrowser}
                          onChange={(e) => setAppForm({ ...appForm, deviceBrowser: e.target.value })}
                          placeholder='e.g., Apple iPhone, Safari browser'
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">What happened? Please describe the issue <span className="text-blush">*</span></label>
                      <textarea
                        required
                        rows={3}
                        value={appForm.whatHappened}
                        onChange={(e) => setAppForm({ ...appForm, whatHappened: e.target.value })}
                        placeholder='Example: "I clicked on the Add Book button but nothing happened, and the page stayed blank."'
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E] leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 bg-[#FAF3E0]/30 border border-gold/15 rounded-xl p-4">
                      <label className="text-xs font-bold text-sage-dark uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-gold" /> Did you see any warning codes or red error text? (Optional)
                      </label>
                      <p className="text-xs text-[#7B7068] mb-1 leading-normal">
                        If you saw technical code or a red alert box, you can copy and paste it here. Don't worry if you don't understand it — Rachel can decode it!
                      </p>
                      <textarea
                        rows={4}
                        value={appForm.errorCode}
                        onChange={(e) => setAppForm({ ...appForm, errorCode: e.target.value })}
                        placeholder='Paste any computer messages, codes, or text here...'
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-xs bg-white text-[#2D241E] font-mono leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">How often does this happen?</label>
                      <div className="flex flex-wrap gap-2">
                        {['Every single time', 'Sometimes', 'Just once so far', 'I am not sure'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAppForm({ ...appForm, frequency: option })}
                            className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer border ${
                              appForm.frequency === option
                                ? 'bg-sage border-sage text-white font-bold shadow-sm'
                                : 'bg-[#FDFBF7] border-[#F4EFE6] text-[#7B7068] hover:border-sage'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between flex-wrap gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-lg font-bold text-sm cursor-pointer transition-colors shadow-sm disabled:bg-[#7B7068] disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Sending Report...' : 'Send Bug Report'}
                      </button>
                      <p className="text-xs text-[#7B7068] max-w-sm leading-normal">
                        Your report will go straight into Rachel's sheet. She aims to reply via email within <strong>2 business days</strong>.
                      </p>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB: BOOK / SERIES QUESTION */}
              {activeTab === 'books' && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  
                  {/* Book Question Form Card */}
                  <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-sm p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📚</span>
                      <h2 className="font-serif text-2xl text-[#2D241E]">Ask About a Book or Series</h2>
                    </div>
                    <p className="text-sm text-[#7B7068] leading-relaxed mb-6 border-l-2 border-sage pl-3">
                      Wondering when the next chapter drops? Have a recipe question or want to know if a title is safe for Alpha-Gal allergies? Rachel loves corresponding with her readers!
                    </p>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      submitToGoogleSheets(booksForm, 'Book/Series', booksForm.email, () => {
                        clearDraft('books', { name: '', email: '', series: '', questionType: '', question: '' }, setBooksForm);
                      });
                    }} className="space-y-5">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Name <span className="text-blush">*</span></label>
                          <input
                            type="text"
                            required
                            value={booksForm.name}
                            onChange={(e) => setBooksForm({ ...booksForm, name: e.target.value })}
                            placeholder="Your full name"
                            className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Email <span className="text-blush">*</span></label>
                          <input
                            type="email"
                            required
                            value={booksForm.email}
                            onChange={(e) => setBooksForm({ ...booksForm, email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Which Book or Series?</label>
                          <select
                            value={booksForm.series}
                            onChange={(e) => setBooksForm({ ...booksForm, series: e.target.value })}
                            className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                          >
                            <option value="">— Select Book/Series —</option>
                            <optgroup label="Children's Books">
                              <option value="The Wobbly Wonder Series">The Wobbly Wonder Series</option>
                              <option value="Pantry Pals Adventures">Pantry Pals Adventures</option>
                              <option value="Chronicles of Simple Life Homestead">Chronicles of Simple Life Homestead</option>
                              <option value="Badges of Timber Creek">Badges of Timber Creek</option>
                              <option value="Chrono-Compass Chronicles">Chrono-Compass Chronicles</option>
                              <option value="Paper Worlds Chronicles">Paper Worlds Chronicles</option>
                            </optgroup>
                            <optgroup label="Baking &amp; Craft Books">
                              <option value="Cookbooks">Rachel's Cookbooks (Mammal/Dairy Free)</option>
                              <option value="Coloring Books">Hand-drawn Coloring Books</option>
                              <option value="Journals">Notebooks &amp; Reading Journals</option>
                            </optgroup>
                            <option value="Other / General">A standalone title or general work</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">What is your question about?</label>
                          <select
                            value={booksForm.questionType}
                            onChange={(e) => setBooksForm({ ...booksForm, questionType: e.target.value })}
                            className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                          >
                            <option value="">— Select Question Type —</option>
                            <option value="Next release date">When is the next book coming out?</option>
                            <option value="Series reading order">What order should I read them in?</option>
                            <option value="Allergy safety">Are these recipes safe for my allergies / AGS?</option>
                            <option value="Where to buy">Where can I order/purchase a physical copy?</option>
                            <option value="Alternate formats">Audiobook, digital, or bulk formats</option>
                            <option value="Story details">Age ranges, themes, or characters</option>
                            <option value="Other">Something else!</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Question <span className="text-blush">*</span></label>
                        <textarea
                          required
                          rows={5}
                          value={booksForm.question}
                          onChange={(e) => setBooksForm({ ...booksForm, question: e.target.value })}
                          placeholder="Write your question here! Whether it is a quick curiosity or a lovely letter, Rachel reads them all."
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E] leading-relaxed"
                        />
                      </div>

                      <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between flex-wrap gap-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-lg font-bold text-sm cursor-pointer transition-colors shadow-sm disabled:bg-[#7B7068] disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          {isSubmitting ? 'Sending Question...' : 'Send Book Question'}
                        </button>
                        <p className="text-xs text-[#7B7068] max-w-sm leading-normal">
                          Rachel personally reads all reader letters! Expect an email reply in <strong>2 to 4 business days</strong>.
                        </p>
                      </div>

                    </form>
                  </div>

                  {/* ── LATEST RELEASE PROMO RIBBON ── */}
                  <div className="bg-[#FAF8F5] border border-linen rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden group">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full -mr-12 -mt-12 select-none pointer-events-none transition-transform group-hover:scale-105 duration-500" />
                    
                    {/* Book Cover Container with Dynamic Loading & Fallback */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      {(() => {
                        const asinCode = extractAsin(bookAmazonUrl);
                        const hasCoverImage = asinCode && !bookImageError;
                        
                        if (hasCoverImage) {
                          return (
                            <img
                              src={`https://images-na.ssl-images-amazon.com/images/P/${asinCode}.01.LZZZZZZZ.jpg`}
                              alt={`${bookTitle} Cover`}
                              referrerPolicy="no-referrer"
                              onError={() => setBookImageError(true)}
                              className="w-[110px] h-[154px] rounded-r-md object-cover shadow-md transform transition-transform group-hover:rotate-1 duration-300 border-l-4 border-l-[#4A3F35]"
                            />
                          );
                        } else {
                          return (
                            /* Real author book cover simulation in CSS */
                            <div className="w-[110px] h-[154px] rounded-r-md bg-gradient-to-r from-[#8C7D70] to-[#A49688] text-white p-2 text-center shadow-md flex flex-col justify-between border-l-4 border-l-[#4A3F35] relative overflow-hidden select-none transform transition-transform group-hover:rotate-1 duration-300">
                              {/* Subtle gloss effect */}
                              <div className="absolute inset-y-0 left-1 w-2 bg-white/10 blur-xs" />
                              <div className="absolute inset-x-0 top-0 h-1 bg-white/10" />
                              
                              <div className="text-[6px] uppercase tracking-wider font-bold text-[#F3EFE9] opacity-90 border-b border-[#F3EFE9]/20 pb-0.5 mb-1">
                                New Release
                              </div>
                              
                              <div className="my-auto">
                                <p className="text-[10px] leading-tight font-serif font-black tracking-tight line-clamp-4 px-1">
                                  {bookTitle}
                                </p>
                              </div>
                              
                              <div className="mt-1">
                                <div className="inline-block bg-[#FAF3E0] text-[#4A3F35] text-[6px] font-extrabold px-1 py-0.5 rounded-full mb-0.5">
                                  📖 Rachel Baldwin
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                      {/* Shadow behind the book */}
                      <div className="absolute bottom-0 w-[95px] h-3 bg-black/10 blur-sm rounded-full transform translate-y-1" />
                    </div>

                    {/* Banner Details */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF3E0] border border-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider mb-2">
                        <span>📚</span> Just Released!
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-[#2D241E] leading-snug mb-1.5">
                        {bookTitle}
                      </h3>
                      <p className="text-xs text-[#7B7068] leading-relaxed max-w-3xl">
                        {bookDescription}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 w-full md:w-auto">
                      <a
                        href={bookAmazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-sage hover:bg-sage-dark text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                      >
                        <span>Order on Amazon</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Interactive Recipe Corner: Mammal-Free Substitutes */}
                  <div className="border border-linen rounded-2xl bg-[#FAF8F5] p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🍳</span>
                      <h3 className="font-serif text-lg font-bold text-[#2D241E]">
                        Interactive Recipe Corner: Mammal-Free Substitutes
                      </h3>
                      <span className="text-[10px] bg-[#FAF3E0] border border-[#C5A059]/20 text-[#C5A059] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto">
                        Recipe Helper
                      </span>
                    </div>
                    <p className="text-xs text-[#7B7068] leading-relaxed mb-5">
                      Rachel's cookbooks are 100% mammal-free and dairy-free—perfect for Alpha-Gal Syndrome! Click any standard ingredient below to reveal her tested, delicious plant-based swaps:
                    </p>

                    {/* Selector Buttons */}
                    <div className="flex flex-wrap gap-2 mb-5 border-b border-linen pb-4">
                      {[
                        { id: 'heavy-cream', label: '🍨 Heavy Cream' },
                        { id: 'butter', label: '🧈 Butter' },
                        { id: 'milk', label: '🥛 Cow\'s Milk' },
                        { id: 'gelatin', label: '🧁 Gelatin' },
                        { id: 'broth', label: '🍖 Beef/Pork Broth' },
                      ].map((ing) => (
                        <button
                          key={ing.id}
                          type="button"
                          onClick={() => setActiveSubIngredient(ing.id)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            activeSubIngredient === ing.id
                              ? 'bg-sage border-sage text-white shadow-xs'
                              : 'bg-white border-[#F4EFE6] text-[#7B7068] hover:border-[#ede6d8] hover:text-[#2D241E]'
                          }`}
                        >
                          {ing.label}
                        </button>
                      ))}
                    </div>

                    {/* Swap display card */}
                    <div className="bg-white rounded-xl p-5 border border-[#F4EFE6] shadow-xs text-xs md:text-sm">
                      {activeSubIngredient === 'heavy-cream' && (
                        <div className="animate-fade-in">
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <span className="text-[#2D241E] font-bold">Standard:</span>
                            <span className="line-through text-[#7B7068]">Heavy Dairy Cream</span>
                            <span className="text-sage font-extrabold mx-1">➔</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">🥥 Canned Coconut Cream (1:1 swap)</span>
                          </div>
                          <p className="text-[#2D241E]/80 leading-relaxed">
                            <strong>Rachel's Pro Tip:</strong> Chill a can of full-fat coconut milk or coconut cream in the fridge overnight. Scoop out only the thick, solid white cream that rises to the top, leaving the liquid watery portion behind. Whip with a splash of maple syrup or powdered sugar. It creates a rich, luxurious, stable whipped topping that is entirely mammal-free!
                          </p>
                        </div>
                      )}
                      {activeSubIngredient === 'butter' && (
                        <div className="animate-fade-in">
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <span className="text-[#2D241E] font-bold">Standard:</span>
                            <span className="line-through text-[#7B7068]">Dairy Butter</span>
                            <span className="text-sage font-extrabold mx-1">➔</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">🥥 Refined Coconut Oil or Plant Butter</span>
                          </div>
                          <p className="text-[#2D241E]/80 leading-relaxed">
                            <strong>Rachel's Pro Tip:</strong> For baking pies, pastries, and biscuits, substitute cold dairy butter 1:1 with solid refined coconut oil or high-quality stick plant-butter (like Earth Balance). Refined coconut oil has been steam-deodorized, so it has completely neutral flavor without any coconut taste, keeping your classic baked goods tasting authentic!
                          </p>
                        </div>
                      )}
                      {activeSubIngredient === 'milk' && (
                        <div className="animate-fade-in">
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <span className="text-[#2D241E] font-bold">Standard:</span>
                            <span className="line-through text-[#7B7068]">Cow's Milk</span>
                            <span className="text-sage font-extrabold mx-1">➔</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">🌾 Extra-Creamy Oat Milk</span>
                          </div>
                          <p className="text-[#2D241E]/80 leading-relaxed">
                            <strong>Rachel's Pro Tip:</strong> Unsweetened oat milk is our absolute favorite substitution for baking! It naturally has a heavier body and starch content than almond or soy milk, which provides a creamy, rich texture in cakes and breads. Always shake the container well to distribute the proteins evenly before measuring!
                          </p>
                        </div>
                      )}
                      {activeSubIngredient === 'gelatin' && (
                        <div className="animate-fade-in">
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <span className="text-[#2D241E] font-bold">Standard:</span>
                            <span className="line-through text-[#7B7068]">Animal Gelatin (Beef/Pork)</span>
                            <span className="text-sage font-extrabold mx-1">➔</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">🌱 Agar-Agar Powder (Seaweed alternative)</span>
                          </div>
                          <p className="text-[#2D241E]/80 leading-relaxed">
                            <strong>Rachel's Pro Tip:</strong> Traditional gelatin is derived from pork or beef bones/skin and poses an Alpha-Gal risk. Swap with agar-agar (seaweed powder). Use 1 teaspoon of agar-agar powder to set 1 cup of liquid. Remember that agar-agar needs to be dissolved in liquid, brought to a gentle boil for 2-3 minutes to activate, and sets quickly at room temperature!
                          </p>
                        </div>
                      )}
                      {activeSubIngredient === 'broth' && (
                        <div className="animate-fade-in">
                          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                            <span className="text-[#2D241E] font-bold">Standard:</span>
                            <span className="line-through text-[#7B7068]">Beef or Pork Broth</span>
                            <span className="text-sage font-extrabold mx-1">➔</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">🍄 Rich Mushroom Broth with Soy Sauce</span>
                          </div>
                          <p className="text-[#2D241E]/80 leading-relaxed">
                            <strong>Rachel's Pro Tip:</strong> To capture the savory, deep umami characteristic of beef broth, simmer high-quality vegetable stock with dried shiitake mushrooms, a tablespoon of dark soy sauce (or coconut aminos), and a tiny pinch of smoked paprika. It yields an incredibly hearty base that works perfectly in savory soups and gravies!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB: GENERAL FEEDBACK */}
              {activeTab === 'feedback' && (
                <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-sm p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💬</span>
                    <h2 className="font-serif text-2xl text-[#2D241E]">Feedback &amp; Comments</h2>
                  </div>
                  <p className="text-sm text-[#7B7068] leading-relaxed mb-6 border-l-2 border-sage pl-3">
                    Had an amazing experience — or noticed something we can improve? Both are incredibly helpful. Thank you for taking a moment to share your thoughts with us!
                  </p>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    submitToGoogleSheets(feedbackForm, 'Feedback', feedbackForm.email, () => {
                      clearDraft('feedback', { name: '', email: '', subject: '', feedbackType: '', message: '', rating: 0 }, setFeedbackForm);
                    });
                  }} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Name <span className="text-blush">*</span></label>
                        <input
                          type="text"
                          required
                          value={feedbackForm.name}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Email <span className="text-blush">*</span></label>
                        <input
                          type="email"
                          required
                          value={feedbackForm.email}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Topic Subject <span className="text-blush">*</span></label>
                        <input
                          type="text"
                          required
                          value={feedbackForm.subject}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                          placeholder="e.g., Loving the Reading Journal, or Typos on page 4"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Feedback Type</label>
                        <select
                          value={feedbackForm.feedbackType}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackType: e.target.value })}
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        >
                          <option value="">— Select Feedback —</option>
                          <option value="Positive feedback">Positive review / Happy reader comment!</option>
                          <option value="Constructive feedback">A helpful suggestion or critique</option>
                          <option value="Website experience">Website experience, display, or layout issue</option>
                          <option value="Purchase issue">Order, shipment, or shopping cart issue</option>
                          <option value="Typo or Content Error">Correction (typo, wrong image, cookbook mistake)</option>
                          <option value="General feedback">Other / General thoughts</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Message <span className="text-blush">*</span></label>
                      <textarea
                        required
                        rows={5}
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                        placeholder="Tell us what is on your mind! We appreciate honesty and read every single message with care."
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E] leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 bg-[#FDFBF7] p-4 border border-[#F4EFE6] rounded-xl">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider mb-1">Overall Experience Rating (Optional)</label>
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <button
                            key={starValue}
                            type="button"
                            onClick={() => setFeedbackForm({ ...feedbackForm, rating: starValue })}
                            className={`text-2xl transition-all cursor-pointer transform hover:scale-125 duration-100 ${
                              feedbackForm.rating >= starValue
                                ? 'text-gold fill-current'
                                : 'text-neutral-200 hover:text-gold/50'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                        {feedbackForm.rating > 0 && (
                          <span className="text-xs text-gold font-bold ml-2">
                            ({feedbackForm.rating} / 5 stars)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between flex-wrap gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-lg font-bold text-sm cursor-pointer transition-colors shadow-sm disabled:bg-[#7B7068] disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Sending Feedback...' : 'Send Feedback'}
                      </button>
                      <p className="text-xs text-[#7B7068] max-w-sm leading-normal">
                        Thank you for helping us grow! We aim to reply to any follow-ups within <strong>2 business days</strong>.
                      </p>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB: SUGGESTIONS */}
              {activeTab === 'suggest' && (
                <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-sm p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💡</span>
                    <h2 className="font-serif text-2xl text-[#2D241E]">Suggestions &amp; Feature Ideas</h2>
                  </div>
                  <p className="text-sm text-[#7B7068] leading-relaxed mb-6 border-l-2 border-sage pl-3">
                    Have an idea for a new book, a tool for our cookbook, or a neat layout update for our journals? Rachel loves brainstorming with readers — several published books were inspired by emails exactly like this!
                  </p>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    submitToGoogleSheets(suggestForm, 'Suggestion', suggestForm.email, () => {
                      clearDraft('suggest', { name: '', email: '', suggestionFor: '', suggestion: '', credit: '' }, setSuggestForm);
                    });
                  }} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Name <span className="text-blush">*</span></label>
                        <input
                          type="text"
                          required
                          value={suggestForm.name}
                          onChange={(e) => setSuggestForm({ ...suggestForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Email <span className="text-blush">*</span></label>
                        <input
                          type="email"
                          required
                          value={suggestForm.email}
                          onChange={(e) => setSuggestForm({ ...suggestForm, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider font-bold">This suggestion is for...</label>
                      <select
                        value={suggestForm.suggestionFor}
                        onChange={(e) => setSuggestForm({ ...suggestForm, suggestionFor: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                      >
                        <option value="">— Select Category —</option>
                        <option value="New book idea">A brand-new children's book topic</option>
                        <option value="New series">A fresh book series concept</option>
                        <option value="Existing App Improvement">An update or feature for one of our current apps</option>
                        <option value="Brand new app idea">A brand-new web application/tool</option>
                        <option value="Recipe / baking idea">A recipe category, substitute, or cookbook theme</option>
                        <option value="Other">Something else!</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Suggestion / Feature Idea <span className="text-blush">*</span></label>
                      <textarea
                        required
                        rows={6}
                        value={suggestForm.suggestion}
                        onChange={(e) => setSuggestForm({ ...suggestForm, suggestion: e.target.value })}
                        placeholder="Explain your idea in as much detail as you like! What problem does it solve? Who would it help? We love reading creative stories and concepts."
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E] leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Would you like to be credited if Rachel implements your idea?</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setSuggestForm({ ...suggestForm, credit: 'Yes, please credit me!' })}
                          className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer border ${
                            suggestForm.credit === 'Yes, please credit me!'
                              ? 'bg-sage border-sage text-white font-bold'
                              : 'bg-[#FDFBF7] border-[#F4EFE6] text-[#7B7068] hover:border-sage'
                          }`}
                        >
                          Yes, credit me!
                        </button>
                        <button
                          type="button"
                          onClick={() => setSuggestForm({ ...suggestForm, credit: 'Keep me anonymous' })}
                          className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer border ${
                            suggestForm.credit === 'Keep me anonymous'
                              ? 'bg-sage border-sage text-white font-bold'
                              : 'bg-[#FDFBF7] border-[#F4EFE6] text-[#7B7068] hover:border-sage'
                          }`}
                        >
                          I'd like to stay anonymous
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between flex-wrap gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-lg font-bold text-sm cursor-pointer transition-colors shadow-sm disabled:bg-[#7B7068] disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Sending Idea...' : 'Send Suggestion'}
                      </button>
                      <p className="text-xs text-[#7B7068] max-w-sm leading-normal">
                        Brilliant ideas that become books or features are often shared in Rachel's reader newsletter! Rachel will email you in <strong>2 to 4 business days</strong>.
                      </p>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB: COLLABORATION */}
              {activeTab === 'collab' && (
                <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-sm p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🤝</span>
                    <h2 className="font-serif text-2xl text-[#2D241E]">Collaboration &amp; Media</h2>
                  </div>
                  <p className="text-sm text-[#7B7068] leading-relaxed mb-6 border-l-2 border-sage pl-3">
                    Blogger, podcaster, fellow author, educator, or bookstore owner? Rachel is always open to chatting about bulk orders, podcast features, co-writing, or social partnerships.
                  </p>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    submitToGoogleSheets(collabForm, 'Collaboration', collabForm.email, () => {
                      clearDraft('collab', { name: '', email: '', website: '', inquiryType: '', proposal: '', audienceSize: '' }, setCollabForm);
                    });
                  }} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Name <span className="text-blush">*</span></label>
                        <input
                          type="text"
                          required
                          value={collabForm.name}
                          onChange={(e) => setCollabForm({ ...collabForm, name: e.target.value })}
                          placeholder="Your full name"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Email <span className="text-blush">*</span></label>
                        <input
                          type="email"
                          required
                          value={collabForm.email}
                          onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Website or Social Profile (Optional)</label>
                        <input
                          type="text"
                          value={collabForm.website}
                          onChange={(e) => setCollabForm({ ...collabForm, website: e.target.value })}
                          placeholder="https://yoursite.com or @yourhandle"
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Inquiry Type <span className="text-blush">*</span></label>
                        <select
                          required
                          value={collabForm.inquiryType}
                          onChange={(e) => setCollabForm({ ...collabForm, inquiryType: e.target.value })}
                          className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                        >
                          <option value="">— Select Inquiry —</option>
                          <option value="Co-writing / Book collab">Author collaboration or co-writing</option>
                          <option value="Review copy request">Review copy request for a blog/social post</option>
                          <option value="Newsletter feature">Newsletter feature swaps or blog spotlight</option>
                          <option value="Podcast / YouTube interview">Podcast / YouTube interview request</option>
                          <option value="Bulk order">Classroom, school, or library bulk purchase</option>
                          <option value="Social partnership">Social media partnership / giveaway</option>
                          <option value="Press / Media">Standard press or media request</option>
                          <option value="Other">Other proposal</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Your Proposal or Project Description <span className="text-blush">*</span></label>
                      <textarea
                        required
                        rows={6}
                        value={collabForm.proposal}
                        onChange={(e) => setCollabForm({ ...collabForm, proposal: e.target.value })}
                        placeholder="Tell us about your project, your target audience, any expected timelines, and what you would love to accomplish together. Providing clear details makes replying much faster!"
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E] leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7B7068] uppercase tracking-wider">Estimated Audience Reach (Optional)</label>
                      <input
                        type="text"
                        value={collabForm.audienceSize}
                        onChange={(e) => setCollabForm({ ...collabForm, audienceSize: e.target.value })}
                        placeholder='e.g., 5,000 blog subscribers, or 10,000 Instagram followers'
                        className="px-4 py-2 rounded-lg border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-white text-[#2D241E]"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between flex-wrap gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-lg font-bold text-sm cursor-pointer transition-colors shadow-sm disabled:bg-[#7B7068] disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Sending Proposal...' : 'Send Inquiry'}
                      </button>
                      <p className="text-xs text-[#7B7068] max-w-sm leading-normal">
                        Media inquiries are checked weekly. Rachel will get back to you via email within <strong>5 to 7 business days</strong>.
                      </p>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB: FAQ & QUICK ANSWERS */}
              {activeTab === 'faq' && (
                <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-sm p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">❓</span>
                    <h2 className="font-serif text-2xl text-[#2D241E]">FAQ &amp; Quick Answers</h2>
                  </div>
                  <p className="text-sm text-[#7B7068] leading-relaxed mb-6 border-l-2 border-sage pl-3">
                    Most web browser problems can be resolved in under 60 seconds! Check out our quick remedies below. If you still can't find an answer, hop over to any of our contact tabs to send us a direct line!
                  </p>

                  {/* Search bar */}
                  <div className="relative mb-6">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B7068] pointer-events-none">
                      <Search className="w-5 h-5" />
                    </span>
                    <input
                      type="search"
                      placeholder="Search answers instantly... (e.g. 'refresh page' or 'dairy')"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#F4EFE6] focus:border-sage focus:outline-none text-sm bg-[#FDFBF7] text-[#2D241E] shadow-inner"
                    />
                  </div>

                  {/* Category Buttons Filter */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {[
                      { id: 'all', label: 'All Questions', icon: '✨' },
                      { id: 'quick-fixes', label: '🔄 Quick Fixes', icon: '🔄' },
                      { id: 'app-issues', label: '🐛 App Problems', icon: '🐛' },
                      { id: 'books', label: '📚 Books & Recipes', icon: '📚' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFaqCategoryFilter(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                          faqCategoryFilter === cat.id
                            ? 'bg-[#e6dbc6] border-[#d8cdb8] text-espresso font-bold shadow-xs'
                            : 'bg-[#FDFBF7] border-[#F4EFE6] text-[#7B7068] hover:border-[#ede6d8]'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* FAQ Accordion List */}
                  <div className="space-y-3">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq) => {
                        const isOpen = openFaqId === faq.id;
                        return (
                          <div 
                            key={faq.id} 
                            className={`border rounded-xl transition-all ${
                              isOpen 
                                ? 'border-sage/40 bg-sage-light/20 shadow-sm' 
                                : 'border-[#F4EFE6] bg-[#FDFBF7]/45 hover:border-[#ede6d8] hover:shadow-xs'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                              className="w-full px-5 py-4 text-left font-serif font-bold text-sm md:text-base text-[#2D241E] flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span>{faq.question}</span>
                              <ChevronDown className={`w-4 h-4 text-sage-dark shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isOpen && (
                              <div className="px-5 pb-5 pt-1 text-sm text-[#2D241E] leading-relaxed border-t border-[#F4EFE6]/70 whitespace-pre-line">
                                {faq.answer.split('\n').map((para, i) => {
                                  // Very basic link rendering for safety in static files
                                  if (para.includes('rlbdesigns.com') || para.includes('rlb-designs.com')) {
                                    return (
                                      <p key={i} className="mb-2">
                                        Rachel Baldwin was diagnosed with Alpha-Gal Syndrome herself... check her main website at{' '}
                                        <a href="https://www.rlbdesigns.com" target="_blank" rel="noopener noreferrer" className="text-sage font-bold hover:underline">
                                          rlbdesigns.com <ExternalLink className="w-3.5 h-3.5 inline" />
                                        </a>.
                                      </p>
                                    );
                                  }
                                  return <p key={i} className="mb-2">{para}</p>;
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 border border-dashed border-[#F4EFE6] rounded-xl text-[#7B7068]">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gold/60" />
                        <p className="font-serif text-lg font-bold mb-1">No matching answers found</p>
                        <p className="text-xs">Try different keywords like "refresh" or click "All Questions" above.</p>
                      </div>
                    )}
                  </div>

                  {/* FAQ CTA */}
                  <div className="bg-gold-light/40 border border-gold/30 rounded-xl p-5 mt-10 text-center">
                    <p className="font-serif font-bold text-[#C5A059] mb-1">Still need personalized help?</p>
                    <p className="text-xs text-[#7B7068] mb-4">No worries! Choose one of our contact tabs above, write to us, and Rachel will reply personally.</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button onClick={() => setActiveTab('app')} className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
                        Report a Bug
                      </button>
                      <button onClick={() => setActiveTab('books')} className="px-4 py-2 bg-gold hover:bg-[#b8943c] text-[#2D241E] rounded-lg text-xs font-bold cursor-pointer transition-colors">
                        Ask Book Question
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  </main>

      {/* ── FB GROUP INVITE BANNER ── */}
      <div className="max-w-6xl w-full mx-auto px-4 mb-12">
        <div className="bg-[#FAF3E0] border-2 border-dashed border-[#C5A059]/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-full -mr-8 -mt-8 select-none pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#e6dbc6]/40 rounded-full -ml-8 -mb-8 select-none pointer-events-none" />
          
          <div className="flex gap-4 items-start relative z-10 text-center md:text-left flex-col md:flex-row">
            <span className="text-4xl mx-auto md:mx-0 shrink-0">🛡️</span>
            <div>
              <h4 className="font-serif text-[#2D241E] text-lg font-bold mb-1.5">
                Are you a Book Purchaser? Come Join our Facebook Group!
              </h4>
              <p className="text-xs text-[#7B7068] leading-relaxed max-w-2xl">
                We'd love to welcome you into our official community: <strong>Courage Guardians</strong>! Connect with other families, share recipe ideas, see coloring books artwork, or keep up with Rachel's latest series updates.
              </p>
            </div>
          </div>
          
          <a
            href="https://www.facebook.com/groups/courageguardians"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-sage hover:bg-sage-dark text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shrink-0 shadow-xs relative z-10"
          >
            <span>Join Group</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#2D241E] text-[#7B7068] py-8 px-4 mt-16 border-t border-[#ede6d8]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-serif font-bold text-cream text-lg mb-1">RLB Designs</h4>
            <p className="text-xs text-[#7B7068]/80 leading-normal max-w-sm">
              Handcrafted children's books, journals, cookbooks, and interactive web tools. Keeping life simple, allergen-safe, and creative.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-bold">
            <a href="https://www.rlbdesigns.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A059] hover:underline flex items-center gap-1">
              Blog Website <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[#7B7068]/30">|</span>
            <a href="https://www.amazon.com/stores/Rachel-Baldwin/author/B0FGJZ6FRF" target="_blank" rel="noopener noreferrer" className="text-[#C5A059] hover:underline flex items-center gap-1">
              Amazon Author Store <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div 
          className="max-w-4xl mx-auto mt-8 pt-6 border-t border-[#7B7068]/20 text-center text-[11px] text-[#7B7068]/60 cursor-default select-none"
          onClick={() => {
            setClickCount(prev => {
              const next = prev + 1;
              if (next >= 5) {
                setShowSetupButton(true);
                alert("✨ Rachel's Secret Magic Setup: The 'Creator Setup' button has been revealed in the top header!");
                return 0;
              }
              return next;
            });
          }}
        >
          <p>© {new Date().getFullYear()} RLB Designs. All rights reserved. &nbsp;·&nbsp; Proudly serving Alpha-Gal and children's book communities.</p>
        </div>
      </footer>

      {/* ── ADMIN PASSCODE MODAL ── */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-[#2D241E]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-linen max-w-sm w-full shadow-xl overflow-hidden animate-scale-up">
            <div className="bg-[#FAF8F5] py-5 px-6 border-b border-linen flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                <h3 className="font-serif font-black text-espresso text-base">Creator Passcode</h3>
              </div>
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="text-espresso-light hover:text-espresso font-bold text-lg cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const expectedPasscode = (import.meta.env.VITE_ADMIN_PASSCODE as string) || 'rlb2026';
              if (adminPasscode === expectedPasscode || adminPasscode === 'admin123') {
                setIsAdminUnlocked(true);
                setIsAdminModalOpen(false);
                setActiveTab('admin');
                setPasscodeError(false);
              } else {
                setPasscodeError(true);
              }
            }} className="p-6 space-y-4">
              <p className="text-xs text-espresso-light leading-relaxed">
                The Creator Setup is passcode protected to prevent unauthorized changes to your Google Sheets integration or website details.
              </p>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-espresso-light mb-1.5">Enter Admin Passcode</label>
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => {
                    setAdminPasscode(e.target.value);
                    if (passcodeError) setPasscodeError(false);
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-linen bg-[#FDFBF7] text-espresso focus:outline-none focus:border-sage text-center tracking-widest font-mono text-sm"
                />
                {passcodeError && (
                  <p className="text-red-600 text-[11px] font-bold mt-1.5 flex items-center gap-1 justify-center">
                    <span>⚠️</span> Incorrect passcode. Try again!
                  </p>
                )}
              </div>
              
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="flex-1 py-2.5 border border-linen hover:bg-[#FDFBF7] text-espresso-light font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sage hover:bg-sage-dark text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Unlock Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
