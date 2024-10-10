let InspectId;
let InspectCardId; // Hozzáadva a globális változó

/* *************************************************** */
/* **** Admin Page Functions User **** */

document.addEventListener('DOMContentLoaded', () => {
    const backToUserListLink = document.querySelector('[data-load="adminPageUsersForm.php"]');
    if (backToUserListLink) {
        backToUserListLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            loadAdminPageUsersForm(); 
        });
    }
});

export const loadAdminPageUsersForm = () => {
    return new Promise((resolve, reject) => {
        fetch('htmlTemplates/adminPageUsersForm.php') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load user list form');
                }
                return response.text();
            })
            .then(html => {
                const contentArea = document.querySelector('#content'); 
                if (contentArea) {
                    contentArea.innerHTML = html; 
                    return loadAdminPageUsers();  // Return the Promise here
                } else {
                    reject('Content area not found');
                }
            })
            .then(() => resolve())  // Resolve when users are loaded
            .catch(error => {
                console.error('Error loading admin page users form:', error);
                reject(error);
            });
    });
};

export const loadAdminPageUsers = () => {
    return new Promise((resolve, reject) => {
        fetch('api/adminPageUsers.php')
            .then(response => response.json())
            .then(jsonData => {
                if (!jsonData.success) {
                    throw new Error('Error fetching users: ' + jsonData.errors.join(', '));
                }
                const tbody = document.querySelector('#userTable tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    jsonData.users.forEach(user => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${getAuthorityLabel(user.authority)}</td>
                            <td>
                                <a href="#" onclick="handleShowCards(${user.id})">Show Cards</a>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                    resolve();  // Resolve the promise after loading users
                } else {
                    reject('User table body not found.');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                reject(error);
            });
    });
};

/* *************************************************** */
/* **** Admin Page Functions Card **** */

function handleShowCards(userId) {
    InspectId = userId;
    loadAdminPageCardsForm().then(() => {
        loadAdminPageCards(InspectId); // Kártyák betöltése az InspectId alapján
    });
}

function loadAdminPageCardsForm() {
    return new Promise((resolve, reject) => { 
        fetch('htmlTemplates/adminPageCardsForm.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load cards form');
                }
                return response.text(); 
            })
            .then(html => {
                const contentArea = document.querySelector('#content');
                if (contentArea) {
                    contentArea.innerHTML = html;
                    loadBackToUserListButton();
                    resolve(); 
                } else {
                    reject('Content area not found');
                }
            })
            .catch(error => {
                console.error('Error loading admin page cards form:', error);
                reject(error);
            });
    });
}

window.loadAdminPageCardsForm = loadAdminPageCardsForm;

function loadBackToUserListButton() {
    const miniHeaderRight = document.querySelector('#miniHeaderRight');
    if (miniHeaderRight) {
        miniHeaderRight.innerHTML = `
            <p><a href="#" data-load="adminPageUsersForm.php" onclick="resetInspectId()">Back to User List</a></p>
        `;
        
        const backToUserListLink = miniHeaderRight.querySelector('[data-load="adminPageUsersForm.php"]');
        if (backToUserListLink) {
            backToUserListLink.addEventListener('click', (event) => {
                event.preventDefault(); 
                loadAdminPageUsersForm(); 
            });
        }
    } else {
        console.error('#miniHeaderRight not found.');
    }
}

window.handleShowCards = handleShowCards;

