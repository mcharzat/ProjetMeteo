var express = require('express');
var router = express.Router();

const influx = new Influx.InfluxDB({
    host: 'localhost:8088',
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
    let paramMeteo = req.params.parameterMeteo.split(",");
    let unixDateBegin = new Date(req.params.date.split(',')[0]).getTime();
    let unixDateEnd = new Date(req.params.date.split(',')[1]).getTime();
    paramMeteo.forEach(parametres => {
        influx.query(`
        select * from ${parametres}
        where time <= ${unixDateBegin} and time >= ${unixDateBegin} 
    `)
    .then( result => response.status(200).json(result) )
    .catch( error => response.status(500).json({ error }) );
    });
    
});

/* GET  */
router.get('/:parameterMeteo/:dateBegin', function(req, res, next) {
  
});

/* GET  */
router.get('/:parameterMeteo', function(req, res, next) {
  
});

module.exports = router;
