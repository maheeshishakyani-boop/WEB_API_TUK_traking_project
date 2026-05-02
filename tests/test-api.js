
// const http = require('http'); // built into Node.js, no install needed

// const BASE_URL = 'http://localhost:3000';
// let adminToken  = '';
// let officerToken = '';
// let createdVehicleId = '';
// let testsPassed = 0;
// let testsFailed = 0;

// // ----------------------------------------
// // HELPER: make an HTTP request
// // ----------------------------------------
// function request(method, path, body, token) {
//   return new Promise((resolve) => {
//     const bodyStr = body ? JSON.stringify(body) : '';
//     const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: path,
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(bodyStr)
//       }
//     };
//     if (token) {
//       options.headers['Authorization'] = `Bearer ${token}`;
//     }

//     const req = http.request(options, (res) => {
//       let data = '';
//       res.on('data', chunk => data += chunk);
//       res.on('end', () => {
//         try {
//           resolve({ status: res.statusCode, body: JSON.parse(data) });
//         } catch {
//           resolve({ status: res.statusCode, body: data });
//         }
//       });
//     });

//     req.on('error', () => {
//       resolve({ status: 0, body: { message: 'Connection failed - is server running?' } });
//     });

//     if (bodyStr) req.write(bodyStr);
//     req.end();
//   });
// }

// // ----------------------------------------
// // HELPER: print test result
// // ----------------------------------------
// function check(testName, condition, details) {
//   if (condition) {
//     console.log(`  ✅ PASS  ${testName}`);
//     testsPassed++;
//   } else {
//     console.log(`  ❌ FAIL  ${testName}`);
//     if (details) console.log(`         Details: ${details}`);
//     testsFailed++;
//   }
// }

// // ----------------------------------------
// // ALL TESTS
// // ----------------------------------------
// async function runTests() {
//   console.log('');
//   console.log('🧪 ================================================');
//   console.log('🧪  TUK-TUK API - AUTOMATED TEST SUITE');
//   console.log('🧪 ================================================');
//   console.log('');

//   // ========================================
//   // 1. HOME / HEALTH CHECK
//   // ========================================
//   console.log('📋 TEST GROUP 1: Health Check');
//   const home = await request('GET', '/');
//   check('API is running and responding', home.status === 200, JSON.stringify(home.body));
//   check('Response has success field',    home.body.success === true);
//   console.log('');

//   // ========================================
//   // 2. AUTHENTICATION TESTS
//   // ========================================
//   console.log('📋 TEST GROUP 2: Authentication');

//   // 2a. Register test (should fail - email exists from seed)
//   const dupReg = await request('POST', '/api/auth/register', {
//     name: 'Test User',
//     email: 'admin@police.lk',
//     password: 'admin123',
//     role: 'officer'
//   });
//   check('Duplicate email registration blocked (409)', dupReg.status === 409);

//   // 2b. Register missing fields
//   const badReg = await request('POST', '/api/auth/register', {
//     name: 'Test'
//     // missing email, password, role
//   });
//   check('Registration with missing fields blocked (400)', badReg.status === 400);

//   // 2c. Admin login - correct
//   const adminLogin = await request('POST', '/api/auth/login', {
//     email: 'admin@police.lk',
//     password: 'admin123'
//   });
//   check('Admin login with correct credentials (200)', adminLogin.status === 200);
//   check('Admin login returns a token',               !!adminLogin.body.token);
//   check('Admin login returns correct role (admin)',  adminLogin.body.data?.role === 'admin');
//   if (adminLogin.body.token) adminToken = adminLogin.body.token;

//   // 2d. Officer login
//   const officerLogin = await request('POST', '/api/auth/login', {
//     email: 'perera@police.lk',
//     password: 'officer123'
//   });
//   check('Officer login with correct credentials (200)', officerLogin.status === 200);
//   if (officerLogin.body.token) officerToken = officerLogin.body.token;

