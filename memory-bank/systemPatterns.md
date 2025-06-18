# System Patterns

## Architecture Overview

```
Frontend (Vue.js) ↔ Supabase Client ↔ Supabase (PostgreSQL)
     ↓                    ↓                ↓
  Tailwind CSS      Direct Integration   Auth & RLS
```

**Implemented Architecture**: Direct client-side integration with Supabase eliminates the need for a separate API layer, providing optimal performance and simplified development.

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

### Frontend Patterns ✅ Implemented
- **Composition API**: Vue 3 Composition API with full TypeScript integration and reactive state
- **Component Structure**: Single File Components with `<script setup>` syntax for optimal performance
- **State Management**: Vue 3 reactive state (no Pinia needed for this application scope)
- **Styling**: Tailwind CSS utility-first approach with responsive design patterns

### Backend Integration Patterns ✅ Implemented
- **Direct Client Integration**: Supabase client library for all database operations
- **Database Access**: Type-safe Supabase operations with automatic TypeScript inference
- **Authentication Flow**: Supabase Auth with automatic session management
- **Error Handling**: Comprehensive try-catch blocks with user-friendly error messages

### Security Patterns ✅ Implemented
- **Row Level Security**: Supabase RLS policies ensuring complete user data isolation
- **Client-side Validation**: Form validation with TypeScript type checking
- **Authentication State**: Automatic session management with auth state listeners
- **Data Sanitization**: JSON parsing with fallback to string values for flexible data handling

## Component Relationships

### Frontend Components ✅ Implemented
```
App.vue (main app with auth state management)
├── AuthComponent.vue (login/signup with Supabase Auth)
└── LoggerInterface.vue (comprehensive logging interface)
    ├── Form Section (create/edit entries)
    ├── Search Section (find entries by key)
    └── List Section (display with pagination)

lib/supabase.ts (Supabase client configuration)
types/index.ts (TypeScript type definitions)
```

### Supabase Operations ✅ Implemented
```
Authentication
├── supabase.auth.signUp() (user registration)
├── supabase.auth.signInWithPassword() (user login)
├── supabase.auth.signOut() (user logout)
└── supabase.auth.onAuthStateChange() (session management)

Database Operations
├── .from('log_entries').select() (read entries with pagination)
├── .from('log_entries').insert() (create new entries)
├── .from('log_entries').update() (modify existing entries)
├── .from('log_entries').delete() (remove entries)
└── .from('log_entries').ilike() (search entries by key)
```

## Critical Implementation Paths

### Authentication Flow ✅ Implemented
1. User submits credentials via AuthComponent
2. Supabase validates credentials and manages JWT automatically
3. Frontend receives user object and updates reactive state
4. Auth state listener maintains session across page refreshes
5. All database operations automatically include user context

### Data Logging Flow ✅ Implemented
1. User inputs key/value pair in LoggerInterface form
2. Frontend validates input and attempts JSON parsing with string fallback
3. Direct Supabase client insert operation with user_id automatically added
4. Database validates authentication via RLS policies
5. Automatic timestamping with created_at and updated_at
6. Real-time UI update with new entry added to reactive state
7. Success feedback displayed to user

### Data Retrieval Flow ✅ Implemented
1. Frontend requests user's logs via Supabase client
2. Database query with automatic user filtering via RLS
3. Pagination implemented with range() for optimal performance
4. Results displayed with formatting and interactive features
5. Search functionality with case-insensitive key matching
6. Click-to-edit functionality with form pre-population

### Advanced Features Flow ✅ Implemented
1. **Search**: User enters key, triggers ilike query, displays filtered results
2. **Edit**: User clicks entry, form pre-populates, smooth scroll to form
3. **Update**: Modified entry updates both main list and search results
4. **Delete**: Confirmation dialog, database deletion, UI state update

## Performance Considerations ✅ Implemented

- **Database Indexing**: Indexes on user_id, created_at, and key for optimal query performance
- **Pagination**: Configurable page size (20 entries) with "Load More" functionality
- **Efficient Queries**: Direct Supabase client eliminates API layer overhead
- **Connection Management**: Supabase handles connection pooling and optimization
- **Reactive Updates**: Vue 3 reactivity system ensures minimal DOM updates
- **Lazy Loading**: Entries loaded on demand with pagination
- **Search Optimization**: Case-insensitive search with database-level filtering

## Error Handling Strategy ✅ Implemented

```typescript
// Comprehensive error handling throughout application
try {
  const { data, error } = await supabase.operation()
  if (error) throw error
  // Handle success
} catch (err: any) {
  error.value = err.message || 'User-friendly fallback message'
}

// User feedback patterns
- Loading states during operations
- Success messages with auto-clear
- Error messages with clear descriptions
- Confirmation dialogs for destructive actions
- Graceful fallbacks for missing configuration
```

**Implemented Error Handling**:
- Try-catch blocks around all async operations
- User-friendly error messages displayed in UI
- Loading states prevent multiple simultaneous operations
- Confirmation dialogs for destructive actions (delete)
- Graceful handling of missing Supabase configuration
- TypeScript error typing for better development experience

## Development Patterns

- **TypeScript First**: Strong typing throughout
- **Environment Variables**: Separate configs for dev/prod
- **Testing Strategy**: Unit tests for utilities, integration tests for API
- **Code Organization**: Feature-based folder structure
