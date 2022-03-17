This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Running application

- clone repository
- ```cd <dir-of-cloned-repo>```
- ```npm install```
- ```docker-compose up``` (creates docker container running db)
- ```npx prisma db push``` (initiate tables in postgres)
- ```npx prisma db seed``` (seed initial data: categories, admin user, item)
- ```npm run dev``` (run project)

When updating GraphQL/DB models, synch them by running
- ```npm run generate```

### Registering user
When registering new user. To conenct to auth0 action that links auth0 created user with custom db table (Users), we need to expose localhost with ngrok and paste the forwarding address to the action in Auth0 actions.
npx ngrok
copy forwarding address
paste in auth0 actions
deploy action

## Screenshots
![Landing page](/public/screenshots/Screenshot%202022-03-17%20at%2012.17.55.png)
![Landing page categories](/public/screenshots/Screenshot%202022-03-17%20at%2012.17.58.png)
![Search results](/public/screenshots/Screenshot%202022-03-17%20at%2012.18.06.png)