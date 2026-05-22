# LAFA Magazzino – Warehouse Management System

A production-ready warehouse management system with real-time updates, barcode/QR scanning, and a beautiful mobile-first Angular UI.

## Architecture

```
Browser (Angular 18 SPA)
    │
    ├──► Nginx (localhost:80)
    │         │
    │         ├──► /     (Serves Angular)
    │         ├──► /api/ (Proxies to Backend ASP.NET Core)
    │         └──► /hubs/ (Proxies SignalR WebSockets)
    │
    └──► ASP.NET Core API
              ├──► Supabase (PostgreSQL)
              └──► SignalR Hub
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Docker | 24+ |
| Docker Compose | v2+ (`docker compose` command) |
| Supabase project | free tier or higher |

---

## 1. Supabase Setup

### 1.1 Create the database tables

Open your Supabase project → **SQL Editor** and run:

```sql
-- Shelves table
CREATE TABLE IF NOT EXISTS shelves (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label          text UNIQUE NOT NULL,
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now()
);

-- Containers table
CREATE TABLE IF NOT EXISTS containers (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label          text NOT NULL,
    shelf_id       uuid NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE(label, shelf_id)
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name           text NOT NULL,
    photo_url      text,
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now()
);

-- Article Stock (Join table N:N)
CREATE TABLE IF NOT EXISTS article_stock (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id     uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    container_id   uuid NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    quantity       integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE(article_id, container_id)
);

-- Movements table
CREATE TABLE IF NOT EXISTS movements (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id   uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    article_name text NOT NULL,
    type         text NOT NULL CHECK (type IN ('LOAD', 'UNLOAD')),
    quantity     integer NOT NULL CHECK (quantity > 0),
    notes        text,
    created_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stock_container_id   ON article_stock (container_id);
CREATE INDEX IF NOT EXISTS idx_stock_article_id     ON article_stock (article_id);
CREATE INDEX IF NOT EXISTS idx_movements_article_id ON movements (article_id);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON movements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_containers_shelf_id  ON containers (shelf_id);

-- RPC function for atomic quantity update per container
CREATE OR REPLACE FUNCTION update_stock_quantity(p_article_id uuid, p_container_id uuid, p_delta integer)
RETURNS void AS $$
BEGIN
  UPDATE article_stock
  SET quantity = GREATEST(0, quantity + p_delta)
  WHERE article_id = p_article_id AND container_id = p_container_id;
END;
$$ LANGUAGE plpgsql;
```

### 1.2 Storage bucket for photos

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name it exactly: `article-photos`
4. Check **Public bucket** (so photo URLs are accessible from the frontend)
5. Click **Save**

### 1.3 Disable RLS (optional, recommended for LAN-only use)

Since all access goes through your secured backend:

```sql
ALTER TABLE shelves       DISABLE ROW LEVEL SECURITY;
ALTER TABLE containers    DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles      DISABLE ROW LEVEL SECURITY;
ALTER TABLE article_stock DISABLE ROW LEVEL SECURITY;
ALTER TABLE movements     DISABLE ROW LEVEL SECURITY;
```

---

## 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# From Supabase dashboard → Settings → API
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhb...your-anon-key...

# The origin where the frontend will be served FROM (used in CORS)
# For local dev on the same machine:
FRONTEND_ORIGIN=http://localhost
# For LAN access from other devices:
# FRONTEND_ORIGIN=http://192.168.1.100
```

---

## 3. Run the System

```bash
# Build images and start all services
docker compose up --build

# Or run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

---

## 4. Access the App

| Service | URL |
|---------|-----|
| Angular SPA | http://localhost |
| Backend API | http://localhost/api |
| SignalR Hub | ws://localhost/hubs/warehouse |

*(Note: Swagger UI is not automatically exposed via the Nginx proxy in production mode)*

### Access from other devices on the LAN

1. Find your machine's IP: `ipconfig` (Windows) or `ip a` (Linux)
2. Update `.env`:
   ```
   FRONTEND_ORIGIN=http://192.168.1.100
   ```
3. Rebuild: `docker compose up --build`
4. Open `http://192.168.1.100` on any device on the same network.

---

## 5. Features

### 📊 Dashboard (Default Page)
- Summary cards: total articles, total stock, low stock, zero stock
- **Advanced Search**: Search by name with partial match and case-insensitivity (results only shown when searching)
- Quick access to **QR Scanner**
- Color-coded stock levels (green / orange / red)

### 🔍 QR Scanner
- Accessible directly from the Dashboard
- Supports **multi-article containers**: scan a container to see all items inside
- Supports **shelves navigation**: scan a shelf to see all containers on it
- Integrated with details pages for immediate lookup

### 📦 Management & Details
- **Compact List Views**: Optimized row-based lists for Articles, Shelves, and Containers
- **Notes Field**: Added support for internal notes for all warehouse entities
- **Photo Handling**: Improved photo display (contain fit) with lightbox support
- **ID Copying**: One-click ID copying to clipboard in detail pages
- **Expandable QR Codes**: Click on QR codes in detail pages to view them enlarged

### 🔄 Load/Unload Actions
- **Direct Action**: Perform Load/Unload operations directly from the Article Detail page
- Real-time inventory updates via SignalR
- History logging for every movement

### 🕒 Movement History
- Full history sorted by date (newest first)
- Real-time updates via SignalR
- Filters: type (LOAD/UNLOAD), date range

### 🔔 Real-Time (SignalR)
- Auto-reconnect with exponential backoff
- Available signals:
  - `ArticleQuantityUpdated` – after load/unload
  - `MovementAdded` – new movement recorded
  - `ArticleAdded` / `ArticleUpdated` / `ArticleDeleted`

---

## 6. Replace the LAFA Logo

The app shows the LAFA logo during splash and as PWA icon.

Replace these files with your own images:

```
frontend/src/assets/lafa-logo.png       ← splash screen (160×160 px recommended)
frontend/src/assets/lafa-logo-192.png   ← PWA icon 192×192
frontend/src/assets/lafa-logo-512.png   ← PWA icon 512×512
frontend/src/favicon.ico                ← browser tab icon
```

After replacing, rebuild:
```bash
docker compose up --build frontend
```

---

## 7. Development (without Docker)

### Backend
```bash
cd backend
dotnet restore
# Set env vars in your shell or use launchSettings.json
$env:SUPABASE_URL="https://..."
$env:SUPABASE_ANON_KEY="..."
$env:FRONTEND_ORIGIN="http://localhost:4200"
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm start   # ng serve on http://localhost:4200
```

---

## 8. API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | List all articles |
| GET | `/api/articles/search?q=` | Search by name |
| GET | `/api/articles/{id}` | Get article by ID |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/{id}` | Update article |
| DELETE | `/api/articles/{id}` | Delete article |
| GET | `/api/shelves` | List shelves |
| GET | `/api/containers` | List containers |
| GET | `/api/scan/{id}` | Polymorphic lookup (id is UUID) |
| POST | `/api/scan/action` | Load/unload action |
| GET | `/api/movements` | Movement history |
| GET | `/health` | Health check |

Full interactive docs at `/swagger` (development mode).

---

## 9. Security Notes

This system is designed for a **single-user, local network** environment:
- No authentication is implemented
- Expose only on a trusted LAN, never to the public internet
- Add nginx basic auth or VPN if external access is needed
- The `.env` file contains secrets — never commit it to version control

Add `.env` to `.gitignore`:
```
echo ".env" >> .gitignore
```
