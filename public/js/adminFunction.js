let InspectId = null;
let InspectCardId = null;
let userId = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('api/loginUser.php');
        const data = await response.json();
        userId = data.userId;
    } catch (error) {
        console.error('Error fetching user ID:', error);
    }

    const backToUserListLink = document.querySelector('[data-load="adminPageUsersForm.php"]');
    if (backToUserListLink) {
        backToUserListLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadAdminPageUsersForm();
        });
    }

    const backToCardListLink = document.querySelector('[data-load="adminPageCardsForm.php"]');
    if (backToCardListLink) {
        backToCardListLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadAdminPageCardsForm();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const backToUserListLink = document.querySelector('[data-load="adminPageUsersForm.php"]');
    if (backToUserListLink) {
        backToUserListLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadAdminPageUsersForm();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const backToCardListLink = document.querySelector('[data-load="adminPageCardsForm.php"]');
    if (backToCardListLink) {
        backToCardListLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadAdminPageCardsForm();
        });
    }
})

// Function to load the user list form
window.loadAdminPageUsersForm = async () => {
    try {
        const html = await fetchHtml('htmlTemplates/adminPageUsersForm.php');
        const contentArea = document.querySelector('#content');
        if (contentArea) {
            contentArea.innerHTML = html;
            await loadAdminPageUsers();
        } else {
            throw new Error('Content area not found');
        }
    } catch (error) {
        console.error('Error loading admin page users form:', error);
    }
};

// Function to fetch and load users
export const loadAdminPageUsers = async () => {
    try {
        const jsonData = await fetchJson('api/adminPageUsers.php');
        const tbody = document.querySelector('#userTable tbody');
        if (!tbody) throw new Error('User table body not found.');

        tbody.innerHTML = '';
        if (jsonData.success) {
            jsonData.users.forEach(user => {
                tbody.appendChild(createUserRow(user));
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
};

// Helper function to create user table row
const createUserRow = (user) => {
    const row = document.createElement('tr');
    const isCurrentAdmin = user.id === userId;

    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${getAuthorityLabel(user.authority)}</td>
        <td>
            ${isCurrentAdmin ? 
                '<span>Your Account</span>' :
                `<select onchange="updateUserAuthority(${user.id}, this.value)">
                    <option value="0" ${user.authority == 0 ? 'selected' : ''}>Blocked/Deleted</option>
                    <option value="1" ${user.authority == 1 ? 'selected' : ''}>User</option>
                    <option value="2" ${user.authority == 2 ? 'selected' : ''}>Admin</option>
                </select>`
            }
        </td>
        <td>
            <a href="#" onclick="handleShowCards(${user.id})">Show Cards</a>
        </td>
    `;
    return row;
};

// Update user authority
window.updateUserAuthority = async (userId, newAuthority, currentAdminId) => {
    if (userId === currentAdminId && newAuthority !== 2) {
        alert('You cannot change your own authority level!');
        return;
    }
    try {
        const data = await postJson('api/updateUserAuthority.php', { userId, authority: newAuthority });
        if (data.success) {
            loadAdminPageUsers();
        } else {
            alert('Error updating authority: ' + data.errors.join(', '));
        }
    } catch (error) {
        console.error('Error updating authority:', error);
    }
};

// Load admin page cards form
window.loadAdminPageCardsForm = async () => {
    try {
        const html = await fetchHtml('htmlTemplates/adminPageCardsForm.php');
        const contentArea = document.querySelector('#content');
        if (contentArea) {
            contentArea.innerHTML = html;
            loadBackToUserListButton();
        } else {
            throw new Error('Content area not found');
        }
    } catch (error) {
        console.error('Error loading admin page cards form:', error);
    }
};

// Load admin page transactions form
window.loadAdminPageTransactionsForm = async () => {
    try {
        const html = await fetchHtml('htmlTemplates/adminPageTransactionsForm.php');
        const contentArea = document.querySelector('#content');
        if (contentArea) {
            contentArea.innerHTML = html;
            loadBackToCreditCardListButton();
        } else {
            throw new Error('Content area not found');
        }
    } catch (error) {
        console.error('Error loading admin page transactions form:', error);
    }
};

// Load admin page cards
window.loadAdminPageCards = async (userId) => {
    try {
        const jsonData = await fetchJson(`api/adminPageCards.php?userId=${userId}`);
        const tbody = document.querySelector('#cardTable tbody');
        if (!tbody) throw new Error('Card table body not found.');

        tbody.innerHTML = ''; // Clear existing rows
        if (jsonData.success && jsonData.cards.length > 0) {
            jsonData.cards.forEach(card => {
                tbody.appendChild(createCardRow(card));
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="9">No cards found for this user.</td>`;
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading cards:', error);
    }
};

// Helper function to create card table row
const createCardRow = (card) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${card.id}</td>
        <td>${card.cardnumber}</td>
        <td>${card.user_id}</td>
        <td>${card.balance}</td>
        <td>${getStatusLabel(card.status)}</td>
        <td>
            <select onchange="updateCardStatus(${card.id}, this.value)">
                <option value="0" ${card.status == 0 ? 'selected' : ''}>Inactive</option>
                <option value="1" ${card.status == 1 ? 'selected' : ''}>Active</option>
                <option value="2" ${card.status == 2 ? 'selected' : ''}>Blocked</option>
            </select>
        </td>
        <td>${getPriorityLabel(card.priority)}</td>
        <td>
            <select onchange="updateCardPriority(${card.id}, this.value)">
                <option value="0" ${card.priority == 0 ? 'selected' : ''}>Secondary</option>
                <option value="1" ${card.priority == 1 ? 'selected' : ''}>Primary</option>
            </select>
        </td>
        <td>
            <a href="#" onclick="handleShowTransactions('${card.cardnumber}')">Show Transactions</a>
        </td>
    `;
    return row;
};

// Show cards for a user
window.handleShowCards = (userId) => {
    InspectId = userId;
    loadAdminPageCardsForm().then(() => {
        loadAdminPageCards(InspectId);
    });
};

window.handleShowTransactions = (cardnumber) => {
    InspectCardId = cardnumber;
    loadAdminPageTransactionsForm().then(() => {
        loadPageAndShowTransactions(InspectCardId);
    });
}

// Update card status
window.updateCardStatus = async (cardId, newStatus) => {
    try {
        const data = await postJson('api/updateCardStatus.php', { cardId, status: newStatus });
        if (data.success) {
            loadAdminPageCards(InspectId);
        } else {
            alert('Error updating status: ' + data.errors.join(', '));
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
};

// Update card priority
window.updateCardPriority = async (cardId, newPriority) => {
    try {
        const data = await postJson('api/updateCardPriority.php', { cardId, priority: newPriority });
        if (data.success) {
            loadAdminPageCards(InspectId);
        } else {
            alert('Error updating priority: ' + data.errors.join(', '));
        }
    } catch (error) {
        console.error('Error updating priority:', error);
    }
};

// Load transactions for a card
window.loadPageAndShowTransactions = async (cardnumber) => {
    InspectCardId = cardnumber;
    loadBackToCreditCardListButton();
    try {
        const jsonData = await fetchJson(`api/adminPageTransactions.php?cardnumber=${cardnumber}`);
        const tbody = document.querySelector('#transactionTable tbody');
        if (tbody) {
            tbody.innerHTML = '';
            if (jsonData.success && jsonData.transactions.length > 0) {
                jsonData.transactions.forEach(transaction => {
                    tbody.appendChild(createTransactionRow(transaction));
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="4">No transactions found for this card.</td>`;
                tbody.appendChild(row);
            }
        } else {
            console.error('Transaction table body not found.');
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
};

// Helper function to create transaction row
const createTransactionRow = (transaction) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.cardnumber}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.statement}</td>
        <td>${transaction.date}</td>
    `;
    return row;
};

// Load the back button for user list
function loadBackToUserListButton() {
    const miniHeaderRight = document.querySelector('#miniHeaderRight');
    if (miniHeaderRight) {
        miniHeaderRight.innerHTML = `<p><a href="#" data-load="adminPageUsersForm.php" onclick="resetInspectId(); loadAdminPageUsersForm();">Back to User List</a></p>
