import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ViewType } from "../types";

export default function RegisterAdmin({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const { registerAdminAccount } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerAdminAccount(name, email, password);
    setIsSuccess(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.20), rgba(255,255,255,0.20)), url('https://i.pinimg.com/736x/54/88/7a/54887ab0efe4a8441701110880da005d.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-md bg-white/90 border border-slate-200 rounded-lg p-8 shadow-sm backdrop-blur-[1px]">
        <button 
          onClick={() => onNavigate("dashboard")} 
          className="mb-4 text-phc-muted hover:text-phc-text underline text-sm block"
        >
          ← Back to Sign In
        </button>
        <h1 className="font-display font-bold text-2xl text-phc-blue mb-1">Admin Registration</h1>
        <p className="text-phc-muted text-[13px] mb-6">Create a new PHC administrative account</p>

        {isSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-center border border-emerald-200">
            <p className="font-semibold mb-1">Account Registered Successfully!</p>
            <p className="text-xs">Signing in to PHC Administration...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg bg-phc-bg" 
                placeholder="Dr. Admin Officer"
                required 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Official Email / ID</label>
              <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg bg-phc-bg" 
                placeholder="admin@phc.in"
                required 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg bg-phc-bg" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-phc-blue text-white py-2.5 rounded-lg font-display font-semibold hover:bg-phc-blue-dark transition"
            >
              Register & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

