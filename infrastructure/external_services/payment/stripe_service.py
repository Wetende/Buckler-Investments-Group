from typing import Any, Dict

from tenacity import retry, stop_after_attempt, wait_exponential


class StripePaymentService:
    def __init__(self, api_key: str):
        self.api_key = api_key

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, max=4))
    async def create_payment_intent(self, amount: int, currency: str, customer_email: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create a Stripe payment intent"""
        # Placeholder: integrate with Stripe SDK
        intent_id = f"pi_{abs(hash(f'{amount}{currency}{customer_email}'))}"
        return {
            "id": intent_id,
            "client_secret": f"{intent_id}_secret_test",
            "status": "requires_payment_method",
            "amount": amount,
            "currency": currency,
            "metadata": metadata or {}
        }

    async def confirm_payment_intent(self, payment_intent_id: str, payment_method_id: str) -> Dict[str, Any]:
        """Confirm a Stripe payment intent"""
        # Placeholder: integrate with Stripe SDK
        return {
            "id": payment_intent_id,
            "status": "succeeded",
            "latest_charge": f"ch_{abs(hash(payment_intent_id))}",
            "created": "2024-01-20T10:00:00Z"
        }


# Legacy function for backward compatibility
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, max=4))
async def create_payment_intent(amount_cents: int, currency: str, metadata: Dict[str, Any] | None = None) -> Dict[str, Any]:
    # Placeholder: integrate with Stripe SDK
    return {"status": "requires_confirmation", "amount": amount_cents, "currency": currency, "metadata": metadata or {}}