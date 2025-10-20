# Pickup Scheduling Flow Implementation

## Overview
Implemented a multi-step modal flow for scheduling pickup immediately after quote submission. This flow collects complete information including title specifics, pickup location, scheduling details, and payment information before redirecting to the quote management page.

## Workflow

### Current Flow
```
PricingDisplay → Click "Continue" → Opens modal sequence:
  1. Title Specifics Modal
  2. Pickup Location Modal  
  3. Pickup Scheduling Modal
  4. Payment Details Modal
  → Submit all data → Redirect to /manage/[accessToken]
```

### User Journey
1. User completes quote and receives offer
2. Clicks "Continue" button on success screen
3. Goes through 4 modal steps collecting information
4. All data is submitted together
5. Pickup is scheduled immediately
6. User is redirected to manage page where they can reschedule or cancel

## Components Created

### 1. TitleSpecificsModal.jsx
**Location:** `src/components/customer/TitleSpecificsModal.jsx`

**Fields:**
- Name(s) on title (text input)
- VIN (17-character input, auto-uppercase)
- Title issue state (dropdown with all US states)
- Vehicle color (dropdown with common colors)

**Features:**
- Pre-populates VIN from quote context
- Validation for required fields
- Help text for guidance
- Continue and Cancel buttons

### 2. PickupLocationModal.jsx
**Location:** `src/components/customer/PickupLocationModal.jsx`

**Fields:**
- Address type (residence/business radio buttons)
- Street address
- City, State, ZIP code
- Special instructions (optional)
- Contact name
- Contact phone

**Features:**
- Auto-populates city/state from ZIP code via API
- Address verification via `/api/verify-address`
- Pre-fills contact info from quote context
- Back and Continue navigation
- Requires address verification before proceeding

### 3. PickupSchedulingModal.jsx
**Location:** `src/components/customer/PickupSchedulingModal.jsx`

**Fields:**
- Pickup date (date picker, tomorrow to +30 days)
- Pickup time window (morning/afternoon/evening)

**Features:**
- Date validation (not in past, within 30 days)
- Three time slots:
  - Morning: 8:00 AM - 12:00 PM
  - Afternoon: 12:00 PM - 4:00 PM
  - Evening: 4:00 PM - 9:00 PM
- Back and Continue navigation

### 4. PaymentDetailsModal.jsx
**Location:** `src/components/customer/PaymentDetailsModal.jsx`

**Fields:**
- Payee's full name (who receives the check)

**Features:**
- Payment info display (payment at pickup)
- Submits all collected data from previous modals
- Shows loading state during submission
- Back button to previous step

## Database Schema Updates

### Quote Model Changes
**Location:** `src/models/Quote.js`

**New Fields Added:**

```javascript
// Title Specifics
titleSpecifics: {
  nameOnTitle: String,
  titleVin: String,
  titleIssueState: String,
  vehicleColor: String,
}

// Payment Details
paymentDetails: {
  payeeName: String,
  paymentMethod: {
    type: String,
    enum: ["cash", "check", "not_specified"],
    default: "not_specified"
  },
}
```

## API Endpoint

### New Endpoint: `/api/quote/schedule-pickup-complete`
**Location:** `src/app/api/quote/schedule-pickup-complete/route.js`

**Purpose:** Handle complete pickup scheduling with all collected data

**Request Body:**
```javascript
{
  accessToken: string,
  titleSpecifics: {
    nameOnTitle: string,
    titleVin: string,
    titleIssueState: string,
    vehicleColor: string
  },
  pickupAddress: string,
  addressType: "residence" | "business",
  specialInstructions: string,
  contactName: string,
  contactPhone: string,
  structuredAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string
  },
  scheduledDate: string,
  pickupWindow: "morning" | "afternoon" | "evening",
  paymentDetails: {
    payeeName: string
  }
}
```

**Functionality:**
- Validates all required fields
- Updates quote with title specifics, pickup details, and payment info
- Changes quote status to "pickup_scheduled"
- Adds action to history
- Sends confirmation emails to customer and admin
- Returns updated quote data

## PricingDisplay Component Updates

### Modal Flow Management
**Location:** `src/components/quote/PricingDisplay.jsx`

