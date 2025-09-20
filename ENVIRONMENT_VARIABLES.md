# Frontend Environment Variables

## Local Development

Create a `.env` file in the frontend directory with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

## Production Deployment on Vercel

In your Vercel dashboard, add this environment variable:

- `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`

Replace `your-backend-domain.com` with your actual deployed backend URL.

## How it works

The frontend uses `import.meta.env.VITE_API_BASE_URL` to get the API base URL. If the environment variable is not set, it defaults to `http://localhost:8000/api` for local development.

The audio URLs returned by the backend will be constructed using the `BASE_URL` environment variable from the backend, ensuring they point to the correct domain in both development and production.
