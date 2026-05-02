// ================================================
// INIT-DB.JS - Runs automatically when app starts
//
// This checks if the database is empty.
// If empty → runs the full seed (provinces, vehicles, etc.)
// If already has data → skips seeding
//
// This means:
//   First deploy  → creates all tables + seed data
//   Later deploys → does nothing (data is safe)
// ================================================
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
require('./models/index');
const {
  Province, District, PoliceStation,
  User, Vehicle, LocationPing
} = require('./models');

// ─── SRI LANKA DATA ────────────────────────────
const PROVINCES = [
  { name: 'Western Province',       code: 'WP'  },
  { name: 'Central Province',       code: 'CP'  },
  { name: 'Southern Province',      code: 'SP'  },
  { name: 'Northern Province',      code: 'NP'  },
  { name: 'Eastern Province',       code: 'EP'  },
  { name: 'North Western Province', code: 'NWP' },
  { name: 'North Central Province', code: 'NCP' },
  { name: 'Uva Province',           code: 'UP'  },
  { name: 'Sabaragamuwa Province',  code: 'SGP' }
];

const DISTRICTS = [
  { name: 'Colombo',      pIdx: 0, lat: 6.9271, lng: 79.8612 },
  { name: 'Gampaha',      pIdx: 0, lat: 7.0873, lng: 80.0144 },
  { name: 'Kalutara',     pIdx: 0, lat: 6.5854, lng: 79.9607 },
  { name: 'Kandy',        pIdx: 1, lat: 7.2906, lng: 80.6337 },
  { name: 'Matale',       pIdx: 1, lat: 7.4675, lng: 80.6234 },
  { name: 'Nuwara Eliya', pIdx: 1, lat: 6.9497, lng: 80.7891 },
  { name: 'Galle',        pIdx: 2, lat: 6.0535, lng: 80.2210 },
  { name: 'Matara',       pIdx: 2, lat: 5.9549, lng: 80.5550 },
  { name: 'Hambantota',   pIdx: 2, lat: 6.1241, lng: 81.1185 },
  { name: 'Jaffna',       pIdx: 3, lat: 9.6615, lng: 80.0255 },
  { name: 'Kilinochchi',  pIdx: 3, lat: 9.3803, lng: 80.4037 },
  { name: 'Mannar',       pIdx: 3, lat: 8.9811, lng: 79.9044 },
  { name: 'Mullaitivu',   pIdx: 3, lat: 9.2671, lng: 80.8128 },
  { name: 'Vavuniya',     pIdx: 3, lat: 8.7514, lng: 80.4971 },
  { name: 'Ampara',       pIdx: 4, lat: 7.2916, lng: 81.6724 },
  { name: 'Batticaloa',   pIdx: 4, lat: 7.7170, lng: 81.6924 },
  { name: 'Trincomalee',  pIdx: 4, lat: 8.5922, lng: 81.2152 },
  { name: 'Kurunegala',   pIdx: 5, lat: 7.4867, lng: 80.3647 },
  { name: 'Puttalam',     pIdx: 5, lat: 8.0362, lng: 79.8283 },
  { name: 'Anuradhapura', pIdx: 6, lat: 8.3114, lng: 80.4037 },
  { name: 'Polonnaruwa',  pIdx: 6, lat: 7.9403, lng: 81.0188 },
  { name: 'Badulla',      pIdx: 7, lat: 6.9934, lng: 81.0550 },
  { name: 'Monaragala',   pIdx: 7, lat: 6.8728, lng: 81.3507 },
  { name: 'Kegalle',      pIdx: 8, lat: 7.2513, lng: 80.3464 },
  { name: 'Ratnapura',    pIdx: 8, lat: 6.6829, lng: 80.3992 }
];

const FIRST_NAMES = [
  'Kamal','Sunil','Nimal','Rohan','Amal','Saman','Dilan','Ravi','Gayan',
  'Lahiru','Kasun','Chathura','Thilan','Nuwan','Chamara','Buddhika',
  'Madara','Isuru','Dasun','Hasitha','Namal','Sachith','Upul','Tharaka',
  'Rajitha','Sampath','Harsha','Pradeep','Chaminda','Sanjeewa','Dimuth',
  'Prasanna','Ruwan','Malith','Chanaka','Gihan','Thusitha','Eranda',
  'Janaka','Udara','Madushan','Asanka','Dushantha','Kavinda','Ravindu'
];

