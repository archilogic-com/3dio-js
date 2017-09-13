// configs

var maxConcurrentQueuedRequests = 15 // not queued requests are not limited in running parallel
var queuesByPriority = [
  'architectureGeometries',
  'architectureTexturesLoRes',
  'interiorGeometries',
  'interiorTexturesLoRes',
  'architectureTexturesHiRes',
  'interiorTexturesHiRes'
]

var queueFences = [
  false,
  false,
  true,
  false,
  false
]

// prepare objects for queueing
var _queues = {}
var _queueFences = {}
var _queuesChanged = false
window.queueInfo = {}
var _queuesLength = queuesByPriority.length
var _concurrentRequests = 0
var _concurrentPerQueue = {}
window.loadingQueueData = ''

var queueName
for (var i = 0, l = _queuesLength; i < l; i++) {
  queueName = queuesByPriority[i]
  _queues[queueName] = []
  _queueFences[queueName] = queueFences[i]
  window.queueInfo[queueName] = {requestCount: 0}
  _concurrentPerQueue[queueName] = 0
}

window.loadingQueueAlgorithm     = 'overstep-one-fenced';
window.loadingQueuePipelineDepth = maxConcurrentQueuedRequests;
//window.loadingQueueGraph         = false;
//if (window.loadingQueueGraph)
//  window.loadingPerformanceHistory = new PerformanceGraph.PerformanceHistory(64);
//
//window.loadingQueueShowInfo = function() {
//  function padRight(text, fieldLength) {
//    return text + Array(fieldLength - text.length + 1).join(' ');
//  }
//  function padLeft(text, fieldLength) {
//    return Array(fieldLength - text.length + 1).join(' ') + text;
//  }
//  var text = '';
//  var keys = Object.keys(window.queueInfo);
//  var baseTime;
//  if (keys.length > 0) {
//    var baseKey   = keys[0];
//    var baseValue = window.queueInfo[baseKey];
//    baseTime = baseValue.timeFirst;
//    text += '(' + baseTime.toFixed(1) + ')\n'
//  }
//  for (var i = 0; i < keys.length; i++) {
//    var key   = keys[i];
//    var value = window.queueInfo[key];
//    text += padRight(keys[i], 28) + ': ';
//    if (value.requestCount > 0) {
//      var t1 = value.timeFirst - baseTime;
//      var t2 = value.timeLast - baseTime;
//      var t1Str = t1.toFixed(1);
//      var t2Str = t2.toFixed(1);
//      var t3, d, t3Str, dStr;
//      if (value.timeLastFinished) {
//        t3 = value.timeLastFinished - baseTime;
//        d  = t3 - t1;
//        t3Str = t3.toFixed(1);
//        dStr  = d.toFixed(1);
//      } else {
//        t3Str = '-';
//        dStr  = '-';
//      }
//      text += padLeft(t1Str, 5) + ' - ' + padLeft(t2Str, 5) + ' / ' + padLeft(t3Str, 5) + ' (' + padLeft(dStr, 5) + ') [' + padLeft(value.requestCount.toString(), 4) + ']\n';
//    } else
//      text += '<inactive>\n'
//  }
//  console.log(text);
//}
//
//window.loadingQueueProcessData = function() {
//  var loadingQueueDataLines = window.loadingQueueData.split('\n');
//  var i = 0;
//  while (i < loadingQueueDataLines.length) {
//    var line = loadingQueueDataLines[i];
//    var count = 0;
//    for (var j = i; i < loadingQueueDataLines.length; j++) {
//      var nextLine = loadingQueueDataLines[j];
//      if (line === nextLine)
//        count++;
//      else
//        break;
//    }
//    if (count > 8) {
//      loadingQueueDataLines.splice(i + 4, count - 8, ' ');
//      loadingQueueDataLines.
//        i += 4
//    } else
//      i += 1;
//  }
//  window.loadingQueueDataShort = loadingQueueDataLines.join('\n');
//}

function _addPerformanceEntry() {
  var performanceEntry = window.loadingPerformanceHistory.newEntry(PerformanceGraph.PerformanceEntry);
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    performanceEntry[queueName] = _concurrentPerQueue[queueName];
  }
  // performanceEntry.none = window.loadingQueuePipelineDepth - _concurrentRequests;
}

function _appendLoadingQueueData() {
  var entry = '';
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    entry += _concurrentPerQueue[queueName].toString();
    if (i < _queuesLength - 1)
      entry += ', ';
    else
      entry += '\n';
  }
  window.loadingQueueData += entry;
}

