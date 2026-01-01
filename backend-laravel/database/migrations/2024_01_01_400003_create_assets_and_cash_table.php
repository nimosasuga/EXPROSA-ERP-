<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fixed_assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_number')->unique(); // AST-001
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('category', ['building', 'vehicle', 'equipment', 'furniture', 'computer', 'other'])->default('other');
            $table->date('purchase_date');
            $table->decimal('purchase_cost', 15, 2)->default(0);
            $table->decimal('current_value', 15, 2)->default(0);
            $table->decimal('accumulated_depreciation', 15, 2)->default(0);
            $table->integer('useful_life_years')->default(5);
            $table->enum('depreciation_method', ['straight_line', 'declining_balance', 'units_of_production'])->default('straight_line');
            $table->decimal('salvage_value', 15, 2)->default(0);
            $table->enum('status', ['active', 'disposed', 'under_maintenance', 'retired'])->default('active');
            $table->string('location')->nullable();
            $table->string('serial_number')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('asset_number');
            $table->index('status');
        });

        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_number')->unique();
            $table->string('account_name');
            $table->string('bank_name');
            $table->string('branch')->nullable();
            $table->enum('account_type', ['checking', 'savings', 'credit_card', 'other'])->default('checking');
            $table->string('currency', 3)->default('IDR');
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'closed'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique(); // CT-001
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->onDelete('cascade');
            $table->enum('type', ['deposit', 'withdrawal', 'transfer'])->default('deposit');
            $table->decimal('amount', 15, 2)->default(0);
            $table->date('transaction_date');
            $table->string('category')->nullable(); // income, expense, transfer
            $table->string('reference_type')->nullable(); // Invoice, Bill, Payment, etc
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description')->nullable();
            $table->decimal('balance_after', 15, 2)->default(0);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('transaction_number');
            $table->index('transaction_date');
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->string('journal_number')->unique(); // JNL-001
            $table->date('journal_date');
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description');
            $table->enum('status', ['draft', 'posted', 'reversed'])->default('draft');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('journal_number');
            $table->index('journal_date');
        });

        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->onDelete('cascade');
            $table->string('account_code');
            $table->string('account_name');
            $table->enum('type', ['debit', 'credit']);
            $table->decimal('amount', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
        Schema::dropIfExists('journals');
        Schema::dropIfExists('cash_transactions');
        Schema::dropIfExists('bank_accounts');
        Schema::dropIfExists('fixed_assets');
    }
};
