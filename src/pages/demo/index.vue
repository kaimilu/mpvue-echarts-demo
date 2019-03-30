<template>
  <div class="echarts-wrap">
    <div class="tab-btn">
      <div class="item" :class="{'cur': flag == 1}" @click="renderEchart(1)">年</div>
      <div class="item" :class="{'cur': flag == 2}" @click="renderEchart(2)">月</div>
    </div>
    <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" canvasId="demo-canvas" ref="echarts" />
  </div>
</template>

<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'

import {getEchartOption} from '@/Api'

let chart = null

export default {
  components: {
    mpvueEcharts
  },

  data () {
    return {
      option: null,
      echarts,
      flag: 1 // 1: 年
    }
  },

  methods: {
    async getData (flag) {
      let {data} = await getEchartOption('getEOptions', {month: flag})
      return data.data
    },
    async renderEchart (flag) {
      var _this = this
      if (flag && _this.flag === flag) return
      _this.flag = ~~flag ? flag : _this.flag
      let res = await this.getData(_this.flag)
      if (res.code === 0) {
        _this.setOption(res.data)
      } else {
        console.error(res.msg)
      }
    },
    // 设置
    setOption (data) {
      console.log(data, 'xxx')
      var colors = ['#37a2da', '#32c5e9', '#67e0e3']
      let option = null
      switch (~~this.flag) {
        case 1:
          option = {
            color: colors,
            tooltip: {
              trigger: 'none',
              axisPointer: {
                type: 'cross'
              }
            },
            legend: {
              data: ['2015 降水量', '2016 降水量']
            },
            grid: {
              top: 70,
              bottom: 50
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: colors[1]
                  }
                },
                axisPointer: {
                  label: {
                    formatter: function (params) {
                      return '降水量  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                    }
                  }
                },
                data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
              },
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: colors[0]
                  }
                },
                axisPointer: {
                  label: {
                    formatter: function (params) {
                      return '降水量  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                    }
                  }
                },
                data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
              }
            ],
            yAxis: [{ type: 'value' }],
            series: [
              {
                name: '2015 降水量',
                type: 'line',
                xAxisIndex: 1,
                data: data.series[0].data
              },
              {
                name: '2016 降水量',
                type: 'line',
                data: data.series[1].data
              }
            ]
          }
          break
        default:
          option = {
            title: {
              text: '某站点用户访问来源',
              subtext: '纯属虚构',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data.series[0].data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
      }
      console.log(JSON.stringify(option))
      this.option = option
      this.$refs.echarts.init()
    },

    handleInit (canvas, width, height) {
      chart = echarts.init(canvas, null, {width, height})
      canvas.setChart(chart)
      chart.setOption(this.option)
      return chart
    }
  },

  async mounted () {
    await this.renderEchart()
  },

  onunload () {
    console.log('离开页面')
  }
}
</script>

<style scope lang="scss">
.tab-btn{
  display: flex;
  justify-content: space-between;
  .item{
    flex: 1;
    text-align: center;
    &.cur{
      color: red;
    }
  }
}
.echarts-wrap {
  width: 100%;
  height: 300px;
}

</style>
