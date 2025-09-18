"""create_users_table

Revision ID: 3dcfb29e6b76
Revises: 0003_phase4_invest
Create Date: 2025-08-23 06:12:58.290141

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3dcfb29e6b76'
down_revision: Union[str, Sequence[str], None] = '0003_phase4_invest'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create users table."""
    # Create UserRole enum if it doesn't exist
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE userrole AS ENUM ('GUEST','USER','HOST','TOUR_OPERATOR','VEHICLE_OWNER','AGENT','ADMIN','SUPER_ADMIN');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True, index=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('role', sa.Enum('GUEST','USER','HOST','TOUR_OPERATOR','VEHICLE_OWNER','AGENT','ADMIN','SUPER_ADMIN', name='userrole'), nullable=False, server_default='USER'),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('agent_license_id', sa.String(100), nullable=True),
        sa.Column('agency_name', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    )
    
    # Create indexes
    op.create_index('ix_users_email', 'users', ['email'])


def downgrade() -> None:
    """Drop users table."""
    op.drop_index('ix_users_email', 'users')
    op.drop_table('users')
    op.execute("DROP TYPE userrole")
