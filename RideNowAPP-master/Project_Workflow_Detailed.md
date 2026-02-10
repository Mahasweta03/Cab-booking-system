# RideNow Cab Booking System - Complete Project Workflow

## Overview
The RideNow system follows a complete ride lifecycle from user registration to payment completion, involving multiple actors (Users, Drivers) and complex business processes.

## 1. SYSTEM INITIALIZATION WORKFLOW

### Application Startup Process
```
1. Program.cs Execution
   ├── Load Configuration (appsettings.json)
   ├── Configure Services (DI Container)
   │   ├── Database Context Registration
   │   ├── JWT Authentication Setup
   │   ├── Service Layer Registration
   │   └── CORS Policy Configuration
   ├── Build Application Pipeline
   │   ├── Global Exception Middleware
   │   ├── Authentication Middleware
   │   ├── Authorization Middleware
   │   └── Controller Routing
   └── Start HTTP Server
```

### Database Initialization
```
1. Entity Framework Context Creation
   ├── Connection String Resolution
   ├── Model Configuration (OnModelCreating)
   │   ├── Entity Relationships Setup
   │   ├── Unique Constraints Definition
   │   ├── Foreign Key Configurations
   │   └── Delete Behavior Rules
   ├── Migration Application (if needed)
   └── Connection Pool Initialization
```

## 2. USER REGISTRATION & AUTHENTICATION WORKFLOW

### User Registration Flow
```
Frontend Request → UserAuthController.Register()
├── 1. DTO Validation (Data Annotations)
├── 2. AuthService.RegisterUserAsync()
│   ├── Email Uniqueness Check
│   │   └── Database Query: Users.AnyAsync(u => u.Email == dto.Email)
│   ├── Phone Uniqueness Check
│   │   └── Database Query: Users.AnyAsync(u => u.Phone == dto.Phone)
│   ├── Password Hashing
│   │   └── BCrypt.Net.BCrypt.HashPassword(dto.Password)
│   ├── User Entity Creation
│   │   └── New User { Name, Email, Phone, Gender, PasswordHash }
│   ├── Database Save
│   │   └── _context.Users.Add(user) → SaveChangesAsync()
│   ├── JWT Token Generation
│   │   └── JwtService.GenerateToken(userId, email, "User")
│   └── Refresh Token Generation
│       └── JwtService.GenerateRefreshToken()
└── 3. Return AuthResponseDto
    └── { Token, RefreshToken, UserId, Name, Email, Phone, Role }
```

### User Login Flow
```
Frontend Request → UserAuthController.Login()
├── 1. DTO Validation
├── 2. AuthService.LoginUserAsync()
│   ├── User Lookup by Email
│   │   └── Database Query: Users.FirstOrDefaultAsync(u => u.Email == dto.Email)
│   ├── Password Verification
│   │   └── BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)
│   ├── JWT Token Generation (if valid)
│   ├── Refresh Token Generation
│   └── Store Refresh Token in Database
└── 3. Return AuthResponseDto or Unauthorized
```

### Driver Registration Flow
```
Frontend Request → DriverAuthController.Register()
├── 1. Basic Registration (Similar to User)
│   ├── Email/Phone Uniqueness Check
│   ├── Password Hashing
│   ├── Driver Entity Creation (IsActive = false)
│   └── JWT Token Generation
├── 2. Profile Completion
│   └── DriverController.CompleteProfile()
│       ├── License Information
│       ├── Vehicle Details
│       ├── Address Information
│       └── Set IsActive = true
└── 3. Driver Preferences Setup
    └── DriverController.SetPreferences()
        ├── Location Setting
        ├── Vehicle Type Selection
        └── Status = Available
```

## 3. RIDE BOOKING WORKFLOW (DETAILED)

### Phase 1: Ride Request Creation
```
User Mobile App → RideController.RequestRide()
├── 1. Authentication Check
│   └── JWT Token Validation → Extract UserId from Claims
├── 2. Input Validation
│   └── RideRequestDto { PickupLocation, DropLocation, Coordinates, VehicleType }
├── 3. User Information Retrieval
│   └── Database Query: Users.FindAsync(userId)
├── 4. RideService.CreateRideRequest()
│   ├── Distance Calculation
│   │   └── LocationService.CalculateDistance(pickupLat, pickupLng, dropLat, dropLng)
│   │       └── Haversine Formula Implementation
│   │           ├── Convert coordinates to radians
│   │           ├── Calculate angular distance
│   │           └── Return distance in kilometers
│   ├── Fare Calculation
│   │   └── LocationService.CalculateFare(distance, vehicleType)
│   │       └── Rate Mapping: { Bike: 5₹/km, Auto: 8₹/km, Cab: 12₹/km }
│   ├── OTP Generation
│   │   └── Random 4-digit number (1000-9999)
│   ├── Ride Entity Creation
│   │   └── New Ride {
│   │       UserId, CustomerName, Locations, Coordinates,
│   │       Distance, Fare, VehicleType, OTP, Status: Requested
│   │   }
│   └── Database Save
│       └── _context.Rides.Add(ride) → SaveChangesAsync()
└── 5. Response to User
    └── { rideId, otp, fare, distance }
```

