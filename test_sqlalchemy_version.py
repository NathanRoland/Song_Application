#!/usr/bin/env python3
"""
Test script to check SQLAlchemy version and compatibility
"""
import sys

def check_sqlalchemy_version():
    """Check SQLAlchemy version"""
    try:
        import sqlalchemy
        print(f"✅ SQLAlchemy version: {sqlalchemy.__version__}")
        
        # Check if version is 2.0.32 or higher
        version_parts = sqlalchemy.__version__.split('.')
        major = int(version_parts[0])
        minor = int(version_parts[1])
        patch = int(version_parts[2])
        
        if major == 2 and minor == 0 and patch >= 32:
            print("✅ SQLAlchemy version is compatible with Python 3.13")
            return True
        else:
            print(f"⚠️  SQLAlchemy version {sqlalchemy.__version__} may not be compatible with Python 3.13")
            return False
            
    except Exception as e:
        print(f"❌ Error checking SQLAlchemy version: {e}")
        return False

def test_imports():
    """Test SQLAlchemy imports"""
    try:
        from sqlalchemy import create_engine, select, delete, func, update, text
        print("✅ SQLAlchemy core imports successful")
        
        from sqlalchemy.orm import Session
        print("✅ SQLAlchemy ORM imports successful")
        
        from sqlalchemy.exc import PendingRollbackError, IntegrityError
        print("✅ SQLAlchemy exceptions imports successful")
        
        return True
    except Exception as e:
        print(f"❌ SQLAlchemy import error: {e}")
        return False

def main():
    """Run tests"""
    print("🔍 SQLAlchemy Version and Compatibility Test")
    print("=" * 50)
    
    version_ok = check_sqlalchemy_version()
    imports_ok = test_imports()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"  Version Check: {'✅ PASS' if version_ok else '❌ FAIL'}")
    print(f"  Import Test: {'✅ PASS' if imports_ok else '❌ FAIL'}")
    
    if version_ok and imports_ok:
        print("\n🎉 All tests passed! Ready for deployment.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 