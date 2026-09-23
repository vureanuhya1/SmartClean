# SmartClean — Deployment Guide (Railway + MySQL)

This package is prepared from the existing SmartClean Flask project. It keeps the existing MySQL-based application and adds production deployment support.

## Recommended architecture

- GitHub: source code shared by the team
- Railway: Flask web service + MySQL service
- Gmail SMTP: forgot-password emails
- Railway Volume: persistent complaint-image uploads (optional but recommended)

Railway currently provides a MySQL service and exposes `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, and `MYSQL_URL` to services in the same project.

## 1. Create the GitHub repository

Upload this folder to a **new private GitHub repository**. Do NOT upload `.env`. The included `.gitignore` excludes it.

## 2. Create the Railway project

Create a Railway project and add:

1. A **MySQL** database service.
2. A service from this GitHub repository.

Railway detects Flask/Python automatically. The repository also includes a `Procfile` with the production command.

## 3. Initialize the database

After the MySQL service is running, run the included initializer once from a local terminal where the Railway MySQL variables are available, or use Railway's shell/command facility:

```bash
python scripts/init_db.py
```

The initializer uses the Railway `MYSQL*` variables automatically. If using the Railway CLI locally, link the project/service first so its variables can be available to the shell.

Do **not** run the original `smartclean.sql` on the production database: it contains `DROP DATABASE IF EXISTS smartclean`, which is intentionally destructive. Use `deployment_schema.sql` instead.

## 4. Configure application variables

The Railway MySQL service supplies the database variables automatically when the services are in the same project. Add these application variables manually:

```text
SECRET_KEY=<long-random-secret>
FLASK_DEBUG=false
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=Lax
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=<your Gmail address>
SMTP_PASSWORD=<your Gmail App Password>
MAIL_FROM_NAME=SmartClean
RESET_EXPIRY_MINUTES=30
```

You do not need to hard-code the database password in the repository.

## 5. Generate a public URL

In Railway, open the SmartClean web service and generate a public domain. That is the link you can send to your madam and teammates.

Test:

```text
https://YOUR-RAILWAY-DOMAIN/health
```

It should return a small JSON response showing `status: ok`.

## 6. Forgot password

The existing SmartClean forgot-password flow is retained. Because reset links use Flask's external URL generation, the deployed public host is used in the reset link. Test this from a phone before the lab.

Use a real registered email address and verify that the reset email arrives.

## 7. Complaint image uploads

The application currently writes uploaded complaint photos under `static/uploads`. Managed containers can have ephemeral local storage. For persistent photos, add a Railway Volume mounted at:

```text
/app/static/uploads
```

If persistent images are not needed for the lab demo, the app will still run without a volume, but uploaded files should not be treated as permanent.

## 8. Team workflow

Everyone should work from the same GitHub repository. The deployed application and database are shared; therefore a complaint created by one teammate is stored in the same online database and can be viewed by the other roles.

For code changes:

```text
Teammate -> GitHub -> Railway redeploy -> same SmartClean URL
```

For application data:

```text
Phone/Laptop -> SmartClean -> Railway Flask -> Railway MySQL
```

## 9. Security before the lab

- Rotate any Gmail App Password that was previously placed in a shared ZIP or chat.
- Generate a new `SECRET_KEY`.
- Keep the GitHub repository private unless you intentionally want the source public.
- Never commit `.env`.
- Change demo passwords if real people will use those accounts.

## 10. Local development remains possible

For local XAMPP/MySQL development, copy `.env.example` to `.env` and fill in the local `DB_*` values. The application supports both local `DB_*` variables and Railway `MYSQL*` variables.
