<div class="inputForm">
    <form method="post" id="transferForm">
        <h2>Transfer</h2>
        <div class="form-group">
            <label for="cardNumber">Card number</label>
            <input type="text" id="cardNumber" name="cardNumber" placeholder="0000-0000-0000-0000">
            <div class="errorMessage"></div>
        </div>
        <div class="form-group">
            <label for="statement">Statement</label>
            <input type="text" id="statement" name="statement" placeholder="Statement">
            <div class="errorMessage"></div>
        </div>
        <div class="form-group">
            <label for="amount">Amount</label>
            <input type="number" id="amount" name="amount" max="9999999" placeholder="Please enter the desired amount.">
            <div class="errorMessage"></div>
        </div>
        <div class="form-group">
            <label for="pin">PIN Code</label>
            <input type="password" id="pin" name="pin" maxlength="4" placeholder="Enter 4-digit PIN">
            <div class="errorMessage"></div>
        </div>
        <button type="submit">Confirm</button>
    </form>
</div>
