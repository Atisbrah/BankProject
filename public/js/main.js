document.addEventListener('DOMContentLoaded', async () => {
    await checkSessionAndLoadHeader();
    setupContentLoadLinks();
    loadContent('randomQuote.php');

    const logoutLink = document.querySelector('a[href="api/logout.php"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    await loadFooter();
    startClock();
    logoutOnReload();
});

import { startClock } from './clock.js';
import { logoutOnReload, handleLogout } from './logout.js';
import { setupContentLoadLinks, loadContent } from './contentLoading.js';
import { checkSessionAndLoadHeader, loadFooter } from './header.js';

