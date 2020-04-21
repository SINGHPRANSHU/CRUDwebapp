var app                  =require("express")();
var mongoose             =require("mongoose");
var passport             =require("passport");
var bodyParser           =require("body-parser");
var methodOverride       =require("method-override");
var user                 =require("./models/user")
var localStategey        =require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/CRUDwebapp");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret:"node is best",
    resave:false,
    saveUninitialized:false
   
}));
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStategey(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());





 





app.get("/",function(req,res){
    res.render("home");
 });
 


app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
 });


 app.get("/logout",function(req,res){
     req.logOut();
     res.redirect("/");
 });


 app.get("/register",function(req,res){
    res.render("register");
});


app.get("/login",function(req,res){
    res.render("login");
});

//CREATE ROUTE
app.post("/register",function(req,res){
   user.register(new user({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/todo");
       });
   });
});


app.get("/login",function(req,res){
 res.redirect("login");
});



app.post("/login",passport.authenticate("local",{
    
    successRedirect:"/todo",
    failureRedirect:"/login"
}),function(req,res){
   

    

    
    
       

    }


);






function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}


app.get("/todo",function(req,res){
    res.render("todo.ejs",{id:req.user.id})
});

//READ ROUTE
app.get("/show/:id",function(req,res){
    user.findById(req.params.id,function(err,founduser){
        if(err){}
        else{res.render("show",{currentuser:founduser.age,id:req.user.id});}
        
    });
    

});





app.get("/show/:id/edit",function(req,res){
 res.render("edit",{id:req.user.id})
});

//UPDATE ROUTE
app.put("/show/:id",function(req,res){
    user.findByIdAndUpdate(req.params.id,req.body.user,function(err,updateduser){
  if(err){
      console.log(err);
  }
  else{
      res.redirect("/show/"+req.params.id);
  }
    });
});


//DELETE ROUTE
app.delete("/show/:id/",function(req,res){
user.findByIdAndDelete(req.params.id,function(err){
    if(err){
        console.log(err);
    }
    else{
        res.redirect("/");
    }
});
});
















app.listen(3000,function(){
    console.log("server has started");
}); 



 