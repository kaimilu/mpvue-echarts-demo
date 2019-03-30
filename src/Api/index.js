import request from '../utils/request'

export function getEchartOption (url, params) {
  return request.get(`/${url}`, params)
}
