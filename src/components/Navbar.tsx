import { useState } from 'react';
import { Menu, X, Home, Building2, Camera, Palette, Sparkles, Crown, PartyPopper, Music, CalendarCheck, UtensilsCrossed, Image, Phone, Mail, MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const contactPhone = "9698678450";
  const contactEmail = "sikaratechnology@gamil.com";
  const whatsappNumber = "919698678450";
  const whatsappMessage = "Hi! I'm interested in booking Sikara Mahal for my event.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  const links = [
    { href: '#', label: 'Home', icon: Home },
    { href: '#availability', label: 'Availability', icon: CalendarCheck },
    { href: '#hall', label: 'Hall', icon: Building2 },
    { href: '#photography', label: 'Photography', icon: Camera },
    { href: '#decoration', label: 'Decoration', icon: Palette },
    { href: '#salon', label: 'Bridal', icon: Crown },
    { href: '#catering', label: 'Catering', icon: UtensilsCrossed },
    { href: '#events', label: 'Events', icon: PartyPopper },
    { href: '#dj', label: 'DJ', icon: Music },
    { href: '#gallery', label: 'Gallery', icon: Image },
    { href: '#booking', label: 'Book Now', icon: CalendarCheck },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-6xl mx-auto flex items-center justify-between py-2 px-4">
        <a href="#" className="flex flex-col">
          <span className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent tracking-tight">
            Sikara Mahal
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-[0.2em] uppercase">
            Luxury Wedding Hall
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-4">
            {links.map((l) => (
              <a key={l.href + l.label} href={l.href} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                <l.icon className="w-3.5 h-3.5" />
                {l.label}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-border">
            <a 
              href="#footer"
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              title="Contact us"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Contact</span>
            </a>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden p-2 text-foreground hover:text-primary transition-colors" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card">
            <div className="flex flex-col mb-6">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                Sikara Mahal
              </span>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Luxury Wedding Hall</span>
            </div>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex flex-col gap-1 mb-6">
              {links.map((l) => (
                <a key={l.href + l.label} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/50 px-4 py-3 rounded-lg transition-colors">
                  <l.icon className="w-5 h-5" />
                  {l.label}
                </a>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">Contact</p>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                Contact
              </a>
              <a 
                href={`tel:${contactPhone}`}
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <Phone className="w-5 h-5" />
                Contact
              </a>
              <a 
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <Mail className="w-5 h-5" />
                Contact
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
