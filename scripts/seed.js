
// // ================================================
// require('dotenv').config();
// const bcrypt = require('bcryptjs');
// const { sequelize } = require('../src/config/database');
// require('../src/models/index');
// const { Province, District, PoliceStation, User, Vehicle, LocationPing } = require('../src/models');

// // ----------------------------------------
// // SRI LANKA DATA
// // ----------------------------------------
// const PROVINCES = [
//   { name: 'Western Province',       code: 'WP' },
//   { name: 'Central Province',       code: 'CP' },
//   { name: 'Southern Province',      code: 'SP' },
//   { name: 'Northern Province',      code: 'NP' },
//   { name: 'Eastern Province',       code: 'EP' },
//   { name: 'North Western Province', code: 'NWP' },
//   { name: 'North Central Province', code: 'NCP' },
//   { name: 'Uva Province',           code: 'UP' },
//   { name: 'Sabaragamuwa Province',  code: 'SGP' }
// ];

// // Each district: name, province index (0-8), and approx GPS center
// const DISTRICTS = [
//   // Western Province (0)
//   { name: 'Colombo',      pIdx: 0, lat: 6.9271,  lng: 79.8612 },
//   { name: 'Gampaha',      pIdx: 0, lat: 7.0873,  lng: 80.0144 },
//   { name: 'Kalutara',     pIdx: 0, lat: 6.5854,  lng: 79.9607 },
//   // Central Province (1)
//   { name: 'Kandy',        pIdx: 1, lat: 7.2906,  lng: 80.6337 },
//   { name: 'Matale',       pIdx: 1, lat: 7.4675,  lng: 80.6234 },
//   { name: 'Nuwara Eliya', pIdx: 1, lat: 6.9497,  lng: 80.7891 },
//   // Southern Province (2)
//   { name: 'Galle',        pIdx: 2, lat: 6.0535,  lng: 80.2210 },
//   { name: 'Matara',       pIdx: 2, lat: 5.9549,  lng: 80.5550 },
//   { name: 'Hambantota',   pIdx: 2, lat: 6.1241,  lng: 81.1185 },
//   // Northern Province (3)
//   { name: 'Jaffna',       pIdx: 3, lat: 9.6615,  lng: 80.0255 },
//   { name: 'Kilinochchi',  pIdx: 3, lat: 9.3803,  lng: 80.4037 },
//   { name: 'Mannar',       pIdx: 3, lat: 8.9811,  lng: 79.9044 },
//   { name: 'Mullaitivu',   pIdx: 3, lat: 9.2671,  lng: 80.8128 },
//   { name: 'Vavuniya',     pIdx: 3, lat: 8.7514,  lng: 80.4971 },
//   // Eastern Province (4)
//   { name: 'Ampara',       pIdx: 4, lat: 7.2916,  lng: 81.6724 },
//   { name: 'Batticaloa',   pIdx: 4, lat: 7.7170,  lng: 81.6924 },
//   { name: 'Trincomalee',  pIdx: 4, lat: 8.5922,  lng: 81.2152 },
//   // North Western Province (5)
//   { name: 'Kurunegala',   pIdx: 5, lat: 7.4867,  lng: 80.3647 },
//   { name: 'Puttalam',     pIdx: 5, lat: 8.0362,  lng: 79.8283 },
//   // North Central Province (6)
//   { name: 'Anuradhapura', pIdx: 6, lat: 8.3114,  lng: 80.4037 },
//   { name: 'Polonnaruwa',  pIdx: 6, lat: 7.9403,  lng: 81.0188 },
//   // Uva Province (7)
//   { name: 'Badulla',      pIdx: 7, lat: 6.9934,  lng: 81.0550 },
//   { name: 'Monaragala',   pIdx: 7, lat: 6.8728,  lng: 81.3507 },
//   // Sabaragamuwa Province (8)
//   { name: 'Kegalle',      pIdx: 8, lat: 7.2513,  lng: 80.3464 },
//   { name: 'Ratnapura',    pIdx: 8, lat: 6.6829,  lng: 80.3992 }
// ];

