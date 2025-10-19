FROM node:18-alpine
WORKDIR /usr/src/app
COPY FrontEnd/ /usr/src/app/
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
