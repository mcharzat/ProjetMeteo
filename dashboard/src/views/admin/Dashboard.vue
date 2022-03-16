<template>
  <div>
    <div class="flex flex-wrap">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 z-50"> 
        <select class="form-control" v-model="sonde" v-on:change="updateStats">
          <option value="piensg027">piensg027</option>
          <option value="piensg028">piensg028</option>
          <option value="piensg030">piensg030</option>
          <option value="piensg031">piensg031</option>
          <option value="piensg032">piensg032</option>
        </select>
      </div>
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 z-50"> 
        <select class="form-control" v-model="duration" v-on:change="updateStats">
          <option value="week">week</option>
          <option value="month">month</option>
          <option value="year">year</option>
        </select>
      </div>
      </div> 
      <div id="Charts">
          <div
              class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
            >
              <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                  <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                      Overview
                    </h6>
                    <h2 class="text-white text-xl font-semibold">
                      Temperature
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-4 flex-auto">
                <!-- Chart -->
                <div id="temperatureContainer" class="relative h-350-px">
                  <canvas id="temperature"></canvas>
                </div>
              </div>
              
          </div>
          <div
              class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
            >
              <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                  <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                      Overview
                    </h6>
                    <h2 class="text-white text-xl font-semibold">
                      Pressure
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-4 flex-auto">
                <!-- Chart -->
                <div id="pressureContainer" class="relative h-350-px">
                  <canvas id="pressure"></canvas>                  
                </div>
              </div>
              
          </div>
          <div
              class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
            >
              <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                  <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                      Overview
                    </h6>
                    <h2 class="text-white text-xl font-semibold">
                      Hygrometry
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-4 flex-auto">
                <!-- Chart -->
                <div id="hygrometryContainer" class="relative h-350-px">
                  <canvas id="hygrometry" ></canvas>
                </div>
              </div>
          </div>

          <div
              class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
            >
              <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                  <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                      Overview
                    </h6>
                    <h2 class="text-white text-xl font-semibold">
                      Brightness
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-4 flex-auto">
                <!-- Chart -->
                <div id="brightnessContainer" class="relative h-350-px">
                  <canvas id="brightness"></canvas>
                </div>
              </div>   
          </div>

          <div
              class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700"
            >
              <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div class="flex flex-wrap items-center">
                  <div class="relative w-full max-w-full flex-grow flex-1">
                    <h6 class="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                      Overview
                    </h6>
                    <h2 class="text-white text-xl font-semibold">
                      Wind Velocity
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-4 flex-auto">
                <!-- Chart -->
                <div id="windVelocityContainer" class="relative h-350-px">
                  <canvas id="windVelocity"></canvas>
                </div>
              </div>
          </div>
      
      </div>
     
  </div>
