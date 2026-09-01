import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ViewType } from "../types";

type PortalType = "selection" | "admin" | "doctor";
type AuthMode = "register" | "login";

export default function Login({ onNavigate, onBackToWelcome }: { onNavigate: (view: ViewType) => void, onBackToWelcome: () => void }) {
  const [portal, setPortal] = useState<PortalType>("selection");
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("admin123");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, registerAdminAccount, addDoctorRegistrationRequest } = useAuth();

  const handlePortalSelect = (type: PortalType) => {
    setPortal(type);
    setAuthMode("register");
    if (type === "admin") {
      setEmailOrId("ADM-001");
      setPassword("admin123");
      setFullName("");
    } else if (type === "doctor") {
      setEmailOrId("DOC-PHC-0001");
      setPassword("doctor123");
      setFullName("");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (portal === "admin") {
        registerAdminAccount(fullName || "PHC Administrator", emailOrId || "admin@demo.sevasetu.in", password || "admin123");
        setAuthMode("login");
        setEmailOrId(emailOrId || "admin@demo.sevasetu.in");
        setPassword("admin123");
        return;
      }

      if (portal === "doctor") {
        addDoctorRegistrationRequest({
          id: `REQ-${Date.now()}`,
          name: fullName || "Doctor Applicant",
          email: emailOrId || `doctor${Date.now()}@phc.in`,
          mobile: "+91 98765 43210",
          specialization: "General Medicine",
          status: "Pending",
          createdAt: new Date(),
        });
        setAuthMode("login");
        setEmailOrId("");
        setPassword("");
        return;
      }
    } finally {
      setIsLoading(false);
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
      <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.20), rgba(255,255,255,0.20)), url('https://i.pinimg.com/736x/54/88/7a/54887ab0efe4a8441701110880da005d.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="w-full max-w-sm bg-white/90 border border-slate-200 rounded-lg p-8 shadow-sm text-center backdrop-blur-[1px]">
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
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.20), rgba(255,255,255,0.20)), url('https://i.pinimg.com/736x/54/88/7a/54887ab0efe4a8441701110880da005d.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-md bg-white/90 border border-slate-200 rounded-lg p-8 shadow-sm backdrop-blur-[1px]">
        <div className="mb-5 text-center">
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
              {portal === "admin" ? "Register first, then sign in after account creation" : "Register first and wait for admin approval before login"}
            </p>
          </div>
        </div>

        {portal !== "selection" && (
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`rounded-md px-3 py-2 text-[12px] font-display font-semibold transition ${
                authMode === "register" ? "bg-phc-blue text-white shadow-sm" : "text-phc-muted hover:text-phc-text"
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`rounded-md px-3 py-2 text-[12px] font-display font-semibold transition ${
                authMode === "login" ? "bg-phc-blue text-white shadow-sm" : "text-phc-muted hover:text-phc-text"
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {portal !== "selection" && authMode === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-phc-text uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-phc-border rounded-lg bg-phc-bg text-phc-text focus:ring-2 focus:ring-phc-blue focus:outline-none"
                placeholder={portal === "admin" ? "PHC Administrator" : "Dr. Sarah Johnson"}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-phc-text uppercase mb-1">
                {portal === "admin" ? "Official Email / ID" : "Official Email"}
              </label>
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full px-3 py-2 border border-phc-border rounded-lg bg-phc-bg text-phc-text focus:ring-2 focus:ring-phc-blue focus:outline-none"
                placeholder={portal === "admin" ? "admin@phc.in" : "doctor@phc.in"}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-phc-text uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-phc-border rounded-lg bg-phc-bg text-phc-text focus:ring-2 focus:ring-phc-blue focus:outline-none"
                placeholder="Create a secure password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-phc-blue text-white py-2.5 rounded-lg font-display font-semibold hover:bg-phc-blue-dark transition disabled:opacity-50"
            >
              {isLoading ? "Registering..." : portal === "admin" ? "Register Admin" : "Register Doctor"}
            </button>
            <div className="text-center text-[12px] text-phc-muted">
              Already registered? <button type="button" onClick={() => setAuthMode("login")} className="text-phc-blue hover:underline font-semibold">Go to Sign In</button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-4 p-2.5 bg-blue-50/90 border border-blue-200 rounded text-[11px] text-blue-900">
              <div className="font-semibold mb-1">
                {portal === "admin" ? "Admin Demo Account:" : "Doctor Demo Account:"}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>
                  ID: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">{portal === "admin" ? "ADM-001" : "DOC-PHC-0001"}</code>
                </span>
                <button 
                  type="button" 
                  onClick={() => {
                    setEmailOrId(portal === "admin" ? "ADM-001" : "DOC-PHC-0001");
                    setPassword(portal === "admin" ? "admin123" : "doctor123");
                  }}
                  className="text-blue-700 underline font-medium hover:text-blue-900"
                >
                  Autofill
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-phc-text uppercase mb-1">
                  {portal === "admin" ? "Admin ID / Official Email" : "Doctor ID / Official Email"}
                </label>
                <input 
                  type="text" 
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full px-3 py-2 border border-phc-border rounded-lg bg-phc-bg text-phc-text focus:ring-2 focus:ring-phc-blue focus:outline-none"
                  placeholder={portal === "admin" ? "ADM-001 or admin@demo.sevasetu.in" : "DOC-PHC-0001"}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-phc-text uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-phc-border rounded-lg bg-phc-bg text-phc-text focus:ring-2 focus:ring-phc-blue focus:outline-none"
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
                <button type="button" onClick={() => setAuthMode("register")} className="block w-full text-phc-blue hover:underline font-semibold">Need to register first?</button>
                <button type="button" onClick={() => setPortal("selection")} className="block w-full underline hover:text-phc-text">Back to Selection</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

