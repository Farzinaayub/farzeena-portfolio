import { useState } from "react";
import { useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Cloud, Mail, KeyRound, ArrowRight, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  function extractMessage(err: unknown): string {
    if (err && typeof err === "object") {
      const e = err as { data?: { message?: string; error?: string }; message?: string };
      return e.data?.message || e.data?.error || e.message || "An error occurred.";
    }
    return String(err);
  }

  const { mutate: sendOtp, isPending: isSending } = useSendOtp({
    mutation: {
      onSuccess: () => {
        setStep("otp");
        toast({
          title: "Code sent",
          description: `A 6-digit code was sent to ${email}`,
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Not authorized",
          description: extractMessage(err),
        });
      },
    },
  });

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp({
    mutation: {
      onSuccess: () => {
        setLocation("/admin/dashboard");
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: extractMessage(err),
        });
        setOtp("");
      },
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendOtp({ data: { email } });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    verifyOtp({ data: { email, otp } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Cloud className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy mb-2">Admin Portal</h1>
          <p className="text-slate-500">
            {step === "email"
              ? "Enter your email to receive a login code."
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="admin@farzeena.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending || !email}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Sending code…
                </>
              ) : (
                <>
                  Send Login Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">
                One-Time Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-2xl tracking-[0.4em] text-center font-mono"
                  placeholder="······"
                />
              </div>
              <p className="text-xs text-slate-400 text-center">
                Check your inbox — the code expires in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.length < 6}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Verifying…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
              }}
              className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
