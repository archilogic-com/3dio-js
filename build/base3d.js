(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Base3d = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var logger = createCommonjsModule(function (module) {
	/*!
	 * js-logger - http://github.com/jonnyreeves/js-logger
	 * Jonny Reeves, http://jonnyreeves.co.uk/
	 * js-logger may be freely distributed under the MIT license.
	 */
	(function (global) {
		"use strict";

		// Top level module for the global, static logger instance.
		var Logger = { };

		// For those that are at home that are keeping score.
		Logger.VERSION = "1.3.0";

		// Function which handles all incoming log messages.
		var logHandler;

		// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
		var contextualLoggersByNameMap = {};

		// Polyfill for ES5's Function.bind.
		var bind = function(scope, func) {
			return function() {
				return func.apply(scope, arguments);
			};
		};

		// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
		var merge = function () {
			var args = arguments, target = args[0], key, i;
			for (i = 1; i < args.length; i++) {
				for (key in args[i]) {
					if (!(key in target) && args[i].hasOwnProperty(key)) {
						target[key] = args[i][key];
					}
				}
			}
			return target;
		};

		// Helper to define a logging level object; helps with optimisation.
		var defineLogLevel = function(value, name) {
			return { value: value, name: name };
		};

		// Predefined logging levels.
		Logger.DEBUG = defineLogLevel(1, 'DEBUG');
		Logger.INFO = defineLogLevel(2, 'INFO');
		Logger.TIME = defineLogLevel(3, 'TIME');
		Logger.WARN = defineLogLevel(4, 'WARN');
		Logger.ERROR = defineLogLevel(8, 'ERROR');
		Logger.OFF = defineLogLevel(99, 'OFF');

		// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
		// of each other.
		var ContextualLogger = function(defaultContext) {
			this.context = defaultContext;
			this.setLevel(defaultContext.filterLevel);
			this.log = this.info;  // Convenience alias.
		};

		ContextualLogger.prototype = {
			// Changes the current logging level for the logging instance.
			setLevel: function (newLevel) {
				// Ensure the supplied Level object looks valid.
				if (newLevel && "value" in newLevel) {
					this.context.filterLevel = newLevel;
				}
			},

			// Is the logger configured to output messages at the supplied level?
			enabledFor: function (lvl) {
				var filterLevel = this.context.filterLevel;
				return lvl.value >= filterLevel.value;
			},

			debug: function () {
				this.invoke(Logger.DEBUG, arguments);
			},

			info: function () {
				this.invoke(Logger.INFO, arguments);
			},

			warn: function () {
				this.invoke(Logger.WARN, arguments);
			},

			error: function () {
				this.invoke(Logger.ERROR, arguments);
			},

			time: function (label) {
				if (typeof label === 'string' && label.length > 0) {
					this.invoke(Logger.TIME, [ label, 'start' ]);
				}
			},

			timeEnd: function (label) {
				if (typeof label === 'string' && label.length > 0) {
					this.invoke(Logger.TIME, [ label, 'end' ]);
				}
			},

			// Invokes the logger callback if it's not being filtered.
			invoke: function (level, msgArgs) {
				if (logHandler && this.enabledFor(level)) {
					logHandler(msgArgs, merge({ level: level }, this.context));
				}
			}
		};

		// Protected instance which all calls to the to level `Logger` module will be routed through.
		var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

		// Configure the global Logger instance.
		(function() {
			// Shortcut for optimisers.
			var L = Logger;

			L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
			L.debug = bind(globalLogger, globalLogger.debug);
			L.time = bind(globalLogger, globalLogger.time);
			L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
			L.info = bind(globalLogger, globalLogger.info);
			L.warn = bind(globalLogger, globalLogger.warn);
			L.error = bind(globalLogger, globalLogger.error);

			// Don't forget the convenience alias!
			L.log = L.info;
		}());

		// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
		// object with the supplied log messages and the second being a context object which contains a hash of stateful
		// parameters which the logging function can consume.
		Logger.setHandler = function (func) {
			logHandler = func;
		};

		// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
		// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
		Logger.setLevel = function(level) {
			// Set the globalLogger's level.
			globalLogger.setLevel(level);

			// Apply this level to all registered contextual loggers.
			for (var key in contextualLoggersByNameMap) {
				if (contextualLoggersByNameMap.hasOwnProperty(key)) {
					contextualLoggersByNameMap[key].setLevel(level);
				}
			}
		};

		// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
		// default context and log handler.
		Logger.get = function (name) {
			// All logger instances are cached so they can be configured ahead of use.
			return contextualLoggersByNameMap[name] ||
				(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
		};

		// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
		// write to the window's console object (if present); the optional options object can be used to customise the
		// formatter used to format each log message.
		Logger.createDefaultHandler = function (options) {
			options = options || {};

			options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
				// Prepend the logger's name to the log message for easy identification.
				if (context.name) {
					messages.unshift("[" + context.name + "]");
				}
			};

			// Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
			// that don't offer a native console method.
			var timerStartTimeByLabelMap = {};

			// Support for IE8+ (and other, slightly more sane environments)
			var invokeConsoleMethod = function (hdlr, messages) {
				Function.prototype.apply.call(hdlr, console, messages);
			};

			// Check for the presence of a logger.
			if (typeof console === "undefined") {
				return function () { /* no console */ };
			}

			return function(messages, context) {
				// Convert arguments object to Array.
				messages = Array.prototype.slice.call(messages);

				var hdlr = console.log;
				var timerLabel;

				if (context.level === Logger.TIME) {
					timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

					if (messages[1] === 'start') {
						if (console.time) {
							console.time(timerLabel);
						}
						else {
							timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
						}
					}
					else {
						if (console.timeEnd) {
							console.timeEnd(timerLabel);
						}
						else {
							invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
								(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
						}
					}
				}
				else {
					// Delegate through to custom warn/error loggers if present on the console.
					if (context.level === Logger.WARN && console.warn) {
						hdlr = console.warn;
					} else if (context.level === Logger.ERROR && console.error) {
						hdlr = console.error;
					} else if (context.level === Logger.INFO && console.info) {
						hdlr = console.info;
					}

					options.formatter(messages, context);
					invokeConsoleMethod(hdlr, messages);
				}
			};
		};

		// Configure and example a Default implementation which writes to the `window.console` (if present).  The
		// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
		Logger.useDefaults = function(options) {
			Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
			Logger.setHandler(Logger.createDefaultHandler(options));
		};

		// Export to popular environments boilerplate.
		if (typeof undefined === 'function' && undefined.amd) {
			undefined(Logger);
		}
		else if ('object' !== 'undefined' && module.exports) {
			module.exports = Logger;
		}
		else {
			Logger._prevLogger = global.Logger;

			Logger.noConflict = function () {
				global.Logger = Logger._prevLogger;
				return Logger;
			};

			global.Logger = Logger;
		}
	}(commonjsGlobal));
	});

	// based on https://raw.githubusercontent.com/mrdoob/three.js/dev/src/polyfills.js

	if (Number.EPSILON === undefined) {
	  Number.EPSILON = Math.pow(2, -52);
	}

	if (Number.isInteger === undefined) {
	  // Missing in IE
	  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
	  Number.isInteger = function (value) {
	    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
	  };
	}

	if (Math.sign === undefined) {
	  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	  Math.sign = function (x) {
	    return ( x < 0 ) ? -1 : ( x > 0 ) ? 1 : +x
	  };
	}

	if (Function.prototype.name === undefined) {
	  // Missing in IE
	  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
	  Object.defineProperty(Function.prototype, 'name', {
	    get: function () {
	      return this.toString().match(/^\s*function\s*([^\(\s]*)/)[1]
	    }
	  });
	}

	if (Object.assign === undefined) {
	  // Missing in IE
	  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	  (function () {
	    Object.assign = function (target) {
	      'use strict';
	      if (target === undefined || target === null) {
	        throw new TypeError('Cannot convert undefined or null to object')
	      }
	      var output = Object(target);
	      for (var index = 1; index < arguments.length; index++) {
	        var source = arguments[index];
	        if (source !== undefined && source !== null) {
	          for (var nextKey in source) {
	            if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
	              output[nextKey] = source[nextKey];
	            }
	          }
	        }
	      }
	      return output
	    };
	  })();
	}

	var PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	/**
	 * Generate an UUID as specified in RFC4122
	 * @memberof Base3d
	 * @function utils#generateUuid
	 */

	function generateUuid () {
	  var d = Date.now();
	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	  });
	  return uuid
	}

	/**
	 * Validates UUID as specified in RFC4122
	 * @memberof Base3d
	 * @function utils#generateUuid
	 */

	function validateUuid (str) {
	  if (!str || typeof str !== "string") return false
	  return PATTERN.test(str)
	}

	// rgeistries

	var instances = [];
	var plugins = [];

	// constants

	var IS_NODE = !!(
	  typeof module !== 'undefined'
	  && module.exports
	  && typeof process !== 'undefined'
	  && Object.prototype.toString.call(process) === '[object process]'
	  && process.title.indexOf('node') !== -1
	);

	console.log(IS_NODE);

	// instances

	function registerInstance (app) {
	  instances[instances.length] = app;
	}

	function deregisterInstance (app) {
	  var i = instance.indexOf(app);
	  if (i === -1) {
	    console.error('Instance with id:'+app.id+' not found in runtime registry.');
	  } else {
	    instances.splice(i,1);
	  }
	}

	function getInstances () {
	  return instances
	}

	function getInstanceById (id) {
	  for (var i = 0, l = instances.length; i < l; i++) {
	    if (instances[i].id === id) return instances[i]
	  }
	  return null
	}

	// plugins

	function registerPlugin (plugin) {
	  if (pluginsByName[plugin.name]) {
	    console.error('Plugin '+plugin.name+' has been registered already.');
	    return false
	  } else {
	    pluginsByName[plugin.name] = plugin;
	    // TODO: init plugin on running instances
	    getInstances().forEach(function(app){
	      initPlugin(app, plugin);
	    });
	    return true
	  }
	}

	function initPlugin (app, plugin) {

	  // TODO: init plugin here

	}

	function initPlugins (app) {
	  plugins.forEach(function(plugin){
	    initPlugin(app, plugin);
	  });
	}

	// export public functions

	var runtime = {

	  env: {
	    IS_NODE: IS_NODE
	  },

	  registerInstance: registerInstance,
	  deregisterInstance: deregisterInstance,
	  getInstanceById: getInstanceById,
	  getInstances: getInstances,

	  registerPlugin: registerPlugin,
	  initPlugins: initPlugins

	};

	function initScene () {

	  /**
	   * @memberof Base3d
	   * @namespace scene
	   */
	  var scene = {};

	  /**
	   * ...
	   * @memberof Base3d
	   * @function scene#find
	   * @param   {object}                          args
	   * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
	   * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
	   * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
	   * @returns {Promise}
	   */
	  scene.find = function find () {
	    console.log('Found nothing');
	  };

	  /**
	   * ...
	   * @memberof Base3d
	   * @function scene#findFirst
	   * @param   {object}                          args
	   * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
	   * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
	   * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
	   * @returns {Promise}
	   */
	  scene.findFirst = function find () {
	    console.log('Found nothing');
	  };

	  return scene

	}

	function initStorage (app) {

	  /**
	   * @memberof Base3d
	   * @namespace storage
	   */
	  var storage = {};

	  /**
	   * ...
	   * @memberof Base3d
	   * @function storage#save
	   * @param   {object}                          args
	   * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
	   * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
	   * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
	   * @returns {Promise}
	   */
	  storage.save = function save () {
	    console.log('Found nothing');
	  };

	  /**
	   * ...
	   * @memberof Base3d
	   * @function storage#load
	   * @param   {object}                          args
	   * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
	   * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
	   * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
	   * @returns {Promise}
	   */
	  storage.load = function load () {
	    console.log('Found nothing');
	  };

	  return storage

	}

	// bootstrap
	logger.useDefaults();
	/**
	 * Creates an Base3d application. The base3d() function is a top-level function exported by the base3d module.
	 * @class Base3d
	 * */
	function Base3d (config) {

	  var app = this;

	  // instance specific
	  // app.configs = initConfigs(app)
	  app.scene = initScene(app);
	  app.storage = initStorage(app);
	  // app.io = initIo(app)

	  /**
	   * @memberof Base3d
	   * @member sessionId
	   */
	  app.id = generateUuid();

	  runtime.registerInstance(app);
	  console.log(runtime.getInstances());

	  // flags
	  app.initialized = true;
	  console.log('ok ;)');

	}
	Base3d.initialized = false;
	Base3d.destroyed = null;

	/**
	 * ...
	 * @memberof Base3d
	 * */
	Base3d.prototype.destroy = function destroy () {
	  runtime.deregisterInstance(app);
	  this.destroyed = true;
	};

	/**
	 * ...
	 * @memberof Base3d
	 * @function
	 * */
	Base3d.registerPlugin = Base3d.prototype.registerPlugin = runtime.registerPlugin;

	/**
	 * ...
	 * @memberof Base3d
	 * @namespace
	 * */
	Base3d.utils = Base3d.prototype.utils = {
	  generateUuid: generateUuid,
	  validateUuid: validateUuid
	};

	return Base3d;

})));
//# sourceMappingURL=base3d.js.map
