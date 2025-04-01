FROM node:18-alpine

WORKDIR /
COPY . .

RUN npm install && npm run build && npm cache clean --force
EXPOSE 4173
CMD ["npm", "run", "preview"]