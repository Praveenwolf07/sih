import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ViewType } from "../types";

export default function RegisterDoctor({ onNavigate }: { onNavigate: (view: ViewType) => void }) {
  const { addDoctorRegistrationRequest } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", specialization: "", password: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctorRegistrationRequest({
      id: `REQ-${Date.now()}`,
      ...formData,
      status: "Pending",
      createdAt: new Date(),
    });
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-phc-bg p-4" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://i.pinimg.com/736x/18/34/18/1834186c75c9142cb6c571f5fbb141d3.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-md bg-phc-surface border border-phc-border rounded-lg p-8 shadow-sm">
        <button 
          onClick={() => onNavigate("dashboard")} 
          className="mb-4 text-phc-muted hover:text-phc-text underline text-sm block"
        >
          ← Back to Sign In
        </button>
        <h1 className="font-display font-bold text-2xl text-phc-blue mb-1">Doctor Registration</h1>
        <p className="text-phc-muted text-[13px] mb-6">Subject to PHC Administrator approval</p>

        {isSubmitted ? (
          <div className="p-4 bg-blue-50 text-blue-900 rounded-lg text-center border border-blue-200 space-y-3">
            <p className="font-semibold text-sm">Registration Request Submitted!</p>
            <p className="text-xs text-blue-700">Your application is pending review by the PHC Administrator. Once approved, you will be assigned a Doctor ID to sign in.</p>
            <button 
              onClick={() => onNavigate("dashboard")} 
              className="mt-3 px-4 py-1.5 bg-phc-blue text-white text-xs rounded hover:bg-phc-blue-dark"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-phc-bg" placeholder="Dr. Sarah Johnson" required /></div>
            <div><label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Official Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-phc-bg" placeholder="doctor@phc.in" required /></div>
            <div><label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Mobile Number</label><input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-phc-bg" placeholder="+91 98765 43210" required /></div>
            <div><label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Specialization</label><input type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-phc-bg" placeholder="General Physician / Obstetrics" required /></div>
            <div><label className="block text-[11px] font-bold text-phc-muted uppercase mb-1">Password</label><input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-phc-bg" required /></div>
            <button type="submit" className="w-full bg-phc-blue text-white py-2.5 rounded-lg font-display font-semibold hover:bg-phc-blue-dark transition">Submit for Admin Approval</button>
          </form>
        )}
      </div>
    </div>
  );
}

