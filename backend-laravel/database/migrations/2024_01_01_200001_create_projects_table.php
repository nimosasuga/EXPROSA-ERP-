<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('project_number')->unique(); // PRJ-001
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('client_name');
            $table->string('client_email')->nullable();
            $table->string('client_phone')->nullable();
            $table->enum('status', ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled', 'delayed', 'review'])->default('planning');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->integer('progress')->default(0); // 0-100
            $table->decimal('budget', 15, 2)->nullable();
            $table->decimal('actual_cost', 15, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->foreignId('project_manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('project_number');
            $table->index('status');
            $table->index('start_date');
        });

        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'delayed', 'review'])->default('pending');
            $table->integer('progress')->default(0); // 0-100
            $table->date('due_date')->nullable();
            $table->date('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('project_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('milestone_id')->nullable()->constrained('project_milestones')->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['todo', 'in_progress', 'review', 'completed', 'blocked'])->default('todo');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->date('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_tasks');
        Schema::dropIfExists('project_milestones');
        Schema::dropIfExists('projects');
    }
};
