import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const videos = [
  { src: '/videos/d1.mp4', title: 'DJ Performance 1' },
  { src: '/videos/d2.mp4', title: 'DJ Performance 2' },
  { src: '/videos/d3.mp4', title: 'DJ Performance 3' },
  { src: '/videos/d4.mp4', title: 'DJ Performance 4' },
  { src: '/videos/v2.mp4', title: 'DJ Performance 5' },
  { src: '/videos/v3.mp4', title: 'DJ Performance 6' },
];

const DJSection = () => {
  return (
    <section id="dj" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <Music className="inline w-4 h-4 mr-1" /> Entertainment
          </span>
          <h2 className="section-title mt-2">DJ & Dance Floor</h2>
          <p className="section-subtitle mt-3">Electrifying performances to light up your celebration</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl overflow-hidden glass-card"
            >
              <video
                src={v.src}
                controls
                preload="metadata"
                className="w-full h-48 sm:h-56 object-cover bg-foreground/10"
                playsInline
              />
              <div className="p-4">
                <p className="font-display font-bold text-foreground flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary" /> {v.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DJSection;
