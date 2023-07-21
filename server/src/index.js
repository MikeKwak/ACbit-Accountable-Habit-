import { config } from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';
import cookieParser from 'cookie-parser'

config();

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected');
  })
  .catch((e) => {
    console.error(e);
  });

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

app.use(cookieParser())
app.use(jwtMiddleware)

router.use('/api', api);

app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
