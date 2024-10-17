export const loadCreditCards = async () => {
    try {
        const response = await fetch('api/listCreditCards.php');
        const data = await response.json();

        const table = document.querySelector('.creditCardList table');
        const noCardsMessage = document.querySelector('#noCardsMessage');
        
        if (data.success && data.cards.length > 0) {
            const tableBody = document.querySelector('#creditCardTable tbody');
            tableBody.innerHTML = '';

            data.cards.forEach(card => {
                const { statusText, buttonText, buttonColor, isDisabled } = getStatusProperties(card.status);
                const { priorityButtonText, priorityButtonDisabled, priorityButtonColor } = getPriorityProperties(card.priority);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${card.cardnumber}</td>
                    <td>${card.balance} Ft</td>
                    <td>${statusText}</td>
                    <td>${card.priority === 1 ? 'Primary' : 'Secondary'}</td>
                    <td>
                        <button class="update-status-btn" style="background-color: ${buttonColor}; color: white;" data-cardnumber="${card.cardnumber}" ${isDisabled}>${buttonText}</button>
                    </td>
                    <td>
                        <button class="update-priority-btn" style="background-color: ${priorityButtonColor}; color: white;" data-cardnumber="${card.cardnumber}" ${priorityButtonDisabled}>${priorityButtonText}</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.style.display = 'table';
            noCardsMessage.style.display = 'none';
        } else {
            table.style.display = 'none';
            noCardsMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching credit cards:', error);
    }
};

const getStatusProperties = (status) => {
    let statusText, buttonText, buttonColor, isDisabled;
    switch (status) {
        case 0:
            statusText = 'Inactive';
            buttonText = 'Activate Card';
            buttonColor = 'green';
            isDisabled = '';
            break;
        case 1:
            statusText = 'Active';
            buttonText = 'Block Card';
            buttonColor = 'red';
            isDisabled = '';
            break;
        case 2:
            statusText = 'Blocked';
            buttonText = 'Blocked';
            buttonColor = 'grey';
            isDisabled = 'disabled';
            break;
    }
    return { statusText, buttonText, buttonColor, isDisabled };
};

const getPriorityProperties = (priority) => {
    return {
        priorityButtonText: priority === 0 ? 'Set to Primary' : 'Primary',
        priorityButtonDisabled: priority === 1 ? 'disabled' : '',
        priorityButtonColor: priority === 1 ? 'grey' : 'blue',
    };
};

const handleStatusChange = async (event) => {
    if (event.target && event.target.classList.contains('update-status-btn')) {
        const cardnumber = event.target.dataset.cardnumber;
        const statusText = event.target.textContent; 
        let status;

        if (statusText === 'Activate Card') {
            status = 0; 
        } else if (statusText === 'Block Card') {
            status = 1; 
        }

        changeCardStatus(cardnumber, status);
    }
};


const handlePriorityChange = (event) => {
    if (event.target && event.target.classList.contains('update-priority-btn')) {
        const cardnumber = event.target.dataset.cardnumber;
        changeCardPriority(cardnumber);
    }
};

const changeCardPriority = async (cardNumber) => {
    try {
        const response = await fetch('api/changeCardPriority.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardNumber })
        });
        const data = await response.json();
        if (data.success) {
            loadCreditCards();
            checkSessionAndLoadHeader();
        } else {
            alert('Error updating card priority: ' + data.errors.join(', '));
        }
    } catch (error) {
        console.error('Error updating card priority:', error);
    }
};

const changeCardStatus = async (cardNumber, status) => {
    try {
        const response = await fetch('api/changeCardStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardNumber }) 
        });
        const data = await response.json();
        if (data.success) {
            alert('Card status updated successfully.');
            loadCreditCards();
            checkSessionAndLoadHeader();
        } else {
            alert('Error updating card status: ' + data.errors.join(', '));
        }
    } catch (error) {
        console.error('Error updating card status:', error);
    }
};

document.addEventListener('click', handleStatusChange);
document.addEventListener('click', handlePriorityChange);

import { checkSessionAndLoadHeader } from './header.js';