// const STATION_NAMES = [
//   'Fort Police Station', 'Main Police Station', 'Central Police Station',
//   'North Police Station', 'South Police Station', 'East Police Station',
//   'West Police Station', 'City Police Station', 'Town Police Station',
//   'Division Police Station', 'Sub Police Station', 'Area Police Station',
//   'Junction Police Station', 'Market Police Station', 'Harbor Police Station',
//   'Airport Police Station', 'Highway Police Station', 'Border Police Station',
//   'District Police Station', 'Regional Police Station', 'Provincial Police Station',
//   'Command Police Station', 'Rural Police Station', 'Coastal Police Station',
//   'Mountain Police Station'
// ];

// const DRIVER_FIRST_NAMES = [
//   'Kamal', 'Sunil', 'Nimal', 'Rohan', 'Amal', 'Priya', 'Saman', 'Dilan',
//   'Ravi', 'Gayan', 'Lahiru', 'Kasun', 'Chathura', 'Thilan', 'Nuwan',
//   'Chamara', 'Buddhika', 'Madara', 'Isuru', 'Dasun', 'Hasitha', 'Namal',
//   'Piyumi', 'Sachith', 'Upul', 'Chamin', 'Tharaka', 'Rajitha', 'Sampath',
//   'Harsha'
// ];

// const DRIVER_LAST_NAMES = [
//   'Perera', 'Silva', 'Fernando', 'De Silva', 'Dissanayake', 'Bandara',
//   'Rajapaksa', 'Wickramasinghe', 'Jayasuriya', 'Gunasekara', 'Amarasinghe',
//   'Senanayake', 'Rathnayake', 'Gunawardena', 'Jayawardena', 'Pathirana',
//   'Kumara', 'Madushanka', 'Lakshman', 'Priyantha'
// ];

// const PROVINCE_VEHICLE_PREFIXES = [
//   ['WP', 'CP', 'SP', 'NP', 'EP', 'NW', 'NC', 'UP', 'SG']
// ];
// const NUMBER_LETTERS = ['CAB', 'CAR', 'TUK', 'WHL', 'TRI', 'SLK', 'RID'];

// // ----------------------------------------
// // HELPER FUNCTIONS
// // ----------------------------------------
// const rand     = (arr)       => arr[Math.floor(Math.random() * arr.length)];
// const randInt  = (min, max)  => Math.floor(Math.random() * (max - min + 1)) + min;
// const randFlt  = (min, max)  => parseFloat((Math.random() * (max - min) + min).toFixed(6));

// // Random GPS near a center point (within ~5km)
// const randomNearby = (lat, lng) => ({
//   lat: parseFloat((lat + (Math.random() - 0.5) * 0.08).toFixed(6)),
//   lng: parseFloat((lng + (Math.random() - 0.5) * 0.08).toFixed(6))
// });

// // ----------------------------------------
// // MAIN SEED FUNCTION
// // ----------------------------------------
// async function seed() {
//   try {
//     console.log('\n🌱 Starting database seed...\n');

//     // Connect
//     await sequelize.authenticate();
//     console.log('✅ Database connected');

//     // Sync (create tables)
//     await sequelize.sync({ force: true }); // WARNING: drops and recreates all tables!
//     console.log('✅ Tables created fresh\n');

//     // ---- 1. PROVINCES ----
//     console.log('📍 Creating 9 provinces...');
//     const provinces = await Province.bulkCreate(PROVINCES);
//     console.log(`   ✅ ${provinces.length} provinces created`);

//     // ---- 2. DISTRICTS ----
//     console.log('📍 Creating 25 districts...');
//     const districtData = DISTRICTS.map(d => ({
//       name:        d.name,
//       province_id: provinces[d.pIdx].id
//     }));
//     const districts = await District.bulkCreate(districtData);
//     console.log(`   ✅ ${districts.length} districts created`);

