
# Overlock Node.js library

The overlock Node.js library should allow logging of messages from the device, as well as on behalf of other devices and with associations.

**NOTE:** Unfortunately there is a concept of `node`s in Overlock, which somewhat complicates references to node in this document. Wherever we mean Node.js, we will state it explicitly. All other references to node, are Overlock nodes.

## API Docs

### Install

The overlock library needs to have install called. This will patch on to `console.log` et al. in order to automatically pick up existing log messages in your application. This can be disabled.

```javascript
import Overlock as ol from 'overlock'

ol.install("node-process-name", {version: "2.1.0"})

```

Signature
`ol.install(processName, [metadata], [disableConsoleLog], [jsonReplacer])`

* `processName` A string, which is the name of the process
* `metadata` An Object, which has key/value information
* `disableConsoleLog` Boolean. Default false. If True, messages from `console.log` will not be picked up by overlock. 
* `jsonReplacer` A custom function to pass to `JSON.stringify` when encoding state


### Logging

Logging is the primary way to capture information about the execution of a program in overlock.

Example:

```javascript

// Basic logging
ol.log("This is a log message")

// Log as device
ol.log("This is as a different device", {log_as: "device123"})

// Log with related device
ol.log("This is associated with the other node too", {related: "device234"})

// Log with a level
ol.log("This is an error", {level: 100})

// Also with a pre-set level
ol.error("This is an error")

```

Signature:

`ol.log(msg, opts)`

* `msg` A string, which contains a message to debug
* `opts` An object with keys:
    * `level`: The log level (goes straight to agent API)
    * `log_as`: Log as if the message were from another node
    * `related`: Log with an association

`ol.error`, `ol.warn`, `ol.debug`, `ol.info` should all just be proxies to `log` with the log `level` set.

### Lifecycle

Lifecycle events can be logged to allow high level information and events to be captured.

```javascript

// Lifecycle event
ol.lifecycle_event("boot", "Booted up")

// For another device
ol.lifecycle_event("network-disconnect", "Unexpected Disconnected!", {log_as: "device234"})

```

Signature:

`ol.lifecycle_event(type, msg, opts)`

* `type` A string type for a supported or custom lifecycle event
* `msg` A string which describes the event
* `opts` An object with keys:
    * `log_as`: Log as if the message were from another node
    * `related`: Log with an association

### Metadata

Allows storing of values about a node which do not change very often.

```javascript

ol.update_metadata({version: "10.000"})

```

Signature:

`ol.update_metadata(values)`

* `values` An object which contains the keys to merge in to the metadata. Values will be converted to strings, and Falsy values will be removed from metadata.

### Setting state

```javascript

// set a key
ol.update_state({sensor: 120})

// delete a key
ol.delete_state({sensor: true})

```
