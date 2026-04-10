import { Home, Calendar, Building2, Camera, Palette, UtensilsCrossed, Phone } from 'lucide-react';

const MobileBottomNav = () => {
  const links = [
    { href: '#', label: 'Home', icon: Home },
    { href: '#availability', label: 'Available', icon: Calendar },
    { href: '#hall', label: 'Hall', icon: Building2 },
    { href: '#photography', label: 'Photos', icon: Camera },
    { href: '#decoration', label: 'Decor', icon: Palette },
    { href: '#catering', label: 'Food', icon: UtensilsCrossed },
    { href: '#booking', label: 'Book', icon: Phone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.href + link.label}
              href={link.href}
              className="flex flex-col items-center gap-1 px-2 py-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent/50"
              title={link.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium text-center truncate max-w-[2.5rem]">{link.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
