"""
Main entry point for the FastAPI application.

This allows running the app with: uvicorn main:app --reload
"""

from api.main import app

# Export the app so uvicorn can find it
__all__ = ["app"]
