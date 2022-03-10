# Project Meteo 

This project contains the initialisation of the store service, the api service to retrieve the data stored and the dashboard used to display those data.

## Installation

This project uses npm package. Therefore run `npm install` in all folders.

## Deployment

You can use both services in the folder services to deploy the sonde and the station. You have to put those files in /etc/systemd/system of your machine and then run the command: <br>
```systemctl enable start apimeteo.service```
```systemctl enable start storedata.service```

You can also use the command: <br>
```ǹpm install --save``` in both sonde and server folders and then run the command ```npm start```  in those folder
## Dashboard

To see the dashboard, go to `http://piensg031:8080`.

### Default page

In the default page, the data from one meteo sonde is displayed. You can choose the meteo sonde with the select button.
The data since the last week is display in line charts.

### 'Toutes les sondes' page

In the 'Toutes les sondes' page, the data from all meteo sondes is displayed. You can choose the parameter you want to display with the select button.
The last data is display in bar charts.

### Map page

In the map page, the location of all meteo sondes is displayed on a map.

## Problems

At the end of the project, we wanted to use vue-chartjs instead of chartjs but vue-chartjs is not compatible with our version of VueJS and it was hard to downgrade Vue and all of its dependencies. So the chart dashboard has some problem and the code is not optimize.