//     // Store lat/lng for each district (for location generation)
//     const districtGPS = {};
//     districts.forEach((d, i) => {
//       districtGPS[d.id] = { lat: DISTRICTS[i].lat, lng: DISTRICTS[i].lng };
//     });

//     // ---- 3. POLICE STATIONS (1 per district = 25) ----
//     console.log('🚔 Creating 25 police stations...');
//     const stationData = districts.map((d, i) => ({
//       name:        `${d.name} ${STATION_NAMES[i]}`,
//       district_id: d.id,
//       address:     `${d.name}, Sri Lanka`,
//       phone:        `0${randInt(11, 91)}-${randInt(2000000, 9999999)}`
//     }));
//     const stations = await PoliceStation.bulkCreate(stationData);
//     console.log(`   ✅ ${stations.length} stations created`);

//     // ---- 4. USERS ----
//     console.log('👤 Creating users...');
//     const adminPass   = await bcrypt.hash('admin123', 12);
//     const officerPass = await bcrypt.hash('officer123', 12);

//     const users = await User.bulkCreate([
//       {
//         name:  'Super Admin',
//         email: 'admin@police.lk',
//         password: adminPass,
//         role: 'admin',
//         police_station_id: null
//       },
//       {
//         name:  'Officer Perera',
//         email: 'perera@police.lk',
//         password: officerPass,
//         role: 'officer',
//         police_station_id: stations[0].id
//       },
//       {
//         name:  'Officer Silva',
//         email: 'silva@police.lk',
//         password: officerPass,
//         role: 'officer',
//         police_station_id: stations[1].id
//       },
//       {
//         name:  'Officer Bandara',
//         email: 'bandara@police.lk',
//         password: officerPass,
//         role: 'officer',
//         police_station_id: stations[2].id
//       },
//       {
//         name:  'Officer Fernando',
//         email: 'fernando@police.lk',
//         password: officerPass,
//         role: 'officer',
//         police_station_id: stations[3].id
//       },
//       {
//         name:  'Device API User',
//         email: 'device@tracking.lk',
//         password: await bcrypt.hash('device123', 12),
//         role: 'device',
//         police_station_id: null
//       }
//     ]);
//     console.log(`   ✅ ${users.length} users created`);
//     console.log('   📋 Login credentials:');
//     console.log('      Admin:   admin@police.lk    / admin123');
//     console.log('      Officer: perera@police.lk   / officer123');
//     console.log('      Device:  device@tracking.lk / device123');

//     // ---- 5. VEHICLES (200 tuk-tuks) ----
//     console.log('\n🛺 Creating 200 vehicles...');
//     const vehicleData = [];
//     const provincePrefixes = ['WP', 'CP', 'SP', 'NP', 'EP', 'NW', 'NC', 'UP', 'SG'];

//     for (let i = 1; i <= 200; i++) {
//       const district       = districts[randInt(0, districts.length - 1)];
//       const provincePrefix = provincePrefixes[randInt(0, provincePrefixes.length - 1)];
//       const letters        = rand(NUMBER_LETTERS);
//       const regNum         = `${provincePrefix} ${letters}-${String(i).padStart(4, '0')}`;

//       vehicleData.push({
//         registration_number: regNum,
//         driver_name:  `${rand(DRIVER_FIRST_NAMES)} ${rand(DRIVER_LAST_NAMES)}`,
//         driver_phone: `07${randInt(1, 9)}${randInt(1000000, 9999999)}`,
//         driver_nic:   `${randInt(1960, 2002)}${String(randInt(1, 365)).padStart(3, '0')}${randInt(1000, 9999)}V`,
//         district_id:  district.id,
//         device_id:    `DEV-${String(i).padStart(4, '0')}`,
//         status:       Math.random() > 0.1 ? 'active' : 'inactive' // 90% active
//       });
//     }

//     const vehicles = await Vehicle.bulkCreate(vehicleData);
//     console.log(`   ✅ ${vehicles.length} vehicles created`);

