<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_type'); // Model name: Invoice, SalesOrder, Project, etc
            $table->unsignedBigInteger('document_id');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type')->nullable(); // pdf, doc, xls, jpg, png, etc
            $table->integer('file_size')->nullable(); // bytes
            $table->text('description')->nullable();
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['document_type', 'document_id']);
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('commentable_type'); // Model name
            $table->unsignedBigInteger('commentable_id');
            $table->text('comment');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade'); // for replies
            $table->timestamps();
            $table->softDeletes();

            $table->index(['commentable_type', 'commentable_id']);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type'); // approval_request, task_assigned, payment_received, etc
            $table->string('title');
            $table->text('message');
            $table->string('link')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('documents');
    }
};
