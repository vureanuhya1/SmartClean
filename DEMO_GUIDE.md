# SmartClean – Demo / Presentation Guide

## What is connected

This build connects the Citizen, Worker and Admin modules to the same MySQL/MariaDB database.

### Citizen workflow
1. Register a citizen.
2. Login with the registered email/password.
3. Open Citizen Dashboard.
4. Report a garbage issue.
5. SmartClean generates a complaint ID such as `CW-0016`.
6. The complaint is stored against that citizen.
7. Citizen Profile shows all complaint IDs belonging to that citizen.
8. Track the complaint using its complaint ID.
9. Logout.

### Admin workflow
1. Login as Admin.
2. Dashboard statistics are loaded from the database.
3. Open Complaints.
4. Search/filter complaints.
5. Select a worker and click **Assign**.
6. Complaint status changes to **Assigned** and the assignment is stored.
7. Open Workers to view workers from the database.
8. Open Reports to see database-driven complaint/category information.
9. Download Report downloads a CSV from the backend.
10. Profile changes are saved to the database.

### Worker workflow
1. Login using the Worker ID shown during registration, e.g. `WRK-0020`.
2. Worker Dashboard loads worker-specific assignment statistics.
3. Worker Complaints shows only complaints assigned to that worker.
4. Workflow is strictly:
   `Assigned → In Progress → Resolved`
5. Each status change is stored in both `complaints` and `complaint_assignments`.
6. Each status change is recorded in `complaint_updates`.
7. Worker Reports shows worker-specific assigned/resolved/active/category/history data.
8. Worker Profile changes are saved to the database.
9. Logout.

### Password reset
Forgot Password creates a time-limited reset token in `password_resets` and sends the reset link using the SMTP settings in `.env`.

## Database setup for a fresh demo

Start XAMPP MariaDB, then import:

```bash
sudo /opt/lampp/bin/mysql -u root < smartclean.sql
sudo /opt/lampp/bin/mysql -u root < smartclean_additions.sql
```

Create/grant the application DB user if needed:

```sql
CREATE USER IF NOT EXISTS 'smartclean_user'@'localhost'
IDENTIFIED BY 'SmartClean@123';

CREATE USER IF NOT EXISTS 'smartclean_user'@'127.0.0.1'
IDENTIFIED BY 'SmartClean@123';

GRANT ALL PRIVILEGES ON smartclean.* TO 'smartclean_user'@'localhost';
GRANT ALL PRIVILEGES ON smartclean.* TO 'smartclean_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

## Run

From the `Smart-Garbage-Management-System` directory:

```bash
python3 app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Sample accounts

### Admin
- `admin1@smartclean.com` / `Admin@123`
- `admin2@smartclean.com` / `Admin@456`

### Citizen
The SQL file contains sample citizens. Query them with:

```sql
SELECT citizen_id, name, email FROM citizens;
```

### Worker
The SQL file contains sample workers. Query their IDs with:

```sql
SELECT worker_id, name, email FROM workers ORDER BY worker_id;
```

Worker IDs are displayed in the application as `WRK-0001`, `WRK-0002`, etc.

## Important demo sequence

For a clean end-to-end demonstration, create a **new citizen complaint**, then:

**Citizen → Report Issue → get CW-xxxx → Admin → Complaints → Assign Worker → Worker → Complaints → In Progress → Resolved → Worker Reports → Citizen Track/Profile**

This demonstrates the complete database workflow in one presentation.
