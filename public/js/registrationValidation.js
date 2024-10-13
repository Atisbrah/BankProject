export const setupRegistrationValidation = () => {
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) return;

    registrationForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = registrationForm.querySelector('#name');
        const email = registrationForm.querySelector('#email');
        const password = registrationForm.querySelector('#password');
        const confirmPassword = registrationForm.querySelector('#confirmPassword');

        validateInputs(name, email, password, confirmPassword);

        if (registrationForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(registrationForm);

        fetch('api/registerUser.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Registration successful.');
                loadContent(data.redirect);
                checkSessionAndLoadHeader();
            } else {
                if (data.errors) {
                    for (const key in data.errors) {
                        const errorElement = document.querySelector(`#${key} ~ .errorMessage`);
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

const validateField = (field, emptyMessage, validationFn, invalidMessage) => {
    const value = field.value.trim();
    if (value === '') {
        setError(field, emptyMessage);
    } else if (validationFn && !validationFn(value)) {
        setError(field, invalidMessage);
    } else {
        setSuccess(field);
    }
};

const validateInputs = (name, email, password, confirmPassword) => {
    validateField(name, 'Name is required.', name => name.length >= 3, 'Name must be at least 3 characters long.');
    validateField(email, 'Email is required.', isValidEmail, 'Provide a valid email address.');
    validateField(password, 'Password is required.', value => validatePassword(value), 'Password must be at least 6 characters long, contain at least one uppercase letter and one number.');
    validateField(confirmPassword, 'Password confirmation is required.', value => value === password.value.trim(), "Passwords don't match.");
};

const validatePassword = (password) => {
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasUppercase && hasNumber;
};

import { setError, setSuccess, isValidEmail } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";