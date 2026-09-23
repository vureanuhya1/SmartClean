-- SmartClean deployment schema. Run after provisioning the online MySQL database.
CREATE TABLE IF NOT EXISTS citizens (
    citizen_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    ward_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    ward_number INT NOT NULL,
    street_number VARCHAR(50),
    description TEXT,
    photo_path VARCHAR(255),
    complaint_date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(30) DEFAULT 'Pending',

    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id)
);
CREATE TABLE IF NOT EXISTS garbage_collections (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    collector_name VARCHAR(100),
    collection_date DATE,
    collection_status VARCHAR(30) DEFAULT 'Pending',
    remarks TEXT,

    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id)
);
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS issue_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS workers (
    worker_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    status VARCHAR(30) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS complaint_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    worker_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignment_status VARCHAR(30) DEFAULT 'Assigned',

    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id),
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id)
);
CREATE TABLE IF NOT EXISTS complaint_updates (
    update_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    updated_by INT,
    old_status VARCHAR(30),
    new_status VARCHAR(30),
    update_description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id),
    FOREIGN KEY (updated_by) REFERENCES admins(admin_id)
);
show tables;
INSERT IGNORE INTO issue_categories (category_name, description)
VALUES
('Overflowing Bins', 'Bins that are full or overflowing with waste'),
('Uncollected Waste', 'Waste that has not been collected on time'),
('Damaged Bin', 'Bins that are broken or damaged'),
('Illegal Dumping', 'Waste dumped in unauthorized locations'),
('Others', 'Other garbage-related issues not covered above');
INSERT IGNORE INTO citizens
(name, phone, email, password, address, ward_number)
VALUES
('Rahul Kumar', '9876543210', 'rahul@gmail.com', 'pbkdf2:sha256:600000$0ddf2fa0348ed7ad11dc17e62fe93840$5655c9cf495b459b72754187c2ada4f1f961a4f800a79852a3f5d72ceda95c61', 'MG Road', 1),
('Priya Sharma', '9876543211', 'priya@gmail.com', 'pbkdf2:sha256:600000$f262bb0b59293c068bdeed0d3daa8cec$5b10e7bdcecf37ea11b4d2898ae39662f1767138d1db516e16fef75f2251e5be', 'Gandhi Nagar', 2),
('Arun Kumar', '9876543212', 'arun@gmail.com', 'pbkdf2:sha256:600000$71063e582a5427d9116fbf48b3d712f3$487fb0bc0bf6184f51dea104d740c16cf7f49abea29a4ab88349193ec464782e', 'Station Road', 3),
('Sneha Reddy', '9876543213', 'sneha@gmail.com', 'pbkdf2:sha256:600000$4da13ad628211946faa2a20ed09f2773$ebf05cefde4d8cd78305832958cf094af2e5b40190805e9de3ebf38d0b4b845f', 'Lake View Road', 4),
('Kiran Rao', '9876543214', 'kiran@gmail.com', 'pbkdf2:sha256:600000$a08ada47cd0538398e4331e18d641fcd$9266723a3c9fb0dd935aeb6b19f8b8a5a362c45420570abafaa7d8eb32c6d41f', 'Market Street', 5),
('Aditya Verma', '9876543215', 'aditya@gmail.com', 'pbkdf2:sha256:600000$a21dab49bc5b7be9e9fff551bc34b053$0e61bc06ca66d26c9c32cff80cd868057310b1351cf392ce2a86049684c917bd', 'Temple Road', 1),
('Anjali Singh', '9876543216', 'anjali@gmail.com', 'pbkdf2:sha256:600000$c262d7cf2c82f2093a6ce8f70a27cd54$e790c2c5cbd1a98ed571880666301df2a754d7fc05ec6c4454c166c757aeb5ce', 'Green Park', 2),
('Rohit Patel', '9876543217', 'rohit@gmail.com', 'pbkdf2:sha256:600000$6e76b1f56771f9aa035e7e3076e64c1d$e4bee2a73b93243dbc05a9a9f3527d159c11afc8a2984a3e038a49007772eda2', 'Main Road', 3),
('Neha Gupta', '9876543218', 'neha@gmail.com', 'pbkdf2:sha256:600000$58fc98179b28a4766304d3e1a7b32087$04ed5d0549a0a2c71f92f79adfe8c53ae33852ad93973f2ee1735ba21c0fa64c', 'Ashok Nagar', 4),
('Vikram Das', '9876543219', 'vikram@gmail.com', 'pbkdf2:sha256:600000$3c699f9d2680c4896eba5ae78b148528$c815790afb8ef139e41cbce46520b4f2dff15ce35a01ab7a68ce281ce142939a', 'Church Street', 5),
('Pooja Nair', '9876543220', 'pooja@gmail.com', 'pbkdf2:sha256:600000$f7544035504c3955a80ff24efd838f0d$34eb7ac23a9b988096ceaaf535002aa27bef57f6694a3df5e81a6feb757e84fd', 'Nehru Road', 1),
('Akash Mehta', '9876543221', 'akash@gmail.com', 'pbkdf2:sha256:600000$1d7c67839f7df4499056e106babb62a2$138940b7c10b15b01a1614de42f5d79165e64e25def48da37dbcd235ffbdfe63', 'College Road', 2),
('Kavya Iyer', '9876543222', 'kavya@gmail.com', 'pbkdf2:sha256:600000$aa2af27f5940aa185607dfb1d41c6a75$244cd42264bf03484601be27b9637a232430e8a1aef3c576ce4dc8acaf0d96c7', 'Park Street', 3),
('Suresh Yadav', '9876543223', 'suresh@gmail.com', 'pbkdf2:sha256:600000$171aada3522e0b70d8ee859b1808820f$90baa039d5a642bf394f27ca531d10118cb313669525c0a4ec9b91f1c5f98f91', 'Ring Road', 4),
('Divya Menon', '9876543224', 'divya@gmail.com', 'pbkdf2:sha256:600000$33a0e6b920b281cf3ad96ccdea14ba1e$c6ddfcc4a55ac0d3f7ba83ad0ec5f2306723fca9235287f1b14898b58c818601', 'Garden Road', 5);
INSERT IGNORE INTO workers
(name, phone, email, address, password, status)
VALUES
('Ravi Kumar', '9000000001', 'ravi.kumar@smartclean.com', 'Ward 1, Main Road', 'pbkdf2:sha256:600000$cdc3d165d7634ce900a8b032515d70de$0d7f52d2c3219e5508083c428c3473ceaf4401005235fad5aebc31d5bb76ec44', 'Available'),
('Suresh Reddy', '9000000002', 'suresh.reddy@smartclean.com', 'Ward 2, Market Road', 'pbkdf2:sha256:600000$171aada3522e0b70d8ee859b1808820f$90baa039d5a642bf394f27ca531d10118cb313669525c0a4ec9b91f1c5f98f91', 'Available'),
('Anil Kumar', '9000000003', 'anil.kumar@smartclean.com', 'Ward 3, Station Road', 'pbkdf2:sha256:600000$7a1e0d8d03f3514f037bc2f7de6b9c1a$7e4afd14314fdde6e066d46ae64c211d058dd334622079433976962e37dd0e84', 'Available'),
('Prakash Rao', '9000000004', 'prakash.rao@smartclean.com', 'Ward 4, Temple Road', 'pbkdf2:sha256:600000$fe42d6f8451c787f7e94a158d63a7fa2$2d6c4c08841212ad3b784dec013d0700e86c978aadd808d41f2b3187f995b673', 'Available'),
('Mahesh Babu', '9000000005', 'mahesh.babu@smartclean.com', 'Ward 5, Lake Road', 'pbkdf2:sha256:600000$b732828910afd4fb2d6592d7153dd19c$7621160d97628ca4b304e0ba727eb5702bb8fa17116f597d34793efccbe43527', 'Available'),
('Vijay Kumar', '9000000006', 'vijay.kumar@smartclean.com', 'Ward 6, School Road', 'pbkdf2:sha256:600000$e25028e8cf6c0c43a701365b28d00b9c$c562a8f0bde222c64e90b73106b3467c2ec1c21638c521700d5ac61b9a61323e', 'Available'),
('Rajesh Naidu', '9000000007', 'rajesh.naidu@smartclean.com', 'Ward 7, Bus Stand Road', 'pbkdf2:sha256:600000$8144e6145bb635dc700d51f2ed65e731$20b6980f16ff2192f55ac8bf53f4b3587fe2f40635cb26e082a34d65a1583cf2', 'Available'),
('Naveen Reddy', '9000000008', 'naveen.reddy@smartclean.com', 'Ward 8, Park Road', 'pbkdf2:sha256:600000$4db4e162150e4aecdc9afe673ca838d7$3d8feb5695b3747a84ec93517100d054c14ce224ee6b579a5e610f9fe820c2d9', 'Available'),
('Kiran Kumar', '9000000009', 'kiran.kumar@smartclean.com', 'Ward 9, Church Road', 'pbkdf2:sha256:600000$a08ada47cd0538398e4331e18d641fcd$9266723a3c9fb0dd935aeb6b19f8b8a5a362c45420570abafaa7d8eb32c6d41f', 'Available'),
('Srikanth Rao', '9000000010', 'srikanth.rao@smartclean.com', 'Ward 10, Railway Road', 'pbkdf2:sha256:600000$3e78d0b6ba1694b15b9350caeae1bad1$c81c350ae52ec043f72eacefd5c8ea347d4e6af187040c76fc64bdb3ecfc065e', 'Available'),
('Arjun Reddy', '9000000011', 'arjun.reddy@smartclean.com', 'Ward 11, College Road', 'pbkdf2:sha256:600000$152867aaa0f2b4905013ea709ecc3e1b$be0f7e6bb2344ce02ed17284d0acbcf7259c26400c49ad8441d6a8eaa0bcdc40', 'Available'),
('Manoj Kumar', '9000000012', 'manoj.kumar@smartclean.com', 'Ward 12, Garden Road', 'pbkdf2:sha256:600000$ca0fdbc6b685a67e792336aff7c20052$003c8b864a9001ee80830fb5e8d63515225d78902074c1c0d778c34ba2c0fbc2', 'Available'),
('Harish Babu', '9000000013', 'harish.babu@smartclean.com', 'Ward 13, Ring Road', 'pbkdf2:sha256:600000$28e1c32fea03a0ca28a8dc7973ed1c21$9ff4adf5cf6f225d56b4890b488b174d95024515c04b74c4dfa86cf8c79d490d', 'Available'),
('Ramesh Naidu', '9000000014', 'ramesh.naidu@smartclean.com', 'Ward 14, Hospital Road', 'pbkdf2:sha256:600000$00dadeaa4c8f8ae669422682cad742e8$03da11ffe75602001ebddc4bd34ddc937cceb2a014d8214cf74daa47f796c98c', 'Available'),
('Chandra Sekhar', '9000000015', 'chandra.sekhar@smartclean.com', 'Ward 15, Community Road', 'pbkdf2:sha256:600000$08d0306575720b1aaa622736f6becddf$0697883895000c209bdf97d05feb9825eb4cb5188f540f9b9679f19948392065', 'Available');
INSERT IGNORE INTO complaints
(citizen_id, issue_type, ward_number, street_number, description, photo_path, status)
VALUES
(1, 'Overflowing Bins', 1, 'MG Road',
 'The dustbin is completely full and garbage is overflowing onto the road.', NULL, 'Pending'),

