export const setupNewCardValidation = () => {
    const registerNewCardForm = document.getElementById('registerNewCardForm');
    if (!registerNewCardForm) return;

    registerNewCardForm.addEventListener('submit', e => {
        e.preventDefault();

        const cardNumber = registerNewCardForm.querySelector('#cardNumber');
        const pin = registerNewCardForm.querySelector('#pin');
        const confirmPin = registerNewCardForm.querySelector('#confirmPin');

        validateCardInputs(cardNumber, pin, confirmPin);

        if (registerNewCardForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(registerNewCardForm);

        fetch('api/registerCard.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Card registration successful.');
                loadContent(data.redirect); // Load the redirect page
                checkSessionAndLoadHeader(); // Update the header
            } else {
                if (data.errors) {
                    for (const key in data.errors) {
                        const errorElement = registerNewCardForm.querySelector(`#${key} ~ .errorMessage`);
                        if (errorElement) {
                            errorElement.innerText = data.errors[key];
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
};

const validateCardInputs = (cardNumber, pin, confirmPin) => {
    const cardNumberValue = cardNumber.value.trim();
    const pinValue = pin.value.trim();
    const confirmPinValue = confirmPin.value.trim();
    
    if (cardNumberValue === '') {
        setError(cardNumber, 'Card Number is required.');
    } else if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumberValue)) {
        setError(cardNumber, 'Card Number must be in the format 0000-0000-0000-0000.');
    } else {
        setSuccess(cardNumber);
    }

    if (pinValue === '') {
        setError(pin, 'PIN Code is required.');
    } else if (pinValue.length !== 4 || !/^\d{4}$/.test(pinValue)) {
        setError(pin, 'PIN Code must be a 4-digit number.');
    } else {
        setSuccess(pin);
    }

    if (confirmPinValue === '') {
        setError(confirmPin, 'Confirm PIN Code is required.');
    } else if (pinValue !== confirmPinValue) {
        setError(confirmPin, "PIN codes don't match.");
    } else {
        setSuccess(confirmPin);
    }
};

import { setError, setSuccess } from "./formUtils.js";
import { checkSessionAndLoadHeader } from "./header.js";
import { loadContent } from "./contentLoading.js";