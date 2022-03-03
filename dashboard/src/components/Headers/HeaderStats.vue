<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 md:pt-32 pb-32 pt-12">
    <div class="px-4 md:px-10 mx-auto w-full">
      <div>
        <!-- Card stats -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="Temperature"
              :statTitle="temperature"
              :statArrow="arrowTemperature"
              :statPercent="diffTemperature"
              statPercentColor="text-emerald-500"
              statDescripiron="Since yesterday"
              statIconName="fas fa-thermometer-half"
              statIconColor="bg-red-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="Pressure"
              :statTitle="pressure"
              :statArrow="arrowPressure"
              :statPercent="diffPressure"
              statPercentColor="text-red-500"
              statDescripiron="Since yesterday"
              statIconName="fas fa-compress-arrows-alt"
              statIconColor="bg-orange-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="Hygrometry"
              :statTitle="hygrometry"
              :statArrow="arrowHygrometry"
              :statPercent="diffHygrometry"
              statPercentColor="text-orange-500"
              statDescripiron="Since yesterday"
              statIconName="fas fa-cloud-rain"
              statIconColor="bg-pink-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="Luminosity"
              :statTitle="luminosity"
              :statArrow="arrowLuminosity"
              :statPercent="diffLuminosity"
              statPercentColor="text-emerald-500"
              statDescripiron="Since yesterday"
              statIconName="fas fa-sun"
              statIconColor="bg-emerald-500"
            />
          </div>
          <div class="w-full lg:w-6/12 xl:w-3/12 px-4">
            <card-stats
              statSubtitle="Wind Velocity"
              :statTitle="windSpeed"
              :statArrow="arrowWindSpeed"
              :statPercent="diffWindSpeed"
              statPercentColor="text-emerald-500"
              statDescripiron="Since yesterday"
              statIconName="fas fa-wind"
              statIconColor="bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardStats from "@/components/Cards/CardStats.vue";

export default {
  name: "header-stats",
  data() {
    return {
      timestamp: "",

      temperature: "10.0",
      diffTemperature: "1",
      arrowTemperature: "up",

      pressure: "995",
      diffPressure: "1",
      arrowPressure: "up",

      hygrometry: "145",
      diffHygrometry: "1",
      arrowHygrometry: "up",

      luminosity: "10.0",
      diffLuminosity: "1",
      arrowLuminosity: "up",

      windSpeed: "10.0",
      diffWindSpeed: "1",
      arrowWindSpeed: "up",
    }
  },
  mounted() {
    this.getYesterday();
    this.stats();
  },
  methods: {
    stats () {
      let url = "http://piensg031:8080/data/Temperature,Pressure,Hygrometry,Luminosity,WindVelocity/";
  
      fetch(url + this.timestamp)
        .then(result => result.json())
        .then(result => { 
          let length = result.temperature.value.length;
          this.temperature = result.temperature.value[length - 1];
          this.pressure = result.pressure.value[length - 1];
          this.hygrometry = result.hygrometry.value[length - 1];
          this.luminosity = result.luminosity.value[length - 1];
          this.windSpeed = result.windvelocity.value[length - 1].avg;

          this.diffTemperature = parseFloat((this.temperature - result.temperature.value[0]).toFixed(2));
          this.arrowTemperature = this.diffTemperature < 0 ? "down" : "up";
          if (this.diffTemperature < 0)
            this.diffTemperature *= -1;
          
          this.diffPressure = parseFloat((this.pressure - result.pressure.value[0]).toFixed(2));
          this.arrowPressure = this.diffPressure < 0 ? "down" : "up";
          if (this.diffPressure < 0)
            this.diffPressure *= -1;
          
          this.diffHygrometry = parseFloat((this.hygrometry - result.hygrometry.value[0]).toFixed(2));
          this.arrowHygrometry = this.diffHygrometry < 0 ? "down" : "up";
          if (this.diffHygrometry < 0)
            this.diffHygrometry *= -1;

          this.diffLuminosity = parseFloat((this.luminosity - result.luminosity.value[0]).toFixed(2));
          this.arrowLuminosity = this.diffLuminosity < 0 ? "down" : "up";
          if (this.diffLuminosity < 0)
            this.diffLuminosity *= -1;

          this.diffWindSpeed = parseFloat((this.windSpeed - result.windvelocity.value[0].avg).toFixed(2));
          this.arrowWindSpeed = this.diffWindSpeed < 0 ? "down" : "up";
          if (this.diffWindSpeed < 0)
            this.diffWindSpeed *= -1;
        })
        .catch(console.error);
    },
    getYesterday () {
      const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));
      const date = yesterday.getFullYear() + '-' + ((yesterday.getMonth()+1) < 10 ? "0" : "") + (yesterday.getMonth()+1) + '-' + ((yesterday.getDate()-1) < 10 ? "0" : "") + (yesterday.getDate());
      const time = yesterday.getHours() + ":" + (yesterday.getMinutes() < 10 ? "0" : "") + yesterday.getMinutes() + ":" + (yesterday.getSeconds() < 10 ? "0" : "") + yesterday.getSeconds();
      const dateTime = date +'T'+ time + 'Z';
      this.timestamp = dateTime;
    }
  },
  components: {
    CardStats,
  },
};
</script>
