# System Patterns

## Architecture Overview

```
Frontend (Vue.js) ↔ API Layer ↔ Supabase (PostgreSQL)
     ↓                ↓              ↓
  Tailwind CSS    REST Endpoints   Auth & Storage
```

## Core System Design

### API Architecture
- **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Stateless**: Each request contains all necessary information
- **JSON Communication**: All requests/responses use JSON format
- **Authentication**: JWT-based user authentication via Supabase

### Data Model
```
User
├── id (UUID)
├── email
├── created_at
└── LogEntries[]

LogEntry
├── id (UUID)
├── user_id (FK)
├── key (string)
├── value (JSON)
├── created_at (timestamp)
└── updated_at (timestamp)
```

## Key Technical Decisions

### Frontend Patterns
- **Composition API**: Vue 3 Composition API for better TypeScript integration
- **Component Structure**: Single File Components (.vue)
- **State Management**: Pinia for global state (if needed)
- **Styling**: Tailwind CSS utility-first approach

### Backend Patterns
- **Serverless Functions**: Vercel Edge Functions for API endpoints
- **Database Access**: Supabase client for database operations
- **Authentication Flow**: Supabase Auth for user management
- **Error Handling**: Consistent error response format

### Security Patterns
- **Row Level Security**: Supabase RLS to isolate user data
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Proper cross-origin resource sharing

## Component Relationships

### Frontend Components
```
App.vue
├── AuthComponent.vue (login/signup)
├── LoggerInterface.vue (main logging UI)
│   ├── LogForm.vue (input form)
│   └── LogList.vue (display entries)
└── ApiService.ts (API communication)
```

### API Endpoints
```
/api/auth
├── POST /login
├── POST /signup
└── POST /logout

/api/logs
├── GET / (list user's logs)
├── POST / (create new log)
├── PUT /:id (update log)
└── DELETE /:id (delete log)
```

## Critical Implementation Paths

### Authentication Flow
1. User submits credentials
2. Supabase validates and returns JWT
3. Frontend stores token
4. All API requests include Authorization header
5. Server validates token on each request

### Data Logging Flow
1. User inputs key/value pair
2. Frontend validates input
3. POST request to /api/logs
4. Server validates authentication
5. Server validates and sanitizes data
6. Insert into database with timestamp
7. Return success response

### Data Retrieval Flow
1. Frontend requests user's logs
2. GET request to /api/logs with auth
3. Server validates authentication
4. Query database with user filter
5. Return paginated results

## Performance Considerations

- **Database Indexing**: Index on user_id and created_at
- **Pagination**: Limit results to prevent large payloads
- **Caching**: Consider Redis for frequently accessed data
- **Connection Pooling**: Supabase handles connection management

## Error Handling Strategy

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## Development Patterns

- **TypeScript First**: Strong typing throughout
- **Environment Variables**: Separate configs for dev/prod
- **Testing Strategy**: Unit tests for utilities, integration tests for API
- **Code Organization**: Feature-based folder structure
