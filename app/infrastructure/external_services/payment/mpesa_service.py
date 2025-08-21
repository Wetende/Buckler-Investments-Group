from typing import Any, Dict

from tenacity import retry, stop_after_attempt, wait_exponential


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, max=4))
async def initiate_stk_push(payload: Dict[str, Any]) -> Dict[str, Any]:
    # Placeholder: integrate with Safaricom M-Pesa API
    return {"status": "queued", "provider": "mpesa", "payload": payload}
