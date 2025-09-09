"""Align userrole enum with shared.constants.user_roles values

Revision ID: 2025_09_09_update_userrole_enum
Revises: 3dcfb29e6b76
Create Date: 2025-09-09
"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "2025_09_09_update_userrole_enum"
down_revision: Union[str, Sequence[str], None] = "3dcfb29e6b76"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 0) Drop existing default to avoid cast issues
    op.execute(
        """
        ALTER TABLE users
        ALTER COLUMN role DROP DEFAULT;
        """
    )  # type: ignore[attr-defined]

    # 1) Temporarily cast to TEXT to allow value remapping
    op.execute(
        """
        ALTER TABLE users
        ALTER COLUMN role TYPE TEXT USING role::text;
        """
    )  # type: ignore[attr-defined]

    # 2) Remap legacy values to canonical uppercase
    op.execute("UPDATE users SET role = 'USER' WHERE role = 'BUYER';")  # type: ignore[attr-defined]

    # 3) Create a NEW enum with canonical values
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole_new') THEN
                CREATE TYPE userrole_new AS ENUM (
                    'GUEST','USER','HOST','TOUR_OPERATOR','VEHICLE_OWNER','AGENT','ADMIN','SUPER_ADMIN'
                );
            END IF;
        END
        $$;
        """
    )  # type: ignore[attr-defined]

    # 4) Cast column to the NEW enum
    op.execute(
        """
        ALTER TABLE users
        ALTER COLUMN role TYPE userrole_new USING role::userrole_new;
        """
    )  # type: ignore[attr-defined]

    # 5) Replace old type (if present) with the new one
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
                ALTER TYPE userrole RENAME TO userrole_old;
            END IF;
        END
        $$;
        """
    )  # type: ignore[attr-defined]

    op.execute("ALTER TYPE userrole_new RENAME TO userrole;")  # type: ignore[attr-defined]
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole_old') THEN
                DROP TYPE userrole_old;
            END IF;
        END
        $$;
        """
    )  # type: ignore[attr-defined]

    # 6) Default
    op.execute("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'USER';")  # type: ignore[attr-defined]


def downgrade() -> None:
    # 0) Drop default before changing type
    op.execute(
        """
        ALTER TABLE users
        ALTER COLUMN role DROP DEFAULT;
        """
    )  # type: ignore[attr-defined]

    # 1) Back to TEXT
    op.execute(
        """
        ALTER TABLE users
        ALTER COLUMN role TYPE TEXT USING role::text;
        """
    )  # type: ignore[attr-defined]

    # 2) Map non-representable values back to BUYER
    op.execute("UPDATE users SET role = 'BUYER' WHERE role NOT IN ('AGENT','ADMIN');")  # type: ignore[attr-defined]

    # 3) Recreate legacy enum and cast back
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole_old') THEN
                CREATE TYPE userrole_old AS ENUM ('BUYER','AGENT','ADMIN');
            END IF;
        END
        $$;
        """
    )  # type: ignore[attr-defined]

    op.execute(
        """
        ALTER TABLE users
        ALTER COLUMN role TYPE userrole_old USING role::userrole_old;
        """
    )  # type: ignore[attr-defined]

    # Rename current to new and swap back
    op.execute("ALTER TYPE userrole RENAME TO userrole_new;")  # type: ignore[attr-defined]
    op.execute("ALTER TYPE userrole_old RENAME TO userrole;")  # type: ignore[attr-defined]
    op.execute("DROP TYPE userrole_new;")  # type: ignore[attr-defined]

    op.execute("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'BUYER';")  # type: ignore[attr-defined]


