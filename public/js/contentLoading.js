export const setupContentLoadLinks = () => {
    document.querySelectorAll('a[data-load]').forEach(link => {
        link.removeEventListener('click', handleLinkClick); 
        link.addEventListener('click', handleLinkClick);
    });

    const logoutLink = document.querySelector('a[href="api/logout.php"]');
    if (logoutLink) {
        logoutLink.removeEventListener('click', handleLogout);
        logoutLink.addEventListener('click', handleLogout);
    }
};

const handleLinkClick = (event) => {
    event.preventDefault();

    const page = event.currentTarget.getAttribute('data-load');
    const userId = event.currentTarget.getAttribute('data-userid');

    if (userId) {
        loadContent(page, userId);
    } else {
        loadContent(page);
    }
};


const showLoadingMessage = () => {
    updateContent('<p>Loading content, please wait...</p>');
};

const updateContent = (content) => {
    document.getElementById('content').innerHTML = content;
};

const showError = (message) => {
    updateContent(`<p class="error">${message}</p>`);
};

export const loadContent = (page, userId = null) => {
    showLoadingMessage();

    let fetchUrl = `htmlTemplates/${page}`;
    
    if (userId) {
        fetchUrl += `?userId=${userId}`;
    }

    fetch(fetchUrl)
        .then(handleFetchResponse)
        .then(data => {
            if (typeof data === 'string') {
                updateContent(data); 
            } else {
                showError('Error loading content');
            }

            setupContentLoadLinks(); 
            switch (page) {
                case 'registerNewUser.php':
                    setupRegistrationValidation(); 
                    break;
                case 'login.php':
                    setupLoginValidation();
                    break;
                case 'registerNewCard.php':
                    setupNewCardValidation();
                    break;
                case 'creditCards.php':  
                    loadCreditCards(); 
                    break;
                case 'personalInfo.php':
                    loadPersonalInfo();
                    setupPersonalInfoButtons(); 
                    break;
                case 'depositForm.php':
                    transactionFunction('depositForm', 'api/deposit.php', 'Deposit successful.');
                    break;
                case 'withdrawForm.php':
                    transactionFunction('withdrawForm', 'api/withdraw.php', 'Withdraw successful.');
                    break; 
                case 'transactionHistoryForm.php':
                    loadTransactionHistory();
                    break;
                case 'transferForm.php':
                    setupTransferForm();
                    break;
                case 'adminPageUsersForm.php':
                    loadAdminPageUsers();
                    break;
                case 'adminPageTransactionsForm.php':
                    loadAdminPageTransactions();
                    break;
                case 'changePasswordForm.php': 
                    changePassword();
                    break;
                case 'deleteAccountForm.php': 
                    deleteUser();
                    break;
                case 'logoutForm.php':
                    handleLogout();
                    break;
                case 'editPersonalInfoForm.php':
                    editPersonalInfo();
                    break;
                default:
                    break;
            }

            checkSessionAndLoadHeader();
        })
        .catch(error => {
            console.error('Something went wrong:', error); 
            showError('Error loading content.');
        });
};    

const handleFetchResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text(); 
        console.error(`Error loading content: ${response.statusText}`, errorText);
        throw new Error(`Error loading content: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json(); 
    } else if (contentType && contentType.includes("text/html")) {
        return response.text(); 
    } else {
        const errorText = await response.text(); 
        console.error('Expected JSON or HTML but received:', errorText);
        throw new Error('Response is not JSON or HTML');
    }
};

import { handleLogout } from './logout.js';
import { checkSessionAndLoadHeader } from './header.js';
import { setupLoginValidation } from './loginValidation.js';
import { setupRegistrationValidation } from './registrationValidation.js';
import { setupNewCardValidation } from './newCardValidation.js';
import { loadPersonalInfo, setupPersonalInfoButtons } from './personalInfo.js';
import { loadCreditCards } from './creditCards.js';
import { transactionFunction } from './transactionFunction.js';
import { loadTransactionHistory } from './transactionHistory.js';
import { setupTransferForm } from './transferFunction.js';
import { loadAdminPageUsers } from './adminFunction.js';
import { changePassword } from './changePasswordFunction.js';
import { deleteUser } from './deleteAccountFunction.js';
import { editPersonalInfo } from './editPersonalInfoFunction.js';