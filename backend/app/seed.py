from datetime import date

from .models import Allocation, Employee, Notification, Project, User
from .security import hash_password


def seed_demo_data(db):
    admin = db.query(User).filter(User.email == "admin@capacity.app").first()
    if not admin:
        admin = User(
            email="admin@capacity.app",
            full_name="Admin User",
            password_hash=hash_password("admin123"),
            role="Admin",
            is_verified=True,
        )
        db.add(admin)
        db.flush()

    employees = [
        Employee(
            full_name="Ava Johnson",
            email="ava.johnson@capacity.app",
            department="Frontend Engineering",
            role="Team Lead",
            seniority="Senior",
            skills=[{"name": "React", "proficiency": "Expert"}, {"name": "TypeScript", "proficiency": "Advanced"}],
            availability_pct=40,
            status="Active",
        ),
        Employee(
            full_name="Noah Williams",
            email="noah.williams@capacity.app",
            department="Backend Engineering",
            role="Employee",
            seniority="Mid",
            skills=[{"name": "Python", "proficiency": "Advanced"}, {"name": "PostgreSQL", "proficiency": "Intermediate"}],
            availability_pct=60,
            status="Active",
        ),
        Employee(
            full_name="Mia Chen",
            email="mia.chen@capacity.app",
            department="QA",
            role="Employee",
            seniority="Junior",
            skills=[{"name": "Cypress", "proficiency": "Intermediate"}, {"name": "Selenium", "proficiency": "Intermediate"}],
            availability_pct=80,
            status="Active",
        ),
    ]

    if not db.query(Employee).first():
        db.add_all(employees)
        db.flush()

    projects = [
        Project(
            name="Client Portal Revamp",
            client_name="Acme Corp",
            project_manager="Ava Johnson",
            start_date=date.today(),
            status="Active",
            priority="High",
            required_skills=["React", "TypeScript", "AWS"],
            capacity_demand_pct=120,
            delivery_phase="Development",
            description="Revamp the customer portal.",
        ),
        Project(
            name="QA Automation Suite",
            client_name="Northwind",
            project_manager="Mia Chen",
            start_date=date.today(),
            status="Planning",
            priority="Medium",
            required_skills=["Cypress", "Selenium", "Python"],
            capacity_demand_pct=40,
            delivery_phase="Discovery",
            description="Automate smoke and regression testing.",
        ),
    ]

    if not db.query(Project).first():
        db.add_all(projects)
        db.flush()

    if not db.query(Allocation).first():
        emp_map = {employee.email: employee for employee in db.query(Employee).all()}
        proj_map = {project.name: project for project in db.query(Project).all()}
        db.add_all(
            [
                Allocation(
                    employee_id=emp_map["ava.johnson@capacity.app"].id,
                    project_id=proj_map["Client Portal Revamp"].id,
                    allocation_pct=70,
                    role_on_project="Frontend Lead",
                    status="Active",
                ),
                Allocation(
                    employee_id=emp_map["noah.williams@capacity.app"].id,
                    project_id=proj_map["Client Portal Revamp"].id,
                    allocation_pct=50,
                    role_on_project="Backend Engineer",
                    status="Active",
                ),
                Allocation(
                    employee_id=emp_map["mia.chen@capacity.app"].id,
                    project_id=proj_map["QA Automation Suite"].id,
                    allocation_pct=30,
                    role_on_project="QA Engineer",
                    status="Active",
                ),
            ]
        )

    if not db.query(Notification).first():
        db.add_all(
            [
                Notification(
                    user_id=admin.id,
                    title="Overallocation detected",
                    message="Ava Johnson is above 100% utilization.",
                    type="overallocation",
                    severity="high",
                    read=False,
                ),
                Notification(
                    user_id=admin.id,
                    title="New project assigned",
                    message="Client Portal Revamp moved to Development.",
                    type="new_project",
                    severity="medium",
                    read=False,
                ),
            ]
        )

    db.commit()
