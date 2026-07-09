import React from 'react';
import { HelpCircle, Bug, BookOpen, Heart, Lightbulb, Users, Search, ArrowRight, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';

interface AssistantConciergeProps {
  onSwitchTab: (tab: ActiveTab) => void;
}

export default function AssistantConcierge({ onSwitchTab }: AssistantConciergeProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#F4EFE6] shadow-md p-6 md:p-8 animate-fade-in">
      {/* Friendly Host Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-[#F4EFE6] mb-8">
        <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center border-2 border-sage text-sage-dark relative shadow-inner shrink-0">
          <span className="text-4xl">🌸</span>
          <div className="absolute -bottom-1 -right-1 bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" /> Helper
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-serif text-2xl text-[#2D241E] mb-1">Hello! Welcome to RLB Designs Help Hub</h3>
          <p className="text-sage font-bold text-lg mb-1">What can I help you with today?</p>
          <p className="text-[#7B7068] text-sm leading-relaxed">
            I’m your friendly form helper. My goal is to make sure your question, idea, or bug report gets straight to Rachel Baldwin without any fuss!
          </p>
        </div>
      </div>

      {/* Easy-to-follow Instructions */}
      <div className="bg-gold-light/40 border border-gold/30 rounded-xl p-5 mb-8">
        <h4 className="font-serif text-[#C5A059] text-lg font-bold mb-2 flex items-center gap-2">
          🌸 How to Use This Hub in 3 Easy Steps:
        </h4>
        <ol className="list-decimal list-inside text-sm text-[#2D241E] space-y-2.5 leading-relaxed pl-1">
          <li>
            <strong className="text-sage-dark">Choose a Topic:</strong> Look at the cards below and click the one that matches what you need today.
          </li>
          <li>
            <strong className="text-sage-dark">Fill in the Blanks:</strong> Tell us a bit about you and your question. We’ve kept the questions super simple and free of any confusing "tech talk."
          </li>
          <li>
            <strong className="text-sage-dark">Get Your Answer:</strong> Click Send! Rachel personally reads every single message and will write back to your email inbox.
          </li>
        </ol>
      </div>

      <h4 className="font-serif text-xl text-[#2D241E] mb-5 text-center md:text-left">What can we help you with today?</h4>
      
      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* APP BUG */}
        <button
          onClick={() => onSwitchTab('app')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#F8EFEE] text-blush flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <Bug className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Something is Broken</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">Report an app bug, error code, or frozen screen in one of our tools.</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Go to Report <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        {/* BOOK / SERIES */}
        <button
          onClick={() => onSwitchTab('books')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-sage-light text-sage flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Book &amp; Series Help</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">Ask about upcoming books, series reading order, or allergy-safe recipes.</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Ask Rachel <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        {/* GENERAL FEEDBACK */}
        <button
          onClick={() => onSwitchTab('feedback')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-gold-light text-[#C5A059] flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Share Feedback</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">Share some love or let us know how we can make our website better.</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Share Thoughts <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        {/* SUGGESTIONS */}
        <button
          onClick={() => onSwitchTab('suggest')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#FAF3E0] text-gold flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Neat Ideas &amp; Suggestions</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">Suggest a new book topic, app feature, recipe, or journal idea!</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Suggest Idea <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        {/* COLLABORATIONS */}
        <button
          onClick={() => onSwitchTab('collab')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-sage-light text-sage-dark flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Work Together</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">For bloggers, libraries, bookstores, co-authors, and interview requests.</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Inquire Here <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        {/* APP TESTING SIGN-UP */}
        <button
          onClick={() => onSwitchTab('tester')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#FAF3E0] text-gold flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <span className="text-xl">🧪</span>
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Become an App Tester</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">Join our crew to test Character Bible, Coloring Book Launchpad, and other cool new tools!</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Sign Up to Test <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        {/* FAQ ACCORDION */}
        <button
          onClick={() => onSwitchTab('faq')}
          className="group text-left p-5 bg-[#FDFBF7] hover:bg-sage-light border border-[#F4EFE6] hover:border-sage rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-gold-light/50 text-gold flex items-center justify-center mb-3 group-hover:bg-sage group-hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#2D241E] group-hover:text-sage-dark transition-colors mb-1">Browse Quick Answers</h5>
            <p className="text-xs text-[#7B7068] leading-relaxed">Fix common website problems or find direct answers in under a minute.</p>
          </div>
          <span className="text-xs font-bold text-sage-dark flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Open FAQ <ArrowRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Helpful quote footer */}
      <div className="mt-8 pt-6 border-t border-[#F4EFE6] text-center">
        <p className="font-serif italic text-sm text-[#7B7068]">
          "We read and appreciate every single message. Thank you for connecting with RLB Designs!"
        </p>
      </div>
    </div>
  );
}
