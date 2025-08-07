#!/usr/bin/env python3
"""
Test script to verify psycopg3 connection with Python 3.13
"""
import sys
import os

def test_psycopg3_import():
    """Test that psycopg3 can be imported"""
    print("🔍 Testing psycopg3 import...")
    try:
        import psycopg
        print(f"✅ psycopg3 imported successfully, version: {psycopg.__version__}")
        return True
    except ImportError as e:
        print(f"❌ psycopg3 import failed: {e}")
        return False

def test_sqlalchemy_psycopg3():
    """Test SQLAlchemy with psycopg3 dialect"""
    print("\n🔍 Testing SQLAlchemy psycopg3 dialect...")
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.dialects.postgresql import psycopg
        print("✅ SQLAlchemy psycopg3 dialect imported successfully")
        return True
    except Exception as e:
        print(f"❌ SQLAlchemy psycopg3 dialect failed: {e}")
        return False

def test_database_manager_psycopg3():
    """Test database manager with psycopg3"""
    print("\n🔍 Testing database manager with psycopg3...")
    try:
        from database_manager import engine, test_connection
        print("✅ Database manager imported successfully")
        
        # Test connection
        result = test_connection()
        if result:
            print("✅ Database connection successful with psycopg3")
            return True
        else:
            print("❌ Database connection failed")
            return False
    except Exception as e:
        print(f"❌ Database manager test failed: {e}")
        return False

def test_environment_variables():
    """Test environment variables"""
    print("\n🔍 Testing environment variables...")
    database_url = os.getenv("DATABASE_URL")
    database_url_unpooled = os.getenv("DATABASE_URL_UNPOOLED")
    
    if database_url:
        print(f"✅ DATABASE_URL: {'Set' if database_url else 'Not set'}")
        # Check if it's PostgreSQL
        if database_url.startswith('postgresql'):
            print("✅ DATABASE_URL is PostgreSQL")
        else:
            print("⚠️  DATABASE_URL is not PostgreSQL")
    else:
        print("⚠️  DATABASE_URL not set")
    
    if database_url_unpooled:
        print(f"✅ DATABASE_URL_UNPOOLED: {'Set' if database_url_unpooled else 'Not set'}")
    else:
        print("⚠️  DATABASE_URL_UNPOOLED not set")
    
    return bool(database_url or database_url_unpooled)

def main():
    """Run all tests"""
    print("🚀 psycopg3 Connection Test Suite")
    print("=" * 50)
    
    tests = [
        ("psycopg3 Import", test_psycopg3_import),
        ("SQLAlchemy psycopg3", test_sqlalchemy_psycopg3),
        ("Environment Variables", test_environment_variables),
        ("Database Manager psycopg3", test_database_manager_psycopg3)
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
        print("🎉 All tests passed! psycopg3 connection ready for Python 3.13.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 