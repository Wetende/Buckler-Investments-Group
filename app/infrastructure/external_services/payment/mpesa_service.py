from typing import Any, Dict
from datetime import datetime, timedelta

class MpesaPaymentService:
    def __init__(self, consumer_key: str, consumer_secret: str, shortcode: str):
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.shortcode = shortcode

    async def initiate_stk_push(self, amount: int, phone_number: str, account_reference: str, transaction_desc: str) -> Dict[str, Any]:
        """Initiate M-Pesa STK Push"""
        # Placeholder: integrate with M-Pesa API
        checkout_request_id = f"mpesa_{abs(hash(f'{amount}{phone_number}{account_reference}'))}"
        return {
            "checkout_request_id": checkout_request_id,
            "response_code": "0",
            "response_description": "Success. Request accepted for processing",
            "merchant_request_id": f"mr_{abs(hash(account_reference))}",
            "expires_at": datetime.utcnow() + timedelta(minutes=5),
            "checkout_url": f"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest/{checkout_request_id}"
        }

    async def check_transaction_status(self, checkout_request_id: str) -> Dict[str, Any]:
        """Check M-Pesa transaction status"""
        # Placeholder: integrate with M-Pesa API
        return {
            "result_code": "0",
            "result_desc": "The service request is processed successfully.",
            "mpesa_receipt_number": f"MPE{abs(hash(checkout_request_id))}",
            "transaction_date": datetime.utcnow().isoformat(),
            "phone_number": "254712345678",
            "amount": 1000,
            "completed_at": datetime.utcnow().isoformat()
        }
