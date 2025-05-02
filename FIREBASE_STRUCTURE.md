schools (collection)
│
├── {schoolId} (document)
│   ├── name: "School Name"
│   ├── code: "School Code"
│   ├── email: "school@example.com"
│   ├── password: "hashed_password" (if storing passwords)
│   ├── teachers (sub-collection)
│   │   ├── {teacherId} (document)
│   │   │   ├── name: "Teacher Name"
│   │   │   ├── email: "teacher@example.com"
│   │   │   ├── password: "hashed_password" (if storing passwords)
│   │   │   ├── subject: "Subject taught"
│   │   │   └── role: "teacher" (or other roles)
│   │   └── ...
│   │
│   └── students (sub-collection)
│       ├── {studentId} (document)
│       │   ├── name: "Student Name"
│       │   ├── username: "student_username"
│       │   ├── password: "hashed_password" (if storing passwords)
│       │   ├── rollNumber: "12345"
│       │   └── class: "Class Name"
│       └── ...
│
└── ...