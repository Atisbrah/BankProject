export const transactionFunction = (formId, apiEndpoint, successMessage) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const amount = form.querySelector('#amount');
        const pin = form.querySelector('#pin');

        validateInputs(amount, pin);

        if (form.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(form);

        fetch(apiEndpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    alert(successMessage);
                    loadContent(data.redirect);
                    checkSessionAndLoadHeader();
                } else {
                    if (data.errors) {
                        for (const key in data.errors) {
                            const errorElement = form.querySelector(`#${key} ~ .errorMessage`);
                            if (errorElement) {
                                errorElement.innerText = data.errors[key];
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                console.error('Response text:', text);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
};

const validateInputs = (amount, pin) => {
    const amountValue = amount.value.trim();
    const pinValue = pin.value.trim();
    
    if (amountValue === '') {
        setError(amount, 'Amount is required.');
    } else if (isNaN(amountValue) || parseFloat(amountValue) <= 0) {
        setError(amount, 'Amount must be a positive number.');
    } else if (parseFloat(amountValue) > 9999999) {
        setError(amount, 'Amount must not exceed 9.999.999.');
    } else {
        setSuccess(amount);
    }

    if (pinValue === '') {
        setError(pin, 'PIN Code is required.');
    } else if (pinValue.length !== 4 || !/^\d{4}$/.test(pinValue)) {
        setError(pin, 'PIN Code must be a 4-digit number.');
    } else {
        setSuccess(pin);
    }
};

import { setError, setSuccess } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";
