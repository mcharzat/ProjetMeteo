<template>

  <div id="map"></div>

</template>
 
<script>
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

export default {
  methods: {
    placeData(){
      console.log(this.coordinate)
      console.log(this.labels)
      this.map = L.map("map").setView([51.959, -8.623], 7);
      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      //Place marker
      this.labels.forEach(sonde => {
        console.log("Sonde numero"+sonde);
        console.log("Coordonées : \n"+this.coordinate[sonde].lat+"  "+this.coordinate[sonde].lon+"\n\n\n")
        L.circleMarker([this.coordinate[sonde][0], this.coordinate[sonde][1]]).addTo(this.map)
        .bindPopup(sonde);
        
      });

    }
  },
  props: {
    labels: { 
      type: Array,
      default: function(){return ["No Data"]},
      required: true
    },
    coordinate :{
      type: Object,
    }
  },
  watch: {
    coordinate: function(){
      this.placeData();      
    }
  },
  name: 'Map',
  data() {
    return {
      map: null
    }
  },
  mounted() {
    console.log("in Mounted")
    console.log("Data :\n")
    console.log(Object.values(this.coordinate))
    console.log(this.coordinate);
    console.log("Fin data :\n")
    this.placeData();
  }
}
</script>

