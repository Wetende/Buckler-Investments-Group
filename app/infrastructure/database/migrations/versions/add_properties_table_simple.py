"""add_properties_table_simple

Revision ID: add_properties_simple
Revises: 0004_add_location_fields_bnb
Create Date: 2025-09-19 06:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'add_properties_simple'
down_revision: Union[str, Sequence[str], None] = '0004_add_location_fields_bnb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create properties table
    op.create_table('properties',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=False),
    sa.Column('property_type_id', sa.Integer(), nullable=True),
    sa.Column('project_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=False, server_default='DRAFT'),
    sa.Column('address', sa.String(length=500), nullable=True),
    sa.Column('latitude', sa.Numeric(precision=10, scale=8), nullable=True),
    sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=True),
    sa.Column('bedrooms', sa.Integer(), nullable=True),
    sa.Column('bathrooms', sa.Integer(), nullable=True),
    sa.Column('square_footage', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('amenities', sa.JSON(), nullable=True),
    sa.Column('images', sa.JSON(), nullable=True),
    sa.Column('slug', sa.String(length=255), nullable=True),
    sa.Column('meta_description', sa.Text(), nullable=True),
    sa.Column('agent_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('ix_properties_agent_id', 'properties', ['agent_id'], unique=False)
    op.create_index('ix_properties_created_at', 'properties', ['created_at'], unique=False)
    op.create_index('ix_properties_property_type_id', 'properties', ['property_type_id'], unique=False)
    op.create_index('ix_properties_slug', 'properties', ['slug'], unique=True)
    op.create_index('ix_properties_status', 'properties', ['status'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_properties_status', table_name='properties')
    op.drop_index('ix_properties_slug', table_name='properties')
    op.drop_index('ix_properties_property_type_id', table_name='properties')
    op.drop_index('ix_properties_created_at', table_name='properties')
    op.drop_index('ix_properties_agent_id', table_name='properties')
    op.drop_table('properties')
    op.execute("DROP TYPE IF EXISTS propertystatus")
