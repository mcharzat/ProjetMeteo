<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
            Données des sondes
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            {{ graphTitle }}
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <canvas id="bar-chart"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js";
export default {
  watch: {
    graphTitle: function(){
      setTimeout(function() { window.myBar.update(); },1000);
    }
  },
  props: {
    graphTitle: { 
      type: String,
      default: "No Data",
      required: true
    },
    dataChart :{
      type: Array,
      default: function(){return [0,0,0,0,0]}
    },
    dataLabels:{
      type: Array,
      default: function(){return ["No Data"]}
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let config = {
        type: "bar",
        data: {
          labels: this.dataLabels,
          datasets: [{
              fill: true,
              backgroundColor:["#d7baff","#bc8cff","#9345ff","#570dbd","#2f0963"],
              borderColor: ["#d7baff","#bc8cff","#9345ff","#570dbd","#2f0963"],
              data: this.dataChart,
              barThickness: 20,
            }]
        },
        options: {
          legend: {
            display:false,
          },
        },
      };
      let ctx = document.getElementById("bar-chart").getContext("2d");
      let myChart = new Chart(ctx, config)
      window.myBar = myChart;
      setTimeout(function() { myChart.update(); },100);
    });
  },
};
</script>
