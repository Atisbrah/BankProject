/* **************************************************************************** */
/* Content betöltés */

document.addEventListener('DOMContentLoaded', () => {
    checkSessionAndLoadHeader(); // Betöltjük a megfelelő fejlécet az oldal betöltésekor
    setupContentLoadLinks(); // Linkek kezelése
    loadContent('randomQuote.php'); // Kezdő tartalom betöltése
});

import { setupContentLoadLinks, loadContent } from './contentLoading.js';

/* **************************************************************************** */
/* Header bal felső sarkában adatok megjelenítése */

import { checkSessionAndLoadHeader } from './header.js';

/* ******************************************************************************* */
// Logout link eseménykezelő

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="api/logout.php"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
});

/* **************************************************************************** */
/* Óra */

import { startClock } from './clock.js';
startClock();

/* **************************************************************************** */
/* Log out */

import { logoutOnReload, handleLogout } from './logout.js';

/* Kijelentkezés oldal újratöltésekor */
logoutOnReload();
