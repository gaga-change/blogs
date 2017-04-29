import axios from 'axios'
import Vue from 'vue'
let options = {}
// The server-side needs a full url to works
if (process.SERVER_BUILD) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
}
var instance = axios.create(options);

export default instance

