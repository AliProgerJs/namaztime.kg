import { AnimatePresence, motion } from "framer-motion";

export default function ModeFlash({ label, show }: { label: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ width: 0, height: 0, borderRadius: "9999px", scale: 0 }} animate={{ width: "80%", height: "40%", scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="bg-[#faf7f7d7] shadow-xl rounded-3xl flex items-center justify-center">
            <div className="text-3xl md:text-5xl font-semibold tracking-wide">{label}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}