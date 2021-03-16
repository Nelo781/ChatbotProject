'use strict';

const config = require('./config');
const FBeamer = require('./fbeamer');
const nlpData = require('./tmdb')
const express = require('express');
const bodyparser=require("body-parser");


const f = new FBeamer (config.FB) ;

const server = express();
server.use(bodyparser.json())
const PORT = process.env.PORT || 3000;


server.get ('/', (req , res )  => f. registerHook (req , res ) ) ;
server.listen(PORT, () => console.log(`The bot server is runnning on port ${PORT}`));
server.post('/',(req,res,next) => { 
  
  return f.incoming(req,res,async data => {
    const nlp = await data.content.nlp
    
    let movie_infos = await nlpData(nlp)
    console.log(movie_infos + " infos")
    
    try {
        if(nlp.entities.intent[0].value == "movieinfo") {
          
            await f.txt(data.sender, movie_infos.overview);
            await f.sendImage(data.sender, movie_infos.img_path);
        }
        
        if(nlp.entities.intent[0].value == "releaseYear") {

          await f.txt(data.sender, movie_infos.release_date);
        }
        
    } catch (e) {
        console.log(e);
        await f.txt(data.sender,"I’m not sure I understand you!")
    }
    })
});
