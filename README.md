** CRM API light **

- The database used is mongoDB.
- Env variables are inside a file "config.env" inside config folder , you need to put :
  NODE_ENV = development
  PORT = 5000
  MONGO_URI = your own information -> the url generated by mongo for your application, it contain your username+password+info of your db

  ** How to use this API **

  1- make npm i -> to install all the dependencies ("express","mongoose","morgan","casual: dependencie to make a fake data", "slugify: to cretae a slug from a title","nodemon")

  2- run this commande: node seeder -i, i create a script , it importe all the json file from data folder into database, so you will have (pages+navigationMenu+users)
