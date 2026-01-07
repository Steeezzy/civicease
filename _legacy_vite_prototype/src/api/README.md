# API Integration Structure

This directory is prepared for future backend integration.

## Planned API Endpoints

### Citizens API
- `GET /api/citizens` - Fetch all citizens
- `GET /api/citizens/:id` - Fetch citizen by ID
- `POST /api/citizens` - Create new citizen
- `PUT /api/citizens/:id` - Update citizen
- `DELETE /api/citizens/:id` - Delete citizen

### Families API
- `GET /api/families` - Fetch all families
- `GET /api/families/:id` - Fetch family by ID
- `POST /api/families` - Create new family
- `PUT /api/families/:id` - Update family
- `DELETE /api/families/:id` - Delete family

### Services API
- `GET /api/services` - Fetch all services
- `GET /api/services/:id` - Fetch service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Reports API
- `GET /api/reports/analytics` - Fetch analytics data
- `GET /api/reports/export` - Export reports

## Backend Options

### Option 1: Node.js + Express
```bash
npm install express cors body-parser
```

### Option 2: Django + Django REST Framework
```bash
pip install django djangorestframework
```

## Future Integration Steps
1. Set up backend server (Node.js or Django)
2. Configure CORS for frontend-backend communication
3. Replace mock data in frontend with actual API calls
4. Implement authentication using JWT tokens
5. Add database (PostgreSQL/MySQL/MongoDB)
