"""User roles and permissions constants."""

from enum import Enum
from typing import Dict, Set


class UserRole(str, Enum):
    """User roles in the platform."""
    
    GUEST = "guest"                    # Unregistered/anonymous user
    USER = "user"                      # Regular registered user
    HOST = "host"                      # Property/listing host
    TOUR_OPERATOR = "tour_operator"    # Tour package provider
    VEHICLE_OWNER = "vehicle_owner"    # Vehicle rental provider
    AGENT = "agent"                    # Real estate agent
    ADMIN = "admin"                    # Platform administrator
    SUPER_ADMIN = "super_admin"        # System super administrator


class Permission(str, Enum):
    """Granular permissions for the platform."""
    
    # User management
    VIEW_USERS = "view_users"
    CREATE_USERS = "create_users"
    UPDATE_USERS = "update_users"
    DELETE_USERS = "delete_users"
    
    # Profile management
    VIEW_OWN_PROFILE = "view_own_profile"
    UPDATE_OWN_PROFILE = "update_own_profile"
    
    # BNB/Accommodation
    VIEW_LISTINGS = "view_listings"
    CREATE_LISTINGS = "create_listings"
    UPDATE_OWN_LISTINGS = "update_own_listings"
    DELETE_OWN_LISTINGS = "delete_own_listings"
    UPDATE_ANY_LISTINGS = "update_any_listings"
    DELETE_ANY_LISTINGS = "delete_any_listings"
    
    # Bookings
    VIEW_OWN_BOOKINGS = "view_own_bookings"
    CREATE_BOOKINGS = "create_bookings"
    CANCEL_OWN_BOOKINGS = "cancel_own_bookings"
    VIEW_ALL_BOOKINGS = "view_all_bookings"
    CANCEL_ANY_BOOKINGS = "cancel_any_bookings"
    
    # Tours
    VIEW_TOURS = "view_tours"
    CREATE_TOURS = "create_tours"
    UPDATE_OWN_TOURS = "update_own_tours"
    DELETE_OWN_TOURS = "delete_own_tours"
    UPDATE_ANY_TOURS = "update_any_tours"
    DELETE_ANY_TOURS = "delete_any_tours"
    
    # Vehicles
    VIEW_VEHICLES = "view_vehicles"
    CREATE_VEHICLES = "create_vehicles"
    UPDATE_OWN_VEHICLES = "update_own_vehicles"
    DELETE_OWN_VEHICLES = "delete_own_vehicles"
    UPDATE_ANY_VEHICLES = "update_any_vehicles"
    DELETE_ANY_VEHICLES = "delete_any_vehicles"
    
    # Properties
    VIEW_PROPERTIES = "view_properties"
    CREATE_PROPERTIES = "create_properties"
    UPDATE_OWN_PROPERTIES = "update_own_properties"
    DELETE_OWN_PROPERTIES = "delete_own_properties"
    UPDATE_ANY_PROPERTIES = "update_any_properties"
    DELETE_ANY_PROPERTIES = "delete_any_properties"
    
    # Payments
    PROCESS_PAYMENTS = "process_payments"
    VIEW_PAYMENT_HISTORY = "view_payment_history"
    PROCESS_REFUNDS = "process_refunds"
    VIEW_ALL_PAYMENTS = "view_all_payments"
    
    # Analytics
    VIEW_OWN_ANALYTICS = "view_own_analytics"
    VIEW_ALL_ANALYTICS = "view_all_analytics"
    
    # System administration
    MANAGE_SYSTEM_SETTINGS = "manage_system_settings"
    VIEW_SYSTEM_LOGS = "view_system_logs"
    MANAGE_ROLES = "manage_roles"
    SEND_NOTIFICATIONS = "send_notifications"


