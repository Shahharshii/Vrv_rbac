# Task Tracker with Role Based Access Control

Welcome to  **Task Tracker** which manage tasks, set priorities, track progress, and collaborate effortlessly. Boost your productivity and achieve your goals with ease! 

### Deployed URLs

- **URL**: 

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Access Ways](#access-ways)

---

## Project Overview

The Role-Based Access Control (RBAC) System for Task Tracking provides an intuitive admin dashboard designed to manage users, roles, and permissions efficiently. This system ensures secure, role-based access, offering flexibility for dynamic permission configurations while enhancing task tracking management.

## Features

1. **Register System**:
   - Secure Register system for authorized users using Username and password.
   - Token based verification and session management 

2. **Login System**:
   - Secure login system for authorized users using Username and password.
   - Token based verification and session management.

3. **User Role**:
   - The authorized Admin, SuperUser and user can access the platform.

4. **Custom API Simulation**
   - Mock API Calls for CRUD Operations:
   - All user and role management functionalities are backed by simulated API calls for:
        1) Creating users and roles.
        2) Fetching lists of users and roles.
        3) Updating and deleting records.

5. **Search Functionality**:
   - A unified search bar allows administrators to quickly locate users, roles, or permissions across the system.

5. **Responsive Design**:
   - Fully responsive design, optimized for both mobile and desktop screens.
   - Flexible layout with side-by-side sections on larger screens and a vertical stack on mobile.

---

## Technologies Used

- **Frontend/Backend**: Next.js, TypeScript, Tailwind CSS
- **Database**: MongoDB
- **Authentication**: token-based authentication
- **Deployment**: vercel

---

## Screenshots

### 1. **Registration Page**
The user can Register using their username and password .
![image](https://github.com/user-attachments/assets/feabcaf6-98fb-4f85-be2d-bf6eef5bfbc4)


### 2. **Login Page**
The user can log in using their Username and password to access the defined portal.
The Login can be performed using 3 roles :- 
1) Admin (TeamLead)
2) SuperUser(Manager)
3) User (Employee)
![image](https://github.com/user-attachments/assets/0aa59446-2354-4e06-af23-a1df12db52e6)


### 3. **User Portal**
In the user portal, the user is able to see the assign task and can mark the task completed when finished. The same task on the adminDashboard will be reflected along with its status i.e pending or completed.

![image](https://github.com/user-attachments/assets/0474347c-9a9d-4101-9ed8-2abeca835bb9)

### 4. **SuperUser Portal**
In the SuperUser portal, the Superuser is able to assign task, edit task, delete task and can mark the task as completed. SuperUser has access to manage the Superuser and User. SuperUser has access to manage the task of the user and other SuperUser.

![image](https://github.com/user-attachments/assets/6f33e5e4-224f-4994-8904-76ad70928b22)
![image](https://github.com/user-attachments/assets/27202f32-9b0f-416f-81ba-bdec643e432b)

### 5. **Admin Portal**
In the Admin portal, the Admin has permission to all the permission such as add_user, edit_user, delete_user, add_task, edit_task, delete_task, edit_permission, complete_task. Admin has access to manage all the Admin along with SuperUser and User.

![image](https://github.com/user-attachments/assets/6c950ceb-378c-4ea6-a811-1b87a0bdce8d)
![image](https://github.com/user-attachments/assets/3d9acca5-cba0-4312-b279-598d8797b3be)

### 6. **Add User**
The role (Admin) having the add_user can add the User from the Admin portal.
![image](https://github.com/user-attachments/assets/023784c9-50a3-4030-8e2d-50a2cc6bf2c9)

### 7. **Edit User**
The role (Admin) having the edit_user can add the User from the Admin portal.
![image](https://github.com/user-attachments/assets/91b52239-bd7d-4df7-80d0-f69f180ea891)



## Access Ways

### Pre-entered Admin Data

To ensure the platform is ready for use after setup, a pre-populate the database with an initial Admin, Superuser and User account. This allows for immediate access to the selected portal after the first-time deployment without manually entering credentials.

- **Admin Credentials:**
  - **Username:** `Admin`,
  - **Password:** `123456`
    
- **SuperUser Credentials:**
  - **Username:** `SuperUser`,
  - **Password:** `123456`

 - **User Credentials:**
  - **Username:** `User`,
  - **Password:** `123456`
    

- **Usage:**
  - After setting up the project, log in with the pre-entered credentials to access the full features of the defined portal, including the role and permission based accces for create_user, delete_user, edit_user, add_task, delete_task, edit_task.
  