### Phase 2: Driver Discovery & Matching
```
Driver Mobile App → RideController.GetAvailableRides()
├── 1. Authentication Check
│   └── JWT Token Validation → Verify "Driver" Role
├── 2. Query Parameters
│   └── { location, vehicleType }
├── 3. RideService.GetAvailableRides()
│   ├── Database Query Filter
│   │   └── Rides.Where(r => r.Status == RideStatus.Requested && r.DriverId == null)
│   ├── Location-based Filtering (Future Enhancement)
│   │   └── Geographic proximity calculation
│   ├── Vehicle Type Matching
│   │   └── Filter by driver's vehicle type
│   └── Sort by Request Time
│       └── OrderByDescending(r => r.RequestedAt)
└── 4. Return Available Rides List
    └── { RideId, CustomerName, Locations, Distance, Fare, RequestedAt }
```

### Phase 3: Ride Acceptance
```
Driver Selects Ride → RideController.AcceptRide(rideId)
├── 1. Authentication & Authorization
│   └── Extract DriverId from JWT Claims
├── 2. Ride Availability Check
│   ├── Database Query: Rides.FindAsync(rideId)
│   ├── Validate Status == Requested
│   ├── Validate DriverId == null (not already accepted)
│   └── Race Condition Protection (Database Transaction)
├── 3. Driver Status Update
│   ├── Find Driver: Drivers.FindAsync(driverId)
│   ├── Update Status: DriverStatus.Riding
│   └── Update Timestamp: UpdatedAt = DateTime.UtcNow
├── 4. Ride Assignment
│   ├── Set DriverId = driverId
│   ├── Update Status: RideStatus.Accepted
│   ├── Set AcceptedAt = DateTime.UtcNow
│   └── Database Transaction Commit
├── 5. Real-time Notification (Future Enhancement)
│   └── SignalR notification to User about driver assignment
└── 6. Response to Driver
    └── { message, rideId, otp, customerName }
```

### Phase 4: Ride Start Verification
```
Driver Arrives at Pickup → RideController.VerifyOTP(rideId, otp)
├── 1. Authentication Check
│   └── Verify Driver Role and Assignment to Ride
├── 2. OTP Validation
│   ├── Database Query: Rides.FindAsync(rideId)
│   ├── Compare Provided OTP with Stored OTP
│   └── Validate Ride Status == Accepted
├── 3. Ride Start Process
│   ├── Update Status: RideStatus.InProgress
│   ├── Set StartedAt = DateTime.UtcNow
│   └── Database Save
├── 4. Real-time Updates (Future Enhancement)
│   └── SignalR notification to User: "Ride Started"
└── 5. Response Confirmation
    └── "Ride started successfully"
```

### Phase 5: Ride Completion
```
Driver Reaches Destination → RideController.CompleteRide(rideId)
├── 1. Authentication & Validation
│   ├── Verify Driver Assignment
│   └── Validate Ride Status (InProgress or Accepted)
├── 2. Ride Completion Process
│   ├── Handle Edge Case: If never started, set StartedAt = now
│   ├── Update Status: RideStatus.Completed
│   ├── Set CompletedAt = DateTime.UtcNow
│   └── Database Save
├── 3. Driver Status Update
│   ├── Update Driver Status: Available (for new rides)
│   └── Update Driver Location (Future Enhancement)
├── 4. Payment Trigger
│   └── Initiate Payment Process (Next Phase)
└── 5. Response Confirmation
    └── "Ride completed successfully"
```

## 4. PAYMENT PROCESSING WORKFLOW

### Phase 1: Payment Method Selection
```
User App → PaymentController.SelectPaymentMethod()
├── 1. Payment Options Display
│   └── { Cash, UPI ID, QR Code }
├── 2. User Selection Processing
│   ├── PaymentSelectionDto { RideId, PaymentMethod, UPIId? }
│   ├── Database Check: Existing PaymentSelections
│   ├── Update or Create PaymentSelection Entity
│   │   └── { RideId, PaymentMethod, UPIId, Status: Selected, SelectedAt }
│   └── Database Save
└── 3. Confirmation Response
    └── "Payment method selected"
```

