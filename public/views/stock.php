<div id="stock" class="tab-content active">
    <h2>Материалы на складе</h2>
    <table class="form-table">
        <tr>
            <td class="label">Поиск типа профиля:</td>
            <td class="input">
                <div class="autocomplete">
                    <input type="text" id="profile-type-search-stock" placeholder="Введите тип или размерность..." onkeyup="searchProfileTypes(this.value, 'stock')" autocomplete="off">
                    <div id="autocomplete-type-results-stock" class="autocomplete-items"></div>
                </div>
            </td>
            <td class="image" rowspan="7">
                <img id="profile-image-stock" class="profile-image" style="display: none;" onerror="this.style.display='none'">
            </td>
        </tr>
        <tr>
            <td class="label">Тип профиля:</td>
            <td class="input">
                <select id="profile-type-stock" onchange="updateDimensions('stock'); updateProfileImage('stock');" required>
                    <option value="">Выберите тип</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="label">Размерность:</td>
            <td class="input">
                <select id="profile-dimension-stock" required>
                    <option value="">Выберите размерность</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="label">Длина (мм):</td>
            <td class="input"><input type="number" id="add-stock-length" min="1" required></td>
        </tr>
        <tr>
            <td class="label">Количество:</td>
            <td class="input"><input type="number" id="add-stock-quantity" min="1" value="1" required></td>
        </tr>
        <tr>
            <td class="label">Поставщик:</td>
            <td class="input">
                <div class="autocomplete">
                    <input type="text" id="add-stock-supplier" onkeyup="searchSuppliers(this.value)" autocomplete="off">
                    <div id="autocomplete-supplier-results" class="autocomplete-items"></div>
                </div>
            </td>
        </tr>
        <tr>
            <td class="label"></td>
            <td class="input"><button class="btn" onclick="addStock()">Добавить</button></td>
        </tr>
    </table>
    <h3>Доступные материалы</h3>
    <div class="search-container">
        <input type="text" id="stock-search" placeholder="Поиск по профилю..." onkeyup="filterStockTable()">
    </div>
    <table class="data-table" id="stock-table">
        <thead>
            <tr>
                <th onclick="sortTable(0)">Профиль</th>
                <th onclick="sortTable(1)">Длина (мм)</th>
                <th onclick="sortTable(2)">Кол-во</th>
                <th onclick="sortTable(3)">Вес (кг)</th>
                <th onclick="sortTable(4)">Дата</th>
                <th onclick="sortTable(5)">Поставщик</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>