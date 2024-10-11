export const checkSessionAndLoadHeader = () => {
    fetch('api/getUserInfo.php') // Fetch user information
        .then(response => response.json())
        .then(data => {
            if (data.user_name) {
                loadHeader('headerLoggedIn.php', () => {
                    updateHeaderWithUserInfo(data.user_name, data.priority_card, data.authority); // Átadtuk a authority-t is
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
            setupContentLoadLinks(); // Setup links in new header

            // Call the callback function if provided
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
};

export const updateHeaderWithUserInfo = (userName, priorityCard, authority) => {
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

        if (status === 1) {
            let hideTimeout; // Késleltetett eltűnéshez használt változó

            transactionButton.onclick = null; // Engedélyezzük a legördülő menüt
            transactionButton.onmouseenter = () => {
                clearTimeout(hideTimeout); // Töröljük a timeoutot, ha az egér újra belép
                transactionDropdown.style.display = 'block'; // Megjelenítjük a legördülő listát
            };
            transactionButton.onmouseleave = () => {
                hideTimeout = setTimeout(() => {
                    if (!transactionDropdown.matches(':hover')) {
                        transactionDropdown.style.display = 'none';
                    }
                }, 100); // 0,5 másodperces késleltetés
            };
            transactionDropdown.onmouseenter = () => {
                clearTimeout(hideTimeout); // Töröljük a timeoutot, ha az egér belép a legördülő listába
                transactionDropdown.style.display = 'block';
            };
            transactionDropdown.onmouseleave = () => {
                hideTimeout = setTimeout(() => {
                    transactionDropdown.style.display = 'none';
                }, 100); 
            };
        } else {
            // Letiltjuk a legördülő menüt, és modalt jelenítünk meg
            transactionDropdown.style.display = 'none'; 
            transactionButton.onclick = function (event) {
                event.preventDefault();
                transactionModal.style.display = 'block';
                document.querySelector('.modal-overlay').classList.add('show');
            };
        }

        // Modal bezárása
        const closeModal = () => {
            transactionModal.style.display = 'none';
            document.querySelector('.modal-overlay').classList.remove('show');
        };

        closeTransactionModal.onclick = closeModal;
        document.querySelector('.modal-overlay').onclick = closeModal;

    } else {
        headerContent += `<p>N/A | Balance: N/A Ft | Status: N/A</p>`;
    }

    headerLeft.innerHTML = headerContent;

    // Ellenőrizd a jogosultságot és mutasd meg az Admin gombot, ha Authority = 2
    const adminButtonContainer = document.getElementById('admin-button-container');
    if (authority === 2) {
        adminButtonContainer.style.display = 'block'; // Admin gomb megjelenítése
    } else {
        adminButtonContainer.style.display = 'none'; // Admin gomb elrejtése
    }
};

/* **************************************************************************** */
    /* Bankkártya számának és státuszának formázása */

    import { formatCardNumber, formatCardStatus } from './formatting.js';

    /* **************************************************************************** */
    /* Eseménykezelők */

    import { setupContentLoadLinks } from './contentLoading.js';

    /* **************************************************************************** */
    // Ellenőrzi a fetch válasz státuszát. Ha a válasz nem sikeres (nem 2xx státusz), hibát dob.
    // Egyébként visszaadja a válasz szöveges tartalmát.

    const handleFetchResponse = (response) => {
        if (!response.ok) {
            throw new Error(`Error loading content: ${response.statusText}`);
        }
        return response.text();
    };
