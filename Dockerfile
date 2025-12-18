FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server/ ./server/
COPY shared/ ./shared/
COPY script/ ./script/

# Build the application
RUN npm run build

# Expose port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]