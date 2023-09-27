FROM node:14

# Create app directory
WORKDIR /app

COPY . .

RUN npm install -g pm2

RUN npm install

# Development
CMD ["npm", "run", "dev"]

# Production
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]