(2, 'Damaged Bin', 2, 'Gandhi Nagar',
 'The public dustbin is broken and cannot be used properly.', NULL, 'Pending'),

(3, 'Uncollected Waste', 3, 'Station Road',
 'Garbage has not been collected from this street for several days.', NULL, 'Pending'),

(4, 'Illegal Dumping', 4, 'Lake View Road',
 'Waste is being dumped illegally near the roadside.', NULL, 'Pending'),

(5, 'Others', 5, 'Market Street',
 'Garbage-related issue reported in the local area.', NULL, 'Pending'),

(6, 'Overflowing Bins', 1, 'Temple Road',
 'The dustbin is overflowing and waste is scattered around it.', NULL, 'Pending'),

(7, 'Damaged Bin', 2, 'Green Park',
 'The garbage bin is damaged and needs to be replaced.', NULL, 'Pending'),

(8, 'Uncollected Waste', 3, 'Ashok Nagar',
 'Collected waste has not been removed from the street on time.', NULL, 'Pending'),

(9, 'Illegal Dumping', 4, 'Church Street',
 'Garbage has been dumped at an unauthorized location.', NULL, 'Pending'),

(10, 'Others', 5, 'College Road',
 'Other garbage-related problem reported by the citizen.', NULL, 'Pending'),

