# Task Tracker with Role Based Access Control

Welcome to  **Task Tracker** which manage tasks, set priorities, track progress, and collaborate effortlessly. Boost your productivity and achieve your goals with ease! 

### Deployed URLs

- **URL**: [https://sustainanility-dashboard.onrender.com](https://sustainanility-dashboard.onrender.com)

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
   - Secure Register system for authorized users using username and password.
 

1. **Login System**:
   - Secure login system for authorized users using email and password.
   - Session-based authentication for enhanced security and user session management.
   - User session management using cookies, ensuring a smoother user experience.
     

2. **Dashboard Overview**:
   - A dynamic dashboard presenting key sustainability metrics such as energy consumption, waste management, and carbon emissions.
   - Data visualization using graphs and charts for better insights.

3. **User Role**:
   - Only authorized users (Admins) can access the platform.

4. **Data Insights & Reports**:
   - Generate JSON data to track progress over time and compare performance.
   - Downloadable reports in JSON format for external review.

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

### 1. **Login Page**
The user can log in using their email and password to access the dashboard.
![image](https://github.com/user-attachments/assets/876d7276-e2ad-445a-a191-33b88baeee1c)


### 2. **Dashboard Overview**
Displays key metrics and data visualizations related to sustainability projects.
![image](https://github.com/user-attachments/assets/fcc18cbf-161e-472b-a1a3-8570cb36a46f)


Same in mobile screen will be:
![image](https://github.com/user-attachments/assets/994921f3-bcfb-4ff4-83ab-62d9ac81240e)


### 3. **Metrics Adding and Comparing with Companies Benchmark**
Users can manage and track various sustainability projects and can compare with the Company Benchmarks.
![image](https://github.com/user-attachments/assets/0d99ec14-1c4c-4be9-920b-b53c0ab69f4c)


### 4. **Export JSON Functionality**

The **Export JSON** feature allows users to download the entire sustainability project data in a structured JSON format. This can be useful for reporting, data analysis, or backups. 

- **How It Works:**
  - The system compiles all relevant project information, including metrics, progress updates, and project details.
  - Users can simply click the **Download JSON** button, and a `.json` file will be generated and downloaded automatically.
  
- **Usage:**
  This feature is accessible from the dashboard, making it easy for users to extract data at any point in time for external analysis or sharing.

![image](https://github.com/user-attachments/assets/c48bbfe9-67d7-45ae-90f9-16e283748a52)


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
  