function loadAdminPageCards(userId) {
    fetch(`api/adminPageCards.php?userId=${userId}`)
        .then(response => response.json())
        .then(jsonData => {
            const tbody = document.querySelector('#cardTable tbody');
            if (tbody) {
                tbody.innerHTML = ''; // Kiürítjük a táblázatot
                if (jsonData.success && jsonData.cards.length > 0) {
                    jsonData.cards.forEach(card => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${card.cardnumber}</td>
                            <td>${card.balance}</td>
                            <td>${getStatusLabel(card.status)}</td>
                            <td>${getPriorityLabel(card.priority)}</td>
                            <td>
                                <a href="#" data-load="adminPageTransactions.php" onclick="loadPageAndShowTransactions('${card.cardnumber}')">Show Transactions</a>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    // Ha nincs kártya, akkor kiírjuk az üzenetet
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="9">No cards found for this user.</td>`;
                    tbody.appendChild(row);
                }
            } else {
                console.error('Card table body not found.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}



window.loadAdminPageCards = loadAdminPageCards;

/* *************************************************** */
/* **** Admin Page Functions Transaction **** */

function loadBackToCreditCardListButton() {
    const miniHeaderRight = document.querySelector('#miniHeaderRight');
    if (miniHeaderRight) {
        miniHeaderRight.innerHTML += `
            <p><a href="#" data-load="adminPageCardsForm.php" onclick="loadAdminPageCardsFormWithUserId()">Back to Credit Card List</a></p>
        `;

        const backToCreditCardListLink = miniHeaderRight.querySelector('[data-load="adminPageCardsForm.php"]');
        if (backToCreditCardListLink) {
            backToCreditCardListLink.addEventListener('click', (event) => {
                event.preventDefault(); 
                loadAdminPageCardsForm(); 
            });
        }
    } else {
        console.error('#miniHeaderRight not found.');
    }
}

function loadAdminPageCardsFormWithUserId() {
    if (InspectId) {
        loadAdminPageCardsForm().then(() => {
            loadAdminPageCards(InspectId);  // Újratölti a kártyákat az InspectId alapján
        });
    } else {
        console.error('InspectId not set.');
    }
}

window.loadAdminPageCardsFormWithUserId = loadAdminPageCardsFormWithUserId;

function loadPageAndShowTransactions(cardnumber) {
    InspectCardId = cardnumber; 
    loadAdminPageTransactionsForm().then(() => {
        loadAdminPageTransactions(cardnumber); 
    }).catch(error => {
        console.error('Error loading transactions form:', error);
    });
}

function loadAdminPageTransactionsForm() {
    return new Promise((resolve, reject) => {
        fetch('htmlTemplates/adminPageTransactionsForm.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load transactions form');
                }
                return response.text();
            })
            .then(html => {
                const contentArea = document.querySelector('#content');
                if (contentArea) {
                    contentArea.innerHTML = html;
                    loadBackToCreditCardListButton();
                    resolve();
                } else {
                    reject('Content area not found');
                }
            })
            .catch(error => {
                console.error('Error loading admin page transactions form:', error);
                reject(error);
            });
    });
}

function loadAdminPageTransactions(cardnumber) {
    fetch(`api/adminPageTransactions.php?cardnumber=${encodeURIComponent(cardnumber)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            if (!jsonData.success) {
                throw new Error('Error fetching transactions: ' + jsonData.errors.join(', '));
            }

            const tbody = document.querySelector('#transactionTable tbody');
            if (tbody) {
                tbody.innerHTML = '';
                jsonData.transactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${transaction.cardnumber}</td>
                        <td>${transaction.amount}</td>
                        <td>${transaction.statement}</td>
                        <td>${transaction.date}</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                console.error('Transaction table body not found.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

window.loadPageAndShowTransactions = loadPageAndShowTransactions;

function handleShowTransactions(cardnumber) {
    InspectCardId = cardnumber;
    loadAdminPageTransactions(cardnumber); 
}

window.handleShowTransactions = handleShowTransactions;

/* *************************************************** */
/* **** Utility Functions **** */

function getAuthorityLabel(authority) {
    switch (authority) {
        case 0: return 'Blocked/Deleted';
        case 1: return 'User';
        case 2: return 'Admin';
        default: return 'Unknown';
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 0: return 'Inactive';
        case 1: return 'Active';
        case 2: return 'Blocked';
        default: return 'Unknown';
    }
}

function getPriorityLabel(priority) {
    switch (priority) {
        case 0: return 'Primary';
        case 1: return 'Secondary';
        default: return 'Unknown';
    }
}

function resetInspectId() {
    InspectId = null;
    InspectCardId = null; // Reset InspectCardId is important here
}

window.resetInspectId = resetInspectId;