//   // 2e. Wrong password
//   const badLogin = await request('POST', '/api/auth/login', {
//     email: 'admin@police.lk',
//     password: 'wrongpassword'
//   });
//   check('Login with wrong password blocked (401)', badLogin.status === 401);

//   // 2f. Access protected route without token
//   const noToken = await request('GET', '/api/vehicles');
//   check('Protected route without token blocked (401)', noToken.status === 401);

//   // 2g. Get current user (me)
//   const me = await request('GET', '/api/auth/me', null, adminToken);
//   check('Get current user info (200)',     me.status === 200);
//   check('Returns correct user email', me.body.data?.email === 'admin@police.lk');
//   console.log('');

//   // ========================================
//   // 3. PROVINCES
//   // ========================================
//   console.log('📋 TEST GROUP 3: Provinces');

//   const provinces = await request('GET', '/api/provinces', null, adminToken);
//   check('Get all provinces (200)',           provinces.status === 200);
//   check('Returns 9 provinces',              provinces.body.count >= 9);
//   check('Provinces have name and code',     !!provinces.body.data?.[0]?.name && !!provinces.body.data?.[0]?.code);

//   const province1 = await request('GET', '/api/provinces/1', null, adminToken);
//   check('Get single province by ID (200)',  province1.status === 200);

//   const noProvince = await request('GET', '/api/provinces/9999', null, adminToken);
//   check('Non-existent province returns 404', noProvince.status === 404);

//   // Officer should NOT be able to create province
//   const officerCreate = await request('POST', '/api/provinces', { name: 'Test', code: 'TP' }, officerToken);
//   check('Officer cannot create province (403 forbidden)', officerCreate.status === 403);

//   // Admin CAN create
//   const newProvince = await request('POST', '/api/provinces', {
//     name: 'Test Province ' + Date.now(),
//     code: 'TP' + Date.now().toString().slice(-3)
//   }, adminToken);
//   check('Admin can create province (201)', newProvince.status === 201);
//   console.log('');

//   // ========================================
//   // 4. DISTRICTS
//   // ========================================
//   console.log('📋 TEST GROUP 4: Districts');

//   const districts = await request('GET', '/api/districts', null, adminToken);
//   check('Get all districts (200)',           districts.status === 200);
//   check('Returns 25 districts',             districts.body.count === 25);

//   // Filter by province
//   const filtered = await request('GET', '/api/districts?province_id=1', null, adminToken);
//   check('Filter districts by province_id',  filtered.status === 200);
//   check('Filtered result has fewer results', filtered.body.count < 25);

//   const district1 = await request('GET', '/api/districts/1', null, adminToken);
//   check('Get single district (200)',         district1.status === 200);
//   check('District includes province info',   !!district1.body.data?.province);
//   console.log('');

//   // ========================================
//   // 5. POLICE STATIONS
//   // ========================================
//   console.log('📋 TEST GROUP 5: Police Stations');

//   const stations = await request('GET', '/api/stations', null, adminToken);
//   check('Get all stations (200)',            stations.status === 200);
//   check('Returns 25+ stations',             stations.body.count >= 25);

//   const stationsFiltered = await request('GET', '/api/stations?district_id=1', null, adminToken);
//   check('Filter stations by district_id',   stationsFiltered.status === 200);

//   const station1 = await request('GET', '/api/stations/1', null, adminToken);
//   check('Get single station (200)',          station1.status === 200);
//   console.log('');

//   // ========================================
//   // 6. VEHICLES
//   // ========================================
//   console.log('📋 TEST GROUP 6: Vehicles');

//   const vehicles = await request('GET', '/api/vehicles', null, adminToken);
//   check('Get all vehicles (200)',            vehicles.status === 200);
//   check('Returns 200 vehicles',             vehicles.body.count >= 200);
//   check('Pagination works (page/totalPages)', !!vehicles.body.totalPages);

//   // Filtering
//   const activeVehicles = await request('GET', '/api/vehicles?status=active', null, adminToken);
//   check('Filter vehicles by status=active', activeVehicles.status === 200);

