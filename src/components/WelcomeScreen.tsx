import { motion } from "motion/react";
import { HeartPulse, Users, ClipboardList, Stethoscope, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/c4/1a/4d/c41a4dcdc880f1c2c51129b2c617b22a.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <img 
            src="https://i.pinimg.com/736x/72/08/e2/7208e2eb967adc9b101574e29d59256b.jpg" 
            alt="SeVaSetu Logo" 
            className="w-16 h-16 rounded-full" 
          />
        </div>
        <h1 className="font-display font-bold text-4xl text-phc-blue mb-2">SeVaSetu</h1>
        <p className="text-phc-muted text-lg mb-6">PHC Management Portal</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl text-phc-text font-semibold italic mb-12"
      >
        “Connecting Care. Strengthening Communities.”
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-phc-border mb-12"
      >
        <h2 className="text-2xl font-display font-bold text-phc-text mb-6">Welcome to SeVaSetu</h2>
        <p className="text-phc-muted mb-8">Your digital gateway to Primary Health Centre care and coordination.</p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-phc-blue mb-3" />
            <p className="text-sm">Connect patients, ASHA workers and doctors</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ClipboardList className="w-8 h-8 text-phc-blue mb-3" />
            <p className="text-sm">Manage PHC care, cases and referrals efficiently</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Stethoscope className="w-8 h-8 text-phc-blue mb-3" />
            <p className="text-sm">Support timely and accessible healthcare services</p>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="bg-phc-blue text-white px-8 py-4 rounded-full font-display font-semibold text-lg flex items-center gap-2 hover:bg-phc-blue-dark transition-colors shadow-lg"
      >
        Let’s Get Started <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
