export const checkSessionAndLoadHeader = () => {
    loadFooter();
    fetch('api/getUserInfo.php') 
        .then(response => response.json())
        .then(data => {
            if (data.user_name) {
                loadHeader('headerLoggedIn.php', () => {
                    updateHeaderWithUserInfo(data.user_name, data.priority_card, data.authority, data.priority_card_count); 
                });
            } else {
                loadHeader('headerLoggedOut.php');
            }
        })
        .catch(error => {
            console.error('Error loading user info:', error);
        });
};

export const loadHeader = (template, callback) => {
    fetch(`htmlTemplates/${template}`)
        .then(handleFetchResponse)
        .then(data => {
            document.getElementById('header').innerHTML = data;
            setupContentLoadLinks(); 

            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
};

export const loadFooter = () => {
    return fetch('htmlTemplates/footer.php')
        .then(handleFetchResponse)
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
};

const updateHeaderWithUserInfo = (userName, priorityCard, authority, priorityCardCount) => {
    const headerLeft = document.getElementById('header-left');
    const transactionButton = document.getElementById('transaction-button');
    const transactionDropdown = document.getElementById('transaction-dropdown');
    const transactionModal = document.getElementById('transactionModal');
    const closeTransactionModal = document.getElementById('closeTransactionModal');

    let headerContent = `<p>Welcome, ${userName}!</p>`;

    if (priorityCard) {
        const { cardnumber, balance, status } = priorityCard;
        const formattedCardNumber = formatCardNumber(cardnumber);
        const formattedStatus = formatCardStatus(status);
        headerContent += `<p>${formattedCardNumber} | Balance: ${balance} Ft | Status: ${formattedStatus}</p>`;

        if (status === 1 && priorityCardCount > 0) {
            let hideTimeout;

            transactionButton.onclick = null;
            transactionButton.onmouseenter = () => {
                clearTimeout(hideTimeout);
                transactionDropdown.style.display = 'block';
            };
            transactionButton.onmouseleave = () => {
                hideTimeout = setTimeout(() => {
                    if (!transactionDropdown.matches(':hover')) {
                        transactionDropdown.style.display = 'none';
                    }
                }, 500);
            };
            transactionDropdown.onmouseenter = () => {
                clearTimeout(hideTimeout);
                transactionDropdown.style.display = 'block';
            };
            transactionDropdown.onmouseleave = () => {
                hideTimeout = setTimeout(() => {
                    transactionDropdown.style.display = 'none';
                }, 500);
            };
        } else {
            transactionDropdown.style.display = 'none'; 
            transactionButton.style.pointerEvents = 'none';  
            transactionButton.style.opacity = '0.5';         
        }

        const closeModal = () => {
            transactionModal.style.display = 'none';
            document.querySelector('.modal-overlay').classList.remove('show');
        };

        closeTransactionModal.onclick = closeModal;
        document.querySelector('.modal-overlay').onclick = closeModal;

    } else {
        headerContent += `<p>N/A | Balance: N/A Ft | Status: N/A</p>`;
        transactionDropdown.style.display = 'none'; 
        transactionButton.style.pointerEvents = 'none'; 
        transactionButton.style.opacity = '0.5';        
    }

    headerLeft.innerHTML = headerContent;

    const adminButtonContainer = document.getElementById('admin-button-container');
    if (authority === 2) {
        adminButtonContainer.style.display = 'block'; 
    } else {
        adminButtonContainer.style.display = 'none';
    }
};

const handleFetchResponse = (response) => {
    if (!response.ok) {
        throw new Error(`Error loading content: ${response.statusText}`);
    }
    return response.text();
};

import { formatCardNumber, formatCardStatus } from './formatting.js';
import { setupContentLoadLinks } from './contentLoading.js';