/**
 * [topDownRefresh 上下拉刷新公用函数]
 * Liang Fuzhi created in 2017-03-14
 * @type {Object}
 */
const topDownRefreshMixin = {
  data () {
    return {
      options: {}, // 参数
      pageNum: 1, // 第几页
      pageSize: 10, // 每页多少条数据
      pageCount: 1, // 总页数
      dataList: [] // 数据
    }
  },
  methods: {
    // 初始化读取数据
    onRefreshInit (options = {}, toast) {
      this.pageNum = 1
      this.pageCount = 1
      this.options = options
      this.onRefreshPageCount(() => {
        this.onRefreshGet((data) => {
          this.dataList = []
          this.dataList = data
          this.$refs.boxContent && this.$refs.boxContent.reset()
          this.pageNum++
          if (toast) {
            this.$vux.toast.show({
              text: '刷新成功'
            })
          }
        }, () => {
          this.$refs.boxContent.reset()
          this.$refs.boxContent.pauseLoading()
        })
      }, () => {
        this.$refs.boxContent.reset()
        this.$refs.boxContent.pauseLoading()
      })
    },
    // 获取数据
    onRefreshGet (cb, err) {
      if (this.options.baseUrl) {
        this.$http.get(this.options.baseUrl, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.options.parameter
        }).then((response) => {
          cb && cb(response.data)
        })
          .catch((e) => {
            err && err(e.response)
          })
      }
    },
    // 获取数据页数
    onRefreshPageCount (cb, err) {
      if (this.options.baseUrl) {
        this.$http.getTotal(this.options.baseUrl, {
          pageSize: this.pageSize,
          ...this.options.parameter
        }).then((response) => {
          this.pageCount = response.data.ret
          cb && cb()
        })
          .catch((e) => {
            err && err(e.response)
          })
      }
    },
    // 下拉刷新
    onRefresh () {
      this.onRefreshInit(this.options, true)
    },
    // 上拉加载
    onLoading () {
      if (!this.isLoadAll) {
        this.onRefreshGet((data) => {
          // this.dataList=Object.assign([], this.dataList, data)
          for (let i in data) {
            this.dataList.push(data[i])
          }
          this.$refs.boxContent.reset()
          this.pageNum++
        }, () => {
          this.$refs.boxContent.reset()
          this.$refs.boxContent.pauseLoading()
        })
      }
    }
  },
  computed: {
    isLoadAll () {
      if (this.pageNum > this.pageCount) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    isLoadAll (val) {
      if (val) {
        this.$refs.boxContent.pauseLoading()
      } else {
        this.$refs.boxContent.startLoading()
      }
    }
  }
}
export default topDownRefreshMixin
