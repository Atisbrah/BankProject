export const loadPersonalInfo = () => {
    fetch('api/getPersonalInfo.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('user-id').innerText = data.user.id;
                document.getElementById('user-name').innerText = data.user.name;
                document.getElementById('user-email').innerText = data.user.email;
                document.getElementById('user-authority').innerText = formatAuthorityLabel(data.user.authority);
            } else {
                showError(data.errors.join(', '));
            }
        })
        .catch(error => {
            console.error('Error loading personal info:', error);
            showError('Error loading personal info.');
        });
};

export const setupPersonalInfoButtons = () => {
    document.getElementById('change-password-btn').addEventListener('click', () => {
        loadContent('changePasswordForm.php');
    })
    document.getElementById('delete-user-btn').addEventListener('click', () => {
        loadContent('deleteUserForm.php');
    });
};

import { formatAuthorityLabel } from './formatting.js';
import { loadContent } from './contentLoading.js';
