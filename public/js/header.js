export const checkSessionAndLoadHeader = () => {
    fetch('api/getUserInfo.php') // Fetch user information
        .then(response => response.json())
        .then(data => {
            if (data.user_name) {
                loadHeader('headerLoggedIn.php', () => {
                    updateHeaderWithUserInfo(data.user_name, data.priority_card);
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

// Frissítjük a fejlécet a felhasználó és kártya információkkal
const updateHeaderWithUserInfo = (userName, priorityCard) => {
    const headerLeft = document.getElementById('header-left');
    let headerContent = `<p>Welcome, ${userName}!</p>`;

    if (priorityCard) {
        const { cardnumber, balance, status } = priorityCard;
        const formattedCardNumber = formatCardNumber(cardnumber);
        const formattedStatus = formatCardStatus(status);
        headerContent += `<p>${formattedCardNumber} | Balance: ${balance} Ft | Status: ${formattedStatus}</p>`;
    } else {
        // Ha nincs kártya, jelenítsünk meg "N/A" értékeket
        headerContent += `<p>N/A | Balance: N/A Ft | Status: N/A</p>`;
    }

    headerLeft.innerHTML = headerContent;
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
        throw new Error(`Error loading content: ${response.statusText}`); // Hibát dob, ha a válasz nem sikeres
    }
    return response.text(); // Visszaadja a válasz szöveges tartalmát
};
