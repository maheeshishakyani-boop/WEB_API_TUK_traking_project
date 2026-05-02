# 🛺 Tuk-Tuk Tracking API
## NB6007CEM - Web API Development | NIBM 24.2P

Real-Time Three-Wheeler Tracking & Movement Logging System for Sri Lanka Police

---

## 📁 Project Structure

```
tuktuk-api/
├── server.js                  ← START HERE (entry point)
├── package.json               ← dependencies list
├── .env                       ← your secrets (DB password, JWT key)
├── .gitignore
├── scripts/
│   └── seed.js                ← run once to fill database with fake data
└── src/
    ├── app.js                 ← express setup
    ├── config/
    │   ├── database.js        ← MySQL connection
    │   └── swagger.js         ← API docs setup
    ├── models/
    │   ├── index.js           ← links all models together
    │   ├── Province.js
    │   ├── District.js
    │   ├── PoliceStation.js
    │   ├── User.js
    │   ├── Vehicle.js
    │   └── LocationPing.js
    ├── middleware/
    │   ├── auth.js            ← checks JWT token
    │   └── errorHandler.js    ← catches errors
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── province.controller.js
    │   ├── district.controller.js
    │   ├── station.controller.js
    │   ├── vehicle.controller.js
    │   └── location.controller.js
    └── routes/
        ├── auth.routes.js
        ├── province.routes.js
        ├── district.routes.js
        ├── station.routes.js
        ├── vehicle.routes.js
        └── location.routes.js
```

---

## 🚀 STEP BY STEP SETUP

### Step 1: Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2: Install MySQL
Download MySQL Community Server from https://dev.mysql.com/downloads/
During install, remember your ROOT PASSWORD

### Step 3: Create the database
Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE tuktuk_db;
```

### Step 4: Edit your .env file
Open `.env` and change `DB_PASS` to your MySQL root password

### Step 5: Install project packages
```bash
cd tuktuk-api
npm install
```

### Step 6: Seed the database (creates all tables + fake data)
```bash
npm run seed
```
Wait for it to finish (may take 1-2 minutes for location pings)

### Step 7: Start the server
```bash
npm run dev
```

### Step 8: Open Swagger docs
Go to: http://localhost:3000/api-docs

---

## 🔑 Test Login Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@police.lk        | admin123    |
| Officer | perera@police.lk       | officer123  |
| Device  | device@tracking.lk     | device123   |

---

## 📖 API Endpoints Summary

| Method | Endpoint                          | Who can use      |
|--------|-----------------------------------|------------------|
| POST   | /api/auth/login                   | Everyone         |
| POST   | /api/auth/register                | Everyone         |
| GET    | /api/auth/me                      | Logged in users  |
| GET    | /api/provinces                    | All logged in    |
| POST   | /api/provinces                    | Admin only       |
| GET    | /api/districts?province_id=1      | All logged in    |
| GET    | /api/stations?district_id=1       | All logged in    |
| GET    | /api/vehicles?status=active       | All logged in    |
| GET    | /api/vehicles?search=ABC          | All logged in    |
| POST   | /api/vehicles                     | Admin only       |
| POST   | /api/locations/ping               | Device role      |
| GET    | /api/locations/live               | All logged in    |
| GET    | /api/locations/:id/latest         | All logged in    |
| GET    | /api/locations/:id/history        | All logged in    |

---

## 🧪 Testing with Swagger

1. Go to http://localhost:3000/api-docs
2. Click POST /api/auth/login → Try it out → Enter credentials → Execute
3. Copy the token from the response
4. Click the green "Authorize" button at the top
5. Type: Bearer YOUR_TOKEN_HERE → Click Authorize
6. Now all endpoints are unlocked — try them!

---

## 📦 Deployment on Railway

1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables (same as your .env file)
4. Railway gives you a public URL like https://tuktuk-api.railway.app
5. Update the Swagger server URL in src/config/swagger.js

---

## Student Information
- Module: NB6007CEM - Web API Development
- Batch: 24.2P
- Institution: NIBM (Coventry University)
