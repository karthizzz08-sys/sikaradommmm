import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const contactEmail = "sikaratechnology@gamil.com";
  const contactPhone = "9698678450";
  const mapsLink = "https://maps.app.goo.gl/ttyArqidAoVCNsdy5";
  const whatsappNumber = "919698678450";
  const whatsappMessage = "Hi! I'm interested in booking Sikara Mahal for my event.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer id="footer" className="bg-foreground py-12 px-4 pb-24">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl font-bold text-primary-foreground mb-3">
            Sikara Mahal A/C Wedding Hall
          </h3>
          <p className="text-primary-foreground/60 text-sm">
            Making your dream wedding come true ✨
          </p>
        </div>

        {/* Contact Details */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-primary-foreground/80 text-sm">
          <a 
            href={whatsappLink}
            className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <a 
            href={`mailto:${contactEmail}`} 
            className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className="w-4 h-4" />
            sikaratechnology@gmail.com
          </a>
          <a 
            href={`tel:${contactPhone}`}
            className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
          >
            <Phone className="w-4 h-4" />
            9698678450
          </a>
          <a 
            href={mapsLink}
            className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="w-4 h-4" />
            Location
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-primary-foreground/50 text-sm">
          <a href="#hall" className="hover:text-primary-foreground transition-colors">Hall</a>
          <a href="#photography" className="hover:text-primary-foreground transition-colors">Photography</a>
          <a href="#decoration" className="hover:text-primary-foreground transition-colors">Decoration</a>
          <a href="#salon" className="hover:text-primary-foreground transition-colors">Bridal</a>
          <a href="#catering" className="hover:text-primary-foreground transition-colors">Catering</a>
          <a href="#events" className="hover:text-primary-foreground transition-colors">Events</a>
          <a href="#dj" className="hover:text-primary-foreground transition-colors">DJ</a>
          <a href="#gallery" className="hover:text-primary-foreground transition-colors">Gallery</a>
        </div>

        {/* Copyright */}
        <p className="text-primary-foreground/30 text-xs text-center">
          © {new Date().getFullYear()}
          <a
            href="https://bench-2-bosscom.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline"
          >
            Bench2boss
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
