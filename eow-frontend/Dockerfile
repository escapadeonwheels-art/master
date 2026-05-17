#build: docker build -t expo-web-app .
#run: docker run -p 8080:80 expo-web-app

# Stage 1: Build the static web app
FROM node:20-alpine AS build-env

WORKDIR /app

# Copy source code and build the web app
COPY ./app/ .
# Install dependencies first (for better caching)
RUN npm install


RUN npx expo export --platform web

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the template instead of a static config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from builder stage to Nginx web root
COPY --from=build-env /app/dist /usr/share/nginx/html

ENV PORT 8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
