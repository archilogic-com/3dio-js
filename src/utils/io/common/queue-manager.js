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
var queueInfo = {}
var _queuesLength = queuesByPriority.length
var _concurrentRequests = 0
var _concurrentPerQueue = {}
var loadingQueueData = ''
var loadingQueueAlgorithm     = 'overstep-one-fenced';
var loadingQueuePipelineDepth = maxConcurrentQueuedRequests;

var queueName
for (var i = 0, l = _queuesLength; i < l; i++) {
  queueName = queuesByPriority[i]
  _queues[queueName] = []
  _queueFences[queueName] = queueFences[i]
  queueInfo[queueName] = {requestCount: 0}
  _concurrentPerQueue[queueName] = 0
}

function _startRequest(queueName) {
  // Update queue tracking information
  var info = queueInfo[queueName];
  var time = performance.now() / 1000;
  if (typeof info.timeFirst === 'undefined') {
    info.timeFirst = time;
    info.timeLast  = time;
  } else
    info.timeLast  = time;
  info.requestCount++;
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

function _processQueue() {
  var anchorStage = null;
  for (var i = 0; i < _queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (_queues[queueName].length > 0 && _concurrentRequests < loadingQueuePipelineDepth)
      _startRequest(queueName)
    if (anchorStage === null && _concurrentPerQueue[queueName] !== 0)
      anchorStage = i;
    if (anchorStage !== null && (_queueFences[queueName] || (i - anchorStage > 0)))
      break;
  }
}

function _enqueue(queueName, url){

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
  var info = queueInfo[queueName];
  if (!info) {
    if (queueName) console.warn('Queue info not found for queue name "'+queueName+'"')
    return
  }
  var time = performance.now() / 1000;
  info.timeLastFinished = time;
  var t1 = info.timeFirst;
  var t2 = info.timeLast;
  var t3 = info.timeLastFinished;
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

export default queueManager