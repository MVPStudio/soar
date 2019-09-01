FROM mvpstudio/node:v10

USER mvp
WORKDIR /home/mvp/app

# move package to correct location
COPY ./frontend/build ./public
COPY ./backend ./backend

EXPOSE 3000
ENTRYPOINT ["node", "./backend/app.js"]
