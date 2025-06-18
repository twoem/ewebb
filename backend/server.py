from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import uuid
import shutil
from typing import Optional, List
import bcrypt
import jwt
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EWEBB Cyber Café API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client.ewebb_db

# Collections
contacts_collection = db.contacts
documents_collection = db.documents
admin_collection = db.admin

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Pass@2025")

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS", "ewebbcybercafe@gmail.com")
APP_PASSWORD = os.getenv("APP_PASSWORD", "")

# Pydantic models
class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class AdminLogin(BaseModel):
    username: str
    password: str

class DocumentUpload(BaseModel):
    name: str
    category: str  # 'public' or 'eulogy'

# Create uploads directory
os.makedirs("/app/uploads/public", exist_ok=True)
os.makedirs("/app/uploads/eulogy", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    try:
        # Handle both bcrypt hashed passwords and plain text comparison for testing
        if hashed.startswith('$2b$'):
            return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
        else:
            # Fallback for plain text comparison
            return password == hashed
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def send_email(to_email: str, subject: str, body: str, is_html: bool = True):
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        msg['Subject'] = subject
        
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "EWEBB API is running"}

@app.post("/api/contact")
async def submit_contact(contact: ContactRequest):
    try:
        # Save to database
        contact_data = {
            "id": str(uuid.uuid4()),
            "name": contact.name,
            "email": contact.email,
            "phone": contact.phone,
            "subject": contact.subject,
            "message": contact.message,
            "created_at": datetime.utcnow(),
            "status": "new"
        }
        
        contacts_collection.insert_one(contact_data)
        
        # Send email to admin
        admin_email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">New Contact Message</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">EWEBB Cyber Café</p>
            </div>
            
            <div style="background: #f8f9ff; padding: 30px; border-radius: 10px; margin: 20px 0;">
                <div style="margin-bottom: 20px;">
                    <strong style="color: #4c51bf; display: block; margin-bottom: 5px;">Customer Name:</strong>
                    <span style="color: #2d3748; font-size: 16px;">{contact.name}</span>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong style="color: #4c51bf; display: block; margin-bottom: 5px;">Email:</strong>
                    <a href="mailto:{contact.email}" style="color: #667eea; text-decoration: none;">{contact.email}</a>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong style="color: #4c51bf; display: block; margin-bottom: 5px;">Phone Number:</strong>
                    <span style="color: #2d3748; font-size: 16px;">{contact.phone or 'Not provided'}</span>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong style="color: #4c51bf; display: block; margin-bottom: 5px;">Subject:</strong>
                    <span style="color: #2d3748; font-size: 16px;">{contact.subject}</span>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong style="color: #4c51bf; display: block; margin-bottom: 5px;">Message:</strong>
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; color: #2d3748; line-height: 1.6;">
                        {contact.message}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
                <p>This message was sent from the EWEBB Cyber Café contact form.</p>
                <p>Received on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
        </body>
        </html>
        """
        
        send_email(EMAIL_ADDRESS, f"New Contact: {contact.subject}", admin_email_body)
        
        return {"success": True, "message": "Contact form submitted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/login")
async def admin_login(login_data: AdminLogin):
    # Fixed authentication logic - now properly handles hashed passwords
    if login_data.username != ADMIN_USERNAME or not verify_password(login_data.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": login_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/admin/contacts")
async def get_contacts(username: str = Depends(verify_token)):
    contacts = list(contacts_collection.find({}, {"_id": 0}).sort("created_at", -1))
    return {"contacts": contacts}

@app.put("/api/admin/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str, username: str = Depends(verify_token)):
    result = contacts_collection.update_one(
        {"id": contact_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return {"success": True, "message": "Status updated successfully"}

@app.post("/api/admin/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form(...),
    username: str = Depends(verify_token)
):
    if category not in ["public", "eulogy"]:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
    
    # Save file
    file_path = f"/app/uploads/{category}/{unique_filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Save metadata to database
    document_data = {
        "id": str(uuid.uuid4()),
        "original_name": file.filename,
        "filename": unique_filename,
        "category": category,
        "file_path": file_path,
        "uploaded_at": datetime.utcnow(),
        "uploaded_by": username
    }
    
    documents_collection.insert_one(document_data)
    
    return {"success": True, "message": "File uploaded successfully", "filename": unique_filename}

@app.get("/api/documents")
async def get_documents():
    documents = list(documents_collection.find({}, {"_id": 0}).sort("uploaded_at", -1))
    return {"documents": documents}

@app.get("/api/admin/documents")
async def get_admin_documents(username: str = Depends(verify_token)):
    documents = list(documents_collection.find({}, {"_id": 0}).sort("uploaded_at", -1))
    return {"documents": documents}

@app.delete("/api/admin/documents/{document_id}")
async def delete_document(document_id: str, username: str = Depends(verify_token)):
    document = documents_collection.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file from filesystem
    try:
        os.remove(document["file_path"])
    except FileNotFoundError:
        pass
    
    # Delete from database
    documents_collection.delete_one({"id": document_id})
    
    return {"success": True, "message": "Document deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)