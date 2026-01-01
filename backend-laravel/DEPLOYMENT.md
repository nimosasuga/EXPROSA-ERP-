# 🚀 Panduan Deployment Nexus ERP Backend

## Deployment ke: /public_html/nexuserp.exprosa.com

### ✅ CHECKLIST DEPLOYMENT

#### 1️⃣ Pre-Deployment (Di Local/Development)

- [ ] Pastikan semua file sudah ter-commit
- [ ] Test migrations locally: `php artisan migrate:fresh --seed`
- [ ] Test API endpoints locally
- [ ] Update `.env` dengan credentials production

#### 2️⃣ Upload Files

**Via FTP/SFTP:**
```
Upload seluruh folder backend-laravel/ ke:
/public_html/nexuserp.exprosa.com/
```

**Via Git (jika server support):**
```bash
cd /public_html/nexuserp.exprosa.com
git clone <repository-url> .
```

#### 3️⃣ Set Document Root di cPanel

1. Login ke cPanel
2. Buka **Domains**
3. Klik **Manage** pada nexuserp.exprosa.com
4. Set **Document Root** ke: `/public_html/nexuserp.exprosa.com/public`
5. Save

#### 4️⃣ Install Composer Dependencies

**Via SSH:**
```bash
cd /public_html/nexuserp.exprosa.com
composer install --no-dev --optimize-autoloader
```

**Tanpa SSH (Upload vendor manual):**
1. Jalankan `composer install` di local
2. Zip folder `vendor/`
3. Upload dan extract di server

#### 5️⃣ Set File Permissions

```bash
cd /public_html/nexuserp.exprosa.com
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R $USER:$USER storage bootstrap/cache
```

Replace `$USER` dengan username cPanel Anda.

#### 6️⃣ Configure .env

Edit file `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://nexuserp.exprosa.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=n1576996_nexus_erp_database
DB_USERNAME=n1576996_nexus_erp_user
DB_PASSWORD=@kanaka150623
```

**Generate APP_KEY:**
```bash
php artisan key:generate
```

#### 7️⃣ Run Migrations

```bash
php artisan migrate --force
```

Expected output:
```
Migration table created successfully.
Migrating: 2024_01_01_000001_create_users_table
Migrated:  2024_01_01_000001_create_users_table (123.45ms)
...
```

#### 8️⃣ Seed Database

```bash
php artisan db:seed --force
```

Expected output:
```
Database seeded successfully!
Demo accounts created with password: password123
```

#### 9️⃣ Optimize for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

#### 🔟 Test Deployment

**1. Health Check:**
```bash
curl https://nexuserp.exprosa.com/api/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T...",
  "app": "Nexus ERP",
  "version": "1.0.0"
}
```

**2. Login Test:**
```bash
curl -X POST https://nexuserp.exprosa.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@nexus.com","password":"password123"}'
```

Expected:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "1|abc123..."
  }
}
```

---

## 🔧 Troubleshooting

### Problem: "500 Internal Server Error"

**Solution:**
```bash
# Clear all cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Check logs
tail -f storage/logs/laravel.log
```

### Problem: "Access Denied for Database"

**Solution:**
1. Verify database credentials di `.env`
2. Test connection:
```bash
php artisan tinker
>>> DB::connection()->getPdo();
```

### Problem: "Class not found"

**Solution:**
```bash
composer dump-autoload
php artisan optimize:clear
```

### Problem: CORS Errors from Frontend

**Solution:**
Update `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=nexuserp.exprosa.com,localhost:3000
SESSION_DOMAIN=.exprosa.com
```

Then clear config:
```bash
php artisan config:clear
```

### Problem: "Storage link not found"

**Solution:**
```bash
php artisan storage:link
```

---

## 📊 Post-Deployment Tasks

### 1. Setup SSL Certificate

Di cPanel:
1. Buka **SSL/TLS Status**
2. Run AutoSSL untuk nexuserp.exprosa.com
3. Verify: https://nexuserp.exprosa.com

### 2. Setup Cron Jobs

Di cPanel > Cron Jobs, tambahkan:
```
* * * * * cd /public_html/nexuserp.exprosa.com && php artisan schedule:run >> /dev/null 2>&1
```

### 3. Setup Error Monitoring

Install Laravel Telescope (optional):
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### 4. Setup Backup

Backup otomatis database setiap hari:
```bash
0 2 * * * /usr/bin/mysqldump -u n1576996_nexus_erp_user -p@kanaka150623 n1576996_nexus_erp_database > /path/to/backup/db_$(date +\%Y\%m\%d).sql
```

---

## 🔐 Security Checklist

- [x] `.env` tidak accessible dari browser
- [x] `APP_DEBUG=false` di production
- [x] SSL certificate active (HTTPS)
- [x] CORS properly configured
- [x] File permissions correct (755/644)
- [x] Database password strong
- [x] API rate limiting enabled
- [x] Audit logging active

---

## 📞 Quick Commands Reference

```bash
# Clear everything
php artisan optimize:clear

# Cache everything
php artisan optimize

# View routes
php artisan route:list

# Test database connection
php artisan tinker
>>> DB::select('SELECT 1');

# Create new migration
php artisan make:migration create_example_table

# Create new model
php artisan make:model Example -m

# Create new controller
php artisan make:controller ExampleController --api

# Run specific seeder
php artisan db:seed --class=DatabaseSeeder

# Rollback migrations
php artisan migrate:rollback

# Fresh install (WARNING: drops all tables)
php artisan migrate:fresh --seed
```

---

## 📈 Performance Tips

1. **Enable OPcache** (contact hosting support)
2. **Use Redis** untuk session dan cache (if available)
3. **Database indexing** - sudah included di migrations
4. **Query optimization** - gunakan eager loading
5. **CDN** untuk static assets

---

## 🎯 Next Steps

1. Connect React frontend ke API
2. Update frontend `.env` dengan API URL:
   ```
   VITE_API_URL=https://nexuserp.exprosa.com/api/v1
   ```
3. Test all modules end-to-end
4. Train users dengan demo accounts
5. Create real user accounts
6. Delete demo data setelah training

---

## ✅ Deployment Complete!

Jika semua langkah berhasil, backend Nexus ERP sudah running di:
**https://nexuserp.exprosa.com**

Test dengan browser atau Postman untuk memastikan semua endpoints berfungsi.

---

**Need Help?** Contact: admin@exprosa.com
