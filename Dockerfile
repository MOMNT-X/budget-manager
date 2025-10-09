# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Copy package files from build stage
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm install --production

# Expose port 10000
ENV PORT=10000
EXPOSE 10000

# Start the application
CMD ["npm", "start"]