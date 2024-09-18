<div class="inputForm">
    <form method="post" id="withdrawForm">
        <h2>Withdraw</h2>
        <div class="form-group">
            <label for="amount">Amount</label>
            <input type="text" id="amount" name="amount" placeholder="Please enter the desired amount.">
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
