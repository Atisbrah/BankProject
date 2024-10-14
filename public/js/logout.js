// logout.js

// Kijelentkezés végrehajtása, amikor az oldal újratöltődik
/*export function logoutOnReload() {
    // Az oldal újratöltése előtt végrehajtandó művelet
    window.addEventListener('beforeunload', () => {
        fetch('api/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'logout' })
        })
        .catch(error => {
            // Hibaüzenet kiírása, ha a kijelentkezés nem sikerül
            console.error('Hiba a kijelentkezés során:', error);
        });
    });
}*/

// logout.js

// Eltávolítjuk a kijelentkezést az oldal újratöltésekor
export function logoutOnReload() {
    window.removeEventListener('beforeunload', () => {
        fetch('api/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'logout' })
        })
        .catch(error => {
            console.error('Error during log out:', error);
        });
    });
}


// Kijelentkezés kezelése kattintásra
export const handleLogout = (event) => {

    fetch('api/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                checkSessionAndLoadHeader(); 
                loadContent('randomQuote.php'); 
                alert('Logging out.');
            } else {
                console.error('Kijelentkezés nem sikerült.');
            }
        })
        .catch(error => {
            console.error('Hiba a kijelentkezés során:', error);
        });
};

// Oldal betöltésekor a kijelentkezés kezelése
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="api/logout.php"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

import { checkSessionAndLoadHeader } from './header.js'; 
import { loadContent } from './contentLoading.js';
