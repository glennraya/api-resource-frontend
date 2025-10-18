# Laravel API + React Frontend

This is a React frontend application built with Vite that connects to a Laravel 12 API backend using Laravel Sanctum for authentication.

## Features

- 🔐 User authentication (login/register) with Laravel Sanctum
- 🛡️ Protected routes with automatic token refresh
- 🎨 Modern UI with Tailwind CSS
- 🚀 Fast development with Vite
- 📱 Responsive design
- 🔄 Automatic API error handling
- 💾 Persistent authentication state

## Prerequisites

Make sure you have the following running:

1. **Laravel API Backend** (should be running on `http://localhost:8000`)
    - Laravel 12 with Sanctum configured
    - CORS properly configured for `http://localhost:5173`
    - Database migrations run

2. **Node.js** (version 16 or higher)

## Installation

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Start the development server:**

    ```bash
    npm run dev
    ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard page
│   ├── Login.jsx        # Login form
│   ├── Register.jsx     # Registration form
│   └── ProtectedRoute.jsx # Route protection wrapper
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state management
├── services/            # API services
│   └── api.js          # Axios configuration and API methods
├── App.jsx             # Main app component with routing
├── main.jsx            # App entry point
└── index.css           # Tailwind CSS imports
```

## API Integration

The app connects to your Laravel API with the following configuration:

- **Base URL:** `http://localhost:8000`
- **Authentication:** Bearer token (Laravel Sanctum)
- **CORS:** Configured for `http://localhost:5173`
- **Proxy:** Vite proxy forwards `/api` and `/sanctum` requests to Laravel

### Available API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/user` - Get current user (protected)
- `POST /api/logout` - Logout current session (protected)
- `POST /api/logout-all` - Logout all sessions (protected)

## Authentication Flow

1. **Registration/Login:** User submits credentials
2. **CSRF Cookie:** App gets CSRF cookie from `/sanctum/csrf-cookie`
3. **API Call:** Credentials sent to Laravel API
4. **Token Storage:** JWT token stored in localStorage
5. **Automatic Headers:** Token automatically added to all API requests
6. **Route Protection:** Protected routes redirect to login if not authenticated

## Development

### Running Both Servers

1. **Start Laravel API:**

    ```bash
    # In your Laravel project directory
    php artisan serve
    ```

2. **Start React Frontend:**
    ```bash
    # In this directory
    npm run dev
    ```

### Environment Configuration

The app is configured to work with:

- Laravel API: `http://localhost:8000`
- React Frontend: `http://localhost:5173`

If you need to change these URLs, update:

- `vite.config.js` (proxy configuration)
- `src/services/api.js` (base URL)
- Laravel `config/cors.php` (allowed origins)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Troubleshooting

### CORS Issues

- Ensure Laravel's `config/cors.php` includes your frontend URL
- Check that `supports_credentials` is set to `true`

### Authentication Issues

- Verify Laravel Sanctum is properly configured
- Check that the API is running on the expected port
- Ensure database migrations have been run

### API Connection Issues

- Verify the Laravel API is accessible at `http://localhost:8000`
- Check browser network tab for failed requests
- Ensure Vite proxy is working (requests should show as coming from localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Laravel Sanctum** - API authentication
