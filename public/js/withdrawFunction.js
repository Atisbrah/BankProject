export const setupWithdrawForm = () => {
    const withdrawForm = document.getElementById('withdrawForm');
    if (!withdrawForm) return;

    withdrawForm.addEventListener('submit', e => {
        e.preventDefault();

        const amount = withdrawForm.querySelector('#amount');
        const pin = withdrawForm.querySelector('#pin');

        validateWithdrawInputs(amount, pin);

        if (withdrawForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(withdrawForm);
        formData.append('transactionType', 'Withdraw'); // hozzáadja a tranzakció típusát

        fetch('api/withdraw.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Get the response as text first
        .then(text => {
            try {
                const data = JSON.parse(text); // Parse the text as JSON
                if (data.success) {
                    alert('Withdrawal successful.');
                    loadContent(data.redirect); // Load the redirect page
                    checkSessionAndLoadHeader(); // Update the header
                } else {
                    if (data.errors) {
                        for (const key in data.errors) {
                            const errorElement = withdrawForm.querySelector(`#${key} ~ .errorMessage`);
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

const validateWithdrawInputs = (amount, pin) => {
    const amountValue = amount.value.trim();
    const pinValue = pin.value.trim();

    // Validate the amount input
    if (amountValue === '') {
        setError(amount, 'Amount is required.');
    } else if (isNaN(amountValue) || parseFloat(amountValue) <= 0) {
        setError(amount, 'Amount must be a positive number.');
    } else {
        clearError(amount);
    }

    // Validate the PIN input
    if (pinValue === '') {
        setError(pin, 'PIN Code is required.');
    } else if (!/^\d{4}$/.test(pinValue)) {
        setError(pin, 'PIN Code must be a 4-digit number.');
    } else {
        clearError(pin);
    }
};

const clearError = (element) => {
    const errorElement = element.nextElementSibling;
    if (errorElement) {
        errorElement.innerText = '';
        element.classList.remove('error'); // Removes the 'error' class if no error
    }
};

import { setError, setSuccess } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";
