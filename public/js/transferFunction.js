export const setupTransferForm = () => {
    const transferForm = document.getElementById('transferForm');
    if(!transferForm) {
        return;
    }

    transferForm.addEventListener('submit', e => {
        e.preventDefault();

        const cardNumber = transferForm.querySelector('#cardNumber');
        const statement = transferForm.querySelector('#statement');
        const amount = transferForm.querySelector('#amount');
        const pin = transferForm.querySelector('#pin');

        validateTransferInputs(cardNumber, statement, amount, pin);

        if (transferForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(transferForm);
        formData.append('transactionType', 'Transfer');

        fetch('api/transfer.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Get the response as text first
        .then(text => {
            try {
                const data = JSON.parse(text); // Parse the text as JSON
                if (data.success) {
                    alert('Transfer successful.');
                    loadContent(data.redirect); // Load the redirect page
                    checkSessionAndLoadHeader(); // Update the header
                } else {
                    if (data.errors) {
                        for (const key in data.errors) {
                            const errorElement = transferForm.querySelector(`#${key} ~ .errorMessage`);
                            if (errorElement) {
                                errorElement.textContent = data.errors[key];
                                // Reset the amount input if the error is specific to it
                                if (key === 'amount') {
                                    amount.value = ''; // Clear the amount field
                                }
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

const validateTransferInputs = (cardNumber, statement, amount, pin) => {
    const cardNumberValue = cardNumber.value.trim();
    const amountValue = amount.value.trim();
    const pinValue = pin.value.trim();

    // Validate the card number input
    if (cardNumberValue === '') {
        setError(cardNumber, 'Card Number is required.');
    } else if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumberValue)) {
        setError(cardNumber, 'Card Number must be in the format 0000-0000-0000-0000.');
    } else {
        clearError(cardNumber);
    }

    // Validate the amount input
    if (amountValue === '') {
        setError(amount, 'Amount is required.');
    } else if (isNaN(amountValue) || parseFloat(amountValue) <= 0) {
        setError(amount, 'Amount must be a positive number.');
    } else if (amount > 9999999) {
        setError(amount, 'Amount cannot exceed 9.999.999');
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
}

const clearError = (element) => {
    const errorElement = element.nextElementSibling;
    if (errorElement) {
        errorElement.innerText = '';
        element.classList.remove('error'); // Removes the 'error' class if no error
    }
};

import { setError } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";
