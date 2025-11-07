Responsive QA Checklist — The Joseph-Marie Foundation

Scope: mobile (320–480), small tablet (481–768), tablet (769–1024), desktop (1025–1440), large (1441+)

1. Hero
- [ ] Headline scales readable on all sizes (no overflow).
- [ ] CTA buttons stack on small screens and are side-by-side on larger screens.
- [ ] Background image loads lazily and does not block content paint.
- [ ] Spark micro-interaction triggers and is not visually jarring.

2. Pricing Cards
- [ ] Grid adapts: single column mobile, 2 columns on small tablets, 4 columns on large screens.
- [ ] Card actions are reachable and have tap-friendly sizes (min 44x44px).
- [ ] Micro-interaction spark triggers on Get Started and does not block navigation.

3. Dashboards
- [ ] Cards wrap correctly on mobile; spacing preserved.
- [ ] CTA buttons show micro-interactions and toasts.
- [ ] Workspace navigation is accessible via keyboard.

4. Newsletter
- [ ] Subscribe input and button are accessible and show success toast.
- [ ] Confirmation email contains functional unsubscribe link.

5. Performance
- [ ] Hero image uses lazy loading and appropriate srcset (check network waterfall).
- [ ] Main fonts and critical CSS are loaded quickly (check Lighthouse).

6. Accessibility
- [ ] Modal is focus-trapped and dismissible via Esc.
- [ ] Buttons have aria-labels when icons-only.
- [ ] Color contrast meets WCAG AA for text.

7. Visual checks
- [ ] Run on iPhone SE, iPhone 13, Pixel 5, iPad, and desktop 1366x768.
- [ ] Verify animations respect reduced-motion preference.

How to capture screenshots (suggested):
- Use browser devtools devices and capture full page screenshots.
- Save screenshots in /qa/screenshots/<device>-<page>.png

Notes:
- If any visual issues found, list the component, device, and suggested CSS adjustments.
