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
        console.log(datesUnix[0])
        paramMeteo.forEach(parametres => {
            reponse[parametres] = {Date:[],Value:[]};
            promises.push(
                influx.query(`
                select * from ${parametres}
                where time >=${datesUnix[0]}
                `)
              )
        })
        console.log("ok2")
    } else {
        paramMeteo.forEach(parametres => {
            console.log(datesUnix[0], datesUnix[1])
            reponse[parametres] = {Date:[],Value:[]};
            promises.push(
                influx.query(`
                select * from ${parametres}
                where time >=${datesUnix[0]} and time <= ${datesUnix[1]}
                `)
              )
        })
        console.log("ok1")
    }
    

    Promise.all(promises).then(promesses => {
        compteur = 0

        promesses.forEach(promesse => {
            console.log(promesse.length)
            for(i=0;i<promesse.length;i++){
                console.log(promesse[i].time.getNanoTime())
                reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                reponse[paramMeteo[compteur]].Value.push(promesse[i].value);
            }
            console.log(reponse)
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
        reponse[parametres] = {Date:[],Value:[]};
        promises.push(
            influx.query(`
            select * from ${parametres}
            `)
          )
    })

    Promise.all(promises).then(promesses => {
        compteur = 0

        promesses.forEach(promesse => {
            console.log(promesse.length)
            for(i=0;i<promesse.length;i++){
                console.log(promesse[i].time._nanoISO)
                reponse[paramMeteo[compteur]].Date.push(promesse[i].time._nanoISO);
                reponse[paramMeteo[compteur]].Value.push(promesse[i].value);
            }
            console.log(reponse)
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
