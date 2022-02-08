const fs = require('fs');
const Influx = require('influx');
const chokidar = require('chokidar');

let countRain = 0;

function loop () {
    // Connect to db

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

    // Retrieve data
    setInterval( function () {
        fs.readFile('/dev/shm/sensors', 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            dataJson = data.json();
            console.log(dataJson);

            dataJson['measure'].array.forEach(measure => {
                influx.writePoints([
                    {
                      measurement: measure.name,
                      tags: {
                        unit: measure.unit,
                        source: "piensg031",
                      },
                      fields: { value: measure.value },
                      timestamp: dataJson.date,
                    }
                ], {
                    database: 'meteoDB',
                    precision: 's',
                })
                  .catch(error => {
                    console.error(`Error saving data to InfluxDB! ${err.stack}`)
                });
            });
            

            countRain = 0;
          })
    }, 60);
}

chokidar.watch('/dev/shm/rainCounter.log').on('change', (event, path) => {
    console.log(countRain);
    countRain += 1;
  });

loop()