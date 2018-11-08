<template>
<el-card class="box-card">
  <my-bread level1="数据统计" level2="数据报表"></my-bread>
  <div id="main" ref="main" style="width:600px;height:400px"></div>
</el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted () {
    this.loadEcharts()
  },
  methods: {
    async loadEcharts() {
      var myChart = echarts.init(this.$refs.main);
      const res = await this.$http.get(`reports/type/1`)
      //  console.log(res)
      this.option1 = res.data.data

      const option2 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      };
      const option = {...this.option1,...option2};
       myChart.setOption(option);
      console.log(option)
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
</style>
