# UDL - Universal Data Logger

A simple, fast API for logging arbitrary key/value pairs with timestamps. Built with Vue 3, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Simple Logging**: Store any key/value pair with automatic timestamping
- **User Authentication**: Secure user accounts with data isolation
- **Flexible Data**: Support for strings, numbers, JSON objects, and more
- **Real-time Interface**: Responsive web interface for managing logs
- **Fast Performance**: Sub-second response times for data operations

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel (ready for deployment)

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd udl
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database

In your Supabase SQL editor, run:

```sql
-- Create log_entries table
CREATE TABLE log_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_log_entries_user_id ON log_entries(user_id);
CREATE INDEX idx_log_entries_created_at ON log_entries(created_at DESC);
CREATE INDEX idx_log_entries_key ON log_entries(key);

-- Enable Row Level Security
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for user data isolation
CREATE POLICY "Users can only access their own logs" ON log_entries
  FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_log_entries_updated_at 
    BEFORE UPDATE ON log_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## Usage

### Web Interface

1. **Sign Up/Sign In**: Create an account or log in
2. **Add Entries**: Use the form to add key/value pairs
3. **View Logs**: See all your entries with timestamps
4. **Delete Entries**: Remove entries you no longer need

### Example Log Entries

- **Simple Text**: `key: "note"`, `value: "Remember to buy milk"`
- **Numbers**: `key: "temperature"`, `value: "23.5"`
- **JSON Objects**: `key: "sensor_data"`, `value: '{"temp": 23.5, "humidity": 60}'`
- **Arrays**: `key: "tags"`, `value: '["work", "important", "todo"]'`

## API Design

The application uses Supabase's built-in REST API with the following operations:

- **Create**: `POST` to log_entries table
- **Read**: `GET` from log_entries table with user filtering
- **Delete**: `DELETE` from log_entries table with user verification

All operations are secured with Row Level Security (RLS) policies.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
src/
├── components/          # Vue components
│   ├── AuthComponent.vue
│   └── LoggerInterface.vue
├── lib/                # Utilities and configurations
│   └── supabase.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.vue             # Main application component
├── main.ts             # Application entry point
└── style.css           # Global styles with Tailwind
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The application is configured for automatic deployment on push to main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
