<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define gates for permissions
        Gate::define('create', function ($user, $resource) {
            return $user->canPerform('create', $resource);
        });

        Gate::define('read', function ($user, $resource) {
            return $user->canPerform('read', $resource);
        });

        Gate::define('edit', function ($user, $resource) {
            return $user->canPerform('edit', $resource);
        });

        Gate::define('delete', function ($user, $resource) {
            return $user->canPerform('delete', $resource);
        });

        Gate::define('approve', function ($user, $resource) {
            return $user->canPerform('approve', $resource);
        });
    }
}
