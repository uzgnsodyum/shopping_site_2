// PaymentSuccess.js
import { Alert, Button } from "react-bootstrap";

const PaymentSuccess = ({ onContinueShopping }) => (
  <div className="text-center my-5">
    <Alert variant="success" className="mb-4">
      <h4>Payment Successful!</h4>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
    </Alert>
    <Button variant="primary" onClick={onContinueShopping}>
      Continue Shopping
    </Button>
  </div>
);

export default PaymentSuccess;
