
# Thunder Client POST Reference Data

> [!NOTE]
> Authentication has been disabled for all routes as per your request. You can now make POST/PUT/DELETE requests without any Bearer token.

---

Use these JSON payloads for your POST requests in Thunder Client.
Replace placeholder IDs (e.g., `YOUR_INSTITUTE_ID`) with actual valid ObjectIds from your database.

---

## 1. User
**Endpoint:** `/api/users/register` (or similar, check your `authRoutes`)

```json
{
  "UserName": "John Doe",
  "UserPassword": "password123",
  "EmailAddress": "john.doe@example.com",
  "PhoneNumber": "1234567890",
  "IsAdmin": false,
  "Role": "student",
  "Avatar": "https://example.com/avatar.jpg"
}
```

## 2. Institute
**Endpoint:** `/api/institutes`

```json
{
  "InstituteName": "Tech University",
  "InstituteImage": "https://example.com/institute.jpg",
  "InstituteDescription": "A leading technical university.",
  "InstituteCoordinatorID": "YOUR_USER_ID_HERE"
}
```

## 3. Department
**Endpoint:** `/api/departments`

```json
{
  "DepartmentName": "Computer Science",
  "DepartmentImage": "https://example.com/cs.jpg",
  "InstituteID": "YOUR_INSTITUTE_ID_HERE",
  "DepartmentCoordinatorID": "YOUR_USER_ID_HERE"
}
```

## 4. Event
**Endpoint:** `/api/events`

```json
{
  "EventName": "Codeathon 2024",
  "Tagline": "Code your way to glory",
  "Image": "https://example.com/event.jpg",
  "Description": "A 24-hour coding marathon.",
  "GroupMinParticipants": 2,
  "GroupMaxParticipants": 4,
  "Fees": 500,
  "Prizes": "First Prize: $1000",
  "DepartmentID": "YOUR_DEPARTMENT_ID_HERE",
  "EventCoordinatorID": "YOUR_USER_ID_HERE",
  "Location": "Main Auditorium",
  "MaxGroupsAllowed": 20,
  "EventDate": "2024-12-01",
  "EventTime": "10:00 AM"
}
```

## 5. Group
**Endpoint:** `/api/groups`

```json
{
  "GroupName": "The Coders",
  "EventID": "YOUR_EVENT_ID_HERE",
  "CreatedBy": "YOUR_USER_ID_HERE"
}
```

## 6. Participant
**Endpoint:** `/api/participants`

```json
{
  "Name": "Jane Smith",
  "EnrollmentNum": "EN123456",
  "InstituteName": "Tech University",
  "City": "New York",
  "Phone": "9876543210",
  "Email": "jane.smith@example.com",
  "IsGroupLeader": true,
  "GroupID": "YOUR_GROUP_ID_HERE"
}
```

## 7. Winner
**Endpoint:** `/api/winners`

```json
{
  "EventID": "YOUR_EVENT_ID_HERE",
  "GroupID": "YOUR_GROUP_ID_HERE",
  "Sequence": 1,
  "DeclaredBy": "YOUR_USER_ID_HERE",
  "Prize": "Gold Medal + $1000"
}
```