### Phase 2: Payment Processing
```
Payment Initiation → PaymentController.ProcessPayment()
├── 1. Payment Method Routing
│   ├── Cash Payment
│   │   └── Direct completion (no online processing)
│   ├── UPI ID Payment
│   │   └── Generate UPI payment link
│   └── QR Code Payment
│       └── Generate UPI QR code string
├── 2. PaymentService.ProcessPayment()
│   ├── Ride Validation
│   │   └── Database Query: Rides.FindAsync(rideId)
│   ├── Duplicate Payment Check
│   │   └── Payments.FirstOrDefaultAsync(p => p.RideId == rideId)
│   ├── Payment Entity Creation
│   │   └── New Payment {
│   │       RideId, Amount, PaymentMethod, Status: Completed,
│   │       TransactionId, UPIId, CreatedAt
│   │   }
│   ├── Driver Earnings Creation (if driver assigned)
│   │   └── New DriverEarnings {
│   │       DriverId, RideId, Fare, PaymentMethod, Status: "Received"
│   │   }
│   └── Database Transaction
│       ├── Add Payment
│       ├── Add DriverEarnings
│       └── SaveChangesAsync()
└── 3. Response with Payment Details
    └── { paymentId, transactionId, status, paymentMethod }
```

### Phase 3: UPI QR Code Generation
```
QR Code Request → PaymentController.GenerateUPIQR()
├── 1. Ride Information Retrieval
│   └── Database Query: Rides.Include(r => r.Driver).FirstOrDefault(rideId)
├── 2. UPI String Generation
│   ├── Driver Name Extraction
│   ├── UPI ID Format: "pay.{drivername}@okhdfcbank"
│   └── UPI URL: "upi://pay?pa={upiId}&pn={driverName}&am={amount}&cu=INR"
├── 3. QR Code Generation (Frontend Responsibility)
│   └── Return UPI string for QR encoding
└── 4. Response
    └── { qrCode: "upi://pay?pa=..." }
```

## 5. FEEDBACK & RATING WORKFLOW

### Feedback Submission Process
```
Post-Ride Feedback → FeedbackController.CreateFeedback()
├── 1. Feedback Type Determination
│   ├── UserToDriver: User rates driver performance
│   └── DriverToUser: Driver rates user behavior
├── 2. Validation Process
│   ├── Ride Existence Check
│   ├── Driver Assignment Validation
│   ├── Duplicate Feedback Prevention
│   │   └── Check existing feedback of same type for ride
│   └── Rating Range Validation (1-5 stars)
├── 3. Feedback Entity Creation
│   └── New Feedback {
│       RideId, Rating, Comment, FeedbackType,
│       DriverId, UserId, CreatedAt
│   }
├── 4. Database Save
│   └── _context.Feedbacks.Add(feedback) → SaveChangesAsync()
└── 5. Confirmation Response
    └── "Feedback submitted successfully"
```

### Driver Rating Aggregation
```
Driver Profile View → FeedbackController.GetDriverFeedback(driverId)
├── 1. Feedback Retrieval
│   ├── Filter: UserToDriver feedback only
│   ├── Include: User and Ride information
│   ├── Sort: OrderByDescending(CreatedAt)
│   └── Select: Rating, Comment, CustomerName, RideDetails
├── 2. Rating Calculation
│   ├── Average Rating: feedbacks.Average(f => f.Rating)
│   ├── Total Feedback Count
│   └── Rating Distribution (Future Enhancement)
├── 3. Response Structure
│   └── { feedbacks: [...], averageRating: 4.2 }
└── 4. Driver Performance Metrics
    └── Used for driver ranking and visibility
```

## 6. DRIVER EARNINGS WORKFLOW

### Earnings Tracking Process
```
Payment Completion → Automatic Earnings Creation
├── 1. Triggered by PaymentService.ProcessPayment()
├── 2. Driver Assignment Check
│   └── Only create earnings if ride.DriverId != null
├── 3. Duplicate Prevention
│   └── Check existing DriverEarnings for same RideId
├── 4. Earnings Entity Creation
│   └── New DriverEarnings {
│       DriverId, RideId, Fare, PaymentMethod,
│       Status: "Received", Date: DateTime.UtcNow
│   }
└── 5. Database Save (within payment transaction)
```