const LAST_NAMES = [
  'Perera','Silva','Fernando','De Silva','Dissanayake','Bandara',
  'Rajapaksa','Wickramasinghe','Jayasuriya','Gunasekara','Amarasinghe',
  'Senanayake','Rathnayake','Gunawardena','Jayawardena','Pathirana',
  'Kumara','Madushanka','Lakshman','Priyantha','Herath','Karunathilake',
  'Weerasinghe','Samarasinghe','Kumarasinghe','Wijesinghe','Ranasinghe'
];

const PROVINCE_PREFIXES = ['WP','CP','SP','NP','EP','NW','NC','UP','SG'];
const REG_LETTERS       = ['CAB','TUK','WHL','TRI','RID','THW','SKL'];
const STATION_SUFFIXES  = ['Police Station','Police Station','Police Station','Traffic Division','Sub Police Station','Police Post'];

const rand    = arr           => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max)    => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp   = (v, min, max) => Math.max(min, Math.min(max, v));

function getMovementProfile(hour, dayOfWeek) {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (hour >= 23 || hour < 5)                          return { moveChance: 0.15, maxMove: 0.002, speedMin: 0,  speedMax: 5  };
  if (!isWeekend && hour >= 7  && hour <= 9)           return { moveChance: 0.95, maxMove: 0.025, speedMin: 15, speedMax: 45 };
  if (hour >= 12 && hour <= 14)                        return { moveChance: 0.75, maxMove: 0.015, speedMin: 10, speedMax: 35 };
  if (!isWeekend && hour >= 16 && hour <= 19)          return { moveChance: 0.90, maxMove: 0.022, speedMin: 10, speedMax: 40 };
  if (isWeekend  && hour >= 8  && hour <= 20)          return { moveChance: 0.65, maxMove: 0.018, speedMin: 8,  speedMax: 30 };
  return { moveChance: 0.60, maxMove: 0.012, speedMin: 5, speedMax: 30 };
}

