'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
/** Progressive enhancement: the page remains fully visible without JavaScript. */
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let teardown = () => {};
    function setup() {
      teardown();
      if (reduced.matches) return;
      const cleanups: Array<() => void> = [];
      const sections = document.querySelectorAll<HTMLElement>('.section-top,.service-card,.about-copy,.office,.work-card,.step,.testimonial-inner,.cta,.footer-grid,.detail-panel,.delivery-card,.article-card,.project-card');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });
      sections.forEach((el, index) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('reveal-ready');
          el.style.setProperty('--reveal-delay', `${Math.min(index % 5, 3) * 65}ms`);
          observer.observe(el);
        }
      });
      cleanups.push(() => { observer.disconnect(); sections.forEach(el => el.classList.remove('reveal-ready', 'revealed')); });
      if (finePointer.matches) {
        document.querySelectorAll<HTMLElement>('.service-card,.work-card,.hero-stage').forEach(el => {
          let frame = 0;
          const move = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return;
            const rect = el.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
              el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
              el.style.setProperty('--mx', `${x * 100}%`);
              el.style.setProperty('--my', `${y * 100}%`);
              el.classList.add('is-tilting');
            });
          };
          const leave = () => {
            cancelAnimationFrame(frame);
            el.style.setProperty('--rx', '0deg');
            el.style.setProperty('--ry', '0deg');
            el.classList.remove('is-tilting');
          };
          el.addEventListener('pointermove', move, { passive: true });
          el.addEventListener('pointerleave', leave);
          cleanups.push(() => { leave(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
        });
      }
      teardown = () => cleanups.forEach(fn => fn());
    }
    setup();
    reduced.addEventListener('change', setup);
    finePointer.addEventListener('change', setup);
    return () => { teardown(); reduced.removeEventListener('change', setup); finePointer.removeEventListener('change', setup); };
  }, [pathname]);
  return null;
}
