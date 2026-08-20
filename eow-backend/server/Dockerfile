# Stage 1: Build the application with full development tools
FROM node:18-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake libpng-dev vips-dev git

WORKDIR /opt/
COPY package.json package-lock.json ./
# ⭐ FIX 1: Install ALL dependencies (including TypeScript devDependencies) to enable full compilation
RUN npm ci

WORKDIR /opt/app
COPY . .
# ⭐ FIX 2: Explicitly set production environment variable right before generating your deployment artifacts
ENV NODE_ENV=production
RUN npm run build

# ⭐ FIX 3: Clean up and prune development dependencies out of the build stage node_modules folder before copying
WORKDIR /opt/
RUN npm prune --production

# =========================================================================

# Stage 2: Clean, secure runtime environment
FROM node:18-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production

WORKDIR /opt/
# Copy the cleanly pruned production dependencies from the build stage
COPY --from=build /opt/node_modules ./node_modules
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
# Copy the compiled application source code (/dist distribution folder) into production
COPY --from=build /opt/app ./

EXPOSE 1337
CMD ["npm", "run", "start"]
