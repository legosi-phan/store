/**
 * 
 */
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const path = require('path');
const _ = require('lodash');
global._ = _;

/**
 * 
 */
delete process.env.NODE_ENV;
dotenv.config();
global.appDir = path.resolve(__dirname, '../');
/**
 * 
 */
const { 
  user,
  product,
} = require('./routes');
const appConfig = require('./configs');
global.appConfig = appConfig;
const { auth } = require('./middlewares');
const exphbs = require('express-handlebars');

const apiLimiter = rateLimit(appConfig.apiLimiter);

const app = express();
app.engine('hbs', exphbs({
  layoutsDir: path.join(__dirname, '..', '/views/_layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, '..', '/views/_partials'),
  extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(auth);
app.use(apiLimiter);

app.get('/', (req, res) => {
  return res.render('home');
})
app.use('/user', user);
app.use('/product', product);

// import resolvers from './graphql/resolvers';
// import typeDefs from './graphql/typeDefs';
// const apolloServer: ApolloServer = new ApolloServer({
//   resolvers,
//   typeDefs,
//   context: ctx => ctx,
//   formatError: grapqlFormatError
// })
// apolloServer.applyMiddleware({app, cors: false, path: '/graphql'});

/**
 * 
 */
const { SetupModel } = require('./models');
const init = require('./init');
const PORT = _.toNumber(process.env.PORT) || 3000;
const MONGODB_URI = _.toString(process.env.MONGODB_URI);

SetupModel(MONGODB_URI).then(async () => {
  // init something
  await init();

  // turn server on
  const server = app.listen(PORT, (err) => {
    if (err) {
      console.log(colors.red('❌ Start server failed: ' + _.toString(err)));
      process.exit(1);
    }
    console.log(colors.cyan(`🚀 Server on. PORT: ${PORT}`));
  });
}).catch(err => {
  console.log(colors.red('❌ Setup mongodb failed: ' + _.toString(err)));
  process.exit(1);
})

