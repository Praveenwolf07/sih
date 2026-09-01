import { useState } from "react";
import { Bell, ChevronDown, Globe, ZoomIn, X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ViewType } from "../types";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "sos",
    text: "SOS Alert: Sathya Narayanan — chest pain, Ward 3",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "stock",
    text: "Low stock: Paracetamol 500mg (45 strips remaining)",
    time: "18 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "referral",
    text: "New referral from ASHA Selvi Arumugam — Ward 3",
    time: "1 hr ago",
    unread: false,
  },
  {
    id: 4,
    type: "appointment",
    text: "Dr. Priya Sundaram ANC review due — Token #014",
    time: "2 hr ago",
    unread: false,
  },
];

const PHCLogo = () => (
  <img 
    src="https://i.pinimg.com/736x/72/08/e2/7208e2eb967adc9b101574e29d59256b.jpg" 
    alt="SeVaSetu Logo" 
    className="w-7 h-7 rounded" 
  />
);

const dotColor: Record<string, string> = {
  sos: "bg-red-500",
  stock: "bg-amber-500",
  referral: "bg-phc-blue",
  appointment: "bg-phc-green",
};

interface HeaderProps {
  onNavigate: (view: ViewType) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [lang, setLang] = useState<"en" | "hi" | "ta">("hi");
  const [fontScale, setFontScale] = useState(100);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  const cycleFontSize = () => {
    setFontScale((s) => (s >= 120 ? 100 : s + 10));
    document.documentElement.style.fontSize = `${fontScale === 120 ? 100 : fontScale + 10}%`;
  };

  const cycleLang = () => {
    setLang((l) => (l === "hi" ? "en" : l === "en" ? "ta" : "hi"));
  };

  return (
    <header className="bg-phc-surface border-b border-phc-border shadow-sm flex items-center px-5 h-16 z-40 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 w-60 flex-shrink-0">
        <PHCLogo />
        <div>
          <div className="font-display font-bold text-phc-blue text-[13px] leading-none tracking-[0.06em]">
            SeVaSetu
          </div>
          <div className="text-[10.5px] text-phc-muted leading-none mt-0.5 font-sans tracking-wide">
            PHC Management Portal
          </div>
        </div>
      </div>

      {/* PHC identity — center */}
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <div className="font-display font-semibold text-phc-text text-sm leading-none">
          Patna Rural Primary Health Centre (PHC)
        </div>
        <div className="text-[11px] text-phc-muted font-sans leading-none">
          Danapur Block &nbsp;·&nbsp; Patna District &nbsp;·&nbsp; Bihar
          &nbsp;&nbsp;
          <span className="font-mono text-phc-subtle text-[10px]">HMIS: BR-PAT-PHC-042</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Language toggle: Hindi / English / Tamil */}
        <button
          onClick={cycleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-phc-border text-[11.5px] font-medium text-phc-muted hover:bg-phc-bg hover:text-phc-text transition-colors cursor-pointer"
          title="Switch language (हिन्दी / English / தமிழ்)"
        >
          <Globe size={12} className="text-phc-blue" />
          {lang === "hi" ? (
            <span className="font-semibold text-phc-blue">हिन्दी&nbsp;<span className="text-[10px] text-phc-muted font-normal">/ EN / தமிழ்</span></span>
          ) : lang === "en" ? (
            <span className="font-semibold text-phc-blue">EN&nbsp;<span className="text-[10px] text-phc-muted font-normal">/ हिन्दी / தமிழ்</span></span>
          ) : (
            <span className="font-semibold text-phc-blue font-tamil text-[11px]">தமிழ்&nbsp;<span className="text-[10px] text-phc-muted font-normal">/ हिन्दी / EN</span></span>
          )}
        </button>

        {/* Accessibility */}
        <button
          onClick={cycleFontSize}
          className="w-8 h-8 flex items-center justify-center rounded text-phc-muted hover:bg-phc-bg hover:text-phc-text transition-colors cursor-pointer"
          title={`Font size: ${fontScale}% — click to increase`}
        >
          <ZoomIn size={15} />
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs((s) => !s);
              setShowProfile(false);
            }}
            className="relative w-8 h-8 flex items-center justify-center rounded text-phc-muted hover:bg-phc-bg hover:text-phc-text transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold font-display leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-84 bg-phc-surface border border-phc-border rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-phc-border flex items-center justify-between">
                <span className="font-display font-semibold text-phc-text text-sm">
                  Notifications
                </span>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] text-phc-blue hover:underline cursor-pointer">
                    Mark all read
                  </button>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-phc-subtle hover:text-phc-muted cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-phc-border-light last:border-0 flex gap-3 hover:bg-phc-bg cursor-pointer transition-colors ${n.unread ? "bg-phc-blue-light" : ""}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor[n.type]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] text-phc-text leading-snug">{n.text}</div>
                      <div className="text-[11px] text-phc-muted mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-phc-bg border-t border-phc-border text-center">
                <button className="text-[11.5px] text-phc-blue hover:underline cursor-pointer">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-phc-border mx-1" />

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile((s) => !s);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-phc-bg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-phc-blue flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[11px] font-display font-bold">AK</span>
            </div>
            <div className="text-left">
              <div className="text-[12.5px] font-display font-semibold text-phc-text leading-none">
                Dr. Aravind Kumar
              </div>
              <div className="text-[10.5px] text-phc-muted font-sans leading-none mt-0.5">
                Medical Officer
              </div>
            </div>
            <ChevronDown size={13} className="text-phc-subtle ml-0.5" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-phc-surface border border-phc-border rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-phc-border">
                <div className="font-display font-semibold text-phc-text text-sm">
                  Dr. Aravind Kumar
                </div>
                <div className="text-[11px] text-phc-muted mt-0.5">aravind.kumar@tnhealth.gov.in</div>
                <div className="text-[11px] text-phc-blue mt-1 font-medium">Medical Officer · MO-IN-3421</div>
              </div>
              {[
                { label: "My Profile" },
                { label: "Shift Handover" },
                { label: "Change Password" },
                { label: "Settings", action: () => { onNavigate("settings"); setShowProfile(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full text-left px-4 py-2.5 text-[12.5px] text-phc-text hover:bg-phc-bg transition-colors border-b border-phc-border-light last:border-0 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2.5 text-[12.5px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
