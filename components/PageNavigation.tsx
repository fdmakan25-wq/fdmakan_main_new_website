'use client';

import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'top-selling', label: 'Top Selling' },
  { id: 'newly-launched', label: 'Newly Launched' },
  { id: 'premium-projects', label: 'Premium Projects' },
  { id: 'top-picks', label: 'Top Picks' },
  { id: 'recent-blogs', label: 'Recent Blogs' },
  { id: 'featured-developers', label: 'Developers' },
  { id: 'stats', label: 'Statistics' },
  { id: 'about', label: 'About Us' },
];

export default function PageNavigation() {
  const [activeSection, setActiveSection] = useState('top-selling');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      const footerSection = document.getElementById('footer');

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const heroHeight = heroSection?.offsetHeight || 600;

      // Show sidebar once scrolled past the hero section (300px threshold)
      const pastHero = scrollY > 280;

      // Hide sidebar before overlapping with footer
      let beforeFooter = true;
      if (footerSection) {
        const footerRect = footerSection.getBoundingClientRect();
        // If top of footer is near the middle of viewport, hide sidebar
        beforeFooter = footerRect.top > windowHeight / 2;
      }

      setIsVisible(pastHero && beforeFooter);

      // Determine active section using getBoundingClientRect
      const midScreen = windowHeight * 0.35;
      let currentSection = navItems[0].id;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section top is above middle of the screen and bottom is below top
          if (rect.top <= midScreen && rect.bottom >= midScreen) {
            currentSection = item.id;
            break;
          } else if (rect.top <= midScreen) {
            currentSection = item.id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <nav 
      aria-label="Section navigation"
      className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-300 pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-2 max-h-[85vh] overflow-y-auto scrollbar-hide">
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`
                group relative px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-200 text-left cursor-pointer flex items-center justify-between gap-2
                ${activeSection === item.id
                  ? 'bg-brand-red text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-brand-red hover:bg-slate-50'
                }
              `}
              title={item.label}
            >
              <span className="block whitespace-nowrap text-[11px] leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

