# Directus CMS Data Model Plan

Based on the PRD, here is the data model to be set up in Directus.

## Proposed Collections

### 1. `locations` (Collection)
Stores all information for a specific location listing.

**Fields:**
- `id` (UUID) - Primary Key
- `status` (String) - Published, Draft, Archived
- `name` (String) - E.g., "Industrial Loft"
- `slug` (String) - Unique URL identifier (e.g., "industrial-loft")
- `description` (WYSIWYG) - General location description
- `aesthetic_style` (String / Dropdown) - e.g., Minimalist, Industrial
- `capacity` (Integer) - Maximum allowed capacity
- `is_featured` (Boolean) - Toggle to highlight on the homepage
- **Media:**
  - `thumbnail` (Image) - Main card image
  - `gallery` (Files / Many-to-Many) - Masonry/slider gallery images
- **Details:**
  - `key_features` (WYSIWYG) - Square footage, power, parking, etc.
  - `rules_restrictions` (WYSIWYG) - Noise rules, access times, etc.
- **SEO Metadata:**
  - `seo_title` (String)
  - `seo_description` (Text)
  - `seo_image` (Image)

---

### 2. `testimonials` (Collection)
Stores past client feedback.

**Fields:**
- `id` (UUID) - Primary Key
- `status` (String) - Published, Draft, Archived
- `client_name` (String) - E.g., "Jane Doe"
- `company` (String) - E.g., "XYZ Productions"
- `feedback` (WYSIWYG) - Short paragraph of the review
- `bts_photos` (Files / Many-to-Many) - Behind-the-scenes photos from the shoot
- `location_id` (Many-to-One to `locations`) - Optional link to the specific location they rented

---

### 3. `homepage_config` (Singleton)
A single configuration object for the homepage content and global SEO.

**Fields:**
- `hero_media` (Image / Video File) - Background for the hero section
- `hero_cta_text` (String) - Text for the main button
- `value_proposition` (WYSIWYG) - Why choose these locations
- **Global / Homepage SEO Metadata:**
  - `seo_title` (String)
  - `seo_description` (Text)
  - `seo_image` (Image)