//     // ---- 6. LOCATION HISTORY (7 days, every 2 hours per active vehicle) ----
//     console.log('\n📡 Generating 7 days of GPS location history...');
//     console.log('   This may take a minute...');

//     const activeVehicles = vehicles.filter(v => v.status === 'active');
//     const SEVEN_DAYS_AGO = new Date();
//     SEVEN_DAYS_AGO.setDate(SEVEN_DAYS_AGO.getDate() - 7);

//     const pings = [];
//     const PINGS_PER_DAY = 12; // every 2 hours = 12 pings per day
//     const TOTAL_PINGS   = activeVehicles.length * 7 * PINGS_PER_DAY;

//     for (const vehicle of activeVehicles) {
//       // Get the district's GPS center
//       const center   = districtGPS[vehicle.district_id] || { lat: 6.9271, lng: 79.8612 };
//       let currentLat = center.lat;
//       let currentLng = center.lng;

//       for (let day = 0; day < 7; day++) {
//         for (let ping = 0; ping < PINGS_PER_DAY; ping++) {
//           // Move slightly from previous position (simulates movement)
//           currentLat = parseFloat((currentLat + (Math.random() - 0.5) * 0.02).toFixed(6));
//           currentLng = parseFloat((currentLng + (Math.random() - 0.5) * 0.02).toFixed(6));

//           // Keep within Sri Lanka bounds
//           currentLat = Math.max(5.9, Math.min(9.9, currentLat));
//           currentLng = Math.max(79.5, Math.min(82.0, currentLng));

//           // Calculate timestamp: 7 days ago + day offset + ping offset
//           const pingTime = new Date(SEVEN_DAYS_AGO);
//           pingTime.setDate(pingTime.getDate() + day);
//           pingTime.setHours(pingTime.getHours() + (ping * 2));

//           pings.push({
//             vehicle_id: vehicle.id,
//             latitude:   currentLat,
//             longitude:  currentLng,
//             speed_kmh:  parseFloat((Math.random() * 50).toFixed(1)), // 0-50 km/h
//             heading:    parseFloat((Math.random() * 360).toFixed(1)),
//             pinged_at:  pingTime
//           });
//         }
//       }
//     }

//     // Insert in batches of 1000 to avoid memory issues
//     console.log(`   Inserting ${pings.length} pings in batches...`);
//     const BATCH_SIZE = 1000;
//     for (let i = 0; i < pings.length; i += BATCH_SIZE) {
//       const batch = pings.slice(i, i + BATCH_SIZE);
//       await LocationPing.bulkCreate(batch, { validate: false }); // skip validation for speed
//       process.stdout.write(`\r   Progress: ${Math.min(i + BATCH_SIZE, pings.length)}/${pings.length}`);
//     }

//     console.log(`\n   ✅ ${pings.length} location pings created!\n`);

//     // ---- SUMMARY ----
//     console.log('🎉 ============================================');
//     console.log('🎉  SEED COMPLETE!');
//     console.log('🎉 ============================================');
//     console.log(`   ✅ Provinces:       ${provinces.length}`);
//     console.log(`   ✅ Districts:       ${districts.length}`);
//     console.log(`   ✅ Police Stations: ${stations.length}`);
//     console.log(`   ✅ Users:           ${users.length}`);
//     console.log(`   ✅ Vehicles:        ${vehicles.length}`);
//     console.log(`   ✅ Location Pings:  ${pings.length}`);
//     console.log('');
//     console.log('   Now run: npm run dev');
//     console.log('   Then open: http://localhost:3000/api-docs');
//     console.log('');

//     process.exit(0);
//   } catch (error) {
//     console.error('\n❌ Seed failed:', error.message);
//     console.error(error);
//     process.exit(1);
//   }
// }

// seed();



