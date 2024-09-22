export const loadTransactionHistory = () => {
    fetch('api/transactionHistory.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text();  // Válasz szöveges tartalmának lekérése
        })
        .then(text => {
            return JSON.parse(text); // Próbáld meg JSON-ként értelmezni
        })
        .then(data => {
            const tableBody = document.querySelector('#transactionTable tbody');
            tableBody.innerHTML = ''; // Clear previous content

            if (data.success) {
                if (data.transaction && data.transaction.length > 0) {
                    // Iteráljunk minden tranzakción és hozzuk létre a táblázat sorait
                    data.transaction.forEach(transaction => {
                        const row = document.createElement('tr');
                        const date = new Date(transaction.date).toLocaleString(); // Teljes dátum és idő formátum
                        row.innerHTML = `
                            <td>${transaction.id}</td>
                            <td>${transaction.amount} Ft</td>
                            <td>${transaction.statement}</td>
                            <td>${date}</td> <!-- Frissítve az idő formázásával -->
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    // Ha nincsenek tranzakciók
                    tableBody.innerHTML = '<tr><td colspan="4">No Transaction found.</td></tr>';
                }
            } else {
                // Ha a szerver visszatér a hibával
                tableBody.innerHTML = `<tr><td colspan="4">${data.errors.join(', ')}</td></tr>`;
                console.error('Error loading transactions:', data.errors.join(', '));
            }
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
            const tableBody = document.querySelector('#transactionTable tbody');
            tableBody.innerHTML = `<tr><td colspan="4">Error loading transactions: ${error.message}</td></tr>`;
        });
};
