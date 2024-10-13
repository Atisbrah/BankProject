export const setupLoginValidation = () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = loginForm.querySelector('#email');
        const password = loginForm.querySelector('#password');

        validateLoginInputs(email, password);

        if (loginForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(loginForm);

        fetch('api/loginUser.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful.');
                checkSessionAndLoadHeader(); 
                loadContent(data.redirect); 
            } else {
                if (data.errors) {
                    if (data.errors.authorization) {
                        alert(data.errors.authorization);
                    }

                    for (const key in data.errors) {
                        const errorElement = loginForm.querySelector(`#${key} ~ .errorMessage`);
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


const validateLoginInputs = (email, password) => {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    
    if (emailValue === '') {
        setError(email, 'Email is required.');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address.');
    } else {
        setSuccess(email);
    }

    if (passwordValue === '') {
        setError(password, 'Password is required.');
    } else {
        setSuccess(password);
    }
};

import { isValidEmail, setError, setSuccess } from './formUtils.js';

import { checkSessionAndLoadHeader } from './header.js';

import { loadContent } from './contentLoading.js';