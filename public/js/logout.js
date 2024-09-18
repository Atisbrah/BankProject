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
            console.error('Hiba a kijelentkezés során:', error);
        });
    });
}


// Kijelentkezés kezelése kattintásra
export const handleLogout = (event) => {
    event.preventDefault(); // Megakadályozza a link alapértelmezett viselkedését

    fetch('api/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Frissíti a fejlécet kijelentkezés után
                checkSessionAndLoadHeader(); 
                // Véletlenszerű idézet betöltése
                loadContent('randomQuote.php'); 
                // Sikeres kijelentkezés értesítése
                alert('Sikeresen kijelentkezett.');
            } else {
                // Hibaüzenet kiírása, ha a kijelentkezés nem sikerült
                console.error('Kijelentkezés nem sikerült.');
            }
        })
        .catch(error => {
            // Hibaüzenet kiírása, ha a kijelentkezés során hiba lép fel
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

import { checkSessionAndLoadHeader } from './header.js'; // Fejléc frissítése
import { loadContent } from './contentLoading.js'; // Tartalom betöltése
