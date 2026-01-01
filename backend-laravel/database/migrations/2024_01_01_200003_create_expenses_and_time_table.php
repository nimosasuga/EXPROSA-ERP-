<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('expense_number')->unique(); // EXP-001
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->string('category'); // travel, meals, accommodation, supplies, other
            $table->text('description');
            $table->decimal('amount', 15, 2)->default(0);
            $table->date('expense_date');
            $table->string('receipt_file')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected', 'reimbursed'])->default('draft');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('expense_number');
            $table->index('status');
            $table->index('expense_date');
        });

        Schema::create('timesheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->foreignId('task_id')->nullable()->constrained('project_tasks')->onDelete('set null');
            $table->date('work_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes')->default(0);
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected'])->default('draft');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index('work_date');
            $table->index('status');
        });

        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('schedule_number')->unique(); // MNT-001
            $table->string('equipment_name');
            $table->string('equipment_code')->nullable();
            $table->text('description')->nullable();
            $table->enum('frequency', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])->default('monthly');
            $table->date('next_maintenance_date');
            $table->date('last_maintenance_date')->nullable();
            $table->enum('status', ['active', 'completed', 'overdue', 'cancelled'])->default('active');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index('schedule_number');
            $table->index('next_maintenance_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
        Schema::dropIfExists('timesheets');
        Schema::dropIfExists('expenses');
    }
};
