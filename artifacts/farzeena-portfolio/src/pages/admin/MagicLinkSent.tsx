import { Link } from "wouter";
import { MailCheck, ArrowLeft } from "lucide-react";

export default function MagicLinkSent() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
            <MailCheck className="w-10 h-10" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-navy mb-4">Check your email</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          We've sent a magic link to your email address. Click the link inside to securely sign in. The link expires in 15 minutes.
        </p>

        <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </div>
  );
}
