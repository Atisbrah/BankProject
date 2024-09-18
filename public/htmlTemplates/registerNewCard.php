<div class="inputForm">
  <form method="post" id="registerNewCardForm">
    <h2>Register New Card</h2>
    <div class="form-group">
      <label for="cardNumber">Card Number</label>
      <input type="text" id="cardNumber" name="cardNumber" placeholder="0000-0000-0000-0000">
      <div class="errorMessage"></div>
    </div>
    <div class="form-group">
        <label for="pin">PIN Code</label>
        <input type="password" id="pin" name="pin" maxlength="4" placeholder="Enter 4-digit PIN">
        <div class="errorMessage"></div>
    </div>
    <div class="form-group">
        <label for="confirmPin">Confirm PIN Code</label>
        <input type="password" id="confirmPin" name="confirmPin" maxlength="4" placeholder="Confirm PIN Code">
        <div class="errorMessage"></div>
    </div>
    <button type="submit">Register Card</button>
  </form>
</div>
