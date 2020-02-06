import express from 'express';
import cors from 'cors';
import open from 'open';
//import SERVER from './graphql/schema';

const APP = express();

APP.use(cors());

// SERVER.applyMiddleware({
//   app: APP,
// });

const PORT = 4000 || process.env;

APP.listen(PORT, () => {
  console.log(`The serve has started on port: ${PORT}`);
  console.log(`http://localhost:${PORT}/graphql`);
});

open(`http://localhost:${PORT}/graphql`);

export default APP;