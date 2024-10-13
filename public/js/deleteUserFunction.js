export const deleteUser = () => {
    const deleteUserForm = document.getElementById('deleteUserForm');
    if (!deleteUserForm) return;

    deleteUserForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const password = deleteUserForm.querySelector('#password');
        const confirmPassword = deleteUserForm.querySelector('#confirmPassword');

        validatePasswordInputs(password, confirmPassword);

        if (deleteUserForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(deleteUserForm);

        fetch('api/deleteUser.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User deleted successfully.');
                checkSessionAndLoadHeader();
                loadContent(data.redirect);
            } else {
                if (data.errors) {
                    if (data.errors.authorization) {
                        alert(data.errors.authorization);
                    }

                    for (const key in data.errors) {
                        const errorElement = document.getElementById(`${key} ~ .errorMessage`);

                        if (errorElement) {
                            errorElement.innerText = data.errors[key];
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    });
};

const validatePasswordInputs = (password, passwordAgain) => {
    if (password.value === '') {
        setError(password, 'Password is required.');
    } else {
        setSuccess(password);
    }

    if (passwordAgain.value === '') {
        setError(passwordAgain, 'Password confirmation is required.');
    } else if (password.value !== passwordAgain.value) {
        setError(passwordAgain, 'Passwords do not match.');
    } else {
        setSuccess(passwordAgain);
    }
};

import { setError, setSuccess } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";