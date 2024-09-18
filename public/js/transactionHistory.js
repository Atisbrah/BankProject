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
            if (data.success) {
                const tableBody = document.querySelector('#transactionTable tbody');
                tableBody.innerHTML = ''; // Clear previous content

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
                console.error('Error loading transactions:', data.errors.join(', '));
            }
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
        });
};
