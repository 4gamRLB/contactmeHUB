import React from 'react';
import { CheckCircle, Inbox, ShieldCheck, Clock, Award, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

interface FormSuccessModalProps {
  formType: string;
  userEmail: string;
  onClose: () => void;
}

export default function FormSuccessModal({ formType, userEmail, onClose }: FormSuccessModalProps) {
  // Determine expected answer timeline based on category
  let expectedTimeline = '2 business days';
  if (formType === 'Collaboration') expectedTimeline = '5 to 7 business days';
  if (formType === 'Book/Series') expectedTimeline = '2 to 4 business days';

  return (
    <div className="bg-[#FDFBF7] border-2 border-sage/40 rounded-2xl p-6 md:p-8 shadow-lg text-center animate-scale-up max-w-xl mx-auto my-6">
      {/* Sparkly Star Animation */}
      <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center text-sage-dark mx-auto mb-5 relative shadow-sm">
        <CheckCircle className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 text-gold text-sm animate-bounce">✨</div>
      </div>

      <h3 className="font-serif text-2xl md:text-3xl text-[#2D241E] mb-2">Message Safely Received!</h3>
      <p className="text-sm text-[#7B7068] max-w-md mx-auto mb-6">
        Thank you! We have securely received your <strong>{formType}</strong> request. Rachel Baldwin reads every single submission herself.
      </p>

      {/* Visual Checklist for Beginner Users */}
      <div className="bg-white rounded-xl border border-[#F4EFE6] p-5 text-left mb-6 max-w-md mx-auto shadow-inner space-y-4">
        <h4 className="text-xs font-bold text-sage-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> What happens next:
        </h4>

        {/* Step 1 */}
        <div className="flex items-start gap-3">
          <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full shrink-0 mt-0.5 border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D241E]">Securely logged in our Database</p>
            <p className="text-xs text-[#7B7068]">Your message has been filed into Rachel's official helpdesk spreadsheet.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3">
          <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full shrink-0 mt-0.5 border border-emerald-100">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D241E]">Delivered to Rachel's inbox</p>
            <p className="text-xs text-[#7B7068]">An email notification was sent to <strong>ogrlbdesigns@gmail.com</strong>.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3">
          <div className="bg-amber-50 text-amber-600 p-1 rounded-full shrink-0 mt-0.5 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D241E]">Personal review &amp; reply</p>
            <p className="text-xs text-[#7B7068]">Rachel will email you at <strong>{userEmail || 'your email'}</strong> in <strong>{expectedTimeline}</strong>.</p>
          </div>
        </div>
      </div>

      <div className="bg-gold-light/40 rounded-xl p-4 mb-8 border border-gold/20 max-w-md mx-auto">
        <p className="text-xs text-[#7B7068] italic">
          💡 <strong>Fun Quick Tip:</strong> While you wait, did you know Rachel has over 50 books published? Check out her books or allergen-safe recipes on <a href="https://www.rlbdesigns.com" target="_blank" rel="noopener noreferrer" className="text-sage font-bold hover:underline">rlbdesigns.com</a>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <a
          href="https://www.rlbdesigns.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-[#C5A059] hover:bg-[#B38F48] text-white rounded-xl font-bold text-sm transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
        >
          Return to rlbdesigns.com <ExternalLink className="w-4 h-4" />
        </a>
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 bg-[#EFECE6] hover:bg-[#E5E0D5] text-[#2D241E] border border-[#DDD8CE] rounded-xl font-bold text-sm cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
}
