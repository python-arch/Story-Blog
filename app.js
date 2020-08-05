const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
// loading config

dotenv.config({ path: "./config/config.env" });

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

const PORT = process.env.PORT;

// Passport config
require("./config/passport")(passport);

connectDB();

// logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// handlebars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// template engine
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global var
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

//  serve static folders
app.use(express.static(path.join(__dirname, "public")));

// setup our routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
      .yellow
  )
);
