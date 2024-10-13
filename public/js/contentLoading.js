    // Frissíti az eseménykezelőket minden linkhez, amely dinamikus tartalmat tölt be,
    // és beállít egy külön eseménykezelőt a kijelentkezési linkhez.
    export const setupContentLoadLinks = () => {
        document.querySelectorAll('a[data-load]').forEach(link => {
            link.removeEventListener('click', handleLinkClick); // Előző eseménykezelő eltávolítása
            link.addEventListener('click', handleLinkClick); // Új eseménykezelő hozzáadása
        });

        const logoutLink = document.querySelector('a[href="api/logout.php"]');
        if (logoutLink) {
            logoutLink.removeEventListener('click', handleLogout); // Előző eseménykezelő eltávolítása
            logoutLink.addEventListener('click', handleLogout); // Új eseménykezelő hozzáadása
        }
    };

    // Megakadályozza az alapértelmezett linkkattintási eseményt és betölti a dinamikus tartalmat
    // a linkhez tartozó 'data-load' attribútumban megadott oldal alapján.
    const handleLinkClick = (event) => {
        event.preventDefault();
    
        const page = event.currentTarget.getAttribute('data-load');
        const userId = event.currentTarget.getAttribute('data-userid'); // Ellenőrzi a data-userid attribútumot
    
        if (userId) {
            // Ha van userId, akkor azzal együtt hívjuk meg a loadContent függvényt
            loadContent(page, userId);
        } else {
            // Ha nincs userId, akkor a szokásos módon hívjuk meg a loadContent-et
            loadContent(page);
        }
    };
    

    const showLoadingMessage = () => {
        updateContent('<p>Loading content, please wait...</p>');
    };

    const updateContent = (content) => {
        document.getElementById('content').innerHTML = content;
    };

    const showError = (message) => {
        updateContent(`<p class="error">${message}</p>`);
    };

    export const loadContent = (page, userId = null) => {
        showLoadingMessage(); // Töltési üzenet megjelenítése
    
        let fetchUrl = `htmlTemplates/${page}`;
        
        // Ha van userId, akkor azt hozzáadjuk az URL-hez
        if (userId) {
            fetchUrl += `?userId=${userId}`;
        }
    
        fetch(fetchUrl)
            .then(handleFetchResponse)
            .then(data => {
                if (typeof data === 'string') {
                    updateContent(data); // Betöltött tartalom megjelenítése
                } else {
                    showError('Error loading content');
                }
    
                setupContentLoadLinks(); // Linkek újra beállítása az új tartalomhoz
    
                // Oldal-specifikus logika kezelése
                switch (page) {
                    case 'registerNewUser.php':
                        setupRegistrationValidation(); 
                        break;
                    case 'login.php':
                        setupLoginValidation();
                        break;
                    case 'registerNewCard.php':
                        setupNewCardValidation();
                        break;
                    case 'creditCards.php':  
                        loadCreditCards(); 
                        break;
                    case 'personalInfo.php':
                        loadPersonalInfo();
                        setupPersonalInfoButtons(); 
                        break;
                    case 'depositForm.php':
                        transactionFunction('depositForm', 'api/deposit.php', 'Deposit successful.');
                        break;
                    case 'withdrawForm.php':
                        transactionFunction('withdrawForm', 'api/withdraw.php', 'Withdraw successful.');
                        break; 
                    case 'transactionHistoryForm.php':
                        loadTransactionHistory();
                        break;
                    case 'transferForm.php':
                        setupTransferForm();
                        break;
                    case 'adminPageUsersForm.php':
                        loadAdminPageUsers();
                        break;
                    case 'adminPageTransactionsForm.php':
                        loadAdminPageTransactions();
                        break;
                    default:
                        break;
                }
    
                checkSessionAndLoadHeader(); // Frissíti a fejlécet az új tartalom betöltése után
            })
            .catch(error => {
                console.error('Something went wrong:', error); 
                showError('Error loading content.');
            });
    };    

    // Ellenőrzi a fetch válasz státuszát. Ha a válasz nem sikeres (nem 2xx státusz), hibát dob.
    // Egyébként visszaadja a válasz szöveges tartalmát.
    const handleFetchResponse = async (response) => {
        if (!response.ok) {
            const errorText = await response.text(); // Get the response text
            console.error(`Error loading content: ${response.statusText}`, errorText); // Log the error
            throw new Error(`Error loading content: ${response.statusText}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Return JSON if content type is JSON
        } else if (contentType && contentType.includes("text/html")) {
            return response.text(); // Return HTML if content type is HTML
        } else {
            const errorText = await response.text(); // Log the non-JSON response
            console.error('Expected JSON or HTML but received:', errorText);
            throw new Error('Response is not JSON or HTML');
        }
    };
    
    
    

    /* **************************************************************************** */
    // Logout link

    import { handleLogout } from './logout.js';

    /* **************************************************************************** */
    // Fejléc frissítése

    import { checkSessionAndLoadHeader } from './header.js';


    /* **************************************************************************** */
    // Bejelentkezési validálás

    import { setupLoginValidation } from './loginValidation.js';

    /* *************************************************************************** */
    // Regisztrációs validálás

    import { setupRegistrationValidation } from './registrationValidation.js';

    /* ******************************************************************************* */
    // Új bankkártya validálása

    import { setupNewCardValidation } from './newCardValidation.js';

    /* ************************************************************************** */
    // Személyes adatok betöltése

    import { loadPersonalInfo, setupPersonalInfoButtons } from './personalInfo.js';

    /* **************************************************************************** */
    // Bankkártyák betöltése

    import { loadCreditCards } from './creditCards.js';

    /* **************************************************************************** */
    // Deposit, Withdraw

    import { transactionFunction } from './transactionFunction.js';

    /* **************************************************************************** */
    // Transaction History

    import { loadTransactionHistory } from './transactionHistory.js';

    /* **************************************************************************** */
    // Transfer

    import { setupTransferForm } from './transferFunction.js';

    /* **************************************************************************** */
    // Admin page users

    import { loadAdminPageUsers } from './adminFunction.js';