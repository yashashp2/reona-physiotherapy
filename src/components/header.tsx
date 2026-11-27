'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { practice } from '@/config/practice';
const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/services', 'Services'],
  ['/pricing', 'Pricing'],
  ['/contact', 'Contact'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header">
      <div
        className="container nav-wrap"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <Link
          href="/"
          className="brand"
          aria-label={`${practice.brand} home`}
          onClick={() => setOpen(false)}
        >
          <span>
            {practice.name}
            <span className="brand-dot">.</span>
          </span>
          <small>PHYSIOTHERAPY</small>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          className={open ? 'navigation is-open' : 'navigation'}
          aria-label="Main navigation"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link className="button nav-book" href="/book" onClick={() => setOpen(false)}>
            Book an Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
