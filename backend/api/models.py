from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from api import db

app = Flask(__name__)

# # Replace with your actual database details
# app.config['SQLALCHEMY_DATABASE_STRICT'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://dkaggs:dkaggs@127.0.0.1:5432/hackathon'
# db = SQLAlchemy(app)

class Assignment(db.Model):
    __tablename__ = 'assignments'

    # Primary Key - String type for your ASSIGN_300001 style IDs
    assignment_id = db.Column(db.String(50), primary_key=True)
    
    # Foreign Keys / Identifiers
    customer_id = db.Column(db.String(50), nullable=False)
    consultant_id = db.Column(db.String(50), nullable=False)
    
    # Details
    service = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)  # Handles 2026-02-26
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    
    # Status with your specific categories
    status = db.Column(db.String(50), default='scheduled', nullable=False)

    # # Metadata
    # created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    # updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<Assignment {self.assignment_id} - {self.status}>'