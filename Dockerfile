# Step 1: Download a lightweight Node.js operating system environment
FROM node:20-alpine

# Step 2: Create a workspace folder inside that virtual environment
WORKDIR /usr/src/app

# Step 3: Copy over your package dependencies configuration file
COPY package*.json ./

# Step 4: Install only production dependencies cleanly
RUN npm ci --only=production

# Step 5: Copy your actual server.js code into the workspace
COPY . .

# Step 6: Inform Docker that the application listens on Port 3000
EXPOSE 3000

# Step 7: Define the execution command to launch your dashboard automatically
CMD [ "npm", "start" ]