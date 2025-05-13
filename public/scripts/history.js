let cuttingHistory = [];

function loadHistory() {
    fetch('../server/api.php?action=get_history')
        .then(response => response.json())
        .then(data => {
            cuttingHistory = data;
            updateHistoryTable();
        });
}

function updateHistoryTable() {
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = cuttingHistory.map(h => `
        <tr>
            <td>${h.orderNumber}</td>
            <td>${h.cuttingName}</td>
            <td>${h.efficiency}%</td>
            <td>${new Date(h.date).toLocaleDateString()}</td>
            <td><input type="date" value="${h.completionDate || ''}" onchange="updateCompletionDate('${h.id}', this.value)"></td>
            <td>
                <button class="btn btn-secondary" onclick="viewHistoryItem('${h.id}')">Просмотр</button>
                <button class="btn btn-danger" onclick="deleteHistoryItem('${h.id}')">Удалить</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6">Нет данных</td></tr>';
}

function updateCompletionDate(id, date) {
    fetch('../server/api.php?action=update_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completionDate: date })
    }).then(() => loadHistory());
}

function viewHistoryItem(id) {
    const historyItem = cuttingHistory.find(h => h.id === id);
    if (historyItem) {
        currentCuttingResult = historyItem;
        renderCuttingVisualization(historyItem);
        document.getElementById('save-cutting-btn').style.display = 'none';
        document.getElementById('print-cutting-btn').style.display = 'inline-block';
    }
}

function deleteHistoryItem(id) {
    if (confirm('Удалить запись?')) {
        fetch('../server/api.php?action=delete_history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        }).then(() => loadHistory());
    }
}

document.addEventListener('DOMContentLoaded', loadHistory);
