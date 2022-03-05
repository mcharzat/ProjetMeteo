<template>
  <div class="flex flex-wrap">
    <div class="w-full px-4">
      <!-- <div
        class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <map-example 
        :labels ="sondeCalcul" 
        :coordinate ="coordinates" 
        :key="componentKey"/>
      </div> -->
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

    placeData(){
      // console.log(this.coordinates)
      console.log(this.sondeCalcul)
      this.map = L.map("map").setView([51.959, -8.623], 3);
      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      console.log(this.sondeCalcul);
      console.log(this.sondeCalcul.length);
      //Place marker
      for(let i = 0 ; i<this.sondeCalcul.length;i++){
        console.log("Sonde numero"+this.sondeCalcul[i]);
        console.log("Coordonées : \n"+this.coordinates[this.sondeCalcul[i]].lat+"  "+this.coordinates[this.sondeCalcul[i]].lon+"\n\n\n")
        L.circleMarker([this.coordinate[this.sondeCalcul[i]][0], this.coordinate[this.sondeCalcul[i]][1]]).addTo(this.map)
        .bindPopup(this.sondeCalcul[i]);
      }
        
        
      
    },
    getData(){
      for(let i =0;i<this.sonde.length;i++){
        fetch("http://piensg"+this.sonde[i]+":8080/data/gpsposition")
        .then(result => result.json())
        .then(result => { 
          this.sondeCalcul.push(this.sonde[i])
          this.coordinates[this.sonde[i]] = [result.gpsposition.value[0].lat,result.gpsposition.value[0].lon];
        })
        .catch(console.error);
      }
      this.placeData();
      //this.forceRerender();
    }
  },
  mounted () {
    this.getData();
  },
  data () {
    return {
      sonde: ["028","031"],
      sondeCalcul:[],
      coordinates:{},
      componentKey: 0,
    }
  },
  // components: {
  //   MapExample,
  // },
};
</script>

<style scoped>
  #map {
    height: 300px;
    width: 100%;
  }
</style>

