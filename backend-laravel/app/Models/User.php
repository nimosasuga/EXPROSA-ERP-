<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'department',
        'phone',
        'employee_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function createdSalesCases()
    {
        return $this->hasMany(SalesCase::class, 'created_by');
    }

    public function assignedSalesCases()
    {
        return $this->hasMany(SalesCase::class, 'assigned_to');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'project_manager_id');
    }

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    // Helper methods
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function hasPermission($permissionName, $resource = null, $scope = null)
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionName, $resource, $scope) {
                $query->where('name', $permissionName);
                if ($resource) {
                    $query->where('resource', $resource);
                }
                if ($scope) {
                    $query->where('scope', $scope);
                }
            })
            ->exists();
    }

    public function canPerform($action, $resource, $scope = null)
    {
        // OWNER has full access
        if ($this->hasRole('OWNER')) {
            return true;
        }

        // AUDITOR has read-only access globally
        if ($this->hasRole('AUDITOR') && $action === 'read') {
            return true;
        }

        // Check specific permissions
        return $this->hasPermission($action, $resource, $scope);
    }
}
