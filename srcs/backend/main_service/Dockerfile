FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g ts-node typescript
# Copy source code
COPY . .
RUN npm install -g nodemon
# Expose port
EXPOSE 3000
# Start the application
# Instead of RUN npm run seed at build time...
CMD ["sh", "-c", " npm run seed && npm run dev"]