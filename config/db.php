<?php

/*

Adatbázis neve: bank
Táblák:

- user (id PK, name, email, password, authority)
- card (cardnumber PK, balance, user_id FK, pin, status, priority)
- transaction (id PK, cardnumber FK, amount, statement, date)

user authority: 0 blocked/deleted
            1 logged in
            2 admin

card status: 0 inactive
	 		 1 active
	 		 2 blocked

primary Card: 0 Secondary
			  1 Primary

 */

$servername = "localhost";
$username = "root";
$password = "";
$database = "bank";

$connection = new mysqli($servername, $username, $password, $database);

if($connection -> connect_error) {
    die("Connection failed: " . $connection -> connect_error);
}