// ─── MAIN INIT FUNCTION ────────────────────────
async function initDB() {
  try {
    console.log('🔍 Checking if database needs seeding...');

    // Create tables if they don't exist yet
    await sequelize.sync({ alter: true });

    // Check if provinces already exist
    const existingCount = await Province.count();
    if (existingCount > 0) {
      console.log(`✅ Database already has data (${existingCount} provinces found). Skipping seed.`);
      return; // Data already exists — do nothing
    }

    console.log('📭 Database is empty. Running seed now...\n');

    // ── 1. PROVINCES ──
    console.log('📍 Creating 9 provinces...');
    const provinces = await Province.bulkCreate(PROVINCES);

    // ── 2. DISTRICTS ──
    console.log('📍 Creating 25 districts...');
    const districts = await District.bulkCreate(
      DISTRICTS.map(d => ({ name: d.name, province_id: provinces[d.pIdx].id }))
    );

    const districtGPS = {};
    districts.forEach((d, i) => {
      districtGPS[d.id] = { lat: DISTRICTS[i].lat, lng: DISTRICTS[i].lng };
    });

    // ── 3. POLICE STATIONS ──
    console.log('🚔 Creating 25 police stations...');
    const stations = await PoliceStation.bulkCreate(
      districts.map((d, i) => ({
        name:        `${d.name} ${STATION_SUFFIXES[i % STATION_SUFFIXES.length]}`,
        district_id: d.id,
        address:     `No.${randInt(1, 200)}, Main Street, ${d.name}`,
        phone:        `0${randInt(11, 91)}-${randInt(2000000, 9999999)}`
      }))
    );

    // ── 4. USERS ──
    console.log('👤 Creating users...');
    await User.bulkCreate([
      { name: 'Super Admin',      email: 'admin@police.lk',        password: await bcrypt.hash('admin123',   12), role: 'admin',   police_station_id: null },
      { name: 'Officer Perera',   email: 'perera@police.lk',       password: await bcrypt.hash('officer123', 12), role: 'officer', police_station_id: stations[0].id },
      { name: 'Officer Silva',    email: 'silva@police.lk',        password: await bcrypt.hash('officer123', 12), role: 'officer', police_station_id: stations[1].id },
      { name: 'Officer Bandara',  email: 'bandara@police.lk',      password: await bcrypt.hash('officer123', 12), role: 'officer', police_station_id: stations[2].id },
      { name: 'Officer Fernando', email: 'fernando@police.lk',     password: await bcrypt.hash('officer123', 12), role: 'officer', police_station_id: stations[3].id },
      { name: 'GPS Device',       email: 'device@tracking.lk',     password: await bcrypt.hash('device123',  12), role: 'device',  police_station_id: null }
    ]);

    // ── 5. VEHICLES ──
    console.log('🛺 Creating 200 vehicles...');
    const vehicleData = [];
    for (let i = 1; i <= 200; i++) {
      const district = districts[randInt(0, districts.length - 1)];
      vehicleData.push({
        registration_number: `${rand(PROVINCE_PREFIXES)} ${rand(REG_LETTERS)}-${String(i).padStart(4,'0')}`,
        driver_name:  `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
        driver_phone: `07${randInt(0,8)}${randInt(1000000,9999999)}`,
        driver_nic:   `${randInt(1970,2000)}${String(randInt(1,365)).padStart(3,'0')}${randInt(1000,9999)}V`,
        district_id:  district.id,
        device_id:    `DEV-${String(i).padStart(4,'0')}`,
        status:       i <= 180 ? 'active' : 'inactive'
      });
    }
    const vehicles = await Vehicle.bulkCreate(vehicleData);

    // ── 6. LOCATION HISTORY ──
    console.log('📡 Generating 7 days of GPS location history...');
    const activeVehicles = vehicles.filter(v => v.status === 'active');
    const START = new Date();
    START.setDate(START.getDate() - 7);
    START.setHours(0, 0, 0, 0);

    const pings = [];
    for (const vehicle of activeVehicles) {
      const center = districtGPS[vehicle.district_id] || { lat: 6.9271, lng: 79.8612 };
      let lat = center.lat + (Math.random() - 0.5) * 0.04;
      let lng = center.lng + (Math.random() - 0.5) * 0.04;

      for (let day = 0; day < 7; day++) {
        const pingDate  = new Date(START);
        pingDate.setDate(pingDate.getDate() + day);
        const dayOfWeek = pingDate.getDay();

        for (let hour = 0; hour < 24; hour += 2) {
          const profile  = getMovementProfile(hour, dayOfWeek);
          const isMoving = Math.random() < profile.moveChance;

          if (isMoving) {
            lat += (Math.random() - 0.5) * profile.maxMove;
            lng += (Math.random() - 0.5) * profile.maxMove;
          }

          const maxDrift = Math.random() < 0.2 ? 0.15 : 0.06;
          lat = clamp(lat, center.lat - maxDrift, center.lat + maxDrift);
          lng = clamp(lng, center.lng - maxDrift, center.lng + maxDrift);
          lat = clamp(lat, 5.9, 9.9);
          lng = clamp(lng, 79.5, 82.0);

          const speed = isMoving
            ? parseFloat((Math.random() * (profile.speedMax - profile.speedMin) + profile.speedMin).toFixed(1))
            : parseFloat((Math.random() * 3).toFixed(1));

          const pingTime = new Date(pingDate);
          pingTime.setHours(hour, randInt(0, 59), 0, 0);

          pings.push({
            vehicle_id: vehicle.id,
            latitude:   parseFloat(lat.toFixed(6)),
            longitude:  parseFloat(lng.toFixed(6)),
            speed_kmh:  speed,
            heading:    parseFloat((Math.random() * 360).toFixed(1)),
            pinged_at:  pingTime
          });
        }
      }
    }

    // Insert in batches of 500
    const BATCH = 500;
    for (let i = 0; i < pings.length; i += BATCH) {
      await LocationPing.bulkCreate(pings.slice(i, i + BATCH), { validate: false });
    }

    console.log('');
    console.log('🎉 ======================================');
    console.log('🎉  DATABASE SEED COMPLETE!');
    console.log(`🎉  Provinces: ${PROVINCES.length}`);
    console.log(`🎉  Districts: ${DISTRICTS.length}`);
    console.log(`🎉  Stations:  ${stations.length}`);
    console.log(`🎉  Vehicles:  ${vehicles.length}`);
    console.log(`🎉  Pings:     ${pings.length}`);
    console.log('🎉 ======================================');
    console.log('');

  } catch (err) {
    console.error('❌ Database init failed:', err.message);
    throw err; // re-throw so server.js knows init failed
  }
}

module.exports = initDB;