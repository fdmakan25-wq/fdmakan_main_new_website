'use client';

import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home' },
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
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navigation after scrolling past hero section, hide when footer is visible
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      const footerSection = document.getElementById('footer');

      if (heroSection && footerSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const footerTop = footerSection.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;

        // Show sidebar if past hero and not at footer
        const pastHero = window.scrollY > heroBottom - 100;
        const beforeFooter = scrollPosition < footerTop - 50;

        setIsVisible(pastHero && beforeFooter);
      } else if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 100);
      }

      // Determine active section based on scroll position
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      })).filter(section => section.element !== null);

      const scrollPosition = window.scrollY + 250; // Offset for better detection

      // Find the section currently in view
      let currentSection = 'hero';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const sectionTop = section.element.offsetTop;
          const sectionHeight = section.element.offsetHeight;
          if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header
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
    <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block sidebar-slide-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-gray-100 p-3">
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                relative px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 text-left
                ${activeSection === item.id
                  ? 'bg-brand-red text-white shadow-md scale-105'
                  : 'text-gray-600 hover:text-brand-red hover:bg-brand-red/10'
                }
              `}
              title={item.label}
            >
              <span className="block whitespace-nowrap">{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-1.5 h-8 bg-brand-red rounded-r-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

