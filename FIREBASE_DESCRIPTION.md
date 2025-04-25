# Firebase Database Structure Description

## Overview

The Firebase database structure for the school portal application is designed to manage schools, teachers, and students effectively. It utilizes Firestore, a NoSQL database, to organize data into collections and documents.

## Structure

### 1. Schools Collection

- **`schools` (collection)**: The main collection that holds documents for each school.
  - **`{schoolId}` (document)**: Each document represents a unique school.
    - **Fields**:
      - `name`: The name of the school.
      - `code`: A unique code for the school.
      - `email`: The email address associated with the school.
      - `password`: (Optional) A hashed password for the school account.
    - **Sub-Collections**:
      - **`teachers` (sub-collection)**: Contains documents for each teacher associated with the school.
      - **`students` (sub-collection)**: Contains documents for each student associated with the school.

### 2. Teachers Sub-Collection

- **`teachers` (sub-collection)**: Groups all teachers under their respective school.
  - **`{teacherId}` (document)**: Each document represents a unique teacher.
    - **Fields**:
      - `name`: The name of the teacher.
      - `email`: The email address of the teacher.
      - `password`: (Optional) A hashed password for the teacher account.
      - `subject`: The subject taught by the teacher.
      - `role`: The role of the user (e.g., "teacher").

### 3. Students Sub-Collection

- **`students` (sub-collection)**: Groups all students under their respective school.
  - **`{studentId}` (document)**: Each document represents a unique student.
    - **Fields**:
      - `name`: The name of the student.
      - `username`: A unique username for the student.
      - `password`: (Optional) A hashed password for the student account.
      - `rollNumber`: A unique roll number assigned to the student.
      - `class`: The class or grade that the student is in.

## Key Considerations

- **Security**: Use Firebase Authentication for managing user accounts instead of storing passwords directly in Firestore.
- **Scalability**: The structure is scalable, allowing for the addition of more fields or sub-collections as the application grows.
- **Role Management**: Implement role-based access control to manage permissions for different users (teachers vs. students).
