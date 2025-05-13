<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управление складом</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="tabs">
            <div class="tab active" data-tab="stock">Склад</div>
            <div class="tab" data-tab="cutting">Раскладка</div>
        </div>
        <div id="tab-content"></div>
    </div>
    <script src="scripts/profiles.js"></script>
    <script src="scripts/stock.js"></script>
    <script src="scripts/cutting.js"></script>
    <script src="scripts/tabs.js"></script>
    <script>
        window.onunhandledrejection = function(event) {
            console.error('Unhandled promise rejection:', event.reason);
        };
    </script>
</body>
</html>