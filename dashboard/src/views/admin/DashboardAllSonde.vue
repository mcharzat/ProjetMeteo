<template>
  <div>
    <div class="flex flex-wrap">
      
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-bar-chart  
        :graphTitle = "parameters" 
        :dataChart = "data" 
        :dataLabels = "sonde"/>
      </div>
      <select class="form-control" v-model="parameters" @change="getData">
        <option value="Temperature" >Temperature</option>
        <option value="Pressure" >Pressure</option>
        <option value="Brightness">Brightness</option>
        <option value="Hygrometry">Hygrometry</option>
        <option value="WindDirection">Wind direction</option>
    </select>
    </div>
  </div>
</template>
<script>

import CardBarChart from '@/components/Cards/CardBarChart.vue';
export default {
  mounted () {
    this.getData();
  },
  data () {
    return {
   
      parameters: "Temperature",
      sonde: ["028","031","032"],
      data: [0, 0, 0, 0, 0],
      date: "",
      componentKey: 0,
    }
  },
  methods: {

    getData(){
      for(let i =0;i<this.sonde.length;i++){
        fetch("http://piensg"+this.sonde[i]+":8080/data/"+this.parameters.toLowerCase())
        .then(result => result.json())
        .then(result => { 
          let parametreType = this.parameters.toLowerCase();
          this.date = result[parametreType].date[0];
          this.data[i] = result[parametreType].value[0];
        })
        .catch(console.error);
      }
    }
  },


  name: "dashboard-page",
  components: {
    CardBarChart
  },
};
</script>