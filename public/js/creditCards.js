// Fetches and displays the list of credit cards from the server
export const loadCreditCards = () => {
    fetch('api/listCreditCards.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableBody = document.querySelector('#creditCardTable tbody');
                tableBody.innerHTML = ''; // Clear previous content

                // Iterate over each card and create table rows
                data.cards.forEach(card => {
                    // Determine status and button properties
                    const statusText = (card.status === 0) ? 'Inactive' :
                                       (card.status === 1) ? 'Active' :
                                       'Blocked';

                    const buttonText = (card.status === 0) ? 'Activate Card' :
                                       (card.status === 1) ? 'Block Card' :
                                       'Blocked';

                    const buttonColor = (card.status === 0) ? 'green' :
                                        (card.status === 1) ? 'red' :
                                        'grey';

                    const isDisabled = (card.status === 2) ? 'disabled' : '';

                    // Set Priority Button properties
                    const priorityButtonText = (card.priority === 0) ? 'Set to Primary' : 'Primary';
                    const priorityButtonDisabled = (card.priority === 1) ? 'disabled' : '';
                    const priorityButtonColor = (card.priority === 1) ? 'grey' : 'blue';

                    // Create a new row and append it to the table
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
            } else {
                console.error('Error loading credit cards:', data.errors.join(', '));
            }
        })
        .catch(error => {
            console.error('Error fetching credit cards:', error);
        });
};

// Event handler for changing the card status
const handleStatusChange = (event) => {
    if (event.target && event.target.classList.contains('update-status-btn')) {
        const cardnumber = event.target.dataset.cardnumber;
        const status = event.target.closest('tr').children[2].textContent === 'Inactive' ? 0 : 1; // Determine status from row content
        changeCardStatus(cardnumber, status);
    }
};

// Event handler for changing the card priority
const handlePriorityChange = (event) => {
    if (event.target && event.target.classList.contains('update-priority-btn')) {
        const cardnumber = event.target.dataset.cardnumber;
        changeCardPriority(cardnumber);
    }
};

// Update the card priority on the server
const changeCardPriority = (cardNumber) => {
    fetch('api/changeCardPriority.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadCreditCards(); // Refresh the card list
            checkSessionAndLoadHeader(); // Check session after status update
        } else {
            alert('Error updating card priority: ' + data.errors.join(', '));
        }
    })
    .catch(error => {
        console.error('Error updating card priority:', error);
    });
};

const showPinModal = () => {
    return new Promise((resolve) => {
        const modal = document.getElementById('pinModal');
        let overlay = document.querySelector('.modal-overlay');

        // Ha az overlay még nem létezik, hozzuk létre
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay); // Add overlay to the body
        }

        // Show the overlay and modal
        overlay.style.display = 'block'; 
        modal.style.display = 'block';

        const pinInput = document.getElementById('pinInput');
        const confirmButton = document.getElementById('confirmPin');
        const cancelButton = document.getElementById('cancelPin');

        // Confirm button event
        confirmButton.onclick = () => {
            const pin = pinInput.value;
            if (!pin) {
                alert('PIN is required.');
            } else {
                modal.style.display = 'none';
                overlay.style.display = 'none'; // Hide overlay
                pinInput.value = ''; // Clear input
                resolve(pin); // Return the PIN
            }
        };

        // Cancel button event
        cancelButton.onclick = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none'; // Hide overlay
            pinInput.value = ''; // Clear input
            resolve(null); // Resolve with null
        };

        // Optional: hide modal and overlay on click outside
        overlay.onclick = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none'; // Hide overlay
            pinInput.value = ''; // Clear input
            resolve(null); // Resolve with null
        };
    });
};


const changeCardStatus = async (cardNumber, status) => {
    let pin = null;

    if (status === 0 || status === 1) {
        pin = await showPinModal(); // Show modal to enter PIN
        if (pin === null) {
            // Cancel was clicked, or the user clicked outside
            return; // Exit the function
        }
    }

    fetch('api/changeCardStatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardNumber, pin })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Card status updated successfully.');
            loadCreditCards(); // Refresh the card list
            checkSessionAndLoadHeader(); // Check session after status update
        } else {
            alert('Error updating card status: ' + data.errors.join(', '));
        }
    })
    .catch(error => {
        console.error('Error updating card status:', error);
    });
};


// Attach event listeners to handle button clicks
document.addEventListener('click', handleStatusChange);
document.addEventListener('click', handlePriorityChange);

import { checkSessionAndLoadHeader } from "./header.js";