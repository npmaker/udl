# Technical Context

## Technology Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Static type checking for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Vite**: Fast build tool and development server

### Backend
- **Vercel**: Serverless hosting platform with edge functions
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **Node.js**: Runtime for serverless functions

### Development Tools
- **Cline**: AI-assisted development
- **GitHub**: Version control and collaboration
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

## Development Setup

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git
```

### Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vercel Configuration (for deployment)
VERCEL_TOKEN=your_vercel_token
```

### Project Structure
```
/
├── src/
│   ├── components/     # Vue components
│   ├── composables/    # Vue composition functions
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── main.ts         # Application entry point
├── api/                # Vercel serverless functions
├── public/             # Static assets
├── memory-bank/        # Project documentation
└── package.json        # Dependencies and scripts
```

## Technical Constraints

### Performance Requirements
- **API Response Time**: < 200ms for data operations
- **Frontend Load Time**: < 2 seconds initial load
- **Database Query Time**: < 100ms for simple operations

### Scalability Considerations
- **Concurrent Users**: Design for 1000+ concurrent users
- **Data Volume**: Handle millions of log entries per user
- **Request Rate**: Support high-frequency logging (multiple requests per second)

### Security Requirements
- **Authentication**: JWT-based with Supabase Auth
- **Data Isolation**: Row Level Security (RLS) in PostgreSQL
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Prevent abuse and DoS attacks

## Dependencies

### Frontend Dependencies
```json
{
  "vue": "^3.3.0",
  "@supabase/supabase-js": "^2.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "vite": "^4.4.0"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "eslint": "^8.45.0",
  "prettier": "^3.0.0"
}
```

## Database Schema

### Supabase Tables
```sql
-- Users table (managed by Supabase Auth)
-- auth.users

-- Log entries table
CREATE TABLE log_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_log_entries_user_id ON log_entries(user_id);
CREATE INDEX idx_log_entries_created_at ON log_entries(created_at DESC);
CREATE INDEX idx_log_entries_key ON log_entries(key);

-- Row Level Security
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own logs" ON log_entries
  FOR ALL USING (auth.uid() = user_id);
```

## API Design

### Request/Response Format
```typescript
// Request format for creating logs
interface CreateLogRequest {
  key: string;
  value: any; // JSON serializable
}

// Response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Log entry type
interface LogEntry {
  id: string;
  user_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}
```

## Tool Usage Patterns

### Development Workflow
1. **Local Development**: Use Vite dev server for frontend
2. **API Testing**: Use Vercel CLI for local serverless function testing
3. **Database Management**: Supabase dashboard for schema changes
4. **Deployment**: Automatic deployment via Vercel GitHub integration

### Testing Strategy
- **Unit Tests**: Jest for utility functions
- **Component Tests**: Vue Test Utils for component testing
- **API Tests**: Supertest for endpoint testing
- **E2E Tests**: Playwright for full user flow testing

## Configuration Management

### Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2020'
  },
  server: {
    port: 3000
  }
})
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  }
}
```

## Deployment Pipeline

### Vercel Deployment
- **Automatic**: Push to main branch triggers deployment
- **Preview**: Pull requests get preview deployments
- **Environment**: Production and preview environments
- **Functions**: Serverless functions deployed automatically

### Environment Management
- **Development**: Local environment with Supabase local setup
- **Staging**: Preview deployments for testing
- **Production**: Main branch deployment with production Supabase