`;
    } else {
        console.error('#miniHeaderRight not found.');
    }
}

function loadBackToCreditCardListButton() {
    const miniHeaderRight = document.querySelector('#miniHeaderRight');
    if (miniHeaderRight) {
        // Clear previous content
        miniHeaderRight.innerHTML = '';

        // Create and append the back to user list link
        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.textContent = 'Back to User List';
        backLink.onclick = (event) => {
            event.preventDefault();
            resetInspectId();
            loadAdminPageUsersForm();
        };
        miniHeaderRight.appendChild(backLink);
        
        // Create and append the show cards link
        const showCardsLink = document.createElement('a');
        showCardsLink.href = '#';
        showCardsLink.textContent = 'Show Cards';
        showCardsLink.onclick = (event) => {
            event.preventDefault();
            handleShowCards(InspectId); // Use InspectId directly
        };
        miniHeaderRight.appendChild(showCardsLink);
    } else {
        console.error('#miniHeaderRight not found.');
    }
}


// Utility functions for fetching HTML and JSON
const fetchHtml = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load HTML from ${url}`);
    return response.text();
};

const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load JSON from ${url}`);
    return response.json();
};

const postJson = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Failed to post JSON to ${url}`);
    return response.json();
};

// Utility functions for labels
const getAuthorityLabel = (authority) => {
    switch (authority) {
        case 0: return 'Blocked/Deleted';
        case 1: return 'User';
        case 2: return 'Admin';
        default: return 'Unknown';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 0: return 'Inactive';
        case 1: return 'Active';
        case 2: return 'Blocked';
        default: return 'Unknown';
    }
};

const getPriorityLabel = (priority) => {
    switch (priority) {
        case 0: return 'Secondary';
        case 1: return 'Primary';
        default: return 'Unknown';
    }
};

// Reset inspect ID
function resetInspectId() {
    InspectId = null;
}

// Reset inspect card ID
function resetInspectCardId() {
    InspectCardId = null;
}

window.resetInspectId = resetInspectId;
window.resetInspectCardId = resetInspectCardId;