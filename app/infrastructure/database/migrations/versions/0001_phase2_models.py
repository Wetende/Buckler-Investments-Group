"""Phase 2 models: areas, developers, projects, property.project_id

Revision ID: 0001_phase2_models
Revises: None
Create Date: 2025-08-08
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_phase2_models"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # areas
    op.create_table(
        "areas",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String(length=200), nullable=False, unique=True, index=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("summary", sa.String(length=1000), nullable=True),
        sa.Column("hero_image_url", sa.String(length=500), nullable=True),
        sa.Column("stats", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    # developers
    op.create_table(
        "developers",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String(length=200), nullable=False, unique=True, index=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("logo_url", sa.String(length=500), nullable=True),
        sa.Column("website_url", sa.String(length=500), nullable=True),
        sa.Column("bio", sa.String(length=2000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )

    # projects
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String(length=200), nullable=False, unique=True, index=True),
        sa.Column("developer_id", sa.Integer(), sa.ForeignKey("developers.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("from_price", sa.Numeric(12, 2), nullable=True),
        sa.Column("handover_quarter", sa.String(length=20), nullable=True),
        sa.Column("bedrooms_min", sa.Integer(), nullable=True),
        sa.Column("bedrooms_max", sa.Integer(), nullable=True),
        sa.Column("location", sa.String(length=300), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("payment_plan", sa.String(length=1000), nullable=True),
        sa.Column("badges", sa.JSON(), nullable=True),
        sa.Column("media", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_projects_developer_id", "projects", ["developer_id"])
    op.create_index("ix_projects_created_at", "projects", ["created_at"])

    # properties.project_id
    op.add_column("properties", sa.Column("project_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_properties_project_id_projects",
        "properties",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    # drop FK and column on properties
    op.drop_constraint("fk_properties_project_id_projects", "properties", type_="foreignkey")
    op.drop_column("properties", "project_id")

    # drop projects
    op.drop_index("ix_projects_created_at", table_name="projects")
    op.drop_index("ix_projects_developer_id", table_name="projects")
    op.drop_table("projects")

    # drop developers
    op.drop_table("developers")

    # drop areas
    op.drop_index("ix_areas_slug", table_name="areas")
    op.drop_table("areas")



