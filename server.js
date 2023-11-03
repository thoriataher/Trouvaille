//  main file
// any thing not relate express write here
// 4) START SERVER

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
require('./db');
const app = require('./app');
// console.log(process.env.NODE_ENV );

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`listening on ${port} 👍👍`);
});
