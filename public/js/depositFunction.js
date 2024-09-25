export const setupDepositForm = () => {
    const depositForm = document.getElementById('depositForm');
    if (!depositForm) return;

    depositForm.addEventListener('submit', e => {
        e.preventDefault();

        const amount = depositForm.querySelector('#amount');
        const pin = depositForm.querySelector('#pin');

        validateDepositInputs(amount, pin);

        if (depositForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(depositForm);

        fetch('api/deposit.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Get the response as text first
        .then(text => {
            try {
                const data = JSON.parse(text); // Parse the text as JSON
                if (data.success) {
                    alert('Deposit successful.');
                    loadContent(data.redirect); // Load the redirect page
                    checkSessionAndLoadHeader(); // Update the header
                } else {
                    if (data.errors) {
                        for (const key in data.errors) {
                            const errorElement = depositForm.querySelector(`#${key} ~ .errorMessage`);
                            if (errorElement) {
                                errorElement.innerText = data.errors[key];
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                console.error('Response text:', text); // Log the raw response text for debugging
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
};

const validateDepositInputs = (amount, pin) => {
    const amountValue = amount.value.trim();
    const pinValue = pin.value.trim();
    
    // Validate amount input
    if (amountValue === '') {
        setError(amount, 'Amount is required.');
    } else if (isNaN(amountValue) || parseFloat(amountValue) <= 0) {
        setError(amount, 'Amount must be a positive number.');
    } else if (parseFloat(amountValue) > 9999999) {
        setError(amount, 'Amount must not exceed 9.999.999.');
    } else {
        setSuccess(amount);
    }

    // Validate PIN input
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
