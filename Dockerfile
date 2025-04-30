# Use an official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR app/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the app source code to the container
COPY . .

# If the app requires a build (like for React, TypeScript, or Webpack), run the build script
RUN npm run build

# Expose the port on which the app runs
EXPOSE 3202

# Start the application
CMD ["npm", "start"]
