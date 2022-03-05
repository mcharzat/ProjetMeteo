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


/* GET  */
router.get('/:parameterMeteo/:date', function(req, res, next) {

    let paramMeteo = req.params.parameterMeteo.split(",").map(x => x.toLowerCase());

    let datesUnix = req.params.date.split(",").map(x => new Date(x).getTime()*1000000);
    let parametre;

    const reponse = {};
    const promises = [];

    if(datesUnix.length == 1){
        paramMeteo.forEach(parametres => {
            if(parametres == "brightness"){
                parametre = "luminosity"
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]}
                `)
              )
            }
            else if(parametres == "hygrometry"){
                parametre = "humidity"
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]}
                `)
              )
            }
            else if(parametres == "winddirection"){
                parametre = "wind_heading"
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]}
                `)
              )
            }
            else if(parametres == "gpsposition"){
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from GPSposition
                where time >=${datesUnix[0]}
                `)
              )
            } else{
                reponse[parametres] = {date:[],value:[]};
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
            if(parametres == "brightness"){
                parametre = "luminosity"
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            }
            else if(parametres == "hygrometry"){
                parametre = "humidity"
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            }
            else if(parametres == "winddirection"){
                parametre = "wind_heading"
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from ${parametre}
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            }
            else if(parametres == "gpsposition"){
                reponse[parametres] = {date:[],value:[]};
                promises.push(
                influx.query(`
                select * from GPSposition
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
            } else{
                reponse[parametres] = {date:[],value:[]};
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
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].value.push({avg: promesse[i].wind_speed_avg,min: promesse[i].wind_speed_min,max: promesse[i].wind_speed_max});
                }
            } else if(keys[compteur]=="gpsposition"){
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].value.push({lat: promesse[i].latitude,lon : promesse[i].longitude, alt: 0});
                }
            } else{
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].value.push(promesse[i].value);
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

    let parametre;
    paramMeteo.forEach(parametres => {
        if(parametres == "brightness"){
            parametre = "luminosity"
            reponse[parametres] = {date:[],value:[]};
            promises.push(
            influx.query(`
            select * from ${parametre}
            order by time desc
            limit 1
            `)
          )
        }

        else if(parametres == "hygrometry"){
            parametre = "humidity"
            reponse[parametres] = {date:[],value:[]};
            promises.push(
            influx.query(`
            select * from ${parametre}
            order by time desc
            limit 1
            `)
          )
        }
        
        else if(parametres == "winddirection"){
            parametre = "wind_heading"
            reponse[parametres] = {date:[],value:[]};
            promises.push(
            influx.query(`
            select * from ${parametre}
            order by time desc
            limit 1
            `)
          )
        }
        else if(parametres == "gpsposition"){
            reponse[parametres] = {date:[],value:[]};
            promises.push(
                influx.query(`
                select * from GPSposition
                order by time desc
                limit 1
            `)
          )
        } else{
            reponse[parametres] = {date:[],value:[]};
            promises.push(
                influx.query(`
                select * from ${parametres}
                order by time desc
                limit 1
                `)
            )
        }
    })

    Promise.all(promises).then(promesses => {
        compteur = 0
        let keys = Object.keys(reponse);
        promesses.forEach(promesse => {
            if(keys[compteur]=="windvelocity"){
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].value.push({avg: promesse[i].wind_speed_avg,min: promesse[i].wind_speed_min,max: promesse[i].wind_speed_max});
                }
            } else if(keys[compteur]=="gpsposition"){
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].value.push({lat: promesse[i].latitude,lon : promesse[i].longitude,alt: 0});
                }
            } else{
                for(i=0;i<promesse.length;i++){
                    reponse[paramMeteo[compteur]].date.push(promesse[i].time._nanoISO);
                    reponse[paramMeteo[compteur]].value.push(promesse[i].value);
                }
                
            }

            compteur++;

        })

        res.send(reponse)
        
    })
   
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile('public/documentation.html',{ root: __dirname+'/..'});
  });

module.exports = router;
