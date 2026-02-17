from flask import Flask
#from flask_sqlalchemy import SQLAlchemy
#from datetime import datetime
from api import db
from sqlalchemy import func
app = Flask(__name__)

# # Replace with your actual database details
# app.config['SQLALCHEMY_DATABASE_STRICT'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://dkaggs:dkaggs@127.0.0.1:5432/hackathon'
# db = SQLAlchemy(app)


# ==========================================
# 1. JUNCTION TABLES (Must be defined before models)
# ==========================================

consultant_services = db.Table(
    "consultant_services",
    db.Column(
        "consultant_id",
        db.String(50),
        db.ForeignKey("consultants.consultant_id"),
        primary_key=True,
    ),
    db.Column(
        "service_id",
        db.String(50),
        db.ForeignKey("services.service_id"),
        primary_key=True,
    ),
)

consultant_regions = db.Table(
    "consultant_regions",
    db.Column(
        "consultant_id",
        db.String(50),
        db.ForeignKey("consultants.consultant_id"),
        primary_key=True,
    ),
    db.Column(
        "region_code",
        db.String(50),
        db.ForeignKey("regions.region_code"),
        primary_key=True,
    ),
)

consultant_pools = db.Table(
    "consultant_pools",
    db.Column(
        "consultant_id",
        db.String(50),
        db.ForeignKey("consultants.consultant_id"),
        primary_key=True,
    ),
    db.Column(
        "pool_id", db.String(50), db.ForeignKey("pools.pool_id"), primary_key=True
    ),
)

consultant_access = db.Table(
    "consultant_access",
    db.Column(
        "consultant_id",
        db.String(50),
        db.ForeignKey("consultants.consultant_id"),
        primary_key=True,
    ),
    db.Column(
        "customer_id",
        db.String(50),
        db.ForeignKey("customers.customer_id"),
        primary_key=True,
    ),
    db.Column(
        "access_type", db.String(20), primary_key=True
    ),  # 'EXPERIENCE' or 'RESTRICTION'
)

# ==========================================
# 2. MODELS
# ==========================================


class Service(db.Model):
    __tablename__ = "services"
    service_id = db.Column(db.String(50), primary_key=True)
    service_type = db.Column(db.String(50))
    description = db.Column(db.Text)


class Region(db.Model):
    __tablename__ = "regions"
    region_code = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)


class Pool(db.Model):
    __tablename__ = "pools"
    pool_id = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.Text)


class Customer(db.Model):
    __tablename__ = "customers"
    customer_id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(255), nullable=False)
    region_code = db.Column(db.String(50), db.ForeignKey("regions.region_code"))
    risk_profile = db.Column(db.String(50))


class Assignment(db.Model):
    __tablename__ = "assignments"
    assignment_id = db.Column(db.String(50), primary_key=True)

    # FIX: Added ForeignKeys so Consultant relationship can find its target
    customer_id = db.Column(
        db.String(50), db.ForeignKey("customers.customer_id"), nullable=False
    )
    consultant_id = db.Column(
        db.String(50), db.ForeignKey("consultants.consultant_id"), nullable=False
    )

    service_id = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(50), default="scheduled", nullable=False)

    def __repr__(self):
        return f"<Assignment {self.assignment_id} - {self.status}>"


class Consultant(db.Model):
    __tablename__ = "consultants"
    consultant_id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    employment_type = db.Column(db.String(50), nullable=False)

    # Many-to-Many
    services = db.relationship(
        "Service", secondary=consultant_services, backref="consultants"
    )
    regions = db.relationship(
        "Region", secondary=consultant_regions, backref="consultants"
    )
    pools = db.relationship("Pool", secondary=consultant_pools, backref="consultants")

    # One-to-Many
    assignments = db.relationship("Assignment", backref="consultant_ref", lazy=True)
    availability = db.relationship("Availability", backref="consultant_ref", lazy=True)

    def __repr__(self):
        return f"<Consultant {self.consultant_id}: {self.first_name} {self.last_name}>"


class Availability(db.Model):
    __tablename__ = "availability"
    availability_id = db.Column(db.String(50), primary_key=True)
    consultant_id = db.Column(
        db.String(50), db.ForeignKey("consultants.consultant_id"), nullable=False
    )
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(50), nullable=False)

class Scenario(db.Model):
    __tablename__ = 'scenarios'

    # The server_default allows PostgreSQL to handle the 'sc-' prefixing
    scenario_id = db.Column(
        db.String(50), 
        primary_key=True, 
        server_default=db.text("'sc-' || nextval('scenario_id_seq')")
    )
    
    title = db.Column(db.String(255), nullable=False)
    
    # Validates types as 'sick', 'no-show', or 'late'
    type = db.Column(db.String(50), nullable=False)
    
    # Foreign Keys matching your PostgreSQL references
    consultant_id = db.Column(
        db.String(50), 
        db.ForeignKey('consultants.consultant_id', ondelete="CASCADE"), 
        nullable=False
    )
    customer_id = db.Column(
        db.String(50), 
        db.ForeignKey('customers.customer_id', ondelete="CASCADE"), 
        nullable=False
    )
    
    # Time objects for shift boundaries
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    
    description = db.Column(db.Text)
    
    # Automatically handled by the database
    created_at = db.Column(
        db.DateTime(timezone=True), 
        server_default=func.now()
    )

    # Relationships to access names directly (e.g., scenario.consultant.first_name)
    consultant = db.relationship('Consultant', backref='scenarios')
    customer = db.relationship('Customer', backref='scenarios')

    @property
    def urgency(self):
        """
        Calculated Property: Instead of storing urgency, 
        we pull the risk_profile from the linked customer.
        """
        return self.customer.risk_profile if self.customer else "low"

    def to_dict(self):
        """Helper for your React frontend JSON response"""
        return {
            "id": self.scenario_id,
            "title": self.title,
            "type": self.type,
            "employeeName": f"{self.consultant.first_name} {self.consultant.last_name}",
            "customerSite": self.customer.customer_name,
            "startTime": self.start_time.strftime("%H:%M"),
            "endTime": self.end_time.strftime("%H:%M"),
            "description": self.description,
            # "urgency": self.urgency,
            # Normalize to lowercase here so React's urgencyConfig[level] works
            "urgency": self.urgency.lower() if self.urgency else "low",
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }