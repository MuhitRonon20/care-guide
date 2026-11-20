# Doctor Tracker REST API Documentation
**Version**: 1.0.0  
**Base URL**: `/api`  
**Host**: Standalone Express.js server (Default: `http://localhost:5000/api`)

---

## 1. Authentication & System Endpoints

### 1.1 Health Check
- **Endpoint**: `GET /api/health`
- **Auth**: None
- **Description**: Returns service health status and MongoDB connectivity state.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "doctor-tracker-backend",
  "database": "connected",
  "timestamp": "2026-11-20T04:00:00.000Z"
}
```

### 1.2 Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Auth**: None
- **Rate Limit**: 10 requests per 15 minutes per IP
- **Request Body**:
```json
{
  "email": "admin@careguide.bd",
  "password": "DoctorTracker2024!",
  "rememberMe": true
}
```
- **Response `200 OK`**:
  - Sets HttpOnly cookie: `doctor_tracker_token` (expires in 7 days if rememberMe, else 1 day)
```json
{
  "id": "673cf8b394d21e42f9b87654",
  "email": "admin@careguide.bd",
  "name": "Dr. Farhana Ahmed",
  "role": "admin",
  "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```
- **Response `401 Unauthorized`**:
```json
{
  "message": "Invalid email or password combination"
}
```

### 1.3 Current User Session
- **Endpoint**: `GET /api/auth/me`
- **Auth**: Required (`doctor_tracker_token` cookie or Bearer header)
- **Response `200 OK`**:
```json
{
  "id": "673cf8b394d21e42f9b87654",
  "email": "admin@careguide.bd",
  "name": "Dr. Farhana Ahmed",
  "role": "admin",
  "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```
- **Response `401 Unauthorized`**:
```json
{
  "message": "Session expired or authentication token missing"
}
```

### 1.4 Admin Logout
- **Endpoint**: `POST /api/auth/logout`
- **Auth**: Required
- **Response `200 OK`**:
  - Clears `doctor_tracker_token` cookie
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

---

## 2. Doctor Management Endpoints

### 2.1 List Doctors (Paginated, Search & Filter)
- **Endpoint**: `GET /api/doctors`
- **Auth**: Required
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string, optional: matches name, hospital, specialization, email, phone)
  - `specialization` (string, optional: filter by exact specialization)
  - `startDate` (ISO string, optional: filter doctors created >= startDate)
  - `endDate` (ISO string, optional: filter doctors created <= endDate)
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": "673cf8b394d21e42f9b87601",
      "name": "Dr. Rafiqul Islam",
      "specialization": "Cardiology",
      "hospital": "Square Hospitals Ltd, Dhaka",
      "phone": "+880 1711-234567",
      "email": "rafiqul.islam@squarehospital.com",
      "roomNumber": "Room 402, Block A",
      "status": "Active",
      "patientCount": 6,
      "createdAt": "2024-02-10T09:30:00.000Z",
      "updatedAt": "2024-02-10T09:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "totalRecords": 8,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### 2.2 Get Doctor by ID (with Associated Patients)
- **Endpoint**: `GET /api/doctors/:id`
- **Auth**: Required
- **Response `200 OK`**:
```json
{
  "id": "673cf8b394d21e42f9b87601",
  "name": "Dr. Rafiqul Islam",
  "specialization": "Cardiology",
  "hospital": "Square Hospitals Ltd, Dhaka",
  "phone": "+880 1711-234567",
  "email": "rafiqul.islam@squarehospital.com",
  "roomNumber": "Room 402, Block A",
  "status": "Active",
  "patientCount": 6,
  "createdAt": "2024-02-10T09:30:00.000Z",
  "updatedAt": "2024-02-10T09:30:00.000Z",
  "patients": [
    {
      "id": "673cf8b394d21e42f9b87701",
      "name": "Mohammad Zahirul Haque",
      "doctorId": "673cf8b394d21e42f9b87601",
      "condition": "Coronary Artery Disease",
      "phone": "+880 1712-345678",
      "email": "zahirul.haque@gmail.com",
      "age": 58,
      "gender": "Male",
      "status": "Active",
      "bloodGroup": "B+",
      "notes": "Post angioplasty follow-up",
      "createdAt": "2024-03-01T10:00:00.000Z"
    }
  ]
}
```

### 2.3 Create Doctor
- **Endpoint**: `POST /api/doctors`
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "Dr. Kamal Hossain",
  "specialization": "Cardiology",
  "hospital": "Evercare Hospital Dhaka",
  "phone": "+880 1711-998877",
  "email": "kamal.hossain@evercare.com",
  "roomNumber": "Suite 305"
}
```
- **Response `201 Created`**:
```json
{
  "id": "673cf8b394d21e42f9b87609",
  "name": "Dr. Kamal Hossain",
  "specialization": "Cardiology",
  "hospital": "Evercare Hospital Dhaka",
  "phone": "+880 1711-998877",
  "email": "kamal.hossain@evercare.com",
  "roomNumber": "Suite 305",
  "status": "Active",
  "patientCount": 0,
  "createdAt": "2026-11-20T04:15:00.000Z",
  "updatedAt": "2026-11-20T04:15:00.000Z"
}
```

### 2.4 Update Doctor
- **Endpoint**: `PATCH /api/doctors/:id`
- **Auth**: Required
- **Request Body**: Partial doctor fields
- **Response `200 OK`**: Updated `Doctor` object.

### 2.5 Delete Doctor
- **Endpoint**: `DELETE /api/doctors/:id`
- **Auth**: Required
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Doctor record deleted successfully"
}
```

