<div class="inputForm">
    <form method="post" id="registrationForm">
        <h2>Registration</h2>

        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Name">
            <div class="errorMessage"></div>
        </div>
        
        <div class="form-group">
            <label for="email">Email</label>
            <input type="text" id="email" name="email" placeholder="Email">
            <div class="errorMessage"></div>
        </div>
        
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
        
        <button type="submit" id="registerButton">Submit</button>
    </form>
</div>
