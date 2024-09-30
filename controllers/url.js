const shortid=require('shortid')
const URL = require('../models/url')

async function handleGenerateNewShortUrl (req,res) {

const body = req.body;
if(!body.url) return res.status(400).json({error:'URL is required'});
    //check if url already exits in database
    const existingUrl = await URL.findOne({redirectURL:body.url})
    // if exist send an alert that url already exist in the homepage
    if(existingUrl) return res.status(400).render('home',{
        error:'URL already exist',
        
    })
    // if(existingUrl) return res.status(400).json({error:'URL already exist'})
    
    const shortID=shortid();
    await URL.create({
        shortId:shortID,
        redirectURL:body.url,
        visitHistory:[],
        createdBy:req.user._id,
    });
   return res.render('home',{
    id:shortID
   })
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId:shortId});
    return res.json({totalClicks:result.visitHistory.length,analytics:result.visitHistory})
}
module.exports={
    handleGenerateNewShortUrl,
    handleGetAnalytics,
}