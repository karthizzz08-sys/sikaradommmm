import { MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const contactPhone = "9698678450";
  const whatsappNumber = "919698678450"; // WhatsApp format: country code + number
  const whatsappMessage = "Hi! I'm interested in booking Sikara Mahal for my event.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Options Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-card border border-border rounded-lg shadow-lg p-3 space-y-2 w-56 animate-in fade-in zoom-in-95 duration-200">
            {/* WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/10 transition-colors text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              <p className="font-medium text-sm">Enquiry</p>
            </a>

            {/* Phone Call */}
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/10 transition-colors text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="w-5 h-5 text-blue-500" />
              <p className="font-medium text-sm">Call Us</p>
            </a>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-primary via-purple-500 to-primary hover:shadow-lg shadow-lg rounded-full w-14 h-14 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          aria-label="Contact options"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingContactWidget;
