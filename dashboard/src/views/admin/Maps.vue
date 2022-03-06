<template>
  <div class="flex flex-wrap">
    <div class="w-full px-4">

      <div id="map"></div>

    </div>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
//import MapExample from "@/components/Maps/MapExample.vue";

export default {
  methods: {


    getData: function(){

      this.map = L.map("map").setView([51.959, -8.623], 3);
      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      for(let i =0;i<this.sonde.length;i++){
        fetch("http://piensg"+this.sonde[i]+":8080/data/gpsposition")
        .then(result => result.json())
        .then(result => { 
         
          L.circleMarker([result.gpsposition.value[0].lat, result.gpsposition.value[0].lon])
          .addTo(this.map)
          .bindPopup(this.sonde[i]);

        })
        .catch(console.error);
      }

    }
  },
  mounted () {
    this.getData();
  },
  data () {
    return {
      sonde: ["027","028","030","031","032"],
      
    }
  },

};
</script>

<style scoped>
  #map {
    height: 300px;
    width: 100%;
  }
</style>

