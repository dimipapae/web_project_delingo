import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.mjs';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Handlebars setup
app.engine('hbs', engine({ extname: '.hbs',
  helpers: {
  json: (context) => JSON.stringify(context, null, 2),
  encode: (str) => encodeURIComponent(str)
},  defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') , partialsDir: 'views/partials'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: 'deliandgo_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 20* 60 * 1000  }// 20 λεπτά
  })
);

// Routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
