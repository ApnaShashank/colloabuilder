# Base image
FROM node:20-alpine

# Install Docker CLI
RUN apk add --no-cache docker-cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript skipped for dynamic ts-node execution
# RUN npm run build

# Expose main port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
