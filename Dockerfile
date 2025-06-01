# Stage 1: Builder
FROM node:22 AS builder

WORKDIR /app

# Copy and install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and env
COPY . .
COPY .env.prd .env

# Build — environment variables will be embedded into the app
RUN npm run build

# Stage 2: Distroless runtime
FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app

# Copy standalone server and all required files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set env vars and expose port
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# Run the built-in Next.js server
CMD ["server.js"]
