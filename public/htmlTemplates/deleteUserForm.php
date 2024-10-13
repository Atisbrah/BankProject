<div class="inputForm">
    <form method="post" id="deleteUserForm">
        <h2>Delete User</h2>
        <p>Are you sure you want to delete your account?</p>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password">
            <div class="errorMessage"></div>
        </div>
        <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password">
            <div class="errorMessage"></div>
        </div>
        <button type="submit">Confirm</button>
        <button id="cancelDelete">Cancel</button>
    </form>
</div>