### 2.6 Get Doctor Patients
- **Endpoint**: `GET /api/doctors/:id/patients`
- **Auth**: Required
- **Response `200 OK`**: Array of `Patient[]`

---

## 3. Patient Management Endpoints

### 3.1 List Patients (Paginated, Search & Multi-Filter)
- **Endpoint**: `GET /api/patients`
- **Auth**: Required
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string, optional: matches patient name, condition, phone, email)
  - `doctorId` (string, optional: filter by assigned doctor ID)
  - `condition` (string, optional: filter by diagnosis keyword or exact match)
  - `status` (string, optional: Active | Under Observation | Recovered | Critical)
  - `startDate` (ISO string, optional)
  - `endDate` (ISO string, optional)
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": "673cf8b394d21e42f9b87701",
      "name": "Mohammad Zahirul Haque",
      "doctorId": "673cf8b394d21e42f9b87601",
      "doctorName": "Dr. Rafiqul Islam",
      "doctorSpecialization": "Cardiology",
      "condition": "Coronary Artery Disease",
      "phone": "+880 1712-345678",
      "email": "zahirul.haque@gmail.com",
      "age": 58,
      "gender": "Male",
      "status": "Active",
      "bloodGroup": "B+",
      "notes": "Post angioplasty follow-up",
      "createdAt": "2024-03-01T10:00:00.000Z",
      "updatedAt": "2024-03-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 4,
    "totalRecords": 32,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3.2 Get Patient by ID
- **Endpoint**: `GET /api/patients/:id`
- **Auth**: Required
- **Response `200 OK`**: `Patient` object.

### 3.3 Create Patient
- **Endpoint**: `POST /api/patients`
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "Nusrat Jahan",
  "doctorId": "673cf8b394d21e42f9b87601",
  "condition": "Hypertensive Heart Disease",
  "phone": "+880 1819-112233",
  "email": "nusrat.jahan@gmail.com",
  "age": 46,
  "gender": "Female",
  "status": "Active",
  "bloodGroup": "A+",
  "notes": "Regular blood pressure monitoring recommended"
}
```
- **Response `201 Created`**: Created `Patient` object with resolved `doctorName` and `doctorSpecialization`.

### 3.4 Update Patient
- **Endpoint**: `PATCH /api/patients/:id`
- **Auth**: Required
- **Request Body**: Partial patient fields
- **Response `200 OK`**: Updated `Patient` object.

### 3.5 Delete Patient
- **Endpoint**: `DELETE /api/patients/:id`
- **Auth**: Required
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Patient record deleted successfully"
}
```

---

## 4. Dashboard Analytics Endpoints

### 4.1 Dashboard Overview KPIs
- **Endpoint**: `GET /api/dashboard/overview`
- **Auth**: Required
- **Response `200 OK`**:
```json
{
  "totalDoctors": 8,
  "totalPatients": 32,
  "patientsPerDoctor": 4.0,
  "activePatients": 24,
  "criticalCases": 2,
  "recentRegistrationsCount": 18
}
```

### 4.2 Patients Per Doctor Metric
- **Endpoint**: `GET /api/dashboard/patients-per-doctor`
- **Auth**: Required
- **Response `200 OK`**:
```json
[
  {
    "doctorId": "673cf8b394d21e42f9b87601",
    "doctorName": "Dr. Rafiqul Islam",
    "specialization": "Cardiology",
    "hospital": "Square Hospitals Ltd, Dhaka",
    "patientCount": 6
  }
]
```

### 4.3 Patient Registration Trends
- **Endpoint**: `GET /api/dashboard/patient-trends`
- **Auth**: Required
- **Response `200 OK`**:
```json
[
  {
    "date": "2024-03-01",
    "formattedDate": "Mar 1",
    "newPatients": 2,
    "cumulativeTotal": 2
  }
]
```

### 4.4 Condition Distribution
- **Endpoint**: `GET /api/dashboard/condition-distribution`
- **Auth**: Required
- **Response `200 OK`**:
```json
[
  {
    "condition": "Cardiovascular",
    "count": 9,
    "percentage": 28.1,
    "color": "#0284C7"
  }
]
```

### 4.5 Specialization Breakdown
- **Endpoint**: `GET /api/dashboard/specialization-breakdown`
- **Auth**: Required
- **Response `200 OK`**:
```json
[
  {
    "specialization": "Cardiology",
    "doctorCount": 2,
    "patientCount": 9
  }
]
```