// ================================================
// SEED SCRIPT — scripts/seed.js
// Creates all simulation data with REALISTIC patterns:
//
// - Tuk-tuks move more during morning rush (7-9am)
// - Lunch time movement (12-2pm)
// - Evening rush (4-7pm)
// - Night time: parked / minimal movement
// - Weekend: more leisure trips, less rush hours
// - Each vehicle mostly stays in its district
// - Speed varies: slow in traffic, faster on open roads
// - 10% of vehicles are inactive
//
// HOW TO RUN: npm run seed
// WARNING: This DELETES all existing data first!
// ================================================
require('dotenv').config();
const bcrypt   = require('bcryptjs');
const { sequelize } = require('../src/config/database');
require('../src/models/index');
const {
  Province, District, PoliceStation,
  User, Vehicle, LocationPing
} = require('../src/models');

// ─── SRI LANKA PROVINCES ───────────────────────────
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

// ─── ALL 25 DISTRICTS with GPS center coordinates ───
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

// ─── POLICE STATION NAMES ──────────────────────────
const STATION_SUFFIXES = [
  'Police Station', 'Police Station', 'Police Station',
  'Traffic Division', 'Sub Police Station',
  'Police Post', 'Division Office'
];

// ─── REALISTIC SRI LANKAN DRIVER NAMES ────────────
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
  'Weerasinghe','Samarasinghe','Kumarasinghe','Wijesinghe','Ranasinghe',
  'Liyanage','Mendis','Dias','Rodrigo','Fonseka','Pieris','Peiris'
];

const PROVINCE_PREFIXES = ['WP','CP','SP','NP','EP','NW','NC','UP','SG'];
const REG_LETTERS = ['CAB','TUK','WHL','TRI','RID','THW','SKL'];

// ─── HELPERS ───────────────────────────────────────
const rand    = arr         => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max)  => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp   = (v, min, max) => Math.max(min, Math.min(max, v));

// ─── REALISTIC MOVEMENT PATTERN ────────────────────
// Returns movement settings based on hour of day and day of week
// This creates realistic GPS tracks:
//   morning rush = fast, lots of movement
//   midday       = moderate
//   night        = parked / very slow
//   weekend      = less rush, more leisure
function getMovementProfile(hour, dayOfWeek) {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Night time: 11pm - 5am → mostly parked
  if (hour >= 23 || hour < 5) {
    return { moveChance: 0.15, maxMove: 0.002, speedMin: 0, speedMax: 5 };
  }
  // Morning rush: 7-9am weekday → fast movement
  if (!isWeekend && hour >= 7 && hour <= 9) {
    return { moveChance: 0.95, maxMove: 0.025, speedMin: 15, speedMax: 45 };
  }
  // Lunch: 12-2pm → moderate movement
  if (hour >= 12 && hour <= 14) {
    return { moveChance: 0.75, maxMove: 0.015, speedMin: 10, speedMax: 35 };
  }
  // Evening rush: 4-7pm weekday → fast movement
  if (!isWeekend && hour >= 16 && hour <= 19) {
    return { moveChance: 0.90, maxMove: 0.022, speedMin: 10, speedMax: 40 };
  }
  // Weekend daytime → leisure trips
  if (isWeekend && hour >= 8 && hour <= 20) {
    return { moveChance: 0.65, maxMove: 0.018, speedMin: 8, speedMax: 30 };
  }
  // Default: normal daytime
  return { moveChance: 0.60, maxMove: 0.012, speedMin: 5, speedMax: 30 };
}

