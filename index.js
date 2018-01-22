const http = require('http');
const fetch = require('node-fetch')
const queryString = require('query-string')

let process_name, jsonReplacer;

const version = '1.0.0'
const baseUrl = 'http://unix:/var/run/overlock.sock'
const method = 'POST'

function post(url, payload, params = {}) {
  const _params = { process_name, ...params }
  const _payload = { version, ...payload }
  const query = queryString.stringify(_params)
  const body = JSON.stringify(_payload)
  fetch(`${baseUrl}${url}${query && '?' + query}`, { method, body })
}

function postLog(log, logAs) {
  post(
    '/api/v1/log',
    {
      logs: [{
        ...log,
        ts: Date.now(),
      }]
    },
    logAs ? { device_id: logAs } : undefined,
  )
}

function postMetaData(metaData) {
  // Check whether need to implement logAs for metaData
  post('/api/v1/metadata', { metaData })
}

function postState(state) {
  post('/api/v1/state', { state })
}

// function postLifecycle(type, message, options) {
//   // TODO: Clarify expected lifecycle message fields
//   post('/api/v1/lifecycle', { type, message, ...options })
// }

function log(message, { severity = 10, logAs, related = [] } = {}) {
  postLog({ message, severity, related }, logAs)
}

function install(_process_name, metaData, disableConsoleLog = false, jsonReplacer) {
  process_name = _process_name
  jsonReplacer = _jsonReplacer
  postMetaData(metaData)
  if (disableConsoleLog) return
  const nativeLog = console.log
  const nativeError = console.error
  console.log = function(message) {
    postLog({ message })
    nativeLog(...aruments)
  }
  console.error = function({ message, stack }) {
    postErrorLog({ message, traceback: stack, severity: 50 })
    nativeError(...aruments)
  }
}

module.exports = {
  install,
  log,
}
