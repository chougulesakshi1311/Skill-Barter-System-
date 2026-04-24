# Skill Barter System - Project Brief

## Overview
**Skill Barter System** is a peer-to-peer skill exchange platform that enables users to teach and learn valuable skills from each other without monetary transactions. It leverages intelligent matching algorithms to connect learners based on complementary skill needs and offers.

## Problem Solved
- **Skill Gap**: Users want to learn new skills but face high costs of formal education
- **Idle Skills**: Experts have knowledge they're willing to share but lack a structured platform
- **One-to-One Matching**: Existing platforms don't intelligently match learners with compatible skill pairs
- **Community Building**: Need for a platform that fosters meaningful knowledge exchange

## Key Features

### 1. **User Management**
- Secure registration and authentication (JWT-based)
- User profiles with bios, locations, and availability
- Profile picture support
- Role-based access (user/admin)

### 2. **Skill Management**
- Add skills offered and skills wanted
- Define skill levels (Beginner, Intermediate, Expert)
- Tag-based skill categorization
- Skill search and filtering

### 3. **Intelligent Matching Engine**
- **1-to-1 Matching**: Finds direct skill pairs (e.g., I teach React, they teach Python)
- **Chain Matching**: Identifies multi-user exchange loops
  - Example: A→B→C→A where each person's want matches the previous person's offer
- Match score calculation based on skill compatibility
- Real-time match recommendation

### 4. **Barter Request System**
- Send/receive skill exchange requests
- Request lifecycle: pending → accepted → completed
- Message support for coordination
- Request history and tracking

### 5. **Review & Rating System**
- Rate users after completed exchanges
- 5-star rating system with comments
- User reputation tracking
- Aggregate rating display

### 6. **Real-time Communication**
- WebSocket-powered messaging
- Direct chat between matched users
- Online status tracking
- Notification system

### 7. **Admin Dashboard**
- User management (block/unblock users)
- Platform statistics and metrics
- Activity logs
- Admin-only controls

## Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.IO
- **Email**: Nodemailer (SMTP)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting

## How It Works

### Flow Diagram
```
1. User Registration/Login
   ↓
2. Create Profile & Add Skills
   ↓
3. View Matched Users (1-to-1 & Chains)
   ↓
4. Send/Receive Barter Requests
   ↓
5. Communicate via Chat
   ↓
6. Complete Exchange & Rate User
   ↓
7. Track History & Reputation
```

### Core Algorithms

**1-to-1 Match Score Calculation**
```
For each other user:
  Score = (skills_they_offer_that_I_want / my_total_wanted) * 100
  Sort by score descending
```

**Chain Match Detection**
```
For current user:
  For each possible path of length N:
    If skillsWanted[i] = skillsOffered[i+1]:
      Mark as valid chain
  Sort chains by average compatibility
```

## Database Schema

### Collections
- **Users**: Profiles, skills, favorites, availability
- **Skills**: Skill catalog with tags and usage count
- **BarterRequests**: Exchange requests with status tracking
- **Messages**: Chat history between users
- **Reviews**: Ratings and feedback
- **Notifications**: System notifications for users
- **ActivityLogs**: Admin audit trail

## Sample Data

The system includes seed data with 6 sample users:
- Alice Johnson (Web Developer & Designer)
- Bob Smith (Full-stack Developer)
- Carol Williams (UI/UX Designer)
- David Brown (Photographer & Musician)
- Emma Davis (English Teacher & Video Editor)
- Frank Miller (Fitness Trainer)

**Sample credentials**: `password123` (same for all test accounts)

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### User Routes
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/search` - Search users by skill/location
- `GET /api/users/recommendations` - Get personalized recommendations

### Matching Routes
- `GET /api/match` - Get 1-to-1 and chain matches

### Barter Routes
- `GET /api/barter` - Get user's barter requests
- `POST /api/barter` - Create new request
- `PATCH /api/barter/:id/status` - Update request status
- `PATCH /api/barter/:id/cancel` - Cancel request

### Message Routes
- `GET /api/messages` - Get chat history
- `POST /api/messages` - Send message

### Review Routes
- `POST /api/reviews` - Create review
- `GET /api/reviews/:userId` - Get user reviews

## Future Enhancements

1. **Video Sessions**: Integrate Zoom/Google Meet for live training
2. **Skill Certificates**: Issue completion certificates
3. **Advanced Filtering**: Filter by availability, distance, rating
4. **Skill Levels**: Progressive skill path learning
5. **Groups**: Form skill exchange groups
6. **Leaderboard**: Gamification with badges/points
7. **Payment Optional**: Support premium features
8. **Mobile App**: React Native for iOS/Android

## Getting Started

### Installation
```bash
# Install dependencies
npm install

# Run database seed (optional)
cd server && node seed.js

# Start development server
npm run dev
```

### Environment Variables
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
PORT=5001
```

## Team & Evaluation
- **Project Type**: Full-stack MERN application
- **Scope**: Mini project for WADL course
- **Status**: Functional MVP with core features

---

**Created**: April 2026  
**Platform**: Skill-Barter-System  
**Purpose**: Peer-to-peer skill exchange without monetary transactions
