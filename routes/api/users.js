// var path = require("path");
// var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
var User = require("../../models/users/User");

/*========= This is the typical node server setup so we can be able to parse the requests/responses coming in and out of the server ============*/

/*========= Here we will set up an express jsonwebtoken middleware(simply required for express to properly utilize the token for requests) You MUST instantiate this with the same secret that will be sent to the client ============*/
const jwtMW = exjwt({
  secret: "zoylee_user_secret_token"
});

module.exports = app => {
  app.get("/api/test", (req, res, next) => {
    return res.send({
      success: true,
      message: "OK"
    });
  });
  // Get User
  app.get("/api/account/user/:id", (req, res, next) => {
    try{
      User.findById(req.params.id,(err,result)=>{
        if(err){
          return res.send({
            status:false,
            message:"Server Error",
          });
        }
        if(!result){
          return res.send({
            status:false,
            message:"No Record Found",
          });
        }
        return res.send(result); 
      })
    }catch(err){
      return false;
    }
  });
  //End Get User
  //Upadet User
  app.post("/api/account/user/update/:id", (req, res, next) => {
    const _id = req.params.id;
    const {body} =req;
    const {phone,name,password} = body;
    let {email} =  body;
    email = email.toLowerCase();

    try{
      User.findById(_id,(err,result)=>{
        if(err){
          return res.send({
            status:false,
            message:"Server Error",
          });
        }
        if(!result){
          return res.send({
            status:false,
            message:"No Record Found",
          });
        }
        result.name = name;
        result.phone = phone;
        result.email = email;
        if(password!==null)
           result.password = result.generateHash(password);
        
        result.save((err,user)=>{
          if(err){
            return res.send({
              status:false,
              message:"Server Error"
            })
          }
          return res.send({
            status:true,
            message:"Updated"
          })
        });

      })
    }catch(err){
      return false;
    }
  });
  //End Update User
  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { name, phone, password } = body;
    let { email } = body;

    if (!name) {
      return res.send({
        success: false,
        message: "Error : Name Cannot be null"
      });
    }
    if (!phone) {
      return res.send({
        success: false,
        message: "Error : Mobile Number Cannot be null"
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "Error : Email Cannot be null"
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error : Password Cannot be null"
      });
    }
    email = email.toLowerCase();

   
   
    User.find({ email: email }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error :Server Error ."
        });
      } else if (previousUsers.length > 0) {
        // console.log("Error : Account already exits .");
        return res.send({
          success: false,
          message: "Error : Account already exits .Email"
        });
      }
    

    });
    User.find({ phone: phone }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error : Server Error"
        });
      } else if (previousUsers.length > 0) {
        console.log("Error : Account already exits .");
        return res.send({
          success: false,
          message: "Error : Account already exits .Phone"
        });
      }else{
        const newUser = new User();
        var t = Date.now() + "" + phone;
        newUser.user_id = t;
        newUser.phone = phone;
        newUser.name = name;
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: "Error : Server Error"
            });
          }
          let token = jwt.sign(
            {
              username:user.name,
              user_id:user._id,
            },
            "zoylee_user_secret_token",
            { expiresIn: 12960000000 }
          ); // Signing the token

          return res.send({
            success: true,
            message: "Signed up",
            token: token,
            err: null
          });
        });
      }
    });
    
    //Save the new user

    
  });
  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { phone } = body;

    User.find({ phone: phone }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error : Server error"
        });
      }
      if (users.length != 1) {
        return res.status(401).send({
          success: false,
          token:null,
          message: "Error : Invalid Credentials"
        });
      }
      const user = users[0];
    
      console.log(user[0]);
      let token = jwt.sign(
        {
          username:user.name,
          user_id:user._id,
        },
        "zoylee_user_secret_token",
        { expiresIn: 12960000000 }
      ); // Signing the token
      return res.send({
        success: true,
        message: "Valid sign in",
        token:token
      });
    });
  });
  app.get("/api/account/verify", (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.find({ user_id: token, isDeleted: false }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error : Serve Error"
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error : Invalid"
        });
      } else {
        return res.send({
          success: true,
          message: "Good"
        });
      }
    });
  });
  app.get("/api/account/logout", (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate(
      { user_id: token, isDeleted: false },
      { $set: { isDeleted: true } },
      null,
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error : Serve Error"
          });
        }

        return res.send({
          success: true,
          message: "Good"
        });
      }
    );
  });
  app.get("/", jwtMW /* Using the express jwt MW here */, (req, res) => {
    console.log("Web Token Checked.");
    res.send("You are authenticated"); //Sending some response when authenticated
  });
};
