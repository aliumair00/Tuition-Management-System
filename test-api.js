const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('🧪 Testing Tuition Institute Management System API...\n');
    
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    try {
      const healthResponse = await axios.get(`http://localhost:5000/`);
      console.log('✅ Server is running:', healthResponse.data.message);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      console.log('💡 Trying alternative health check...');
      try {
        const altHealthResponse = await axios.get(`${baseURL}`);
        console.log('✅ Alternative health check successful:', altHealthResponse.data.message);
      } catch (altError) {
        console.log('❌ Alternative health check also failed:', altError.message);
      }
    }
    
    // Test 2: Test login with different roles
    console.log('\n2️⃣ Testing authentication endpoints...');
    
    // Admin login test
    try {
      const adminLogin = await axios.post(`${baseURL}/auth/login`, {
        email: 'admin@school.com',
        password: 'password123'
      });
      console.log('✅ Admin login successful');
      console.log('Admin login response:', JSON.stringify(adminLogin.data, null, 2));
      if (adminLogin.data.accessToken) {
        console.log('Admin token:', adminLogin.data.accessToken.substring(0, 20) + '...');
        adminToken = adminLogin.data.accessToken;
        
        // Test admin functionality - get all users
        console.log('Testing admin user management...');
        try {
          const usersResponse = await axios.get(`${baseURL}/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          console.log('✅ Admin can access user data');
          console.log('Users response:', JSON.stringify(usersResponse.data, null, 2).substring(0, 200) + '...');
        } catch (error) {
          console.log('❌ Admin user management failed:', error.response?.data?.message || error.message);
        }
      } else {
        console.log('⚠️  No token returned in response');
      }
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }
    
    // Test 3: Test parent login and dashboard
    console.log('\n3️⃣ Testing parent functionality...');
    try {
      const parentLogin = await axios.post(`${baseURL}/auth/login`, {
        email: 'parent@example.com',
        password: 'password123'
      });
      console.log('✅ Parent login successful');
      console.log('Parent login response:', JSON.stringify(parentLogin.data, null, 2));
      
      // Test parent dashboard data
      const parentToken = parentLogin.data.accessToken;
      const childrenResponse = await axios.get(`${baseURL}/parent/children`, {
        headers: { Authorization: `Bearer ${parentToken}` }
      });
      console.log(`✅ Parent has ${childrenResponse.data.data.length} children`);
      
      const statsResponse = await axios.get(`${baseURL}/parent/dashboard-stats`, {
        headers: { Authorization: `Bearer ${parentToken}` }
      });
      console.log('✅ Parent dashboard stats retrieved');
      
    } catch (error) {
      console.log('❌ Parent functionality failed:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        console.log('💡 Parent login credentials may be incorrect or parent user does not exist');
      }
    }
    
    // Test 4: Test teacher functionality
    console.log('\n4️⃣ Testing teacher functionality...');
    try {
      const teacherLogin = await axios.post(`${baseURL}/auth/login`, {
        email: 'teacher@example.com',
        password: 'password123'
      });
      console.log('✅ Teacher login successful');
      console.log('Teacher login response:', JSON.stringify(teacherLogin.data, null, 2));
      
      const teacherToken = teacherLogin.data.accessToken;
      const classesResponse = await axios.get(`${baseURL}/classes`, {
        headers: { Authorization: `Bearer ${teacherToken}` }
      });
      console.log(`✅ Teacher has access to ${classesResponse.data.count} classes`);
      
    } catch (error) {
      console.log('❌ Teacher functionality failed:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        console.log('💡 Teacher login credentials may be incorrect or teacher user does not exist');
      }
    }
    
    // Test 5: Test student functionality
    console.log('\n5️⃣ Testing student functionality...');
    try {
      const studentLogin = await axios.post(`${baseURL}/auth/login`, {
        email: 'student@example.com',
        password: 'password123'
      });
      console.log('✅ Student login successful');
      console.log('Student login response:', JSON.stringify(studentLogin.data, null, 2));
      
      const studentToken = studentLogin.data.accessToken;
      const gradesResponse = await axios.get(`${baseURL}/results/my`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log('✅ Student can access their own results:', gradesResponse.data.count, 'results found');
    } catch (error) {
      console.log('❌ Student functionality failed:', error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        console.log('💡 Student login credentials may be incorrect or student user does not exist');
      }
    }
    
    console.log('\n🎉 API Testing Complete!');
    
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
  }
}

// Run the test
testAPI();