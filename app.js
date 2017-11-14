var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//Connect to mongodb
mongoose.connect("mongodb://localhost/blog_app");
//blog schema
var blogSchema = new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//       title:"Eradicating Poverty with tech",
//       image:"https://farm1.staticflickr.com/200/466540753_2534fee1cf.jpg",
//       body:"Best camping site in whole of San Diego County"
//     },
//     function(err,blog){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log(blog);
//         }
// });


app.get("/",function(req,res){
   res.redirect("/blogs"); 
});

//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            // console.log(sites);
            res.render("index",{blogs:blogs});
        }
    });
});


//new route 
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//create post
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("/blogs/new");
        }else{
            // resirect to blog page
            res.redirect("/blogs");
        }
    });
});

//show page individual blog
app.get("/blogs/:id",function(req,res){
//   res.send("hi 1 page"); 
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else{
           res.render("show",{blog:foundBlog});
       }
    });
    
});


//edit route
app.get("/blogs/:id/edit",function(req,res){
        Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else{
           res.render("edit",{blog:foundBlog});
       }
    });
});
//update route
app.put("/blogs/:id",function(req,res){
//   res.send("hi 1 page"); 
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs/"+req.params.id);
       }
    });
    
})

//delete route

app.delete("/blogs/:id",function(req,res){
//   res.send("hi 1 page"); 
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs");
       }
    });
    
})


app.listen(process.env.PORT, process.env.IP,function(){
   console.log("BLOG APP IS RUNNING!!");
});