const express = require("express");
const { connectToMongoDB }= require('./connect')
require('dotenv').config()
const URL = require('./models/url')

const urlRoute=require('./routes/url');
const staticRoute =require('./routes/staticRouter');
const userRoute=require('./routes/user');
const path = require("path");
const cookieParser = require("cookie-parser");
const app =express();
const PORT = process.env.PORT;
const {restrictToLoggedInUserOnly,checkAuth} =require('./middleware/auth')

connectToMongoDB(
    process.env.DB_URL
)
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
// app.get('/test',async (req,res)=>{
//     const allUrls = await URL.find({});
//     return res.render('home',{
//         urls:allUrls,
//     });
// })
app.use('/url',restrictToLoggedInUserOnly,urlRoute);
app.use('/',checkAuth,staticRoute);
app.use('/user',userRoute);
app.get("/",(req,res)=>{
     return res.send("Hello")
})
app.get('/url/:shortId',async(req,res)=>{
    const shortId =req.params.shortId;
    const entry =await URL.findOneAndUpdate({
        shortId:shortId,
    },
    {
        $push:{
        visitHistory:{
            timestamp: Date.now()
        },
    },
 });
   res.redirect(entry.redirectURL);
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
