export const loadTransactionHistory = () => {
    fetch('api/transactionHistory.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text();
        })
        .then(text => {
            return JSON.parse(text);
        })
        .then(data => {
            const tableBody = document.querySelector('#transactionTable tbody');
            tableBody.innerHTML = '';

            if (data.success) {
                if (data.transaction && data.transaction.length > 0) {
                    data.transaction.forEach(transaction => {
                        const row = document.createElement('tr');
                        const date = new Date(transaction.date).toLocaleString();
                        row.innerHTML = `
                            <td>${transaction.id}</td>
                            <td>${transaction.amount} Ft</td>
                            <td>${transaction.statement}</td>
                            <td>${date}</td> <!-- Frissítve az idő formázásával -->
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    tableBody.innerHTML = '<tr><td colspan="4">No Transaction found.</td></tr>';
                }
            } else {
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
