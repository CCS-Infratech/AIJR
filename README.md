# AIJR — All India Jamiat Rayeen

Public website for All India Jamiat Rayeen — community, leadership, events, gallery, membership, and contact.

**Repository:** [github.com/CCS-Infratech/AIJR](https://github.com/CCS-Infratech/AIJR)

---

## What it includes

- Home page with hero, about, leadership, featured events, and gallery
- Dedicated Events and Gallery pages
- Membership interest form and contact form
- Route handlers that send submissions over SMTP (Nodemailer)
- Link out to [Rayeen Shadi](https://rayeenshaadi.com/)
- Next.js 15 App Router, Tailwind CSS, Framer Motion

Forms currently confirm locally. Wire them to `/api/membership` and `/api/contact` once official SMTP credentials are in place (the handlers and the call sites are already written).

---

## Architecture

```
Browser
  │
  ├─ Pages
  │    /            Home sections (hero, about, team, events, gallery, membership, contact)
  │    /events      Full events list
  │    /gallery     Full photo gallery
  │
  └─ Forms  ─►  /api/membership
                /api/contact
                     └─ Nodemailer  ─►  EMAIL_TO
```

```
app/
├── layout.tsx
├── page.tsx                 # Home
├── events/page.tsx
├── gallery/page.tsx
└── api/
    ├── contact/route.ts
    └── membership/route.ts

src/components/
├── Navbar.tsx
├── Hero.tsx
├── About.tsx
└── Gallery.tsx

public/images/               # Logo, team photos, gallery
```

There is no separate backend. Pages are static/client content; email is handled inside Next.js route handlers.

---

## How to run

**Requirements:** Node.js 20+.

```bash
git clone https://github.com/CCS-Infratech/AIJR.git
cd AIJR
npm install
```

Optional `.env` if you want live email from the API routes:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_TO=
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

---

## Pages

| Path | Content |
| --- | --- |
| `/` | Home, team, featured events/gallery, membership, contact |
| `/events` | All events |
| `/gallery` | Photo gallery |
| `POST /api/contact` | Contact email |
| `POST /api/membership` | Membership request email |

---

All India Jamiat Rayeen
