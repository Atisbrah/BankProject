<div class="header-content">
<div id="header-left">
        <p>Welcome!</p> 
    </div>
    
    <div class="header-middle" id="header-middle">
        <nav id="navbar">
            <ul>
                <li><a href="#" data-load="randomQuote.php">Home</a></li>
                <li><a href="#" data-load="transactionHistoryForm.php">Transaction History</a></li>
                <li>
                    <div class="dropdown">
                        <a href="#" class="dropbtn" id="transaction-button">Transaction</a>
                        <div class="dropdown-content" id="transaction-dropdown">
                            <a href="#" data-load="depositForm.php">Deposit</a>
                            <a href="#" data-load="withdrawForm.php">Withdraw</a>
                            <a href="#" data-load="transferForm.php">Transfer</a>
                        </div>
                    </div>
                </li>
                <li><a href="#" data-load="creditCards.php">Credit Cards</a></li>
                <li><a href="#" data-load="registerNewCard.php">New Card Registration</a></li>
                <li><a href="#" data-load="personalInfo.php">Personal Info</a></li>
                <li id="adminButton"><a href="#" data-load="adminPageUsersForm.php" >Admin</a></li>
                </ul>
        </nav>
    </div>

    <div class="header-right" id="header-right">
        <p><a href="api/logout.php">Log out</a></p>
    </div>
</div>

<div class="modal-overlay"></div>

<div id="transactionModal" class="modal">
    <h2>Transaction functions are not available.</h2>
    <p>Your primary card is Inactive/Blocked.</p>

    <button id="closeTransactionModal">Close</button>
</div>
