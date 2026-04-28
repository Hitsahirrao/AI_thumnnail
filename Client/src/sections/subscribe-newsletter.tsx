import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function SubscribeNewsletter() {
    const navigate = useNavigate()
    return (
        <section className="flex flex-col items-center">
            <SectionTitle title="Ready to go viral?" description="Join thousands of creators using AI to boost their CTR." />
            <motion.div className="flex items-center justify-center mt-10 border border-slate-700 focus-within:outline focus-within:outline-indigo-600 text-sm rounded-full h-14 max-w-xl w-full"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
                <button onClick={()=> navigate('/generate')} className="bg-indigo-600 text-white rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition">
                    Generate Free Thumbnail
                </button>
            </motion.div>
        </section>
    );
}