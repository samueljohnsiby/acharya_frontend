### STAGE 1: Build ###
FROM node:12.7-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy only the package files first, to take advantage of Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine

# Remove default Nginx config and copy a custom Nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the Angular app from the build stage to the Nginx directory
COPY --from=build /usr/src/app/dist/aston-villa-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
