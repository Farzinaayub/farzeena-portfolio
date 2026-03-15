import { useState } from "react";
import { useRequestMagicLink } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Cloud, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { mutate, isPending } = useRequestMagicLink({
    mutation: {
      onSuccess: () => {
        setLocation("/admin/magic-link-sent");
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: err.message || "This email is not authorized. Contact the site owner."
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    mutate({ data: { email } });
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
          <p className="text-slate-500">Sign in via magic link to manage your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="admin@farzeena.com"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isPending ? "Sending Link..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
