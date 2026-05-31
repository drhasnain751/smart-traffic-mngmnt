# Shared Setup – SQLite Only (no Docker, no external DB)

## 1️⃣ Clone the repository
```powershell
# Choose a folder, e.g. D:\
cd D:\
git clone https://github.com/your-org/smart-iot-traffic-management-system.git "Smart IoT Traffic Management System"
```

## 2️⃣ Use the ready‑made universal `.env`
The repository now contains a **pre‑populated `.env`** in `backend/.env` that works for anyone on any Windows machine (SQLite, no passwords).
```dotenv
# backend/.env
PORT=5000
JWT_SECRET=dev_secret_key_please_change
# SQLite for local development (no external DB needed)
DATABASE_URL="file:./dev.db"
# Frontend URL used by Vite (must match the backend port)
VITE_API_URL=http://localhost:5000/api
```
> **Note:** The JWT secret is a placeholder. If you plan to expose the API beyond local testing, replace it with a strong random string.

## 3️⃣ Install dependencies (Node + pnpm optional)
```powershell
# Backend
cd "Smart IoT Traffic Management System\backend"
pnpm install    # or: pnpm install
# Frontend
cd ..\frontend
pnpm install    # or: npm ci
```

## 4️⃣ Run database migrations (creates `dev.db` automatically)
```powershell
cd ..\backend
npx prisma migrate deploy   # creates tables in dev.db
# (optional) seed data if a seed script exists
# npx prisma db seed
```

## 5️⃣ Start the backend & frontend
Open two PowerShell windows (or use the one‑liner below).
```powershell
# Window 1 – backend
cd "Smart IoT Traffic Management System\backend"
pnpm run dev   # or: pnpm dev
```
```powershell
# Window 2 – frontend
cd "Smart IoT Traffic Management System\frontend"
pnpm run dev   # or: pnpm dev
```
### One‑liner (starts both)
```powershell
cd "Smart IoT Traffic Management System"; \
Start-Process pwsh -ArgumentList "-NoExit","-Command","cd backend; pnpm install; npx prisma migrate deploy; pnpm dev"; \
cd frontend; pnpm install; pnpm dev
```

## 6️⃣ Verify everything works
- Open a browser → `http://localhost:5173` (frontend). It should load the UI.
- Test the health endpoint:
```powershell
curl http://localhost:5000/api/health
# Expected: {"status":"ok"}
```

## 7️⃣ Stopping the stack
- Press **Ctrl + C** in each PowerShell window.

---
**Sharing**: Send the entire `Smart IoT Traffic Management System` folder (including the `backend/.env` file above) to your friend. No additional configuration is required.
