# SmartClean — Smart Garbage Management System

This version connects the existing SmartClean UI to MySQL and implements the main citizen, worker and admin flows. Deployment is intentionally excluded.

## Main features
- MySQL connection using `smartclean` database
- Citizen / Worker / Admin registration and login
- Password hashing with automatic upgrade of the sample plain-text passwords from the supplied SQL
- Forgot Password: registered-email reset link → secure one-time token → generated temporary password → database update → new password email
- Citizen complaint submission with optional JPG/PNG upload
- Complaint tracking using IDs such as `CW-0001`
- Admin complaint listing and worker assignment API
- Worker assigned-complaint listing and status updates
- Dynamic dashboard statistics APIs
- Profile data loaded from MySQL
- Change-password API from Profile → Password & Security
- Admin/worker report APIs

## 1. Install MySQL/XAMPP
Start **Apache** and **MySQL** in XAMPP.

## 2. Create the database
Import the supplied `smartclean.sql` into phpMyAdmin. Then import:

```text
smartclean_additions.sql
```

The second file creates the required `password_resets` table.

## 3. Create Python environment
From the project folder:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

If you do not want a virtual environment, you can use `pip install -r requirements.txt`.

## 4. Configure MySQL
Copy:

```text
.env.example -> .env
```

For a default XAMPP installation:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=smartclean
```

If your MySQL root account has a password, put it in `DB_PASSWORD`.

## 5. Configure Gmail for Forgot Password
The application sends the reset link and generated new password through SMTP.

For Gmail, enable 2-Step Verification on the sending Gmail account and create a **Google App Password**. Put the 16-character app password in `.env`:

```env
SMTP_EMAIL=yourgmail@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

Do not put your normal Gmail password in the project.

## 6. Run

```bash
source venv/bin/activate
python3 app.py
```

Open:

```text
http://127.0.0.1:5000
```

## 7. Test Forgot Password
1. Use one of the registered emails in `smartclean.sql`.
2. Open Citizen/Worker/Admin Login.
3. Click **Forgot Password?**.
4. Select the correct role and enter the registered email.
5. Open the reset link received by email.
6. SmartClean generates a new temporary password and updates that user's password in MySQL.
7. The generated password is sent to the registered email.
8. Login with the new password.
9. In Profile → Password & Security, use Change Password to set a permanent password.

## Important worker ID note
The supplied MySQL schema uses an integer `worker_id`. The UI accepts either `1` or `WRK-0001` for worker ID. For example, the first worker in the supplied SQL is `1` / `WRK-0001`.

## Supplied sample accounts
Citizen:
- `rahul@gmail.com` / `Rahul@123`

Worker:
- Worker ID `1` / `WRK-0001`
- `ravi.kumar@smartclean.com` / `Ravi@123`

Admin:
- `admin1@smartclean.com` / `Admin@123`

The first successful login automatically converts an existing sample plain-text password into a secure hash.

## No deployment included
This package is intended for local development/testing. Production deployment, domain, HTTPS, production mail service and server configuration are deliberately left for the deployment phase.


## Deployment
See `DEPLOYMENT.md` for the prepared Railway + MySQL deployment workflow.
