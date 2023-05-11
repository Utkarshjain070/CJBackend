const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const PORT = process.env.PORT || 8080;
const mongoUrl =
  "mongodb+srv://Utkarsh_2002:REyA3tN*EdKx*Zh@cluster0.ptpvesm.mongodb.net/?retryWrites=true&w=majority";
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
require("./userdetails.js");
const user = mongoose.model("userInfo");



app.use(cors());

app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))


app.use(passport.initialize()) 
app.use(passport.session()) 

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "395163140620-1h5643kfn6t15gv2dab8h3gtj08p5kn1.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/auth/google/callback",
      passReqToCallback: true,
      proxy: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const loginuser = await user.findOne({ email: profile.emails[0].value });
      try {
        if (!loginuser) {
          const newUser = await user.create({
            nameofuser: profile.displayName,
            email: profile.emails[0].value,
          });
          const loginuser = await user.findOne({
            email: profile.emails[0].value,
          });
         // const token = jwt.sign({ loginuser }, JWT_SECRET);

          return done(null, loginuser);
        } else {
          //const token = jwt.sign({ loginuser }, JWT_SECRET);

          return done(null, loginuser);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((User, done) => {
  done(null, User.id); 
});
passport.deserializeUser(function (User, done) {
  user.findOne({_id:User.id}, function(err,User){
    if(err){
      console.log("error in deserial");
     return done (err)
    }
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa")
    
    return done( null, User)

  })
  
});



app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home

    // if (res.status(201)) {
    //   return res.send({ status: "ok", data: req.user});
    // } else {
    //   return res.send({ error: "error" });
    // }

   
    res.redirect("http://localhost:3000");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

app.use(express.json());
// app.post("/post",(req,res)=>{
//     console.log("Connected");
//     console.log(req.body);

//     const {data} = req.body;

//     res.redirect("/loginsignup");
// });



app.post("/register", async (req, res) => {
  const { nameofuser, email, password } = req.body;
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const encryptedPassword = await bcrypt.hash(password, salt);

  try {
    const olduser = await user.findOne({ email });
    if (olduser) {
      return res.send({ error: "user exist" });
    }

    await user.create({
      nameofuser,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send(error);
  }
});

const JWT_SECRET = "dfsdhfbhjdnunf8n8y4ry48w9snifrurfusdsvsfdfrfte54ttgrfgdgs";

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginuser = await user.findOne({ email });

    if (!loginuser) {
      return res.send({ error: "user not found" });
    }

    if (await bcrypt.compare(password, loginuser.password)) {
      const token = jwt.sign({ loginuser }, JWT_SECRET);
      if (res.status(201)) {
        return res.send({ status: "ok", data: token });
      } else {
        return res.send({ error: "error" });
      }
    }
    res.send({ status: "error", error: "Invalid Password" });
  } catch (error) {
    console.log(error);
    res.send({ error: "error" });
  }
});
app.post("/userdata", (req, res) => {
  const { token } = req.body;

  try {
    const ouruser = jwt.verify(token, JWT_SECRET);
    const useremail = ouruser.loginuser.email;
    user
      .findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));