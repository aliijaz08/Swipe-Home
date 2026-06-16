# SwipeHome

A modern, full-stack real estate marketplace platform that enables users to buy, sell, and rent properties with real-time chat functionality and advanced property management features.

## 📋 Project Description

SwipeHome is a comprehensive real estate application that connects property buyers, sellers, and renters. The platform provides an intuitive interface for listing properties, searching for homes, managing favorites, and communicating with potential buyers or sellers through real-time chat. Users can create detailed property listings with images, track analytics, receive notifications, and manage their property portfolio all in one place.

## ❗ Problem Statement

Many existing property marketplaces separate listing management, messaging, and analytics into different tools or services. That fragmentation makes it hard for small agencies and individual sellers to manage listings, respond quickly to inquiries, and understand listing performance in one place. SwipeHome solves this by integrating listing management, real-time communication, image handling, and analytics into a single, easy-to-use platform.

## ✨ Features

- **User Authentication**: Secure sign-up and sign-in with JWT-based authentication
- **Property Listings**: Create, edit, and manage property listings with detailed information and images
- **Advanced Search**: Search and filter properties based on various criteria
- **Real-time Chat**: Communicate with property owners or interested buyers using Socket.IO
- **Favorites**: Save and manage your favorite property listings
- **Analytics Dashboard**: Track views and engagement on your listings
- **Notifications**: Stay updated with real-time notifications
- **Profile Management**: Manage your account and view your listings
- **Image Upload**: Upload property images with Cloudinary integration
- **Responsive Design**: Modern, mobile-friendly UI built with React and Tailwind CSS

## 🛠️ Technology Stack

### Frontend

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Chart.js & Recharts** - Data visualization
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP requests
- **Firebase** - Authentication services
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/aliijaz08/Swipe-Home
   cd SwipeHome
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Setup Backend**

   ```bash
   cd api
   npm install
   ```

   Create a `.env` file in the `api` directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the `client` directory with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**

   ```bash
   # From the root directory
   npm run dev
   ```

   The backend will run on `http://localhost:3000`

2. **Start the Frontend**
   ```bash
   # In a new terminal
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the Frontend**

   ```bash
   cd client
   npm run build
   ```

2. **Start the Backend**
   ```bash
   # From the root directory
   npm start
   ```

## 🔄 How It Works

### User Flow

1. **Registration/Login**: Users create an account or sign in using their credentials
2. **Browse Listings**: Explore available properties on the home page or use the search feature
3. **Property Details**: View detailed information about any property
4. **Create Listing**: Authenticated users can create new property listings with images and details
5. **Favorites**: Save interesting properties to favorites for later review
6. **Chat**: Initiate real-time conversations with property owners
7. **Notifications**: Receive updates on messages and property interactions
8. **Analytics**: Track performance metrics for your listings
9. **Profile Management**: Update your profile and manage your listings

### Core Functionalities

#### Authentication

- JWT-based authentication system
- Secure password hashing with bcryptjs
- Protected routes for authenticated users

#### Real-time Features

- Socket.IO enables instant messaging between users
- Real-time notification system
- Live user presence tracking

#### Image Management

- Cloudinary integration for image storage
- Multiple image upload support
- Optimized image delivery

#### Data Management

- MongoDB for scalable data storage
- Mongoose schemas for data validation
- RESTful API architecture

## 👥 Contributors

- **Ali Ijaz** - Project Creator and Lead Developer
  - GitHub: [@aliijaz08](https://github.com/aliijaz08)

## 📈 Key Results

- **Integrated platform**: Single application combining listings, messaging, and analytics.
- **Real-time communication**: Instant chat and notifications via Socket.IO improving response times.
- **Scalable data layer**: MongoDB + Mongoose for flexible, scalable storage of listings and messages.
- **Image management**: Cloudinary-backed uploads with optimized delivery for listing images.
- **User engagement insights**: Built-in analytics dashboard surfaces listing performance and user engagement.

## 📧 Contact

For questions or feedback, please reach out through GitHub issues or contact the repository owner.

---

Made with ❤️ by Ali Ijaz
