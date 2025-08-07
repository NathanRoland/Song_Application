#!/usr/bin/env python3
"""
Test script to verify SQLAlchemy compatibility
"""
import sys

def test_imports():
    """Test that all required modules can be imported"""
    print("🔍 Testing SQLAlchemy imports...")
    
    try:
        from sqlalchemy import create_engine, select, delete, func, update, text
        print("✅ SQLAlchemy core imports successful")
    except Exception as e:
        print(f"❌ SQLAlchemy core import failed: {e}")
        return False
    
    try:
        from sqlalchemy.orm import Session
        print("✅ SQLAlchemy ORM imports successful")
    except Exception as e:
        print(f"❌ SQLAlchemy ORM import failed: {e}")
        return False
    
    try:
        from sqlalchemy.exc import PendingRollbackError, IntegrityError
        print("✅ SQLAlchemy exceptions imports successful")
    except Exception as e:
        print(f"❌ SQLAlchemy exceptions import failed: {e}")
        return False
    
    try:
        from classes import Base, User
        print("✅ Database models imports successful")
    except Exception as e:
        print(f"❌ Database models import failed: {e}")
        return False
    
    try:
        from database_manager import engine, get_session_with_retry
        print("✅ Database manager imports successful")
    except Exception as e:
        print(f"❌ Database manager import failed: {e}")
        return False
    
    return True

def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    try:
        from database_manager import test_connection
        result = test_connection()
        if result:
            print("✅ Database connection successful")
            return True
        else:
            print("❌ Database connection failed")
            return False
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False

def test_app_import():
    """Test Flask app import"""
    print("\n🔍 Testing Flask app import...")
    try:
        from app import app
        print("✅ Flask app imported successfully")
        return True
    except Exception as e:
        print(f"❌ Flask app import failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 SQLAlchemy Compatibility Test Suite")
    print("=" * 50)
    
    tests = [
        ("Imports", test_imports),
        ("Database Connection", test_database_connection),
        ("Flask App", test_app_import)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    all_passed = True
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All tests passed! Ready for deployment.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 