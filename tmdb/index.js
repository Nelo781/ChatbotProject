const config = require('../config');
const request = require('request');

const extractEntity = (nlp , entity ) =>{
  
  if(nlp.entities[entity]){

  
    if(nlp.entities[entity][0].confidence > 0.8){
      return nlp.entities[entity][0].value
    }
    else{
      return null
    }
  }
  else{
    return null
  }
  

}
const getMovieData = (movie , releaseYear = null ) => {
  

  return new Promise (( resolve , reject ) => {
    
    
    url = "https://api.themoviedb.org/3/search/movie?api_key="+config.TMDB+"&language=en-US&query="
    url += movie
    console.log(url)
    if(releaseYear != null){
      url+="&year="+releaseYear
    }
    
    try{
      request(url, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      
      let id = body.results[0].id
      let title = body.results[0].original_title
      let overview = body.results[0].overview
      let release_date = body.results[0].release_date
      let img_path = "https://image.tmdb.org/t/p/w500"+body.results[0].backdrop_path

      infos = {id,title,overview,release_date,img_path}
      console.log(infos)
      resolve(infos)
      })
      
    }
    catch(error){
      reject(error)
    }
    
    


  }) ;
}

module.exports = nlpData => {
  
  return new Promise ( async function ( resolve , reject ) {
    let intent = extractEntity (nlpData , 'intent') ;

    if( intent ) {
      let movie = extractEntity ( nlpData , 'movie') ;

      let releaseYear = extractEntity ( nlpData , 'releaseYear') ;
 
  // Get data ( including id) about the movie
      try {
        let movieData = await getMovieData (movie ,releaseYear ) ;
        resolve (movieData) ;
      } 
      catch ( error ) {
        reject ( error ) ;
      }
 
   } 
    else {
    resolve ({
      txt: "I’m not sure I understand you!"
    }) ;
   }
  
   }) ;
}


