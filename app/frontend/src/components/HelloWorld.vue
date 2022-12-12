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

<script>
import axios from 'axios';

export default {
  name: 'ApiPing',
  data() {
    return {
      msg: '',
    };
  },
  methods: {
    getMessage() {
      axios.get('/api_v1/maps')
        .then((res) => {
          this.msg = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.getMessage();
  },
};
</script>

