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

    // placeData(){
    //   // console.log(this.coordinates)
    //   console.log(this.sonde)
    //   console.log(this.coordinates)
    //   this.map = L.map("map").setView([51.959, -8.623], 3);
    //   L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    //       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //   }).addTo(this.map);

    //   console.log(this.sondeCalcul)
    //   this.sondeCalcul.forEach(sonde => {
    //     console.log("Sonde numero"+sonde);
    //     console.log("Coordonées : \n"+this.coordinates[sonde][0]+"  "+this.coordinates[sonde][1]+"\n\n\n")
      
    //     L.circleMarker([this.coordinates[sonde][0], this.coordinates[sonde][1]]).addTo(this.map)
    //     .bindPopup(sonde);
    //   });
      
      


    //   // for(let i = 0 ; i<this.sonde.length;i++){
    //   //   console.log("Sonde numero"+this.sonde[i]);
    //   //   console.log("Coordonées : \n"+this.coordinates[this.sonde[i]][0]+"  "+this.coordinates[this.sonde[i]][1]+"\n\n\n")
      
    //   //   L.circleMarker([this.coordinates[this.sonde[i]][0], this.coordinates[this.sonde[i]][1]]).addTo(this.map)
    //   //   .bindPopup(this.sonde[i]);
    //   // }
        
        
      
    // },
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

            //this.sondeCalcul.push(this.sonde[i])
            //this.coordinates[this.sonde[i]].lat = result.gpsposition.value[0].lat
            //this.coordinates[this.sonde[i]].lon = result.gpsposition.value[0].lon;
          
          //Vue.set(this.coordinates, this.sonde[i], [result.gpsposition.value[0].lat,result.gpsposition.value[0].lon])
          
        })
        .catch(console.error);
      }
      // this.$nextTick(()=> {
      //   //this.placeData();
      // })
      
      //this.forceRerender();
    }
  },
  mounted () {
    this.getData();
  },
  data () {
    return {
      sonde: ["027","028","030","031","032"],
      // sondeCalcul: [],
      // coordinates:{
      //   "027": {lat:0, lon:0},
      //   "028": {lat:0, lon:0},
      //   "030": {lat:0, lon:0},
      //   "031": {lat:0, lon:0},
      //   "032": {lat:0, lon:0},
      //   },
      // componentKey: 0,
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

