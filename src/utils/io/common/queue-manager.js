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

// internals
var queues = {}
var queueFences = {}
var queuesChanged = false
var queueInfo = {}
var queuesLength = queuesByPriority.length
var concurrentRequests = 0
var concurrentPerQueue = {}
var loadingQueueData = ''
var loadingQueueAlgorithm     = 'overstep-one-fenced';
var loadingQueuePipelineDepth = maxConcurrentQueuedRequests;
var queueName
for (var i = 0, l = queuesLength; i < l; i++) {
  queueName = queuesByPriority[i]
  queues[queueName] = []
  queueFences[queueName] = queueFences[i]
  queueInfo[queueName] = {requestCount: 0}
  concurrentPerQueue[queueName] = 0
}

// private methods

function startRequest(queueName) {
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
  concurrentPerQueue[queueName] += 1;
  concurrentRequests++;
  //
  queuesChanged = true;
  // Start request
  var queue = queues[queueName];
  var request = queue.shift();
  request.start();
}

function processQueue() {
  var anchorStage = null;
  for (var i = 0; i < queuesLength; i++) {
    var queueName = queuesByPriority[i];
    while (queues[queueName].length > 0 && concurrentRequests < loadingQueuePipelineDepth)
      startRequest(queueName)
    if (anchorStage === null && concurrentPerQueue[queueName] !== 0)
      anchorStage = i;
    if (anchorStage !== null && (queueFences[queueName] || (i - anchorStage > 0)))
      break;
  }
}

// public methods

function enqueue(queueName, url){

  // fallback to first queue
  if (!queues[queueName]) {
    if (queueName) console.error('onknown queue ', queueName)
    queueName = queuesByPriority[0]
  }

  // create promise and add to queue
  return new Promise(function(resolve, reject){
    // has to be asynchronous in order to decouple queue processing from synchronous code
    setTimeout(function(){
      var queue = queues[queueName]
      queue[ queue.length ] = { url: url, start: resolve }
      processQueue()
    },1)
  })

}

function dequeue(queueName, url) {
  var info = queueInfo[queueName];
  if (!info) {
    if (queueName) console.warn('Queue info not found for queue name "'+queueName+'"')
    return
  }
  info.timeLastFinished = performance.now() / 1000;
  concurrentPerQueue[queueName] -= 1
  concurrentRequests -= 1
  queuesChanged = true;
  processQueue()
}

// expose API

var queueManager = {
  enqueue: enqueue,
  dequeue: dequeue,
  info: queueInfo
}

export default queueManager