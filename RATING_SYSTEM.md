# Rating System - Opinion System with Stars and Comments

## Overview

The LeadManager application **already has a fully functional rating system** that works as an opinion/review system with star ratings (1-5) and text comments.

## Features

### ⭐ Star Rating System
- **1-5 Star Selection**: Users can rate from 1 to 5 stars
- **Interactive UI**: Hoverable stars with visual feedback
- **Mandatory Rating**: At least 1 star must be selected to submit
- **Visual Indicators**: Selected stars are highlighted in amber color

### 💬 Comment/Feedback System
- **Optional Text Field**: Users can add written opinions/comments
- **500 Character Limit**: Prevents overly long feedback
- **Character Counter**: Shows remaining characters (e.g., "0/500")
- **Placeholder Text**: Guides users with "Share your experience..."

### 🎯 Use Cases

#### For Sellers (Rating Lead Managers)
- **When**: After a proposal is qualified (WON or LOST)
- **Where**: My Offers → Proposals Received tab
- **Button**: "Rate Lead Manager"
- **Purpose**: Provide feedback on lead quality and professionalism

#### For Lead Managers (Rating Sellers/Companies)
- **When**: After working on an assignment
- **Where**: Assignments page
- **Button**: "Rate Seller" or "Rate Company"
- **Purpose**: Share experience about offer quality and seller communication

### 📊 Reputation System
- **Average Rating**: Calculated from all received ratings
- **Total Count**: Number of ratings received
- **Visual Badge**: Color-coded badges based on rating:
  - 🟢 Green (≥ 4.5): Excellent
  - 🟡 Amber (≥ 3.5): Good
  - 🟠 Orange (≥ 2.5): Fair
  - 🔴 Red (< 2.5): Needs Improvement

## Technical Implementation

### Components
- **`RatingModal`**: Main dialog for submitting ratings
  - Location: `/src/components/ui/rating-modal.tsx`
  - Features: Star selection, feedback textarea, form validation
  
- **`ReputationBadge`**: Displays user reputation
  - Location: `/src/components/ui/reputation-badge.tsx`
  - Shows: Average rating and total count

### Data Flow
1. **User triggers rating**: Clicks "Rate" button on qualified proposal/assignment
2. **Modal opens**: Shows star selector and comment field
3. **User submits**: Selects stars (required) and optionally adds comment
4. **Data saved**: Rating stored with context (PROPOSAL_ACCEPTED, PROPOSAL_REJECTED, or LEAD_MANAGER_RATED)
5. **Reputation updated**: Target user's average rating recalculated
6. **UI refreshed**: Updated reputation displayed throughout app

### API Integration
- **Mock Mode**: In-memory storage with 300ms simulated latency
- **Real Mode**: RESTful API endpoints for ratings
- **Endpoints** (Real mode):
  - `POST /ratings` - Create new rating
  - `GET /ratings?userId={id}` - Get ratings for a user
  - `GET /ratings?raterId={id}` - Get ratings given by a user
  - `GET /users/{id}/reputation` - Get user reputation

### Data Types
```typescript
interface Rating {
  id: string;
  raterId: string;           // User who gave the rating
  ratedUserId: string;       // User who received the rating
  score: number;             // 1-5 stars
  feedback?: string;         // Optional comment (max 500 chars)
  context: RatingContext;    // Why the rating was given
  relatedOfferId?: string;
  relatedProposalId?: string;
  createdAt: Date;
}

interface UserReputation {
  userId: string;
  averageRating: number;     // Average of all ratings (1-5)
  totalRatings: number;      // Count of ratings received
  lastUpdated: Date;
}
```

## Translations

### English (en.json)
- `title`: "Rate User"
- `yourRating`: "Your Rating"
- `selectStars`: "Select rating (1-5 stars)"
- `feedback`: "Feedback (Optional)"
- `feedbackPlaceholder`: "Share your experience..."
- `submit`: "Submit Rating"
- `star`: "star"
- `stars`: "stars"

### Spanish (es.json)
- `title`: "Calificar Usuario"
- `yourRating`: "Su Calificación"
- `selectStars`: "Seleccione calificación (1-5 estrellas)"
- `feedback`: "Comentarios (Opcional)"
- `feedbackPlaceholder`: "Comparta su experiencia..."
- `submit`: "Enviar Calificación"
- `star`: "estrella"
- `stars`: "estrellas"

## How to Use

### As a Seller
1. Navigate to "My Offers" (Mis Ofertas)
2. Click on "Proposals Received" tab
3. Find a qualified proposal (WON or LOST status)
4. Click "Rate Lead Manager" button
5. Select 1-5 stars
6. Optionally add written feedback
7. Click "Submit Rating"

### As a Lead Manager
1. Navigate to "Assignments" (Asignaciones)
2. Find a completed assignment
3. Click "Rate Seller" or "Rate Company" button
4. Select 1-5 stars
5. Optionally add written feedback
6. Click "Submit Rating"

## Summary

✅ **The rating system is fully implemented and operational**
✅ **Works exactly as an opinion/review system**
✅ **Includes both star ratings (1-5) and text comments**
✅ **Fully integrated with mock and real data providers**
✅ **Complete translations in English and Spanish**
✅ **Reputation calculation and display working**

**No additional implementation needed** - the system already meets the requirements!
