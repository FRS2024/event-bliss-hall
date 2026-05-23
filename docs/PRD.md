# EasyHall — Product Requirements Document (PRD)

**Product Name:** EasyHall
**Tagline:** Algeria's trusted marketplace for booking event venues.
**Document Version:** 1.0
**Owner:** EasyHall Product Team
**Last Updated:** May 2026
**Status:** Active Development

---

## 1. Executive Summary

EasyHall is a web-based, mobile-first marketplace that connects people planning events (weddings, engagements, birthdays, corporate gatherings, conferences) with verified venue owners across Algeria's 48 wilayas. The platform removes the friction of phone-based, word-of-mouth venue discovery by providing transparent pricing, real-time availability, instant booking, and integrated host communication (including WhatsApp).

The product addresses three core market gaps in Algeria:
1. **Discovery** — there is no centralized, trustworthy database of event venues.
2. **Trust** — booking large-ticket venues (often 100,000–500,000 DA) is done blindly, with frequent hidden fees and no verification.
3. **Convenience** — the booking process today requires multiple phone calls, physical visits, and cash deposits with no protection.

EasyHall is built as a bilingual (Arabic / French / English), RTL-aware, Lovable Cloud–backed React application designed for the cultural, linguistic, and payment expectations of the Algerian market.

---

## 2. Vision & Mission

**Vision:** Become the default booking layer for every event venue in North Africa, starting with Algeria.

**Mission:** Empower Algerian hosts to monetize their venues and empower guests to plan celebrations with full price transparency, verified trust signals, and a delightful mobile experience.

**North Star Metric:** Confirmed bookings per month (GMV).

---

## 3. Goals & Success Metrics

### 3.1 Business Goals (Year 1)
| Goal | Target |
|---|---|
| Active listed venues | 1,500+ |
| Verified hosts | 800+ |
| Monthly active users (MAU) | 50,000+ |
| Confirmed bookings / month | 2,000+ |
| GMV / month | 250M DA+ |
| Take rate | 5–8% |

### 3.2 Product KPIs
- Search → venue detail click-through: **≥ 35%**
- Venue detail → booking start: **≥ 12%**
- Booking start → confirmed booking: **≥ 45%**
- Host response time median: **< 2 hours**
- Mobile Lighthouse performance: **≥ 85**
- Bilingual session split: target 60% AR / 30% FR / 10% EN

### 3.3 Trust KPIs
- Verified-host coverage: **≥ 70%** of active listings
- Average venue rating: **≥ 4.5**
- Dispute rate: **< 1.5%** of confirmed bookings

---

## 4. Target Users & Personas

### 4.1 Guest — "Yacine, Groom-to-be" (Primary)
- 28, lives in Algiers, planning a 250-guest wedding.
- Mobile-first (Android, mid-range device, 4G).
- Speaks Arabic + French, reads both.
- Wants: transparent pricing, photos, WhatsApp contact, ability to visit before paying.
- Pain points: hidden fees, fake listings, deposits lost to scams.

### 4.2 Host — "Madame Amina, Venue Owner" (Primary)
- 45, owns a wedding hall in Oran (capacity 300).
- Currently books via Facebook + word of mouth.
- Wants: predictable bookings, calendar control, payout transparency, fewer time-wasters.
- Pain points: managing the calendar, screening serious guests, no-shows.

### 4.3 Corporate Planner (Secondary)
- HR / event manager booking conferences, seminars, gala dinners.
- Cares about invoicing (VAT), capacity, AV equipment, parking.

### 4.4 Admin / Operator (Internal)
- EasyHall staff verifying hosts, moderating listings, resolving disputes, running analytics.

---

## 5. Scope

### 5.1 In Scope (v1.0)
- Bilingual + RTL marketplace (AR / FR / EN)
- Venue listings with rich media, pricing tiers, availability
- Search, filter, and map-aware discovery (wilaya-based)
- Authentication (email + role: guest / host / admin)
- Booking requests + instant booking + calendar
- Host dashboard (venues, bookings, messages, availability, settings)
- Admin dashboard (users, venues, bookings, content, analytics, moderation)
- In-app messaging + WhatsApp deep-link
- Reviews & ratings
- Static content: How It Works, FAQ, Contact, Legal pages
- Email notifications (transactional)
- Performance: lazy loading, scroll reveal, accessible motion

### 5.2 Out of Scope (v1.0, planned for v1.x / v2)
- In-app card / CCP / Baridimob payments (manual deposit for v1)
- Native iOS / Android apps (PWA only)
- Multi-country expansion (Tunisia, Morocco)
- AI-powered venue recommendations
- Virtual tours / 360° media
- Supplier marketplace (catering, photography, decor)

---

## 6. Full Feature Description

### 6.1 Public Marketplace

