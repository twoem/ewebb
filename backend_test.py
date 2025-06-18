import requests
import json
import time
import uuid
from datetime import datetime

class EwebbAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, auth=False):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            
            result = {
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        result["response"] = response.json()
                    except:
                        result["response"] = response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.text:
                    try:
                        result["error"] = response.json()
                    except:
                        result["error"] = response.text
            
            self.test_results.append(result)
            return success, response
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "success": False,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, None

    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "/api/health",
            200
        )
        if success:
            data = response.json()
            if data.get("status") == "healthy":
                print("✅ Health check response contains 'healthy' status")
            else:
                print("❌ Health check response does not contain 'healthy' status")
        return success

    def test_contact_submission(self, name, email, phone, subject, message):
        """Test contact form submission"""
        data = {
            "name": name,
            "email": email,
            "phone": phone,
            "subject": subject,
            "message": message
        }
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "/api/contact",
            200,
            data=data
        )
        if success:
            data = response.json()
            if data.get("success") == True:
                print("✅ Contact form submission successful")
            else:
                print("❌ Contact form submission response does not indicate success")
        return success

    def test_admin_login(self, username, password):
        """Test admin login"""
        data = {
            "username": username,
            "password": password
        }
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/api/admin/login",
            200,
            data=data
        )
        if success:
            data = response.json()
            if "access_token" in data:
                self.token = data["access_token"]
                print(f"✅ Admin login successful, token received")
                return True
            else:
                print("❌ Admin login response does not contain access token")
        return False

    def test_get_contacts(self):
        """Test getting contacts (requires authentication)"""
        if not self.token:
            print("❌ Cannot test get contacts - no authentication token")
            return False
        
        success, response = self.run_test(
            "Get Contacts",
            "GET",
            "/api/admin/contacts",
            200,
            auth=True
        )
        if success:
            data = response.json()
            if "contacts" in data:
                print(f"✅ Retrieved {len(data['contacts'])} contacts")
            else:
                print("❌ Get contacts response does not contain contacts list")
        return success

    def test_get_documents(self):
        """Test getting public documents"""
        success, response = self.run_test(
            "Get Public Documents",
            "GET",
            "/api/documents",
            200
        )
        if success:
            data = response.json()
            if "documents" in data:
                print(f"✅ Retrieved {len(data['documents'])} public documents")
            else:
                print("❌ Get documents response does not contain documents list")
        return success

    def test_get_admin_documents(self):
        """Test getting admin documents (requires authentication)"""
        if not self.token:
            print("❌ Cannot test get admin documents - no authentication token")
            return False
        
        success, response = self.run_test(
            "Get Admin Documents",
            "GET",
            "/api/admin/documents",
            200,
            auth=True
        )
        if success:
            data = response.json()
            if "documents" in data:
                print(f"✅ Retrieved {len(data['documents'])} admin documents")
            else:
                print("❌ Get admin documents response does not contain documents list")
        return success

    def print_summary(self):
        """Print a summary of the test results"""
        print("\n" + "="*50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*50)
        
        if self.tests_passed == self.tests_run:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['name']} ({result['method']} {result['endpoint']})")
                    if "error" in result:
                        print(f"    Error: {result['error']}")
        print("="*50)

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "http://localhost:8001"
    
    # Read the REACT_APP_BACKEND_URL from the frontend .env file
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    backend_url = line.strip().split('=')[1]
                    break
    except Exception as e:
        print(f"Warning: Could not read backend URL from .env file: {e}")
        print(f"Using default backend URL: {backend_url}")
    
    print(f"🚀 Starting EWEBB API tests against {backend_url}")
    tester = EwebbAPITester(backend_url)
    
    # Test health check
    tester.test_health_check()
    
    # Test contact form submission
    tester.test_contact_submission(
        name="Test User",
        email="test@ewebb.com",
        phone="254700000000",
        subject="Testing Contact Form",
        message="This is a test message to verify the contact form works properly"
    )
    
    # Test admin login
    admin_login_success = tester.test_admin_login("Babuu", "Pass@2025")
    
    # If login successful, test authenticated endpoints
    if admin_login_success:
        tester.test_get_contacts()
        tester.test_get_admin_documents()
    
    # Test public endpoints
    tester.test_get_documents()
    
    # Print summary
    tester.print_summary()
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    main()