/**
 * 用promise封装jsonp
 */

import requestJSONP from 'jsonp';

//拼接url
function param(data) {
  let url = '';
  for (let i in data) {
    let value  = (data[i] !== undefined) ? data[i] : "";
        url   += `&${i}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1): ""
}


export default function jsonp(url, data, opts) {
  url += ((url.indexOf('?') === -1) ? '?' : '&') + param(data);
  return new Promise((resolve, reject) => {
    requestJSONP(url, opts, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
