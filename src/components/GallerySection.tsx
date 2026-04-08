import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const images = [
  { src: gallery1, alt: 'Grand Wedding Hall' },
  { src: gallery2, alt: 'Wedding Ceremony' },
  { src: gallery3, alt: 'Reception Dinner Setup' },
  { src: gallery4, alt: 'Outdoor Lawn Area' },
  { src: gallery5, alt: 'Bridal Entry' },
  { src: gallery6, alt: 'DJ & Dance Floor' },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <Camera className="inline w-4 h-4 mr-1" /> Gallery
          </span>
          <h2 className="section-title mt-2">Our Gallery</h2>
          <p className="section-subtitle mt-3">Glimpses of unforgettable celebrations at Sikara Mahal</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl overflow-hidden group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                width={768}
                height={512}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
