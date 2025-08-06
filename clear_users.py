import sqlite3
import os

def clear_users_table():
    """Clear all data from the users table"""
    db_path = "Database/main.db"
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get the current count of users
        cursor.execute("SELECT COUNT(*) FROM users")
        current_count = cursor.fetchone()[0]
        print(f"Current number of users: {current_count}")
        
        # Clear the users table
        cursor.execute("DELETE FROM users")
        
        # Commit the changes
        conn.commit()
        
        # Verify the table is empty
        cursor.execute("SELECT COUNT(*) FROM users")
        new_count = cursor.fetchone()[0]
        print(f"Users table cleared. New count: {new_count}")
        
        # Close the connection
        conn.close()
        
        print("✅ Users table cleared successfully!")
        
    except Exception as e:
        print(f"❌ Error clearing users table: {e}")

if __name__ == "__main__":
    print("🗑️  Clearing users table...")
    clear_users_table() 