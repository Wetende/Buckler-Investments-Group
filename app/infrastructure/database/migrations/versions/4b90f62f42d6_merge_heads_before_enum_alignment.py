"""merge heads before enum alignment

Revision ID: 4b90f62f42d6
Revises: 46943f682851
Create Date: 2025-09-10 05:59:56.320463

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4b90f62f42d6'
down_revision: Union[str, Sequence[str], None] = '46943f682851'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
