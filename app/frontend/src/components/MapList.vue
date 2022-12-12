<template>
   <div id="app">
     <h1>DewShare</h1>
     <div v-for="mapData in mapList" v-bind:key="mapData.id" class="map">
       <div>
         <span style="color:black;font-weight:bold;">Map Name:</span><span>{{ mapData.mapName }}</span>
       </div>
       <div>
        <span style="color:black;font-weight:bold;">Map Author:</span><span>{{ mapData.mapAuthor }}</span>
       </div>
       <div>
        <span style="color:black;font-weight:bold;">Map Description:</span><span>{{ mapData.mapDescription }}</span>
       </div>
       <div>
        <span style="color:black;font-weight:bold;">Downloads: </span><span>{{ mapData.map_downloads }}</span>
       </div>
       <v-btn color="primary" elevation="2">Download</v-btn>
     </div>
   </div>
</template>

<style>
.map {
  background-color: lightgrey;
  width: 300px;
  border: 15px solid rgb(5, 114, 150);
  padding: 50px;
  margin: 20px;
}
</style>

<script>
  import axios from 'axios';
  
  export default {
    name: 'MapList',
    data() {
      return {
        mapList: [],
      };
    },
    methods: {
      getMaps() {
        axios.get('/api_v1/maps')
          .then((res) => {
            this.mapList = res.data;
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
    created() {
      this.getMaps();
    },
  };
</script>