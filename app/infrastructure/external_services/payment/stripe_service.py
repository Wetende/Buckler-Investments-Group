from typing import Any, Dict

from tenacity import retry, stop_after_attempt, wait_exponential


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, max=4))
async def create_payment_intent(amount_cents: int, currency: str, metadata: Dict[str, Any] | None = None) -> Dict[str, Any]:
    # Placeholder: integrate with Stripe SDK
    return {"status": "requires_confirmation", "amount": amount_cents, "currency": currency, "metadata": metadata or {}}