</template>
<script>
//import CardLineChart from "@/components/Cards/CardLineChart.vue";
import Chart from "chart.js";
export default {
  name: "dashboard-page",
  data() {
    return {
      parameters: ["temperature","pressure","hygrometry","brightness","windVelocity"],
      timestamp: "",
      sonde: "piensg031",
      duration: "week",

      minWeek: 30,
      minMonth: 360,
      minYear: 1440,

      temperatureChart: "Temperature History",
      temperatureTime: [],
      temperatureData: [],

      pressureChart: "Pressure History",
      pressureData: [],
      pressureTime: [],

      hygrometryChart: "Hygrometry History",
      hygrometryTime: [],
      hygrometryData: [],

      brightnessChart: "Luminosity History",
      brightnessTime: [],
      brightnessData: [],

      windVelocityChart: "Wind velocity History",
      windVelocityTime: [],
      windVelocityData: [],
    }
  },
  mounted() {
    this.$nextTick(function (){
      this.getLastWeek();
    this.datas();
    })
    
  },
  methods: {
    datas: function () {
      this.$nextTick(function (){
        let sample = -1;
      const delay = this.getDelay();
      const url = "http://" + this.sonde + ":8080/data/temperature,pressure,hygrometry,brightness,windvelocity/";
      fetch(url + this.timestamp)
        .then(result => result.json())
        .then(result => {
          const tempTime = result.temperature.date;
          const tempData = result.temperature.value;

          const pressTime = result.pressure.date;
          const pressData = result.pressure.value;

          const hygroTime = result.hygrometry.date;
          const hygroData = result.hygrometry.value;

          const lumTime = result.brightness.date;
          const lumData = result.brightness.value;

          const windTime = result.windvelocity.date;
          const windData = result.windvelocity.value;

          this.temperatureTime = tempTime.filter(elementTime => 
            tempTime.indexOf(elementTime) % (delay) == 0
          );
          this.temperatureData = tempData.filter(() => {
            sample++;
            return sample % (delay) == 0;
          });

          this.pressureTime = pressTime.filter(elementTime => 
            pressTime.indexOf(elementTime) % (delay) == 0
          );
          this.pressureData = pressData.filter(() => {
            sample++;
            return sample % (delay) == 0;
          });

          this.hygrometryTime = hygroTime.filter(elementTime => 
            hygroTime.indexOf(elementTime) % (delay) == 0
          );
          this.hygrometryData = hygroData.filter(() => {
            sample++;
            return sample % (delay) == 0;
          });

          this.brightnessTime = lumTime.filter(elementTime => 
            lumTime.indexOf(elementTime) % (delay) == 0
          );
          this.brightnessData = lumData.filter(() => {
            sample++;
            return sample % (delay) == 0;
          });

          this.windVelocityTime = windTime.filter(elementTime => 
            windTime.indexOf(elementTime) % (delay) == 0
          );
          let windAvgData = [];
          windData.forEach(element => 
            windAvgData.push(element.avg)
          );
          this.windVelocityData = windAvgData.filter(() => {
            sample++;
            return sample % (delay) == 0;
          });
          
          this.parameters.forEach(parametre => {
            
            let parametreForTime = parametre +"Time";
            let parametreForData = parametre +"Data";
            const config = {
              type: "line",
              data: {
                labels: this[parametreForTime],
                datasets: [
                  {
                    label: parametre,
                    backgroundColor: "#4c51bf",
                    borderColor: "#4c51bf",
                    data: this[parametreForData],
                    fill: false,
                  },
                ],
              },
              options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                  display: false,
                  text: "Sales Charts",
                  fontColor: "white",
                },
                legend: {
                  labels: {
                    fontColor: "white",
                  },
                  align: "end",
                  position: "bottom",
                },
                tooltips: {
                  mode: "index",
                  intersect: false,
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontColor: "rgba(255,255,255,.7)",
                      },
                      display: true,
                      scaleLabel: {
                        display: false,
                        labelString: "Month",
                        fontColor: "white",
                      },
                      gridLines: {
                        display: false,
                        borderDash: [2],
                        borderDashOffset: [2],
                        color: "rgba(33, 37, 41, 0.3)",
                        zeroLineColor: "rgba(0, 0, 0, 0)",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        fontColor: "rgba(255,255,255,.7)",
                      },
                      display: true,
                      scaleLabel: {
                        display: false,
                        labelString: "Value",
                        fontColor: "white",
                      },
                      gridLines: {
                        borderDash: [3],
                        borderDashOffset: [3],
                        drawBorder: false,
                        color: "rgba(255, 255, 255, 0.15)",
                        zeroLineColor: "rgba(33, 37, 41, 0)",
                        zeroLineBorderDash: [2],
                        zeroLineBorderDashOffset: [2],
                      },
                    },
                  ],
                },
              },
            };
            document.getElementById(parametre+"Container").innerHTML = '&nbsp;';
            document.getElementById(parametre+"Container").innerHTML = '<canvas id="'+parametre+'"></canvas>';

            let canvas = document.getElementById(parametre);
            let ctx = canvas.getContext('2d');
            //ctx.canvas.width = document.getElementById(parametre+"Container").offsetWidth // resize to parent width
            //ctx.canvas.height = document.getElementById(parametre+"Container").offsetHeight
            
            window.myLine = new Chart(ctx, config);
            setTimeout(function() { window.myLine.update(); },100);
          });
        })
        .catch(console.error);
      })
    },
    updateStats () {
      if (this.duration == "week") {
        this.getLastWeek();
      } else if (this.duration == "month"){
        this.getLastMonth();
      } else if (this.duration == "year"){
        this.getLastYear();
      }
      this.datas();
    },
    getLastWeek () {
      const lastWeek = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
      const date = lastWeek.getFullYear() + '-' + ((lastWeek.getMonth()+1) < 10 ? "0" : "") + (lastWeek.getMonth()+1) + '-' + ((lastWeek.getDate()-1) < 10 ? "0" : "") + (lastWeek.getDate());
      const time = lastWeek.getHours() + ":" + (lastWeek.getMinutes() < 10 ? "0" : "") + lastWeek.getMinutes() + ":" + (lastWeek.getSeconds() < 10 ? "0" : "") + lastWeek.getSeconds();
      const dateTime = date +'T'+ time + 'Z';
      this.timestamp = dateTime;
    },
    getLastMonth () {
      const lastMonth = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      const date = lastMonth.getFullYear() + '-' + ((lastMonth.getMonth()+1) < 10 ? "0" : "") + (lastMonth.getMonth()+1) + '-' + ((lastMonth.getDate()-1) < 10 ? "0" : "") + (lastMonth.getDate());
      const time = lastMonth.getHours() + ":" + (lastMonth.getMinutes() < 10 ? "0" : "") + lastMonth.getMinutes() + ":" + (lastMonth.getSeconds() < 10 ? "0" : "") + lastMonth.getSeconds();
      const dateTime = date +'T'+ time + 'Z';
      this.timestamp = dateTime;
    },
    getLastYear () {
      const lastYear = new Date(Date.now() - (52 * 7 * 24 * 60 * 60 * 1000));
      const date = lastYear.getFullYear() + '-' + ((lastYear.getMonth()+1) < 10 ? "0" : "") + (lastYear.getMonth()+1) + '-' + ((lastYear.getDate()-1) < 10 ? "0" : "") + (lastYear.getDate());
      const time = lastYear.getHours() + ":" + (lastYear.getMinutes() < 10 ? "0" : "") + lastYear.getMinutes() + ":" + (lastYear.getSeconds() < 10 ? "0" : "") + lastYear.getSeconds();
      const dateTime = date +'T'+ time + 'Z';
      this.timestamp = dateTime;
    },
    getDelay () {
      switch (this.duration) {
        case "week":
          return this.minWeek;
          case "month":
          return this.minMonth; 
          case "year":
          return this.minYear;     
        default:
          break;
      }
    }
  },
  // components: {
  //   CardLineChart,
  // },
};
</script>
