<div id="cutting" class="tab-content">
    <h2>Раскладка</h2>
    <table class="form-table">
        <tr>
            <td class="label">Поиск типа профиля:</td>
            <td class="input">
                <div class="autocomplete">
                    <input type="text" id="profile-type-search-cutting" placeholder="Введите тип или размерность..." onkeyup="searchProfileTypes(this.value, 'cutting')" autocomplete="off">
                    <div id="autocomplete-type-results-cutting" class="autocomplete-items"></div>
                </div>
            </td>
            <td class="image" rowspan="8">
                <img id="profile-image-cutting" class="profile-image" style="display: none;" onerror="this.style.display='none'">
            </td>
        </tr>
        <tr>
            <td class="label">Тип профиля:</td>
            <td class="input">
                <select id="profile-type-cutting" onchange="updateDimensions('cutting'); updateProfileImage('cutting');" required>
                    <option value="">Выберите тип</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="label">Размерность:</td>
            <td class="input">
                <select id="profile-dimension-cutting" required>
                    <option value="">Выберите размерность</option>
                </select>
            </td>
        </tr>
        <tr>
            <td class="label">Длина (мм):</td>
            <td class="input"><input type="number" id="cutting-length" min="1" required></td>
        </tr>
        <tr>
            <td class="label">Количество:</td>
            <td class="input"><input type="number" id="cutting-quantity" min="1" value="1" required></td>
        </tr>
        <tr>
            <td class="label">Заказ:</td>
            <td class="input"><input type="text" id="cutting-order"></td>
        </tr>
        <tr>
            <td class="label">Название детали:</td>
            <td class="input"><input type="text" id="cutting-part-name"></td>
        </tr>
        <tr>
            <td class="label"></td>
            <td class="input"><button class="btn" onclick="addCutting()">Добавить</button></td>
        </tr>
    </table>
    <h3>Список раскладки</h3>
    <table class="data-table" id="cutting-table">
        <thead>
            <tr>
                <th onclick="sortCuttingTable(0)">Профиль</th>
                <th onclick="sortCuttingTable(1)">Длина (мм)</th>
                <th onclick="sortCuttingTable(2)">Кол-во</th>
                <th onclick="sortCuttingTable(3)">Заказ</th>
                <th onclick="sortCuttingTable(4)">Название детали</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>