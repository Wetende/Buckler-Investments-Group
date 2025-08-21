from fastapi import APIRouter

from . import bnb, tours, cars, property, investment, user, bundle

api_router = APIRouter()
api_router.include_router(bnb.router, prefix="/bnb", tags=["bnb"])
api_router.include_router(tours.router, prefix="/tours", tags=["tours"])
api_router.include_router(cars.router, prefix="/cars", tags=["cars"])
api_router.include_router(property.router, prefix="/property", tags=["property"])
api_router.include_router(investment.router, prefix="/investment", tags=["investment"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(bundle.router, prefix="/bundle", tags=["bundle"])
