import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-wedding.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img src={heroImg} alt="Sikara Mahal Wedding Hall" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className="text-primary-foreground/80 font-body text-sm tracking-[0.3em] uppercase mb-4">Welcome to</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-4 leading-tight">Sikara Mahal</h1>
          <p className="text-primary-foreground/90 font-display text-xl md:text-2xl italic mb-2">A/C Wedding Hall</p>
          <p className="text-primary-foreground/70 font-body text-base md:text-lg mt-6 max-w-xl mx-auto">
            Your dream wedding, our grand venue. Complete packages for halls, photography, decoration, salon & events.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#hall" className="gradient-violet px-8 py-4 rounded-full text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow">
            Explore Packages
          </a>
          <a href="#availability" className="border-2 border-primary-foreground/30 px-8 py-4 rounded-full text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-colors">
            Check Availability
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
