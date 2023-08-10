const express=require("express");
const path=require('path');
const bodyParser=require('body-parser');
const Data=require('./Data.json');
const cors=require("cors")
// const fs=require('fs')

app=express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 9000;

const minYear=2000;
const maxYear=2022;

// Index page for introduction for my API

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname,'./index.html'))
})
// ------------------------------------

const getDataRandom=(year)=>{
    let len=Data[year].length
    let randomData=Math.floor(Math.random()*len)
    return JSON.stringify(Data[year][randomData])
}
const checkYear=(y)=>{
    if(y<minYear){
        return false;
    }
    return true;
}

app.get('/:year/random',(req,res)=>{
    year=req.params.year
    if(checkYear(year))
    res.end(getDataRandom(year))
    else
    res.send("No Data Found");
})

// To get random single data from whole Data.json

app.get('/random',(req,res)=>{
    
    let randomNum=Math.floor(Math.random()*(maxYear - minYear +1) + minYear)
    res.end(getDataRandom(randomNum))
})

// Full year data from Data.json

app.get('/:year',(req,res)=>{
    year=req.params.year;
    if(checkYear(year))
        res.json(Data[year])
    else
        res.send("No Data Found");
})

// some find specific title requested to url 

app.get('/find',(req, res)=>{
    const title=req.query.title
    const year=req.query.year || 2022
    let data=[]
    try{
        for(let i=0;i<Data[year].length;i++){
            if((Data[year][i].title).toLowerCase() === title.toLowerCase())
            {
                data.push(Data[year][i])
            }
        }
        res.send(data[0]);
    }
    catch{
        res.send("Please provide valid URL")
    }
})

// contributation from user by taking input

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/user/submit_page',(req,res)=>{
    res.sendFile(__dirname + "/" + 'support.html')
})
app.post('/user/submit_data/apply',(req, res)=>{
    let user=req.body.name;
    let gameData=`{
    "${req.body.title}":{
        "contributer":"${user}",
        "description":"${req.body.des}",
        "release":"${req.body.rel}",
        "genre":"${req.body.gen}"
    }
}`
    // fs.readFile('./requestedData.json',(err,data)=>{
    //     if(err) throw err;
    //     fs.writeFile('./requestedData.json',data.toString().slice(0,-1),(err)=>{
    //         if(err) throw err;
    //     })
    //     fs.appendFile('./requestedData.json',gameData,(err)=>{
    //         if(err) throw err;
    //     })
    // })
    res.write("<p>We got you Data! Thanks for your contributing</p>");
    res.end(gameData + "")
})

app.listen(port,()=>{
    console.log(`✔ Sucessfully! Running at port : ${port}`);
})