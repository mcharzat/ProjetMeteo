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
    console.log(this.graphTitle)
    this.$nextTick(function () {
      let config = {
        type: "bar",
        data: {
          labels: this.dataLabels,
          datasets: [{
              label: this.graphTitle,
              fill: true,
              backgroundColor:["#d7baff","#bc8cff","#9345ff","#570dbd","#2f0963"],
              borderColor: ["#d7baff","#bc8cff","#9345ff","#570dbd","#2f0963"],
              data: this.dataChart,
              barThickness: 20,
            }]
        },
        // options: {
        //   maintainAspectRatio: false,
        //   responsive: true,
        //   tooltips: {
        //     mode: "index",
        //     intersect: false,
        //   },
        //   hover: {
        //     mode: "nearest",
        //     intersect: true,
        //   },
        //   legend: {
        //     labels: {
        //       fontColor: "rgba(0,0,0,.4)",
        //     },
        //     align: "end",
        //     position: "bottom",
        //   },
        //   scales: {
        //     xAxes: [
        //       {
        //         display: false,
        //         scaleLabel: {
        //           display: true,
        //           labelString: "Sonde number",
        //         },
        //         gridLines: {
        //           borderDash: [2],
        //           borderDashOffset: [2],
        //           color: "rgba(33, 37, 41, 0.3)",
        //           zeroLineColor: "rgba(33, 37, 41, 0.3)",
        //           zeroLineBorderDash: [2],
        //           zeroLineBorderDashOffset: [2],
        //         },
        //       },
        //     ],
        //     yAxes: [
        //       {
        //         display: true,
                
        //         gridLines: {
        //           borderDash: [2],
        //           drawBorder: false,
        //           borderDashOffset: [2],
        //           color: "rgba(33, 37, 41, 0.2)",
        //           zeroLineColor: "rgba(33, 37, 41, 0.15)",
        //           zeroLineBorderDash: [2],
        //           zeroLineBorderDashOffset: [2],
        //         },
        //       },
        //     ],
        //   },
        // },
      };
      let ctx = document.getElementById("bar-chart").getContext("2d");
      let myChart = new Chart(ctx, config)
      window.myBar = myChart;
      setTimeout(function() { myChart.update(); },1000);
    });
  },
};
</script>
