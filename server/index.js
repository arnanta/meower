const express=require('express');

const cors=require('cors');
const monk=require('monk');
const Filter=require('bad-words');
const rateLimit=require('express-rate-limit');

const app=express();

const db=monk(process.env.MONGO_URI||'localhost/meower');
const mews=db.get('mews');

/*[{
    name:..,
    content:..,
    _id:..
}]
[{
    name:..,
    content:..,
    _id:..
}]
[{
    name:..,
    content:..,
    _id:..
}]
[{
    name:..,
    content:..,
    _id:..
}]*/


const filter=new Filter();

app.use(cors());
app.use(express.json());
app.use(rateLimit({
    windowMs:30*1000,     // for evevry 30secs
    max:1    // limiting each ip to make maximum 100 requests 
,}));



app.get('/', (req,res)=>{

    res.json({
        message:"meow!!"
    });
});

app.get('/mews',(req,res)=>{
mews
.find()
.then(mews=>{
    res.json(mews);
});
});

function isValidMew(mew)
{
    return mew.name && mew.name.toString().trim() !==" " &&
     mew.content && mew.content.toString().trim() !==" "

}

app.use(rateLimit({
    windowMs:30*1000,     // for evevry 30secs
    max:1    // limiting each ip to make maximum 100 requests 
,}));

app.post("/mews",(req,res)=>{
   // console.log(req.body);
   if(isValidMew(req.body)){
       //inserts it into DATABASE
       const mew={
           name:filter.clean(req.body.name.toString()),
           content:filter.clean(req.body.content.toString()),
           created:new Date()
       };
        mews
        .insert(mew)
        .then(createdMew=>{
            res.json(createdMew);
        });
   }else{
       res.status(422);
       res.json({
           message:"Hey! name and content required"
       });
   }
});

app.listen(5000,()=>{
    console.log('Listening on http://localhost:5000');
});
