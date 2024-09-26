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
        event.preventDefault(); // Megakadályozza az alapértelmezett linkkattintási műveletet
        const page = event.currentTarget.getAttribute('data-load'); // Lekéri az oldal URL-jét a 'data-load' attribútumból
        loadContent(page); // Betölti a kiválasztott oldalt
    };

    // Megjelenít egy töltési üzenetet az oldalon, amíg az új tartalom betöltődik
    const showLoadingMessage = () => {
        updateContent('<p>Loading content, please wait...</p>');
    };

    // Frissíti a 'content' elem tartalmát a megadott HTML kóddal
    const updateContent = (content) => {
        document.getElementById('content').innerHTML = content;
    };

    // Megjelenít egy hibát az oldalon, a megadott hibaüzenettel
    const showError = (message) => {
        updateContent(`<p class="error">${message}</p>`);
    };

    // Betölti a megadott oldalt, és végrehajtja az oldal-specifikus logikát
    export const loadContent = (page) => {
        showLoadingMessage(); // Töltési üzenet megjelenítése

        fetch(`htmlTemplates/${page}`) // Kért oldal tartalmának betöltése
            .then(handleFetchResponse) // Válasz ellenőrzése
            .then(data => {
                updateContent(data); // Betöltött tartalom megjelenítése
                setupContentLoadLinks(); // Linkek újra beállítása az új tartalomhoz

                // Oldal-specifikus logika kezelése
                switch (page) {
                    case 'registerNewUser.php':
                        setupRegistrationValidation(); // Regisztrációs űrlap validálása
                        break;
                    case 'login.php':
                        setupLoginValidation(); // Bejelentkezési űrlap validálása
                        break;
                    case 'registerNewCard.php':
                        setupNewCardValidation(); // Új kártya űrlap validálása
                        break;
                    case 'creditCards.php':  // Kártyalistázás esetén
                        loadCreditCards(); // Kártyák betöltése
                        break;
                    case 'personalInfo.php':
                        loadPersonalInfo(); // Személyes adatok betöltése
                        setupPersonalInfoButtons(); // Személyes információk gombjainak beállítása
                        break;
                    case 'depositForm.php':
                        setupDepositForm(); 
                        break;
                    case 'withdrawForm.php':
                        setupWithdrawForm(); 
                        break; 
                    case 'transactionHistoryForm.php':
                        loadTransactionHistory();
                        break;
                    case 'transferForm.php':
                        setupTransferForm();
                        break;
                    default:
                        break;
                }

                checkSessionAndLoadHeader(); // Frissíti a fejlécet az új tartalom betöltése után
            })
            .catch(error => {
                console.error('Something went wrong:', error); // Hibaüzenet a konzolra
                showError('Error loading content.'); // Hibaüzenet megjelenítése az oldalon
            });
    };

    // Ellenőrzi a fetch válasz státuszát. Ha a válasz nem sikeres (nem 2xx státusz), hibát dob.
    // Egyébként visszaadja a válasz szöveges tartalmát.
    const handleFetchResponse = (response) => {
        if (!response.ok) {
            throw new Error(`Error loading content: ${response.statusText}`); // Hibát dob, ha a válasz nem sikeres
        }
        return response.text(); // Visszaadja a válasz szöveges tartalmát
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
    // Deposit

    import { setupDepositForm } from './depositFunction.js';

    /* **************************************************************************** */
    // Withdraw

    import { setupWithdrawForm } from './withdrawFunction.js';

    /* **************************************************************************** */
    // Transaction History

    import { loadTransactionHistory } from './transactionHistory.js';

    /* **************************************************************************** */
    // Transfer

    import { setupTransferForm } from './transferFunction.js';