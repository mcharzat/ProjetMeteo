const fs = require('fs');
const Influx = require('influx');
const chokidar = require('chokidar');
const nmea = require('@drivetech/node-nmea');

// Connect to db

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
        {
            measurement: 'rainfall',
            fields: { value: Influx.FieldType.FLOAT },
            tags: ['unit', 'source']
        },
        {
            measurement: 'GPSposition',
            fields: { latitude: Influx.FieldType.STRING , longitude: Influx.FieldType.STRING },
            tags: ['unit', 'source']
        }
    ]
})

function loop () {

    // Retrieve data
    setInterval( function () {
        fs.readFile('/dev/shm/sensors', 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            dataJson = JSON.parse(data);

            dataJson.measure.forEach(measure => {
                influx.writePoints([
                    {
                      measurement: measure.name,
                      tags: {
                        unit: measure.unit,
                        source: "piensg031",
                      },
                      fields: { value: measure.value },
                      timestamp: new Date(dataJson.date).getTime(),
                    }
                ], {
                    database: 'meteoDB',
                    precision: 'ms',
                })
                  .catch(error => {
                    console.error(`Error saving data to InfluxDB! ${error.stack}`)
                });
            });
            
        });
        fs.readFile('/dev/shm/gpsnmea', 'utf8' , (err, dataRaw) => {
            if (err) {
              console.error(err)
              return
            }

            data = nmea.parse(dataRaw.split("\n")[1]);

            influx.writePoints([
                {
                    measurement: "GPSposition",
                    tags: {
                    unit: "°",
                    source: "piensg031",
                    },
                    fields: { 
                        latitude: data.loc['geojson'].coordinates[0],
                        longitude: data.loc['geojson'].coordinates[1]
                    },
                    timestamp: new Date(data.datetime).getTime(),
                }
            ], {
                database: 'meteoDB',
                precision: 'ms',
            })
                .catch(error => {
                console.error(`Error saving data to InfluxDB! ${error.stack}`)
            });
            
        })
    }, 60000);
}

chokidar.watch('/dev/shm/rainCounter.log').on('change', (event, path) => {
    
    fs.readFile('/dev/shm/rainCounter.log', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        influx.writePoints([
            {
              measurement: "rainfall",
              tags: {
                unit: 'mL',
                source: "piensg031",
              },
              fields: { value:  3.8},
              timestamp: new Date(data.replace("\n", "")).getTime(),
            }
        ], {
            database: 'meteoDB',
            precision: 'ms',
        })
          .catch(error => {
            console.error(`Error saving data to InfluxDB! ${error.stack}`)
        });
    });
});

loop()