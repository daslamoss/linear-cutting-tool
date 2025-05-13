let cuttingList = [];

function loadCutting() {
    fetch('../server/api.php?action=get_cutting')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            cuttingList = data;
            renderCuttingTable();
        })
        .catch(error => console.error('Error loading cutting:', error));
}

function addCutting() {
    if (typeof profiles === 'undefined' || !profiles) {
        alert('Профили еще не загружены. Пожалуйста, подождите.');
        return;
    }

    const typeSelect = document.getElementById('profile-type-cutting');
    const dimensionSelect = document.getElementById('profile-dimension-cutting');
    const lengthInput = document.getElementById('cutting-length');
    const quantityInput = document.getElementById('cutting-quantity');
    const orderInput = document.getElementById('cutting-order');
    const partNameInput = document.getElementById('cutting-part-name');

    if (!typeSelect) console.error('profile-type-cutting not found');
    if (!dimensionSelect) console.error('profile-dimension-cutting not found');
    if (!lengthInput) console.error('cutting-length not found');
    if (!quantityInput) console.error('cutting-quantity not found');
    if (!orderInput) console.error('cutting-order not found');
    if (!partNameInput) console.error('cutting-part-name not found');

    if (!typeSelect || !dimensionSelect || !lengthInput || !quantityInput || !orderInput || !partNameInput) {
        alert('Ошибка: Не удалось найти все элементы формы.');
        return;
    }

    const type = typeSelect.value;
    const dimensions = dimensionSelect.value;
    const length = parseInt(lengthInput.value);
    const quantity = parseInt(quantityInput.value);
    const order = orderInput.value || 'Не указан';
    const partName = partNameInput.value || 'Не указано';

    if (!type || !dimensions || isNaN(length) || length < 1 || isNaN(quantity) || quantity < 1) {
        alert('Пожалуйста, заполните все обязательные поля корректно.');
        return;
    }

    const profile = profiles[type].find(p => p.dimensions === dimensions);
    if (!profile) {
        alert('Профиль не найден.');
        return;
    }

    const cuttingItem = {
        type,
        dimensions,
        length,
        quantity,
        order,
        partName
    };

    fetch('../server/api.php?action=add_cutting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuttingItem)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                cuttingList.push(cuttingItem);
                renderCuttingTable();
                typeSelect.value = '';
                dimensionSelect.value = '';
                lengthInput.value = '';
                quantityInput.value = '1';
                orderInput.value = '';
                partNameInput.value = '';
            } else {
                alert('Ошибка при добавлении в раскладку.');
            }
        })
        .catch(error => console.error('Error adding cutting:', error));
}

function renderCuttingTable() {
    const tbody = document.getElementById('cutting-table').querySelector('tbody');
    if (!tbody) {
        console.error('Cutting table body not found');
        return;
    }
    tbody.innerHTML = '';
    cuttingList.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type} ${item.dimensions}</td>
            <td>${item.length}</td>
            <td>${item.quantity}</td>
            <td>${item.order}</td>
            <td>${item.partName}</td>
            <td><button class="btn btn-danger" onclick="deleteCutting(${index})">Удалить</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteCutting(index) {
    const item = cuttingList[index];
    fetch('../server/api.php?action=delete_cutting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                cuttingList.splice(index, 1);
                renderCuttingTable();
            } else {
                alert('Ошибка при удалении.');
            }
        })
        .catch(error => console.error('Error deleting cutting:', error));
}

function sortCuttingTable(column) {
    cuttingList.sort((a, b) => {
        const values = [
            `${a.type} ${a.dimensions}`,
            a.length,
            a.quantity,
            a.order,
            a.partName
        ];
        const valA = values[column];
        const valB = values[column];
        return valA > valB ? 1 : -1;
    });
    renderCuttingTable();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('cutting.js loaded');
    loadCutting();
});