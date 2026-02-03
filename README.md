# Digital Parking Management System

This project is a Digital Parking Management System with a React frontend and a Spring Boot backend.

## Features
- **User Features**: Register/login, view available parking slots, book a slot, generate/scan QR code for entry and exit, view booking history.
- **Admin Features**: Manage parking slots, view/manage all bookings, generate reports, manage users, view analytics.
- **Security**: Uses JWT for secure authentication.
- **Other**: Sends email notifications, and supports real-time booking status.

## Tech Stack
- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Spring Boot, Spring Security, JPA
- **Database**: MySQL / PostgreSQL
- **QR Code Generation**: ZXing library
- **Deployment**: Dockerized setup

## Setup
### Prerequisites
- Node.js v18
- npm
- Java 17
- Maven

### Backend
1. **Navigate to the backend directory:**

   ```sh
   cd backend
   ```

2. **Update the `application.properties` file** with your MySQL credentials and change the placeholder values accordingly.

3. **Run the Spring Boot application:**

   ```sh
   mvn spring-boot:run
   ```
   
   This will start the backend server on [http://localhost:8080](http://localhost:8080).

### Frontend
1. **Navigate to the frontend directory:**

   ```sh
   cd frontend
   ```

2. **Install Node dependencies:**

   ```sh
   npm install
   ```

3. **Start the React app:**

   ```sh
   npm start
   ```

   This will start the frontend server on [http://localhost:3000](http://localhost:3000).

## Usage

### For Users:
1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Dashboard**: View available slots and your recent bookings
4. **Book Slot**: Select an available slot and book it for a specific date and time
5. **My Bookings**: View all your bookings and generate QR codes for entry/exit

### For Admins:
1. **Admin Dashboard**: View system statistics and reports
2. **Manage Slots**: Add, update, or delete parking slots
3. **View Bookings**: Monitor all user bookings
4. **Reports**: Access analytics and booking reports

### Default Admin Account:
To create an admin account, manually update a user's role in the database to 'ADMIN' or register normally and then update the role in the users table.

## Project Structure
- **Backend**: All server-side code including Spring Boot setup, entities, controllers, and security configuration.
- **Frontend**: All client-side code including React components, service calls, and routing.

### Backend
- `src/main/java/com/parking/management`: Main Spring Boot app and all backend logic
- `src/main/resources`: Application properties and other resources

### Frontend
- `src/pages`: Application pages for routing
- `src/components`: Reusable components
- `src/services`: API services using Axios
- `src/types`: TypeScript types/interfaces

## Deployment Instructions
To deploy this application, you can consider dockerizing both the frontend and backend and deploying through a platform like AWS, Google Cloud, or Heroku.

## Note
This setup includes basic authentication and authorization but does not include production-level optimizations or error handling.
