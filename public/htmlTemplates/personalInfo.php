<div id="personal-info" class="personal-info">
    <h2>Personal Information</h2>
    <p><strong>ID:</strong> <span id="user-id"></span></p>
    <p><strong>Name:</strong> <span id="user-name"></span></p>
    <p><strong>Email:</strong> <span id="user-email"></span></p>
    <p><strong>Authority:</strong> <span id="user-authority"></span></p>
    <div class="button-group">
        <button id="change-password-btn" class="btn">Change Password</button>
        <button id="delete-user-btn" class="btn">Delete User</button>
    </div>
</div>

<div class="modal-overlay"></div>

<div id="passwordModal" class="modal">
    <h2>Change Password</h2>
    <div class="form-group">
        <label for="oldPassword">Old Password</label>
        <input type="password" id="oldPassword" placeholder="Old Password">
        <div class="errorMessage"></div>
    </div>

    <div class="form-group">
        <label for="newPassword">New Password</label>
        <input type="password" id="newPassword" placeholder="New Password">
        <div class="errorMessage"></div>
    </div>

    <div class="form-group">
        <label for="confirmNewPassword">Confirm New Password</label>
        <input type="password" id="confirmNewPassword" placeholder="Confirm New Password">
        <div class="errorMessage"></div>
    </div>

    <button id="confirmPassword">Confirm</button>
    <button id="cancelPassword">Cancel</button>
</div>
