# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set timezone for logs
ENV TZ=Asia/Kathmandu

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Healthcheck
# HEALTHCHECK CMD curl --silent --fail http://localhost:8080/ | jq -e '.status == true' || exit 1

# ENTRYPOINT [ "executable" ]


# Command to run the application with nodemon
CMD ["npm", "start"]

