"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-26
"""

# pylint: disable=invalid-name,missing-function-docstring,no-member

from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None

CURRENT_TIMESTAMP = sa.text("CURRENT_TIMESTAMP")
EMPTY_JSON_ARRAY = sa.text("'[]'::json")


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column(
            "email",
            sa.String(length=255),
            nullable=False,
            unique=True,
        ),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "role",
            sa.String(length=50),
            nullable=False,
            server_default="Employee",
        ),
        sa.Column(
            "is_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
    )
    op.create_index(
        op.f("ix_users_email"),
        "users",
        ["email"],
        unique=True,
    )

    op.create_table(
        "employees",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column(
            "email",
            sa.String(length=255),
            nullable=False,
            unique=True,
        ),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column(
            "employee_id",
            sa.String(length=100),
            nullable=True,
            unique=True,
        ),
        sa.Column("department", sa.String(length=120), nullable=False),
        sa.Column(
            "role",
            sa.String(length=80),
            nullable=False,
            server_default="Employee",
        ),
        sa.Column(
            "seniority",
            sa.String(length=50),
            nullable=False,
            server_default="Mid",
        ),
        sa.Column(
            "skills",
            sa.JSON(),
            nullable=False,
            server_default=EMPTY_JSON_ARRAY,
        ),
        sa.Column(
            "years_experience",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "availability_pct",
            sa.Float(),
            nullable=False,
            server_default="100",
        ),
        sa.Column(
            "employment_type",
            sa.String(length=50),
            nullable=False,
            server_default="Full-time",
        ),
        sa.Column("location", sa.String(length=120), nullable=True),
        sa.Column(
            "status",
            sa.String(length=40),
            nullable=False,
            server_default="Active",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
    )
    op.create_index(
        op.f("ix_employees_full_name"),
        "employees",
        ["full_name"],
        unique=False,
    )
    op.create_index(
        op.f("ix_employees_email"),
        "employees",
        ["email"],
        unique=True,
    )
    op.create_index(
        op.f("ix_employees_employee_id"),
        "employees",
        ["employee_id"],
        unique=True,
    )
    op.create_index(
        op.f("ix_employees_department"),
        "employees",
        ["department"],
        unique=False,
    )
    op.create_index(
        op.f("ix_employees_status"),
        "employees",
        ["status"],
        unique=False,
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("client_name", sa.String(length=255), nullable=True),
        sa.Column(
            "project_manager",
            sa.String(length=255),
            nullable=True,
        ),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="Planning",
        ),
        sa.Column("budget", sa.Float(), nullable=False, server_default="0"),
        sa.Column(
            "priority",
            sa.String(length=50),
            nullable=False,
            server_default="Medium",
        ),
        sa.Column(
            "required_skills",
            sa.JSON(),
            nullable=False,
            server_default=EMPTY_JSON_ARRAY,
        ),
        sa.Column(
            "capacity_demand_pct",
            sa.Float(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "delivery_phase",
            sa.String(length=80),
            nullable=False,
            server_default="Discovery",
        ),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
    )
    op.create_index(
        op.f("ix_projects_name"),
        "projects",
        ["name"],
        unique=False,
    )
    op.create_index(
        op.f("ix_projects_status"),
        "projects",
        ["status"],
        unique=False,
    )
    op.create_index(
        op.f("ix_projects_priority"),
        "projects",
        ["priority"],
        unique=False,
    )

    op.create_table(
        "allocations",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column(
            "employee_id",
            sa.String(length=36),
            sa.ForeignKey("employees.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "project_id",
            sa.String(length=36),
            sa.ForeignKey("projects.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "allocation_pct",
            sa.Float(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "role_on_project",
            sa.String(length=120),
            nullable=True,
        ),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="Active",
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
    )
    op.create_index(
        op.f("ix_allocations_employee_id"),
        "allocations",
        ["employee_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_allocations_project_id"),
        "allocations",
        ["project_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_allocations_status"),
        "allocations",
        ["status"],
        unique=False,
    )

    op.create_table(
        "notifications",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(length=36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column(
            "type",
            sa.String(length=50),
            nullable=False,
            server_default="info",
        ),
        sa.Column(
            "severity",
            sa.String(length=50),
            nullable=False,
            server_default="low",
        ),
        sa.Column(
            "read",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=CURRENT_TIMESTAMP,
        ),
    )
    op.create_index(
        op.f("ix_notifications_user_id"),
        "notifications",
        ["user_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_notifications_read"),
        "notifications",
        ["read"],
        unique=False,
    )
    op.create_index(
        op.f("ix_notifications_severity"),
        "notifications",
        ["severity"],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f("ix_notifications_severity"),
        table_name="notifications",
    )
    op.drop_index(
        op.f("ix_notifications_read"),
        table_name="notifications",
    )
    op.drop_index(
        op.f("ix_notifications_user_id"),
        table_name="notifications",
    )
    op.drop_table("notifications")

    op.drop_index(op.f("ix_allocations_status"), table_name="allocations")
    op.drop_index(
        op.f("ix_allocations_project_id"),
        table_name="allocations",
    )
    op.drop_index(
        op.f("ix_allocations_employee_id"),
        table_name="allocations",
    )
    op.drop_table("allocations")

    op.drop_index(op.f("ix_projects_priority"), table_name="projects")
    op.drop_index(op.f("ix_projects_status"), table_name="projects")
    op.drop_index(op.f("ix_projects_name"), table_name="projects")
    op.drop_table("projects")

    op.drop_index(op.f("ix_employees_status"), table_name="employees")
    op.drop_index(op.f("ix_employees_department"), table_name="employees")
    op.drop_index(op.f("ix_employees_employee_id"), table_name="employees")
    op.drop_index(op.f("ix_employees_email"), table_name="employees")
    op.drop_index(op.f("ix_employees_full_name"), table_name="employees")
    op.drop_table("employees")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
