<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('shipment_number')->unique(); // SHP-001
            $table->foreignId('sales_order_id')->nullable()->constrained('sales_orders')->onDelete('set null');
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->onDelete('set null');
            $table->string('carrier')->nullable(); // JNE, TIKI, J&T, etc
            $table->string('tracking_number')->nullable();
            $table->text('shipping_address');
            $table->string('recipient_name');
            $table->string('recipient_phone')->nullable();
            $table->enum('shipment_type', ['outbound', 'inbound'])->default('outbound');
            $table->enum('status', ['pending', 'packed', 'shipped', 'in_transit', 'delivered', 'failed', 'returned'])->default('pending');
            $table->date('ship_date')->nullable();
            $table->date('expected_delivery_date')->nullable();
            $table->date('actual_delivery_date')->nullable();
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('weight', 10, 2)->nullable(); // kg
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('shipment_number');
            $table->index('tracking_number');
            $table->index('status');
        });

        Schema::create('shipment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipment_id')->constrained('shipments')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('receiving_records', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->unique(); // RCV-001
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->onDelete('set null');
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade');
            $table->date('received_date');
            $table->string('received_by');
            $table->enum('status', ['pending', 'partial', 'completed'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('receipt_number');
        });

        Schema::create('receiving_record_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receiving_record_id')->constrained('receiving_records')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->integer('quantity_ordered')->default(0);
            $table->integer('quantity_received')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receiving_record_items');
        Schema::dropIfExists('receiving_records');
        Schema::dropIfExists('shipment_items');
        Schema::dropIfExists('shipments');
    }
};
