FROM node:20-alpine
RUN apk update && apk upgrade 

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001
RUN npm install -g nodemon
# Start the application
CMD ["npm", "run", "dev"]