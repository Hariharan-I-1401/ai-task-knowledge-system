import os
import sys

# Ensure Python can resolve the local 'app' package directory paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    # FORCE CALIBRATE: Import the core main file to automatically map ALL dependencies 
    # (User, Role, Startup, Document, Tasks, etc.) all at once!
    from app.main import app
    print("Core application framework context successfully loaded...")

    from app.database import SessionLocal
    from app.models.user import Role
    
    print("Connecting to your local SQL Database instance...")
    db = SessionLocal()
    
    # Check if roles are already present in the table rows
    existing_roles = db.query(Role).all()
    print(f"Initial check: Found {[r.name for r in existing_roles]} in the database.")
    
    # Inject standard User role record if absent
    if not any(r.name == "User" for r in existing_roles):
        db.add(Role(name="User"))
        print("Adding row entry: 'User'...")
        
    # Inject standard Admin role record if absent
    if not any(r.name == "Admin" for r in existing_roles):
        db.add(Role(name="Admin"))
        print("Adding row entry: 'Admin'...")
        
    db.commit()
    print("\n🎉 Success! 'User' and 'Admin' roles are now permanently saved in your database.")
    db.close()

except Exception as e:
    print(f"\n❌ Seeding operation failed: {e}")