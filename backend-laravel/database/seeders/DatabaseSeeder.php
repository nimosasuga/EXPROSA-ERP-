<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $roles = [
            ['name' => 'OWNER', 'display_name' => 'Owner', 'description' => 'Full system access'],
            ['name' => 'MANAGER', 'display_name' => 'Manager', 'description' => 'Department management access'],
            ['name' => 'STAFF', 'display_name' => 'Staff', 'description' => 'General staff access'],
            ['name' => 'FINANCE', 'display_name' => 'Finance', 'description' => 'Financial module specialist'],
            ['name' => 'WAREHOUSE', 'display_name' => 'Warehouse', 'description' => 'Material/inventory specialist'],
            ['name' => 'MARKETING', 'display_name' => 'Marketing', 'description' => 'Sales/marketing specialist'],
            ['name' => 'AUDITOR', 'display_name' => 'Auditor', 'description' => 'Read-only access'],
        ];

        foreach ($roles as $roleData) {
            Role::create($roleData);
        }

        // Create Permissions
        $resources = ['sales', 'service', 'material', 'financial', 'executive', 'settings'];
        $actions = ['create', 'read', 'edit', 'delete', 'approve', 'view_sensitive', 'setup_access'];
        $scopes = ['setup', 'operation', 'report', 'any'];

        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                Permission::create([
                    'name' => $action,
                    'display_name' => ucfirst($action),
                    'resource' => $resource,
                    'scope' => 'any',
                    'description' => ucfirst($action) . ' permission for ' . $resource,
                ]);
            }
        }

        // Assign all permissions to OWNER role
        $ownerRole = Role::where('name', 'OWNER')->first();
        $allPermissions = Permission::all();
        $ownerRole->permissions()->attach($allPermissions->pluck('id'));

        // Assign read permissions to AUDITOR role
        $auditorRole = Role::where('name', 'AUDITOR')->first();
        $readPermissions = Permission::where('name', 'read')->get();
        $auditorRole->permissions()->attach($readPermissions->pluck('id'));

        // Assign financial permissions to FINANCE role
        $financeRole = Role::where('name', 'FINANCE')->first();
        $financePermissions = Permission::where('resource', 'financial')->get();
        $financeRole->permissions()->attach($financePermissions->pluck('id'));

        // Assign material permissions to WAREHOUSE role
        $warehouseRole = Role::where('name', 'WAREHOUSE')->first();
        $warehousePermissions = Permission::where('resource', 'material')->get();
        $warehouseRole->permissions()->attach($warehousePermissions->pluck('id'));

        // Assign sales permissions to MARKETING role
        $marketingRole = Role::where('name', 'MARKETING')->first();
        $salesPermissions = Permission::where('resource', 'sales')->get();
        $marketingRole->permissions()->attach($salesPermissions->pluck('id'));

        // Create Demo Users
        $users = [
            [
                'name' => 'System Owner',
                'email' => 'owner@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'Management',
                'employee_id' => 'EMP001',
                'status' => 'active',
                'role' => 'OWNER',
            ],
            [
                'name' => 'Operations Manager',
                'email' => 'manager@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'Operations',
                'employee_id' => 'EMP002',
                'status' => 'active',
                'role' => 'MANAGER',
            ],
            [
                'name' => 'Finance Manager',
                'email' => 'finance@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'Finance',
                'employee_id' => 'EMP003',
                'status' => 'active',
                'role' => 'FINANCE',
            ],
            [
                'name' => 'Warehouse Manager',
                'email' => 'warehouse@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'Warehouse',
                'employee_id' => 'EMP004',
                'status' => 'active',
                'role' => 'WAREHOUSE',
            ],
            [
                'name' => 'Marketing Manager',
                'email' => 'marketing@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'Marketing',
                'employee_id' => 'EMP005',
                'status' => 'active',
                'role' => 'MARKETING',
            ],
            [
                'name' => 'General Staff',
                'email' => 'staff@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'General',
                'employee_id' => 'EMP006',
                'status' => 'active',
                'role' => 'STAFF',
            ],
            [
                'name' => 'System Auditor',
                'email' => 'auditor@nexus.com',
                'password' => Hash::make('password123'),
                'department' => 'Audit',
                'employee_id' => 'EMP007',
                'status' => 'active',
                'role' => 'AUDITOR',
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);

            $user = User::create($userData);
            $role = Role::where('name', $roleName)->first();
            $user->roles()->attach($role->id);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Demo accounts created with password: password123');
    }
}
