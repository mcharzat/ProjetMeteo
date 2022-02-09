

fetch("http://piensg031:8080/data/Temperature")
.then(result => result.json)
.catch(error => console.error);