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
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart 
          measurement="Temperature (°C)"
          chartId="TemperatureChart"
          :chartTitle="temperatureChart"
          :chartTime="temperatureTime"
          :chartData="temperatureData"
        />
      </div>
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart 
          measurement="Pressure (°C)"
          chartId="PressureChart"
          :chartTitle="pressureChart"
          :chartTime="pressureTime"
          :chartData="pressureData"
        />
      </div>
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart 
          measurement="Hygrometry (°C)"
          chartId="HygrometryChart"
          :chartTitle="hygrometryChart"
          :chartTime="hygrometryTime"
          :chartData="hygrometryData"
        />
      </div>
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart 
          measurement="Luminosity (°C)"
          chartId="LuminosityChart"
          :chartTitle="luminosityChart"
          :chartTime="luminosityTime"
          :chartData="luminosityData"
        />
      </div>
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart 
          measurement="Wind velocity (°C)"
          chartId="WindVelocityChart"
          :chartTitle="windVelocityChart"
          :chartTime="windVelocityTime"
          :chartData="windVelocityData"
        />
      </div>
    </div>
  </div>
</template>
<script>
import CardLineChart from "@/components/Cards/CardLineChart.vue";
export default {
  name: "dashboard-page",
  data() {
    return {
      timestamp: "",
      sonde: "piensg031",

      temperatureChart: "Temperature History",
      temperatureTime: [],
      temperatureData: [],

      pressureChart: "Pressure History",
      pressureData: [],
      pressureTime: [],

      hygrometryChart: "Hygrometry History",
      hygrometryTime: [],
      hygrometryData: [],

      luminosityChart: "Luminosity History",
      luminosityTime: [],
      luminosityData: [],

      windVelocityChart: "Wind velocity History",
      windVelocityTime: [],
      windVelocityData: [],
    }
  },
  mounted() {
    this.getLastWeek();
    this.datas();
  },
  methods: {
    datas () {
      let sample = -1;
      const url = "http://" + this.sonde + ":8080/data/Temperature,Pressure,Hygrometry,Luminosity,WindVelocity/";
      console.log(this.sonde);
      fetch(url + this.timestamp)
        .then(result => result.json())
        .then(result => {
          const tempTime = result.temperature.date;
          const tempData = result.temperature.value;

          const pressTime = result.pressure.date;
          const pressData = result.pressure.value;

          const hygroTime = result.hygrometry.date;
          const hygroData = result.hygrometry.value;

          const lumTime = result.luminosity.date;
          const lumData = result.luminosity.value;

          const windTime = result.windvelocity.date;
          const windData = result.windvelocity.value;

          this.temperatureTime = tempTime.filter(elementTime => 
            tempTime.indexOf(elementTime) % (3 * 4) == 0
          );
          this.temperatureData = tempData.filter(() => {
            sample++;
            return sample % (3 * 4) == 0;
          });

          this.pressureTime = pressTime.filter(elementTime => 
            pressTime.indexOf(elementTime) % (3 * 4) == 0
          );
          this.pressureData = pressData.filter(() => {
            sample++;
            return sample % (3 * 4) == 0;
          });

          this.hygrometryTime = hygroTime.filter(elementTime => 
            hygroTime.indexOf(elementTime) % (3 * 4) == 0
          );
          this.hygrometryData = hygroData.filter(() => {
            sample++;
            return sample % (3 * 4) == 0;
          });

          this.luminosityTime = lumTime.filter(elementTime => 
            lumTime.indexOf(elementTime) % (3 * 4) == 0
          );
          this.luminosityData = lumData.filter(() => {
            sample++;
            return sample % (3 * 4) == 0;
          });

          this.windVelocityTime = windTime.filter(elementTime => 
            windTime.indexOf(elementTime) % (3 * 4) == 0
          );
          let windAvgData = [];
          windData.forEach(element => 
            windAvgData.push(element.avg)
          );
          this.windVelocityData = windAvgData.filter(() => {
            sample++;
            return sample % (3 * 4) == 0;
          });
        })
        .catch(console.error);
    },
    updateStats () {
      this.datas();
    },
    getLastWeek () {
      const lastWeek = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
      const date = lastWeek.getFullYear() + '-' + ((lastWeek.getMonth()+1) < 10 ? "0" : "") + (lastWeek.getMonth()+1) + '-' + ((lastWeek.getDate()-1) < 10 ? "0" : "") + (lastWeek.getDate());
      const time = lastWeek.getHours() + ":" + (lastWeek.getMinutes() < 10 ? "0" : "") + lastWeek.getMinutes() + ":" + (lastWeek.getSeconds() < 10 ? "0" : "") + lastWeek.getSeconds();
      const dateTime = date +'T'+ time + 'Z';
      this.timestamp = dateTime;
    }
  },
  components: {
    CardLineChart,
  },
};
</script>
