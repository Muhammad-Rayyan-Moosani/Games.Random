# 🐳 Docker Deployment Guide

This application is fully containerized with Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop/)
- Your `.env` file configured with API keys

## Quick Start

### 1. Using Docker Compose (Recommended)

Start the entire application with MongoDB:

```bash
docker-compose up -d
```

This will:
- ✅ Start MongoDB database
- ✅ Build and start the Games.Random app
- ✅ Set up networking between containers
- ✅ Create persistent volumes for MongoDB data

Access the app at: http://localhost:3000

### 2. Stop the application

```bash
docker-compose down
```

### 3. Stop and remove all data

```bash
docker-compose down -v
```

---

## Manual Docker Commands

### Build the Docker image

```bash
docker build -t games-random .
```

### Run the container

```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name games-random-app \
  games-random
```

### View logs

```bash
# With docker-compose
docker-compose logs -f app

# With docker
docker logs -f games-random-app
```

### Stop the container

```bash
# With docker-compose
docker-compose stop

# With docker
docker stop games-random-app
```

---

## Environment Variables

Make sure your `.env` file contains:

```env
ANTHROPIC_API_KEY=your-key-here
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-secret
MONGODB_URI=mongodb://mongodb:27017/games-random
PORT=3000
```

---

## Production Deployment

### Using Docker Compose

1. Copy `.env.example` to `.env` and fill in production values
2. Update Google OAuth redirect URIs to match your domain
3. Deploy:

```bash
docker-compose -f docker-compose.yml up -d
```

### Using Docker only

```bash
docker build -t games-random:latest .
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  --name games-random-app \
  games-random:latest
```

---

## Troubleshooting

### Check if containers are running

```bash
docker-compose ps
```

### View application logs

```bash
docker-compose logs -f app
```

### View MongoDB logs

```bash
docker-compose logs -f mongodb
```

### Restart the application

```bash
docker-compose restart app
```

### Rebuild after code changes

```bash
docker-compose up -d --build
```

---

## Health Checks

The application includes health checks:

- **App**: Checks `/api` endpoint every 30 seconds
- **MongoDB**: Checks database connectivity every 10 seconds

View health status:

```bash
docker-compose ps
```

---

## Volumes

MongoDB data is persisted in Docker volumes:

- `mongodb_data`: Database files
- `mongodb_config`: Configuration files

View volumes:

```bash
docker volume ls | grep games-random
```

---

## Network

Containers communicate via the `games-network` bridge network.

View network:

```bash
docker network ls | grep games
```

---

## Security Notes

- ✅ `.env` file is excluded from Docker image
- ✅ Environment variables passed at runtime
- ✅ MongoDB data persisted in volumes
- ✅ Health checks monitor service health
- ✅ Automatic restart on failure

---

## Advanced Usage

### Scale the application (multiple instances)

```bash
docker-compose up -d --scale app=3
```

### Use external MongoDB

Update `.env`:

```env
MONGODB_URI=mongodb://your-mongo-host:27017/games-random
```

Then remove MongoDB from docker-compose:

```bash
docker-compose up -d app
```

---

## Performance Tips

1. **Use BuildKit for faster builds:**
   ```bash
   DOCKER_BUILDKIT=1 docker build -t games-random .
   ```

2. **Limit container resources:**
   ```yaml
   # In docker-compose.yml under 'app' service:
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

3. **Use multi-stage builds** (already optimized in Dockerfile)

---

## Support

For issues, check:
1. Container logs: `docker-compose logs -f`
2. Container status: `docker-compose ps`
3. Environment variables: `docker-compose config`
