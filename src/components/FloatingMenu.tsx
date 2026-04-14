import { Menu, X, Home, Building2, Camera, Palette, Sparkles, Utensils, Music, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSectionActive, setIsSectionActive] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const sectionIds = ['hall', 'photography', 'decorations', 'salon', 'catering', 'dj', 'gallery'];
    
    const observer = new IntersectionObserver((entries) => {
      const isAnySectionVisible = entries.some(entry => entry.isIntersecting);
      setIsSectionActive(isAnySectionVisible);
    }, {
      threshold: 0.01,
      rootMargin: '0px',
    });

    // Wait a bit for DOM to fully render before observing
    setTimeout(() => {
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  const menuItems = [
    { icon: Home, label: 'Home', sectionId: '#' },
    { icon: Building2, label: 'Hall Booking', sectionId: 'hall' },
    { icon: Camera, label: 'Photography', sectionId: 'photography' },
    { icon: Palette, label: 'Decorations', sectionId: 'decorations' },
    { icon: Sparkles, label: 'Salon', sectionId: 'salon' },
    { icon: Utensils, label: 'Catering', sectionId: 'catering' },
    { icon: Music, label: 'DJ/Music', sectionId: 'dj' },
    { icon: ImageIcon, label: 'Gallery', sectionId: 'gallery' },
  ];

  const handleNavigate = (sectionId: string) => {
    setIsOpen(false);
    if (sectionId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!isMobile || !isSectionActive) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-40 right-8 z-40">
        {/* Menu Options */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 space-y-2 animate-in fade-in zoom-in-95 duration-300">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigate(item.sectionId)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 text-foreground group border border-transparent hover:border-primary/30 active:scale-95 backdrop-blur-sm"
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/30 to-blue-500/30 group-hover:from-primary/50 group-hover:to-blue-500/50 transition-all duration-200">
                  <item.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors duration-200 whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-gradient-to-br from-primary via-purple-500 to-blue-600 shadow-2xl shadow-primary/40 rounded-full w-14 h-14 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:shadow-primary/60 border-2 border-primary/50 active:scale-95 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-label="Navigation menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingMenu;
