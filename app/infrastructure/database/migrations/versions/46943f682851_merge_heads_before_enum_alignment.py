"""merge heads before enum alignment

Revision ID: 46943f682851
Revises: 1e7b5318e0f9, 2025_09_09_update_userrole_enum
Create Date: 2025-09-10 05:54:59.555341

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '46943f682851'
down_revision: Union[str, Sequence[str], None] = ('1e7b5318e0f9', '2025_09_09_update_userrole_enum')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
