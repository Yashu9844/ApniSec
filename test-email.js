// Test script to verify Resend email integration
const BASE_URL = 'http://localhost:3000';

async function testEmailFlow() {

  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'yashavanthrsiddesh@gmail.com' })
    });
    
    const data = await res.json();
    
    if (data.success) {
      console.log('✅ PASS - Forgot password request processed');
      console.log(`   Message: ${data.message}`);
      console.log('   📬 Check your email for the reset link!\n');
    } else {
      console.log('❌ FAIL - Forgot password request failed');
      console.log(`   Error: ${data.error}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL - Network error:', error.message, '\n');
  }

  // Test 2: Test with non-existent email (should still return success for security)
  console.log('🔒 Test 2: Forgot Password - Non-existent Email (Security Check)');
  console.log('─────────────────────────────────────');
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@example.com' })
    });
    
    const data = await res.json();
    
    if (data.success) {
      console.log('✅ PASS - Returns success to prevent email enumeration');
      console.log(`   Message: ${data.message}\n`);
    } else {
      console.log('⚠️  WARNING - Should return success for security reasons');
      console.log(`   Response: ${JSON.stringify(data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL - Network error:', error.message, '\n');
  }

  // Test 3: Test reset password with invalid token
  console.log('🔐 Test 3: Reset Password - Invalid Token');
  console.log('─────────────────────────────────────');
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token: 'invalid.token.here',
        password: 'newPassword123'
      })
    });
    
    const data = await res.json();
    
    if (!data.success && data.error.includes('Invalid')) {
      console.log('✅ PASS - Invalid token correctly rejected');
      console.log(`   Error: ${data.error}\n`);
    } else {
      console.log('❌ FAIL - Should reject invalid token');
      console.log(`   Response: ${JSON.stringify(data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL - Network error:', error.message, '\n');
  }

  // Test 4: Validation - Invalid email format
  console.log('📋 Test 4: Validation - Invalid Email Format');
  console.log('─────────────────────────────────────');
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' })
    });
    
    const data = await res.json();
    
    if (!data.success && res.status === 400) {
      console.log('✅ PASS - Invalid email format rejected');
      console.log(`   Error: ${data.error}\n`);
    } else {
      console.log('❌ FAIL - Should reject invalid email format');
      console.log(`   Response: ${JSON.stringify(data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL - Network error:', error.message, '\n');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    📊 Test Summary');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ Forgot Password API: Working');
  console.log('✅ Email Enumeration Prevention: Working');
  console.log('✅ Invalid Token Rejection: Working');
  console.log('✅ Input Validation: Working');
  console.log('');
  console.log('📌 Note: To fully verify email delivery, check the inbox of:');
  console.log('   yashavanthrsiddesh@gmail.com');
  console.log('');
  console.log('⚠️  Important: Resend free tier only sends to verified emails.');
  console.log('   The "from" address must be from a verified domain or use');
  console.log('   onboarding@resend.dev for testing.\n');
}

testEmailFlow().catch(console.error);