#### 6.1.1 Homepage (`/`)
- **Hero section** with Ken Burns background, staggered headline reveal, glassmorphic search box (location, event type, guest count, date), and trust badge row ("10,000+ Happy Hosts • 98% Satisfaction").
- **StatsBar** — always-visible 4-stat row with animated count-up on first view (Happy Hosts, Bookings, Satisfaction, Host Earnings).
- **Featured venues carousel** — curated high-quality listings with scroll-reveal.
- **How It Works** — 3-step explainer (Search → Book → Celebrate).
- **Premium Host section** — CTA for hosts to list venues, benefits grid, testimonials carousel, venue showcase.
- **Footer** — multi-column links, language toggle, social, legal.

#### 6.1.2 Venues Listing (`/venues`)
- Server-side paginated grid with skeleton shimmer loading.
- **Filters**: city/wilaya, category, capacity range, price range (DA), event type, features (Wi-Fi, parking, AC, catering kitchen, stage, etc.), rating.
- **Sort**: relevance, price asc/desc, rating, newest.
- **VenueCard**: image carousel with mobile-visible dots, favorite (heart), category tag, name + location + capacity, "From X DA / day" pricing, ⭐ rating, "Instant Confirmation" badge, primary "Book This Venue" CTA, secondary WhatsApp contact CTA.
- Lazy loading: first 3 cards eager, rest lazy via IntersectionObserver (300px rootMargin).
- Empty state with illustration + actionable suggestions.

#### 6.1.3 Venue Detail (`/venues/:id`)
- Full image gallery + lightbox.
- Name, verified badge, rating, review count, address (with map embed), capacity range.
- Tabs / sections: Description, Features, Pricing tiers (hour / day / event), Availability calendar (dual-month), Reviews, Host info.
- Sticky booking CTA on mobile.
- WhatsApp + in-app message buttons.
- Itemized price preview (venue rental, security deposit, service fee, VAT 19%).

#### 6.1.4 Categories (`/categories`)
Browseable by 15 categories: Wedding Hall, Conference Room, Restaurant & Café, Outdoor Garden, Event Center, Hotel & Resort, Cultural Center, Sports Facility, Private Villa, Rooftop & Terrace, Banquet Hall, Community Center, Art Gallery, Theater, Beach Club.

