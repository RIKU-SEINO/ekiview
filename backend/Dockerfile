FROM node:22-slim

WORKDIR /app

COPY package.json ./

RUN npm install --production=false

COPY . .

ENV NODE_ENV=production

RUN bash -c npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all

CMD ["bash", "-c", "npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm start"]
