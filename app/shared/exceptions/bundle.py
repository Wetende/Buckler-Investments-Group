class BundleException(Exception):
    """Base exception for bundle-related errors."""
    pass

class BundleNotFoundError(BundleException):
    """Raised when a bundle is not found."""
    def __init__(self, bundle_id: int):
        self.bundle_id = bundle_id
        super().__init__(f"Bundle with ID {bundle_id} not found.")


class BundledItemNotFoundError(BundleException):
    """Raised when an item to be bundled is not found."""
    def __init__(self, item_type: str, item_id: int):
        self.item_type = item_type
        self.item_id = item_id
        super().__init__(f"{item_type.replace('_', ' ').title()} with ID {item_id} not found.")
