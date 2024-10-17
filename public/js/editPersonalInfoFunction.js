export const editPersonalInfo = () => {
    const editPersonalInfoForm = document.getElementById('editPersonalInfoForm');
    if (!editPersonalInfoForm) return;

    // Betöltjük a felhasználó adatait az input mezőkbe
    fetch('api/getPersonalInfo.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('name').value = data.user.name;
                document.getElementById('email').value = data.user.email;
            } else {
                console.error(data.errors.join(', '));
            }
        })
        .catch(error => {
            console.error('Error fetching personal info:', error);
        });

    editPersonalInfoForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = editPersonalInfoForm.querySelector('#name');
        const email = editPersonalInfoForm.querySelector('#email');

        validateEditPersonalInfoInputs(name, email);

        if (editPersonalInfoForm.querySelectorAll('.error').length > 0) {
            return;
        }

        const formData = new FormData(editPersonalInfoForm);

        fetch('api/editPersonalInfo.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to edit personal information.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Personal information changed successfully.');
                checkSessionAndLoadHeader();
                loadContent('randomQuote.php');      
            } else {
                if (data.errors) {
                    if (data.errors.authorization) {
                        alert(data.errors.authorization);
                    }

                    for (const key in data.errors) {
                        const errorElement = editPersonalInfoForm.querySelector(`#${key} ~ .errorMessage`);
                        if (errorElement) {
                            errorElement.textContent = data.errors[key];
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error editing personal information:', error);
        });
    });
};

const validateEditPersonalInfoInputs = (name, email) => {
    if (name.value.trim() === '') {
        setError(name, 'Name is required.');
    } else if (name.value.trim().length < 3) {
        setError(name, 'Name must be at least 3 characters long.');
    } else {
        setSuccess(name);
    }

    if (email.value.trim() === '') {
        setError(email, 'Email is required.');
    } else if (!isValidEmail(email.value.trim())) {
        setError(email, 'Provide a valid email address.');
    } else {
        setSuccess(email);
    }
};

import { setError, setSuccess, isValidEmail } from "./formUtils.js";
import { loadContent } from "./contentLoading.js";
import { checkSessionAndLoadHeader } from "./header.js";
