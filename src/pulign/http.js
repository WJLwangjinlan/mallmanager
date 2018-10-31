// 导入
import axios from 'axios'
const HttpTool = {}
HttpTool.install = (Vue) => {
  // 接口地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
}
// 导出
export default HttpTool