# Role-permission mapping
ROLE_PERMISSIONS: Dict[UserRole, Set[Permission]] = {
    UserRole.GUEST: {
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
    },
    
    UserRole.USER: {
        # Guest permissions
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
        # User-specific permissions
        Permission.VIEW_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
        Permission.CREATE_BOOKINGS,
        Permission.VIEW_OWN_BOOKINGS,
        Permission.CANCEL_OWN_BOOKINGS,
        Permission.PROCESS_PAYMENTS,
        Permission.VIEW_PAYMENT_HISTORY,
    },
    
    UserRole.HOST: {
        # User permissions
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
        Permission.VIEW_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
        Permission.CREATE_BOOKINGS,
        Permission.VIEW_OWN_BOOKINGS,
        Permission.CANCEL_OWN_BOOKINGS,
        Permission.PROCESS_PAYMENTS,
        Permission.VIEW_PAYMENT_HISTORY,
        # Host-specific permissions
        Permission.CREATE_LISTINGS,
        Permission.UPDATE_OWN_LISTINGS,
        Permission.DELETE_OWN_LISTINGS,
        Permission.VIEW_OWN_ANALYTICS,
    },
    
    UserRole.TOUR_OPERATOR: {
        # User permissions
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
        Permission.VIEW_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
        Permission.CREATE_BOOKINGS,
        Permission.VIEW_OWN_BOOKINGS,
        Permission.CANCEL_OWN_BOOKINGS,
        Permission.PROCESS_PAYMENTS,
        Permission.VIEW_PAYMENT_HISTORY,
        # Tour operator permissions
        Permission.CREATE_TOURS,
        Permission.UPDATE_OWN_TOURS,
        Permission.DELETE_OWN_TOURS,
        Permission.VIEW_OWN_ANALYTICS,
    },
    
    UserRole.VEHICLE_OWNER: {
        # User permissions
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
        Permission.VIEW_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
        Permission.CREATE_BOOKINGS,
        Permission.VIEW_OWN_BOOKINGS,
        Permission.CANCEL_OWN_BOOKINGS,
        Permission.PROCESS_PAYMENTS,
        Permission.VIEW_PAYMENT_HISTORY,
        # Vehicle owner permissions
        Permission.CREATE_VEHICLES,
        Permission.UPDATE_OWN_VEHICLES,
        Permission.DELETE_OWN_VEHICLES,
        Permission.VIEW_OWN_ANALYTICS,
    },
    
    UserRole.AGENT: {
        # User permissions
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
        Permission.VIEW_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
        Permission.CREATE_BOOKINGS,
        Permission.VIEW_OWN_BOOKINGS,
        Permission.CANCEL_OWN_BOOKINGS,
        Permission.PROCESS_PAYMENTS,
        Permission.VIEW_PAYMENT_HISTORY,
        # Agent permissions
        Permission.CREATE_PROPERTIES,
        Permission.UPDATE_OWN_PROPERTIES,
        Permission.DELETE_OWN_PROPERTIES,
        Permission.VIEW_OWN_ANALYTICS,
    },
    
    UserRole.ADMIN: {
        # All user permissions
        Permission.VIEW_LISTINGS,
        Permission.VIEW_TOURS,
        Permission.VIEW_VEHICLES,
        Permission.VIEW_PROPERTIES,
        Permission.VIEW_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
        Permission.CREATE_BOOKINGS,
        Permission.VIEW_OWN_BOOKINGS,
        Permission.CANCEL_OWN_BOOKINGS,
        Permission.PROCESS_PAYMENTS,
        Permission.VIEW_PAYMENT_HISTORY,
        # Admin permissions
        Permission.VIEW_USERS,
        Permission.UPDATE_USERS,
        Permission.VIEW_ALL_BOOKINGS,
        Permission.CANCEL_ANY_BOOKINGS,
        Permission.UPDATE_ANY_LISTINGS,
        Permission.DELETE_ANY_LISTINGS,
        Permission.UPDATE_ANY_TOURS,
        Permission.DELETE_ANY_TOURS,
        Permission.UPDATE_ANY_VEHICLES,
        Permission.DELETE_ANY_VEHICLES,
        Permission.UPDATE_ANY_PROPERTIES,
        Permission.DELETE_ANY_PROPERTIES,
        Permission.PROCESS_REFUNDS,
        Permission.VIEW_ALL_PAYMENTS,
        Permission.VIEW_ALL_ANALYTICS,
        Permission.SEND_NOTIFICATIONS,
    },
    
    UserRole.SUPER_ADMIN: {
        # All permissions
        *[permission for permission in Permission],
    }
}


def has_permission(user_role: UserRole, permission: Permission) -> bool:
    """
    Check if a user role has a specific permission.
    
    Args:
        user_role: User's role
        permission: Permission to check
        
    Returns:
        True if role has the permission
    """
    role_permissions = ROLE_PERMISSIONS.get(user_role, set())
    return permission in role_permissions


def get_user_permissions(user_role: UserRole) -> Set[Permission]:
    """
    Get all permissions for a user role.
    
    Args:
        user_role: User's role
        
    Returns:
        Set of permissions for the role
    """
    return ROLE_PERMISSIONS.get(user_role, set()).copy()


def is_admin_role(user_role: UserRole) -> bool:
    """
    Check if a role is an admin role.
    
    Args:
        user_role: User's role
        
    Returns:
        True if role is admin or super_admin
    """
    return user_role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]


def is_provider_role(user_role: UserRole) -> bool:
    """
    Check if a role is a service provider role.
    
    Args:
        user_role: User's role
        
    Returns:
        True if role provides services (host, tour_operator, etc.)
    """
    return user_role in [
        UserRole.HOST,
        UserRole.TOUR_OPERATOR,
        UserRole.VEHICLE_OWNER,
        UserRole.AGENT
    ]


def can_manage_resource(user_role: UserRole, resource_type: str, is_owner: bool = False) -> bool:
    """
    Check if a user can manage a specific resource type.
    
    Args:
        user_role: User's role
        resource_type: Type of resource ('listing', 'tour', 'vehicle', 'property')
        is_owner: Whether the user owns the resource
        
    Returns:
        True if user can manage the resource
    """
    if is_admin_role(user_role):
        return True
    
    if not is_owner:
        return False
    
    # Check if user role can manage their own resources of this type
    resource_permissions = {
        'listing': Permission.UPDATE_OWN_LISTINGS,
        'tour': Permission.UPDATE_OWN_TOURS,
        'vehicle': Permission.UPDATE_OWN_VEHICLES,
        'property': Permission.UPDATE_OWN_PROPERTIES,
    }
    
    required_permission = resource_permissions.get(resource_type)
    if not required_permission:
        return False
    
    return has_permission(user_role, required_permission)
