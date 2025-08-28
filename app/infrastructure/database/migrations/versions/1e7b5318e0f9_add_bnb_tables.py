"""add_bnb_tables

Revision ID: 1e7b5318e0f9
Revises: b66e308cb8fe
Create Date: 2025-08-28 06:13:24.871908

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e7b5318e0f9'
down_revision: Union[str, Sequence[str], None] = 'b66e308cb8fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create st_listings table
    op.create_table(
        "st_listings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("host_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("type", sa.String(20), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("bedrooms", sa.Integer(), nullable=True),
        sa.Column("beds", sa.Integer(), nullable=True),
        sa.Column("baths", sa.Float(), nullable=True),
        sa.Column("nightly_price", sa.Numeric(12,2), nullable=False),
        sa.Column("cleaning_fee", sa.Numeric(12,2), nullable=True),
        sa.Column("service_fee", sa.Numeric(12,2), nullable=True),
        sa.Column("security_deposit", sa.Numeric(12,2), nullable=True),
        sa.Column("address", sa.String(500), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("amenities", sa.JSON(), nullable=True),
        sa.Column("rules", sa.JSON(), nullable=True),
        sa.Column("cancellation_policy", sa.String(20), nullable=False, server_default="MODERATE"),
        sa.Column("instant_book", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("min_nights", sa.Integer(), nullable=True),
        sa.Column("max_nights", sa.Integer(), nullable=True),
        sa.Column("images", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_st_listings_host_id", "st_listings", ["host_id"])
    op.create_index("ix_st_listings_created_at", "st_listings", ["created_at"])

    # Create st_availability table
    op.create_table(
        "st_availability",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("listing_id", sa.Integer(), sa.ForeignKey("st_listings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("is_available", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("price_override", sa.Numeric(12,2), nullable=True),
        sa.Column("min_nights_override", sa.Integer(), nullable=True),
    )
    op.create_index("ix_st_availability_listing_date", "st_availability", ["listing_id", "date"], unique=True)

    # Create st_bookings table
    op.create_table(
        "st_bookings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("guest_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("listing_id", sa.Integer(), sa.ForeignKey("st_listings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("check_in", sa.Date(), nullable=False),
        sa.Column("check_out", sa.Date(), nullable=False),
        sa.Column("guests", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="PENDING"),
        sa.Column("amount_total", sa.Numeric(12,2), nullable=False),
        sa.Column("deposit_amount", sa.Numeric(12,2), nullable=True),
        sa.Column("currency", sa.String(10), nullable=False, server_default="KES"),
        sa.Column("payment_auth_id", sa.String(100), nullable=True),
        sa.Column("payment_capture_id", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_st_bookings_guest_id", "st_bookings", ["guest_id"])
    op.create_index("ix_st_bookings_listing_id", "st_bookings", ["listing_id"])
    op.create_index("ix_st_bookings_status", "st_bookings", ["status"])

    # Create st_messages table
    op.create_table(
        "st_messages",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("booking_id", sa.Integer(), sa.ForeignKey("st_bookings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sender_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_st_messages_booking_id", "st_messages", ["booking_id"])

    # Create st_payouts table
    op.create_table(
        "st_payouts",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("host_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("booking_id", sa.Integer(), sa.ForeignKey("st_bookings.id", ondelete="SET NULL"), nullable=True),
        sa.Column("amount", sa.Numeric(12,2), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="KES"),
        sa.Column("status", sa.String(20), nullable=False, server_default="SCHEDULED"),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_st_payouts_host_id", "st_payouts", ["host_id"])
    op.create_index("ix_st_payouts_status", "st_payouts", ["status"])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop tables in reverse order
    op.drop_index("ix_st_payouts_status", table_name="st_payouts")
    op.drop_index("ix_st_payouts_host_id", table_name="st_payouts")
    op.drop_table("st_payouts")
    
    op.drop_index("ix_st_messages_booking_id", table_name="st_messages")
    op.drop_table("st_messages")
    
    op.drop_index("ix_st_bookings_status", table_name="st_bookings")
    op.drop_index("ix_st_bookings_listing_id", table_name="st_bookings")
    op.drop_index("ix_st_bookings_guest_id", table_name="st_bookings")
    op.drop_table("st_bookings")
    
    op.drop_index("ix_st_availability_listing_date", table_name="st_availability")
    op.drop_table("st_availability")
    
    op.drop_index("ix_st_listings_created_at", table_name="st_listings")
    op.drop_index("ix_st_listings_host_id", table_name="st_listings")
    op.drop_table("st_listings")
