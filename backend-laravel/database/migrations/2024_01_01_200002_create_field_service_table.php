<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('field_service_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // FS-001
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->text('service_address');
            $table->text('service_description');
            $table->enum('service_type', ['installation', 'repair', 'maintenance', 'inspection', 'other'])->default('other');
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->enum('priority', ['low', 'medium', 'high', 'emergency'])->default('medium');
            $table->foreignId('technician_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->text('completion_notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('order_number');
            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('field_service_orders');
    }
};
