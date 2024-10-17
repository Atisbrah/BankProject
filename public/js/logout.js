export function logoutOnReload() {
    window.addEventListener('beforeunload', () => {
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

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="api/logout.php"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

import { checkSessionAndLoadHeader } from './header.js'; 
import { loadContent } from './contentLoading.js';
