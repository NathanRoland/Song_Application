#!/usr/bin/env python3
"""
Test script to verify PostgreSQL connection with psycopg2
"""
import sys
import os

def test_psycopg2_import():
    """Test that psycopg2 can be imported"""
    print("🔍 Testing psycopg2 import...")
    try:
        import psycopg2
        print(f"✅ psycopg2 imported successfully, version: {psycopg2.__version__}")
        return True
    except ImportError as e:
        print(f"❌ psycopg2 import failed: {e}")
        return False

def test_sqlalchemy_postgresql():
    """Test SQLAlchemy PostgreSQL dialect"""
    print("\n🔍 Testing SQLAlchemy PostgreSQL dialect...")
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.dialects.postgresql import psycopg2
        print("✅ SQLAlchemy PostgreSQL dialect imported successfully")
        return True
    except Exception as e:
        print(f"❌ SQLAlchemy PostgreSQL dialect failed: {e}")
        return False

def test_database_manager():
    """Test database manager with PostgreSQL"""
    print("\n🔍 Testing database manager...")
    try:
        from database_manager import engine, test_connection
        print("✅ Database manager imported successfully")
        
        # Test connection
        result = test_connection()
        if result:
            print("✅ Database connection successful")
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
    else:
        print("⚠️  DATABASE_URL not set")
    
    if database_url_unpooled:
        print(f"✅ DATABASE_URL_UNPOOLED: {'Set' if database_url_unpooled else 'Not set'}")
    else:
        print("⚠️  DATABASE_URL_UNPOOLED not set")
    
    return bool(database_url or database_url_unpooled)

def main():
    """Run all tests"""
    print("🚀 PostgreSQL Connection Test Suite")
    print("=" * 50)
    
    tests = [
        ("psycopg2 Import", test_psycopg2_import),
        ("SQLAlchemy PostgreSQL", test_sqlalchemy_postgresql),
        ("Environment Variables", test_environment_variables),
        ("Database Manager", test_database_manager)
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
        print("🎉 All tests passed! PostgreSQL connection ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 