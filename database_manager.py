import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.exc import OperationalError, DisconnectionError
from sqlalchemy.pool import QueuePool
import psycopg2
from psycopg2.extras import RealDictCursor

def load_env_file():
    """Load environment variables from .env file"""
    try:
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
    except FileNotFoundError:
        print("Warning: .env file not found")

# Load environment variables
load_env_file()
DATABASE_URL = os.getenv("DATABASE_URL_UNPOOLED", os.getenv("DATABASE_URL", "sqlite:///database/main.db"))

def create_engine_with_retry():
    """Create SQLAlchemy engine with connection pooling and retry logic"""
    
    if DATABASE_URL.startswith('postgresql'):
        # PostgreSQL configuration with connection pooling
        engine = create_engine(
            DATABASE_URL,
            echo=False,
            poolclass=QueuePool,
            pool_size=5,  # Number of connections to maintain
            max_overflow=10,  # Additional connections that can be created
            pool_pre_ping=True,  # Verify connections before use
            pool_recycle=3600,  # Recycle connections after 1 hour
            connect_args={
                "connect_timeout": 10,
                "application_name": "song_application",
                "sslmode": "require"
            }
        )
    else:
        # SQLite configuration
        engine = create_engine(DATABASE_URL, echo=False)
    
    return engine

# Create the engine
engine = create_engine_with_retry()

def get_session_with_retry(max_retries=3, delay=1):
    """Get a database session with retry logic for connection issues"""
    
    for attempt in range(max_retries):
        try:
            session = Session(engine)
            # Test the connection
            session.execute(text("SELECT 1"))
            return session
        except (OperationalError, DisconnectionError) as e:
            print(f"Database connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                print("Max retries reached. Connection failed.")
                raise e
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise e

def execute_with_retry(func, max_retries=3):
    """Execute a database function with retry logic"""
    
    for attempt in range(max_retries):
        try:
            session = get_session_with_retry()
            try:
                result = func(session)
                session.commit()
                return result
            except Exception as e:
                session.rollback()
                raise e
            finally:
                session.close()
        except (OperationalError, DisconnectionError) as e:
            print(f"Database operation attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {1 + attempt} seconds...")
                time.sleep(1 + attempt)
            else:
                print("Max retries reached. Operation failed.")
                raise e
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise e

def test_connection():
    """Test the database connection"""
    try:
        session = get_session_with_retry()
        result = session.execute(text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"✅ Database connection successful: {version}")
        session.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing database connection...")
    test_connection() 