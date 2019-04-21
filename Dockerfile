FROM mvpstudio/node:v10

USER mvp
WORKDIR /home/mvp/app

# move package to correct location
COPY . ./

EXPOSE 3000
ENTRYPOINT ["node", "./src/node/app.js"]