**New State:**
```javascript
// Modal visibility
const [showTitleModal, setShowTitleModal] = useState(false);
const [showLocationModal, setShowLocationModal] = useState(false);
const [showSchedulingModal, setShowSchedulingModal] = useState(false);
const [showPaymentModal, setShowPaymentModal] = useState(false);

// Collected data
const [titleData, setTitleData] = useState({});
const [pickupLocationData, setPickupLocationData] = useState({});
const [schedulingData, setSchedulingData] = useState({});
const [paymentData, setPaymentData] = useState({});
```

**Flow Handlers:**
- `handleContinueToScheduling()` - Opens first modal
- `handleTitleContinue()` - Saves title data, opens location modal
- `handleLocationContinue()` - Saves location data, opens scheduling modal
- `handleSchedulingContinue()` - Saves scheduling data, opens payment modal
- `handleFinalSubmit()` - Submits all data, redirects to manage page

**Button Update:**
Changed "Continue" button from direct redirect to opening modal flow:
```javascript
onClick={handleContinueToScheduling}  // Instead of redirect
```

## Data Flow

### 1. Quote Submission
User submits quote → Receives `accessToken` and `quoteId` → Success screen displays

### 2. Modal Flow Initiation
User clicks "Continue" → `showTitleModal` opens

### 3. Data Collection
- Each modal validates and saves its data
- Back buttons allow navigation to previous steps
- Data persists when navigating back/forward

### 4. Final Submission
- All collected data combined
- POST to `/api/quote/schedule-pickup-complete`
- Quote updated in database
- Emails sent to customer and admin
- Redirect to `/manage/[accessToken]`

### 5. Management Page
- User can view scheduled pickup
- Reschedule or cancel options available
- All collected data stored and displayed

## Features

### Pre-population
- VIN auto-filled from quote context
- Contact info (name, phone) from seller info
- ZIP code, city, state from location context
- Data persists when using back buttons

### Validation
- Required field checks on all forms
- VIN format validation (min 10 chars)
- Date validation (not in past, within 30 days)
- Address verification required before proceeding
- Phone number format validation

### User Experience
- Smooth modal transitions
- Progress indication through steps
- Back navigation available on all modals except first
- Loading states during API calls
- Error messages with clear guidance
- Help text and tooltips throughout

### Email Notifications
- Customer receives pickup confirmation
- Admin receives pickup notification with all details
- Includes title specifics and payment info in admin email

## Testing Checklist

- [ ] Title specifics modal opens with pre-filled VIN
- [ ] All US states available in dropdown
- [ ] Location modal auto-populates city/state from ZIP
- [ ] Address verification works correctly
- [ ] Contact info pre-filled from quote
- [ ] Date picker restricts past dates and >30 days
- [ ] Time windows display correctly
- [ ] Back buttons navigate properly
- [ ] Data persists when going back
- [ ] Final submission saves all data
- [ ] Quote status updates to "pickup_scheduled"
- [ ] Emails sent successfully
- [ ] Redirect to manage page works
- [ ] Reschedule and cancel buttons available on manage page

## Integration Points

### Existing Components
- **ScheduleDialog.jsx** - Separate dialog for rescheduling from manage page
- **QuoteManager.jsx** - Displays scheduled pickup and action buttons
- **manage/[accessToken]/page.jsx** - Quote management page

### APIs Used
- `/api/zipcode` - Get city/state from ZIP code
- `/api/verify-address` - Verify pickup address
- `/api/quote/schedule-pickup-complete` - Submit complete schedule

### Email Services
- `sendPickupScheduledConfirmation()` - Customer confirmation
- `sendPickupNotificationEmail()` - Admin notification

## Future Enhancements

1. **Image Upload** - Allow users to upload photos of vehicle/title
2. **Signature Capture** - Digital signature for title verification
3. **SMS Notifications** - Send pickup reminders via SMS
4. **Calendar Integration** - Add to user's calendar
5. **GPS Location** - Use device location for address
6. **Multiple Payees** - Support for multiple check recipients
7. **Payment Method Selection** - Choose cash vs check preference
8. **Driver Assignment** - Assign driver in admin panel
9. **Pickup Status Tracking** - Real-time tracking of pickup
10. **Customer Rating** - Rate pickup experience after completion

## Notes

- The original `ScheduleDialog.jsx` is still used for rescheduling from the manage page
- This new flow is specifically for initial scheduling after quote submission
- All data is stored in the Quote model for future reference
- Admin can view all collected information in the admin panel
- The flow can be cancelled at any step by clicking the Cancel/Close button

