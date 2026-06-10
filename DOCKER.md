# Docker Setup

Run the Family Quiz application using Docker for easy deployment and consistent environments.

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### Development Mode (with hot reload)

```bash
# Start development server
docker-compose up dev

# Access the app at http://localhost:5173
```

Features:
- ✅ Hot reload on code changes
- ✅ Volume mounted source code
- ✅ Vite dev server
- ✅ Live updates

### Production Mode

```bash
# Build and start production server
docker-compose --profile production up prod

# Access the app at http://localhost:8080
```

Features:
- ✅ Optimized production build
- ✅ Nginx web server
- ✅ Smaller image size
- ✅ Better performance

## Commands

### Development

```bash
# Start in background
docker-compose up -d dev

# View logs
docker-compose logs -f dev

# Stop
docker-compose down

# Rebuild after dependency changes
docker-compose up --build dev
```

### Production

```bash
# Build production image
docker-compose --profile production build prod

# Start production server
docker-compose --profile production up prod

# Run in background
docker-compose --profile production up -d prod
```

## Docker Compose Services

### `dev` (Default)
- **Port**: 5173
- **Hot Reload**: Yes
- **Use Case**: Development, testing
- **Build Time**: ~1-2 minutes
- **Image Size**: ~400MB

### `prod` (Production Profile)
- **Port**: 8080
- **Hot Reload**: No
- **Use Case**: Production deployment
- **Build Time**: ~2-3 minutes
- **Image Size**: ~25MB (optimized)

## Volume Mounts

Development mode mounts:
- `./vue-app/src` → `/app/src` (source code)
- `./vue-app/public` → `/app/public` (static assets)
- `./images` → `/app/public/images` (quiz photos)
- `/app/node_modules` (protected, not overwritten)

## Environment Variables

Create `.env` file in vue-app/ for custom configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Family Quiz
```

## Troubleshooting

### Port already in use

Change port in `docker-compose.yml`:

```yaml
ports:
  - "3000:5173"  # Use port 3000 instead of 5173
```

### Changes not reflecting

1. Ensure volumes are mounted correctly
2. Restart the container: `docker-compose restart dev`
3. Rebuild if needed: `docker-compose up --build dev`

### node_modules issues

```bash
# Remove container and volumes
docker-compose down -v

# Rebuild
docker-compose up --build dev
```

### Permission issues (Linux/Mac)

```bash
# Fix ownership
sudo chown -R $USER:$USER vue-app/node_modules
```

## Multi-stage Build

The production Dockerfile uses multi-stage build:

1. **Builder stage**: Installs dependencies and builds Vue app
2. **Production stage**: Serves built files with Nginx

This results in a tiny final image (~25MB vs ~400MB).

## Custom Nginx Config

Create `nginx.conf` in vue-app/:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Uncomment the COPY line in Dockerfile to use it.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker image
        run: docker-compose --profile production build prod

      - name: Run tests
        run: docker-compose up -d dev && docker-compose exec dev yarn test:e2e
```

## Production Deployment

### Docker Hub

```bash
# Tag image
docker tag family-quiz-vue:latest username/family-quiz:latest

# Push to Docker Hub
docker push username/family-quiz:latest

# Pull and run on server
docker pull username/family-quiz:latest
docker run -d -p 80:80 username/family-quiz:latest
```

### Cloud Platforms

- **AWS ECS**: Use task definitions with the prod image
- **Google Cloud Run**: Deploy container directly
- **Azure Container Instances**: Deploy from Docker Hub
- **DigitalOcean App Platform**: Connect to GitHub repo

## Performance Tips

1. **Use .dockerignore**: Exclude unnecessary files from build context
2. **Layer caching**: Change package.json only when adding dependencies
3. **Multi-stage builds**: Keep production images small
4. **Nginx tuning**: Configure gzip, caching headers
5. **CDN**: Serve static assets from CDN in production

## Security

1. Don't expose sensitive env vars in docker-compose.yml
2. Use secrets for production credentials
3. Run as non-root user (add to Dockerfile if needed)
4. Scan images for vulnerabilities: `docker scan family-quiz-vue:latest`

## Monitoring

```bash
# View resource usage
docker stats

# View logs
docker-compose logs -f dev

# Enter container
docker-compose exec dev sh
```

---

**Made with Docker for easy deployment! 🐳**
