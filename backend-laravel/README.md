# Nexus ERP - Laravel Backend API

Backend API untuk Nexus ERP System menggunakan Laravel 10 dengan Sanctum Authentication.

## 📋 Informasi Sistem

- **Framework**: Laravel 10.x
- **PHP Version**: 8.1+
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum (API Tokens)
- **API Version**: v1

## 🚀 Deployment ke Production (cPanel/Shared Hosting)

### Langkah 1: Upload Files

1. Upload semua file backend ke `/public_html/nexuserp.exprosa.com/`
2. Pastikan struktur folder:
```
/public_html/nexuserp.exprosa.com/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/          <- Document root harus di sini
├── routes/
├── storage/
├── vendor/          <- Akan dibuat setelah composer install
├── .env
├── artisan
├── composer.json
└── composer.lock
```

### Langkah 2: Set Document Root

Di cPanel > Domains > nexuserp.exprosa.com:
- **Document Root**: `/public_html/nexuserp.exprosa.com/public`

### Langkah 3: Install Dependencies via SSH

```bash
cd /public_html/nexuserp.exprosa.com
composer install --no-dev --optimize-autoloader
```

**JIKA TIDAK ADA SSH ACCESS**, gunakan Terminal di cPanel:
1. Buka cPanel > Terminal
2. Jalankan perintah di atas

### Langkah 4: Set Permissions

```bash
chmod -R 755 storage bootstrap/cache
chown -R username:username storage bootstrap/cache
```

Ganti `username` dengan username cPanel Anda.

### Langkah 5: Generate Application Key

```bash
php artisan key:generate
```

### Langkah 6: Run Migrations

```bash
php artisan migrate --force
```

### Langkah 7: Seed Database (Demo Data)

```bash
php artisan db:seed --force
```

### Langkah 8: Optimize for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Langkah 9: Test API

Buka browser: `https://nexuserp.exprosa.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T...",
  "app": "Nexus ERP",
  "version": "1.0.0"
}
```

## 🔑 Demo Accounts

Setelah seeding, gunakan akun berikut untuk testing:

| Email | Password | Role |
|-------|----------|------|
| owner@nexus.com | password123 | OWNER |
| manager@nexus.com | password123 | MANAGER |
| finance@nexus.com | password123 | FINANCE |
| warehouse@nexus.com | password123 | WAREHOUSE |
| marketing@nexus.com | password123 | MARKETING |
| staff@nexus.com | password123 | STAFF |
| auditor@nexus.com | password123 | AUDITOR |

## 📡 API Endpoints

### Authentication

```
POST /api/v1/login
POST /api/v1/register
POST /api/v1/logout (requires auth)
GET  /api/v1/me (requires auth)
```

### Sales Module

```
GET    /api/v1/sales/cases
POST   /api/v1/sales/cases
GET    /api/v1/sales/cases/{id}
PUT    /api/v1/sales/cases/{id}
DELETE /api/v1/sales/cases/{id}

GET    /api/v1/sales/orders
POST   /api/v1/sales/orders
... (same CRUD pattern)

GET    /api/v1/sales/leads
GET    /api/v1/sales/opportunities
```

### Service Module

```
GET /api/v1/service/projects
GET /api/v1/service/field-service
GET /api/v1/service/expenses
GET /api/v1/service/timesheets
GET /api/v1/service/maintenance
```

### Material Module

```
GET /api/v1/material/inventory
GET /api/v1/material/warehouses
GET /api/v1/material/purchase-orders
GET /api/v1/material/vendors
GET /api/v1/material/shipments
GET /api/v1/material/receiving
```

### Financial Module

```
GET /api/v1/financial/invoices
GET /api/v1/financial/bills
GET /api/v1/financial/payments
GET /api/v1/financial/customers
GET /api/v1/financial/assets
GET /api/v1/financial/bank-accounts
GET /api/v1/financial/cash-transactions
```

### Executive Dashboard

```
GET /api/v1/executive/dashboard
GET /api/v1/executive/kpis
GET /api/v1/executive/financial-chart
GET /api/v1/executive/projects-summary
GET /api/v1/executive/inventory-summary
```

## 🔒 Authentication

Semua endpoint yang memerlukan auth harus include Bearer token:

```bash
curl -H "Authorization: Bearer {token}" \
     https://nexuserp.exprosa.com/api/v1/me
```

### Login Example

