let stock = [];
let suppliers = [];

function loadStock() {
    fetch('../server/api.php?action=get_stock')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            stock = data;
            return fetch('../server/suppliers.json');
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(supplierData => {
            suppliers = supplierData;
            renderStockTable();
        })
        .catch(error => console.error('Error loading stock or suppliers:', error));
}

function searchSuppliers(value) {
    console.log('searchSuppliers called with value:', value);
    const resultsContainer = document.getElementById('autocomplete-supplier-results');
    if (!resultsContainer) {
        console.error('Supplier autocomplete container not found');
        return;
    }
    resultsContainer.innerHTML = '';

    if (!value) return;

    const searchTerm = value.toLowerCase();
    const matchingSuppliers = suppliers.filter(supplier => 
        supplier.toLowerCase().includes(searchTerm)
    );

    matchingSuppliers.forEach(supplier => {
        const div = document.createElement('div');
        div.textContent = supplier;
        div.addEventListener('click', () => {
            document.getElementById('add-stock-supplier').value = supplier;
            resultsContainer.innerHTML = '';
        });
        resultsContainer.appendChild(div);
    });
}

function addStock() {
    if (typeof profiles === 'undefined' || !profiles) {
        alert('Профили еще не загружены. Пожалуйста, подождите.');
        return;
    }

    const typeSelect = document.getElementById('profile-type-stock');
    const dimensionSelect = document.getElementById('profile-dimension-stock');
    const lengthInput = document.getElementById('add-stock-length');
    const quantityInput = document.getElementById('add-stock-quantity');
    const supplierInput = document.getElementById('add-stock-supplier');

    if (!typeSelect) console.error('profile-type-stock not found');
    if (!dimensionSelect) console.error('profile-dimension-stock not found');
    if (!lengthInput) console.error('add-stock-length not found');
    if (!quantityInput) console.error('add-stock-quantity not found');
    if (!supplierInput) console.error('add-stock-supplier not found');

    if (!typeSelect || !dimensionSelect || !lengthInput || !quantityInput || !supplierInput) {
        alert('Ошибка: Не удалось найти все элементы формы.');
        return;
    }

    const type = typeSelect.value;
    const dimensions = dimensionSelect.value;
    const length = parseInt(lengthInput.value);
    const quantity = parseInt(quantityInput.value);
    let supplier = supplierInput.value || 'Не указан';

    if (!type || !dimensions || isNaN(length) || length < 1 || isNaN(quantity) || quantity < 1) {
        alert('Пожалуйста, заполните все обязательные поля корректно.');
        return;
    }

    const profile = profiles[type].find(p => p.dimensions === dimensions);
    if (!profile) {
        alert('Профиль не найден.');
        return;
    }

    const weight = (profile.weight_per_meter * length * quantity) / 1000;

    if (supplier !== 'Не указан' && !suppliers.includes(supplier)) {
        suppliers.push(supplier);
        fetch('../server/api.php?action=update_suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(suppliers)
        }).catch(error => console.error('Error updating suppliers:', error));
    }

    const stockItem = {
        type,
        dimensions,
        length,
        quantity,
        weight,
        supplier,
        date: new Date().toISOString().split('T')[0]
    };

    fetch('../server/api.php?action=add_stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockItem)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                stock.push(stockItem);
                renderStockTable();
                typeSelect.value = '';
                dimensionSelect.value = '';
                lengthInput.value = '';
                quantityInput.value = '1';
                supplierInput.value = '';
            } else {
                alert('Ошибка при добавлении на склад.');
            }
        })
        .catch(error => console.error('Error adding stock:', error));
}

function renderStockTable() {
    const tbody = document.getElementById('stock-table').querySelector('tbody');
    if (!tbody) {
        console.error('Stock table body not found');
        return;
    }
    tbody.innerHTML = '';
    stock.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type} ${item.dimensions}</td>
            <td>${item.length}</td>
            <td>${item.quantity}</td>
            <td>${item.weight.toFixed(2)}</td>
            <td>${item.date}</td>
            <td>${item.supplier}</td>
            <td><button class="btn btn-danger" onclick="deleteStock(${index})">Удалить</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteStock(index) {
    const item = stock[index];
    fetch('../server/api.php?action=delete_stock', {
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
                stock.splice(index, 1);
                renderStockTable();
            } else {
                alert('Ошибка при удалении.');
            }
        })
        .catch(error => console.error('Error deleting stock:', error));
}

function filterStockTable() {
    const search = document.getElementById('stock-search').value.toLowerCase();
    const filtered = stock.filter(item => 
        `${item.type} ${item.dimensions}`.toLowerCase().includes(search)
    );
    const tbody = document.getElementById('stock-table').querySelector('tbody');
    if (!tbody) {
        console.error('Stock table body not found');
        return;
    }
    tbody.innerHTML = '';
    filtered.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type} ${item.dimensions}</td>
            <td>${item.length}</td>
            <td>${item.quantity}</td>
            <td>${item.weight.toFixed(2)}</td>
            <td>${item.date}</td>
            <td>${item.supplier}</td>
            <td><button class="btn btn-danger" onclick="deleteStock(${index})">Удалить</button></td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('stock.js loaded');
    loadStock();
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete')) {
            const supplierResults = document.getElementById('autocomplete-supplier-results');
            if (supplierResults) supplierResults.innerHTML = '';
        }
    });
});