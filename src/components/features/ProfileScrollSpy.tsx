'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#sejarah', label: 'Sejarah' },
  { href: '#visi-misi', label: 'Visi & Misi' },
  { href: '#geografi', label: 'Geografi & Demografi' },
  { href: '#padukuhan', label: 'Padukuhan & Fasilitas' },
];

export default function ProfileScrollSpy() {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            linkRefs.current.forEach((link) => {
              if (!link) return;
              const dot = link.querySelector('span');
              link.classList.remove('text-primary', 'font-body-bold');
              dot?.classList.remove('bg-primary');
              dot?.classList.add('bg-outline-variant');

              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('text-primary', 'font-body-bold');
                dot?.classList.remove('bg-outline-variant');
                dot?.classList.add('bg-primary');
              }
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <nav className="sticky top-40 flex flex-col gap-2 p-6 bg-surface/80 backdrop-blur-xl shadow-sm rounded-xl">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
          Navigasi Profil
        </h3>
        {navLinks.map((item, i) => (
          <a
            key={item.href}
            ref={(el) => { linkRefs.current[i] = el; }}
            href={item.href}
            className="spy-link text-body-base font-body-base text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant group-hover:bg-primary transition-colors shrink-0" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
