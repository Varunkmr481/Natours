<div align="center">

<img src="https://github.com/user-attachments/assets/c486aad2-54ed-4866-bcda-77aa62d67a5f" alt="Natours Logo" width="150" height="150">

# Natours
  
[![Status](https://img.shields.io/badge/status-In%20Progress-yellow)](https://github.com/yourusername/natours)

</div>

## 🌟 Key Features
- *RESTful API*: Fully functional API with CRUD operations for tours, users, and bookings.
- *Filtering, Sorting, and Pagination*: Flexible query handling for filtering, sorting, and paginating data.
- *GeoJSON Integration*: Location-based tours using GeoJSON for mapping and spatial queries.
- *User Authentication and Authorization*:
  - Secure login and signup using JWT (JSON Web Tokens).
  - Role-based access control (Admin, User).
- *Image Upload and Processing*:
  - Upload and resize tour images using Sharp.
- *Payment Integration*:
  - Stripe for secure online payments.
- *Error Handling and Security*:
  - Centralized error-handling middleware.
  - Protection against XSS, NoSQL injection, and parameter pollution.
- *Deployment*:
  - Backend deployed on Heroku.
  - Database hosted on MongoDB Atlas.

## 💻 Technologies Used
- *Backend*: Node.js, Express.js
- *Database*: MongoDB (with Mongoose)
- *Authentication*: JSON Web Tokens (JWT)
- *Payments*: Stripe API
- *Image Processing*: Sharp
- *Frontend*: HTML, CSS, JavaScript
- *Deployment*: Heroku, MongoDB Atlas
- *Tools*: Postman, Git

<!--
## 📂 Project Structure

natours/  
├── controllers/         # Controller logic for handling requests 
├── models/              # Mongoose models for database collections 
├── public/              # Static assets (e.g., CSS, JS) 
├── routes/              # API route definitions
├── utils/               # Utility functions
 └── views/               # HTML templates (if using pug for SSR)
-->

## 🚀 How to Run Locally
1. Clone the repository:

```bash
git clone https://github.com/yourusername/natours.git
cd natours
```

3. Install dependencies:
```js
npm install
```

3. Set up environment variables:

- Create a .env file in the root directory and add:

```js
NODE_ENV=development
DATABASE=<your_mongo_db_connection_string>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=90d
```

4. Run the development server:
```js
npm run dev
```

6. Access the app at http://localhost:3000

## 🌐 API Endpoints

1. Tours:

- GET /api/v1/tours - Get all tours.
- POST /api/v1/tours - Create a new tour (Admin only).
- GET /api/v1/tours/:id - Get a single tour.


2. Users:

- POST /api/v1/users/signup - Register a new user.
- POST /api/v1/users/login - Login.
- PATCH /api/v1/users/:id - Update user details (Admin only).


3. Bookings:

- POST /api/v1/bookings/checkout-session/:tourId - Create a Stripe checkout session.

## 📌 To-Do

### ✅ Completed Features
- Built a fully functional RESTful API for tours, users, and bookings.
- Implemented user authentication and role-based access control.
- Integrated GeoJSON for location-based queries.
- Developed key backend features such as filtering, sorting, and pagination.

### 🚧 In Progress / Planned Features
- **Map Integration**:
  - Display interactive maps for tour locations on the frontend using Mapbox or Leaflet.
- **Stripe Payment System**:
  - Fully implement Stripe for secure payment processing on tour bookings.
- **Frontend Completion**:
  - Enhance tour detail pages with booking forms, maps, and availability indicators.
  - Connect all backend features with the frontend for a seamless user experience.


## 🙏 Acknowledgements
This project was built as a part of the udemy course by Jonas Schmedtmann.
The course provided me a comprehensive understanding of backend development, RESTful API design, and full-stack application building.  
Special thanks to Jonas for his detailed explanations and hands-on approach to teaching complex concepts.
