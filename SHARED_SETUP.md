# Shared Setup – SQLite Only (no Docker, no external DB)

## 1️⃣ Clone the repository
```powershell
# Choose a folder, e.g. D:\
cd D:\
git clone https://github.com/drhasnain751/smart-traffic-mngmnt.git "Smart IoT Traffic Management System"
```

## 2️⃣ Use the ready-made `.env`
The repository already includes a **pre-configured backend `.env`** file at `backend/.env`.
```dotenv
# backend/.env
PORT=5000
JWT_SECRET=dev_secret_key_please_change
# SQLite for local development (no external DB needed)
DATABASE_URL="file:./dev.db"
# Frontend URL used by Vite (must match the backend port)
VITE_API_URL=http://localhost:5000/api
```
> **Note:** The JWT secret is a development placeholder. If this project is used beyond local testing, replace it with a strong random string.

## 3️⃣ Install dependencies
```powershell
# Backend
cd "Smart IoT Traffic Management System\backend"
npm install
# Frontend
cd ..\frontend
npm install
```

## 4️⃣ Run database setup
```powershell
cd "Smart IoT Traffic Management System\backend"
npm run prisma:migrate
# optional seed data
npm run prisma:seed
```

## 5️⃣ Start the backend and frontend
Open two PowerShell windows.
```powershell
# Backend
cd "Smart IoT Traffic Management System\backend"
npm run dev
```
```powershell
# Frontend
cd "Smart IoT Traffic Management System\frontend"
npm run dev
```

## 6️⃣ Alternative: start both from the root
From the repository root:
```powershell
cd "Smart IoT Traffic Management System"
npm run install:all
npm run dev
```

## 7️⃣ Verify everything works
- Open a browser at `http://localhost:5173`
- Confirm the backend API responds at `http://localhost:5000/api/health`

## 8️⃣ Stop the stack
- Press **Ctrl+C** in each PowerShell window.

---

## Notes
- The backend uses local SQLite by default in `backend/prisma/dev.db`.
- `backend/.env` is valid for local development.
- `backend/prisma/dev.db` and `backend/prisma/dev.db-journal` are local files and should not be pushed to GitHub.
