<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number')->unique(); // BILL-901
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->onDelete('set null');
            $table->date('bill_date');
            $table->date('due_date');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->enum('status', ['draft', 'pending', 'approved', 'partial', 'paid', 'overdue', 'cancelled'])->default('draft');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('bill_number');
            $table->index('status');
            $table->index('bill_date');
            $table->index('due_date');
        });

        Schema::create('bill_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained('bills')->onDelete('cascade');
            $table->string('description');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('vendor_payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique(); // VP-001
            $table->foreignId('bill_id')->constrained('bills')->onDelete('cascade');
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->date('payment_date');
            $table->decimal('amount', 15, 2)->default(0);
            $table->enum('payment_method', ['cash', 'bank_transfer', 'check', 'credit_card', 'other'])->default('bank_transfer');
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('payment_number');
            $table->index('payment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_payments');
        Schema::dropIfExists('bill_items');
        Schema::dropIfExists('bills');
    }
};