function _startRequest(queueName) {
  // Update queue tracking information
  var queueInfo = window.queueInfo[queueName];
  var time = performance.now() / 1000;
  if (typeof queueInfo.timeFirst === 'undefined') {
    queueInfo.timeFirst = time;
    queueInfo.timeLast  = time;
  } else
    queueInfo.timeLast  = time;
  queueInfo.requestCount++;
  // Update concurrent request counts
  _concurrentPerQueue[queueName] += 1;
  _concurrentRequests++;
  //
  _queuesChanged = true;
  // Start request
  // console.log('[' + (' ' + _concurrentRequests).slice(-2) + ']: Starting ' + queueName);
  var queue = _queues[queueName];
  var request = queue.shift();
  request.start();
}

function _doProcessQueueOriginal() {
  if (_concurrentRequests >= window.loadingQueuePipelineDepth)
    return;
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    if (_queues[queueName].length > 0) {
      _startRequest(queueName);
      break;
    } else if (_concurrentPerQueue[queueName] !== 0)
      break;
  }
}

function _doProcessQueueOriginalFixed(){
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
      _startRequest(queueName)
    if (_concurrentPerQueue[queueName] !== 0)
      break;
  }
}

function _doProcessQueueOverstep(){
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
      _startRequest(queueName)
  }
}

function _doProcessQueueOverstepOne(){
  var anchorStage = null;
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
      _startRequest(queueName)
    if (anchorStage === null && _concurrentPerQueue[queueName] !== 0)
      anchorStage = i;
    if (anchorStage !== null && i - anchorStage > 0)
      break;
  }
}

function _doProcessQueueOverstepFenced(){
  var anchorStage = null;
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
      _startRequest(queueName)
    if (anchorStage === null && _concurrentPerQueue[queueName] !== 0)
      anchorStage = i;
    if (anchorStage !== null && _queueFences[queueName])
      break;
  }
}

function _doProcessQueueOverstepOneFenced(){
  var anchorStage = null;
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
      _startRequest(queueName)
    if (anchorStage === null && _concurrentPerQueue[queueName] !== 0)
      anchorStage = i;
    if (anchorStage !== null && (_queueFences[queueName] || (i - anchorStage > 0)))
      break;
  }
}

function _processQueue() {
  if (window.loadingQueueAlgorithm === 'original')
    _doProcessQueueOriginal()
  else if (window.loadingQueueAlgorithm === 'original-fixed')
    _doProcessQueueOriginalFixed()
  else if (window.loadingQueueAlgorithm === 'overstep')
    _doProcessQueueOverstep()
  else if (window.loadingQueueAlgorithm === 'overstep-one')
    _doProcessQueueOverstepOne()
  else if (window.loadingQueueAlgorithm === 'overstep-fenced')
    _doProcessQueueOverstepFenced()
  else if (window.loadingQueueAlgorithm === 'overstep-one-fenced')
    _doProcessQueueOverstepOneFenced()
  else
    throw 'Http._processQueue: Unknown loading queue processing algorithm.'
  if (_queuesChanged) {
    if (window.loadingQueueGraph)
      _addPerformanceEntry();
    _appendLoadingQueueData();
    _queuesChanged = false;
  }
}

function _enqueue(queueName, url){
  
  //// fallback to last queue
  //if (!_queues[queueName]) queueName = queuesByPriority[_queuesLength-1]

  // fallback to first queue
  if (!_queues[queueName]) {
    if (queueName) console.error('onknown queue ', queueName)
    queueName = queuesByPriority[0]
  }

  // create promise and add to queue
  return new Promise(function(resolve, reject){
    // has to be asynchronous in order to decouple queue processing from synchronous code
    setTimeout(function(){
      var queue = _queues[queueName]
      queue[ queue.length ] = { url: url, start: resolve }
      _processQueue()
    },1)
  })

}

function _dequeue(queueName, url) {
  var queueInfo = window.queueInfo[queueName];
  if (!queueInfo) {
    if (queueName) console.warn('Queue info not found for queue name "'+queueName+'"')
    return
  }
  var time = performance.now() / 1000;
  queueInfo.timeLastFinished = time;
  var t1 = queueInfo.timeFirst;
  var t2 = queueInfo.timeLast;
  var t3 = queueInfo.timeLastFinished;
  var d  = t3 - t1;
  _concurrentPerQueue[queueName] -= 1
  _concurrentRequests -= 1
  _queuesChanged = true;
  _processQueue()
}

// expose API

var queueManager = {
  enqueue: _enqueue,
  dequeue: _dequeue
}

window.setInterval(function(){
  _processQueue()
},1000)

export default queueManager