//   const districtVehicles = await request('GET', '/api/vehicles?district_id=1', null, adminToken);
//   check('Filter vehicles by district_id',   districtVehicles.status === 200);

//   const provinceVehicles = await request('GET', '/api/vehicles?province_id=1', null, adminToken);
//   check('Filter vehicles by province_id',   provinceVehicles.status === 200);

//   // Search
//   const searchVehicles = await request('GET', '/api/vehicles?search=WP', null, adminToken);
//   check('Search vehicles by registration',  searchVehicles.status === 200);

//   // Pagination
//   const page2 = await request('GET', '/api/vehicles?page=2&limit=10', null, adminToken);
//   check('Pagination - page 2 works',        page2.status === 200);
//   check('Page 2 shows page number 2',       page2.body.page === 2);

//   // Get single vehicle
//   const vehicle1 = await request('GET', '/api/vehicles/1', null, adminToken);
//   check('Get single vehicle (200)',         vehicle1.status === 200);
//   check('Vehicle has registration number',  !!vehicle1.body.data?.registration_number);
//   check('Vehicle has district info',        !!vehicle1.body.data?.district);

//   // Create vehicle (admin only)
//   const uniqueId = Date.now() + Math.floor(Math.random() * 9999);
// const newVehicle = await request('POST', '/api/vehicles', {
//   registration_number: 'TEST-' + uniqueId,
//   driver_name: 'Test Driver',
//   driver_phone: '0771234567',
//   driver_nic: 'TEST' + uniqueId,
//   district_id: 1
// }, adminToken);
// check('Admin can create vehicle (201)', newVehicle.status === 201);
//   if (newVehicle.body.data?.id) createdVehicleId = newVehicle.body.data.id;

//   // Officer cannot create vehicle
//   const officerVeh = await request('POST', '/api/vehicles', {
//     registration_number: 'TEST-VEH-002',
//     driver_name: 'Test',
//     district_id: 1
//   }, officerToken);
//   check('Officer cannot create vehicle (403)', officerVeh.status === 403);

//   // Create with missing fields
//   const badVehicle = await request('POST', '/api/vehicles', {
//     driver_name: 'No Registration'
//   }, adminToken);
//   check('Vehicle creation with missing fields blocked (400)', badVehicle.status === 400);

//   // Update vehicle
//   if (createdVehicleId) {
//     const updated = await request('PUT', `/api/vehicles/${createdVehicleId}`, {
//       driver_name: 'Updated Driver Name',
//       status: 'active'
//     }, adminToken);
//     check('Admin can update vehicle (200)', updated.status === 200);
//     check('Vehicle name was updated', updated.body.data?.driver_name === 'Updated Driver Name');
//   }
//   console.log('');

//   // ========================================
//   // 7. LOCATION / GPS TRACKING
//   // ========================================
//   console.log('📋 TEST GROUP 7: Location / GPS Tracking');

//   // Send a GPS ping (location update)
//   const ping = await request('POST', '/api/locations/ping', {
//     vehicle_id: 1,
//     latitude:   6.9271,
//     longitude:  79.8612,
//     speed_kmh:  35.5,
//     heading:    90
//   }, adminToken);
//   check('GPS ping recorded successfully (201)', ping.status === 201);
//   check('Ping has correct vehicle_id',          ping.body.data?.vehicle_id === 1);
//   check('Ping has latitude',                    !!ping.body.data?.latitude);

//   // Ping with missing fields
//   const badPing = await request('POST', '/api/locations/ping', {
//     vehicle_id: 1
//     // missing latitude and longitude
//   }, adminToken);
//   check('Ping with missing coordinates blocked (400)', badPing.status === 400);

//   // Get latest location for a vehicle
//   const latest = await request('GET', '/api/locations/1/latest', null, adminToken);
//   check('Get latest location for vehicle (200)',  latest.status === 200);
//   check('Latest has vehicle info',                !!latest.body.data?.vehicle);
//   check('Latest has GPS coordinates',             !!latest.body.data?.latest_location?.latitude);

