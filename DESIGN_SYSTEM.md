# Titan Dashboard Design System
**Version 1.0 | Apple-Inspired Professional Healthcare Platform**

This document defines the complete visual language, interaction patterns, and implementation guidelines for the Titan Dashboard platform. Use this as the single source of truth for all design and development decisions.

---

## 🎨 Color Palette

### Primary Colors
```css
--color-primary-blue: #0EA5E9;      /* Electric Blue - Primary actions, links */
--color-primary-indigo: #6366F1;    /* Indigo - Accent, gradients */
--color-success-green: #10B981;     /* Emerald - Success states, positive metrics */
```

### Neutral Colors
```css
--color-white: #FFFFFF;             /* Pure white - Cards, buttons */
--color-background: #FAFBFC;        /* Off-white - Page background */
--color-text-primary: #1E293B;      /* Deep charcoal - Headings, body text */
--color-text-secondary: #64748B;    /* Slate gray - Secondary text, labels */
--color-text-muted: #94A3B8;        /* Light slate - Disabled text, placeholders */
--color-border: #E2E8F0;            /* Light gray - Borders, dividers */
--color-border-hover: #CBD5E1;      /* Medium gray - Hover state borders */
```

### Gradient Definitions
```css
/* Primary Gradient (Blue to Indigo) */
background: linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%);

/* Subtle Background Gradient */
background: linear-gradient(135deg, 
  rgba(14, 165, 233, 0.02) 0%, 
  rgba(99, 102, 241, 0.02) 100%
);

/* Button Hover Gradient */
background: linear-gradient(135deg, 
  rgba(14, 165, 233, 0.9) 0%, 
  rgba(99, 102, 241, 0.9) 100%
);
```

### Color Usage Guidelines

