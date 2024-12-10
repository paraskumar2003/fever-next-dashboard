# Base image
FROM node:18.20.4

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3312

# Build the application (if using Next.js)
RUN npm run build

# Start the application
CMD ["npm", "start"]