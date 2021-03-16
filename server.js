'use strict';

const config = require('./config');
const FBeamer = require('./fbeamer');
const express = require('express');
const bodyparser=require("body-parser");

const f = new FBeamer (config.FB) ;

const server = express();
server.use(bodyparser.json())
const PORT = process.env.PORT || 3000;


server.get ('/', (req , res )  => f. registerHook (req , res ) ) ;
server.listen(PORT, () => console.log(`The bot server is runnning on port ${PORT}`));
server.post('/',(req,res,next) => { return f.incoming(req,res,async data => {
    
    console.log(data)
    try {
        if(data.content == 'Wisky') {
            await f.txt(data.sender, 'Avec ou sans glace ?');
        }
        if(data.content == 'sans'||data.content =='avec') {
            await f.txt(data.sender, 'tout de suite Mr');
        }
    } catch (e) {
        console.log(e);
    }
    })
});