// ─── MAIN SEED ─────────────────────────────────────
async function seed() {
  try {
    console.log('\n🌱 Starting database seed...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Tables created fresh\n');

    // 1. PROVINCES
    console.log('📍 Creating 9 provinces...');
    const provinces = await Province.bulkCreate(PROVINCES);
    console.log(`   ✅ ${provinces.length} provinces created`);

    // 2. DISTRICTS
    console.log('📍 Creating 25 districts...');
    const districtData = DISTRICTS.map(d => ({
      name:        d.name,
      province_id: provinces[d.pIdx].id
    }));
    const districts = await District.bulkCreate(districtData);
    console.log(`   ✅ ${districts.length} districts created`);

    // Store GPS centers per district ID
    const districtGPS = {};
    districts.forEach((d, i) => {
      districtGPS[d.id] = { lat: DISTRICTS[i].lat, lng: DISTRICTS[i].lng };
    });

    // 3. POLICE STATIONS (25 — at least 1 per district)
    console.log('🚔 Creating 25 police stations...');
    const stationData = districts.map((d, i) => ({
      name:        `${d.name} ${STATION_SUFFIXES[i % STATION_SUFFIXES.length]}`,
      district_id: d.id,
      address:     `No.${randInt(1, 200)}, Main Street, ${d.name}`,
      phone:        `0${randInt(11, 91)}-${randInt(2000000, 9999999)}`
    }));
    const stations = await PoliceStation.bulkCreate(stationData);
    console.log(`   ✅ ${stations.length} stations created`);

    // 4. USERS
    console.log('👤 Creating users...');
    const adminPass   = await bcrypt.hash('admin123',   12);
    const officerPass = await bcrypt.hash('officer123', 12);
    const devicePass  = await bcrypt.hash('device123',  12);

    const users = await User.bulkCreate([
      {
        name:  'Super Admin',
        email: 'admin@police.lk',
        password: adminPass,
        role: 'admin',
        police_station_id: null
      },
      {
        name:  'Officer Perera',
        email: 'perera@police.lk',
        password: officerPass,
        role: 'officer',
        police_station_id: stations[0].id
      },
      {
        name:  'Officer Silva',
        email: 'silva@police.lk',
        password: officerPass,
        role: 'officer',
        police_station_id: stations[1].id
      },
      {
        name:  'Officer Bandara',
        email: 'bandara@police.lk',
        password: officerPass,
        role: 'officer',
        police_station_id: stations[2].id
      },
      {
        name:  'Officer Fernando',
        email: 'fernando@police.lk',
        password: officerPass,
        role: 'officer',
        police_station_id: stations[3].id
      },
      {
        name:  'GPS Device Account',
        email: 'device@tracking.lk',
        password: devicePass,
        role: 'device',
        police_station_id: null
      }
    ]);
    console.log(`   ✅ ${users.length} users created`);
    console.log('   📋 Credentials:');
    console.log('      admin@police.lk    / admin123');
    console.log('      perera@police.lk   / officer123');
    console.log('      device@tracking.lk / device123');

    // 5. VEHICLES (200 tuk-tuks)
    console.log('\n🛺 Creating 200 vehicles...');
    const vehicleData = [];

    for (let i = 1; i <= 200; i++) {
      const district  = districts[randInt(0, districts.length - 1)];
      const prefix    = PROVINCE_PREFIXES[randInt(0, PROVINCE_PREFIXES.length - 1)];
      const letters   = rand(REG_LETTERS);
      const regNum    = `${prefix} ${letters}-${String(i).padStart(4, '0')}`;
      const yearBorn  = randInt(1970, 2000);
      const dayOfYear = String(randInt(1, 365)).padStart(3, '0');
      const nicSuffix = randInt(1000, 9999);

      vehicleData.push({
        registration_number: regNum,
        driver_name:  `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
        driver_phone: `07${randInt(0, 8)}${randInt(1000000, 9999999)}`,
        driver_nic:   `${yearBorn}${dayOfYear}${nicSuffix}V`,
        district_id:  district.id,
        device_id:    `DEV-${String(i).padStart(4, '0')}`,
        status:       i <= 180 ? 'active' : 'inactive' // 180 active, 20 inactive
      });
    }

    const vehicles = await Vehicle.bulkCreate(vehicleData);
    console.log(`   ✅ ${vehicles.length} vehicles created (180 active, 20 inactive)`);

    // 6. LOCATION HISTORY — 7 days with realistic patterns
    console.log('\n📡 Generating 7 days of realistic GPS location history...');
    console.log('   (Patterns: morning rush, lunch, evening rush, night parked)');
    console.log('   This takes 1-2 minutes...\n');

    const activeVehicles = vehicles.filter(v => v.status === 'active');
    const NOW = new Date();

    // Start 7 days ago at midnight
    const START = new Date(NOW);
    START.setDate(START.getDate() - 7);
    START.setHours(0, 0, 0, 0);

    const pings = [];

    // Each vehicle gets a ping every 2 hours for 7 days = 84 pings per vehicle
    // Total = 180 vehicles × 84 pings = ~15,120 pings
    for (const vehicle of activeVehicles) {
      const center = districtGPS[vehicle.district_id] || { lat: 6.9271, lng: 79.8612 };

      // Each vehicle starts near its district center
      let lat = center.lat + (Math.random() - 0.5) * 0.04;
      let lng = center.lng + (Math.random() - 0.5) * 0.04;

      for (let day = 0; day < 7; day++) {
        const pingDate = new Date(START);
        pingDate.setDate(pingDate.getDate() + day);
        const dayOfWeek = pingDate.getDay(); // 0=Sun, 6=Sat

        for (let hour = 0; hour < 24; hour += 2) {
          // Get realistic movement profile for this time
          const profile = getMovementProfile(hour, dayOfWeek);

          // Decide if vehicle is moving at this time
          const isMoving = Math.random() < profile.moveChance;

          if (isMoving) {
            // Move in a somewhat consistent direction
            lat += (Math.random() - 0.5) * profile.maxMove;
            lng += (Math.random() - 0.5) * profile.maxMove;
          }

          // Keep vehicle mostly within its district (~10km radius)
          // Occasionally allow longer trips (20% chance to drift further)
          const maxDrift = Math.random() < 0.2 ? 0.15 : 0.06;
          lat = clamp(lat, center.lat - maxDrift, center.lat + maxDrift);
          lng = clamp(lng, center.lng - maxDrift, center.lng + maxDrift);

          // Keep within Sri Lanka national bounds
          lat = clamp(lat, 5.9, 9.9);
          lng = clamp(lng, 79.5, 82.0);

          // Speed based on whether moving and time of day
          const speed = isMoving
            ? parseFloat((Math.random() * (profile.speedMax - profile.speedMin) + profile.speedMin).toFixed(1))
            : parseFloat((Math.random() * 3).toFixed(1)); // near zero if parked

          // Heading: if moving keep direction roughly consistent
          const heading = parseFloat((Math.random() * 360).toFixed(1));

          const pingTime = new Date(pingDate);
          pingTime.setHours(hour, randInt(0, 59), 0, 0);

          pings.push({
            vehicle_id: vehicle.id,
            latitude:   parseFloat(lat.toFixed(6)),
            longitude:  parseFloat(lng.toFixed(6)),
            speed_kmh:  speed,
            heading,
            pinged_at:  pingTime
          });
        }
      }
    }

    // Insert in batches of 500 to be safe
    console.log(`   Inserting ${pings.length} pings in batches...`);
    const BATCH = 500;
    for (let i = 0; i < pings.length; i += BATCH) {
      await LocationPing.bulkCreate(pings.slice(i, i + BATCH), { validate: false });
      process.stdout.write(`\r   Progress: ${Math.min(i + BATCH, pings.length)}/${pings.length}`);
    }

    console.log(`\n   ✅ ${pings.length} location pings created!\n`);

    // SUMMARY
    console.log('🎉 ============================================');
    console.log('🎉  SEED COMPLETE!');
    console.log('🎉 ============================================');
    console.log(`   Provinces:        ${provinces.length}`);
    console.log(`   Districts:        ${districts.length}`);
    console.log(`   Police Stations:  ${stations.length}`);
    console.log(`   Users:            ${users.length}`);
    console.log(`   Vehicles:         ${vehicles.length} (180 active, 20 inactive)`);
    console.log(`   Location Pings:   ${pings.length} (7 days, realistic patterns)`);
    console.log('');
    console.log('   Run: npm run dev');
    console.log('   Open: http://localhost:3000/api-docs');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();