#### 6.1.5 Static Pages
- `/how-it-works`, `/faq`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`.

### 6.2 Authentication & Roles

- Email + password sign-up (`/signup`) with role selection (`/role-selection`): **guest** or **host**.
- Login (`/login`) with redirect based on role (`useRoleRedirect`).
- Roles stored in a dedicated `user_roles` table (never on profile) with `has_role()` SECURITY DEFINER function — protects against RLS recursion and privilege escalation.
- Three roles: `guest`, `host`, `admin`.
- Profile management with avatar upload (`/settings`, `AvatarUpload`).
- Password reset, email verification, session refresh.

### 6.3 Booking Flow

1. Guest selects date(s), time slot, and guest count on venue detail.
2. `BookingForm` modal opens with **itemized breakdown**:
   - Venue rental (rate × duration)
   - Security deposit
   - Service fee (5%)
   - VAT (19%)
   - **Total in DA**
3. Trust panel: free-cancellation deadline, host response SLA, WhatsApp support.
4. Submit → booking status `pending` → host notified.
5. Host accepts → status `confirmed` → guest notified (email + in-app).
6. Pre-event: reminders. Post-event: status `completed` → review prompt.
7. Cancellations: status `cancelled` with policy enforcement.

### 6.4 Messaging

- Real-time chat between guest ↔ host (`/messages`).
- Per-venue threads, unread indicators, mobile-optimized layout (`MobileChatLayout`).
- Contact form fallback for non-logged-in inquiries.
- Welcome state, file/image attachments (roadmap).

### 6.5 Host Dashboard (`/dashboard`)

| Module | Purpose |
|---|---|
| Overview | KPIs: views, inquiries, bookings, revenue MTD |
| Venues | List, add, edit, delete venues |
| Add / Edit Venue | Multi-section form: Basic Info → Location (wilaya + lat/lng) → Pricing tiers → Features → Images |
| Bookings | Accept / decline / mark complete, filter by status |
| Availability | Block dates, set seasonal unavailability (`UnavailabilityForm`, `VenueAvailability`) |
| Messages | Unified inbox |
| Settings | Profile, payout info, notification prefs |

### 6.6 Admin Dashboard (`/admin`)

| Module | Purpose |
|---|---|
| Overview | Platform KPIs, real-time activity feed |
| Users | All / Guests / Hosts / Verification / Analytics |
| Venues | Active / Pending Approval / Flagged / Categories / Quality Scoring |
| Bookings | All / Disputes / Revenue / Analytics |
| Communications | Announcements, contact submissions |
| Content | Homepage sections, content pages, FAQs, testimonials |
| Moderation | Reported listings / users / reviews |
| Operations | Bulk operations, exports |
| Analytics | Cross-platform analytics |
| Settings | Platform configuration |

### 6.7 Internationalization (i18n)

- Languages: **Arabic (default for .dz traffic), French, English**.
- JSON resource files: `src/locales/{ar,fr,en}.json`.
- RTL provider (`RTLProvider`) flips layout for AR; logical CSS properties (`start-*`, `end-*`) used throughout.
- Cairo / Tajawal Arabic-optimized fonts.
- Currency: `150,000 DA` (Latin digits by default, Arabic numerals optional).
- Wilaya names in local script (e.g., الجزائر / Algiers).

### 6.8 Trust & Safety

- **Verified Host badge** issued after document + phone verification.
- **Instant Booking** vs **Request to Book** explicit labeling.
- **Review system**: post-event, 1–5 star, written feedback, photo upload.
- **Dispute resolution**: admin-mediated, tracked in `BookingDisputes`.
- **Content moderation**: flagged venues, flagged users, reported reviews.
- **Quality scoring** for venues (`VenueQualityScoring`).

### 6.9 Performance & Accessibility

- **Lazy loading**: images via `useLazyLoad` (IntersectionObserver, native `loading="lazy"`, `decoding="async"`, `fetchPriority`).
- **Scroll reveal**: `useScrollReveal` for sections.
- **Animated counters**: `useCountUp` for stats.
- **CTA pulse**: delayed 3s, respects `prefers-reduced-motion`.
- **Skeleton shimmer** during data fetch.
- **CSS containment** on grids (planned Phase 4).
- **Font subsetting** for Arabic (planned Phase 4).
- **Preconnect hints** to Supabase and CDN (planned Phase 4).
- WCAG 2.1 AA targets: color contrast, focus rings, semantic HTML, alt text, keyboard nav, ≥44×44px touch targets.
- SEO: single H1 per page, meta titles < 60ch, meta descriptions < 160ch, JSON-LD for venues, canonical URLs, responsive viewport, lazy media.

---

## 7. Technical Architecture

### 7.1 Stack
- **Frontend:** React 18, Vite 5, TypeScript 5, Tailwind CSS v3, shadcn/ui, Lucide icons.
- **State:** React Query (server state), React Context (auth, theme, RTL).
- **Routing:** React Router v6.
- **Backend:** Lovable Cloud (Supabase) — Postgres, Auth, Storage, Edge Functions.
- **i18n:** i18next + react-i18next.
- **Forms:** react-hook-form + zod.
- **Email:** Resend via Supabase Edge Functions (`send-contact-email`).

### 7.2 Key Data Models
- `profiles` (user metadata)
- `user_roles` (role assignments — separate table, RLS-protected)
- `venues` (listings)
- `venue_images`, `venue_features`, `venue_availability`
- `bookings`
- `messages`, `conversations`
- `reviews`
- `content_pages`, `homepage_sections`, `faqs`, `testimonials`
- `disputes`, `audit_logs`

### 7.3 Security Principles
- All tables RLS-enabled.
- Role checks via `public.has_role(auth.uid(), 'role')` SECURITY DEFINER function.
- No client-side role storage or hardcoded admin checks.
- Secrets (Resend API key, etc.) stored in Lovable Cloud secrets.
- Publishable / anon keys safe in client code.

---

## 8. UX Principles

1. **Mobile-first** — 70%+ of traffic is mobile; design starts at 360px.
2. **Trust > novelty** — every screen must surface a trust signal (verified, rating, transparent price, WhatsApp).
3. **Arabic-first** — RTL is not an afterthought; AR is the default for .dz visitors.
4. **Speed feels like trust** — perceived performance through skeletons, lazy loading, and reveal animations.
5. **Cultural fit** — wedding/family events are the hero use case; WhatsApp is the preferred contact channel.

---

## 9. Roadmap

### Phase 1 — Foundations (Shipped)
StatsBar redesign, WhatsApp/Verified badges, RTL fixes, mobile touch targets, price-breakdown groundwork.

### Phase 2 — Visual Polish (Largely Shipped)
Cairo/Tajawal font, shimmer skeletons, empty states. **Remaining:** button-variant standardization, unified card styles.

### Phase 3 — Motion (Largely Shipped)
Ken Burns hero, scroll-reveal sections, CTA pulse, animated counters. **Remaining:** staggered headline reveal, venue card hover micro-interactions.

### Phase 4 — Performance (In Progress)
Lazy loading (✓), preconnect hints, CSS containment, Arabic font subsetting.

### v1.1
- Itemized BookingForm price breakdown (in DZD)
- French locale completion
- In-app card / Baridimob payments
- PWA install prompts + offline shell

### v2
- Native apps
- Recommendation engine
- Supplier marketplace
- Multi-country (Tunisia, Morocco)

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Payment friction (no in-app pay v1) | Manual deposit + WhatsApp + clear cancellation policy |
| Low host trust in platform fees | Transparent take-rate communication + free first 3 bookings |
| Arabic font weight / loading cost | Subset Arabic font, `font-display: swap` |
| Listing fraud | Verified Host program, document check, review velocity flags |
| Seasonality (wedding season Jun–Sep) | Off-season corporate / cultural event acquisition |

---

## 11. Open Questions

1. Should we expose host phone numbers directly, or proxy through a masked number?
2. Do we need wilaya-level pricing analytics for hosts (suggested price band)?
3. Should reviews require booking proof, or allow open reviews with a "Verified Stay" tag?

---

**End of PRD v1.0**