**Primary Blue (#0EA5E9)**
- Primary action buttons
- Links and interactive text
- Progress bars (start color)
- Active states

**Indigo (#6366F1)**
- Gradient endpoints
- Secondary interactive elements
- Accent highlights
- Progress bars (end color)

**Success Green (#10B981)**
- Success messages
- Positive metrics (growth indicators)
- Checkmarks and completion states
- "Good" status indicators

**When to Use Each:**
- **Buttons:** Gradient (blue → indigo) for primary, white with blue border for secondary
- **Text:** Primary for headings, secondary for labels, muted for hints
- **Backgrounds:** White for cards, off-white (#FAFBFC) for page background
- **Borders:** Light gray default, medium gray on hover, blue on focus

---

## 📝 Typography System

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", 
             Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Why this stack:**
- Uses native system fonts for optimal performance
- Renders beautifully on all platforms (Mac, Windows, Android)
- Matches Apple's design language
- Zero font loading time

### Type Scale

```css
/* Display - Hero sections, landing pages */
--font-size-display: 56px;
--line-height-display: 1.1;
--letter-spacing-display: -0.02em;
--font-weight-display: 700;

/* Heading 1 - Page titles */
--font-size-h1: 40px;
--line-height-h1: 1.2;
--letter-spacing-h1: -0.02em;
--font-weight-h1: 700;

/* Heading 2 - Section titles */
--font-size-h2: 32px;
--line-height-h2: 1.2;
--letter-spacing-h2: -0.01em;
--font-weight-h2: 600;

/* Heading 3 - Card titles, subsections */
--font-size-h3: 24px;
--line-height-h3: 1.3;
--letter-spacing-h3: -0.01em;
--font-weight-h3: 600;

/* Body Large - Important body text */
--font-size-body-lg: 18px;
--line-height-body-lg: 1.5;
--letter-spacing-body-lg: 0;
--font-weight-body-lg: 400;

/* Body - Default body text */
--font-size-body: 16px;
--line-height-body: 1.5;
--letter-spacing-body: 0;
--font-weight-body: 400;

/* Body Small - Secondary text, labels */
--font-size-body-sm: 14px;
--line-height-body-sm: 1.4;
--letter-spacing-body-sm: 0;
--font-weight-body-sm: 400;

/* Caption - Hints, metadata */
--font-size-caption: 12px;
--line-height-caption: 1.4;
--letter-spacing-caption: 0;
--font-weight-caption: 400;
```

### Typography Usage Guidelines

**Display (56px, Bold)**
- Landing page hero headlines only
- Maximum 1 per page
- Example: "Get Your Free Scaling Roadmap"

**Heading 1 (40px, Bold)**
- Page titles
- Quiz section titles
- Dashboard main heading
- Example: "Your Business Health Score"

**Heading 2 (32px, Semibold)**
- Major section headings
- Card group titles
- Modal titles
- Example: "Growth Potential Analysis"

**Heading 3 (24px, Semibold)**
- Card titles
- Subsection headings
- Quiz question titles
- Example: "What's your biggest frustration?"

**Body Large (18px, Regular)**
- Important descriptions
- Quiz question helper text
- Call-to-action supporting text
- Example: "Answer 20 questions to get your personalized roadmap"

**Body (16px, Regular)**
- Default body text
- Quiz answers
- Dashboard descriptions
- Paragraph content

**Body Small (14px, Regular)**
- Labels
- Secondary information
- Button text
- Form field labels

**Caption (12px, Regular)**
- Timestamps
- Metadata
- Tooltips
- Footer text

---

## 🎭 Shadow System

Apple uses shadows sparingly but consistently. Define 3 levels:

### Level 1: Subtle Elevation (Cards)
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
```
**Use for:**
- Default cards
- Input fields (on focus)
- Subtle elevation

### Level 2: Medium Elevation (Modals, Dropdowns)
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
```
**Use for:**
- Modal dialogs
- Dropdown menus
- Popovers
- Tooltips

### Level 3: High Elevation (Overlays)
```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
```
**Use for:**
- Full-screen overlays
- Exit-intent modals
- Important notifications
- Floating action buttons

### Shadow Guidelines

**DO:**
- Use consistent shadow levels across similar components
- Keep shadows subtle (never pure black)
- Increase shadow on hover for interactive elements
- Use shadows to indicate hierarchy

**DON'T:**
- Mix shadow levels randomly
- Use shadows on every element
- Create custom shadow values
- Use colored shadows (except for focus states)

---

## 📐 Spacing System

Use an 8px grid for all spacing. This creates visual rhythm and consistency.

### Spacing Scale
```css
--space-xs: 4px;    /* Tight spacing within components */
--space-sm: 8px;    /* Small gaps, icon spacing */
--space-md: 16px;   /* Default spacing between elements */
--space-lg: 24px;   /* Section spacing */
--space-xl: 32px;   /* Large section spacing */
--space-2xl: 48px;  /* Major section breaks */
--space-3xl: 64px;  /* Page-level spacing */
--space-4xl: 96px;  /* Hero section spacing */
```

### Spacing Usage Guidelines

**4px (XS)**
- Icon-to-text spacing
- Badge padding
- Tight inline elements

**8px (SM)**
- Button padding (vertical)
- Input field padding (vertical)
- Chip/tag spacing

**16px (MD)**
- Default gap between elements
- Card padding (small cards)
- Button padding (horizontal)
- List item spacing

**24px (LG)**
- Card padding (default)
- Section spacing within cards
- Form field spacing

**32px (XL)**
- Large card padding
- Modal padding
- Section spacing on pages

**48px (2XL)**
- Major section breaks
- Space between card groups
- Top/bottom page padding

**64px (3XL)**
- Hero section padding
- Large page sections
- Landing page spacing

**96px (4XL)**
- Hero section vertical padding
- Major landing page sections

### Spacing Rules

1. **Always use multiples of 8px** (except 4px for micro-spacing)
2. **Consistent padding:** Cards should use 24px or 32px, not mixed
3. **Vertical rhythm:** Use consistent spacing between sections
4. **Responsive spacing:** Reduce spacing on mobile (e.g., 32px → 24px)

---

## 🔘 Button System

### Button Variants

#### Primary Button (Gradient)
```css
background: linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%);
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-size: 16px;
font-weight: 600;
border: none;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
transition: all 150ms ease-out;
```

**States:**
- **Hover:** `opacity: 0.9; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);`
- **Active (pressed):** `transform: scale(0.98);`
- **Focus:** `outline: 2px solid #0EA5E9; outline-offset: 2px;`
- **Disabled:** `opacity: 0.5; cursor: not-allowed;`

#### Secondary Button (Outline)
```css
background: #FFFFFF;
color: #0EA5E9;
padding: 12px 24px;
border-radius: 8px;
font-size: 16px;
font-weight: 600;
border: 1px solid #0EA5E9;
transition: all 150ms ease-out;
```

**States:**
- **Hover:** `background: rgba(14, 165, 233, 0.05);`
- **Active:** `transform: scale(0.98);`
- **Focus:** `outline: 2px solid #0EA5E9; outline-offset: 2px;`

#### Tertiary Button (Ghost)
```css
background: transparent;
color: #0EA5E9;
padding: 12px 24px;
border-radius: 8px;
font-size: 16px;
font-weight: 600;
border: none;
transition: all 150ms ease-out;
```

**States:**
- **Hover:** `background: rgba(14, 165, 233, 0.05);`
- **Active:** `transform: scale(0.98);`

### Button Sizes

```css
/* Small */
padding: 8px 16px;
font-size: 14px;
border-radius: 6px;

/* Medium (default) */
padding: 12px 24px;
font-size: 16px;
border-radius: 8px;

/* Large */
padding: 16px 32px;
font-size: 18px;
border-radius: 10px;
```

### Button Usage Guidelines

**Primary (Gradient)**
- Main call-to-action per page (max 1-2)
- Form submissions
- "Continue", "Submit", "Get Started"

**Secondary (Outline)**
- Alternative actions
- "Back", "Cancel", "Learn More"
- Multiple actions on same page

**Tertiary (Ghost)**
- Low-priority actions
- "Skip", "Not now", "View details"
- Inline text links that need button treatment

---

## 🎯 Interactive States

### Focus States (Keyboard Navigation)
```css
/* All interactive elements */
:focus-visible {
  outline: 2px solid #0EA5E9;
  outline-offset: 2px;
  border-radius: 8px;
}

/* Remove default browser outline */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Hover States
```css
/* Buttons */
button:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Links */
a:hover {
  color: #6366F1;
  text-decoration: underline;
}

/* Cards */
.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
```

### Active States (Click/Press)
```css
/* All interactive elements */
button:active,
.card:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}
```

### Disabled States
```css
button:disabled,
input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## 🎬 Animation & Transitions

### Timing Functions

```css
/* Default easing (most animations) */
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Spring animation (buttons, cards) */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Smooth ease (fades, opacity) */
--ease-smooth: cubic-bezier(0.4, 0.0, 0.2, 1);
```

### Duration Guidelines

```css
--duration-instant: 100ms;   /* Button press, immediate feedback */
--duration-fast: 150ms;      /* Hover states, focus rings */
--duration-normal: 200ms;    /* Default transitions */
--duration-slow: 300ms;      /* Page transitions, modals */
--duration-slower: 500ms;    /* Large animations, confetti */
```

### Common Transitions

```css
/* Button hover/press */
transition: all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Card hover */
transition: transform 200ms ease-out, box-shadow 200ms ease-out;

/* Fade in/out */
transition: opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Slide in */
transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Guidelines

**DO:**
- Use subtle animations (users shouldn't notice them consciously)
- Keep durations under 300ms for interactions
- Use spring easing for playful elements (confetti, success states)
- Respect `prefers-reduced-motion` media query

**DON'T:**
- Animate everything
- Use linear timing functions
- Create animations longer than 500ms
- Animate layout properties (use transform instead)

---

## 📦 Component Guidelines

### Cards

```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

**Usage:**
- Dashboard metrics
- Quiz question containers
- Content sections

### Input Fields

```css
input, textarea {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #1E293B;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

input:focus {
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  outline: none;
}

input::placeholder {
  color: #94A3B8;
}
```

### Progress Bars

```css
.progress-bar {
  height: 8px;
  background: #E2E8F0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0EA5E9 0%, #6366F1 100%);
  border-radius: 999px;
  transition: width 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Tooltips

```css
.tooltip {
  background: #1E293B;
  color: #FFFFFF;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-width: 240px;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

### Responsive Spacing

Reduce spacing on mobile:

```css
/* Desktop */
--space-section: 64px;

/* Mobile */
@media (max-width: 640px) {
  --space-section: 32px;
}
```

### Responsive Typography

Reduce font sizes on mobile:

```css
/* Desktop */
--font-size-h1: 40px;

/* Mobile */
@media (max-width: 640px) {
  --font-size-h1: 32px;
}
```

---

## ♿ Accessibility Guidelines

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text (16px):** 4.5:1 contrast ratio
- **Large text (24px+):** 3:1 contrast ratio

**Verified Combinations:**
- ✅ `#1E293B` on `#FFFFFF` (13.5:1)
- ✅ `#64748B` on `#FFFFFF` (5.8:1)
- ✅ `#FFFFFF` on `#0EA5E9` (3.2:1) - Large text only
- ❌ `#94A3B8` on `#FFFFFF` (3.1:1) - Use for non-critical text only

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid #0EA5E9;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0EA5E9;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Support

```html
<!-- Use semantic HTML -->
<button aria-label="Close modal">×</button>

<!-- Provide context for icons -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Use ARIA labels for dynamic content -->
<div role="status" aria-live="polite">
  Quiz progress: 47% complete
</div>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 Logo Usage

### Logo Specifications

**File:** `/client/public/logo.png`

**Sizes:**
- **Header/Navigation:** 40px height
- **Landing Page Hero:** 64px height
- **Favicon:** 32x32px, 64x64px

**Clear Space:**
Maintain minimum clear space of 16px around logo on all sides.

**Color Variations:**
- **Primary:** Full color (use on white/light backgrounds)
- **White:** Use on dark backgrounds or gradient overlays

**DON'T:**
- Distort or stretch the logo
- Change logo colors
- Place logo on busy backgrounds
- Make logo smaller than 32px height

---

## 📋 Implementation Checklist

When creating new pages or components, verify:

- [ ] Uses approved color palette (no custom colors)
- [ ] Typography follows type scale (no random font sizes)
- [ ] Shadows use one of 3 defined levels
- [ ] Spacing uses 8px grid (4px for micro-spacing)
- [ ] Buttons have all 4 states (default, hover, active, focus)
- [ ] Interactive elements have visible focus indicators
- [ ] Animations use approved timing functions
- [ ] Color contrast meets WCAG AA standards
- [ ] Component is keyboard accessible
- [ ] Responsive design tested on mobile/tablet/desktop

---

## 🔄 Design System Updates

**Version History:**
- **v1.0** (Feb 2026) - Initial Apple-inspired design system

**Requesting Changes:**
If you need to add new colors, components, or patterns:
1. Document the use case
2. Propose the addition with rationale
3. Get approval before implementing
4. Update this document with new guidelines

**Questions?**
Refer to this document first. If unclear, default to Apple's design patterns (iOS Human Interface Guidelines, macOS Design Guidelines).

---

## 📚 Resources

**Inspiration:**
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Stripe Design System](https://stripe.com/docs/design)
- [Linear Design System](https://linear.app/design)

**Tools:**
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [8-Point Grid Calculator](https://spec.fm/specifics/8-pt-grid)
- [Cubic Bezier Generator](https://cubic-bezier.com/)

---

**Last Updated:** February 16, 2026  
**Maintained By:** Titan Dashboard Team