### Earnings Report Generation
```
Driver Dashboard → FeedbackController.GetDriverEarningsWithFeedback()
├── 1. Earnings Data Retrieval
│   ├── Filter by DriverId
│   ├── Include Ride information
│   ├── Sort by Date (descending)
│   └── Select: EarningId, Fare, Date, RideDetails
├── 2. Associated Feedback Retrieval
│   ├── Get RideIds from earnings
│   ├── Fetch UserToDriver feedbacks for those rides
│   └── Include User information
├── 3. Data Correlation
│   ├── Match earnings with corresponding feedback
│   ├── Calculate total earnings
│   ├── Calculate average rating
│   └── Combine into unified response
└── 4. Response Structure
    └── { earnings: [...], totalEarnings: 2500, averageRating: 4.3 }
```

## 7. REAL-TIME COMMUNICATION WORKFLOW (Future Enhancement)

### SignalR Integration Points
```
1. Ride Status Updates
   ├── Ride Requested → Notify nearby drivers
   ├── Ride Accepted → Notify user with driver details
   ├── Driver Arrived → Notify user
   ├── Ride Started → Notify user
   └── Ride Completed → Notify both parties

2. Location Tracking
   ├── Driver Location Updates → Send to user
   ├── ETA Calculations → Real-time updates
   └── Route Optimization → Dynamic routing

3. Chat Functionality
   ├── User-Driver Communication
   ├── Message History
   └── Emergency Contacts
```

## 8. ERROR HANDLING & LOGGING WORKFLOW

### Global Exception Handling
```
Any Controller Exception → GlobalExceptionMiddleware
├── 1. Exception Capture
│   └── try-catch around _next(context)
├── 2. Logging Process
│   ├── Log Level Determination
│   ├── Error Message Formatting
│   ├── Stack Trace Capture (Development only)
│   └── Structured Logging Output
├── 3. Response Generation
│   ├── HTTP Status Code Mapping
│   │   ├── UnauthorizedAccessException → 401
│   │   ├── ArgumentException → 400
│   │   └── Default → 500
│   ├── Error Response Structure
│   │   └── { error: { message, statusCode, details? } }
│   └── JSON Serialization
└── 4. Client Response
    └── Consistent error format across all endpoints
```

### Validation Workflow
```
Request Input → Model Validation
├── 1. Data Annotation Validation
│   ├── [Required] fields check
│   ├── [StringLength] validation
│   ├── [EmailAddress] format check
│   └── [Range] value validation
├── 2. Custom Validation Logic
│   ├── Business rule validation
│   ├── Database constraint checks
│   └── Cross-field validation
├── 3. Validation Result Processing
│   ├── ModelState.IsValid check
│   ├── Error collection and formatting
│   └── BadRequest response generation
└── 4. Success Path Continuation
    └── Proceed to business logic execution
```

## 9. DATABASE TRANSACTION WORKFLOW

### Entity Framework Change Tracking
```
Service Method Execution → EF Core Change Tracking
├── 1. Entity State Management
│   ├── Added: New entities for insertion
│   ├── Modified: Changed entities for updates
│   ├── Deleted: Entities marked for deletion
│   └── Unchanged: Loaded but unmodified entities
├── 2. Change Detection
│   ├── Property value comparison
│   ├── Navigation property changes
│   └── Collection modifications
├── 3. SQL Generation
│   ├── INSERT statements for Added entities
│   ├── UPDATE statements for Modified entities
│   ├── DELETE statements for Deleted entities
│   └── Relationship management queries
├── 4. Transaction Execution
│   ├── Begin database transaction
│   ├── Execute generated SQL commands
│   ├── Handle concurrency conflicts
│   └── Commit or rollback transaction
└── 5. Identity Resolution
    └── Update entity IDs with database-generated values
```

## 10. SECURITY WORKFLOW

### JWT Authentication Flow
```
Client Request with Token → Authentication Middleware
├── 1. Token Extraction
│   └── Authorization header: "Bearer {token}"
├── 2. Token Validation
│   ├── Signature verification using secret key
│   ├── Issuer validation
│   ├── Audience validation
│   ├── Expiration check
│   └── Claims extraction
├── 3. Principal Creation
│   ├── ClaimsIdentity creation
│   ├── User information population
│   └── Role assignment
├── 4. Authorization Check
│   ├── [Authorize] attribute processing
│   ├── Role-based access control
│   └── Resource-based authorization
└── 5. Request Processing
    └── Continue to controller action or return 401/403
```

This comprehensive workflow covers every aspect of the RideNow system, from initialization to completion, showing how each component interacts with others to deliver a complete cab booking experience.