"""rename st_bookings to bookings and align columns

Revision ID: 9ef572aae67b
Revises: 034068119d61
Create Date: 2025-10-08 07:29:44.566523

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9ef572aae67b'
down_revision: Union[str, Sequence[str], None] = '034068119d61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename table st_bookings -> bookings
    op.rename_table('st_bookings', 'bookings')

    # Rename indexes associated with st_bookings
    try:
        op.execute("ALTER INDEX IF EXISTS ix_st_bookings_guest_id RENAME TO ix_bookings_guest_id")
        op.execute("ALTER INDEX IF EXISTS ix_st_bookings_listing_id RENAME TO ix_bookings_listing_id")
        op.execute("ALTER INDEX IF EXISTS ix_st_bookings_status RENAME TO ix_bookings_status")
    except Exception:
        # Some backends may not support IF EXISTS; ignore if missing
        pass

    # Drop and recreate foreign keys in dependent tables to point to bookings
    # Default PostgreSQL FK names are <table>_<column>_fkey
    # st_messages.booking_id -> bookings.id
    op.drop_constraint('st_messages_booking_id_fkey', 'st_messages', type_='foreignkey')
    op.create_foreign_key('st_messages_booking_id_fkey', 'st_messages', 'bookings', ['booking_id'], ['id'], ondelete='CASCADE')

    # st_payouts.booking_id -> bookings.id
    op.drop_constraint('st_payouts_booking_id_fkey', 'st_payouts', type_='foreignkey')
    op.create_foreign_key('st_payouts_booking_id_fkey', 'st_payouts', 'bookings', ['booking_id'], ['id'], ondelete='SET NULL')

    # st_tax_records.booking_id -> bookings.id
    op.drop_constraint('st_tax_records_booking_id_fkey', 'st_tax_records', type_='foreignkey')
    op.create_foreign_key('st_tax_records_booking_id_fkey', 'st_tax_records', 'bookings', ['booking_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    """Downgrade schema."""
    # Revert FKs to st_bookings
    op.drop_constraint('st_tax_records_booking_id_fkey', 'st_tax_records', type_='foreignkey')
    op.create_foreign_key('st_tax_records_booking_id_fkey', 'st_tax_records', 'st_bookings', ['booking_id'], ['id'], ondelete='CASCADE')

    op.drop_constraint('st_payouts_booking_id_fkey', 'st_payouts', type_='foreignkey')
    op.create_foreign_key('st_payouts_booking_id_fkey', 'st_payouts', 'st_bookings', ['booking_id'], ['id'], ondelete='SET NULL')

    op.drop_constraint('st_messages_booking_id_fkey', 'st_messages', type_='foreignkey')
    op.create_foreign_key('st_messages_booking_id_fkey', 'st_messages', 'st_bookings', ['booking_id'], ['id'], ondelete='CASCADE')

    # Rename indexes back
    try:
        op.execute("ALTER INDEX IF EXISTS ix_bookings_guest_id RENAME TO ix_st_bookings_guest_id")
        op.execute("ALTER INDEX IF EXISTS ix_bookings_listing_id RENAME TO ix_st_bookings_listing_id")
        op.execute("ALTER INDEX IF EXISTS ix_bookings_status RENAME TO ix_st_bookings_status")
    except Exception:
        pass

    # Rename table bookings -> st_bookings
    op.rename_table('bookings', 'st_bookings')
