"""Phase 4 Investment models

Revision ID: 0003_phase4_invest
Revises: 0002_phase3_bnb
Create Date: 2025-08-08
"""

from alembic import op
import sqlalchemy as sa


revision = "0003_phase4_invest"
down_revision = "0002_phase3_bnb"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "inv_products",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String(200), nullable=False, unique=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("summary", sa.String(2000), nullable=True),
        sa.Column("min_invest", sa.Numeric(12,2), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="KES"),
        sa.Column("fee_schedule", sa.JSON(), nullable=True),
        sa.Column("disclosures_md", sa.String(10000), nullable=True),
        sa.Column("provider_ref", sa.String(200), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_inv_products_slug", "inv_products", ["slug"])

    op.create_table(
        "inv_nav_snapshots",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("inv_products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("nav", sa.Numeric(12,4), nullable=False),
        sa.Column("nav_date", sa.Date(), nullable=False),
        sa.Column("source", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_nav_product_date", "inv_nav_snapshots", ["product_id", "nav_date"], unique=True)

    op.create_table(
        "inv_orders",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("inv_products.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("amount", sa.Numeric(12,2), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="KES"),
        sa.Column("side", sa.String(10), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="PENDING"),
        sa.Column("placed_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("ext_ref", sa.String(100), nullable=True),
    )
    op.create_index("ix_orders_user_id", "inv_orders", ["user_id"])
    op.create_index("ix_orders_product_id", "inv_orders", ["product_id"])
    op.create_index("ix_orders_status", "inv_orders", ["status"])

    op.create_table(
        "inv_positions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("inv_products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("units", sa.Numeric(18,6), nullable=False),
        sa.Column("avg_cost", sa.Numeric(12,4), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_positions_user_id", "inv_positions", ["user_id"])
    op.create_index("ix_positions_product_id", "inv_positions", ["product_id"])

    op.create_table(
        "kyc_records",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="PENDING"),
        sa.Column("data", sa.JSON(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("kyc_records")
    op.drop_index("ix_positions_product_id", table_name="inv_positions")
    op.drop_index("ix_positions_user_id", table_name="inv_positions")
    op.drop_table("inv_positions")
    op.drop_index("ix_orders_status", table_name="inv_orders")
    op.drop_index("ix_orders_product_id", table_name="inv_orders")
    op.drop_index("ix_orders_user_id", table_name="inv_orders")
    op.drop_table("inv_orders")
    op.drop_index("ix_nav_product_date", table_name="inv_nav_snapshots")
    op.drop_table("inv_nav_snapshots")
    op.drop_index("ix_inv_products_slug", table_name="inv_products")
    op.drop_table("inv_products")



