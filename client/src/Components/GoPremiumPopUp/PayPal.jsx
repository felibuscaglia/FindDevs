import React from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import axios from 'axios';

function PayPal() {

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '11.99'
                }
            }]
        });
    }

    function onApprove(data, actions) {
        return actions.order.capture();
    }

    return (
        <PayPalButton
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: "USD",
                            value: "11.99"
                        }
                    }],
                });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then(function (details) {
                    alert("Transaction completed by " + details.payer.name.given_name);
                });
            }}
            options={{
                clientId: 'AftEy9vAIAiUHHvwjkvjWZNNSglrx2ekHpC2-9WoLMyEW_wd0rlL-Xe-JnJNQXtIu9L6ENzKdScvZ-n_'
            }}
        />
    )
}

export default PayPal;