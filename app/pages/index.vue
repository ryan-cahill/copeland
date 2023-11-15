<template>
  <div>
    <UContainer>
      <UCard class="mt-10">
        <template #header>
          <div class="flex justify-between">
            <div v-if="mapData.name" class="text-4xl">Weather in {{ mapData.name }}</div>
            <div v-else class="text-4xl">Welcome to the weather explorer</div>
          </div>
        </template>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <div id="map" class="data-container"></div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <UInput v-model="zipCode" placeholder="Zip Code" />
              <UButton class="request-button" icon="i-heroicons-paper-airplane" :disabled="loadingResult" @click="searchZipCode">Submit</UButton>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <UInput v-model="cityState" placeholder="City" />
              <UButton class="request-button" icon="i-heroicons-paper-airplane" :disabled="loadingResult" @click="searchCity">Submit</UButton>
            </div>
          </div>
          
          <div class="data-container">
            <div v-if="Object.keys(mapData).length" class="grid grid-cols-2 gap-2 mt-2">
              <div>Description:</div><div>{{ mapData.weather[0].main }} - {{ mapData.weather[0].description }}</div>
              <div>Temperature:</div><div>{{ mapData.main.temp }}</div>
              <div>Feels like:</div><div>{{ mapData.main.feels_like }}</div>
              <div>Minimum Temperature:</div><div>{{ mapData.main.temp_min }}</div>
              <div>Maximum Temperature:</div><div>{{ mapData.main.temp_max }}</div>
              <div>Wind speed:</div><div>{{ mapData.wind.speed }} knots</div>
              <div>Wind gusting to:</div><div>{{ mapData.wind.gust || 0 }} knots</div>
            </div>
            <div v-else>
              Click on the map or submit a zip code or city/state combination within the United States in order to view weather data.
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>
    <UNotifications />
  </div>
</template>

<script setup>
  const toast = useToast();

  let zipCode = ref('02127');
  let cityState = ref('Boston, MA');
  let mapData = ref({});
  let loadingResult = ref(false);

  let googleMap;
  if (process.client) {
    // Reference: https://developers.google.com/maps/documentation/javascript/load-maps-js-api
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: "AIzaSyBdkPza-kJlWibpauvHt5dRxH0ooxMQp88",
      v: "weekly",
    });

    async function initGoogleMap() {
      const { Map } = await google.maps.importLibrary("maps");
      googleMap = new Map(document.getElementById("map"), {
        center: { lat: 42.353883773410054, lng: -71.05451969921876 },
        zoom: 8,
      });
    }
    await initGoogleMap();

    googleMap.addListener('click', async (event) => {
      loadingResult = true;
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      const { data, error } = await useFetch(`http://localhost:3000/weather/current`, { query: {
        latitude,
        longitude
      }});
      if (error.value) {
        toast.add({ title: 'Error fetching data', description: error.value.message });
        loadingResult = false;
        return;
      }
      mapData.value = data.value;
      moveGoogleMap(data.value.coord);
      loadingResult = false;
    });
  }

  async function searchCity() {
    loadingResult = true;
    const { data, error } = await useFetch(`http://localhost:3000/weather/current`, { query: {
      cityState
    }});

    if (error.value) {
      toast.add({ title: 'Error fetching data', description: error.value.message });
      loadingResult = false;
      return;
    }
    mapData.value = data.value;
    moveGoogleMap(data.value.coord);
    loadingResult = false;
  }

  async function searchZipCode() {
    loadingResult = true;
    const { data, error } = await useFetch(`http://localhost:3000/weather/current`, { query: {
      zipCode
    }});
    
    if (error.value) {
      toast.add({ title: 'Error fetching data', description: error.value.message });
      loadingResult = false;
      return;
    }
    mapData.value = data.value;
    moveGoogleMap(data.value.coord);
    loadingResult = false;
  }

  function moveGoogleMap(coord) {
    const center = new google.maps.LatLng(coord.lat, coord.lon);
    googleMap.panTo(center);
  }
</script>

<style>
  .request-button {
    max-width: 100px; 
    margin-left: auto;
  }

  .data-container {
    width:100%; 
    height: 500px; 
    margin-left: auto; 
    margin-right: auto;
  }
</style>
