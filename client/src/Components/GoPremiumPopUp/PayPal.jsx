import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

function PayPalBtn({ amount, onSuccess, currency }) {
    return (
        <PayPalButton
            amount={amount}
            currency={currency}
            onSuccess={(details, data) => onSuccess(details, data)}
            options={{
                clientId: "AftEy9vAIAiUHHvwjkvjWZNNSglrx2ekHpC2-9WoLMyEW_wd0rlL-Xe-JnJNQXtIu9L6ENzKdScvZ-n_"
            }}
        />
    )
}
export default PayPalBtn;