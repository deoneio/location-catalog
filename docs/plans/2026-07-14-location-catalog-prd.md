# Product Requirements Document (PRD): Location Catalog Website

## 1. Overview
The goal of this project is to build a premium, highly aesthetic catalog website for locations available for rent, specifically targeting photo/video shoots and event spaces (not overnight stays). The website will act as a display catalog where users can browse locations and find contact information to reach out externally.

## 2. Target Audience
- Photographers, videographers, and production teams looking for shoot locations.
- Event planners looking for unique spaces.

## 3. User Personas & Use Cases

### Persona 1: Admin / Website Owner
**Use Cases:**
- Log into the Directus Headless CMS dashboard.
- Create, edit, or delete location listings (upload images, set features, rules, and capacities) without touching code.
- Toggle a "Highlight" or "Featured" status on a location so it appears directly on the homepage.
- Add, edit, or remove client testimonials and behind-the-scenes photos.
- (Optional) View basic site traffic and inquiry analytics.

### Persona 2: Potential Client (e.g., Photographer, Event Planner)
**Use Cases:**
- Browse the homepage to discover premium, featured locations.
- Use the listing page to browse the full catalog and filter locations by specific styles or sizes.
- View a detailed location page to inspect the image gallery, verify key features, and review rules.
- Read past testimonials to build trust and validate the location's quality.
- Click the WhatsApp CTA on a location or the Contact Us page to initiate a direct, pre-filled inquiry.

## 4. Architecture & Tech Stack
- **Frontend Framework**: Vue.js (Nuxt.js recommended for SEO benefits).
- **Content Management**: Directus (Headless CMS) to allow easy addition, editing, and removal of location listings and testimonials by administrators without code changes.
- **SEO Optimization**: Full Search Engine Optimization readiness (Server-Side Rendering via Nuxt.js, semantic HTML, and dynamic meta tags).
- **Styling**: Vanilla CSS utilizing modern design principles (CSS Variables, Grid, Flexbox) to deliver a premium feel with micro-animations, glassmorphism, and dynamic hover effects.

## 5. Key Pages & Features

### 5.1. Homepage
- **Hero Section**: High-quality background video or image slider showcasing the best locations, with a strong Call to Action (CTA) to browse the catalog.
- **Featured Locations**: A curated grid of top-tier locations with visually stunning cards.
- **Value Proposition**: Brief section explaining why users should choose these locations (e.g., exclusive access, diverse aesthetics).
- **Footer**: Navigation links, social media icons, and quick contact info.

### 5.2. Listing Page (Catalog)
- **Grid Layout**: A responsive, masonry or standard grid displaying location cards.
- **Card Details**: High-resolution thumbnail, location name, general aesthetic/style (e.g., "Industrial", "Minimalist"), and basic capacity.
- **Filters/Search**: (Optional for v1, highly recommended) Filter by style, size, or available natural light.

### 5.3. Detail Listing Page
- **Hero Gallery**: Full-width image gallery or masonry layout showing multiple angles of the location.
- **Location Information**: 
  - Name and brief description.
  - Key features (e.g., square footage, ceiling height, power availability, parking).
  - Rules or restrictions (e.g., no loud music after 10 PM).
- **Contact CTA**: Prominent "Inquire About This Location" button that links to the Contact Us page, or directly opens a WhatsApp chat (using a wa.me link with a pre-filled message about the location).

### 5.4. Testimonials Page
- **Reviews Showcase**: Elegant display of previous client reviews (production companies, photographers). Each testimonial must include a short paragraph of feedback/review from past clients detailing their successful shoots.
- **Visuals**: Incorporate behind-the-scenes (BTS) photos from the shoots alongside the testimonials if possible.

### 5.5. Contact Us Page
- **Contact Details**: Email address, phone number, and physical office address (if applicable).
- **WhatsApp Inquiry**: A prominent button or link to directly open a WhatsApp chat (using a wa.me link) for all inquiries, replacing a traditional contact form.

## 6. Design & Aesthetic Requirements
- **Brand Guidelines**: All colors, typography, and core design elements must strictly adhere to the provided brand guidelines.
- **Premium Feel**: Avoid generic templates. Incorporate the brand guidelines into a premium, highly aesthetic modern design.
- **Animations**: Smooth page transitions, fade-ins on scroll, and interactive hover effects on location cards to make the interface feel alive and responsive.
- **Responsive**: Flawless experience on mobile, tablet, and desktop devices.

## 7. Future Considerations (Out of Scope for v1)
- Integrated booking and availability calendar system.
- User accounts and saved locations (favorites).
