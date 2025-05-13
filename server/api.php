<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 0); // Set to 0 in production
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Log errors to a file instead of displaying them
ini_set('log_errors', 1);
ini_set('error_log', dirname(__DIR__) . '/server/php_error.log');

function readJson($file) {
    $path = dirname(__DIR__) . "/data/$file";
    if (!file_exists($path)) {
        error_log("File not found: $path");
        return [];
    }
    if (!is_readable($path)) {
        error_log("File not readable: $path");
        return [];
    }
    $content = file_get_contents($path);
    if ($content === false) {
        error_log("Failed to read file: $path");
        return [];
    }
    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error in $file: " . json_last_error_msg());
        return [];
    }
    return is_array($data) ? $data : [];
}

function writeJson($file, $data) {
    $path = dirname(__DIR__) . "/data/$file";
    if (!file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT))) {
        error_log("Failed to write file: $path");
    }
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'get_profiles':
            $profiles = readJson('profiles.json');
            echo json_encode($profiles, JSON_PRETTY_PRINT);
            break;

        case 'save_profiles':
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data === null) {
                throw new Exception('Invalid JSON input');
            }
            writeJson('profiles.json', $data);
            echo json_encode(['status' => 'ok']);
            break;

        case 'get_stock':
            echo json_encode(readJson('stock.json'));
            break;

        case 'add_stock':
            $data = json_decode(file_get_contents('php://input'), true);
            $stock = readJson('stock.json');
            $stock[] = $data;
            writeJson('stock.json', $stock);
            echo json_encode(['status' => 'ok']);
            break;

        case 'update_stock':
            $data = json_decode(file_get_contents('php://input'), true);
            $stock = readJson('stock.json');
            $stock = array_map(function($item) use ($data) {
                if ($item['id'] === $data['id']) {
                    $item['quantity'] = $data['quantity'];
                }
                return $item;
            }, $stock);
            $stock = array_filter($stock, fn($item) => $item['quantity'] > 0);
            writeJson('stock.json', $stock);
            echo json_encode(['status' => 'ok']);
            break;

        case 'delete_stock':
            $data = json_decode(file_get_contents('php://input'), true);
            $stock = readJson('stock.json');
            $stock = array_filter($stock, fn($item) => $item['id'] !== $data['id']);
            writeJson('stock.json', $stock);
            echo json_encode(['status' => 'ok']);
            break;

        case 'get_remnants':
            echo json_encode(readJson('remnants.json'));
            break;

        case 'add_remnant':
            $data = json_decode(file_get_contents('php://input'), true);
            $remnants = readJson('remnants.json');
            $remnants[] = $data;
            writeJson('remnants.json', $remnants);
            echo json_encode(['status' => 'ok']);
            break;

        case 'get_history':
            echo json_encode(readJson('history.json'));
            break;

        case 'save_cutting':
            $data = json_decode(file_get_contents('php://input'), true);
            $data['id'] = 'cut-' . substr(md5(uniqid()), 0, 9);
            $history = readJson('history.json');
            $history[] = $data;
            writeJson('history.json', $history);
            echo json_encode(['status' => 'ok']);
            break;

        case 'update_history':
            $data = json_decode(file_get_contents('php://input'), true);
            $history = readJson('history.json');
            $history = array_map(function($item) use ($data) {
                if ($item['id'] === $data['id']) {
                    $item['completionDate'] = $data['completionDate'];
                }
                return $item;
            }, $history);
            writeJson('history.json', $history);
            echo json_encode(['status' => 'ok']);
            break;

        case 'delete_history':
            $data = json_decode(file_get_contents('php://input'), true);
            $history = readJson('history.json');
            $history = array_filter($history, fn($item) => $item['id'] !== $data['id']);
            writeJson('history.json', $history);
            echo json_encode(['status' => 'ok']);
            break;

        case 'get_stock_remnants':
            $profile = $_GET['profile'];
            $stock = readJson('stock.json');
            $remnants = readJson('remnants.json');
            echo json_encode([
                'stock' => array_filter($stock, fn($item) => $item['profile'] === $profile),
                'remnants' => array_filter($remnants, fn($item) => $item['profile'] === $profile)
            ]);
            break;

        default:
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    error_log("API error: " . $e->getMessage());
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>