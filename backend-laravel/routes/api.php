<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Users & Roles
        Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
        Route::apiResource('roles', \App\Http\Controllers\Api\RoleController::class);
        Route::apiResource('permissions', \App\Http\Controllers\Api\PermissionController::class);

        // Audit Logs
        Route::get('/audit-logs', [\App\Http\Controllers\Api\AuditLogController::class, 'index']);
        Route::get('/audit-logs/{type}/{id}', [\App\Http\Controllers\Api\AuditLogController::class, 'showForRecord']);

        // Sales Module
        Route::prefix('sales')->group(function () {
            Route::apiResource('cases', \App\Http\Controllers\Api\Sales\SalesCaseController::class);
            Route::apiResource('orders', \App\Http\Controllers\Api\Sales\SalesOrderController::class);
            Route::apiResource('leads', \App\Http\Controllers\Api\Sales\SalesLeadController::class);
            Route::apiResource('opportunities', \App\Http\Controllers\Api\Sales\OpportunityController::class);
        });

        // Service Module
        Route::prefix('service')->group(function () {
            Route::apiResource('projects', \App\Http\Controllers\Api\Service\ProjectController::class);
            Route::apiResource('field-service', \App\Http\Controllers\Api\Service\FieldServiceController::class);
            Route::apiResource('expenses', \App\Http\Controllers\Api\Service\ExpenseController::class);
            Route::apiResource('timesheets', \App\Http\Controllers\Api\Service\TimesheetController::class);
            Route::apiResource('maintenance', \App\Http\Controllers\Api\Service\MaintenanceController::class);
        });

        // Material Module
        Route::prefix('material')->group(function () {
            Route::apiResource('inventory', \App\Http\Controllers\Api\Material\InventoryController::class);
            Route::apiResource('warehouses', \App\Http\Controllers\Api\Material\WarehouseController::class);
            Route::apiResource('purchase-orders', \App\Http\Controllers\Api\Material\PurchaseOrderController::class);
            Route::apiResource('vendors', \App\Http\Controllers\Api\Material\VendorController::class);
            Route::apiResource('shipments', \App\Http\Controllers\Api\Material\ShipmentController::class);
            Route::apiResource('receiving', \App\Http\Controllers\Api\Material\ReceivingController::class);
        });

        // Financial Module
        Route::prefix('financial')->group(function () {
            Route::apiResource('invoices', \App\Http\Controllers\Api\Financial\InvoiceController::class);
            Route::apiResource('bills', \App\Http\Controllers\Api\Financial\BillController::class);
            Route::apiResource('payments', \App\Http\Controllers\Api\Financial\PaymentController::class);
            Route::apiResource('customers', \App\Http\Controllers\Api\Financial\CustomerController::class);
            Route::apiResource('assets', \App\Http\Controllers\Api\Financial\AssetController::class);
            Route::apiResource('bank-accounts', \App\Http\Controllers\Api\Financial\BankAccountController::class);
            Route::apiResource('cash-transactions', \App\Http\Controllers\Api\Financial\CashTransactionController::class);
        });

        // Executive Dashboard
        Route::prefix('executive')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\Executive\DashboardController::class, 'index']);
            Route::get('/kpis', [\App\Http\Controllers\Api\Executive\DashboardController::class, 'kpis']);
            Route::get('/financial-chart', [\App\Http\Controllers\Api\Executive\DashboardController::class, 'financialChart']);
            Route::get('/projects-summary', [\App\Http\Controllers\Api\Executive\DashboardController::class, 'projectsSummary']);
            Route::get('/inventory-summary', [\App\Http\Controllers\Api\Executive\DashboardController::class, 'inventorySummary']);
        });

        // Documents & Comments
        Route::apiResource('documents', \App\Http\Controllers\Api\DocumentController::class);
        Route::apiResource('comments', \App\Http\Controllers\Api\CommentController::class);
        Route::apiResource('notifications', \App\Http\Controllers\Api\NotificationController::class);
        Route::post('/notifications/mark-read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    });
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'app' => config('app.name'),
        'version' => '1.0.0',
    ]);
});
