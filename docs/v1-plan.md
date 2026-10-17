# Balemuya Version-1 Plan

Balemuya connects customers in Addis Ababa with trusted local service providers. A customer finds a plumber, books them, the provider accepts, and an admin keeps the marketplace clean. The full loop works live.

## Demo Flow

**Customer** lands on Home (`/`)

- Goes to **Services** page (`/services`) → sees all services with short description + number of providers
- Clicks **Plumbers** → opens `/services/plumbers` (list of plumbers, can filter by sub-city)
- Clicks a provider card → opens **Provider Profile** (`/providers/[id]`)
- Fills the booking request form and submits
- Goes to **My Bookings** → status shows “Pending”
- Switches to **Provider** account → Dashboard shows the new request → clicks **Accept**
- Customer refreshes **My Bookings** → status changes to “Accepted”
- **Admin** logs in → approves a new provider (or suspends one) and manages the list of services

**Roles used:** Customer, Provider, seeded Admin

**Explicitly cut from V1:** messaging, payments, posting reviews, availability calendar, earnings, full moderation tools

## Clean URL Structure

| Path                    | Description                                      |
|-------------------------|--------------------------------------------------|
| `/`                     | Home                                             |
| `/services`             | List of all services (description + provider count) |
| `/services/[slug]`      | All providers of that service<br>(e.g. `/services/plumbers`, `/services/electricians`) |
| `/providers/[id]`       | Individual provider profile + booking form       |
| `/dashboard/*`          | Customer & Provider dashboards                   |
| `/admin/*`              | Admin                                            |

## Low-Fi Wireframes

| # | Screen                               | Key elements                                                                    |
|---|--------------------------------------|---------------------------------------------------------------------------------|
| 1 | Home (`/`)                           | Logo, search, featured services, popular providers, footer                      |
| 2 | Services List (`/services`)          | Grid/list of service cards (icon, name, short description, provider count)      |
| 3 | Service Providers (`/services/[slug]`)| Filters (sub-city, etc.), list of provider cards                                |
| 4 | Provider Profile (`/providers/[id]`) | Photo, name, rating, bio, price, area, seeded reviews, “Request Booking” button |
| 5 | Booking Form                         | Date, time, short note, submit                                                  |
| 6 | My Bookings (Customer)               | List of bookings with status badges (Pending / Accepted / Declined)             |
| 7 | Provider Dashboard                   | Incoming requests with Accept / Decline buttons                                 |
| 8 | Admin                                | Providers table (Approve / Suspend) + Services management (add/edit)            |

## Design System Starter

### Palette
- **Primary:** `#0D9488` (Teal)
- **Accent:** `#F59E0B` (Amber)
- **Background:** `#F8FAFC`
- **Cards:** `#FFFFFF`
- **Text:** `#0F172A` / `#64748B`
- **Border:** `#E2E8F0`
- **Success / Warning / Danger:** standard greens / amber / red

### Typography
- **Font:** Inter (via `next/font`)

### Card Style
- White background, 12–16px radius, soft shadow, light border, consistent padding