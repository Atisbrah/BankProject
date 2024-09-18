<?php
// Session cookie paraméterek biztonságosabb beállítása
session_set_cookie_params([
    'lifetime' => 0, // A session a böngésző bezárásakor lejár
    'path' => '/',
    'domain' => '',  // Állítsd be a domain nevet szükség szerint
    'secure' => true, // Csak HTTPS-en keresztül küldhető cookie
    'httponly' => true, // Csak HTTP-n keresztül elérhető, JS-ből nem
    'samesite' => 'Strict' // CSRF támadások elleni védelem
]);

// Session elindítása
session_start();
?>