(11, 'Overflowing Bins', 1, 'Ring Road',
 'The dustbin is full and garbage is spilling onto the road.', NULL, 'Pending'),

(12, 'Damaged Bin', 2, 'Park Street',
 'The public bin is broken and requires repair or replacement.', NULL, 'Pending'),

(13, 'Uncollected Waste', 3, 'Hospital Road',
 'Garbage has not been collected according to the schedule.', NULL, 'Pending'),

(14, 'Illegal Dumping', 4, 'Railway Road',
 'Waste has been illegally dumped beside the road.', NULL, 'Pending'),

(15, 'Others', 5, 'Indira Nagar',
 'A different garbage-related issue has been reported.', NULL, 'Assigned');

INSERT IGNORE INTO complaint_assignments
(complaint_id, worker_id, assignment_status)
VALUES
(1, 1, 'Assigned'),
(2, 2, 'Assigned'),
(3, 3, 'Assigned'),
(4, 4, 'Assigned'),
(5, 5, 'Assigned'),
(6, 6, 'Assigned'),
(7, 7, 'Assigned'),
(8, 8, 'Assigned'),
(9, 9, 'Assigned'),
(10, 10, 'Assigned'),
(11, 11, 'Assigned'),
(12, 12, 'Assigned'),
(13, 13, 'Assigned'),
(14, 14, 'Assigned'),
(15, 15, 'Assigned');

INSERT IGNORE INTO admins
(name, email, password, phone)
VALUES
('Admin One', 'admin1@smartclean.com', 'pbkdf2:sha256:600000$ec7c4ebd127a93fa80e2f7d58c62e715$b4dce1b9823b946cd81ce6638e1bfb80735613108131f396c1551235c8b10970', '9876510001'),
('Admin Two', 'admin2@smartclean.com', 'pbkdf2:sha256:600000$0fbc50a9be04181ab621d287fe377d71$36f4ad4ff6ecaaf4abafca1114aff9d5cb774a3bc1199070af009f40cb05c163', '9876510002');

INSERT IGNORE INTO complaint_updates
(complaint_id, updated_by, old_status, new_status, update_description)
VALUES
(1, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(2, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(3, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(4, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(5, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(6, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(7, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(8, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(9, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(10, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(11, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(12, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(13, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(14, 2, 'Pending', 'Assigned', 'Complaint assigned to the field worker.'),
(15, 1, 'Pending', 'Assigned', 'Complaint assigned to the field worker.');
