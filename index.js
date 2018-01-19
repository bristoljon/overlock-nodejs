const http = require('http');
const fetch = require('node-fetch')
const queryString = require('query-string')

let processName, jsonReplacer;

function post(url, _params, payload) {
  const params = Object.assign({ process_name: processName }, _params)
  const baseUrl = 'http://unix:/var/run/overlock.sock'
  const query = queryString.stringify(params)
  const body = JSON.stringify(payload)
  fetch(`${baseUrl}${url}${query && '?' + query}`, { method: 'POST', body })
}

function postMetaData(metaData) {
  // Check whether need to implement logAs for metaData
  post('/api/v1/metadata', { processName }, metaData)
}

function install(_processName, metaData, disableConsoleLog = false, jsonReplacer) {
  processName = _processName
  jsonReplacer = _jsonReplacer
  postMetaData(metaData)
  if (disableConsoleLog) return
  const nativeLog = console.log
  console.log = function(msg) {
    nativeLog(aruments)
    postLog(msg, { })
  }
}
