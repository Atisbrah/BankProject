export const changePassword = () => {
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (!changePasswordForm) return;

    changePasswordForm.addEventListener('submit', e => {
        e.preventDefault();

        const oldPassword = changePasswordForm.querySelector('#old-password');
        const newPassword = changePasswordForm.querySelector('#new-password');
        const confirmNewPassword = changePasswordForm.querySelector('#confirm-new-password');

        validateChangePasswordInputs(oldPassword, newPassword, confirmNewPassword);

        if (changePasswordForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(changePasswordForm);

        fetch('api/changePassword.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Password changed successfully.');
                checkSessionAndLoadHeader();
                loadContent('randomQuote.php');
            } else {
                if (data.errors) {
                    if (data.errors.authorization) {
                        alert(data.errors.authorization);
                    }

                    for (const key in data.errors) {
                        const errorElement = changePasswordForm.querySelector(`#${key} ~ .errorMessage`);
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

const validateChangePasswordInputs = (oldPassword, newPassword, confirmNewPassword) => {
    if (oldPassword.value === '') {
        setError(oldPassword, 'Old password is required.');
    } else {
        setSuccess(oldPassword);
    }

    if (newPassword.value === '') {
        setError(newPassword, 'New password is required.');
    } else if (!isValidPassword(newPassword.value)) {
        setError(newPassword, 'Invalid password. Password must be at least 6 characters long, contain at least one uppercase letter and one number.');    
    } else {
        setSuccess(newPassword);
    }

    if (confirmNewPassword.value === '') {
        setError(confirmNewPassword, 'Confirm new password is required.');
    } else if (newPassword.value !== confirmNewPassword.value) {
        setError(confirmNewPassword, 'New passwords do not match.');
    } else {
        setSuccess(confirmNewPassword);
    }
};

const isValidPassword = (password) => {
    return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

import { setError, setSuccess } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";
