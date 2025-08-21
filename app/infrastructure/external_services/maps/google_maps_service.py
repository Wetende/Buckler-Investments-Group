from typing import Dict, Any

from tenacity import retry, stop_after_attempt, wait_exponential


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, max=4))
async def geocode(address: str) -> Dict[str, Any]:
    # Placeholder: integrate with Google Maps Geocoding API
    return {"address": address, "lat": 0.0, "lng": 0.0}