//   // Get location history
//   const history = await request('GET', '/api/locations/1/history', null, adminToken);
//   check('Get location history (200)',             history.status === 200);
//   check('History has multiple pings',             history.body.count > 0);
//   check('History supports pagination',            !!history.body.totalPages);

//   // History with date filter
//   const dateHistory = await request(
//     'GET',
//     '/api/locations/1/history?start_date=2025-01-01&end_date=2026-12-31',
//     null,
//     adminToken
//   );
//   check('History with date range filter works',   dateHistory.status === 200);

//   // Live view - all vehicles with latest location
//   const live = await request('GET', '/api/locations/live', null, adminToken);
//   check('Live view of all vehicles (200)',         live.status === 200);
//   check('Live view returns multiple vehicles',     live.body.count > 0);

//   // Live view filtered by district
//   const liveDistrict = await request('GET', '/api/locations/live?district_id=1', null, adminToken);
//   check('Live view filtered by district_id',       liveDistrict.status === 200);

//   // Non-existent vehicle
//   const noVeh = await request('GET', '/api/locations/9999/latest', null, adminToken);
//   check('Location for non-existent vehicle returns 404', noVeh.status === 404);
//   console.log('');

//   // ========================================
//   // 8. 404 ROUTE
//   // ========================================
//   console.log('📋 TEST GROUP 8: Error Handling');

//   const notFound = await request('GET', '/api/this-does-not-exist', null, adminToken);
//   check('Unknown route returns 404',        notFound.status === 404);
//   check('404 has success: false',           notFound.body.success === false);
//   console.log('');

//   // ========================================
//   // FINAL SUMMARY
//   // ========================================
//   const total = testsPassed + testsFailed;
//   console.log('🏁 ================================================');
//   console.log(`🏁  TEST RESULTS: ${testsPassed} passed, ${testsFailed} failed out of ${total} tests`);
//   console.log('🏁 ================================================');

//   if (testsFailed === 0) {
//     console.log('');
//     console.log('🎉 ALL TESTS PASSED! Your API is working perfectly!');
//     console.log('');
//   } else {
//     console.log('');
//     console.log(`⚠️  ${testsFailed} test(s) failed. Check the ❌ lines above.`);
//     console.log('');
//   }
// }

// // Run everything
// runTests().catch(err => {
//   console.error('❌ Test runner crashed:', err.message);
//   console.error('   Make sure your server is running first: npm run dev');
// });



const http = require('http'); // built into Node.js, no install needed

const BASE_URL = 'http://localhost:3000';
let adminToken  = '';
let officerToken = '';
let createdVehicleId = '';
let testsPassed = 0;
let testsFailed = 0;

// ----------------------------------------
// HELPER: make an HTTP request
// ----------------------------------------
function request(method, path, body, token) {
  return new Promise((resolve) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', () => {
      resolve({ status: 0, body: { message: 'Connection failed - is server running?' } });
    });

    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ----------------------------------------
// HELPER: print test result
// ----------------------------------------
function check(testName, condition, details) {
  if (condition) {
    console.log(`  ✅ PASS  ${testName}`);
    testsPassed++;
  } else {
    console.log(`  ❌ FAIL  ${testName}`);
    if (details) console.log(`         Details: ${details}`);
    testsFailed++;
  }
}

