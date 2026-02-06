"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";
import Link from "next/link";

export default function CTAHeader() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleSignOut = useCallback(async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Force clear all Supabase storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to home
    window.location.href = "/";
  } catch (error) {
    console.error('Sign out error:', error);
    // Even if Supabase fails, force logout
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }
}, []);

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-lg">Resumify</span>
            </Link>
            
            {/* Navigation */}
            <div className="flex items-center gap-6">
              <Link 
                href="/api-info" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                API Docs
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              
              {user ? (
                <button 
                  key={user.id}
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Get API Key
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}