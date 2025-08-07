#!/usr/bin/env python3
"""
Test script to verify Render deployment configuration
"""

import os
import sys

def test_imports():
    """Test that all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        from app import app
        print("✅ Flask app imported successfully")
    except Exception as e:
        print(f"❌ Failed to import Flask app: {e}")
        return False
    
    try:
        from database_manager import test_connection
        print("✅ Database manager imported successfully")
    except Exception as e:
        print(f"❌ Failed to import database manager: {e}")
        return False
    
    return True

def test_environment():
    """Test environment variables"""
    print("\n🔍 Testing environment...")
    
    port = os.environ.get("PORT", "5001")
    print(f"✅ PORT: {port}")
    
    flask_env = os.environ.get("FLASK_ENV", "production")
    print(f"✅ FLASK_ENV: {flask_env}")
    
    database_url = os.environ.get("DATABASE_URL", "Not set")
    print(f"✅ DATABASE_URL: {'Set' if database_url != 'Not set' else 'Not set'}")
    
    return True

def test_database():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    
    try:
        from database_manager import test_connection
        result = test_connection()
        if result:
            print("✅ Database connection successful")
        else:
            print("❌ Database connection failed")
        return result
    except Exception as e:
        print(f"❌ Database test error: {e}")
        return False

def test_flask_config():
    """Test Flask configuration"""
    print("\n🔍 Testing Flask configuration...")
    
    try:
        from app import app
        print(f"✅ Flask app name: {app.name}")
        print(f"✅ Flask debug mode: {app.debug}")
        print(f"✅ Flask secret key: {'Set' if app.secret_key else 'Not set'}")
        return True
    except Exception as e:
        print(f"❌ Flask config error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Render Deployment Test Suite")
    print("=" * 40)
    
    tests = [
        ("Imports", test_imports),
        ("Environment", test_environment),
        ("Database", test_database),
        ("Flask Config", test_flask_config)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 40)
    print("📊 Test Results:")
    
    all_passed = True
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 40)
    if all_passed:
        print("🎉 All tests passed! Ready for Render deployment.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 