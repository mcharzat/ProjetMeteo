var express = require('express');
var router = express.Router();

const Influx = require('influx');


const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'meteoDB',
    schema: [
        {
            measurement: 'temperature',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'pressure',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'hygrometry',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'luminosity',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'wind_heading',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'wind_speed_avg',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'wind_speed_max',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'wind_speed_min',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
    ]
})


// /* GET  */
// router.get('/:parameterMeteo/:date', function(req, res, next) {
 
// });

/* GET  */
router.get('/:parameterMeteo/:date', function(req, res, next) {

    let paramMeteo = req.params.parameterMeteo.split(",").map(x => x.toLowerCase());

    let datesUnix = req.params.date.split(",").map(x => new Date(x).getTime()*1000000);

    const reponse = {};
    const promises = [];

    if(datesUnix.length == 1){
        paramMeteo.forEach(parametres => {
            if(parametres == "winddirection"){
                parametre = "wind_heading"
                reponse[parametres] = {Date:[],Value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]}
                `)
              )
            }
            else if(parametres == "windvelocity"){
                reponse[parametre] = {Date:[],Value:[]};
                promises.push(
                influx.query(`
                select * from wind_speeding_avg,wind_speeding_max,wind_speeding_min,
                where time >=${datesUnix[0]}
                `)
              )
            } else if(parametres == "gpsposition"){
                reponse[parametres] = {Date:[],Value:[]};
                promises.push(
                influx.query(`
                select * from GPSposition
                where time >=${datesUnix[0]}
                `)
              )
            } else{
                reponse[parametres] = {Date:[],Value:[]};
                promises.push(
                    influx.query(`
                    select * from ${parametres}
                    where time >=${datesUnix[0]}
                    `)
                )
            }
        })

    } else {
        paramMeteo.forEach(parametres => {
            if(parametres == "winddirection"){
                parametre = "wind_heading"
                reponse[parametres] = {Date:[],Value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            }
            else if(parametres == "windvelocity"){
                reponse[parametre] = {Date:[],Value:[]};
                promises.push(
                influx.query(`
                select * from wind_speeding_avg,wind_speeding_max,wind_speeding_min,
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            } else if(parametres == "gpsposition"){
                reponse[parametres] = {Date:[],Value:[]};
                promises.push(
                influx.query(`
                select * from GPSposition
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            } else{
                reponse[parametres] = {Date:[],Value:[]};
                promises.push(
                    influx.query(`
                    select * from ${parametres}
                    where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                    `)
                )
            }
            
        })
    }
    

    Promise.all(promises).then(promesses => {
        compteur = 0
        let keys = Object.keys(reponse);
        promesses.forEach(promesse => {
            if(keys[compteur]=="windvelocity"){
                for(i=0;i<promesse.length;i+=3){
                    let windValue = [promesse[i],promesse[i+1],promesse[i+2]]
                    reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].Value.push(windValue);
                }
            } else if(keys[compteur]=="gpsposition"){
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].Value.push({latitude: promesse[i].latitude,longitude : promesse[i].longitude});
                }
            } else{
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].Value.push(promesse[i].value);
                }
                
            }

            compteur++;

        })

        res.send(reponse)
        
    })
  
});

/* GET  */
router.get('/:parameterMeteo', function(req, res, next) {
    let paramMeteo = req.params.parameterMeteo.split(",").map(x => x.toLowerCase());
    
    const reponse = {};
    const promises = [];
    paramMeteo.forEach(parametres => {
        if(parametres == "winddirection"){
            parametre = "wind_heading"
            reponse[parametres] = {Date:[],Value:[]};
            promises.push(
            influx.query(`
            select * from ${parametre}
            `)
          )
        }
        else if(parametres == "windvelocity"){
            reponse[parametre] = {Date:[],Value:[]};
            promises.push(
            influx.query(`
            select * from wind_speeding_avg,wind_speeding_max,wind_speeding_min,
            `)
          )
        } else if(parametres == "gpsposition"){
            reponse[parametres] = {Date:[],Value:[]};
            promises.push(
            influx.query(`
            select * from GPSposition
            `)
          )
        } else{
            reponse[parametres] = {Date:[],Value:[]};
            promises.push(
                influx.query(`
                select * from ${parametres}
                `)
            )
        }
    })

    Promise.all(promises).then(promesses => {
        compteur = 0
        let keys = Object.keys(reponse);
        promesses.forEach(promesse => {
            if(keys[compteur]=="windvelocity"){
                for(i=0;i<promesse.length;i+=3){
                    let windValue = [promesse[i],promesse[i+1],promesse[i+2]]
                    reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].Value.push(windValue);
                }
            } else if(keys[compteur]=="gpsposition"){
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].Value.push({latitude: promesse[i].latitude,longitude : promesse[i].longitude});
                }
            } else{
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].Value.push(promesse[i].value);
                }
                
            }

            compteur++;

        })

        res.send(reponse)
        
    })
   
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

module.exports = router;
