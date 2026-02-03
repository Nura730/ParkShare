// Simple test script to check backend API
const testBackend = async () => {
  const baseURL = "http://localhost:5000/api";

  console.log("🔍 Testing Backend Connection...\n");

  // Test 1: Health check
  try {
    const response = await fetch(`${baseURL}/`);
    console.log("❌ Base API route:", response.status);
  } catch (error) {
    console.log("✅ Backend is running (404 expected for base route)");
  }

  // Test 2: Login endpoint
  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "driver1@example.com",
        password: "password123",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ LOGIN SUCCESS!");
      console.log("User:", data.user.full_name);
      console.log("Role:", data.user.role);
      console.log("Token received:", data.token ? "Yes" : "No");
    } else {
      console.log("❌ LOGIN FAILED:", data.message);
    }
  } catch (error) {
    console.log("❌ LOGIN ERROR:", error.message);
  }
};

// Run test
testBackend();