```bash
curl -X POST https://nexuserp.exprosa.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@nexus.com","password":"password123"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

## 🛡️ RBAC System

### Roles

1. **OWNER** - Full system access
2. **MANAGER** - Department management
3. **FINANCE** - Financial module specialist
4. **WAREHOUSE** - Material/inventory specialist
5. **MARKETING** - Sales/marketing specialist
6. **STAFF** - General staff access
7. **AUDITOR** - Read-only access globally

### Permissions Matrix

| Action | Resource | Description |
|--------|----------|-------------|
| create | sales/service/material/financial | Create new records |
| read | sales/service/material/financial | View records |
| edit | sales/service/material/financial | Update records |
| delete | sales/service/material/financial | Delete records |
| approve | sales/service/material/financial | Approve transactions |
| view_sensitive | financial | View sensitive financial data |
| setup_access | settings | Access system settings |

## 🗄️ Database Schema

### Core Tables

- `users` - User accounts
- `roles` - User roles
- `permissions` - System permissions
- `user_roles` - User-role pivot
- `role_permissions` - Role-permission pivot
- `audit_logs` - Activity tracking

### Sales Tables

- `sales_cases` - Customer support cases
- `sales_orders` - Sales orders
- `sales_order_items` - Order line items
- `sales_leads` - Sales leads
- `sales_opportunities` - Sales opportunities

### Service Tables

- `projects` - Project management
- `project_milestones` - Project milestones
- `project_tasks` - Project tasks
- `field_service_orders` - Field service
- `expenses` - Employee expenses
- `timesheets` - Time tracking
- `maintenance_schedules` - Equipment maintenance

### Material Tables

- `warehouses` - Warehouse locations
- `inventory_items` - Inventory master data
- `inventory_stock` - Stock levels per warehouse
- `inventory_transactions` - Stock movements
- `vendors` - Vendor master data
- `purchase_orders` - Purchase orders
- `purchase_order_items` - PO line items
- `shipments` - Outbound/inbound shipments
- `shipment_items` - Shipment line items
- `receiving_records` - Goods receiving

### Financial Tables

- `customers` - Customer master data
- `invoices` - Customer invoices (AR)
- `invoice_items` - Invoice line items
- `payments` - Customer payments
- `bills` - Vendor bills (AP)
- `bill_items` - Bill line items
- `vendor_payments` - Vendor payments
- `fixed_assets` - Asset register
- `bank_accounts` - Bank accounts
- `cash_transactions` - Cash movements
- `journals` - General journal entries
- `journal_entries` - Journal line items

### Supporting Tables

- `documents` - File attachments
- `comments` - Comments/notes
- `notifications` - User notifications

## 🔧 Troubleshooting

### Error: "SQLSTATE[HY000] [1045] Access denied"

Check database credentials di `.env`:
```env
DB_DATABASE=n1576996_nexus_erp_database
DB_USERNAME=n1576996_nexus_erp_user
DB_PASSWORD=@kanaka150623
```

### Error: "500 Internal Server Error"

1. Check file permissions:
```bash
chmod -R 755 storage bootstrap/cache
```

2. Clear cache:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

3. Check error logs:
```bash
tail -f storage/logs/laravel.log
```

### Error: "Class not found"

Regenerate autoload:
```bash
composer dump-autoload
```

### CORS Issues

Update `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=nexuserp.exprosa.com,localhost:3000
SESSION_DOMAIN=.exprosa.com
```

## 📊 Performance Optimization

### Enable OPCache

Add to `.htaccess` atau `php.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
```

### Database Indexing

Semua migrations sudah include indexes untuk performa optimal.

### Query Optimization

- Gunakan eager loading: `Model::with('relation')`
- Implement pagination: `Model::paginate(20)`
- Use select only needed columns: `Model::select(['id', 'name'])`

## 🔐 Security Checklist

- [x] `.env` file tidak accessible dari web
- [x] `APP_DEBUG=false` di production
- [x] HTTPS enabled (SSL certificate)
- [x] CORS properly configured
- [x] SQL injection prevention (Eloquent ORM)
- [x] XSS protection (built-in Laravel escaping)
- [x] CSRF protection (Sanctum)
- [x] Rate limiting on API routes
- [x] Password hashing (bcrypt)
- [x] Audit logging enabled

## 📞 Support

Untuk bantuan teknis atau bug reports:
- Email: admin@exprosa.com
- Documentation: https://nexuserp.exprosa.com/docs

## 📝 License

Proprietary - EXPROSA © 2026
