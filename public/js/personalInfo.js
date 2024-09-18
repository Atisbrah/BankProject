
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
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openChangePasswordModal();
        });
    }
    document.getElementById('delete-user-btn').addEventListener('click', () => {
        // Handle delete user logic
        alert('Delete User clicked');
    });
};

const openChangePasswordModal = () => {
    const modal = document.getElementById('passwordModal');
    const overlay = document.querySelector('.modal-overlay');
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.classList.add('show');

        // Clear error messages
        clearErrorMessages();

        const cancelButton = document.getElementById('cancelPassword');
        cancelButton.onclick = () => {
            modal.style.display = 'none';
            overlay.classList.remove('show');
            clearPasswordFields();
        };

        window.onclick = (event) => {
            if (event.target === overlay) {
                modal.style.display = 'none';
                overlay.classList.remove('show');
                clearPasswordFields();
            }
        };

        const confirmButton = document.getElementById('confirmPassword');
        confirmButton.onclick = () => {
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (validatePasswordFields(oldPassword, newPassword, confirmNewPassword)) {
                changePassword(oldPassword, newPassword, confirmNewPassword);
            }
        };
    }
};

const validatePasswordFields = (oldPassword, newPassword, confirmNewPassword) => {
    let isValid = true;

    const oldPasswordError = document.querySelector('#oldPassword ~ .errorMessage');
    const newPasswordError = document.querySelector('#newPassword ~ .errorMessage');
    const confirmNewPasswordError = document.querySelector('#confirmNewPassword ~ .errorMessage');

    // Clear existing error messages
    clearErrorMessages();

    if (oldPassword === '') {
        oldPasswordError.innerText = 'Old password is required.';
        isValid = false;
    }

    if (newPassword === '') {
        newPasswordError.innerText = 'New password is required.';
        isValid = false;
    } else if (newPassword.length < 6) {
        newPasswordError.innerText = 'New password must be at least 6 characters long.';
        isValid = false;
    } else if (newPassword === oldPassword) {
        newPasswordError.innerText = 'New password cannot be the same as the old password.';
        isValid = false;
    }

    if (confirmNewPassword === '') {
        confirmNewPasswordError.innerText = 'Confirm new password is required.';
        isValid = false;
    } else if (confirmNewPassword !== newPassword) {
        confirmNewPasswordError.innerText = "Passwords don't match.";
        isValid = false;
    }

    return isValid;
};

const clearErrorMessages = () => {
    const errorMessages = document.querySelectorAll('.errorMessage');
    errorMessages.forEach(message => {
        message.innerText = '';
    });
};

const changePassword = (oldPassword, newPassword, confirmNewPassword) => {
    const formData = new FormData();
    formData.append('old-password', oldPassword);
    formData.append('new-password', newPassword);
    formData.append('confirm-new-password', confirmNewPassword);

    fetch('api/changePasswordUser.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const oldPasswordError = document.querySelector('#oldPassword ~ .errorMessage');
        const newPasswordError = document.querySelector('#newPassword ~ .errorMessage');
        const confirmNewPasswordError = document.querySelector('#confirmNewPassword ~ .errorMessage');

        if (data.success) {
            document.querySelector('.modal-overlay').classList.remove('show');
            document.getElementById('passwordModal').style.display = 'none';
            clearPasswordFields();
            alert('Password changed successfully.');
            // Optionally, refresh user info or redirect
        } else {
            if (data.errors['old-password']) {
                oldPasswordError.innerText = data.errors['old-password'];
            }
            if (data.errors['new-password']) {
                newPasswordError.innerText = data.errors['new-password'];
            }
            if (data.errors['confirm-new-password']) {
                confirmNewPasswordError.innerText = data.errors['confirm-new-password'];
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

const clearPasswordFields = () => {
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
};

/* Authority formázása */

import { formatAuthorityLabel } from './formatting.js';

