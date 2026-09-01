import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ViewType } from "../types";

type PortalType = "selection" | "admin" | "doctor";

export default function Login({ onNavigate, onBackToWelcome }: { onNavigate: (view: ViewType) => void, onBackToWelcome: () => void }) {
  const [portal, setPortal] = useState<PortalType>("selection");
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();

  const handlePortalSelect = (type: PortalType) => {
    setPortal(type);
    if (type === "admin") {
      setEmailOrId("ADM-001");
      setPassword("admin123");
    } else if (type === "doctor") {
      setEmailOrId("DOC-PHC-0001");
      setPassword("doctor123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(emailOrId, password);
    } finally {
      setIsLoading(false);
    }
  };

  if (portal === "selection") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-phc-bg p-4" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://i.pinimg.com/736x/18/34/18/1834186c75c9142cb6c571f5fbb141d3.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="w-full max-w-sm bg-phc-surface border border-phc-border rounded-lg p-8 shadow-sm text-center">
          <button onClick={onBackToWelcome} className="mb-4 text-phc-muted hover:text-phc-text underline text-sm">
            ← Back to Welcome
          </button>
          <img 
            src="https://i.pinimg.com/736x/72/08/e2/7208e2eb967adc9b101574e29d59256b.jpg" 
            alt="SeVaSetu Logo" 
            className="w-16 h-16 mx-auto rounded-full mb-2" 
          />
          <h1 className="font-display font-bold text-2xl text-phc-blue mb-2">SEVASETU</h1>
          <p className="text-phc-muted text-[13px] mb-8">PHC Management Portal</p>
          <div className="space-y-4">
            <button onClick={() => handlePortalSelect("admin")} className="w-full bg-phc-blue text-white py-3 rounded-lg font-display font-semibold hover:bg-phc-blue-dark shadow-sm transition">
              PHC Administration
            </button>
            <button onClick={() => handlePortalSelect("doctor")} className="w-full bg-phc-surface border border-phc-blue text-phc-blue py-3 rounded-lg font-display font-semibold hover:bg-phc-bg shadow-sm transition">
              Doctor Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-phc-bg p-4" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://i.pinimg.com/736x/18/34/18/1834186c75c9142cb6c571f5fbb141d3.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-sm bg-phc-surface border border-phc-border rounded-lg p-8 shadow-sm">
        <div className="mb-6 text-center">
          <img 
            src="https://i.pinimg.com/736x/72/08/e2/7208e2eb967adc9b101574e29d59256b.jpg" 
            alt="SeVaSetu Logo" 
            className="w-16 h-16 mx-auto rounded-full mb-3" 
          />
          <h1 className="font-display font-bold text-2xl text-phc-blue">SEVASETU</h1>
          <p className="text-phc-muted text-[13px] mt-1">PHC Management Portal</p>
          <div className="mt-4 border-t border-phc-border pt-4">
            <h2 className="font-display font-semibold text-lg text-phc-text">
              {portal === "admin" ? "PHC Administration" : "Doctor Portal"}
            </h2>
            <p className="text-phc-muted text-[12px] mt-1">
              {portal === "admin" ? "Authorized PHC administrators only" : "Authorized medical professionals only"}
            </p>
          </div>
        </div>

        {/* Quick Demo Credentials helper */}
        <div className="mb-4 p-2.5 bg-blue-50/80 border border-blue-200 rounded text-[11px] text-blue-900">
          <div className="font-semibold mb-1">
            {portal === "admin" ? "Admin Demo Account:" : "Doctor Demo Account:"}
          </div>
          <div className="flex items-center justify-between">
            <span>
              ID: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">{portal === "admin" ? "ADM-001" : "DOC-PHC-0001"}</code>
            </span>
            <button 
              type="button" 
              onClick={() => {
                setEmailOrId(portal === "admin" ? "ADM-001" : "DOC-PHC-0001");
                setPassword("admin123");
              }}
              className="text-blue-700 underline font-medium hover:text-blue-900"
            >
              Autofill
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">
              {portal === "admin" ? "Admin ID / Official Email" : "Doctor ID / Official Email"}
            </label>
            <input 
              type="text" 
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-phc-bg focus:ring-2 focus:ring-phc-blue focus:outline-none"
              placeholder={portal === "admin" ? "ADM-001 or admin@demo.sevasetu.in" : "DOC-PHC-0001"}
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-phc-bg focus:ring-2 focus:ring-phc-blue focus:outline-none"
              required
            />
          </div>
          
          {error && <div className="text-red-600 text-[12px] p-2 bg-red-50 rounded border border-red-200">{error}</div>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-phc-blue text-white py-2.5 rounded-lg font-display font-semibold hover:bg-phc-blue-dark transition disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          
          <div className="text-center text-[12px] space-y-2 mt-4 text-phc-muted">
            <div className="block">
              {portal === "admin" && (
                <button type="button" onClick={() => onNavigate("register-admin")} className="text-phc-blue hover:underline">Register Admin</button>
              )}
              {portal === "doctor" && (
                <button type="button" onClick={() => onNavigate("register-doctor")} className="text-phc-blue hover:underline">Register Doctor (Admin Approved Only)</button>
              )}
            </div>
            <button type="button" onClick={() => setPortal("selection")} className="block w-full underline hover:text-phc-text">Back to Selection</button>
          </div>
        </form>
      </div>
    </div>
  );
}

