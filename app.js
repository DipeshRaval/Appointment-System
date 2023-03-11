/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Appointment, User } = require("./models");
const cookieParser = require("cookie-parser");
const csrf = require("tiny-csrf");
const bodyParser = require("body-parser");
const path = require("path");
const { res } = require("express");

//flash
const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

//passport js for aurthentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const saltRound = 10;

app.use(
  session({
    secret: "my-secret-ket-232423234234234234",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// creating passport stretargy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      })
        .then(async (user) => {
          // console.log(user.email);
          if (user) {
            const bool = await bcrypt.compare(password, user.password);
            if (bool) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Invalid password",
              });
            }
          } else {
            return done(null, false, {
              message: "With This email user doesn't exists",
            });
          }
        })
        .catch((error) => {
          return done(error);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serialize the user with Id : ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
// app.use(express.static("public"));

// for csrf token
// app.use(cookieParser("shh! some secret string"));
app.use(cookieParser("Important string"));
app.use(csrf("123456789iamasecret987654321look", ["POST", "PUT", "DELETE"]));

// for the flash
app.use(function (req, res, next) {
  const data = req.flash();
  res.locals.messages = data;
  next();
});

//End-POints
app.get("/", async (req, res) => {
  if (req.session.passport) {
    res.redirect("/appointments");
  } else {
    res.render("index", {
      title: "Drvl - Appointment Managment System",
      csrfToken: req.csrfToken(),
    });
  }
});

app.get(
  "/appointments",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    // const loginUserId = req.user.id;
    console.log(req.user);
    console.log(req.user.id);
    console.log(req.user.firstName);
    const allAppointment = await Appointment.getAppointments(req.user.id);

    if (req.accepts("html")) {
      res.render("appointments", {
        allAppointment,
        title: "Your Appointments",
        user: req.user.firstName,
        csrfToken: req.csrfToken(),
      });
    } else {
      res.json({
        title: "Your Appointments",
        allAppointment,
        user: req.user.firstName,
      });
    }
  }
);

app.post(
  "/appointments",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log("Body : ", req.body);
    console.log(req.user);
    if (req.body.startTime.length == 0 || req.body.endTime.length == 0) {
      req.flash("error", "Time can not be empty!!");
      return res.redirect("/appointments");
    }
    if (req.body.startTime > req.body.endTime) {
      req.flash("error", "provide a valid Time for appointment");
      return res.redirect("/appointments");
    }

    try {
      const name = req.body.appointmentName;
      console.log(name.trim().length);

      const existAppointment = await Appointment.findOne({
        where: {
          dueDate: req.body.dueDate,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          userId: req.user.id,
        },
      });

      if (existAppointment) {
        req.flash("error", "This time slot is aleready booked...");
        return res.redirect(`/modifyListAppintment/${existAppointment.id}`);
      }

      await Appointment.addAppointment({
        name: name.trim(),
        dueDate: req.body.dueDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        userId: req.user.id,
      });
      return res.redirect("/appointments");
    } catch (error) {
      console.log(error);
      console.log(error.name);
      if (error.name == "SequelizeValidationError") {
        error.errors.forEach((e) => {
          if (e.message == "Appointment name length must greater than 5") {
            req.flash(
              "error",
              "Appointment name length greater than or equal to 5"
            );
          }
          if (e.message == "Please enter a valid date") {
            req.flash("error", "Please enter a valid date");
          }
        });
        return res.redirect("/appointments");
      } else {
        return res.status(422).json(error);
      }
    }
  }
);

app.post(
  "/modify/appointment/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    if (req.body.appointmentName.trim().length < 5) {
      req.flash("error", "Appointment name length greater than or equal to 5");
      return res.redirect("/appointments");
    }
    console.log(req.body);
    console.log("Appointment Update with ID : ", req.params.id);
    try {
      await Appointment.updateAppointment(
        req.params.id,
        req.body.appointmentName,
        req.user.id
      );
      req.flash("success", "Updated successfully!!!");
      return res.redirect("/appointments");
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

app.delete(
  "/appointment/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log("We have to delete a Appointment with ID: ", req.params.id);
    try {
      const affectedRow = await Appointment.delAppointment(
        req.params.id,
        req.user.id
      );

      res.send(affectedRow ? true : false);
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

app.get(
  "/modifyListAppintment/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const existAppointment = await Appointment.findAppointment(
        req.params.id,
        req.user.id
      );

      if (req.accepts("html")) {
        res.render("updateAppointments", {
          appointment: existAppointment,
          csrfToken: req.csrfToken(),
        });
      } else {
        res.json({
          appointment: existAppointment,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

app.post(
  "/appointment/:id/add/delete",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      if (req.body.appointmentName.trim().length < 5) {
        req.flash(
          "error",
          "Appointment name length greater than or equal to 5"
        );
        return res.redirect(`/modifyListAppintment/${req.params.id}`);
      }
      await Appointment.delAppointment(req.params.id, req.user.id);

      await Appointment.addAppointment({
        name: req.body.appointmentName.trim(),
        dueDate: req.body.dueDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        userId: req.user.id,
      });
      req.flash(
        "success",
        "Existing appointment deleted and new appointment added succesfully!!"
      );
      return res.redirect("/appointments");
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

// login routes
app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "signUp",
    csrfToken: req.csrfToken(),
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "login",
    csrfToken: req.csrfToken(),
  });
});

app.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Log out successfully!!!");
    res.redirect("/");
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log(req.user);
    req.flash("success", "Log In successfully!!!");
    res.redirect("/appointments");
  }
);

app.post("/users", async (req, res) => {
  console.log("Body : ", req.body.firstName);
  const pwd = await bcrypt.hash(req.body.password, saltRound);
  if (req.body.password.length === 0) {
    req.flash("error", "password can't be empty!!");
    return res.redirect("/signup");
  }
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: pwd,
    });
    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
      }
      req.flash("success", "Sign Up successfully!!!");
      return res.redirect("/appointments");
    });
  } catch (error) {
    console.log(error);
    console.log(error.name);
    if (error.name == "SequelizeValidationError") {
      error.errors.forEach((e) => {
        if (e.message == "Please provide a firstName") {
          req.flash("error", "Please provide a firstName");
        }
        if (e.message == "Please provide email_id") {
          req.flash("error", "Please provide email_id");
        }
      });
      return res.redirect("/signup");
    } else if (error.name == "SequelizeUniqueConstraintError") {
      error.errors.forEach((e) => {
        if (e.message == "email must be unique") {
          req.flash("error", "User with this email already exists");
        }
      });
      return res.redirect("/signup");
    } else {
      return res.status(422).json(error);
    }
  }
});

module.exports = app;