// ----------------------------------------
// ALL TESTS
// ----------------------------------------
async function runTests() {
  console.log('');
  console.log('🧪 ================================================');
  console.log('🧪  TUK-TUK API - AUTOMATED TEST SUITE');
  console.log('🧪 ================================================');
  console.log('');

  // ========================================
  // 1. HOME / HEALTH CHECK
  // ========================================
  console.log('📋 TEST GROUP 1: Health Check');
  const home = await request('GET', '/');
  check('API is running and responding', home.status === 200, JSON.stringify(home.body));
  check('Response has success field',    home.body.success === true);
  console.log('');

  // ========================================
  // 2. AUTHENTICATION TESTS
  // ========================================
  console.log('📋 TEST GROUP 2: Authentication');

  // 2a. Register WITHOUT token - must be blocked (401) because register is admin-only now
  const noTokenReg = await request('POST', '/api/auth/register', {
    name: 'Test User', 
    email: 'test@test.com', 
    password: 'test123', 
    role: 'officer'
  });
  check('Register without token blocked (401)', noTokenReg.status === 401);

  // 2b. Register missing fields - we'll test this later with admin token

  // 2c. Admin login - correct
  const adminLogin = await request('POST', '/api/auth/login', {
    email: 'admin@police.lk',
    password: 'admin123'
  });
  check('Admin login with correct credentials (200)', adminLogin.status === 200);
  check('Admin login returns a token',               !!adminLogin.body.token);
  check('Admin login returns correct role (admin)',  adminLogin.body.data?.role === 'admin');
  if (adminLogin.body.token) adminToken = adminLogin.body.token;

  // 2d. Officer login
  const officerLogin = await request('POST', '/api/auth/login', {
    email: 'perera@police.lk',
    password: 'officer123'
  });
  check('Officer login with correct credentials (200)', officerLogin.status === 200);
  if (officerLogin.body.token) officerToken = officerLogin.body.token;

  // 2e. Wrong password
  const badLogin = await request('POST', '/api/auth/login', {
    email: 'admin@police.lk',
    password: 'wrongpassword'
  });
  check('Login with wrong password blocked (401)', badLogin.status === 401);

  // 2f. Access protected route without token
  const noToken = await request('GET', '/api/vehicles');
  check('Protected route without token blocked (401)', noToken.status === 401);

  // 2g. Get current user (me)
  const me = await request('GET', '/api/auth/me', null, adminToken);
  check('Get current user info (200)',     me.status === 200);
  check('Returns correct user email', me.body.data?.email === 'admin@police.lk');

  // 2h. Admin register with duplicate email - must return 409
  const dupReg = await request('POST', '/api/auth/register', {
    name: 'Test', 
    email: 'admin@police.lk', 
    password: 'admin123', 
    role: 'officer'
  }, adminToken);
  check('Duplicate email registration blocked (409)', dupReg.status === 409);

  // 2i. Admin register with missing fields - must return 400
  const badReg = await request('POST', '/api/auth/register', {
    name: 'Test'
  }, adminToken);
  check('Registration with missing fields blocked (400)', badReg.status === 400);
  console.log('');

  // ========================================
  // 3. PROVINCES
  // ========================================
  console.log('📋 TEST GROUP 3: Provinces');

  const provinces = await request('GET', '/api/provinces', null, adminToken);
  check('Get all provinces (200)',           provinces.status === 200);
  check('Returns 9 provinces',              provinces.body.count >= 9);
  check('Provinces have name and code',     !!provinces.body.data?.[0]?.name && !!provinces.body.data?.[0]?.code);

  const province1 = await request('GET', '/api/provinces/1', null, adminToken);
  check('Get single province by ID (200)',  province1.status === 200);

  const noProvince = await request('GET', '/api/provinces/9999', null, adminToken);
  check('Non-existent province returns 404', noProvince.status === 404);

  // Officer should NOT be able to create province
  const officerCreate = await request('POST', '/api/provinces', { name: 'Test', code: 'TP' }, officerToken);
  check('Officer cannot create province (403 forbidden)', officerCreate.status === 403);

  // Admin CAN create
  const newProvince = await request('POST', '/api/provinces', {
    name: 'Test Province ' + Date.now(),
    code: 'TP' + Date.now().toString().slice(-3)
  }, adminToken);
  check('Admin can create province (201)', newProvince.status === 201);
  console.log('');

  // ========================================
  // 4. DISTRICTS
  // ========================================
  console.log('📋 TEST GROUP 4: Districts');

  const districts = await request('GET', '/api/districts', null, adminToken);
  check('Get all districts (200)',           districts.status === 200);
  check('Returns 25 districts',             districts.body.count === 25);

  // Filter by province
  const filtered = await request('GET', '/api/districts?province_id=1', null, adminToken);
  check('Filter districts by province_id',  filtered.status === 200);
  check('Filtered result has fewer results', filtered.body.count < 25);

  const district1 = await request('GET', '/api/districts/1', null, adminToken);
  check('Get single district (200)',         district1.status === 200);
  check('District includes province info',   !!district1.body.data?.province);
  console.log('');

  // ========================================
  // 5. POLICE STATIONS
  // ========================================
  console.log('📋 TEST GROUP 5: Police Stations');

  const stations = await request('GET', '/api/stations', null, adminToken);
  check('Get all stations (200)',            stations.status === 200);
  check('Returns 25+ stations',             stations.body.count >= 25);

  const stationsFiltered = await request('GET', '/api/stations?district_id=1', null, adminToken);
  check('Filter stations by district_id',   stationsFiltered.status === 200);

  const station1 = await request('GET', '/api/stations/1', null, adminToken);
  check('Get single station (200)',          station1.status === 200);
  console.log('');

  // ========================================
  // 6. VEHICLES
  // ========================================
  console.log('📋 TEST GROUP 6: Vehicles');

  const vehicles = await request('GET', '/api/vehicles', null, adminToken);
  check('Get all vehicles (200)',            vehicles.status === 200);
  check('Returns 200 vehicles',             vehicles.body.count >= 200);
  check('Pagination works (page/totalPages)', !!vehicles.body.totalPages);

  // Filtering
  const activeVehicles = await request('GET', '/api/vehicles?status=active', null, adminToken);
  check('Filter vehicles by status=active', activeVehicles.status === 200);

  const districtVehicles = await request('GET', '/api/vehicles?district_id=1', null, adminToken);
  check('Filter vehicles by district_id',   districtVehicles.status === 200);

  const provinceVehicles = await request('GET', '/api/vehicles?province_id=1', null, adminToken);
  check('Filter vehicles by province_id',   provinceVehicles.status === 200);

  // Search
  const searchVehicles = await request('GET', '/api/vehicles?search=WP', null, adminToken);
  check('Search vehicles by registration',  searchVehicles.status === 200);

  // Pagination
  const page2 = await request('GET', '/api/vehicles?page=2&limit=10', null, adminToken);
  check('Pagination - page 2 works',        page2.status === 200);
  check('Page 2 shows page number 2',       page2.body.page === 2);

  // Get single vehicle
  const vehicle1 = await request('GET', '/api/vehicles/1', null, adminToken);
  check('Get single vehicle (200)',         vehicle1.status === 200);
  check('Vehicle has registration number',  !!vehicle1.body.data?.registration_number);
  check('Vehicle has district info',        !!vehicle1.body.data?.district);

  // Create vehicle (admin only)
  const uniqueId = Date.now() + Math.floor(Math.random() * 9999);
  const newVehicle = await request('POST', '/api/vehicles', {
    registration_number: 'TEST-' + uniqueId,
    driver_name: 'Test Driver',
    driver_phone: '0771234567',
    driver_nic: 'TEST' + uniqueId,
    district_id: 1
  }, adminToken);
  check('Admin can create vehicle (201)', newVehicle.status === 201);
  if (newVehicle.body.data?.id) createdVehicleId = newVehicle.body.data.id;

  // Officer cannot create vehicle
  const officerVeh = await request('POST', '/api/vehicles', {
    registration_number: 'TEST-VEH-002',
    driver_name: 'Test',
    district_id: 1
  }, officerToken);
  check('Officer cannot create vehicle (403)', officerVeh.status === 403);

  // Create with missing fields
  const badVehicle = await request('POST', '/api/vehicles', {
    driver_name: 'No Registration'
  }, adminToken);
  check('Vehicle creation with missing fields blocked (400)', badVehicle.status === 400);

  // Update vehicle
  if (createdVehicleId) {
    const updated = await request('PUT', `/api/vehicles/${createdVehicleId}`, {
      driver_name: 'Updated Driver Name',
      status: 'active'
    }, adminToken);
    check('Admin can update vehicle (200)', updated.status === 200);
    check('Vehicle name was updated', updated.body.data?.driver_name === 'Updated Driver Name');
  }
  console.log('');

  // ========================================
  // 7. LOCATION / GPS TRACKING
  // ========================================
  console.log('📋 TEST GROUP 7: Location / GPS Tracking');

  // Send a GPS ping (location update)
  const ping = await request('POST', '/api/locations/ping', {
    vehicle_id: 1,
    latitude:   6.9271,
    longitude:  79.8612,
    speed_kmh:  35.5,
    heading:    90
  }, adminToken);
  check('GPS ping recorded successfully (201)', ping.status === 201);
  check('Ping has correct vehicle_id',          ping.body.data?.vehicle_id === 1);
  check('Ping has latitude',                    !!ping.body.data?.latitude);

  // Ping with missing fields
  const badPing = await request('POST', '/api/locations/ping', {
    vehicle_id: 1
    // missing latitude and longitude
  }, adminToken);
  check('Ping with missing coordinates blocked (400)', badPing.status === 400);

  // Get latest location for a vehicle
  const latest = await request('GET', '/api/locations/1/latest', null, adminToken);
  check('Get latest location for vehicle (200)',  latest.status === 200);
  check('Latest has vehicle info',                !!latest.body.data?.vehicle);
  check('Latest has GPS coordinates',             !!latest.body.data?.latest_location?.latitude);

  // Get location history
  const history = await request('GET', '/api/locations/1/history', null, adminToken);
  check('Get location history (200)',             history.status === 200);
  check('History has multiple pings',             history.body.count > 0);
  check('History supports pagination',            !!history.body.totalPages);

  // History with date filter
  const dateHistory = await request(
    'GET',
    '/api/locations/1/history?start_date=2025-01-01&end_date=2026-12-31',
    null,
    adminToken
  );
  check('History with date range filter works',   dateHistory.status === 200);

  // Live view - all vehicles with latest location
  const live = await request('GET', '/api/locations/live', null, adminToken);
  check('Live view of all vehicles (200)',         live.status === 200);
  check('Live view returns multiple vehicles',     live.body.count > 0);

  // Live view filtered by district
  const liveDistrict = await request('GET', '/api/locations/live?district_id=1', null, adminToken);
  check('Live view filtered by district_id',       liveDistrict.status === 200);

  // Non-existent vehicle
  const noVeh = await request('GET', '/api/locations/9999/latest', null, adminToken);
  check('Location for non-existent vehicle returns 404', noVeh.status === 404);
  console.log('');

  // ========================================
  // 8. 404 ROUTE
  // ========================================
  console.log('📋 TEST GROUP 8: Error Handling');

  const notFound = await request('GET', '/api/this-does-not-exist', null, adminToken);
  check('Unknown route returns 404',        notFound.status === 404);
  check('404 has success: false',           notFound.body.success === false);
  console.log('');

  // ========================================
  // FINAL SUMMARY
  // ========================================
  const total = testsPassed + testsFailed;
  console.log('🏁 ================================================');
  console.log(`🏁  TEST RESULTS: ${testsPassed} passed, ${testsFailed} failed out of ${total} tests`);
  console.log('🏁 ================================================');

  if (testsFailed === 0) {
    console.log('');
    console.log('🎉 ALL TESTS PASSED! Your API is working perfectly!');
    console.log('');
  } else {
    console.log('');
    console.log(`⚠️  ${testsFailed} test(s) failed. Check the ❌ lines above.`);
    console.log('');
  }
}

// Run everything
runTests().catch(err => {
  console.error('❌ Test runner crashed:', err.message);
  console.error('   Make sure your server is running first: npm run dev');
});