#!/usr/bin/env python3
"""
Test script to verify all dependencies are available
"""
import sys
import os

def test_core_dependencies():
    """Test core Flask and database dependencies"""
    print("🔍 Testing core dependencies...")
    
    dependencies = [
        ("Flask", "flask"),
        ("Flask-CORS", "flask_cors"),
        ("Flask-SocketIO", "flask_socketio"),
        ("SQLAlchemy", "sqlalchemy"),
        ("psycopg3", "psycopg"),
        ("requests", "requests"),
        ("python-dotenv", "dotenv"),
        ("billboard", "billboard"),
        ("bcrypt", "bcrypt"),
        ("gunicorn", "gunicorn"),
        ("pydub", "pydub"),
        ("BeautifulSoup", "bs4"),
        ("audioop-lts", "audioop")
    ]
    
    results = []
    for name, module in dependencies:
        try:
            __import__(module)
            print(f"✅ {name} imported successfully")
            results.append((name, True))
        except ImportError as e:
            print(f"❌ {name} import failed: {e}")
            results.append((name, False))
    
    return all(result[1] for result in results)

def test_application_imports():
    """Test application-specific imports"""
    print("\n🔍 Testing application imports...")
    
    app_modules = [
        ("user", "user"),
        ("artist", "artist"),
        ("song", "song"),
        ("classes", "classes"),
        ("comments", "comments"),
        ("playlist", "playlist"),
        ("music_data", "music_data"),
        ("kworb_scraper", "kworb_scraper"),
        ("acoutid", "acoutid"),
        ("post", "post"),
        ("database_manager", "database_manager")
    ]
    
    results = []
    for name, module in app_modules:
        try:
            __import__(module)
            print(f"✅ {name} imported successfully")
            results.append((name, True))
        except ImportError as e:
            print(f"❌ {name} import failed: {e}")
            results.append((name, False))
    
    return all(result[1] for result in results)

def test_flask_app():
    """Test Flask app creation"""
    print("\n🔍 Testing Flask app creation...")
    try:
        from app import app
        print("✅ Flask app created successfully")
        return True
    except Exception as e:
        print(f"❌ Flask app creation failed: {e}")
        return False

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
        print(f"❌ Database connection test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 All Dependencies Test Suite")
    print("=" * 50)
    
    tests = [
        ("Core Dependencies", test_core_dependencies),
        ("Application Imports", test_application_imports),
        ("Flask App", test_flask_app),
        ("Database Connection", test_database_connection)
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
        print("🎉 All tests passed! Application ready for deployment.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 