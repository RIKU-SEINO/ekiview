FROM node:22-slim

WORKDIR /app

COPY package.json ./

RUN npm install --production=false

COPY . .

ENV NODE_ENV=production

RUN npm run build

# FROM nginx:alpine

# COPY --from=0 /app/dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]

CMD ["npm", "start"]
