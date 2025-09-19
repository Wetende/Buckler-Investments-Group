"""Add location fields to BnB listings for geographic grouping

Revision ID: 0004_add_location_fields_bnb
Revises: 0003_phase4_invest
Create Date: 2025-01-18
"""

from alembic import op
import sqlalchemy as sa


revision = "0004_add_location_fields_bnb"
down_revision = "4b90f62f42d6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add structured location fields to st_listings table
    op.add_column("st_listings", sa.Column("county", sa.String(100), nullable=True))
    op.add_column("st_listings", sa.Column("town", sa.String(100), nullable=True))
    op.add_column("st_listings", sa.Column("area_id", sa.Integer(), nullable=True))
    
    # Foreign key constraint to areas table will be added later when areas table exists
    # op.create_foreign_key(
    #     "fk_st_listings_area_id", 
    #     "st_listings", 
    #     "areas", 
    #     ["area_id"], 
    #     ["id"],
    #     ondelete="SET NULL"
    # )
    
    # Create indexes for performance (following existing patterns)
    op.create_index("ix_st_listings_county", "st_listings", ["county"])
    op.create_index("ix_st_listings_town", "st_listings", ["town"])
    op.create_index("ix_st_listings_area_id", "st_listings", ["area_id"])
    
    # Create composite index for county+town grouping queries
    op.create_index("ix_st_listings_county_town", "st_listings", ["county", "town"])


def downgrade() -> None:
    # Drop indexes first
    op.drop_index("ix_st_listings_county_town", table_name="st_listings")
    op.drop_index("ix_st_listings_area_id", table_name="st_listings")
    op.drop_index("ix_st_listings_town", table_name="st_listings")
    op.drop_index("ix_st_listings_county", table_name="st_listings")
    
    # Drop foreign key constraint (if it exists)
    # op.drop_constraint("fk_st_listings_area_id", "st_listings", type_="foreignkey")
    
    # Drop columns
    op.drop_column("st_listings", "area_id")
    op.drop_column("st_listings", "town")
    op.drop_column("st_listings", "county")
