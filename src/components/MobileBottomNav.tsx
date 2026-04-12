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
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 dark:from-slate-900 dark:via-slate-850 dark:to-slate-800 backdrop-blur-lg border-t-2 border-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-2xl shadow-purple-900/20">
        <div className="flex items-center justify-around px-1 py-3 gap-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href + link.label}
                href={link.href}
                className="flex flex-col items-center gap-1 px-2.5 py-2.5 text-muted-foreground hover:text-white transition-colors rounded-xl group relative"
                title={link.label}
              >
                {/* Glow background on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className="relative z-10">
                  <Icon className="w-6 h-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300" />
                </div>
                
                {/* Label */}
                <span className="text-[11px] font-bold text-center truncate max-w-[2.5rem] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 relative z-10">
                  {link.label}
                </span>

                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
