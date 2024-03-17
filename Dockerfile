# FROM node:20
# WORKDIR /app
# COPY package.json .
# RUN npm install 
# COPY . .

# EXPOSE 3000

# USER node
# CMD npm start
# Install dependencies only when needed
# FROM node:18-alpine3.15

# # Set working directory
# RUN mkdir -p /var/www/loanApi
# WORKDIR /var/www/loanApi

# # Copiar el directorio y su contenido
# COPY . ./var/www/loanApi
# COPY package.json  /var/www/loanApi/
# RUN yarn install 



# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password loanuser
# RUN chown -R loanuser:loanuser /var/www/loanApi
# USER loanuser

# # Limpiar el caché
# RUN yarn cache clean --force

# EXPOSE 3000

# CMD [ "yarn","start" ]

# Use the official Node.js 18 Alpine image
FROM node:18-alpine3.15 AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy the application code
COPY . .

# Expose the port the app runs on
# EXPOSE 3000

# Start the application
CMD ["yarn", "start"]