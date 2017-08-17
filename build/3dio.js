/**
 * @preserve
 * @name 3dio
 * @version 1.0.0-beta.50
 * @date 2017/08/17 22:07
 * @branch master
 * @commit b68d8908fa656df360e4d954bc9c2d9bd21e22a7
 * @description toolkit for interior apps
 * @see https://3d.io
 * @tutorial https://github.com/archilogic-com/3dio-js
 * @author archilogic <dev.rocks@archilogic.com> (https://archilogic.com)
 * @license MIT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.io3d = factory());
}(this, (function () { 'use strict';

	var BUILD_DATE='2017/08/17 22:07', GIT_BRANCH = 'master', GIT_COMMIT = 'b68d8908fa656df360e4d954bc9c2d9bd21e22a7'

	var name = "3dio";
	var version = "1.0.0-beta.50";
	var description = "toolkit for interior apps";
	var keywords = ["3d","aframe","cardboard","components","oculus","vive","rift","vr","WebVR","WegGL","three","three.js","3D model","api","visualization","furniture","real estate","interior","building","architecture","3d.io"];
	var homepage = "https://3d.io";
	var repository = "archilogic-com/3dio-js";
	var license = "MIT";
	var author = {"name":"archilogic","email":"dev.rocks@archilogic.com","url":"https://archilogic.com"};
	var main = "index.js";
	var scripts = {"start":"gulp dev-browser","dev-browser":"gulp dev-browser","dev-node":"gulp dev-node","test":"gulp test","build":"gulp build","release":"gulp release"};
	var dependencies = {"bluebird":"^3.5.0","form-data":"^2.1.4","js-logger":"^1.3.0","lodash":"^4.17.4","node-fetch":"2.0.0-alpha.8","rxjs":"^5.4.2","three":"^0.85.2","whatwg-fetch":"^2.0.3"};
	var devDependencies = {"babel-runtime":"^6.25.0","chalk":"^2.0.1","confirm-cli":"^0.4.0","del":"^3.0.0","gulp":"github:gulpjs/gulp#4.0","gulp-git":"^2.4.1","gulp-gzip":"^1.4.0","gulp-less":"^3.3.2","gulp-s3":"^0.11.0","gulp-watch":"^4.3.11","lite-server":"^2.3.0","moment":"^2.18.1","rollup":"^0.41.6","rollup-plugin-commonjs":"^8.0.2","rollup-plugin-json":"^2.1.1","rollup-plugin-less":"^0.1.3","rollup-plugin-node-resolve":"^3.0.0","through2":"^2.0.3","uglify-js":"^3.0.10","vinyl":"^2.1.0"};
	var packageJson = {
		name: name,
		version: version,
		description: description,
		keywords: keywords,
		homepage: homepage,
		repository: repository,
		license: license,
		author: author,
		main: main,
		scripts: scripts,
		dependencies: dependencies,
		devDependencies: devDependencies
	};

	/**
	 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
	 * Available via the MIT or new BSD license.
	 * see: http://github.com/requirejs/domReady for details
	 */
	/*jslint */
	/*global require: false, define: false, requirejs: false,
	 window: false, clearInterval: false, document: false,
	 self: false, setInterval: false */

	var isTop;
	var testDiv;
	var scrollIntervalId;
	var isBrowser$1 = typeof window !== "undefined" && window.document;
	var isPageLoaded = !isBrowser$1;
	var doc = isBrowser$1 ? document : null;
	var readyCalls = [];

	var resolve;
	var readyPromise = new Promise(function(resolve_){
	  resolve = resolve_;
	});

	function runCallbacks(callbacks) {
	  var i;
	  for (i = 0; i < callbacks.length; i += 1) {
	    callbacks[i](doc);
	  }
	}

	function callReady() {
	  var callbacks = readyCalls;

	  if (isPageLoaded) {
	    //Call the DOM ready callbacks
	    if (callbacks.length) {
	      readyCalls = [];
	      runCallbacks(callbacks);
	    }
	    // resolves promise
	    resolve(doc);
	  }
	}

	/**
	 * Sets the page as loaded.
	 */
	function pageLoaded() {
	  if (!isPageLoaded) {
	    isPageLoaded = true;
	    if (scrollIntervalId) {
	      clearInterval(scrollIntervalId);
	    }

	    callReady();
	  }
	}

	if (isBrowser$1) {
	  if (document.addEventListener) {
	    //Standards. Hooray! Assumption here that if standards based,
	    //it knows about DOMContentLoaded.
	    document.addEventListener("DOMContentLoaded", pageLoaded, false);
	    window.addEventListener("load", pageLoaded, false);
	  } else if (window.attachEvent) {
	    window.attachEvent("onload", pageLoaded);

	    testDiv = document.createElement('div');
	    try {
	      isTop = window.frameElement === null;
	    } catch (e) {}

	    //DOMContentLoaded approximation that uses a doScroll, as found by
	    //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
	    //but modified by other contributors, including jdalton
	    if (testDiv.doScroll && isTop && window.external) {
	      scrollIntervalId = setInterval(function () {
	        try {
	          testDiv.doScroll();
	          pageLoaded();
	        } catch (e) {}
	      }, 30);
	    }
	  }

	  //Check if document already complete, and if so, just trigger page load
	  //listeners. Latest webkit browsers also use "interactive", and
	  //will fire the onDOMContentLoaded before "interactive" but not after
	  //entering "interactive" or "complete". More details:
	  //http://dev.w3.org/html5/spec/the-end.html#the-end
	  //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
	  //Hmm, this is more complicated on further use, see "firing too early"
	  //bug: https://github.com/requirejs/domReady/issues/1
	  //so removing the || document.readyState === "interactive" test.
	  //There is still a window.onload binding that should get fired if
	  //DOMContentLoaded is missed.
	  if (document.readyState === "complete") {
	    pageLoaded();
	  }
	}

	/** PUBLIC API **/

	/**
	 * Registers a callback for DOM ready. If DOM is already ready, the
	 * callback is called immediately.
	 * @param {Function} callback
	 */
	function domReady(callback) {
	  if (!isBrowser$1) {
	    console.error('runtime.domReady requires a browser environment and will be ignored.');
	    return
	  }
	  if (isPageLoaded) {
	    callback(doc);
	  } else {
	    readyCalls.push(callback);
	  }
	  return readyPromise
	}

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	// CommonJS / Node have global context exposed as "global" variable.
	// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
	// the global "global" var for now.
	var __window = typeof window !== 'undefined' && window;
	var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
	    self instanceof WorkerGlobalScope && self;
	var __global = typeof commonjsGlobal !== 'undefined' && commonjsGlobal;
	var _root = __window || __global || __self;
	var root_1 = _root;
	// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
	// This is needed when used with angular/tsickle which inserts a goog.module statement.
	// Wrap in IIFE
	(function () {
	    if (!_root) {
	        throw new Error('RxJS could not find any global context (window, self, global)');
	    }
	})();


	var root = {
		root: root_1
	};

	function isFunction(x) {
	    return typeof x === 'function';
	}
	var isFunction_2 = isFunction;


	var isFunction_1 = {
		isFunction: isFunction_2
	};

	var isArray_1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });


	var isArray = {
		isArray: isArray_1
	};

	function isObject(x) {
	    return x != null && typeof x === 'object';
	}
	var isObject_2 = isObject;


	var isObject_1 = {
		isObject: isObject_2
	};

	// typeof any so that it we don't have to cast when comparing a result to the error object
	var errorObject_1 = { e: {} };


	var errorObject = {
		errorObject: errorObject_1
	};

	var tryCatchTarget;
	function tryCatcher() {
	    try {
	        return tryCatchTarget.apply(this, arguments);
	    }
	    catch (e) {
	        errorObject.errorObject.e = e;
	        return errorObject.errorObject;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}
	var tryCatch_2 = tryCatch;



	var tryCatch_1 = {
		tryCatch: tryCatch_2
	};

	var __extends$3 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when one or more errors have occurred during the
	 * `unsubscribe` of a {@link Subscription}.
	 */
	var UnsubscriptionError = (function (_super) {
	    __extends$3(UnsubscriptionError, _super);
	    function UnsubscriptionError(errors) {
	        _super.call(this);
	        this.errors = errors;
	        var err = Error.call(this, errors ?
	            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
	        this.name = err.name = 'UnsubscriptionError';
	        this.stack = err.stack;
	        this.message = err.message;
	    }
	    return UnsubscriptionError;
	}(Error));
	var UnsubscriptionError_2 = UnsubscriptionError;


	var UnsubscriptionError_1 = {
		UnsubscriptionError: UnsubscriptionError_2
	};

	/**
	 * Represents a disposable resource, such as the execution of an Observable. A
	 * Subscription has one important method, `unsubscribe`, that takes no argument
	 * and just disposes the resource held by the subscription.
	 *
	 * Additionally, subscriptions may be grouped together through the `add()`
	 * method, which will attach a child Subscription to the current Subscription.
	 * When a Subscription is unsubscribed, all its children (and its grandchildren)
	 * will be unsubscribed as well.
	 *
	 * @class Subscription
	 */
	var Subscription = (function () {
	    /**
	     * @param {function(): void} [unsubscribe] A function describing how to
	     * perform the disposal of resources when the `unsubscribe` method is called.
	     */
	    function Subscription(unsubscribe) {
	        /**
	         * A flag to indicate whether this Subscription has already been unsubscribed.
	         * @type {boolean}
	         */
	        this.closed = false;
	        this._parent = null;
	        this._parents = null;
	        this._subscriptions = null;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    /**
	     * Disposes the resources held by the subscription. May, for instance, cancel
	     * an ongoing Observable execution or cancel any other type of work that
	     * started when the Subscription was created.
	     * @return {void}
	     */
	    Subscription.prototype.unsubscribe = function () {
	        var hasErrors = false;
	        var errors;
	        if (this.closed) {
	            return;
	        }
	        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this.closed = true;
	        this._parent = null;
	        this._parents = null;
	        // null out _subscriptions first so any child subscriptions that attempt
	        // to remove themselves from this subscription will noop
	        this._subscriptions = null;
	        var index = -1;
	        var len = _parents ? _parents.length : 0;
	        // if this._parent is null, then so is this._parents, and we
	        // don't have to remove ourselves from any parent subscriptions.
	        while (_parent) {
	            _parent.remove(this);
	            // if this._parents is null or index >= len,
	            // then _parent is set to null, and the loop exits
	            _parent = ++index < len && _parents[index] || null;
	        }
	        if (isFunction_1.isFunction(_unsubscribe)) {
	            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
	            if (trial === errorObject.errorObject) {
	                hasErrors = true;
	                errors = errors || (errorObject.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
	                    flattenUnsubscriptionErrors(errorObject.errorObject.e.errors) : [errorObject.errorObject.e]);
	            }
	        }
	        if (isArray.isArray(_subscriptions)) {
	            index = -1;
	            len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject_1.isObject(sub)) {
	                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
	                    if (trial === errorObject.errorObject) {
	                        hasErrors = true;
	                        errors = errors || [];
	                        var err = errorObject.errorObject.e;
	                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
	                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
	                        }
	                        else {
	                            errors.push(err);
	                        }
	                    }
	                }
	            }
	        }
	        if (hasErrors) {
	            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
	        }
	    };
	    /**
	     * Adds a tear down to be called during the unsubscribe() of this
	     * Subscription.
	     *
	     * If the tear down being added is a subscription that is already
	     * unsubscribed, is the same reference `add` is being called on, or is
	     * `Subscription.EMPTY`, it will not be added.
	     *
	     * If this subscription is already in an `closed` state, the passed
	     * tear down logic will be executed immediately.
	     *
	     * @param {TeardownLogic} teardown The additional logic to execute on
	     * teardown.
	     * @return {Subscription} Returns the Subscription used or created to be
	     * added to the inner subscriptions list. This Subscription can be used with
	     * `remove()` to remove the passed teardown logic from the inner subscriptions
	     * list.
	     */
	    Subscription.prototype.add = function (teardown) {
	        if (!teardown || (teardown === Subscription.EMPTY)) {
	            return Subscription.EMPTY;
	        }
	        if (teardown === this) {
	            return this;
	        }
	        var subscription = teardown;
	        switch (typeof teardown) {
	            case 'function':
	                subscription = new Subscription(teardown);
	            case 'object':
	                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
	                    return subscription;
	                }
	                else if (this.closed) {
	                    subscription.unsubscribe();
	                    return subscription;
	                }
	                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
	                    var tmp = subscription;
	                    subscription = new Subscription();
	                    subscription._subscriptions = [tmp];
	                }
	                break;
	            default:
	                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	        }
	        var subscriptions = this._subscriptions || (this._subscriptions = []);
	        subscriptions.push(subscription);
	        subscription._addParent(this);
	        return subscription;
	    };
	    /**
	     * Removes a Subscription from the internal list of subscriptions that will
	     * unsubscribe during the unsubscribe process of this Subscription.
	     * @param {Subscription} subscription The subscription to remove.
	     * @return {void}
	     */
	    Subscription.prototype.remove = function (subscription) {
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.prototype._addParent = function (parent) {
	        var _a = this, _parent = _a._parent, _parents = _a._parents;
	        if (!_parent || _parent === parent) {
	            // If we don't have a parent, or the new parent is the same as the
	            // current parent, then set this._parent to the new parent.
	            this._parent = parent;
	        }
	        else if (!_parents) {
	            // If there's already one parent, but not multiple, allocate an Array to
	            // store the rest of the parent Subscriptions.
	            this._parents = [parent];
	        }
	        else if (_parents.indexOf(parent) === -1) {
	            // Only add the new parent to the _parents list if it's not already there.
	            _parents.push(parent);
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.closed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	var Subscription_2 = Subscription;
	function flattenUnsubscriptionErrors(errors) {
	    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
	}


	var Subscription_1 = {
		Subscription: Subscription_2
	};

	var empty = {
	    closed: true,
	    next: function (value) { },
	    error: function (err) { throw err; },
	    complete: function () { }
	};


	var Observer = {
		empty: empty
	};

	var rxSubscriber = createCommonjsModule(function (module, exports) {
	"use strict";

	var Symbol = root.root.Symbol;
	exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
	    Symbol.for('rxSubscriber') : '@@rxSubscriber';
	/**
	 * @deprecated use rxSubscriber instead
	 */
	exports.$$rxSubscriber = exports.rxSubscriber;

	});

	var __extends$2 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};




	/**
	 * Implements the {@link Observer} interface and extends the
	 * {@link Subscription} class. While the {@link Observer} is the public API for
	 * consuming the values of an {@link Observable}, all Observers get converted to
	 * a Subscriber, in order to provide Subscription-like capabilities such as
	 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
	 * implementing operators, but it is rarely used as a public API.
	 *
	 * @class Subscriber<T>
	 */
	var Subscriber = (function (_super) {
	    __extends$2(Subscriber, _super);
	    /**
	     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
	     * defined Observer or a `next` callback function.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     */
	    function Subscriber(destinationOrNext, error, complete) {
	        _super.call(this);
	        this.syncErrorValue = null;
	        this.syncErrorThrown = false;
	        this.syncErrorThrowable = false;
	        this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                this.destination = Observer.empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    this.destination = Observer.empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        this.destination = destinationOrNext;
	                        this.destination.add(this);
	                    }
	                    else {
	                        this.syncErrorThrowable = true;
	                        this.destination = new SafeSubscriber(this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                this.syncErrorThrowable = true;
	                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
	                break;
	        }
	    }
	    Subscriber.prototype[rxSubscriber.rxSubscriber] = function () { return this; };
	    /**
	     * A static factory for a Subscriber, given a (potentially partial) definition
	     * of an Observer.
	     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
	     * @param {function(e: ?any): void} [error] The `error` callback of an
	     * Observer.
	     * @param {function(): void} [complete] The `complete` callback of an
	     * Observer.
	     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
	     * Observer represented by the given arguments.
	     */
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    /**
	     * The {@link Observer} callback to receive notifications of type `next` from
	     * the Observable, with a value. The Observable may call this method 0 or more
	     * times.
	     * @param {T} [value] The `next` value.
	     * @return {void}
	     */
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    /**
	     * The {@link Observer} callback to receive notifications of type `error` from
	     * the Observable, with an attached {@link Error}. Notifies the Observer that
	     * the Observable has experienced an error condition.
	     * @param {any} [err] The `error` exception.
	     * @return {void}
	     */
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    /**
	     * The {@link Observer} callback to receive a valueless notification of type
	     * `complete` from the Observable. Notifies the Observer that the Observable
	     * has finished sending push-based notifications.
	     * @return {void}
	     */
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype._unsubscribeAndRecycle = function () {
	        var _a = this, _parent = _a._parent, _parents = _a._parents;
	        this._parent = null;
	        this._parents = null;
	        this.unsubscribe();
	        this.closed = false;
	        this.isStopped = false;
	        this._parent = _parent;
	        this._parents = _parents;
	        return this;
	    };
	    return Subscriber;
	}(Subscription_1.Subscription));
	var Subscriber_2 = Subscriber;
	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SafeSubscriber = (function (_super) {
	    __extends$2(SafeSubscriber, _super);
	    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
	        _super.call(this);
	        this._parentSubscriber = _parentSubscriber;
	        var next;
	        var context = this;
	        if (isFunction_1.isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (observerOrNext !== Observer.empty) {
	                context = Object.create(observerOrNext);
	                if (isFunction_1.isFunction(context.unsubscribe)) {
	                    this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = this.unsubscribe.bind(this);
	            }
	        }
	        this._context = context;
	        this._next = next;
	        this._error = error;
	        this._complete = complete;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (!_parentSubscriber.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._error) {
	                if (!_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parentSubscriber.syncErrorThrowable) {
	                this.unsubscribe();
	                throw err;
	            }
	            else {
	                _parentSubscriber.syncErrorValue = err;
	                _parentSubscriber.syncErrorThrown = true;
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        var _this = this;
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._complete) {
	                var wrappedComplete = function () { return _this._complete.call(_this._context); };
	                if (!_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(wrappedComplete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            throw err;
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            parent.syncErrorValue = err;
	            parent.syncErrorThrown = true;
	            return true;
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parentSubscriber = this._parentSubscriber;
	        this._context = null;
	        this._parentSubscriber = null;
	        _parentSubscriber.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));


	var Subscriber_1 = {
		Subscriber: Subscriber_2
	};

	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[rxSubscriber.rxSubscriber]) {
	            return nextOrObserver[rxSubscriber.rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new Subscriber_1.Subscriber(Observer.empty);
	    }
	    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	}
	var toSubscriber_2 = toSubscriber;


	var toSubscriber_1 = {
		toSubscriber: toSubscriber_2
	};

	var observable = createCommonjsModule(function (module, exports) {
	"use strict";

	function getSymbolObservable(context) {
	    var $$observable;
	    var Symbol = context.Symbol;
	    if (typeof Symbol === 'function') {
	        if (Symbol.observable) {
	            $$observable = Symbol.observable;
	        }
	        else {
	            $$observable = Symbol('observable');
	            Symbol.observable = $$observable;
	        }
	    }
	    else {
	        $$observable = '@@observable';
	    }
	    return $$observable;
	}
	exports.getSymbolObservable = getSymbolObservable;
	exports.observable = getSymbolObservable(root.root);
	/**
	 * @deprecated use observable instead
	 */
	exports.$$observable = exports.observable;

	});

	/**
	 * A representation of any set of values over any amount of time. This the most basic building block
	 * of RxJS.
	 *
	 * @class Observable<T>
	 */
	var Observable = (function () {
	    /**
	     * @constructor
	     * @param {Function} subscribe the function that is  called when the Observable is
	     * initially subscribed to. This function is given a Subscriber, to which new values
	     * can be `next`ed, or an `error` method can be called to raise an error, or
	     * `complete` can be called to notify of a successful completion.
	     */
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    /**
	     * Creates a new Observable, with this Observable as the source, and the passed
	     * operator defined as the new observable's operator.
	     * @method lift
	     * @param {Operator} operator the operator defining the operation to take on the observable
	     * @return {Observable} a new observable with the Operator applied
	     */
	    Observable.prototype.lift = function (operator) {
	        var observable$$1 = new Observable();
	        observable$$1.source = this;
	        observable$$1.operator = operator;
	        return observable$$1;
	    };
	    /**
	     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
	     *
	     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
	     *
	     * `subscribe` is not a regular operator, but a method that calls Observables internal `subscribe` function. It
	     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
	     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
	     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
	     * thought.
	     *
	     * Apart from starting the execution of an Observable, this method allows you to listen for values
	     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
	     * following ways.
	     *
	     * The first way is creating an object that implements {@link Observer} interface. It should have methods
	     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
	     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
	     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
	     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
	     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
	     * be left uncaught.
	     *
	     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
	     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
	     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
	     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
	     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
	     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
	     *
	     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
	     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
	     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
	     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
	     *
	     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
	     * It is an Observable itself that decides when these functions will be called. For example {@link of}
	     * by default emits all its values synchronously. Always check documentation for how given Observable
	     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
	     *
	     * @example <caption>Subscribe with an Observer</caption>
	     * const sumObserver = {
	     *   sum: 0,
	     *   next(value) {
	     *     console.log('Adding: ' + value);
	     *     this.sum = this.sum + value;
	     *   },
	     *   error() { // We actually could just remote this method,
	     *   },        // since we do not really care about errors right now.
	     *   complete() {
	     *     console.log('Sum equals: ' + this.sum);
	     *   }
	     * };
	     *
	     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
	     * .subscribe(sumObserver);
	     *
	     * // Logs:
	     * // "Adding: 1"
	     * // "Adding: 2"
	     * // "Adding: 3"
	     * // "Sum equals: 6"
	     *
	     *
	     * @example <caption>Subscribe with functions</caption>
	     * let sum = 0;
	     *
	     * Rx.Observable.of(1, 2, 3)
	     * .subscribe(
	     *   function(value) {
	     *     console.log('Adding: ' + value);
	     *     sum = sum + value;
	     *   },
	     *   undefined,
	     *   function() {
	     *     console.log('Sum equals: ' + sum);
	     *   }
	     * );
	     *
	     * // Logs:
	     * // "Adding: 1"
	     * // "Adding: 2"
	     * // "Adding: 3"
	     * // "Sum equals: 6"
	     *
	     *
	     * @example <caption>Cancel a subscription</caption>
	     * const subscription = Rx.Observable.interval(1000).subscribe(
	     *   num => console.log(num),
	     *   undefined,
	     *   () => console.log('completed!') // Will not be called, even
	     * );                                // when cancelling subscription
	     *
	     *
	     * setTimeout(() => {
	     *   subscription.unsubscribe();
	     *   console.log('unsubscribed!');
	     * }, 2500);
	     *
	     * // Logs:
	     * // 0 after 1s
	     * // 1 after 2s
	     * // "unsubscribed!" after 2,5s
	     *
	     *
	     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
	     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
	     *  Observable.
	     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
	     *  the error will be thrown as unhandled.
	     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
	     * @return {ISubscription} a subscription reference to the registered handlers
	     * @method subscribe
	     */
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            operator.call(sink, this.source);
	        }
	        else {
	            sink.add(this.source ? this._subscribe(sink) : this._trySubscribe(sink));
	        }
	        if (sink.syncErrorThrowable) {
	            sink.syncErrorThrowable = false;
	            if (sink.syncErrorThrown) {
	                throw sink.syncErrorValue;
	            }
	        }
	        return sink;
	    };
	    Observable.prototype._trySubscribe = function (sink) {
	        try {
	            return this._subscribe(sink);
	        }
	        catch (err) {
	            sink.syncErrorThrown = true;
	            sink.syncErrorValue = err;
	            sink.error(err);
	        }
	    };
	    /**
	     * @method forEach
	     * @param {Function} next a handler for each value emitted by the observable
	     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	     * @return {Promise} a promise that either resolves on observable completion or
	     *  rejects with the handled error
	     */
	    Observable.prototype.forEach = function (next, PromiseCtor) {
	        var _this = this;
	        if (!PromiseCtor) {
	            if (root.root.Rx && root.root.Rx.config && root.root.Rx.config.Promise) {
	                PromiseCtor = root.root.Rx.config.Promise;
	            }
	            else if (root.root.Promise) {
	                PromiseCtor = root.root.Promise;
	            }
	        }
	        if (!PromiseCtor) {
	            throw new Error('no Promise impl found');
	        }
	        return new PromiseCtor(function (resolve, reject) {
	            // Must be declared in a separate statement to avoid a RefernceError when
	            // accessing subscription below in the closure due to Temporal Dead Zone.
	            var subscription;
	            subscription = _this.subscribe(function (value) {
	                if (subscription) {
	                    // if there is a subscription, then we can surmise
	                    // the next handling is asynchronous. Any errors thrown
	                    // need to be rejected explicitly and unsubscribe must be
	                    // called manually
	                    try {
	                        next(value);
	                    }
	                    catch (err) {
	                        reject(err);
	                        subscription.unsubscribe();
	                    }
	                }
	                else {
	                    // if there is NO subscription, then we're getting a nexted
	                    // value synchronously during subscription. We can just call it.
	                    // If it errors, Observable's `subscribe` will ensure the
	                    // unsubscription logic is called, then synchronously rethrow the error.
	                    // After that, Promise will trap the error and send it
	                    // down the rejection path.
	                    next(value);
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        return this.source.subscribe(subscriber);
	    };
	    /**
	     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
	     * @method Symbol.observable
	     * @return {Observable} this instance of the observable
	     */
	    Observable.prototype[observable.observable] = function () {
	        return this;
	    };
	    // HACK: Since TypeScript inherits static properties too, we have to
	    // fight against TypeScript here so Subject can have a different static create signature
	    /**
	     * Creates a new cold Observable by calling the Observable constructor
	     * @static true
	     * @owner Observable
	     * @method create
	     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	     * @return {Observable} a new cold observable
	     */
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	var Observable_2 = Observable;


	var Observable_1 = {
		Observable: Observable_2
	};

	var __extends$4 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * An error thrown when an action is invalid because the object has been
	 * unsubscribed.
	 *
	 * @see {@link Subject}
	 * @see {@link BehaviorSubject}
	 *
	 * @class ObjectUnsubscribedError
	 */
	var ObjectUnsubscribedError = (function (_super) {
	    __extends$4(ObjectUnsubscribedError, _super);
	    function ObjectUnsubscribedError() {
	        var err = _super.call(this, 'object unsubscribed');
	        this.name = err.name = 'ObjectUnsubscribedError';
	        this.stack = err.stack;
	        this.message = err.message;
	    }
	    return ObjectUnsubscribedError;
	}(Error));
	var ObjectUnsubscribedError_2 = ObjectUnsubscribedError;


	var ObjectUnsubscribedError_1 = {
		ObjectUnsubscribedError: ObjectUnsubscribedError_2
	};

	var __extends$5 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};

	/**
	 * We need this JSDoc comment for affecting ESDoc.
	 * @ignore
	 * @extends {Ignored}
	 */
	var SubjectSubscription = (function (_super) {
	    __extends$5(SubjectSubscription, _super);
	    function SubjectSubscription(subject, subscriber) {
	        _super.call(this);
	        this.subject = subject;
	        this.subscriber = subscriber;
	        this.closed = false;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.closed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.subscriber);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription_1.Subscription));
	var SubjectSubscription_2 = SubjectSubscription;


	var SubjectSubscription_1 = {
		SubjectSubscription: SubjectSubscription_2
	};

	var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};






	/**
	 * @class SubjectSubscriber<T>
	 */
	var SubjectSubscriber = (function (_super) {
	    __extends$1(SubjectSubscriber, _super);
	    function SubjectSubscriber(destination) {
	        _super.call(this, destination);
	        this.destination = destination;
	    }
	    return SubjectSubscriber;
	}(Subscriber_1.Subscriber));
	var SubjectSubscriber_1 = SubjectSubscriber;
	/**
	 * @class Subject<T>
	 */
	var Subject = (function (_super) {
	    __extends$1(Subject, _super);
	    function Subject() {
	        _super.call(this);
	        this.observers = [];
	        this.closed = false;
	        this.isStopped = false;
	        this.hasError = false;
	        this.thrownError = null;
	    }
	    Subject.prototype[rxSubscriber.rxSubscriber] = function () {
	        return new SubjectSubscriber(this);
	    };
	    Subject.prototype.lift = function (operator) {
	        var subject = new AnonymousSubject(this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.next = function (value) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        if (!this.isStopped) {
	            var observers = this.observers;
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].next(value);
	            }
	        }
	    };
	    Subject.prototype.error = function (err) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        this.hasError = true;
	        this.thrownError = err;
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].error(err);
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.complete = function () {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].complete();
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.unsubscribe = function () {
	        this.isStopped = true;
	        this.closed = true;
	        this.observers = null;
	    };
	    Subject.prototype._trySubscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else {
	            return _super.prototype._trySubscribe.call(this, subscriber);
	        }
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	        }
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new Observable_1.Observable();
	        observable.source = this;
	        return observable;
	    };
	    Subject.create = function (destination, source) {
	        return new AnonymousSubject(destination, source);
	    };
	    return Subject;
	}(Observable_1.Observable));
	var Subject_2 = Subject;
	/**
	 * @class AnonymousSubject<T>
	 */
	var AnonymousSubject = (function (_super) {
	    __extends$1(AnonymousSubject, _super);
	    function AnonymousSubject(destination, source) {
	        _super.call(this);
	        this.destination = destination;
	        this.source = source;
	    }
	    AnonymousSubject.prototype.next = function (value) {
	        var destination = this.destination;
	        if (destination && destination.next) {
	            destination.next(value);
	        }
	    };
	    AnonymousSubject.prototype.error = function (err) {
	        var destination = this.destination;
	        if (destination && destination.error) {
	            this.destination.error(err);
	        }
	    };
	    AnonymousSubject.prototype.complete = function () {
	        var destination = this.destination;
	        if (destination && destination.complete) {
	            this.destination.complete();
	        }
	    };
	    AnonymousSubject.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        if (source) {
	            return this.source.subscribe(subscriber);
	        }
	        else {
	            return Subscription_1.Subscription.EMPTY;
	        }
	    };
	    return AnonymousSubject;
	}(Subject));
	var AnonymousSubject_1 = AnonymousSubject;


	var Subject_1 = {
		SubjectSubscriber: SubjectSubscriber_1,
		Subject: Subject_2,
		AnonymousSubject: AnonymousSubject_1
	};

	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};


	/**
	 * @class BehaviorSubject<T>
	 */
	var BehaviorSubject = (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        _super.call(this);
	        this._value = _value;
	    }
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.closed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasError) {
	            throw this.thrownError;
	        }
	        else if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else {
	            return this._value;
	        }
	    };
	    BehaviorSubject.prototype.next = function (value) {
	        _super.prototype.next.call(this, this._value = value);
	    };
	    return BehaviorSubject;
	}(Subject_1.Subject));
	var BehaviorSubject_2 = BehaviorSubject;


	var BehaviorSubject_1 = {
		BehaviorSubject: BehaviorSubject_2
	};

	// detect environment
	var isNode = !!(
	  // detect node environment
	  typeof module !== 'undefined'
	  && module.exports
	  && typeof process !== 'undefined'
	  && Object.prototype.toString.call(process) === '[object process]'
	);
	var isBrowser = !isNode && typeof window !== 'undefined' && Object.prototype.toString.call(window) === '[object Window]';
	// detect whether webgl is available
	var webGlInfo = getWebGlInfo();
	// detect whether aframe or webgl libs are avilable
	var aFrameReady = !!(isBrowser && window.AFRAME);
	var threeReady = !!(isBrowser && window.THREE);

	var isVisible$ = new BehaviorSubject_1.BehaviorSubject();
	var isFocused$ = new BehaviorSubject_1.BehaviorSubject();

	// create runtime object

	var runtime = {

	  isDebugMode: false,
	  isNode: isNode,

	  // browser specific

	  isBrowser: isBrowser,
	  assertBrowser: assertBrowser,
	  isMobile: detectMobile(),
	  domReady: domReady,
	  isVisible$: isVisible$,
	  isFocused$: isFocused$,

	  has: {
	    webGl: !!webGlInfo,
	    aFrame: aFrameReady,
	    three: threeReady
	  },

	  webGl: webGlInfo,

	  libInfo: {
	    npmName: packageJson.name,
	    version: packageJson.version,
	    homepage: packageJson.homepage,
	    githubRepository: packageJson.repository,
	    gitBranchName: GIT_BRANCH,
	    gitCommitHash: GIT_COMMIT.substr(0,7),
	    buildDate: BUILD_DATE,
	    license: packageJson.license
	  }

	};

	// helpers

	function assertBrowser() {
	  if (!isBrowser) throw ('Sorry this feature requires a browser environment.')
	}

	function getWebGlInfo () {

	  var canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
	  if (!canvas) return null

	  var gl = canvas.getContext('webgl') ||
	    canvas.getContext('experimental-webgl') ||
	    canvas.getContext('webgl', {antialias: false}) ||
	    canvas.getContext('experimental-webgl', {antialias: false});
	  if (!gl) return null

	  var debugInfo = gl.getExtension( 'WEBGL_debug_renderer_info' );
	  var supportsDds = gl.getExtension('WEBGL_compressed_texture_s3tc');

	  return {
	    shadingLanguageVersion: gl.getParameter( gl.SHADING_LANGUAGE_VERSION ),
	    renderer: gl.getParameter( gl.RENDERER ),
	    vendor: gl.getParameter( gl.VENDOR ),
	    unmaskedRenderer: debugInfo && gl.getParameter( debugInfo.UNMASKED_RENDERER_WEBGL ),
	    unmaskedVendor: debugInfo && gl.getParameter( debugInfo.UNMASKED_VENDOR_WEBGL ),
	    maxTextureSize: gl.getParameter( gl.MAX_TEXTURE_SIZE ),
	    maxRenderbufferSize: gl.getParameter( gl.MAX_RENDERBUFFER_SIZE ),
	    supportsDds: !!supportsDds
	  }

	}

	function detectMobile () {
	  var hint;
	  if (typeof navigator !== 'undefined' && (navigator.userAgent || navigator.vendor)) {
	    hint = navigator.userAgent || navigator.vendor;
	  } else if (typeof window !== 'undefined' && window.opera) {
	    hint = window.opera;
	  } else {
	    return false
	  }
	  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(hint)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(hint.substr(0,4))
	}

	// isVisible

	if (isBrowser) {
	  domReady(function(doc){
	    // get initial tab visible state
	    isVisible$.next(getTabVisibleState());
	    // bind tab visibility event
	    var visibilityEventName;
	    if (typeof document.hidden !== "undefined") {
	      visibilityEventName = "visibilitychange";
	    } else if (typeof document.mozHidden !== "undefined") {
	      visibilityEventName = "mozvisibilitychange";
	    } else if (typeof document.msHidden !== "undefined") {
	      visibilityEventName = "msvisibilitychange";
	    } else if (typeof document.webkitHidden !== "undefined") {
	      visibilityEventName = "webkitvisibilitychange";
	    }
	    doc.addEventListener(visibilityEventName, function onTabVisibilityChange () {
	      isVisible$.next(getTabVisibleState());
	    }, false);
	  });
	}

	function getTabVisibleState () {
	  if (document.hidden !== undefined) return !document.hidden
	  if (document.webkitHidden !== undefined) return !document.webkitHidden
	  if (document.mozHidden !== undefined) return !document.mozHidden
	  if (document.msHidden !== undefined) return !document.msHidden
	  return undefined
	}

	// isFocused

	if (isBrowser) {
	  domReady(function(){
	    // get initial state
	    isFocused$.next(document.hasFocus());
	    // bind events
	    window.onfocus = function () {
	      isFocused$.next(true);
	    };
	    window.onblur = function () {
	      isFocused$.next(false);
	    };
	  });

	}

	var bluebird = createCommonjsModule(function (module, exports) {
	/* @preserve
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2013-2017 Petka Antonov
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 * 
	 */
	/**
	 * bluebird build version 3.5.0
	 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
	*/
	!function(e){module.exports=e();}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	var SomePromiseArray = Promise._SomePromiseArray;
	function any(promises) {
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(1);
	    ret.setUnwrap();
	    ret.init();
	    return promise;
	}

	Promise.any = function (promises) {
	    return any(promises);
	};

	Promise.prototype.any = function () {
	    return any(this);
	};

	};

	},{}],2:[function(_dereq_,module,exports){
	"use strict";
	var firstLineError;
	try {throw new Error(); } catch (e) {firstLineError = e;}
	var schedule = _dereq_("./schedule");
	var Queue = _dereq_("./queue");
	var util = _dereq_("./util");

	function Async() {
	    this._customScheduler = false;
	    this._isTickUsed = false;
	    this._lateQueue = new Queue(16);
	    this._normalQueue = new Queue(16);
	    this._haveDrainedQueues = false;
	    this._trampolineEnabled = true;
	    var self = this;
	    this.drainQueues = function () {
	        self._drainQueues();
	    };
	    this._schedule = schedule;
	}

	Async.prototype.setScheduler = function(fn) {
	    var prev = this._schedule;
	    this._schedule = fn;
	    this._customScheduler = true;
	    return prev;
	};

	Async.prototype.hasCustomScheduler = function() {
	    return this._customScheduler;
	};

	Async.prototype.enableTrampoline = function() {
	    this._trampolineEnabled = true;
	};

	Async.prototype.disableTrampolineIfNecessary = function() {
	    if (util.hasDevTools) {
	        this._trampolineEnabled = false;
	    }
	};

	Async.prototype.haveItemsQueued = function () {
	    return this._isTickUsed || this._haveDrainedQueues;
	};


	Async.prototype.fatalError = function(e, isNode) {
	    if (isNode) {
	        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
	            "\n");
	        process.exit(2);
	    } else {
	        this.throwLater(e);
	    }
	};

	Async.prototype.throwLater = function(fn, arg) {
	    if (arguments.length === 1) {
	        arg = fn;
	        fn = function () { throw arg; };
	    }
	    if (typeof setTimeout !== "undefined") {
	        setTimeout(function() {
	            fn(arg);
	        }, 0);
	    } else try {
	        this._schedule(function() {
	            fn(arg);
	        });
	    } catch (e) {
	        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	};

	function AsyncInvokeLater(fn, receiver, arg) {
	    this._lateQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncInvoke(fn, receiver, arg) {
	    this._normalQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncSettlePromises(promise) {
	    this._normalQueue._pushOne(promise);
	    this._queueTick();
	}

	if (!util.hasDevTools) {
	    Async.prototype.invokeLater = AsyncInvokeLater;
	    Async.prototype.invoke = AsyncInvoke;
	    Async.prototype.settlePromises = AsyncSettlePromises;
	} else {
	    Async.prototype.invokeLater = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvokeLater.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                setTimeout(function() {
	                    fn.call(receiver, arg);
	                }, 100);
	            });
	        }
	    };

	    Async.prototype.invoke = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvoke.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                fn.call(receiver, arg);
	            });
	        }
	    };

	    Async.prototype.settlePromises = function(promise) {
	        if (this._trampolineEnabled) {
	            AsyncSettlePromises.call(this, promise);
	        } else {
	            this._schedule(function() {
	                promise._settlePromises();
	            });
	        }
	    };
	}

	Async.prototype._drainQueue = function(queue) {
	    while (queue.length() > 0) {
	        var fn = queue.shift();
	        if (typeof fn !== "function") {
	            fn._settlePromises();
	            continue;
	        }
	        var receiver = queue.shift();
	        var arg = queue.shift();
	        fn.call(receiver, arg);
	    }
	};

	Async.prototype._drainQueues = function () {
	    this._drainQueue(this._normalQueue);
	    this._reset();
	    this._haveDrainedQueues = true;
	    this._drainQueue(this._lateQueue);
	};

	Async.prototype._queueTick = function () {
	    if (!this._isTickUsed) {
	        this._isTickUsed = true;
	        this._schedule(this.drainQueues);
	    }
	};

	Async.prototype._reset = function () {
	    this._isTickUsed = false;
	};

	module.exports = Async;
	module.exports.firstLineError = firstLineError;

	},{"./queue":26,"./schedule":29,"./util":36}],3:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
	var calledBind = false;
	var rejectThis = function(_, e) {
	    this._reject(e);
	};

	var targetRejected = function(e, context) {
	    context.promiseRejectionQueued = true;
	    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
	};

	var bindingResolved = function(thisArg, context) {
	    if (((this._bitField & 50397184) === 0)) {
	        this._resolveCallback(context.target);
	    }
	};

	var bindingRejected = function(e, context) {
	    if (!context.promiseRejectionQueued) this._reject(e);
	};

	Promise.prototype.bind = function (thisArg) {
	    if (!calledBind) {
	        calledBind = true;
	        Promise.prototype._propagateFrom = debug.propagateFromFunction();
	        Promise.prototype._boundValue = debug.boundValueFunction();
	    }
	    var maybePromise = tryConvertToPromise(thisArg);
	    var ret = new Promise(INTERNAL);
	    ret._propagateFrom(this, 1);
	    var target = this._target();
	    ret._setBoundTo(maybePromise);
	    if (maybePromise instanceof Promise) {
	        var context = {
	            promiseRejectionQueued: false,
	            promise: ret,
	            target: target,
	            bindingPromise: maybePromise
	        };
	        target._then(INTERNAL, targetRejected, undefined, ret, context);
	        maybePromise._then(
	            bindingResolved, bindingRejected, undefined, ret, context);
	        ret._setOnCancel(maybePromise);
	    } else {
	        ret._resolveCallback(target);
	    }
	    return ret;
	};

	Promise.prototype._setBoundTo = function (obj) {
	    if (obj !== undefined) {
	        this._bitField = this._bitField | 2097152;
	        this._boundTo = obj;
	    } else {
	        this._bitField = this._bitField & (~2097152);
	    }
	};

	Promise.prototype._isBound = function () {
	    return (this._bitField & 2097152) === 2097152;
	};

	Promise.bind = function (thisArg, value) {
	    return Promise.resolve(value).bind(thisArg);
	};
	};

	},{}],4:[function(_dereq_,module,exports){
	"use strict";
	var old;
	if (typeof Promise !== "undefined") old = Promise;
	function noConflict() {
	    try { if (Promise === bluebird) Promise = old; }
	    catch (e) {}
	    return bluebird;
	}
	var bluebird = _dereq_("./promise")();
	bluebird.noConflict = noConflict;
	module.exports = bluebird;

	},{"./promise":22}],5:[function(_dereq_,module,exports){
	"use strict";
	var cr = Object.create;
	if (cr) {
	    var callerCache = cr(null);
	    var getterCache = cr(null);
	    callerCache[" size"] = getterCache[" size"] = 0;
	}

	module.exports = function(Promise) {
	var util = _dereq_("./util");
	var canEvaluate = util.canEvaluate;
	var isIdentifier = util.isIdentifier;

	var getMethodCaller;
	var getGetter;
	function ensureMethod(obj, methodName) {
	    var fn;
	    if (obj != null) fn = obj[methodName];
	    if (typeof fn !== "function") {
	        var message = "Object " + util.classString(obj) + " has no method '" +
	            util.toString(methodName) + "'";
	        throw new Promise.TypeError(message);
	    }
	    return fn;
	}

	function caller(obj) {
	    var methodName = this.pop();
	    var fn = ensureMethod(obj, methodName);
	    return fn.apply(obj, this);
	}
	Promise.prototype.call = function (methodName) {
	    var args = [].slice.call(arguments, 1);
	    args.push(methodName);
	    return this._then(caller, undefined, undefined, args, undefined);
	};

	function namedGetter(obj) {
	    return obj[this];
	}
	function indexedGetter(obj) {
	    var index = +this;
	    if (index < 0) index = Math.max(0, index + obj.length);
	    return obj[index];
	}
	Promise.prototype.get = function (propertyName) {
	    var isIndex = (typeof propertyName === "number");
	    var getter;
	    if (!isIndex) {
	        if (canEvaluate) {
	            var maybeGetter = getGetter(propertyName);
	            getter = maybeGetter !== null ? maybeGetter : namedGetter;
	        } else {
	            getter = namedGetter;
	        }
	    } else {
	        getter = indexedGetter;
	    }
	    return this._then(getter, undefined, undefined, propertyName, undefined);
	};
	};

	},{"./util":36}],6:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, PromiseArray, apiRejection, debug) {
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;
	var async = Promise._async;

	Promise.prototype["break"] = Promise.prototype.cancel = function() {
	    if (!debug.cancellation()) return this._warn("cancellation is disabled");

	    var promise = this;
	    var child = promise;
	    while (promise._isCancellable()) {
	        if (!promise._cancelBy(child)) {
	            if (child._isFollowing()) {
	                child._followee().cancel();
	            } else {
	                child._cancelBranched();
	            }
	            break;
	        }

	        var parent = promise._cancellationParent;
	        if (parent == null || !parent._isCancellable()) {
	            if (promise._isFollowing()) {
	                promise._followee().cancel();
	            } else {
	                promise._cancelBranched();
	            }
	            break;
	        } else {
	            if (promise._isFollowing()) promise._followee().cancel();
	            promise._setWillBeCancelled();
	            child = promise;
	            promise = parent;
	        }
	    }
	};

	Promise.prototype._branchHasCancelled = function() {
	    this._branchesRemainingToCancel--;
	};

	Promise.prototype._enoughBranchesHaveCancelled = function() {
	    return this._branchesRemainingToCancel === undefined ||
	           this._branchesRemainingToCancel <= 0;
	};

	Promise.prototype._cancelBy = function(canceller) {
	    if (canceller === this) {
	        this._branchesRemainingToCancel = 0;
	        this._invokeOnCancel();
	        return true;
	    } else {
	        this._branchHasCancelled();
	        if (this._enoughBranchesHaveCancelled()) {
	            this._invokeOnCancel();
	            return true;
	        }
	    }
	    return false;
	};

	Promise.prototype._cancelBranched = function() {
	    if (this._enoughBranchesHaveCancelled()) {
	        this._cancel();
	    }
	};

	Promise.prototype._cancel = function() {
	    if (!this._isCancellable()) return;
	    this._setCancelled();
	    async.invoke(this._cancelPromises, this, undefined);
	};

	Promise.prototype._cancelPromises = function() {
	    if (this._length() > 0) this._settlePromises();
	};

	Promise.prototype._unsetOnCancel = function() {
	    this._onCancelField = undefined;
	};

	Promise.prototype._isCancellable = function() {
	    return this.isPending() && !this._isCancelled();
	};

	Promise.prototype.isCancellable = function() {
	    return this.isPending() && !this.isCancelled();
	};

	Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
	    if (util.isArray(onCancelCallback)) {
	        for (var i = 0; i < onCancelCallback.length; ++i) {
	            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
	        }
	    } else if (onCancelCallback !== undefined) {
	        if (typeof onCancelCallback === "function") {
	            if (!internalOnly) {
	                var e = tryCatch(onCancelCallback).call(this._boundValue());
	                if (e === errorObj) {
	                    this._attachExtraTrace(e.e);
	                    async.throwLater(e.e);
	                }
	            }
	        } else {
	            onCancelCallback._resultCancelled(this);
	        }
	    }
	};

	Promise.prototype._invokeOnCancel = function() {
	    var onCancelCallback = this._onCancel();
	    this._unsetOnCancel();
	    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
	};

	Promise.prototype._invokeInternalOnCancel = function() {
	    if (this._isCancellable()) {
	        this._doInvokeOnCancel(this._onCancel(), true);
	        this._unsetOnCancel();
	    }
	};

	Promise.prototype._resultCancelled = function() {
	    this.cancel();
	};

	};

	},{"./util":36}],7:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(NEXT_FILTER) {
	var util = _dereq_("./util");
	var getKeys = _dereq_("./es5").keys;
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;

	function catchFilter(instances, cb, promise) {
	    return function(e) {
	        var boundTo = promise._boundValue();
	        predicateLoop: for (var i = 0; i < instances.length; ++i) {
	            var item = instances[i];

	            if (item === Error ||
	                (item != null && item.prototype instanceof Error)) {
	                if (e instanceof item) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (typeof item === "function") {
	                var matchesPredicate = tryCatch(item).call(boundTo, e);
	                if (matchesPredicate === errorObj) {
	                    return matchesPredicate;
	                } else if (matchesPredicate) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (util.isObject(e)) {
	                var keys = getKeys(item);
	                for (var j = 0; j < keys.length; ++j) {
	                    var key = keys[j];
	                    if (item[key] != e[key]) {
	                        continue predicateLoop;
	                    }
	                }
	                return tryCatch(cb).call(boundTo, e);
	            }
	        }
	        return NEXT_FILTER;
	    };
	}

	return catchFilter;
	};

	},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	var longStackTraces = false;
	var contextStack = [];

	Promise.prototype._promiseCreated = function() {};
	Promise.prototype._pushContext = function() {};
	Promise.prototype._popContext = function() {return null;};
	Promise._peekContext = Promise.prototype._peekContext = function() {};

	function Context() {
	    this._trace = new Context.CapturedTrace(peekContext());
	}
	Context.prototype._pushContext = function () {
	    if (this._trace !== undefined) {
	        this._trace._promiseCreated = null;
	        contextStack.push(this._trace);
	    }
	};

	Context.prototype._popContext = function () {
	    if (this._trace !== undefined) {
	        var trace = contextStack.pop();
	        var ret = trace._promiseCreated;
	        trace._promiseCreated = null;
	        return ret;
	    }
	    return null;
	};

	function createContext() {
	    if (longStackTraces) return new Context();
	}

	function peekContext() {
	    var lastIndex = contextStack.length - 1;
	    if (lastIndex >= 0) {
	        return contextStack[lastIndex];
	    }
	    return undefined;
	}
	Context.CapturedTrace = null;
	Context.create = createContext;
	Context.deactivateLongStackTraces = function() {};
	Context.activateLongStackTraces = function() {
	    var Promise_pushContext = Promise.prototype._pushContext;
	    var Promise_popContext = Promise.prototype._popContext;
	    var Promise_PeekContext = Promise._peekContext;
	    var Promise_peekContext = Promise.prototype._peekContext;
	    var Promise_promiseCreated = Promise.prototype._promiseCreated;
	    Context.deactivateLongStackTraces = function() {
	        Promise.prototype._pushContext = Promise_pushContext;
	        Promise.prototype._popContext = Promise_popContext;
	        Promise._peekContext = Promise_PeekContext;
	        Promise.prototype._peekContext = Promise_peekContext;
	        Promise.prototype._promiseCreated = Promise_promiseCreated;
	        longStackTraces = false;
	    };
	    longStackTraces = true;
	    Promise.prototype._pushContext = Context.prototype._pushContext;
	    Promise.prototype._popContext = Context.prototype._popContext;
	    Promise._peekContext = Promise.prototype._peekContext = peekContext;
	    Promise.prototype._promiseCreated = function() {
	        var ctx = this._peekContext();
	        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
	    };
	};
	return Context;
	};

	},{}],9:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, Context) {
	var getDomain = Promise._getDomain;
	var async = Promise._async;
	var Warning = _dereq_("./errors").Warning;
	var util = _dereq_("./util");
	var canAttachTrace = util.canAttachTrace;
	var unhandledRejectionHandled;
	var possiblyUnhandledRejection;
	var bluebirdFramePattern =
	    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
	var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
	var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
	var stackFramePattern = null;
	var formatStack = null;
	var indentStackFrames = false;
	var printWarning;
	var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
	                        (true ||
	                         util.env("BLUEBIRD_DEBUG") ||
	                         util.env("NODE_ENV") === "development"));

	var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
	    (debugging || util.env("BLUEBIRD_WARNINGS")));

	var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
	    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

	var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
	    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

	Promise.prototype.suppressUnhandledRejections = function() {
	    var target = this._target();
	    target._bitField = ((target._bitField & (~1048576)) |
	                      524288);
	};

	Promise.prototype._ensurePossibleRejectionHandled = function () {
	    if ((this._bitField & 524288) !== 0) return;
	    this._setRejectionIsUnhandled();
	    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
	};

	Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
	    fireRejectionEvent("rejectionHandled",
	                                  unhandledRejectionHandled, undefined, this);
	};

	Promise.prototype._setReturnedNonUndefined = function() {
	    this._bitField = this._bitField | 268435456;
	};

	Promise.prototype._returnedNonUndefined = function() {
	    return (this._bitField & 268435456) !== 0;
	};

	Promise.prototype._notifyUnhandledRejection = function () {
	    if (this._isRejectionUnhandled()) {
	        var reason = this._settledValue();
	        this._setUnhandledRejectionIsNotified();
	        fireRejectionEvent("unhandledRejection",
	                                      possiblyUnhandledRejection, reason, this);
	    }
	};

	Promise.prototype._setUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField | 262144;
	};

	Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField & (~262144);
	};

	Promise.prototype._isUnhandledRejectionNotified = function () {
	    return (this._bitField & 262144) > 0;
	};

	Promise.prototype._setRejectionIsUnhandled = function () {
	    this._bitField = this._bitField | 1048576;
	};

	Promise.prototype._unsetRejectionIsUnhandled = function () {
	    this._bitField = this._bitField & (~1048576);
	    if (this._isUnhandledRejectionNotified()) {
	        this._unsetUnhandledRejectionIsNotified();
	        this._notifyUnhandledRejectionIsHandled();
	    }
	};

	Promise.prototype._isRejectionUnhandled = function () {
	    return (this._bitField & 1048576) > 0;
	};

	Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
	    return warn(message, shouldUseOwnTrace, promise || this);
	};

	Promise.onPossiblyUnhandledRejection = function (fn) {
	    var domain = getDomain();
	    possiblyUnhandledRejection =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util.domainBind(domain, fn))
	                                 : undefined;
	};

	Promise.onUnhandledRejectionHandled = function (fn) {
	    var domain = getDomain();
	    unhandledRejectionHandled =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util.domainBind(domain, fn))
	                                 : undefined;
	};

	var disableLongStackTraces = function() {};
	Promise.longStackTraces = function () {
	    if (async.haveItemsQueued() && !config.longStackTraces) {
	        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (!config.longStackTraces && longStackTracesIsSupported()) {
	        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
	        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
	        config.longStackTraces = true;
	        disableLongStackTraces = function() {
	            if (async.haveItemsQueued() && !config.longStackTraces) {
	                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	            }
	            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
	            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
	            Context.deactivateLongStackTraces();
	            async.enableTrampoline();
	            config.longStackTraces = false;
	        };
	        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
	        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
	        Context.activateLongStackTraces();
	        async.disableTrampolineIfNecessary();
	    }
	};

	Promise.hasLongStackTraces = function () {
	    return config.longStackTraces && longStackTracesIsSupported();
	};

	var fireDomEvent = (function() {
	    try {
	        if (typeof CustomEvent === "function") {
	            var event = new CustomEvent("CustomEvent");
	            util.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new CustomEvent(name.toLowerCase(), {
	                    detail: event,
	                    cancelable: true
	                });
	                return !util.global.dispatchEvent(domEvent);
	            };
	        } else if (typeof Event === "function") {
	            var event = new Event("CustomEvent");
	            util.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new Event(name.toLowerCase(), {
	                    cancelable: true
	                });
	                domEvent.detail = event;
	                return !util.global.dispatchEvent(domEvent);
	            };
	        } else {
	            var event = document.createEvent("CustomEvent");
	            event.initCustomEvent("testingtheevent", false, true, {});
	            util.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = document.createEvent("CustomEvent");
	                domEvent.initCustomEvent(name.toLowerCase(), false, true,
	                    event);
	                return !util.global.dispatchEvent(domEvent);
	            };
	        }
	    } catch (e) {}
	    return function() {
	        return false;
	    };
	})();

	var fireGlobalEvent = (function() {
	    if (util.isNode) {
	        return function() {
	            return process.emit.apply(process, arguments);
	        };
	    } else {
	        if (!util.global) {
	            return function() {
	                return false;
	            };
	        }
	        return function(name) {
	            var methodName = "on" + name.toLowerCase();
	            var method = util.global[methodName];
	            if (!method) return false;
	            method.apply(util.global, [].slice.call(arguments, 1));
	            return true;
	        };
	    }
	})();

	function generatePromiseLifecycleEventObject(name, promise) {
	    return {promise: promise};
	}

	var eventToObjectGenerator = {
	    promiseCreated: generatePromiseLifecycleEventObject,
	    promiseFulfilled: generatePromiseLifecycleEventObject,
	    promiseRejected: generatePromiseLifecycleEventObject,
	    promiseResolved: generatePromiseLifecycleEventObject,
	    promiseCancelled: generatePromiseLifecycleEventObject,
	    promiseChained: function(name, promise, child) {
	        return {promise: promise, child: child};
	    },
	    warning: function(name, warning) {
	        return {warning: warning};
	    },
	    unhandledRejection: function (name, reason, promise) {
	        return {reason: reason, promise: promise};
	    },
	    rejectionHandled: generatePromiseLifecycleEventObject
	};

	var activeFireEvent = function (name) {
	    var globalEventFired = false;
	    try {
	        globalEventFired = fireGlobalEvent.apply(null, arguments);
	    } catch (e) {
	        async.throwLater(e);
	        globalEventFired = true;
	    }

	    var domEventFired = false;
	    try {
	        domEventFired = fireDomEvent(name,
	                    eventToObjectGenerator[name].apply(null, arguments));
	    } catch (e) {
	        async.throwLater(e);
	        domEventFired = true;
	    }

	    return domEventFired || globalEventFired;
	};

	Promise.config = function(opts) {
	    opts = Object(opts);
	    if ("longStackTraces" in opts) {
	        if (opts.longStackTraces) {
	            Promise.longStackTraces();
	        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
	            disableLongStackTraces();
	        }
	    }
	    if ("warnings" in opts) {
	        var warningsOption = opts.warnings;
	        config.warnings = !!warningsOption;
	        wForgottenReturn = config.warnings;

	        if (util.isObject(warningsOption)) {
	            if ("wForgottenReturn" in warningsOption) {
	                wForgottenReturn = !!warningsOption.wForgottenReturn;
	            }
	        }
	    }
	    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
	        if (async.haveItemsQueued()) {
	            throw new Error(
	                "cannot enable cancellation after promises are in use");
	        }
	        Promise.prototype._clearCancellationData =
	            cancellationClearCancellationData;
	        Promise.prototype._propagateFrom = cancellationPropagateFrom;
	        Promise.prototype._onCancel = cancellationOnCancel;
	        Promise.prototype._setOnCancel = cancellationSetOnCancel;
	        Promise.prototype._attachCancellationCallback =
	            cancellationAttachCancellationCallback;
	        Promise.prototype._execute = cancellationExecute;
	        propagateFromFunction = cancellationPropagateFrom;
	        config.cancellation = true;
	    }
	    if ("monitoring" in opts) {
	        if (opts.monitoring && !config.monitoring) {
	            config.monitoring = true;
	            Promise.prototype._fireEvent = activeFireEvent;
	        } else if (!opts.monitoring && config.monitoring) {
	            config.monitoring = false;
	            Promise.prototype._fireEvent = defaultFireEvent;
	        }
	    }
	    return Promise;
	};

	function defaultFireEvent() { return false; }

	Promise.prototype._fireEvent = defaultFireEvent;
	Promise.prototype._execute = function(executor, resolve, reject) {
	    try {
	        executor(resolve, reject);
	    } catch (e) {
	        return e;
	    }
	};
	Promise.prototype._onCancel = function () {};
	Promise.prototype._setOnCancel = function (handler) {  };
	Promise.prototype._attachCancellationCallback = function(onCancel) {
	    
	};
	Promise.prototype._captureStackTrace = function () {};
	Promise.prototype._attachExtraTrace = function () {};
	Promise.prototype._clearCancellationData = function() {};
	Promise.prototype._propagateFrom = function (parent, flags) {
	    
	    
	};

	function cancellationExecute(executor, resolve, reject) {
	    var promise = this;
	    try {
	        executor(resolve, reject, function(onCancel) {
	            if (typeof onCancel !== "function") {
	                throw new TypeError("onCancel must be a function, got: " +
	                                    util.toString(onCancel));
	            }
	            promise._attachCancellationCallback(onCancel);
	        });
	    } catch (e) {
	        return e;
	    }
	}

	function cancellationAttachCancellationCallback(onCancel) {
	    if (!this._isCancellable()) return this;

	    var previousOnCancel = this._onCancel();
	    if (previousOnCancel !== undefined) {
	        if (util.isArray(previousOnCancel)) {
	            previousOnCancel.push(onCancel);
	        } else {
	            this._setOnCancel([previousOnCancel, onCancel]);
	        }
	    } else {
	        this._setOnCancel(onCancel);
	    }
	}

	function cancellationOnCancel() {
	    return this._onCancelField;
	}

	function cancellationSetOnCancel(onCancel) {
	    this._onCancelField = onCancel;
	}

	function cancellationClearCancellationData() {
	    this._cancellationParent = undefined;
	    this._onCancelField = undefined;
	}

	function cancellationPropagateFrom(parent, flags) {
	    if ((flags & 1) !== 0) {
	        this._cancellationParent = parent;
	        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
	        if (branchesRemainingToCancel === undefined) {
	            branchesRemainingToCancel = 0;
	        }
	        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
	    }
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}

	function bindingPropagateFrom(parent, flags) {
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}
	var propagateFromFunction = bindingPropagateFrom;

	function boundValueFunction() {
	    var ret = this._boundTo;
	    if (ret !== undefined) {
	        if (ret instanceof Promise) {
	            if (ret.isFulfilled()) {
	                return ret.value();
	            } else {
	                return undefined;
	            }
	        }
	    }
	    return ret;
	}

	function longStackTracesCaptureStackTrace() {
	    this._trace = new CapturedTrace(this._peekContext());
	}

	function longStackTracesAttachExtraTrace(error, ignoreSelf) {
	    if (canAttachTrace(error)) {
	        var trace = this._trace;
	        if (trace !== undefined) {
	            if (ignoreSelf) trace = trace._parent;
	        }
	        if (trace !== undefined) {
	            trace.attachExtraTrace(error);
	        } else if (!error.__stackCleaned__) {
	            var parsed = parseStackAndMessage(error);
	            util.notEnumerableProp(error, "stack",
	                parsed.message + "\n" + parsed.stack.join("\n"));
	            util.notEnumerableProp(error, "__stackCleaned__", true);
	        }
	    }
	}

	function checkForgottenReturns(returnValue, promiseCreated, name, promise,
	                               parent) {
	    if (returnValue === undefined && promiseCreated !== null &&
	        wForgottenReturn) {
	        if (parent !== undefined && parent._returnedNonUndefined()) return;
	        if ((promise._bitField & 65535) === 0) return;

	        if (name) name = name + " ";
	        var handlerLine = "";
	        var creatorLine = "";
	        if (promiseCreated._trace) {
	            var traceLines = promiseCreated._trace.stack.split("\n");
	            var stack = cleanStack(traceLines);
	            for (var i = stack.length - 1; i >= 0; --i) {
	                var line = stack[i];
	                if (!nodeFramePattern.test(line)) {
	                    var lineMatches = line.match(parseLinePattern);
	                    if (lineMatches) {
	                        handlerLine  = "at " + lineMatches[1] +
	                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
	                    }
	                    break;
	                }
	            }

	            if (stack.length > 0) {
	                var firstUserLine = stack[0];
	                for (var i = 0; i < traceLines.length; ++i) {

	                    if (traceLines[i] === firstUserLine) {
	                        if (i > 0) {
	                            creatorLine = "\n" + traceLines[i - 1];
	                        }
	                        break;
	                    }
	                }

	            }
	        }
	        var msg = "a promise was created in a " + name +
	            "handler " + handlerLine + "but was not returned from it, " +
	            "see http://goo.gl/rRqMUw" +
	            creatorLine;
	        promise._warn(msg, true, promiseCreated);
	    }
	}

	function deprecated(name, replacement) {
	    var message = name +
	        " is deprecated and will be removed in a future version.";
	    if (replacement) message += " Use " + replacement + " instead.";
	    return warn(message);
	}

	function warn(message, shouldUseOwnTrace, promise) {
	    if (!config.warnings) return;
	    var warning = new Warning(message);
	    var ctx;
	    if (shouldUseOwnTrace) {
	        promise._attachExtraTrace(warning);
	    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
	        ctx.attachExtraTrace(warning);
	    } else {
	        var parsed = parseStackAndMessage(warning);
	        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
	    }

	    if (!activeFireEvent("warning", warning)) {
	        formatAndLogError(warning, "", true);
	    }
	}

	function reconstructStack(message, stacks) {
	    for (var i = 0; i < stacks.length - 1; ++i) {
	        stacks[i].push("From previous event:");
	        stacks[i] = stacks[i].join("\n");
	    }
	    if (i < stacks.length) {
	        stacks[i] = stacks[i].join("\n");
	    }
	    return message + "\n" + stacks.join("\n");
	}

	function removeDuplicateOrEmptyJumps(stacks) {
	    for (var i = 0; i < stacks.length; ++i) {
	        if (stacks[i].length === 0 ||
	            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
	            stacks.splice(i, 1);
	            i--;
	        }
	    }
	}

	function removeCommonRoots(stacks) {
	    var current = stacks[0];
	    for (var i = 1; i < stacks.length; ++i) {
	        var prev = stacks[i];
	        var currentLastIndex = current.length - 1;
	        var currentLastLine = current[currentLastIndex];
	        var commonRootMeetPoint = -1;

	        for (var j = prev.length - 1; j >= 0; --j) {
	            if (prev[j] === currentLastLine) {
	                commonRootMeetPoint = j;
	                break;
	            }
	        }

	        for (var j = commonRootMeetPoint; j >= 0; --j) {
	            var line = prev[j];
	            if (current[currentLastIndex] === line) {
	                current.pop();
	                currentLastIndex--;
	            } else {
	                break;
	            }
	        }
	        current = prev;
	    }
	}

	function cleanStack(stack) {
	    var ret = [];
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        var isTraceLine = "    (No stack trace)" === line ||
	            stackFramePattern.test(line);
	        var isInternalFrame = isTraceLine && shouldIgnore(line);
	        if (isTraceLine && !isInternalFrame) {
	            if (indentStackFrames && line.charAt(0) !== " ") {
	                line = "    " + line;
	            }
	            ret.push(line);
	        }
	    }
	    return ret;
	}

	function stackFramesAsArray(error) {
	    var stack = error.stack.replace(/\s+$/g, "").split("\n");
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
	            break;
	        }
	    }
	    if (i > 0 && error.name != "SyntaxError") {
	        stack = stack.slice(i);
	    }
	    return stack;
	}

	function parseStackAndMessage(error) {
	    var stack = error.stack;
	    var message = error.toString();
	    stack = typeof stack === "string" && stack.length > 0
	                ? stackFramesAsArray(error) : ["    (No stack trace)"];
	    return {
	        message: message,
	        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
	    };
	}

	function formatAndLogError(error, title, isSoft) {
	    if (typeof console !== "undefined") {
	        var message;
	        if (util.isObject(error)) {
	            var stack = error.stack;
	            message = title + formatStack(stack, error);
	        } else {
	            message = title + String(error);
	        }
	        if (typeof printWarning === "function") {
	            printWarning(message, isSoft);
	        } else if (typeof console.log === "function" ||
	            typeof console.log === "object") {
	            console.log(message);
	        }
	    }
	}

	function fireRejectionEvent(name, localHandler, reason, promise) {
	    var localEventFired = false;
	    try {
	        if (typeof localHandler === "function") {
	            localEventFired = true;
	            if (name === "rejectionHandled") {
	                localHandler(promise);
	            } else {
	                localHandler(reason, promise);
	            }
	        }
	    } catch (e) {
	        async.throwLater(e);
	    }

	    if (name === "unhandledRejection") {
	        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
	            formatAndLogError(reason, "Unhandled rejection ");
	        }
	    } else {
	        activeFireEvent(name, promise);
	    }
	}

	function formatNonError(obj) {
	    var str;
	    if (typeof obj === "function") {
	        str = "[function " +
	            (obj.name || "anonymous") +
	            "]";
	    } else {
	        str = obj && typeof obj.toString === "function"
	            ? obj.toString() : util.toString(obj);
	        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
	        if (ruselessToString.test(str)) {
	            try {
	                var newStr = JSON.stringify(obj);
	                str = newStr;
	            }
	            catch(e) {

	            }
	        }
	        if (str.length === 0) {
	            str = "(empty array)";
	        }
	    }
	    return ("(<" + snip(str) + ">, no stack trace)");
	}

	function snip(str) {
	    var maxChars = 41;
	    if (str.length < maxChars) {
	        return str;
	    }
	    return str.substr(0, maxChars - 3) + "...";
	}

	function longStackTracesIsSupported() {
	    return typeof captureStackTrace === "function";
	}

	var shouldIgnore = function() { return false; };
	var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
	function parseLineInfo(line) {
	    var matches = line.match(parseLineInfoRegex);
	    if (matches) {
	        return {
	            fileName: matches[1],
	            line: parseInt(matches[2], 10)
	        };
	    }
	}

	function setBounds(firstLineError, lastLineError) {
	    if (!longStackTracesIsSupported()) return;
	    var firstStackLines = firstLineError.stack.split("\n");
	    var lastStackLines = lastLineError.stack.split("\n");
	    var firstIndex = -1;
	    var lastIndex = -1;
	    var firstFileName;
	    var lastFileName;
	    for (var i = 0; i < firstStackLines.length; ++i) {
	        var result = parseLineInfo(firstStackLines[i]);
	        if (result) {
	            firstFileName = result.fileName;
	            firstIndex = result.line;
	            break;
	        }
	    }
	    for (var i = 0; i < lastStackLines.length; ++i) {
	        var result = parseLineInfo(lastStackLines[i]);
	        if (result) {
	            lastFileName = result.fileName;
	            lastIndex = result.line;
	            break;
	        }
	    }
	    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
	        firstFileName !== lastFileName || firstIndex >= lastIndex) {
	        return;
	    }

	    shouldIgnore = function(line) {
	        if (bluebirdFramePattern.test(line)) return true;
	        var info = parseLineInfo(line);
	        if (info) {
	            if (info.fileName === firstFileName &&
	                (firstIndex <= info.line && info.line <= lastIndex)) {
	                return true;
	            }
	        }
	        return false;
	    };
	}

	function CapturedTrace(parent) {
	    this._parent = parent;
	    this._promisesCreated = 0;
	    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
	    captureStackTrace(this, CapturedTrace);
	    if (length > 32) this.uncycle();
	}
	util.inherits(CapturedTrace, Error);
	Context.CapturedTrace = CapturedTrace;

	CapturedTrace.prototype.uncycle = function() {
	    var length = this._length;
	    if (length < 2) return;
	    var nodes = [];
	    var stackToIndex = {};

	    for (var i = 0, node = this; node !== undefined; ++i) {
	        nodes.push(node);
	        node = node._parent;
	    }
	    length = this._length = i;
	    for (var i = length - 1; i >= 0; --i) {
	        var stack = nodes[i].stack;
	        if (stackToIndex[stack] === undefined) {
	            stackToIndex[stack] = i;
	        }
	    }
	    for (var i = 0; i < length; ++i) {
	        var currentStack = nodes[i].stack;
	        var index = stackToIndex[currentStack];
	        if (index !== undefined && index !== i) {
	            if (index > 0) {
	                nodes[index - 1]._parent = undefined;
	                nodes[index - 1]._length = 1;
	            }
	            nodes[i]._parent = undefined;
	            nodes[i]._length = 1;
	            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

	            if (index < length - 1) {
	                cycleEdgeNode._parent = nodes[index + 1];
	                cycleEdgeNode._parent.uncycle();
	                cycleEdgeNode._length =
	                    cycleEdgeNode._parent._length + 1;
	            } else {
	                cycleEdgeNode._parent = undefined;
	                cycleEdgeNode._length = 1;
	            }
	            var currentChildLength = cycleEdgeNode._length + 1;
	            for (var j = i - 2; j >= 0; --j) {
	                nodes[j]._length = currentChildLength;
	                currentChildLength++;
	            }
	            return;
	        }
	    }
	};

	CapturedTrace.prototype.attachExtraTrace = function(error) {
	    if (error.__stackCleaned__) return;
	    this.uncycle();
	    var parsed = parseStackAndMessage(error);
	    var message = parsed.message;
	    var stacks = [parsed.stack];

	    var trace = this;
	    while (trace !== undefined) {
	        stacks.push(cleanStack(trace.stack.split("\n")));
	        trace = trace._parent;
	    }
	    removeCommonRoots(stacks);
	    removeDuplicateOrEmptyJumps(stacks);
	    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
	    util.notEnumerableProp(error, "__stackCleaned__", true);
	};

	var captureStackTrace = (function stackDetection() {
	    var v8stackFramePattern = /^\s*at\s*/;
	    var v8stackFormatter = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if (error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    if (typeof Error.stackTraceLimit === "number" &&
	        typeof Error.captureStackTrace === "function") {
	        Error.stackTraceLimit += 6;
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        var captureStackTrace = Error.captureStackTrace;

	        shouldIgnore = function(line) {
	            return bluebirdFramePattern.test(line);
	        };
	        return function(receiver, ignoreUntil) {
	            Error.stackTraceLimit += 6;
	            captureStackTrace(receiver, ignoreUntil);
	            Error.stackTraceLimit -= 6;
	        };
	    }
	    var err = new Error();

	    if (typeof err.stack === "string" &&
	        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
	        stackFramePattern = /@/;
	        formatStack = v8stackFormatter;
	        indentStackFrames = true;
	        return function captureStackTrace(o) {
	            o.stack = new Error().stack;
	        };
	    }

	    var hasStackAfterThrow;
	    try { throw new Error(); }
	    catch(e) {
	        hasStackAfterThrow = ("stack" in e);
	    }
	    if (!("stack" in err) && hasStackAfterThrow &&
	        typeof Error.stackTraceLimit === "number") {
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        return function captureStackTrace(o) {
	            Error.stackTraceLimit += 6;
	            try { throw new Error(); }
	            catch(e) { o.stack = e.stack; }
	            Error.stackTraceLimit -= 6;
	        };
	    }

	    formatStack = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if ((typeof error === "object" ||
	            typeof error === "function") &&
	            error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    return null;

	})([]);

	if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
	    printWarning = function (message) {
	        console.warn(message);
	    };
	    if (util.isNode && process.stderr.isTTY) {
	        printWarning = function(message, isSoft) {
	            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
	            console.warn(color + message + "\u001b[0m\n");
	        };
	    } else if (!util.isNode && typeof (new Error().stack) === "string") {
	        printWarning = function(message, isSoft) {
	            console.warn("%c" + message,
	                        isSoft ? "color: darkorange" : "color: red");
	        };
	    }
	}

	var config = {
	    warnings: warnings,
	    longStackTraces: false,
	    cancellation: false,
	    monitoring: false
	};

	if (longStackTraces) Promise.longStackTraces();

	return {
	    longStackTraces: function() {
	        return config.longStackTraces;
	    },
	    warnings: function() {
	        return config.warnings;
	    },
	    cancellation: function() {
	        return config.cancellation;
	    },
	    monitoring: function() {
	        return config.monitoring;
	    },
	    propagateFromFunction: function() {
	        return propagateFromFunction;
	    },
	    boundValueFunction: function() {
	        return boundValueFunction;
	    },
	    checkForgottenReturns: checkForgottenReturns,
	    setBounds: setBounds,
	    warn: warn,
	    deprecated: deprecated,
	    CapturedTrace: CapturedTrace,
	    fireDomEvent: fireDomEvent,
	    fireGlobalEvent: fireGlobalEvent
	};
	};

	},{"./errors":12,"./util":36}],10:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	function returner() {
	    return this.value;
	}
	function thrower() {
	    throw this.reason;
	}

	Promise.prototype["return"] =
	Promise.prototype.thenReturn = function (value) {
	    if (value instanceof Promise) value.suppressUnhandledRejections();
	    return this._then(
	        returner, undefined, undefined, {value: value}, undefined);
	};

	Promise.prototype["throw"] =
	Promise.prototype.thenThrow = function (reason) {
	    return this._then(
	        thrower, undefined, undefined, {reason: reason}, undefined);
	};

	Promise.prototype.catchThrow = function (reason) {
	    if (arguments.length <= 1) {
	        return this._then(
	            undefined, thrower, undefined, {reason: reason}, undefined);
	    } else {
	        var _reason = arguments[1];
	        var handler = function() {throw _reason;};
	        return this.caught(reason, handler);
	    }
	};

	Promise.prototype.catchReturn = function (value) {
	    if (arguments.length <= 1) {
	        if (value instanceof Promise) value.suppressUnhandledRejections();
	        return this._then(
	            undefined, returner, undefined, {value: value}, undefined);
	    } else {
	        var _value = arguments[1];
	        if (_value instanceof Promise) _value.suppressUnhandledRejections();
	        var handler = function() {return _value;};
	        return this.caught(value, handler);
	    }
	};
	};

	},{}],11:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var PromiseReduce = Promise.reduce;
	var PromiseAll = Promise.all;

	function promiseAllThis() {
	    return PromiseAll(this);
	}

	function PromiseMapSeries(promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
	}

	Promise.prototype.each = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, this, undefined);
	};

	Promise.prototype.mapSeries = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
	};

	Promise.each = function (promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, promises, undefined);
	};

	Promise.mapSeries = PromiseMapSeries;
	};


	},{}],12:[function(_dereq_,module,exports){
	"use strict";
	var es5 = _dereq_("./es5");
	var Objectfreeze = es5.freeze;
	var util = _dereq_("./util");
	var inherits = util.inherits;
	var notEnumerableProp = util.notEnumerableProp;

	function subError(nameProperty, defaultMessage) {
	    function SubError(message) {
	        if (!(this instanceof SubError)) return new SubError(message);
	        notEnumerableProp(this, "message",
	            typeof message === "string" ? message : defaultMessage);
	        notEnumerableProp(this, "name", nameProperty);
	        if (Error.captureStackTrace) {
	            Error.captureStackTrace(this, this.constructor);
	        } else {
	            Error.call(this);
	        }
	    }
	    inherits(SubError, Error);
	    return SubError;
	}

	var _TypeError, _RangeError;
	var Warning = subError("Warning", "warning");
	var CancellationError = subError("CancellationError", "cancellation error");
	var TimeoutError = subError("TimeoutError", "timeout error");
	var AggregateError = subError("AggregateError", "aggregate error");
	try {
	    _TypeError = TypeError;
	    _RangeError = RangeError;
	} catch(e) {
	    _TypeError = subError("TypeError", "type error");
	    _RangeError = subError("RangeError", "range error");
	}

	var methods = ("join pop push shift unshift slice filter forEach some " +
	    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

	for (var i = 0; i < methods.length; ++i) {
	    if (typeof Array.prototype[methods[i]] === "function") {
	        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
	    }
	}

	es5.defineProperty(AggregateError.prototype, "length", {
	    value: 0,
	    configurable: false,
	    writable: true,
	    enumerable: true
	});
	AggregateError.prototype["isOperational"] = true;
	var level = 0;
	AggregateError.prototype.toString = function() {
	    var indent = Array(level * 4 + 1).join(" ");
	    var ret = "\n" + indent + "AggregateError of:" + "\n";
	    level++;
	    indent = Array(level * 4 + 1).join(" ");
	    for (var i = 0; i < this.length; ++i) {
	        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
	        var lines = str.split("\n");
	        for (var j = 0; j < lines.length; ++j) {
	            lines[j] = indent + lines[j];
	        }
	        str = lines.join("\n");
	        ret += str + "\n";
	    }
	    level--;
	    return ret;
	};

	function OperationalError(message) {
	    if (!(this instanceof OperationalError))
	        return new OperationalError(message);
	    notEnumerableProp(this, "name", "OperationalError");
	    notEnumerableProp(this, "message", message);
	    this.cause = message;
	    this["isOperational"] = true;

	    if (message instanceof Error) {
	        notEnumerableProp(this, "message", message.message);
	        notEnumerableProp(this, "stack", message.stack);
	    } else if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, this.constructor);
	    }

	}
	inherits(OperationalError, Error);

	var errorTypes = Error["__BluebirdErrorTypes__"];
	if (!errorTypes) {
	    errorTypes = Objectfreeze({
	        CancellationError: CancellationError,
	        TimeoutError: TimeoutError,
	        OperationalError: OperationalError,
	        RejectionError: OperationalError,
	        AggregateError: AggregateError
	    });
	    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
	        value: errorTypes,
	        writable: false,
	        enumerable: false,
	        configurable: false
	    });
	}

	module.exports = {
	    Error: Error,
	    TypeError: _TypeError,
	    RangeError: _RangeError,
	    CancellationError: errorTypes.CancellationError,
	    OperationalError: errorTypes.OperationalError,
	    TimeoutError: errorTypes.TimeoutError,
	    AggregateError: errorTypes.AggregateError,
	    Warning: Warning
	};

	},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){
	var isES5 = (function(){
	    "use strict";
	    return this === undefined;
	})();

	if (isES5) {
	    module.exports = {
	        freeze: Object.freeze,
	        defineProperty: Object.defineProperty,
	        getDescriptor: Object.getOwnPropertyDescriptor,
	        keys: Object.keys,
	        names: Object.getOwnPropertyNames,
	        getPrototypeOf: Object.getPrototypeOf,
	        isArray: Array.isArray,
	        isES5: isES5,
	        propertyIsWritable: function(obj, prop) {
	            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	            return !!(!descriptor || descriptor.writable || descriptor.set);
	        }
	    };
	} else {
	    var has = {}.hasOwnProperty;
	    var str = {}.toString;
	    var proto = {}.constructor.prototype;

	    var ObjectKeys = function (o) {
	        var ret = [];
	        for (var key in o) {
	            if (has.call(o, key)) {
	                ret.push(key);
	            }
	        }
	        return ret;
	    };

	    var ObjectGetDescriptor = function(o, key) {
	        return {value: o[key]};
	    };

	    var ObjectDefineProperty = function (o, key, desc) {
	        o[key] = desc.value;
	        return o;
	    };

	    var ObjectFreeze = function (obj) {
	        return obj;
	    };

	    var ObjectGetPrototypeOf = function (obj) {
	        try {
	            return Object(obj).constructor.prototype;
	        }
	        catch (e) {
	            return proto;
	        }
	    };

	    var ArrayIsArray = function (obj) {
	        try {
	            return str.call(obj) === "[object Array]";
	        }
	        catch(e) {
	            return false;
	        }
	    };

	    module.exports = {
	        isArray: ArrayIsArray,
	        keys: ObjectKeys,
	        names: ObjectKeys,
	        defineProperty: ObjectDefineProperty,
	        getDescriptor: ObjectGetDescriptor,
	        freeze: ObjectFreeze,
	        getPrototypeOf: ObjectGetPrototypeOf,
	        isES5: isES5,
	        propertyIsWritable: function() {
	            return true;
	        }
	    };
	}

	},{}],14:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var PromiseMap = Promise.map;

	Promise.prototype.filter = function (fn, options) {
	    return PromiseMap(this, fn, options, INTERNAL);
	};

	Promise.filter = function (promises, fn, options) {
	    return PromiseMap(promises, fn, options, INTERNAL);
	};
	};

	},{}],15:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
	var util = _dereq_("./util");
	var CancellationError = Promise.CancellationError;
	var errorObj = util.errorObj;
	var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);

	function PassThroughHandlerContext(promise, type, handler) {
	    this.promise = promise;
	    this.type = type;
	    this.handler = handler;
	    this.called = false;
	    this.cancelPromise = null;
	}

	PassThroughHandlerContext.prototype.isFinallyHandler = function() {
	    return this.type === 0;
	};

	function FinallyHandlerCancelReaction(finallyHandler) {
	    this.finallyHandler = finallyHandler;
	}

	FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
	    checkCancel(this.finallyHandler);
	};

	function checkCancel(ctx, reason) {
	    if (ctx.cancelPromise != null) {
	        if (arguments.length > 1) {
	            ctx.cancelPromise._reject(reason);
	        } else {
	            ctx.cancelPromise._cancel();
	        }
	        ctx.cancelPromise = null;
	        return true;
	    }
	    return false;
	}

	function succeed() {
	    return finallyHandler.call(this, this.promise._target()._settledValue());
	}
	function fail(reason) {
	    if (checkCancel(this, reason)) return;
	    errorObj.e = reason;
	    return errorObj;
	}
	function finallyHandler(reasonOrValue) {
	    var promise = this.promise;
	    var handler = this.handler;

	    if (!this.called) {
	        this.called = true;
	        var ret = this.isFinallyHandler()
	            ? handler.call(promise._boundValue())
	            : handler.call(promise._boundValue(), reasonOrValue);
	        if (ret === NEXT_FILTER) {
	            return ret;
	        } else if (ret !== undefined) {
	            promise._setReturnedNonUndefined();
	            var maybePromise = tryConvertToPromise(ret, promise);
	            if (maybePromise instanceof Promise) {
	                if (this.cancelPromise != null) {
	                    if (maybePromise._isCancelled()) {
	                        var reason =
	                            new CancellationError("late cancellation observer");
	                        promise._attachExtraTrace(reason);
	                        errorObj.e = reason;
	                        return errorObj;
	                    } else if (maybePromise.isPending()) {
	                        maybePromise._attachCancellationCallback(
	                            new FinallyHandlerCancelReaction(this));
	                    }
	                }
	                return maybePromise._then(
	                    succeed, fail, undefined, this, undefined);
	            }
	        }
	    }

	    if (promise.isRejected()) {
	        checkCancel(this);
	        errorObj.e = reasonOrValue;
	        return errorObj;
	    } else {
	        checkCancel(this);
	        return reasonOrValue;
	    }
	}

	Promise.prototype._passThrough = function(handler, type, success, fail) {
	    if (typeof handler !== "function") return this.then();
	    return this._then(success,
	                      fail,
	                      undefined,
	                      new PassThroughHandlerContext(this, type, handler),
	                      undefined);
	};

	Promise.prototype.lastly =
	Promise.prototype["finally"] = function (handler) {
	    return this._passThrough(handler,
	                             0,
	                             finallyHandler,
	                             finallyHandler);
	};


	Promise.prototype.tap = function (handler) {
	    return this._passThrough(handler, 1, finallyHandler);
	};

	Promise.prototype.tapCatch = function (handlerOrPredicate) {
	    var len = arguments.length;
	    if(len === 1) {
	        return this._passThrough(handlerOrPredicate,
	                                 1,
	                                 undefined,
	                                 finallyHandler);
	    } else {
	         var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return Promise.reject(new TypeError(
	                    "tapCatch statement predicate: "
	                    + "expecting an object but got " + util.classString(item)
	                ));
	            }
	        }
	        catchInstances.length = j;
	        var handler = arguments[i];
	        return this._passThrough(catchFilter(catchInstances, handler, this),
	                                 1,
	                                 undefined,
	                                 finallyHandler);
	    }

	};

	return PassThroughHandlerContext;
	};

	},{"./catch_filter":7,"./util":36}],16:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise,
	                          apiRejection,
	                          INTERNAL,
	                          tryConvertToPromise,
	                          Proxyable,
	                          debug) {
	var errors = _dereq_("./errors");
	var TypeError = errors.TypeError;
	var util = _dereq_("./util");
	var errorObj = util.errorObj;
	var tryCatch = util.tryCatch;
	var yieldHandlers = [];

	function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
	    for (var i = 0; i < yieldHandlers.length; ++i) {
	        traceParent._pushContext();
	        var result = tryCatch(yieldHandlers[i])(value);
	        traceParent._popContext();
	        if (result === errorObj) {
	            traceParent._pushContext();
	            var ret = Promise.reject(errorObj.e);
	            traceParent._popContext();
	            return ret;
	        }
	        var maybePromise = tryConvertToPromise(result, traceParent);
	        if (maybePromise instanceof Promise) return maybePromise;
	    }
	    return null;
	}

	function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
	    if (debug.cancellation()) {
	        var internal = new Promise(INTERNAL);
	        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
	        this._promise = internal.lastly(function() {
	            return _finallyPromise;
	        });
	        internal._captureStackTrace();
	        internal._setOnCancel(this);
	    } else {
	        var promise = this._promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	    }
	    this._stack = stack;
	    this._generatorFunction = generatorFunction;
	    this._receiver = receiver;
	    this._generator = undefined;
	    this._yieldHandlers = typeof yieldHandler === "function"
	        ? [yieldHandler].concat(yieldHandlers)
	        : yieldHandlers;
	    this._yieldedPromise = null;
	    this._cancellationPhase = false;
	}
	util.inherits(PromiseSpawn, Proxyable);

	PromiseSpawn.prototype._isResolved = function() {
	    return this._promise === null;
	};

	PromiseSpawn.prototype._cleanup = function() {
	    this._promise = this._generator = null;
	    if (debug.cancellation() && this._finallyPromise !== null) {
	        this._finallyPromise._fulfill();
	        this._finallyPromise = null;
	    }
	};

	PromiseSpawn.prototype._promiseCancelled = function() {
	    if (this._isResolved()) return;
	    var implementsReturn = typeof this._generator["return"] !== "undefined";

	    var result;
	    if (!implementsReturn) {
	        var reason = new Promise.CancellationError(
	            "generator .return() sentinel");
	        Promise.coroutine.returnSentinel = reason;
	        this._promise._attachExtraTrace(reason);
	        this._promise._pushContext();
	        result = tryCatch(this._generator["throw"]).call(this._generator,
	                                                         reason);
	        this._promise._popContext();
	    } else {
	        this._promise._pushContext();
	        result = tryCatch(this._generator["return"]).call(this._generator,
	                                                          undefined);
	        this._promise._popContext();
	    }
	    this._cancellationPhase = true;
	    this._yieldedPromise = null;
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseFulfilled = function(value) {
	    this._yieldedPromise = null;
	    this._promise._pushContext();
	    var result = tryCatch(this._generator.next).call(this._generator, value);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseRejected = function(reason) {
	    this._yieldedPromise = null;
	    this._promise._attachExtraTrace(reason);
	    this._promise._pushContext();
	    var result = tryCatch(this._generator["throw"])
	        .call(this._generator, reason);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._resultCancelled = function() {
	    if (this._yieldedPromise instanceof Promise) {
	        var promise = this._yieldedPromise;
	        this._yieldedPromise = null;
	        promise.cancel();
	    }
	};

	PromiseSpawn.prototype.promise = function () {
	    return this._promise;
	};

	PromiseSpawn.prototype._run = function () {
	    this._generator = this._generatorFunction.call(this._receiver);
	    this._receiver =
	        this._generatorFunction = undefined;
	    this._promiseFulfilled(undefined);
	};

	PromiseSpawn.prototype._continue = function (result) {
	    var promise = this._promise;
	    if (result === errorObj) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._rejectCallback(result.e, false);
	        }
	    }

	    var value = result.value;
	    if (result.done === true) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._resolveCallback(value);
	        }
	    } else {
	        var maybePromise = tryConvertToPromise(value, this._promise);
	        if (!(maybePromise instanceof Promise)) {
	            maybePromise =
	                promiseFromYieldHandler(maybePromise,
	                                        this._yieldHandlers,
	                                        this._promise);
	            if (maybePromise === null) {
	                this._promiseRejected(
	                    new TypeError(
	                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
	                        "From coroutine:\u000a" +
	                        this._stack.split("\n").slice(1, -7).join("\n")
	                    )
	                );
	                return;
	            }
	        }
	        maybePromise = maybePromise._target();
	        var bitField = maybePromise._bitField;
	        
	        if (((bitField & 50397184) === 0)) {
	            this._yieldedPromise = maybePromise;
	            maybePromise._proxy(this, null);
	        } else if (((bitField & 33554432) !== 0)) {
	            Promise._async.invoke(
	                this._promiseFulfilled, this, maybePromise._value()
	            );
	        } else if (((bitField & 16777216) !== 0)) {
	            Promise._async.invoke(
	                this._promiseRejected, this, maybePromise._reason()
	            );
	        } else {
	            this._promiseCancelled();
	        }
	    }
	};

	Promise.coroutine = function (generatorFunction, options) {
	    if (typeof generatorFunction !== "function") {
	        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var yieldHandler = Object(options).yieldHandler;
	    var PromiseSpawn$ = PromiseSpawn;
	    var stack = new Error().stack;
	    return function () {
	        var generator = generatorFunction.apply(this, arguments);
	        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
	                                      stack);
	        var ret = spawn.promise();
	        spawn._generator = generator;
	        spawn._promiseFulfilled(undefined);
	        return ret;
	    };
	};

	Promise.coroutine.addYieldHandler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(fn));
	    }
	    yieldHandlers.push(fn);
	};

	Promise.spawn = function (generatorFunction) {
	    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
	    if (typeof generatorFunction !== "function") {
	        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var spawn = new PromiseSpawn(generatorFunction, this);
	    var ret = spawn.promise();
	    spawn._run(Promise.spawn);
	    return ret;
	};
	};

	},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
	         getDomain) {
	var util = _dereq_("./util");
	var canEvaluate = util.canEvaluate;
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;
	var reject;

	Promise.join = function () {
	    var last = arguments.length - 1;
	    var fn;
	    if (last > 0 && typeof arguments[last] === "function") {
	        fn = arguments[last];
	        var ret;


	    }
	    var args = [].slice.call(arguments);
	    if (fn) args.pop();
	    var ret = new PromiseArray(args).promise();
	    return fn !== undefined ? ret.spread(fn) : ret;
	};

	};

	},{"./util":36}],18:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;
	var async = Promise._async;

	function MappingPromiseArray(promises, fn, limit, _filter) {
	    this.constructor$(promises);
	    this._promise._captureStackTrace();
	    var domain = getDomain();
	    this._callback = domain === null ? fn : util.domainBind(domain, fn);
	    this._preservedValues = _filter === INTERNAL
	        ? new Array(this.length())
	        : null;
	    this._limit = limit;
	    this._inFlight = 0;
	    this._queue = [];
	    async.invoke(this._asyncInit, this, undefined);
	}
	util.inherits(MappingPromiseArray, PromiseArray);

	MappingPromiseArray.prototype._asyncInit = function() {
	    this._init$(undefined, -2);
	};

	MappingPromiseArray.prototype._init = function () {};

	MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var values = this._values;
	    var length = this.length();
	    var preservedValues = this._preservedValues;
	    var limit = this._limit;

	    if (index < 0) {
	        index = (index * -1) - 1;
	        values[index] = value;
	        if (limit >= 1) {
	            this._inFlight--;
	            this._drainQueue();
	            if (this._isResolved()) return true;
	        }
	    } else {
	        if (limit >= 1 && this._inFlight >= limit) {
	            values[index] = value;
	            this._queue.push(index);
	            return false;
	        }
	        if (preservedValues !== null) preservedValues[index] = value;

	        var promise = this._promise;
	        var callback = this._callback;
	        var receiver = promise._boundValue();
	        promise._pushContext();
	        var ret = tryCatch(callback).call(receiver, value, index, length);
	        var promiseCreated = promise._popContext();
	        debug.checkForgottenReturns(
	            ret,
	            promiseCreated,
	            preservedValues !== null ? "Promise.filter" : "Promise.map",
	            promise
	        );
	        if (ret === errorObj) {
	            this._reject(ret.e);
	            return true;
	        }

	        var maybePromise = tryConvertToPromise(ret, this._promise);
	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            var bitField = maybePromise._bitField;
	            
	            if (((bitField & 50397184) === 0)) {
	                if (limit >= 1) this._inFlight++;
	                values[index] = maybePromise;
	                maybePromise._proxy(this, (index + 1) * -1);
	                return false;
	            } else if (((bitField & 33554432) !== 0)) {
	                ret = maybePromise._value();
	            } else if (((bitField & 16777216) !== 0)) {
	                this._reject(maybePromise._reason());
	                return true;
	            } else {
	                this._cancel();
	                return true;
	            }
	        }
	        values[index] = ret;
	    }
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= length) {
	        if (preservedValues !== null) {
	            this._filter(values, preservedValues);
	        } else {
	            this._resolve(values);
	        }
	        return true;
	    }
	    return false;
	};

	MappingPromiseArray.prototype._drainQueue = function () {
	    var queue = this._queue;
	    var limit = this._limit;
	    var values = this._values;
	    while (queue.length > 0 && this._inFlight < limit) {
	        if (this._isResolved()) return;
	        var index = queue.pop();
	        this._promiseFulfilled(values[index], index);
	    }
	};

	MappingPromiseArray.prototype._filter = function (booleans, values) {
	    var len = values.length;
	    var ret = new Array(len);
	    var j = 0;
	    for (var i = 0; i < len; ++i) {
	        if (booleans[i]) ret[j++] = values[i];
	    }
	    ret.length = j;
	    this._resolve(ret);
	};

	MappingPromiseArray.prototype.preservedValues = function () {
	    return this._preservedValues;
	};

	function map(promises, fn, options, _filter) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }

	    var limit = 0;
	    if (options !== undefined) {
	        if (typeof options === "object" && options !== null) {
	            if (typeof options.concurrency !== "number") {
	                return Promise.reject(
	                    new TypeError("'concurrency' must be a number but it is " +
	                                    util.classString(options.concurrency)));
	            }
	            limit = options.concurrency;
	        } else {
	            return Promise.reject(new TypeError(
	                            "options argument must be an object but it is " +
	                             util.classString(options)));
	        }
	    }
	    limit = typeof limit === "number" &&
	        isFinite(limit) && limit >= 1 ? limit : 0;
	    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
	}

	Promise.prototype.map = function (fn, options) {
	    return map(this, fn, options, null);
	};

	Promise.map = function (promises, fn, options, _filter) {
	    return map(promises, fn, options, _filter);
	};


	};

	},{"./util":36}],19:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;

	Promise.method = function (fn) {
	    if (typeof fn !== "function") {
	        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
	    }
	    return function () {
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._pushContext();
	        var value = tryCatch(fn).apply(this, arguments);
	        var promiseCreated = ret._popContext();
	        debug.checkForgottenReturns(
	            value, promiseCreated, "Promise.method", ret);
	        ret._resolveFromSyncValue(value);
	        return ret;
	    };
	};

	Promise.attempt = Promise["try"] = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._pushContext();
	    var value;
	    if (arguments.length > 1) {
	        debug.deprecated("calling Promise.try with more than 1 argument");
	        var arg = arguments[1];
	        var ctx = arguments[2];
	        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
	                                  : tryCatch(fn).call(ctx, arg);
	    } else {
	        value = tryCatch(fn)();
	    }
	    var promiseCreated = ret._popContext();
	    debug.checkForgottenReturns(
	        value, promiseCreated, "Promise.try", ret);
	    ret._resolveFromSyncValue(value);
	    return ret;
	};

	Promise.prototype._resolveFromSyncValue = function (value) {
	    if (value === util.errorObj) {
	        this._rejectCallback(value.e, false);
	    } else {
	        this._resolveCallback(value, true);
	    }
	};
	};

	},{"./util":36}],20:[function(_dereq_,module,exports){
	"use strict";
	var util = _dereq_("./util");
	var maybeWrapAsError = util.maybeWrapAsError;
	var errors = _dereq_("./errors");
	var OperationalError = errors.OperationalError;
	var es5 = _dereq_("./es5");

	function isUntypedError(obj) {
	    return obj instanceof Error &&
	        es5.getPrototypeOf(obj) === Error.prototype;
	}

	var rErrorKey = /^(?:name|message|stack|cause)$/;
	function wrapAsOperationalError(obj) {
	    var ret;
	    if (isUntypedError(obj)) {
	        ret = new OperationalError(obj);
	        ret.name = obj.name;
	        ret.message = obj.message;
	        ret.stack = obj.stack;
	        var keys = es5.keys(obj);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!rErrorKey.test(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    util.markAsOriginatingFromRejection(obj);
	    return obj;
	}

	function nodebackForPromise(promise, multiArgs) {
	    return function(err, value) {
	        if (promise === null) return;
	        if (err) {
	            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
	            promise._attachExtraTrace(wrapped);
	            promise._reject(wrapped);
	        } else if (!multiArgs) {
	            promise._fulfill(value);
	        } else {
	            var args = [].slice.call(arguments, 1);
	            promise._fulfill(args);
	        }
	        promise = null;
	    };
	}

	module.exports = nodebackForPromise;

	},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	var util = _dereq_("./util");
	var async = Promise._async;
	var tryCatch = util.tryCatch;
	var errorObj = util.errorObj;

	function spreadAdapter(val, nodeback) {
	    var promise = this;
	    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
	    var ret =
	        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	function successAdapter(val, nodeback) {
	    var promise = this;
	    var receiver = promise._boundValue();
	    var ret = val === undefined
	        ? tryCatch(nodeback).call(receiver, null)
	        : tryCatch(nodeback).call(receiver, null, val);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}
	function errorAdapter(reason, nodeback) {
	    var promise = this;
	    if (!reason) {
	        var newReason = new Error(reason + "");
	        newReason.cause = reason;
	        reason = newReason;
	    }
	    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
	                                                                     options) {
	    if (typeof nodeback == "function") {
	        var adapter = successAdapter;
	        if (options !== undefined && Object(options).spread) {
	            adapter = spreadAdapter;
	        }
	        this._then(
	            adapter,
	            errorAdapter,
	            undefined,
	            this,
	            nodeback
	        );
	    }
	    return this;
	};
	};

	},{"./util":36}],22:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function() {
	var makeSelfResolutionError = function () {
	    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var reflectHandler = function() {
	    return new Promise.PromiseInspection(this._target());
	};
	var apiRejection = function(msg) {
	    return Promise.reject(new TypeError(msg));
	};
	function Proxyable() {}
	var UNDEFINED_BINDING = {};
	var util = _dereq_("./util");

	var getDomain;
	if (util.isNode) {
	    getDomain = function() {
	        var ret = process.domain;
	        if (ret === undefined) ret = null;
	        return ret;
	    };
	} else {
	    getDomain = function() {
	        return null;
	    };
	}
	util.notEnumerableProp(Promise, "_getDomain", getDomain);

	var es5 = _dereq_("./es5");
	var Async = _dereq_("./async");
	var async = new Async();
	es5.defineProperty(Promise, "_async", {value: async});
	var errors = _dereq_("./errors");
	var TypeError = Promise.TypeError = errors.TypeError;
	Promise.RangeError = errors.RangeError;
	var CancellationError = Promise.CancellationError = errors.CancellationError;
	Promise.TimeoutError = errors.TimeoutError;
	Promise.OperationalError = errors.OperationalError;
	Promise.RejectionError = errors.OperationalError;
	Promise.AggregateError = errors.AggregateError;
	var INTERNAL = function(){};
	var APPLY = {};
	var NEXT_FILTER = {};
	var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
	var PromiseArray =
	    _dereq_("./promise_array")(Promise, INTERNAL,
	                               tryConvertToPromise, apiRejection, Proxyable);
	var Context = _dereq_("./context")(Promise);
	 /*jshint unused:false*/
	var createContext = Context.create;
	var debug = _dereq_("./debuggability")(Promise, Context);
	var CapturedTrace = debug.CapturedTrace;
	var PassThroughHandlerContext =
	    _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
	var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
	var nodebackForPromise = _dereq_("./nodeback");
	var errorObj = util.errorObj;
	var tryCatch = util.tryCatch;
	function check(self, executor) {
	    if (self == null || self.constructor !== Promise) {
	        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (typeof executor !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(executor));
	    }

	}

	function Promise(executor) {
	    if (executor !== INTERNAL) {
	        check(this, executor);
	    }
	    this._bitField = 0;
	    this._fulfillmentHandler0 = undefined;
	    this._rejectionHandler0 = undefined;
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._resolveFromExecutor(executor);
	    this._promiseCreated();
	    this._fireEvent("promiseCreated", this);
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
	    var len = arguments.length;
	    if (len > 1) {
	        var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return apiRejection("Catch statement predicate: " +
	                    "expecting an object but got " + util.classString(item));
	            }
	        }
	        catchInstances.length = j;
	        fn = arguments[i];
	        return this.then(undefined, catchFilter(catchInstances, fn, this));
	    }
	    return this.then(undefined, fn);
	};

	Promise.prototype.reflect = function () {
	    return this._then(reflectHandler,
	        reflectHandler, undefined, this, undefined);
	};

	Promise.prototype.then = function (didFulfill, didReject) {
	    if (debug.warnings() && arguments.length > 0 &&
	        typeof didFulfill !== "function" &&
	        typeof didReject !== "function") {
	        var msg = ".then() only accepts functions but was passed: " +
	                util.classString(didFulfill);
	        if (arguments.length > 1) {
	            msg += ", " + util.classString(didReject);
	        }
	        this._warn(msg);
	    }
	    return this._then(didFulfill, didReject, undefined, undefined, undefined);
	};

	Promise.prototype.done = function (didFulfill, didReject) {
	    var promise =
	        this._then(didFulfill, didReject, undefined, undefined, undefined);
	    promise._setIsFinal();
	};

	Promise.prototype.spread = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }
	    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
	};

	Promise.prototype.toJSON = function () {
	    var ret = {
	        isFulfilled: false,
	        isRejected: false,
	        fulfillmentValue: undefined,
	        rejectionReason: undefined
	    };
	    if (this.isFulfilled()) {
	        ret.fulfillmentValue = this.value();
	        ret.isFulfilled = true;
	    } else if (this.isRejected()) {
	        ret.rejectionReason = this.reason();
	        ret.isRejected = true;
	    }
	    return ret;
	};

	Promise.prototype.all = function () {
	    if (arguments.length > 0) {
	        this._warn(".all() was passed arguments but it does not take any");
	    }
	    return new PromiseArray(this).promise();
	};

	Promise.prototype.error = function (fn) {
	    return this.caught(util.originatesFromRejection, fn);
	};

	Promise.getNewLibraryCopy = module.exports;

	Promise.is = function (val) {
	    return val instanceof Promise;
	};

	Promise.fromNode = Promise.fromCallback = function(fn) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
	                                         : false;
	    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
	    if (result === errorObj) {
	        ret._rejectCallback(result.e, true);
	    }
	    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.all = function (promises) {
	    return new PromiseArray(promises).promise();
	};

	Promise.cast = function (obj) {
	    var ret = tryConvertToPromise(obj);
	    if (!(ret instanceof Promise)) {
	        ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._setFulfilled();
	        ret._rejectionHandler0 = obj;
	    }
	    return ret;
	};

	Promise.resolve = Promise.fulfilled = Promise.cast;

	Promise.reject = Promise.rejected = function (reason) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._rejectCallback(reason, true);
	    return ret;
	};

	Promise.setScheduler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(fn));
	    }
	    return async.setScheduler(fn);
	};

	Promise.prototype._then = function (
	    didFulfill,
	    didReject,
	    _,    receiver,
	    internalData
	) {
	    var haveInternalData = internalData !== undefined;
	    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
	    var target = this._target();
	    var bitField = target._bitField;

	    if (!haveInternalData) {
	        promise._propagateFrom(this, 3);
	        promise._captureStackTrace();
	        if (receiver === undefined &&
	            ((this._bitField & 2097152) !== 0)) {
	            if (!((bitField & 50397184) === 0)) {
	                receiver = this._boundValue();
	            } else {
	                receiver = target === this ? undefined : this._boundTo;
	            }
	        }
	        this._fireEvent("promiseChained", this, promise);
	    }

	    var domain = getDomain();
	    if (!((bitField & 50397184) === 0)) {
	        var handler, value, settler = target._settlePromiseCtx;
	        if (((bitField & 33554432) !== 0)) {
	            value = target._rejectionHandler0;
	            handler = didFulfill;
	        } else if (((bitField & 16777216) !== 0)) {
	            value = target._fulfillmentHandler0;
	            handler = didReject;
	            target._unsetRejectionIsUnhandled();
	        } else {
	            settler = target._settlePromiseLateCancellationObserver;
	            value = new CancellationError("late cancellation observer");
	            target._attachExtraTrace(value);
	            handler = didReject;
	        }

	        async.invoke(settler, target, {
	            handler: domain === null ? handler
	                : (typeof handler === "function" &&
	                    util.domainBind(domain, handler)),
	            promise: promise,
	            receiver: receiver,
	            value: value
	        });
	    } else {
	        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
	    }

	    return promise;
	};

	Promise.prototype._length = function () {
	    return this._bitField & 65535;
	};

	Promise.prototype._isFateSealed = function () {
	    return (this._bitField & 117506048) !== 0;
	};

	Promise.prototype._isFollowing = function () {
	    return (this._bitField & 67108864) === 67108864;
	};

	Promise.prototype._setLength = function (len) {
	    this._bitField = (this._bitField & -65536) |
	        (len & 65535);
	};

	Promise.prototype._setFulfilled = function () {
	    this._bitField = this._bitField | 33554432;
	    this._fireEvent("promiseFulfilled", this);
	};

	Promise.prototype._setRejected = function () {
	    this._bitField = this._bitField | 16777216;
	    this._fireEvent("promiseRejected", this);
	};

	Promise.prototype._setFollowing = function () {
	    this._bitField = this._bitField | 67108864;
	    this._fireEvent("promiseResolved", this);
	};

	Promise.prototype._setIsFinal = function () {
	    this._bitField = this._bitField | 4194304;
	};

	Promise.prototype._isFinal = function () {
	    return (this._bitField & 4194304) > 0;
	};

	Promise.prototype._unsetCancelled = function() {
	    this._bitField = this._bitField & (~65536);
	};

	Promise.prototype._setCancelled = function() {
	    this._bitField = this._bitField | 65536;
	    this._fireEvent("promiseCancelled", this);
	};

	Promise.prototype._setWillBeCancelled = function() {
	    this._bitField = this._bitField | 8388608;
	};

	Promise.prototype._setAsyncGuaranteed = function() {
	    if (async.hasCustomScheduler()) return;
	    this._bitField = this._bitField | 134217728;
	};

	Promise.prototype._receiverAt = function (index) {
	    var ret = index === 0 ? this._receiver0 : this[
	            index * 4 - 4 + 3];
	    if (ret === UNDEFINED_BINDING) {
	        return undefined;
	    } else if (ret === undefined && this._isBound()) {
	        return this._boundValue();
	    }
	    return ret;
	};

	Promise.prototype._promiseAt = function (index) {
	    return this[
	            index * 4 - 4 + 2];
	};

	Promise.prototype._fulfillmentHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 0];
	};

	Promise.prototype._rejectionHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 1];
	};

	Promise.prototype._boundValue = function() {};

	Promise.prototype._migrateCallback0 = function (follower) {
	    var bitField = follower._bitField;
	    var fulfill = follower._fulfillmentHandler0;
	    var reject = follower._rejectionHandler0;
	    var promise = follower._promise0;
	    var receiver = follower._receiverAt(0);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._migrateCallbackAt = function (follower, index) {
	    var fulfill = follower._fulfillmentHandlerAt(index);
	    var reject = follower._rejectionHandlerAt(index);
	    var promise = follower._promiseAt(index);
	    var receiver = follower._receiverAt(index);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._addCallbacks = function (
	    fulfill,
	    reject,
	    promise,
	    receiver,
	    domain
	) {
	    var index = this._length();

	    if (index >= 65535 - 4) {
	        index = 0;
	        this._setLength(0);
	    }

	    if (index === 0) {
	        this._promise0 = promise;
	        this._receiver0 = receiver;
	        if (typeof fulfill === "function") {
	            this._fulfillmentHandler0 =
	                domain === null ? fulfill : util.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this._rejectionHandler0 =
	                domain === null ? reject : util.domainBind(domain, reject);
	        }
	    } else {
	        var base = index * 4 - 4;
	        this[base + 2] = promise;
	        this[base + 3] = receiver;
	        if (typeof fulfill === "function") {
	            this[base + 0] =
	                domain === null ? fulfill : util.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this[base + 1] =
	                domain === null ? reject : util.domainBind(domain, reject);
	        }
	    }
	    this._setLength(index + 1);
	    return index;
	};

	Promise.prototype._proxy = function (proxyable, arg) {
	    this._addCallbacks(undefined, undefined, arg, proxyable, null);
	};

	Promise.prototype._resolveCallback = function(value, shouldBind) {
	    if (((this._bitField & 117506048) !== 0)) return;
	    if (value === this)
	        return this._rejectCallback(makeSelfResolutionError(), false);
	    var maybePromise = tryConvertToPromise(value, this);
	    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

	    if (shouldBind) this._propagateFrom(maybePromise, 2);

	    var promise = maybePromise._target();

	    if (promise === this) {
	        this._reject(makeSelfResolutionError());
	        return;
	    }

	    var bitField = promise._bitField;
	    if (((bitField & 50397184) === 0)) {
	        var len = this._length();
	        if (len > 0) promise._migrateCallback0(this);
	        for (var i = 1; i < len; ++i) {
	            promise._migrateCallbackAt(this, i);
	        }
	        this._setFollowing();
	        this._setLength(0);
	        this._setFollowee(promise);
	    } else if (((bitField & 33554432) !== 0)) {
	        this._fulfill(promise._value());
	    } else if (((bitField & 16777216) !== 0)) {
	        this._reject(promise._reason());
	    } else {
	        var reason = new CancellationError("late cancellation observer");
	        promise._attachExtraTrace(reason);
	        this._reject(reason);
	    }
	};

	Promise.prototype._rejectCallback =
	function(reason, synchronous, ignoreNonErrorWarnings) {
	    var trace = util.ensureErrorObject(reason);
	    var hasStack = trace === reason;
	    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
	        var message = "a promise was rejected with a non-error: " +
	            util.classString(reason);
	        this._warn(message, true);
	    }
	    this._attachExtraTrace(trace, synchronous ? hasStack : false);
	    this._reject(reason);
	};

	Promise.prototype._resolveFromExecutor = function (executor) {
	    if (executor === INTERNAL) return;
	    var promise = this;
	    this._captureStackTrace();
	    this._pushContext();
	    var synchronous = true;
	    var r = this._execute(executor, function(value) {
	        promise._resolveCallback(value);
	    }, function (reason) {
	        promise._rejectCallback(reason, synchronous);
	    });
	    synchronous = false;
	    this._popContext();

	    if (r !== undefined) {
	        promise._rejectCallback(r, true);
	    }
	};

	Promise.prototype._settlePromiseFromHandler = function (
	    handler, receiver, value, promise
	) {
	    var bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;
	    promise._pushContext();
	    var x;
	    if (receiver === APPLY) {
	        if (!value || typeof value.length !== "number") {
	            x = errorObj;
	            x.e = new TypeError("cannot .spread() a non-array: " +
	                                    util.classString(value));
	        } else {
	            x = tryCatch(handler).apply(this._boundValue(), value);
	        }
	    } else {
	        x = tryCatch(handler).call(receiver, value);
	    }
	    var promiseCreated = promise._popContext();
	    bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;

	    if (x === NEXT_FILTER) {
	        promise._reject(value);
	    } else if (x === errorObj) {
	        promise._rejectCallback(x.e, false);
	    } else {
	        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
	        promise._resolveCallback(x);
	    }
	};

	Promise.prototype._target = function() {
	    var ret = this;
	    while (ret._isFollowing()) ret = ret._followee();
	    return ret;
	};

	Promise.prototype._followee = function() {
	    return this._rejectionHandler0;
	};

	Promise.prototype._setFollowee = function(promise) {
	    this._rejectionHandler0 = promise;
	};

	Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
	    var isPromise = promise instanceof Promise;
	    var bitField = this._bitField;
	    var asyncGuaranteed = ((bitField & 134217728) !== 0);
	    if (((bitField & 65536) !== 0)) {
	        if (isPromise) promise._invokeInternalOnCancel();

	        if (receiver instanceof PassThroughHandlerContext &&
	            receiver.isFinallyHandler()) {
	            receiver.cancelPromise = promise;
	            if (tryCatch(handler).call(receiver, value) === errorObj) {
	                promise._reject(errorObj.e);
	            }
	        } else if (handler === reflectHandler) {
	            promise._fulfill(reflectHandler.call(receiver));
	        } else if (receiver instanceof Proxyable) {
	            receiver._promiseCancelled(promise);
	        } else if (isPromise || promise instanceof PromiseArray) {
	            promise._cancel();
	        } else {
	            receiver.cancel();
	        }
	    } else if (typeof handler === "function") {
	        if (!isPromise) {
	            handler.call(receiver, value, promise);
	        } else {
	            if (asyncGuaranteed) promise._setAsyncGuaranteed();
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (receiver instanceof Proxyable) {
	        if (!receiver._isResolved()) {
	            if (((bitField & 33554432) !== 0)) {
	                receiver._promiseFulfilled(value, promise);
	            } else {
	                receiver._promiseRejected(value, promise);
	            }
	        }
	    } else if (isPromise) {
	        if (asyncGuaranteed) promise._setAsyncGuaranteed();
	        if (((bitField & 33554432) !== 0)) {
	            promise._fulfill(value);
	        } else {
	            promise._reject(value);
	        }
	    }
	};

	Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
	    var handler = ctx.handler;
	    var promise = ctx.promise;
	    var receiver = ctx.receiver;
	    var value = ctx.value;
	    if (typeof handler === "function") {
	        if (!(promise instanceof Promise)) {
	            handler.call(receiver, value, promise);
	        } else {
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (promise instanceof Promise) {
	        promise._reject(value);
	    }
	};

	Promise.prototype._settlePromiseCtx = function(ctx) {
	    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
	};

	Promise.prototype._settlePromise0 = function(handler, value, bitField) {
	    var promise = this._promise0;
	    var receiver = this._receiverAt(0);
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._settlePromise(promise, handler, receiver, value);
	};

	Promise.prototype._clearCallbackDataAtIndex = function(index) {
	    var base = index * 4 - 4;
	    this[base + 2] =
	    this[base + 3] =
	    this[base + 0] =
	    this[base + 1] = undefined;
	};

	Promise.prototype._fulfill = function (value) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    if (value === this) {
	        var err = makeSelfResolutionError();
	        this._attachExtraTrace(err);
	        return this._reject(err);
	    }
	    this._setFulfilled();
	    this._rejectionHandler0 = value;

	    if ((bitField & 65535) > 0) {
	        if (((bitField & 134217728) !== 0)) {
	            this._settlePromises();
	        } else {
	            async.settlePromises(this);
	        }
	    }
	};

	Promise.prototype._reject = function (reason) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    this._setRejected();
	    this._fulfillmentHandler0 = reason;

	    if (this._isFinal()) {
	        return async.fatalError(reason, util.isNode);
	    }

	    if ((bitField & 65535) > 0) {
	        async.settlePromises(this);
	    } else {
	        this._ensurePossibleRejectionHandled();
	    }
	};

	Promise.prototype._fulfillPromises = function (len, value) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._fulfillmentHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, value);
	    }
	};

	Promise.prototype._rejectPromises = function (len, reason) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._rejectionHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, reason);
	    }
	};

	Promise.prototype._settlePromises = function () {
	    var bitField = this._bitField;
	    var len = (bitField & 65535);

	    if (len > 0) {
	        if (((bitField & 16842752) !== 0)) {
	            var reason = this._fulfillmentHandler0;
	            this._settlePromise0(this._rejectionHandler0, reason, bitField);
	            this._rejectPromises(len, reason);
	        } else {
	            var value = this._rejectionHandler0;
	            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
	            this._fulfillPromises(len, value);
	        }
	        this._setLength(0);
	    }
	    this._clearCancellationData();
	};

	Promise.prototype._settledValue = function() {
	    var bitField = this._bitField;
	    if (((bitField & 33554432) !== 0)) {
	        return this._rejectionHandler0;
	    } else if (((bitField & 16777216) !== 0)) {
	        return this._fulfillmentHandler0;
	    }
	};

	function deferResolve(v) {this.promise._resolveCallback(v);}
	function deferReject(v) {this.promise._rejectCallback(v, false);}

	Promise.defer = Promise.pending = function() {
	    debug.deprecated("Promise.defer", "new Promise");
	    var promise = new Promise(INTERNAL);
	    return {
	        promise: promise,
	        resolve: deferResolve,
	        reject: deferReject
	    };
	};

	util.notEnumerableProp(Promise,
	                       "_makeSelfResolutionError",
	                       makeSelfResolutionError);

	_dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection,
	    debug);
	_dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
	_dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
	_dereq_("./direct_resolve")(Promise);
	_dereq_("./synchronous_inspection")(Promise);
	_dereq_("./join")(
	    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
	Promise.Promise = Promise;
	Promise.version = "3.5.0";
	_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	_dereq_('./call_get.js')(Promise);
	_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
	_dereq_('./timers.js')(Promise, INTERNAL, debug);
	_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
	_dereq_('./nodeify.js')(Promise);
	_dereq_('./promisify.js')(Promise, INTERNAL);
	_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
	_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
	_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	_dereq_('./settle.js')(Promise, PromiseArray, debug);
	_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
	_dereq_('./filter.js')(Promise, INTERNAL);
	_dereq_('./each.js')(Promise, INTERNAL);
	_dereq_('./any.js')(Promise);
	                                                         
	    util.toFastProperties(Promise);                                          
	    util.toFastProperties(Promise.prototype);                                
	    function fillTypes(value) {                                              
	        var p = new Promise(INTERNAL);                                       
	        p._fulfillmentHandler0 = value;                                      
	        p._rejectionHandler0 = value;                                        
	        p._promise0 = value;                                                 
	        p._receiver0 = value;                                                
	    }                                                                        
	    // Complete slack tracking, opt out of field-type tracking and           
	    // stabilize map                                                         
	    fillTypes({a: 1});                                                       
	    fillTypes({b: 2});                                                       
	    fillTypes({c: 3});                                                       
	    fillTypes(1);                                                            
	    fillTypes(function(){});                                                 
	    fillTypes(undefined);                                                    
	    fillTypes(false);                                                        
	    fillTypes(new Promise(INTERNAL));                                        
	    debug.setBounds(Async.firstLineError, util.lastLineError);               
	    return Promise;                                                          

	};

	},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL, tryConvertToPromise,
	    apiRejection, Proxyable) {
	var util = _dereq_("./util");
	var isArray = util.isArray;

	function toResolutionValue(val) {
	    switch(val) {
	    case -2: return [];
	    case -3: return {};
	    case -6: return new Map();
	    }
	}

	function PromiseArray(values) {
	    var promise = this._promise = new Promise(INTERNAL);
	    if (values instanceof Promise) {
	        promise._propagateFrom(values, 3);
	    }
	    promise._setOnCancel(this);
	    this._values = values;
	    this._length = 0;
	    this._totalResolved = 0;
	    this._init(undefined, -2);
	}
	util.inherits(PromiseArray, Proxyable);

	PromiseArray.prototype.length = function () {
	    return this._length;
	};

	PromiseArray.prototype.promise = function () {
	    return this._promise;
	};

	PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
	    var values = tryConvertToPromise(this._values, this._promise);
	    if (values instanceof Promise) {
	        values = values._target();
	        var bitField = values._bitField;
	        
	        this._values = values;

	        if (((bitField & 50397184) === 0)) {
	            this._promise._setAsyncGuaranteed();
	            return values._then(
	                init,
	                this._reject,
	                undefined,
	                this,
	                resolveValueIfEmpty
	           );
	        } else if (((bitField & 33554432) !== 0)) {
	            values = values._value();
	        } else if (((bitField & 16777216) !== 0)) {
	            return this._reject(values._reason());
	        } else {
	            return this._cancel();
	        }
	    }
	    values = util.asArray(values);
	    if (values === null) {
	        var err = apiRejection(
	            "expecting an array or an iterable object but got " + util.classString(values)).reason();
	        this._promise._rejectCallback(err, false);
	        return;
	    }

	    if (values.length === 0) {
	        if (resolveValueIfEmpty === -5) {
	            this._resolveEmptyArray();
	        }
	        else {
	            this._resolve(toResolutionValue(resolveValueIfEmpty));
	        }
	        return;
	    }
	    this._iterate(values);
	};

	PromiseArray.prototype._iterate = function(values) {
	    var len = this.getActualLength(values.length);
	    this._length = len;
	    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
	    var result = this._promise;
	    var isResolved = false;
	    var bitField = null;
	    for (var i = 0; i < len; ++i) {
	        var maybePromise = tryConvertToPromise(values[i], result);

	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            bitField = maybePromise._bitField;
	        } else {
	            bitField = null;
	        }

	        if (isResolved) {
	            if (bitField !== null) {
	                maybePromise.suppressUnhandledRejections();
	            }
	        } else if (bitField !== null) {
	            if (((bitField & 50397184) === 0)) {
	                maybePromise._proxy(this, i);
	                this._values[i] = maybePromise;
	            } else if (((bitField & 33554432) !== 0)) {
	                isResolved = this._promiseFulfilled(maybePromise._value(), i);
	            } else if (((bitField & 16777216) !== 0)) {
	                isResolved = this._promiseRejected(maybePromise._reason(), i);
	            } else {
	                isResolved = this._promiseCancelled(i);
	            }
	        } else {
	            isResolved = this._promiseFulfilled(maybePromise, i);
	        }
	    }
	    if (!isResolved) result._setAsyncGuaranteed();
	};

	PromiseArray.prototype._isResolved = function () {
	    return this._values === null;
	};

	PromiseArray.prototype._resolve = function (value) {
	    this._values = null;
	    this._promise._fulfill(value);
	};

	PromiseArray.prototype._cancel = function() {
	    if (this._isResolved() || !this._promise._isCancellable()) return;
	    this._values = null;
	    this._promise._cancel();
	};

	PromiseArray.prototype._reject = function (reason) {
	    this._values = null;
	    this._promise._rejectCallback(reason, false);
	};

	PromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	PromiseArray.prototype._promiseCancelled = function() {
	    this._cancel();
	    return true;
	};

	PromiseArray.prototype._promiseRejected = function (reason) {
	    this._totalResolved++;
	    this._reject(reason);
	    return true;
	};

	PromiseArray.prototype._resultCancelled = function() {
	    if (this._isResolved()) return;
	    var values = this._values;
	    this._cancel();
	    if (values instanceof Promise) {
	        values.cancel();
	    } else {
	        for (var i = 0; i < values.length; ++i) {
	            if (values[i] instanceof Promise) {
	                values[i].cancel();
	            }
	        }
	    }
	};

	PromiseArray.prototype.shouldCopyValues = function () {
	    return true;
	};

	PromiseArray.prototype.getActualLength = function (len) {
	    return len;
	};

	return PromiseArray;
	};

	},{"./util":36}],24:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var THIS = {};
	var util = _dereq_("./util");
	var nodebackForPromise = _dereq_("./nodeback");
	var withAppended = util.withAppended;
	var maybeWrapAsError = util.maybeWrapAsError;
	var canEvaluate = util.canEvaluate;
	var TypeError = _dereq_("./errors").TypeError;
	var defaultSuffix = "Async";
	var defaultPromisified = {__isPromisified__: true};
	var noCopyProps = [
	    "arity",    "length",
	    "name",
	    "arguments",
	    "caller",
	    "callee",
	    "prototype",
	    "__isPromisified__"
	];
	var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

	var defaultFilter = function(name) {
	    return util.isIdentifier(name) &&
	        name.charAt(0) !== "_" &&
	        name !== "constructor";
	};

	function propsFilter(key) {
	    return !noCopyPropsPattern.test(key);
	}

	function isPromisified(fn) {
	    try {
	        return fn.__isPromisified__ === true;
	    }
	    catch (e) {
	        return false;
	    }
	}

	function hasPromisified(obj, key, suffix) {
	    var val = util.getDataPropertyOrDefault(obj, key + suffix,
	                                            defaultPromisified);
	    return val ? isPromisified(val) : false;
	}
	function checkValid(ret, suffix, suffixRegexp) {
	    for (var i = 0; i < ret.length; i += 2) {
	        var key = ret[i];
	        if (suffixRegexp.test(key)) {
	            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
	            for (var j = 0; j < ret.length; j += 2) {
	                if (ret[j] === keyWithoutAsyncSuffix) {
	                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
	                        .replace("%s", suffix));
	                }
	            }
	        }
	    }
	}

	function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
	    var keys = util.inheritedDataKeys(obj);
	    var ret = [];
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var value = obj[key];
	        var passesDefaultFilter = filter === defaultFilter
	            ? true : defaultFilter(key, value, obj);
	        if (typeof value === "function" &&
	            !isPromisified(value) &&
	            !hasPromisified(obj, key, suffix) &&
	            filter(key, value, obj, passesDefaultFilter)) {
	            ret.push(key, value);
	        }
	    }
	    checkValid(ret, suffix, suffixRegexp);
	    return ret;
	}

	var escapeIdentRegex = function(str) {
	    return str.replace(/([$])/, "\\$");
	};

	var makeNodePromisifiedEval;
	function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
	    var defaultThis = (function() {return this;})();
	    var method = callback;
	    if (typeof method === "string") {
	        callback = fn;
	    }
	    function promisified() {
	        var _receiver = receiver;
	        if (receiver === THIS) _receiver = this;
	        var promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	        var cb = typeof method === "string" && this !== defaultThis
	            ? this[method] : callback;
	        var fn = nodebackForPromise(promise, multiArgs);
	        try {
	            cb.apply(_receiver, withAppended(arguments, fn));
	        } catch(e) {
	            promise._rejectCallback(maybeWrapAsError(e), true, true);
	        }
	        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
	        return promise;
	    }
	    util.notEnumerableProp(promisified, "__isPromisified__", true);
	    return promisified;
	}

	var makeNodePromisified = canEvaluate
	    ? makeNodePromisifiedEval
	    : makeNodePromisifiedClosure;

	function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
	    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
	    var methods =
	        promisifiableMethods(obj, suffix, suffixRegexp, filter);

	    for (var i = 0, len = methods.length; i < len; i+= 2) {
	        var key = methods[i];
	        var fn = methods[i+1];
	        var promisifiedKey = key + suffix;
	        if (promisifier === makeNodePromisified) {
	            obj[promisifiedKey] =
	                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
	        } else {
	            var promisified = promisifier(fn, function() {
	                return makeNodePromisified(key, THIS, key,
	                                           fn, suffix, multiArgs);
	            });
	            util.notEnumerableProp(promisified, "__isPromisified__", true);
	            obj[promisifiedKey] = promisified;
	        }
	    }
	    util.toFastProperties(obj);
	    return obj;
	}

	function promisify(callback, receiver, multiArgs) {
	    return makeNodePromisified(callback, receiver, undefined,
	                                callback, null, multiArgs);
	}

	Promise.promisify = function (fn, options) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util.classString(fn));
	    }
	    if (isPromisified(fn)) {
	        return fn;
	    }
	    options = Object(options);
	    var receiver = options.context === undefined ? THIS : options.context;
	    var multiArgs = !!options.multiArgs;
	    var ret = promisify(fn, receiver, multiArgs);
	    util.copyDescriptors(fn, ret, propsFilter);
	    return ret;
	};

	Promise.promisifyAll = function (target, options) {
	    if (typeof target !== "function" && typeof target !== "object") {
	        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    options = Object(options);
	    var multiArgs = !!options.multiArgs;
	    var suffix = options.suffix;
	    if (typeof suffix !== "string") suffix = defaultSuffix;
	    var filter = options.filter;
	    if (typeof filter !== "function") filter = defaultFilter;
	    var promisifier = options.promisifier;
	    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

	    if (!util.isIdentifier(suffix)) {
	        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }

	    var keys = util.inheritedDataKeys(target);
	    for (var i = 0; i < keys.length; ++i) {
	        var value = target[keys[i]];
	        if (keys[i] !== "constructor" &&
	            util.isClass(value)) {
	            promisifyAll(value.prototype, suffix, filter, promisifier,
	                multiArgs);
	            promisifyAll(value, suffix, filter, promisifier, multiArgs);
	        }
	    }

	    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
	};
	};


	},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(
	    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
	var util = _dereq_("./util");
	var isObject = util.isObject;
	var es5 = _dereq_("./es5");
	var Es6Map;
	if (typeof Map === "function") Es6Map = Map;

	var mapToEntries = (function() {
	    var index = 0;
	    var size = 0;

	    function extractEntry(value, key) {
	        this[index] = value;
	        this[index + size] = key;
	        index++;
	    }

	    return function mapToEntries(map) {
	        size = map.size;
	        index = 0;
	        var ret = new Array(map.size * 2);
	        map.forEach(extractEntry, ret);
	        return ret;
	    };
	})();

	var entriesToMap = function(entries) {
	    var ret = new Es6Map();
	    var length = entries.length / 2 | 0;
	    for (var i = 0; i < length; ++i) {
	        var key = entries[length + i];
	        var value = entries[i];
	        ret.set(key, value);
	    }
	    return ret;
	};

	function PropertiesPromiseArray(obj) {
	    var isMap = false;
	    var entries;
	    if (Es6Map !== undefined && obj instanceof Es6Map) {
	        entries = mapToEntries(obj);
	        isMap = true;
	    } else {
	        var keys = es5.keys(obj);
	        var len = keys.length;
	        entries = new Array(len * 2);
	        for (var i = 0; i < len; ++i) {
	            var key = keys[i];
	            entries[i] = obj[key];
	            entries[i + len] = key;
	        }
	    }
	    this.constructor$(entries);
	    this._isMap = isMap;
	    this._init$(undefined, isMap ? -6 : -3);
	}
	util.inherits(PropertiesPromiseArray, PromiseArray);

	PropertiesPromiseArray.prototype._init = function () {};

	PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        var val;
	        if (this._isMap) {
	            val = entriesToMap(this._values);
	        } else {
	            val = {};
	            var keyOffset = this.length();
	            for (var i = 0, len = this.length(); i < len; ++i) {
	                val[this._values[i + keyOffset]] = this._values[i];
	            }
	        }
	        this._resolve(val);
	        return true;
	    }
	    return false;
	};

	PropertiesPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	PropertiesPromiseArray.prototype.getActualLength = function (len) {
	    return len >> 1;
	};

	function props(promises) {
	    var ret;
	    var castValue = tryConvertToPromise(promises);

	    if (!isObject(castValue)) {
	        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    } else if (castValue instanceof Promise) {
	        ret = castValue._then(
	            Promise.props, undefined, undefined, undefined, undefined);
	    } else {
	        ret = new PropertiesPromiseArray(castValue).promise();
	    }

	    if (castValue instanceof Promise) {
	        ret._propagateFrom(castValue, 2);
	    }
	    return ret;
	}

	Promise.prototype.props = function () {
	    return props(this);
	};

	Promise.props = function (promises) {
	    return props(promises);
	};
	};

	},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){
	"use strict";
	function arrayMove(src, srcIndex, dst, dstIndex, len) {
	    for (var j = 0; j < len; ++j) {
	        dst[j + dstIndex] = src[j + srcIndex];
	        src[j + srcIndex] = void 0;
	    }
	}

	function Queue(capacity) {
	    this._capacity = capacity;
	    this._length = 0;
	    this._front = 0;
	}

	Queue.prototype._willBeOverCapacity = function (size) {
	    return this._capacity < size;
	};

	Queue.prototype._pushOne = function (arg) {
	    var length = this.length();
	    this._checkCapacity(length + 1);
	    var i = (this._front + length) & (this._capacity - 1);
	    this[i] = arg;
	    this._length = length + 1;
	};

	Queue.prototype.push = function (fn, receiver, arg) {
	    var length = this.length() + 3;
	    if (this._willBeOverCapacity(length)) {
	        this._pushOne(fn);
	        this._pushOne(receiver);
	        this._pushOne(arg);
	        return;
	    }
	    var j = this._front + length - 3;
	    this._checkCapacity(length);
	    var wrapMask = this._capacity - 1;
	    this[(j + 0) & wrapMask] = fn;
	    this[(j + 1) & wrapMask] = receiver;
	    this[(j + 2) & wrapMask] = arg;
	    this._length = length;
	};

	Queue.prototype.shift = function () {
	    var front = this._front,
	        ret = this[front];

	    this[front] = undefined;
	    this._front = (front + 1) & (this._capacity - 1);
	    this._length--;
	    return ret;
	};

	Queue.prototype.length = function () {
	    return this._length;
	};

	Queue.prototype._checkCapacity = function (size) {
	    if (this._capacity < size) {
	        this._resizeTo(this._capacity << 1);
	    }
	};

	Queue.prototype._resizeTo = function (capacity) {
	    var oldCapacity = this._capacity;
	    this._capacity = capacity;
	    var front = this._front;
	    var length = this._length;
	    var moveItemsCount = (front + length) & (oldCapacity - 1);
	    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
	};

	module.exports = Queue;

	},{}],27:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(
	    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
	var util = _dereq_("./util");

	var raceLater = function (promise) {
	    return promise.then(function(array) {
	        return race(array, promise);
	    });
	};

	function race(promises, parent) {
	    var maybePromise = tryConvertToPromise(promises);

	    if (maybePromise instanceof Promise) {
	        return raceLater(maybePromise);
	    } else {
	        promises = util.asArray(promises);
	        if (promises === null)
	            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
	    }

	    var ret = new Promise(INTERNAL);
	    if (parent !== undefined) {
	        ret._propagateFrom(parent, 3);
	    }
	    var fulfill = ret._fulfill;
	    var reject = ret._reject;
	    for (var i = 0, len = promises.length; i < len; ++i) {
	        var val = promises[i];

	        if (val === undefined && !(i in promises)) {
	            continue;
	        }

	        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
	    }
	    return ret;
	}

	Promise.race = function (promises) {
	    return race(promises, undefined);
	};

	Promise.prototype.race = function () {
	    return race(this, undefined);
	};

	};

	},{"./util":36}],28:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util = _dereq_("./util");
	var tryCatch = util.tryCatch;

	function ReductionPromiseArray(promises, fn, initialValue, _each) {
	    this.constructor$(promises);
	    var domain = getDomain();
	    this._fn = domain === null ? fn : util.domainBind(domain, fn);
	    if (initialValue !== undefined) {
	        initialValue = Promise.resolve(initialValue);
	        initialValue._attachCancellationCallback(this);
	    }
	    this._initialValue = initialValue;
	    this._currentCancellable = null;
	    if(_each === INTERNAL) {
	        this._eachValues = Array(this._length);
	    } else if (_each === 0) {
	        this._eachValues = null;
	    } else {
	        this._eachValues = undefined;
	    }
	    this._promise._captureStackTrace();
	    this._init$(undefined, -5);
	}
	util.inherits(ReductionPromiseArray, PromiseArray);

	ReductionPromiseArray.prototype._gotAccum = function(accum) {
	    if (this._eachValues !== undefined && 
	        this._eachValues !== null && 
	        accum !== INTERNAL) {
	        this._eachValues.push(accum);
	    }
	};

	ReductionPromiseArray.prototype._eachComplete = function(value) {
	    if (this._eachValues !== null) {
	        this._eachValues.push(value);
	    }
	    return this._eachValues;
	};

	ReductionPromiseArray.prototype._init = function() {};

	ReductionPromiseArray.prototype._resolveEmptyArray = function() {
	    this._resolve(this._eachValues !== undefined ? this._eachValues
	                                                 : this._initialValue);
	};

	ReductionPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	ReductionPromiseArray.prototype._resolve = function(value) {
	    this._promise._resolveCallback(value);
	    this._values = null;
	};

	ReductionPromiseArray.prototype._resultCancelled = function(sender) {
	    if (sender === this._initialValue) return this._cancel();
	    if (this._isResolved()) return;
	    this._resultCancelled$();
	    if (this._currentCancellable instanceof Promise) {
	        this._currentCancellable.cancel();
	    }
	    if (this._initialValue instanceof Promise) {
	        this._initialValue.cancel();
	    }
	};

	ReductionPromiseArray.prototype._iterate = function (values) {
	    this._values = values;
	    var value;
	    var i;
	    var length = values.length;
	    if (this._initialValue !== undefined) {
	        value = this._initialValue;
	        i = 0;
	    } else {
	        value = Promise.resolve(values[0]);
	        i = 1;
	    }

	    this._currentCancellable = value;

	    if (!value.isRejected()) {
	        for (; i < length; ++i) {
	            var ctx = {
	                accum: null,
	                value: values[i],
	                index: i,
	                length: length,
	                array: this
	            };
	            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
	        }
	    }

	    if (this._eachValues !== undefined) {
	        value = value
	            ._then(this._eachComplete, undefined, undefined, this, undefined);
	    }
	    value._then(completed, completed, undefined, value, this);
	};

	Promise.prototype.reduce = function (fn, initialValue) {
	    return reduce(this, fn, initialValue, null);
	};

	Promise.reduce = function (promises, fn, initialValue, _each) {
	    return reduce(promises, fn, initialValue, _each);
	};

	function completed(valueOrReason, array) {
	    if (this.isFulfilled()) {
	        array._resolve(valueOrReason);
	    } else {
	        array._reject(valueOrReason);
	    }
	}

	function reduce(promises, fn, initialValue, _each) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util.classString(fn));
	    }
	    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
	    return array.promise();
	}

	function gotAccum(accum) {
	    this.accum = accum;
	    this.array._gotAccum(accum);
	    var value = tryConvertToPromise(this.value, this.array._promise);
	    if (value instanceof Promise) {
	        this.array._currentCancellable = value;
	        return value._then(gotValue, undefined, undefined, this, undefined);
	    } else {
	        return gotValue.call(this, value);
	    }
	}

	function gotValue(value) {
	    var array = this.array;
	    var promise = array._promise;
	    var fn = tryCatch(array._fn);
	    promise._pushContext();
	    var ret;
	    if (array._eachValues !== undefined) {
	        ret = fn.call(promise._boundValue(), value, this.index, this.length);
	    } else {
	        ret = fn.call(promise._boundValue(),
	                              this.accum, value, this.index, this.length);
	    }
	    if (ret instanceof Promise) {
	        array._currentCancellable = ret;
	    }
	    var promiseCreated = promise._popContext();
	    debug.checkForgottenReturns(
	        ret,
	        promiseCreated,
	        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
	        promise
	    );
	    return ret;
	}
	};

	},{"./util":36}],29:[function(_dereq_,module,exports){
	"use strict";
	var util = _dereq_("./util");
	var schedule;
	var noAsyncScheduler = function() {
	    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var NativePromise = util.getNativePromise();
	if (util.isNode && typeof MutationObserver === "undefined") {
	    var GlobalSetImmediate = commonjsGlobal.setImmediate;
	    var ProcessNextTick = process.nextTick;
	    schedule = util.isRecentNode
	                ? function(fn) { GlobalSetImmediate.call(commonjsGlobal, fn); }
	                : function(fn) { ProcessNextTick.call(process, fn); };
	} else if (typeof NativePromise === "function" &&
	           typeof NativePromise.resolve === "function") {
	    var nativePromise = NativePromise.resolve();
	    schedule = function(fn) {
	        nativePromise.then(fn);
	    };
	} else if ((typeof MutationObserver !== "undefined") &&
	          !(typeof window !== "undefined" &&
	            window.navigator &&
	            (window.navigator.standalone || window.cordova))) {
	    schedule = (function() {
	        var div = document.createElement("div");
	        var opts = {attributes: true};
	        var toggleScheduled = false;
	        var div2 = document.createElement("div");
	        var o2 = new MutationObserver(function() {
	            div.classList.toggle("foo");
	            toggleScheduled = false;
	        });
	        o2.observe(div2, opts);

	        var scheduleToggle = function() {
	            if (toggleScheduled) return;
	            toggleScheduled = true;
	            div2.classList.toggle("foo");
	        };

	        return function schedule(fn) {
	            var o = new MutationObserver(function() {
	                o.disconnect();
	                fn();
	            });
	            o.observe(div, opts);
	            scheduleToggle();
	        };
	    })();
	} else if (typeof setImmediate !== "undefined") {
	    schedule = function (fn) {
	        setImmediate(fn);
	    };
	} else if (typeof setTimeout !== "undefined") {
	    schedule = function (fn) {
	        setTimeout(fn, 0);
	    };
	} else {
	    schedule = noAsyncScheduler;
	}
	module.exports = schedule;

	},{"./util":36}],30:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	    function(Promise, PromiseArray, debug) {
	var PromiseInspection = Promise.PromiseInspection;
	var util = _dereq_("./util");

	function SettledPromiseArray(values) {
	    this.constructor$(values);
	}
	util.inherits(SettledPromiseArray, PromiseArray);

	SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
	    this._values[index] = inspection;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 33554432;
	    ret._settledValueField = value;
	    return this._promiseResolved(index, ret);
	};
	SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 16777216;
	    ret._settledValueField = reason;
	    return this._promiseResolved(index, ret);
	};

	Promise.settle = function (promises) {
	    debug.deprecated(".settle()", ".reflect()");
	    return new SettledPromiseArray(promises).promise();
	};

	Promise.prototype.settle = function () {
	    return Promise.settle(this);
	};
	};

	},{"./util":36}],31:[function(_dereq_,module,exports){
	"use strict";
	module.exports =
	function(Promise, PromiseArray, apiRejection) {
	var util = _dereq_("./util");
	var RangeError = _dereq_("./errors").RangeError;
	var AggregateError = _dereq_("./errors").AggregateError;
	var isArray = util.isArray;
	var CANCELLATION = {};


	function SomePromiseArray(values) {
	    this.constructor$(values);
	    this._howMany = 0;
	    this._unwrap = false;
	    this._initialized = false;
	}
	util.inherits(SomePromiseArray, PromiseArray);

	SomePromiseArray.prototype._init = function () {
	    if (!this._initialized) {
	        return;
	    }
	    if (this._howMany === 0) {
	        this._resolve([]);
	        return;
	    }
	    this._init$(undefined, -5);
	    var isArrayResolved = isArray(this._values);
	    if (!this._isResolved() &&
	        isArrayResolved &&
	        this._howMany > this._canPossiblyFulfill()) {
	        this._reject(this._getRangeError(this.length()));
	    }
	};

	SomePromiseArray.prototype.init = function () {
	    this._initialized = true;
	    this._init();
	};

	SomePromiseArray.prototype.setUnwrap = function () {
	    this._unwrap = true;
	};

	SomePromiseArray.prototype.howMany = function () {
	    return this._howMany;
	};

	SomePromiseArray.prototype.setHowMany = function (count) {
	    this._howMany = count;
	};

	SomePromiseArray.prototype._promiseFulfilled = function (value) {
	    this._addFulfilled(value);
	    if (this._fulfilled() === this.howMany()) {
	        this._values.length = this.howMany();
	        if (this.howMany() === 1 && this._unwrap) {
	            this._resolve(this._values[0]);
	        } else {
	            this._resolve(this._values);
	        }
	        return true;
	    }
	    return false;

	};
	SomePromiseArray.prototype._promiseRejected = function (reason) {
	    this._addRejected(reason);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._promiseCancelled = function () {
	    if (this._values instanceof Promise || this._values == null) {
	        return this._cancel();
	    }
	    this._addRejected(CANCELLATION);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._checkOutcome = function() {
	    if (this.howMany() > this._canPossiblyFulfill()) {
	        var e = new AggregateError();
	        for (var i = this.length(); i < this._values.length; ++i) {
	            if (this._values[i] !== CANCELLATION) {
	                e.push(this._values[i]);
	            }
	        }
	        if (e.length > 0) {
	            this._reject(e);
	        } else {
	            this._cancel();
	        }
	        return true;
	    }
	    return false;
	};

	SomePromiseArray.prototype._fulfilled = function () {
	    return this._totalResolved;
	};

	SomePromiseArray.prototype._rejected = function () {
	    return this._values.length - this.length();
	};

	SomePromiseArray.prototype._addRejected = function (reason) {
	    this._values.push(reason);
	};

	SomePromiseArray.prototype._addFulfilled = function (value) {
	    this._values[this._totalResolved++] = value;
	};

	SomePromiseArray.prototype._canPossiblyFulfill = function () {
	    return this.length() - this._rejected();
	};

	SomePromiseArray.prototype._getRangeError = function (count) {
	    var message = "Input array must contain at least " +
	            this._howMany + " items but contains only " + count + " items";
	    return new RangeError(message);
	};

	SomePromiseArray.prototype._resolveEmptyArray = function () {
	    this._reject(this._getRangeError(0));
	};

	function some(promises, howMany) {
	    if ((howMany | 0) !== howMany || howMany < 0) {
	        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(howMany);
	    ret.init();
	    return promise;
	}

	Promise.some = function (promises, howMany) {
	    return some(promises, howMany);
	};

	Promise.prototype.some = function (howMany) {
	    return some(this, howMany);
	};

	Promise._SomePromiseArray = SomePromiseArray;
	};

	},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise) {
	function PromiseInspection(promise) {
	    if (promise !== undefined) {
	        promise = promise._target();
	        this._bitField = promise._bitField;
	        this._settledValueField = promise._isFateSealed()
	            ? promise._settledValue() : undefined;
	    }
	    else {
	        this._bitField = 0;
	        this._settledValueField = undefined;
	    }
	}

	PromiseInspection.prototype._settledValue = function() {
	    return this._settledValueField;
	};

	var value = PromiseInspection.prototype.value = function () {
	    if (!this.isFulfilled()) {
	        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var reason = PromiseInspection.prototype.error =
	PromiseInspection.prototype.reason = function () {
	    if (!this.isRejected()) {
	        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
	    return (this._bitField & 33554432) !== 0;
	};

	var isRejected = PromiseInspection.prototype.isRejected = function () {
	    return (this._bitField & 16777216) !== 0;
	};

	var isPending = PromiseInspection.prototype.isPending = function () {
	    return (this._bitField & 50397184) === 0;
	};

	var isResolved = PromiseInspection.prototype.isResolved = function () {
	    return (this._bitField & 50331648) !== 0;
	};

	PromiseInspection.prototype.isCancelled = function() {
	    return (this._bitField & 8454144) !== 0;
	};

	Promise.prototype.__isCancelled = function() {
	    return (this._bitField & 65536) === 65536;
	};

	Promise.prototype._isCancelled = function() {
	    return this._target().__isCancelled();
	};

	Promise.prototype.isCancelled = function() {
	    return (this._target()._bitField & 8454144) !== 0;
	};

	Promise.prototype.isPending = function() {
	    return isPending.call(this._target());
	};

	Promise.prototype.isRejected = function() {
	    return isRejected.call(this._target());
	};

	Promise.prototype.isFulfilled = function() {
	    return isFulfilled.call(this._target());
	};

	Promise.prototype.isResolved = function() {
	    return isResolved.call(this._target());
	};

	Promise.prototype.value = function() {
	    return value.call(this._target());
	};

	Promise.prototype.reason = function() {
	    var target = this._target();
	    target._unsetRejectionIsUnhandled();
	    return reason.call(target);
	};

	Promise.prototype._value = function() {
	    return this._settledValue();
	};

	Promise.prototype._reason = function() {
	    this._unsetRejectionIsUnhandled();
	    return this._settledValue();
	};

	Promise.PromiseInspection = PromiseInspection;
	};

	},{}],33:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL) {
	var util = _dereq_("./util");
	var errorObj = util.errorObj;
	var isObject = util.isObject;

	function tryConvertToPromise(obj, context) {
	    if (isObject(obj)) {
	        if (obj instanceof Promise) return obj;
	        var then = getThen(obj);
	        if (then === errorObj) {
	            if (context) context._pushContext();
	            var ret = Promise.reject(then.e);
	            if (context) context._popContext();
	            return ret;
	        } else if (typeof then === "function") {
	            if (isAnyBluebirdPromise(obj)) {
	                var ret = new Promise(INTERNAL);
	                obj._then(
	                    ret._fulfill,
	                    ret._reject,
	                    undefined,
	                    ret,
	                    null
	                );
	                return ret;
	            }
	            return doThenable(obj, then, context);
	        }
	    }
	    return obj;
	}

	function doGetThen(obj) {
	    return obj.then;
	}

	function getThen(obj) {
	    try {
	        return doGetThen(obj);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}

	var hasProp = {}.hasOwnProperty;
	function isAnyBluebirdPromise(obj) {
	    try {
	        return hasProp.call(obj, "_promise0");
	    } catch (e) {
	        return false;
	    }
	}

	function doThenable(x, then, context) {
	    var promise = new Promise(INTERNAL);
	    var ret = promise;
	    if (context) context._pushContext();
	    promise._captureStackTrace();
	    if (context) context._popContext();
	    var synchronous = true;
	    var result = util.tryCatch(then).call(x, resolve, reject);
	    synchronous = false;

	    if (promise && result === errorObj) {
	        promise._rejectCallback(result.e, true, true);
	        promise = null;
	    }

	    function resolve(value) {
	        if (!promise) return;
	        promise._resolveCallback(value);
	        promise = null;
	    }

	    function reject(reason) {
	        if (!promise) return;
	        promise._rejectCallback(reason, synchronous, true);
	        promise = null;
	    }
	    return ret;
	}

	return tryConvertToPromise;
	};

	},{"./util":36}],34:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function(Promise, INTERNAL, debug) {
	var util = _dereq_("./util");
	var TimeoutError = Promise.TimeoutError;

	function HandleWrapper(handle)  {
	    this.handle = handle;
	}

	HandleWrapper.prototype._resultCancelled = function() {
	    clearTimeout(this.handle);
	};

	var afterValue = function(value) { return delay(+this).thenReturn(value); };
	var delay = Promise.delay = function (ms, value) {
	    var ret;
	    var handle;
	    if (value !== undefined) {
	        ret = Promise.resolve(value)
	                ._then(afterValue, null, null, ms, undefined);
	        if (debug.cancellation() && value instanceof Promise) {
	            ret._setOnCancel(value);
	        }
	    } else {
	        ret = new Promise(INTERNAL);
	        handle = setTimeout(function() { ret._fulfill(); }, +ms);
	        if (debug.cancellation()) {
	            ret._setOnCancel(new HandleWrapper(handle));
	        }
	        ret._captureStackTrace();
	    }
	    ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.prototype.delay = function (ms) {
	    return delay(ms, this);
	};

	var afterTimeout = function (promise, message, parent) {
	    var err;
	    if (typeof message !== "string") {
	        if (message instanceof Error) {
	            err = message;
	        } else {
	            err = new TimeoutError("operation timed out");
	        }
	    } else {
	        err = new TimeoutError(message);
	    }
	    util.markAsOriginatingFromRejection(err);
	    promise._attachExtraTrace(err);
	    promise._reject(err);

	    if (parent != null) {
	        parent.cancel();
	    }
	};

	function successClear(value) {
	    clearTimeout(this.handle);
	    return value;
	}

	function failureClear(reason) {
	    clearTimeout(this.handle);
	    throw reason;
	}

	Promise.prototype.timeout = function (ms, message) {
	    ms = +ms;
	    var ret, parent;

	    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
	        if (ret.isPending()) {
	            afterTimeout(ret, message, parent);
	        }
	    }, ms));

	    if (debug.cancellation()) {
	        parent = this.then();
	        ret = parent._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	        ret._setOnCancel(handleWrapper);
	    } else {
	        ret = this._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	    }

	    return ret;
	};

	};

	},{"./util":36}],35:[function(_dereq_,module,exports){
	"use strict";
	module.exports = function (Promise, apiRejection, tryConvertToPromise,
	    createContext, INTERNAL, debug) {
	    var util = _dereq_("./util");
	    var TypeError = _dereq_("./errors").TypeError;
	    var inherits = _dereq_("./util").inherits;
	    var errorObj = util.errorObj;
	    var tryCatch = util.tryCatch;
	    var NULL = {};

	    function thrower(e) {
	        setTimeout(function(){throw e;}, 0);
	    }

	    function castPreservingDisposable(thenable) {
	        var maybePromise = tryConvertToPromise(thenable);
	        if (maybePromise !== thenable &&
	            typeof thenable._isDisposable === "function" &&
	            typeof thenable._getDisposer === "function" &&
	            thenable._isDisposable()) {
	            maybePromise._setDisposable(thenable._getDisposer());
	        }
	        return maybePromise;
	    }
	    function dispose(resources, inspection) {
	        var i = 0;
	        var len = resources.length;
	        var ret = new Promise(INTERNAL);
	        function iterator() {
	            if (i >= len) return ret._fulfill();
	            var maybePromise = castPreservingDisposable(resources[i++]);
	            if (maybePromise instanceof Promise &&
	                maybePromise._isDisposable()) {
	                try {
	                    maybePromise = tryConvertToPromise(
	                        maybePromise._getDisposer().tryDispose(inspection),
	                        resources.promise);
	                } catch (e) {
	                    return thrower(e);
	                }
	                if (maybePromise instanceof Promise) {
	                    return maybePromise._then(iterator, thrower,
	                                              null, null, null);
	                }
	            }
	            iterator();
	        }
	        iterator();
	        return ret;
	    }

	    function Disposer(data, promise, context) {
	        this._data = data;
	        this._promise = promise;
	        this._context = context;
	    }

	    Disposer.prototype.data = function () {
	        return this._data;
	    };

	    Disposer.prototype.promise = function () {
	        return this._promise;
	    };

	    Disposer.prototype.resource = function () {
	        if (this.promise().isFulfilled()) {
	            return this.promise().value();
	        }
	        return NULL;
	    };

	    Disposer.prototype.tryDispose = function(inspection) {
	        var resource = this.resource();
	        var context = this._context;
	        if (context !== undefined) context._pushContext();
	        var ret = resource !== NULL
	            ? this.doDispose(resource, inspection) : null;
	        if (context !== undefined) context._popContext();
	        this._promise._unsetDisposable();
	        this._data = null;
	        return ret;
	    };

	    Disposer.isDisposer = function (d) {
	        return (d != null &&
	                typeof d.resource === "function" &&
	                typeof d.tryDispose === "function");
	    };

	    function FunctionDisposer(fn, promise, context) {
	        this.constructor$(fn, promise, context);
	    }
	    inherits(FunctionDisposer, Disposer);

	    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
	        var fn = this.data();
	        return fn.call(resource, resource, inspection);
	    };

	    function maybeUnwrapDisposer(value) {
	        if (Disposer.isDisposer(value)) {
	            this.resources[this.index]._setDisposable(value);
	            return value.promise();
	        }
	        return value;
	    }

	    function ResourceList(length) {
	        this.length = length;
	        this.promise = null;
	        this[length-1] = null;
	    }

	    ResourceList.prototype._resultCancelled = function() {
	        var len = this.length;
	        for (var i = 0; i < len; ++i) {
	            var item = this[i];
	            if (item instanceof Promise) {
	                item.cancel();
	            }
	        }
	    };

	    Promise.using = function () {
	        var len = arguments.length;
	        if (len < 2) return apiRejection(
	                        "you must pass at least 2 arguments to Promise.using");
	        var fn = arguments[len - 1];
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util.classString(fn));
	        }
	        var input;
	        var spreadArgs = true;
	        if (len === 2 && Array.isArray(arguments[0])) {
	            input = arguments[0];
	            len = input.length;
	            spreadArgs = false;
	        } else {
	            input = arguments;
	            len--;
	        }
	        var resources = new ResourceList(len);
	        for (var i = 0; i < len; ++i) {
	            var resource = input[i];
	            if (Disposer.isDisposer(resource)) {
	                var disposer = resource;
	                resource = resource.promise();
	                resource._setDisposable(disposer);
	            } else {
	                var maybePromise = tryConvertToPromise(resource);
	                if (maybePromise instanceof Promise) {
	                    resource =
	                        maybePromise._then(maybeUnwrapDisposer, null, null, {
	                            resources: resources,
	                            index: i
	                    }, undefined);
	                }
	            }
	            resources[i] = resource;
	        }

	        var reflectedResources = new Array(resources.length);
	        for (var i = 0; i < reflectedResources.length; ++i) {
	            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
	        }

	        var resultPromise = Promise.all(reflectedResources)
	            .then(function(inspections) {
	                for (var i = 0; i < inspections.length; ++i) {
	                    var inspection = inspections[i];
	                    if (inspection.isRejected()) {
	                        errorObj.e = inspection.error();
	                        return errorObj;
	                    } else if (!inspection.isFulfilled()) {
	                        resultPromise.cancel();
	                        return;
	                    }
	                    inspections[i] = inspection.value();
	                }
	                promise._pushContext();

	                fn = tryCatch(fn);
	                var ret = spreadArgs
	                    ? fn.apply(undefined, inspections) : fn(inspections);
	                var promiseCreated = promise._popContext();
	                debug.checkForgottenReturns(
	                    ret, promiseCreated, "Promise.using", promise);
	                return ret;
	            });

	        var promise = resultPromise.lastly(function() {
	            var inspection = new Promise.PromiseInspection(resultPromise);
	            return dispose(resources, inspection);
	        });
	        resources.promise = promise;
	        promise._setOnCancel(resources);
	        return promise;
	    };

	    Promise.prototype._setDisposable = function (disposer) {
	        this._bitField = this._bitField | 131072;
	        this._disposer = disposer;
	    };

	    Promise.prototype._isDisposable = function () {
	        return (this._bitField & 131072) > 0;
	    };

	    Promise.prototype._getDisposer = function () {
	        return this._disposer;
	    };

	    Promise.prototype._unsetDisposable = function () {
	        this._bitField = this._bitField & (~131072);
	        this._disposer = undefined;
	    };

	    Promise.prototype.disposer = function (fn) {
	        if (typeof fn === "function") {
	            return new FunctionDisposer(fn, this, createContext());
	        }
	        throw new TypeError();
	    };

	};

	},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){
	"use strict";
	var es5 = _dereq_("./es5");
	var canEvaluate = typeof navigator == "undefined";

	var errorObj = {e: {}};
	var tryCatchTarget;
	var globalObject = typeof self !== "undefined" ? self :
	    typeof window !== "undefined" ? window :
	    typeof commonjsGlobal !== "undefined" ? commonjsGlobal :
	    this !== undefined ? this : null;

	function tryCatcher() {
	    try {
	        var target = tryCatchTarget;
	        tryCatchTarget = null;
	        return target.apply(this, arguments);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}
	function tryCatch(fn) {
	    tryCatchTarget = fn;
	    return tryCatcher;
	}

	var inherits = function(Child, Parent) {
	    var hasProp = {}.hasOwnProperty;

	    function T() {
	        this.constructor = Child;
	        this.constructor$ = Parent;
	        for (var propertyName in Parent.prototype) {
	            if (hasProp.call(Parent.prototype, propertyName) &&
	                propertyName.charAt(propertyName.length-1) !== "$"
	           ) {
	                this[propertyName + "$"] = Parent.prototype[propertyName];
	            }
	        }
	    }
	    T.prototype = Parent.prototype;
	    Child.prototype = new T();
	    return Child.prototype;
	};


	function isPrimitive(val) {
	    return val == null || val === true || val === false ||
	        typeof val === "string" || typeof val === "number";

	}

	function isObject(value) {
	    return typeof value === "function" ||
	           typeof value === "object" && value !== null;
	}

	function maybeWrapAsError(maybeError) {
	    if (!isPrimitive(maybeError)) return maybeError;

	    return new Error(safeToString(maybeError));
	}

	function withAppended(target, appendee) {
	    var len = target.length;
	    var ret = new Array(len + 1);
	    var i;
	    for (i = 0; i < len; ++i) {
	        ret[i] = target[i];
	    }
	    ret[i] = appendee;
	    return ret;
	}

	function getDataPropertyOrDefault(obj, key, defaultValue) {
	    if (es5.isES5) {
	        var desc = Object.getOwnPropertyDescriptor(obj, key);

	        if (desc != null) {
	            return desc.get == null && desc.set == null
	                    ? desc.value
	                    : defaultValue;
	        }
	    } else {
	        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
	    }
	}

	function notEnumerableProp(obj, name, value) {
	    if (isPrimitive(obj)) return obj;
	    var descriptor = {
	        value: value,
	        configurable: true,
	        enumerable: false,
	        writable: true
	    };
	    es5.defineProperty(obj, name, descriptor);
	    return obj;
	}

	function thrower(r) {
	    throw r;
	}

	var inheritedDataKeys = (function() {
	    var excludedPrototypes = [
	        Array.prototype,
	        Object.prototype,
	        Function.prototype
	    ];

	    var isExcludedProto = function(val) {
	        for (var i = 0; i < excludedPrototypes.length; ++i) {
	            if (excludedPrototypes[i] === val) {
	                return true;
	            }
	        }
	        return false;
	    };

	    if (es5.isES5) {
	        var getKeys = Object.getOwnPropertyNames;
	        return function(obj) {
	            var ret = [];
	            var visitedKeys = Object.create(null);
	            while (obj != null && !isExcludedProto(obj)) {
	                var keys;
	                try {
	                    keys = getKeys(obj);
	                } catch (e) {
	                    return ret;
	                }
	                for (var i = 0; i < keys.length; ++i) {
	                    var key = keys[i];
	                    if (visitedKeys[key]) continue;
	                    visitedKeys[key] = true;
	                    var desc = Object.getOwnPropertyDescriptor(obj, key);
	                    if (desc != null && desc.get == null && desc.set == null) {
	                        ret.push(key);
	                    }
	                }
	                obj = es5.getPrototypeOf(obj);
	            }
	            return ret;
	        };
	    } else {
	        var hasProp = {}.hasOwnProperty;
	        return function(obj) {
	            if (isExcludedProto(obj)) return [];
	            var ret = [];

	            /*jshint forin:false */
	            enumeration: for (var key in obj) {
	                if (hasProp.call(obj, key)) {
	                    ret.push(key);
	                } else {
	                    for (var i = 0; i < excludedPrototypes.length; ++i) {
	                        if (hasProp.call(excludedPrototypes[i], key)) {
	                            continue enumeration;
	                        }
	                    }
	                    ret.push(key);
	                }
	            }
	            return ret;
	        };
	    }

	})();

	var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
	function isClass(fn) {
	    try {
	        if (typeof fn === "function") {
	            var keys = es5.names(fn.prototype);

	            var hasMethods = es5.isES5 && keys.length > 1;
	            var hasMethodsOtherThanConstructor = keys.length > 0 &&
	                !(keys.length === 1 && keys[0] === "constructor");
	            var hasThisAssignmentAndStaticMethods =
	                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

	            if (hasMethods || hasMethodsOtherThanConstructor ||
	                hasThisAssignmentAndStaticMethods) {
	                return true;
	            }
	        }
	        return false;
	    } catch (e) {
	        return false;
	    }
	}

	function toFastProperties(obj) {
	    /*jshint -W027,-W055,-W031*/
	    function FakeConstructor() {}
	    FakeConstructor.prototype = obj;
	    var l = 8;
	    while (l--) new FakeConstructor();
	    return obj;
	    eval(obj);
	}

	var rident = /^[a-z$_][a-z$_0-9]*$/i;
	function isIdentifier(str) {
	    return rident.test(str);
	}

	function filledRange(count, prefix, suffix) {
	    var ret = new Array(count);
	    for(var i = 0; i < count; ++i) {
	        ret[i] = prefix + i + suffix;
	    }
	    return ret;
	}

	function safeToString(obj) {
	    try {
	        return obj + "";
	    } catch (e) {
	        return "[no string representation]";
	    }
	}

	function isError(obj) {
	    return obj !== null &&
	           typeof obj === "object" &&
	           typeof obj.message === "string" &&
	           typeof obj.name === "string";
	}

	function markAsOriginatingFromRejection(e) {
	    try {
	        notEnumerableProp(e, "isOperational", true);
	    }
	    catch(ignore) {}
	}

	function originatesFromRejection(e) {
	    if (e == null) return false;
	    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
	        e["isOperational"] === true);
	}

	function canAttachTrace(obj) {
	    return isError(obj) && es5.propertyIsWritable(obj, "stack");
	}

	var ensureErrorObject = (function() {
	    if (!("stack" in new Error())) {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            try {throw new Error(safeToString(value));}
	            catch(err) {return err;}
	        };
	    } else {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            return new Error(safeToString(value));
	        };
	    }
	})();

	function classString(obj) {
	    return {}.toString.call(obj);
	}

	function copyDescriptors(from, to, filter) {
	    var keys = es5.names(from);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        if (filter(key)) {
	            try {
	                es5.defineProperty(to, key, es5.getDescriptor(from, key));
	            } catch (ignore) {}
	        }
	    }
	}

	var asArray = function(v) {
	    if (es5.isArray(v)) {
	        return v;
	    }
	    return null;
	};

	if (typeof Symbol !== "undefined" && Symbol.iterator) {
	    var ArrayFrom = typeof Array.from === "function" ? function(v) {
	        return Array.from(v);
	    } : function(v) {
	        var ret = [];
	        var it = v[Symbol.iterator]();
	        var itResult;
	        while (!((itResult = it.next()).done)) {
	            ret.push(itResult.value);
	        }
	        return ret;
	    };

	    asArray = function(v) {
	        if (es5.isArray(v)) {
	            return v;
	        } else if (v != null && typeof v[Symbol.iterator] === "function") {
	            return ArrayFrom(v);
	        }
	        return null;
	    };
	}

	var isNode = typeof process !== "undefined" &&
	        classString(process).toLowerCase() === "[object process]";

	var hasEnvVariables = typeof process !== "undefined" &&
	    typeof process.env !== "undefined";

	function env(key) {
	    return hasEnvVariables ? process.env[key] : undefined;
	}

	function getNativePromise() {
	    if (typeof Promise === "function") {
	        try {
	            var promise = new Promise(function(){});
	            if ({}.toString.call(promise) === "[object Promise]") {
	                return Promise;
	            }
	        } catch (e) {}
	    }
	}

	function domainBind(self, cb) {
	    return self.bind(cb);
	}

	var ret = {
	    isClass: isClass,
	    isIdentifier: isIdentifier,
	    inheritedDataKeys: inheritedDataKeys,
	    getDataPropertyOrDefault: getDataPropertyOrDefault,
	    thrower: thrower,
	    isArray: es5.isArray,
	    asArray: asArray,
	    notEnumerableProp: notEnumerableProp,
	    isPrimitive: isPrimitive,
	    isObject: isObject,
	    isError: isError,
	    canEvaluate: canEvaluate,
	    errorObj: errorObj,
	    tryCatch: tryCatch,
	    inherits: inherits,
	    withAppended: withAppended,
	    maybeWrapAsError: maybeWrapAsError,
	    toFastProperties: toFastProperties,
	    filledRange: filledRange,
	    toString: safeToString,
	    canAttachTrace: canAttachTrace,
	    ensureErrorObject: ensureErrorObject,
	    originatesFromRejection: originatesFromRejection,
	    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
	    classString: classString,
	    copyDescriptors: copyDescriptors,
	    hasDevTools: typeof chrome !== "undefined" && chrome &&
	                 typeof chrome.loadTimes === "function",
	    isNode: isNode,
	    hasEnvVariables: hasEnvVariables,
	    env: env,
	    global: globalObject,
	    getNativePromise: getNativePromise,
	    domainBind: domainBind
	};
	ret.isRecentNode = ret.isNode && (function() {
	    var version = process.versions.node.split(".").map(Number);
	    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
	})();

	if (ret.isNode) ret.toFastProperties(process);

	try {throw new Error(); } catch (e) {ret.lastLineError = e;}
	module.exports = ret;

	},{"./es5":13}]},{},[4])(4)
	});                    if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }
	});

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  };

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ];

	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    };

	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    };
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift();
	        return {done: value === undefined, value: value}
	      }
	    };

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      };
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {};

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1]);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var oldValue = this.map[name];
	    this.map[name] = oldValue ? oldValue+','+value : value;
	  };

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)];
	  };

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name);
	    return this.has(name) ? this.map[name] : null
	  };

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  };

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value);
	  };

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this);
	      }
	    }
	  };

	  Headers.prototype.keys = function() {
	    var items = [];
	    this.forEach(function(value, name) { items.push(name); });
	    return iteratorFor(items)
	  };

	  Headers.prototype.values = function() {
	    var items = [];
	    this.forEach(function(value) { items.push(value); });
	    return iteratorFor(items)
	  };

	  Headers.prototype.entries = function() {
	    var items = [];
	    this.forEach(function(value, name) { items.push([name, value]); });
	    return iteratorFor(items)
	  };

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true;
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result);
	      };
	      reader.onerror = function() {
	        reject(reader.error);
	      };
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsArrayBuffer(blob);
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsText(blob);
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf);
	    var chars = new Array(view.length);

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i]);
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength);
	      view.set(new Uint8Array(buf));
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false;

	    this._initBody = function(body) {
	      this._bodyInit = body;
	      if (!body) {
	        this._bodyText = '';
	      } else if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer);
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer]);
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body);
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      };

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      };
	    }

	    this.text = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    };

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      };
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    };

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = String(input);
	    }

	    this.credentials = options.credentials || this.credentials || 'omit';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.referrer = null;

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body);
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  };

	  function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers();
	    rawHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':');
	      var key = parts.shift().trim();
	      if (key) {
	        var value = parts.join(':').trim();
	        headers.append(key, value);
	      }
	    });
	    return headers
	  }

	  Body.call(Request.prototype);

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }

	    this.type = 'default';
	    this.status = 'status' in options ? options.status : 200;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = 'statusText' in options ? options.statusText : 'OK';
	    this.headers = new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }

	  Body.call(Response.prototype);

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  };

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''});
	    response.type = 'error';
	    return response
	  };

	  var redirectStatuses = [301, 302, 303, 307, 308];

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  };

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init);
	      var xhr = new XMLHttpRequest();

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        };
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options));
	      };

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'));
	      };

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'));
	      };

	      xhr.open(request.method, request.url, true);

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob';
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value);
	      });

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    })
	  };
	  self.fetch.polyfill = true;
	})(typeof self !== 'undefined' ? self : global);

	// Promise API polyfill for IE11
	// fetch API polyfill for old browsers
	if (!console.time || !console.timeEnd) {
	  var timers = {};
	  console.time = function(key) {
	    timers[key] = new Date().getTime();
	  };
	  console.timeEnd = function(id) {
	    if (!timers[key]) return
	    console.log(key + ': ' + (new Date().getTime() - timers[key]) + 'ms');
	    delete timers[key];
	  };
	}

	// from https://raw.githubusercontent.com/mrdoob/three.js/dev/src/polyfills.js

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

	// Bootstrap logger
	logger.useDefaults();

	// print header to console in browser environment
	if (runtime.isBrowser) {
	  console.log(homepage+' '+version+' (@'+GIT_BRANCH+' #'+GIT_COMMIT.substr(0,7)+' '+BUILD_DATE+')' );
	}

	// global dependencies

	// three.js
	if (runtime.isNode) global.THREE = require('three');

	// default configs values

	var defaults = Object.freeze({
	  logLevel:      'warn',
	  publishableApiKey: getPublishableApiKeyFromUrl(),
	  secretApiKey: null,
	  servicesUrl:   'https://spaces.archilogic.com/api/v2',
	  storageDomain: 'storage.3d.io',
	  storageDomainNoCdn: 'storage-nocdn.3d.io'
	});

	// constants

	var LOG_STRING_TO_ENUM = {
	  error: logger.ERROR,
	  warn:  logger.WARN,
	  info:  logger.INFO,
	  debug: logger.DEBUG
	};

	// main

	var configs = function configs (args) {

	  if (!args) {
	    // no arguments: return copy of configs object
	    return JSON.parse(JSON.stringify(this))
	  }

	  // apply log level if among arguments
	  if (args.logLevel) {
	    setLogLevel(args.logLevel);
	    delete args.logLevel;
	  }

	  // simply copy over the other configs
	  var key, keys = Object.keys(args);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    key = keys[i];
	    if (defaults[key] !== undefined) {
	      configs[key] = args[key];
	    } else {
	      logger.warn('Unknown config param "' + key + '". Available params are: ' + Object.keys(defaults).join(', '));
	    }
	  }

	  return this
	};

	// private methods

	function setLogLevel (val) {
	  // update logger
	  var logLevelEnum = LOG_STRING_TO_ENUM[val];
	  if (logLevelEnum) {
	    // set log level
	    logger.setLevel(logLevelEnum);
	    configs.logLevel = val;
	  } else {
	    // handle error
	    var errorMessage = 'Unknown log level "' + val + '". Possible are: "' + Object.keys(LOG_STRING_TO_ENUM).join('", "') + '". ';
	    if (configs.logLevel) {
	      // do not change current log level
	      errorMessage += 'Log level remains "' + configs.logLevel;
	    } else {
	      // set default log level
	      var defaultVal = defaults.logLevel;
	      errorMessage += 'Fallback to default "' + defaultVal + '".';
	      logger.setLevel(LOG_STRING_TO_ENUM[defaultVal]);
	      configs.logLevel = defaultVal;
	    }
	    console.error(errorMessage);
	  }
	}

	function getPublishableApiKeyFromUrl () {
	  if (!runtime.isBrowser) return null
	  var libUrl;
	  if (document.currentScript) {
	    libUrl = document.currentScript.getAttribute('src');
	  } else {
	    // browsers not supporting currentScript
	    var src, libSearch;
	    var scripts = document.getElementsByTagName('script');
	    var libNameRegex = new RegExp('(\/3dio\.js|\/3dio\.min\.js)');
	    // iterating backwarts as the last script is most likely the current one
	    for (var i=scripts.length-1; i>-1; i--) {
	      src = scripts[i].getAttribute('src');
	      if (libNameRegex.exec(src)) {
	        libUrl = src;
	        break
	      }
	    }
	  }
	  var keySearch = /pk=([^&]+)/i.exec(libUrl);
	  return keySearch ? keySearch[1] : null
	}

	// init

	configs(JSON.parse(JSON.stringify(defaults)));

	function checkDependencies (args, target) {

	  if (args.three && !runtime.has.three) {
	    return handleError(args.onError, target, 'Sorry: THREE not available.')
	  } else if (args.aFrame && !runtime.has.aFrame) {
	    return handleError(args.onError, target, 'Sorry: AFRAME not available.')
	  } else {
	    return typeof target === 'function' ? target() : target
	  }

	}

	// helper

	function handleError (errorCallback, target, message) {
	  // call errorCallback if provided
	  if (errorCallback) errorCallback(message);
	  // based on target type...
	  if (typeof target === 'function') {
	    // return a function throwing an error to handle runtime access
	    return function onError () {
	      throw new Error(message)
	    }
	  } else {
	    return false
	  }
	}

	var es5 = createCommonjsModule(function (module) {
	var isES5 = (function(){
	    "use strict";
	    return this === undefined;
	})();

	if (isES5) {
	    module.exports = {
	        freeze: Object.freeze,
	        defineProperty: Object.defineProperty,
	        getDescriptor: Object.getOwnPropertyDescriptor,
	        keys: Object.keys,
	        names: Object.getOwnPropertyNames,
	        getPrototypeOf: Object.getPrototypeOf,
	        isArray: Array.isArray,
	        isES5: isES5,
	        propertyIsWritable: function(obj, prop) {
	            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	            return !!(!descriptor || descriptor.writable || descriptor.set);
	        }
	    };
	} else {
	    var has = {}.hasOwnProperty;
	    var str = {}.toString;
	    var proto = {}.constructor.prototype;

	    var ObjectKeys = function (o) {
	        var ret = [];
	        for (var key in o) {
	            if (has.call(o, key)) {
	                ret.push(key);
	            }
	        }
	        return ret;
	    };

	    var ObjectGetDescriptor = function(o, key) {
	        return {value: o[key]};
	    };

	    var ObjectDefineProperty = function (o, key, desc) {
	        o[key] = desc.value;
	        return o;
	    };

	    var ObjectFreeze = function (obj) {
	        return obj;
	    };

	    var ObjectGetPrototypeOf = function (obj) {
	        try {
	            return Object(obj).constructor.prototype;
	        }
	        catch (e) {
	            return proto;
	        }
	    };

	    var ArrayIsArray = function (obj) {
	        try {
	            return str.call(obj) === "[object Array]";
	        }
	        catch(e) {
	            return false;
	        }
	    };

	    module.exports = {
	        isArray: ArrayIsArray,
	        keys: ObjectKeys,
	        names: ObjectKeys,
	        defineProperty: ObjectDefineProperty,
	        getDescriptor: ObjectGetDescriptor,
	        freeze: ObjectFreeze,
	        getPrototypeOf: ObjectGetPrototypeOf,
	        isES5: isES5,
	        propertyIsWritable: function() {
	            return true;
	        }
	    };
	}
	});

	var canEvaluate = typeof navigator == "undefined";

	var errorObj = {e: {}};
	var tryCatchTarget$1;
	var globalObject = typeof self !== "undefined" ? self :
	    typeof window !== "undefined" ? window :
	    typeof commonjsGlobal !== "undefined" ? commonjsGlobal :
	    commonjsGlobal !== undefined ? commonjsGlobal : null;

	function tryCatcher$1() {
	    try {
	        var target = tryCatchTarget$1;
	        tryCatchTarget$1 = null;
	        return target.apply(this, arguments);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}
	function tryCatch$1(fn) {
	    tryCatchTarget$1 = fn;
	    return tryCatcher$1;
	}

	var inherits = function(Child, Parent) {
	    var hasProp = {}.hasOwnProperty;

	    function T() {
	        this.constructor = Child;
	        this.constructor$ = Parent;
	        for (var propertyName in Parent.prototype) {
	            if (hasProp.call(Parent.prototype, propertyName) &&
	                propertyName.charAt(propertyName.length-1) !== "$"
	           ) {
	                this[propertyName + "$"] = Parent.prototype[propertyName];
	            }
	        }
	    }
	    T.prototype = Parent.prototype;
	    Child.prototype = new T();
	    return Child.prototype;
	};


	function isPrimitive(val) {
	    return val == null || val === true || val === false ||
	        typeof val === "string" || typeof val === "number";

	}

	function isObject$1(value) {
	    return typeof value === "function" ||
	           typeof value === "object" && value !== null;
	}

	function maybeWrapAsError(maybeError) {
	    if (!isPrimitive(maybeError)) return maybeError;

	    return new Error(safeToString(maybeError));
	}

	function withAppended(target, appendee) {
	    var len = target.length;
	    var ret = new Array(len + 1);
	    var i;
	    for (i = 0; i < len; ++i) {
	        ret[i] = target[i];
	    }
	    ret[i] = appendee;
	    return ret;
	}

	function getDataPropertyOrDefault(obj, key, defaultValue) {
	    if (es5.isES5) {
	        var desc = Object.getOwnPropertyDescriptor(obj, key);

	        if (desc != null) {
	            return desc.get == null && desc.set == null
	                    ? desc.value
	                    : defaultValue;
	        }
	    } else {
	        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
	    }
	}

	function notEnumerableProp(obj, name, value) {
	    if (isPrimitive(obj)) return obj;
	    var descriptor = {
	        value: value,
	        configurable: true,
	        enumerable: false,
	        writable: true
	    };
	    es5.defineProperty(obj, name, descriptor);
	    return obj;
	}

	function thrower(r) {
	    throw r;
	}

	var inheritedDataKeys = (function() {
	    var excludedPrototypes = [
	        Array.prototype,
	        Object.prototype,
	        Function.prototype
	    ];

	    var isExcludedProto = function(val) {
	        for (var i = 0; i < excludedPrototypes.length; ++i) {
	            if (excludedPrototypes[i] === val) {
	                return true;
	            }
	        }
	        return false;
	    };

	    if (es5.isES5) {
	        var getKeys = Object.getOwnPropertyNames;
	        return function(obj) {
	            var ret = [];
	            var visitedKeys = Object.create(null);
	            while (obj != null && !isExcludedProto(obj)) {
	                var keys;
	                try {
	                    keys = getKeys(obj);
	                } catch (e) {
	                    return ret;
	                }
	                for (var i = 0; i < keys.length; ++i) {
	                    var key = keys[i];
	                    if (visitedKeys[key]) continue;
	                    visitedKeys[key] = true;
	                    var desc = Object.getOwnPropertyDescriptor(obj, key);
	                    if (desc != null && desc.get == null && desc.set == null) {
	                        ret.push(key);
	                    }
	                }
	                obj = es5.getPrototypeOf(obj);
	            }
	            return ret;
	        };
	    } else {
	        var hasProp = {}.hasOwnProperty;
	        return function(obj) {
	            if (isExcludedProto(obj)) return [];
	            var ret = [];

	            /*jshint forin:false */
	            enumeration: for (var key in obj) {
	                if (hasProp.call(obj, key)) {
	                    ret.push(key);
	                } else {
	                    for (var i = 0; i < excludedPrototypes.length; ++i) {
	                        if (hasProp.call(excludedPrototypes[i], key)) {
	                            continue enumeration;
	                        }
	                    }
	                    ret.push(key);
	                }
	            }
	            return ret;
	        };
	    }

	})();

	var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
	function isClass(fn) {
	    try {
	        if (typeof fn === "function") {
	            var keys = es5.names(fn.prototype);

	            var hasMethods = es5.isES5 && keys.length > 1;
	            var hasMethodsOtherThanConstructor = keys.length > 0 &&
	                !(keys.length === 1 && keys[0] === "constructor");
	            var hasThisAssignmentAndStaticMethods =
	                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

	            if (hasMethods || hasMethodsOtherThanConstructor ||
	                hasThisAssignmentAndStaticMethods) {
	                return true;
	            }
	        }
	        return false;
	    } catch (e) {
	        return false;
	    }
	}

	function toFastProperties(obj) {
	    /*jshint -W027,-W055,-W031*/
	    function FakeConstructor() {}
	    FakeConstructor.prototype = obj;
	    var l = 8;
	    while (l--) new FakeConstructor();
	    return obj;
	    eval(obj);
	}

	var rident = /^[a-z$_][a-z$_0-9]*$/i;
	function isIdentifier(str) {
	    return rident.test(str);
	}

	function filledRange(count, prefix, suffix) {
	    var ret = new Array(count);
	    for(var i = 0; i < count; ++i) {
	        ret[i] = prefix + i + suffix;
	    }
	    return ret;
	}

	function safeToString(obj) {
	    try {
	        return obj + "";
	    } catch (e) {
	        return "[no string representation]";
	    }
	}

	function isError(obj) {
	    return obj !== null &&
	           typeof obj === "object" &&
	           typeof obj.message === "string" &&
	           typeof obj.name === "string";
	}

	function markAsOriginatingFromRejection(e) {
	    try {
	        notEnumerableProp(e, "isOperational", true);
	    }
	    catch(ignore) {}
	}

	function originatesFromRejection(e) {
	    if (e == null) return false;
	    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
	        e["isOperational"] === true);
	}

	function canAttachTrace(obj) {
	    return isError(obj) && es5.propertyIsWritable(obj, "stack");
	}

	var ensureErrorObject = (function() {
	    if (!("stack" in new Error())) {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            try {throw new Error(safeToString(value));}
	            catch(err) {return err;}
	        };
	    } else {
	        return function(value) {
	            if (canAttachTrace(value)) return value;
	            return new Error(safeToString(value));
	        };
	    }
	})();

	function classString(obj) {
	    return {}.toString.call(obj);
	}

	function copyDescriptors(from, to, filter) {
	    var keys = es5.names(from);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        if (filter(key)) {
	            try {
	                es5.defineProperty(to, key, es5.getDescriptor(from, key));
	            } catch (ignore) {}
	        }
	    }
	}

	var asArray = function(v) {
	    if (es5.isArray(v)) {
	        return v;
	    }
	    return null;
	};

	if (typeof Symbol !== "undefined" && Symbol.iterator) {
	    var ArrayFrom = typeof Array.from === "function" ? function(v) {
	        return Array.from(v);
	    } : function(v) {
	        var ret = [];
	        var it = v[Symbol.iterator]();
	        var itResult;
	        while (!((itResult = it.next()).done)) {
	            ret.push(itResult.value);
	        }
	        return ret;
	    };

	    asArray = function(v) {
	        if (es5.isArray(v)) {
	            return v;
	        } else if (v != null && typeof v[Symbol.iterator] === "function") {
	            return ArrayFrom(v);
	        }
	        return null;
	    };
	}

	var isNode$1 = typeof process !== "undefined" &&
	        classString(process).toLowerCase() === "[object process]";

	var hasEnvVariables = typeof process !== "undefined" &&
	    typeof process.env !== "undefined";

	function env(key) {
	    return hasEnvVariables ? process.env[key] : undefined;
	}

	function getNativePromise() {
	    if (typeof Promise === "function") {
	        try {
	            var promise = new Promise(function(){});
	            if ({}.toString.call(promise) === "[object Promise]") {
	                return Promise;
	            }
	        } catch (e) {}
	    }
	}

	function domainBind(self, cb) {
	    return self.bind(cb);
	}

	var ret = {
	    isClass: isClass,
	    isIdentifier: isIdentifier,
	    inheritedDataKeys: inheritedDataKeys,
	    getDataPropertyOrDefault: getDataPropertyOrDefault,
	    thrower: thrower,
	    isArray: es5.isArray,
	    asArray: asArray,
	    notEnumerableProp: notEnumerableProp,
	    isPrimitive: isPrimitive,
	    isObject: isObject$1,
	    isError: isError,
	    canEvaluate: canEvaluate,
	    errorObj: errorObj,
	    tryCatch: tryCatch$1,
	    inherits: inherits,
	    withAppended: withAppended,
	    maybeWrapAsError: maybeWrapAsError,
	    toFastProperties: toFastProperties,
	    filledRange: filledRange,
	    toString: safeToString,
	    canAttachTrace: canAttachTrace,
	    ensureErrorObject: ensureErrorObject,
	    originatesFromRejection: originatesFromRejection,
	    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
	    classString: classString,
	    copyDescriptors: copyDescriptors,
	    hasDevTools: typeof chrome !== "undefined" && chrome &&
	                 typeof chrome.loadTimes === "function",
	    isNode: isNode$1,
	    hasEnvVariables: hasEnvVariables,
	    env: env,
	    global: globalObject,
	    getNativePromise: getNativePromise,
	    domainBind: domainBind
	};
	ret.isRecentNode = ret.isNode && (function() {
	    var version = process.versions.node.split(".").map(Number);
	    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
	})();

	if (ret.isNode) ret.toFastProperties(process);

	try {throw new Error(); } catch (e) {ret.lastLineError = e;}
	var util = ret;

	var schedule;
	var noAsyncScheduler = function() {
	    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var NativePromise = util.getNativePromise();
	if (util.isNode && typeof MutationObserver === "undefined") {
	    var GlobalSetImmediate = commonjsGlobal.setImmediate;
	    var ProcessNextTick = process.nextTick;
	    schedule = util.isRecentNode
	                ? function(fn) { GlobalSetImmediate.call(commonjsGlobal, fn); }
	                : function(fn) { ProcessNextTick.call(process, fn); };
	} else if (typeof NativePromise === "function" &&
	           typeof NativePromise.resolve === "function") {
	    var nativePromise = NativePromise.resolve();
	    schedule = function(fn) {
	        nativePromise.then(fn);
	    };
	} else if ((typeof MutationObserver !== "undefined") &&
	          !(typeof window !== "undefined" &&
	            window.navigator &&
	            (window.navigator.standalone || window.cordova))) {
	    schedule = (function() {
	        var div = document.createElement("div");
	        var opts = {attributes: true};
	        var toggleScheduled = false;
	        var div2 = document.createElement("div");
	        var o2 = new MutationObserver(function() {
	            div.classList.toggle("foo");
	            toggleScheduled = false;
	        });
	        o2.observe(div2, opts);

	        var scheduleToggle = function() {
	            if (toggleScheduled) return;
	            toggleScheduled = true;
	            div2.classList.toggle("foo");
	        };

	        return function schedule(fn) {
	            var o = new MutationObserver(function() {
	                o.disconnect();
	                fn();
	            });
	            o.observe(div, opts);
	            scheduleToggle();
	        };
	    })();
	} else if (typeof setImmediate !== "undefined") {
	    schedule = function (fn) {
	        setImmediate(fn);
	    };
	} else if (typeof setTimeout !== "undefined") {
	    schedule = function (fn) {
	        setTimeout(fn, 0);
	    };
	} else {
	    schedule = noAsyncScheduler;
	}
	var schedule_1 = schedule;

	function arrayMove(src, srcIndex, dst, dstIndex, len) {
	    for (var j = 0; j < len; ++j) {
	        dst[j + dstIndex] = src[j + srcIndex];
	        src[j + srcIndex] = void 0;
	    }
	}

	function Queue(capacity) {
	    this._capacity = capacity;
	    this._length = 0;
	    this._front = 0;
	}

	Queue.prototype._willBeOverCapacity = function (size) {
	    return this._capacity < size;
	};

	Queue.prototype._pushOne = function (arg) {
	    var length = this.length();
	    this._checkCapacity(length + 1);
	    var i = (this._front + length) & (this._capacity - 1);
	    this[i] = arg;
	    this._length = length + 1;
	};

	Queue.prototype.push = function (fn, receiver, arg) {
	    var length = this.length() + 3;
	    if (this._willBeOverCapacity(length)) {
	        this._pushOne(fn);
	        this._pushOne(receiver);
	        this._pushOne(arg);
	        return;
	    }
	    var j = this._front + length - 3;
	    this._checkCapacity(length);
	    var wrapMask = this._capacity - 1;
	    this[(j + 0) & wrapMask] = fn;
	    this[(j + 1) & wrapMask] = receiver;
	    this[(j + 2) & wrapMask] = arg;
	    this._length = length;
	};

	Queue.prototype.shift = function () {
	    var front = this._front,
	        ret = this[front];

	    this[front] = undefined;
	    this._front = (front + 1) & (this._capacity - 1);
	    this._length--;
	    return ret;
	};

	Queue.prototype.length = function () {
	    return this._length;
	};

	Queue.prototype._checkCapacity = function (size) {
	    if (this._capacity < size) {
	        this._resizeTo(this._capacity << 1);
	    }
	};

	Queue.prototype._resizeTo = function (capacity) {
	    var oldCapacity = this._capacity;
	    this._capacity = capacity;
	    var front = this._front;
	    var length = this._length;
	    var moveItemsCount = (front + length) & (oldCapacity - 1);
	    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
	};

	var queue = Queue;

	var firstLineError;
	try {throw new Error(); } catch (e) {firstLineError = e;}




	function Async() {
	    this._customScheduler = false;
	    this._isTickUsed = false;
	    this._lateQueue = new queue(16);
	    this._normalQueue = new queue(16);
	    this._haveDrainedQueues = false;
	    this._trampolineEnabled = true;
	    var self = this;
	    this.drainQueues = function () {
	        self._drainQueues();
	    };
	    this._schedule = schedule_1;
	}

	Async.prototype.setScheduler = function(fn) {
	    var prev = this._schedule;
	    this._schedule = fn;
	    this._customScheduler = true;
	    return prev;
	};

	Async.prototype.hasCustomScheduler = function() {
	    return this._customScheduler;
	};

	Async.prototype.enableTrampoline = function() {
	    this._trampolineEnabled = true;
	};

	Async.prototype.disableTrampolineIfNecessary = function() {
	    if (util.hasDevTools) {
	        this._trampolineEnabled = false;
	    }
	};

	Async.prototype.haveItemsQueued = function () {
	    return this._isTickUsed || this._haveDrainedQueues;
	};


	Async.prototype.fatalError = function(e, isNode) {
	    if (isNode) {
	        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
	            "\n");
	        process.exit(2);
	    } else {
	        this.throwLater(e);
	    }
	};

	Async.prototype.throwLater = function(fn, arg) {
	    if (arguments.length === 1) {
	        arg = fn;
	        fn = function () { throw arg; };
	    }
	    if (typeof setTimeout !== "undefined") {
	        setTimeout(function() {
	            fn(arg);
	        }, 0);
	    } else try {
	        this._schedule(function() {
	            fn(arg);
	        });
	    } catch (e) {
	        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	};

	function AsyncInvokeLater(fn, receiver, arg) {
	    this._lateQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncInvoke(fn, receiver, arg) {
	    this._normalQueue.push(fn, receiver, arg);
	    this._queueTick();
	}

	function AsyncSettlePromises(promise) {
	    this._normalQueue._pushOne(promise);
	    this._queueTick();
	}

	if (!util.hasDevTools) {
	    Async.prototype.invokeLater = AsyncInvokeLater;
	    Async.prototype.invoke = AsyncInvoke;
	    Async.prototype.settlePromises = AsyncSettlePromises;
	} else {
	    Async.prototype.invokeLater = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvokeLater.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                setTimeout(function() {
	                    fn.call(receiver, arg);
	                }, 100);
	            });
	        }
	    };

	    Async.prototype.invoke = function (fn, receiver, arg) {
	        if (this._trampolineEnabled) {
	            AsyncInvoke.call(this, fn, receiver, arg);
	        } else {
	            this._schedule(function() {
	                fn.call(receiver, arg);
	            });
	        }
	    };

	    Async.prototype.settlePromises = function(promise) {
	        if (this._trampolineEnabled) {
	            AsyncSettlePromises.call(this, promise);
	        } else {
	            this._schedule(function() {
	                promise._settlePromises();
	            });
	        }
	    };
	}

	Async.prototype._drainQueue = function(queue$$1) {
	    while (queue$$1.length() > 0) {
	        var fn = queue$$1.shift();
	        if (typeof fn !== "function") {
	            fn._settlePromises();
	            continue;
	        }
	        var receiver = queue$$1.shift();
	        var arg = queue$$1.shift();
	        fn.call(receiver, arg);
	    }
	};

	Async.prototype._drainQueues = function () {
	    this._drainQueue(this._normalQueue);
	    this._reset();
	    this._haveDrainedQueues = true;
	    this._drainQueue(this._lateQueue);
	};

	Async.prototype._queueTick = function () {
	    if (!this._isTickUsed) {
	        this._isTickUsed = true;
	        this._schedule(this.drainQueues);
	    }
	};

	Async.prototype._reset = function () {
	    this._isTickUsed = false;
	};

	var async = Async;
	var firstLineError_1 = firstLineError;

	async.firstLineError = firstLineError_1;

	var Objectfreeze = es5.freeze;

	var inherits$1 = util.inherits;
	var notEnumerableProp$1 = util.notEnumerableProp;

	function subError(nameProperty, defaultMessage) {
	    function SubError(message) {
	        if (!(this instanceof SubError)) return new SubError(message);
	        notEnumerableProp$1(this, "message",
	            typeof message === "string" ? message : defaultMessage);
	        notEnumerableProp$1(this, "name", nameProperty);
	        if (Error.captureStackTrace) {
	            Error.captureStackTrace(this, this.constructor);
	        } else {
	            Error.call(this);
	        }
	    }
	    inherits$1(SubError, Error);
	    return SubError;
	}

	var _TypeError;
	var _RangeError;
	var Warning = subError("Warning", "warning");
	var CancellationError = subError("CancellationError", "cancellation error");
	var TimeoutError = subError("TimeoutError", "timeout error");
	var AggregateError = subError("AggregateError", "aggregate error");
	try {
	    _TypeError = TypeError;
	    _RangeError = RangeError;
	} catch(e) {
	    _TypeError = subError("TypeError", "type error");
	    _RangeError = subError("RangeError", "range error");
	}

	var methods = ("join pop push shift unshift slice filter forEach some " +
	    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

	for (var i = 0; i < methods.length; ++i) {
	    if (typeof Array.prototype[methods[i]] === "function") {
	        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
	    }
	}

	es5.defineProperty(AggregateError.prototype, "length", {
	    value: 0,
	    configurable: false,
	    writable: true,
	    enumerable: true
	});
	AggregateError.prototype["isOperational"] = true;
	var level = 0;
	AggregateError.prototype.toString = function() {
	    var indent = Array(level * 4 + 1).join(" ");
	    var ret = "\n" + indent + "AggregateError of:" + "\n";
	    level++;
	    indent = Array(level * 4 + 1).join(" ");
	    for (var i = 0; i < this.length; ++i) {
	        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
	        var lines = str.split("\n");
	        for (var j = 0; j < lines.length; ++j) {
	            lines[j] = indent + lines[j];
	        }
	        str = lines.join("\n");
	        ret += str + "\n";
	    }
	    level--;
	    return ret;
	};

	function OperationalError(message) {
	    if (!(this instanceof OperationalError))
	        return new OperationalError(message);
	    notEnumerableProp$1(this, "name", "OperationalError");
	    notEnumerableProp$1(this, "message", message);
	    this.cause = message;
	    this["isOperational"] = true;

	    if (message instanceof Error) {
	        notEnumerableProp$1(this, "message", message.message);
	        notEnumerableProp$1(this, "stack", message.stack);
	    } else if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, this.constructor);
	    }

	}
	inherits$1(OperationalError, Error);

	var errorTypes = Error["__BluebirdErrorTypes__"];
	if (!errorTypes) {
	    errorTypes = Objectfreeze({
	        CancellationError: CancellationError,
	        TimeoutError: TimeoutError,
	        OperationalError: OperationalError,
	        RejectionError: OperationalError,
	        AggregateError: AggregateError
	    });
	    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
	        value: errorTypes,
	        writable: false,
	        enumerable: false,
	        configurable: false
	    });
	}

	var errors = {
	    Error: Error,
	    TypeError: _TypeError,
	    RangeError: _RangeError,
	    CancellationError: errorTypes.CancellationError,
	    OperationalError: errorTypes.OperationalError,
	    TimeoutError: errorTypes.TimeoutError,
	    AggregateError: errorTypes.AggregateError,
	    Warning: Warning
	};

	var thenables = function(Promise, INTERNAL) {
	var util$$2 = util;
	var errorObj = util$$2.errorObj;
	var isObject = util$$2.isObject;

	function tryConvertToPromise(obj, context) {
	    if (isObject(obj)) {
	        if (obj instanceof Promise) return obj;
	        var then = getThen(obj);
	        if (then === errorObj) {
	            if (context) context._pushContext();
	            var ret = Promise.reject(then.e);
	            if (context) context._popContext();
	            return ret;
	        } else if (typeof then === "function") {
	            if (isAnyBluebirdPromise(obj)) {
	                var ret = new Promise(INTERNAL);
	                obj._then(
	                    ret._fulfill,
	                    ret._reject,
	                    undefined,
	                    ret,
	                    null
	                );
	                return ret;
	            }
	            return doThenable(obj, then, context);
	        }
	    }
	    return obj;
	}

	function doGetThen(obj) {
	    return obj.then;
	}

	function getThen(obj) {
	    try {
	        return doGetThen(obj);
	    } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	    }
	}

	var hasProp = {}.hasOwnProperty;
	function isAnyBluebirdPromise(obj) {
	    try {
	        return hasProp.call(obj, "_promise0");
	    } catch (e) {
	        return false;
	    }
	}

	function doThenable(x, then, context) {
	    var promise = new Promise(INTERNAL);
	    var ret = promise;
	    if (context) context._pushContext();
	    promise._captureStackTrace();
	    if (context) context._popContext();
	    var synchronous = true;
	    var result = util$$2.tryCatch(then).call(x, resolve, reject);
	    synchronous = false;

	    if (promise && result === errorObj) {
	        promise._rejectCallback(result.e, true, true);
	        promise = null;
	    }

	    function resolve(value) {
	        if (!promise) return;
	        promise._resolveCallback(value);
	        promise = null;
	    }

	    function reject(reason) {
	        if (!promise) return;
	        promise._rejectCallback(reason, synchronous, true);
	        promise = null;
	    }
	    return ret;
	}

	return tryConvertToPromise;
	};

	var promise_array = function(Promise, INTERNAL, tryConvertToPromise,
	    apiRejection, Proxyable) {
	var util$$2 = util;
	var isArray = util$$2.isArray;

	function toResolutionValue(val) {
	    switch(val) {
	    case -2: return [];
	    case -3: return {};
	    case -6: return new Map();
	    }
	}

	function PromiseArray(values) {
	    var promise = this._promise = new Promise(INTERNAL);
	    if (values instanceof Promise) {
	        promise._propagateFrom(values, 3);
	    }
	    promise._setOnCancel(this);
	    this._values = values;
	    this._length = 0;
	    this._totalResolved = 0;
	    this._init(undefined, -2);
	}
	util$$2.inherits(PromiseArray, Proxyable);

	PromiseArray.prototype.length = function () {
	    return this._length;
	};

	PromiseArray.prototype.promise = function () {
	    return this._promise;
	};

	PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
	    var values = tryConvertToPromise(this._values, this._promise);
	    if (values instanceof Promise) {
	        values = values._target();
	        var bitField = values._bitField;
	        
	        this._values = values;

	        if (((bitField & 50397184) === 0)) {
	            this._promise._setAsyncGuaranteed();
	            return values._then(
	                init,
	                this._reject,
	                undefined,
	                this,
	                resolveValueIfEmpty
	           );
	        } else if (((bitField & 33554432) !== 0)) {
	            values = values._value();
	        } else if (((bitField & 16777216) !== 0)) {
	            return this._reject(values._reason());
	        } else {
	            return this._cancel();
	        }
	    }
	    values = util$$2.asArray(values);
	    if (values === null) {
	        var err = apiRejection(
	            "expecting an array or an iterable object but got " + util$$2.classString(values)).reason();
	        this._promise._rejectCallback(err, false);
	        return;
	    }

	    if (values.length === 0) {
	        if (resolveValueIfEmpty === -5) {
	            this._resolveEmptyArray();
	        }
	        else {
	            this._resolve(toResolutionValue(resolveValueIfEmpty));
	        }
	        return;
	    }
	    this._iterate(values);
	};

	PromiseArray.prototype._iterate = function(values) {
	    var len = this.getActualLength(values.length);
	    this._length = len;
	    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
	    var result = this._promise;
	    var isResolved = false;
	    var bitField = null;
	    for (var i = 0; i < len; ++i) {
	        var maybePromise = tryConvertToPromise(values[i], result);

	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            bitField = maybePromise._bitField;
	        } else {
	            bitField = null;
	        }

	        if (isResolved) {
	            if (bitField !== null) {
	                maybePromise.suppressUnhandledRejections();
	            }
	        } else if (bitField !== null) {
	            if (((bitField & 50397184) === 0)) {
	                maybePromise._proxy(this, i);
	                this._values[i] = maybePromise;
	            } else if (((bitField & 33554432) !== 0)) {
	                isResolved = this._promiseFulfilled(maybePromise._value(), i);
	            } else if (((bitField & 16777216) !== 0)) {
	                isResolved = this._promiseRejected(maybePromise._reason(), i);
	            } else {
	                isResolved = this._promiseCancelled(i);
	            }
	        } else {
	            isResolved = this._promiseFulfilled(maybePromise, i);
	        }
	    }
	    if (!isResolved) result._setAsyncGuaranteed();
	};

	PromiseArray.prototype._isResolved = function () {
	    return this._values === null;
	};

	PromiseArray.prototype._resolve = function (value) {
	    this._values = null;
	    this._promise._fulfill(value);
	};

	PromiseArray.prototype._cancel = function() {
	    if (this._isResolved() || !this._promise._isCancellable()) return;
	    this._values = null;
	    this._promise._cancel();
	};

	PromiseArray.prototype._reject = function (reason) {
	    this._values = null;
	    this._promise._rejectCallback(reason, false);
	};

	PromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	PromiseArray.prototype._promiseCancelled = function() {
	    this._cancel();
	    return true;
	};

	PromiseArray.prototype._promiseRejected = function (reason) {
	    this._totalResolved++;
	    this._reject(reason);
	    return true;
	};

	PromiseArray.prototype._resultCancelled = function() {
	    if (this._isResolved()) return;
	    var values = this._values;
	    this._cancel();
	    if (values instanceof Promise) {
	        values.cancel();
	    } else {
	        for (var i = 0; i < values.length; ++i) {
	            if (values[i] instanceof Promise) {
	                values[i].cancel();
	            }
	        }
	    }
	};

	PromiseArray.prototype.shouldCopyValues = function () {
	    return true;
	};

	PromiseArray.prototype.getActualLength = function (len) {
	    return len;
	};

	return PromiseArray;
	};

	var context = function(Promise) {
	var longStackTraces = false;
	var contextStack = [];

	Promise.prototype._promiseCreated = function() {};
	Promise.prototype._pushContext = function() {};
	Promise.prototype._popContext = function() {return null;};
	Promise._peekContext = Promise.prototype._peekContext = function() {};

	function Context() {
	    this._trace = new Context.CapturedTrace(peekContext());
	}
	Context.prototype._pushContext = function () {
	    if (this._trace !== undefined) {
	        this._trace._promiseCreated = null;
	        contextStack.push(this._trace);
	    }
	};

	Context.prototype._popContext = function () {
	    if (this._trace !== undefined) {
	        var trace = contextStack.pop();
	        var ret = trace._promiseCreated;
	        trace._promiseCreated = null;
	        return ret;
	    }
	    return null;
	};

	function createContext() {
	    if (longStackTraces) return new Context();
	}

	function peekContext() {
	    var lastIndex = contextStack.length - 1;
	    if (lastIndex >= 0) {
	        return contextStack[lastIndex];
	    }
	    return undefined;
	}
	Context.CapturedTrace = null;
	Context.create = createContext;
	Context.deactivateLongStackTraces = function() {};
	Context.activateLongStackTraces = function() {
	    var Promise_pushContext = Promise.prototype._pushContext;
	    var Promise_popContext = Promise.prototype._popContext;
	    var Promise_PeekContext = Promise._peekContext;
	    var Promise_peekContext = Promise.prototype._peekContext;
	    var Promise_promiseCreated = Promise.prototype._promiseCreated;
	    Context.deactivateLongStackTraces = function() {
	        Promise.prototype._pushContext = Promise_pushContext;
	        Promise.prototype._popContext = Promise_popContext;
	        Promise._peekContext = Promise_PeekContext;
	        Promise.prototype._peekContext = Promise_peekContext;
	        Promise.prototype._promiseCreated = Promise_promiseCreated;
	        longStackTraces = false;
	    };
	    longStackTraces = true;
	    Promise.prototype._pushContext = Context.prototype._pushContext;
	    Promise.prototype._popContext = Context.prototype._popContext;
	    Promise._peekContext = Promise.prototype._peekContext = peekContext;
	    Promise.prototype._promiseCreated = function() {
	        var ctx = this._peekContext();
	        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
	    };
	};
	return Context;
	};

	var debuggability = function(Promise, Context) {
	var getDomain = Promise._getDomain;
	var async = Promise._async;
	var Warning = errors.Warning;
	var util$$2 = util;
	var canAttachTrace = util$$2.canAttachTrace;
	var unhandledRejectionHandled;
	var possiblyUnhandledRejection;
	var bluebirdFramePattern =
	    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
	var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
	var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
	var stackFramePattern = null;
	var formatStack = null;
	var indentStackFrames = false;
	var printWarning;
	var debugging = !!(util$$2.env("BLUEBIRD_DEBUG") != 0 &&
	                        (false ||
	                         util$$2.env("BLUEBIRD_DEBUG") ||
	                         util$$2.env("NODE_ENV") === "development"));

	var warnings = !!(util$$2.env("BLUEBIRD_WARNINGS") != 0 &&
	    (debugging || util$$2.env("BLUEBIRD_WARNINGS")));

	var longStackTraces = !!(util$$2.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
	    (debugging || util$$2.env("BLUEBIRD_LONG_STACK_TRACES")));

	var wForgottenReturn = util$$2.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
	    (warnings || !!util$$2.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

	Promise.prototype.suppressUnhandledRejections = function() {
	    var target = this._target();
	    target._bitField = ((target._bitField & (~1048576)) |
	                      524288);
	};

	Promise.prototype._ensurePossibleRejectionHandled = function () {
	    if ((this._bitField & 524288) !== 0) return;
	    this._setRejectionIsUnhandled();
	    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
	};

	Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
	    fireRejectionEvent("rejectionHandled",
	                                  unhandledRejectionHandled, undefined, this);
	};

	Promise.prototype._setReturnedNonUndefined = function() {
	    this._bitField = this._bitField | 268435456;
	};

	Promise.prototype._returnedNonUndefined = function() {
	    return (this._bitField & 268435456) !== 0;
	};

	Promise.prototype._notifyUnhandledRejection = function () {
	    if (this._isRejectionUnhandled()) {
	        var reason = this._settledValue();
	        this._setUnhandledRejectionIsNotified();
	        fireRejectionEvent("unhandledRejection",
	                                      possiblyUnhandledRejection, reason, this);
	    }
	};

	Promise.prototype._setUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField | 262144;
	};

	Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
	    this._bitField = this._bitField & (~262144);
	};

	Promise.prototype._isUnhandledRejectionNotified = function () {
	    return (this._bitField & 262144) > 0;
	};

	Promise.prototype._setRejectionIsUnhandled = function () {
	    this._bitField = this._bitField | 1048576;
	};

	Promise.prototype._unsetRejectionIsUnhandled = function () {
	    this._bitField = this._bitField & (~1048576);
	    if (this._isUnhandledRejectionNotified()) {
	        this._unsetUnhandledRejectionIsNotified();
	        this._notifyUnhandledRejectionIsHandled();
	    }
	};

	Promise.prototype._isRejectionUnhandled = function () {
	    return (this._bitField & 1048576) > 0;
	};

	Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
	    return warn(message, shouldUseOwnTrace, promise || this);
	};

	Promise.onPossiblyUnhandledRejection = function (fn) {
	    var domain = getDomain();
	    possiblyUnhandledRejection =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util$$2.domainBind(domain, fn))
	                                 : undefined;
	};

	Promise.onUnhandledRejectionHandled = function (fn) {
	    var domain = getDomain();
	    unhandledRejectionHandled =
	        typeof fn === "function" ? (domain === null ?
	                                            fn : util$$2.domainBind(domain, fn))
	                                 : undefined;
	};

	var disableLongStackTraces = function() {};
	Promise.longStackTraces = function () {
	    if (async.haveItemsQueued() && !config.longStackTraces) {
	        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (!config.longStackTraces && longStackTracesIsSupported()) {
	        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
	        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
	        config.longStackTraces = true;
	        disableLongStackTraces = function() {
	            if (async.haveItemsQueued() && !config.longStackTraces) {
	                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	            }
	            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
	            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
	            Context.deactivateLongStackTraces();
	            async.enableTrampoline();
	            config.longStackTraces = false;
	        };
	        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
	        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
	        Context.activateLongStackTraces();
	        async.disableTrampolineIfNecessary();
	    }
	};

	Promise.hasLongStackTraces = function () {
	    return config.longStackTraces && longStackTracesIsSupported();
	};

	var fireDomEvent = (function() {
	    try {
	        if (typeof CustomEvent === "function") {
	            var event = new CustomEvent("CustomEvent");
	            util$$2.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new CustomEvent(name.toLowerCase(), {
	                    detail: event,
	                    cancelable: true
	                });
	                return !util$$2.global.dispatchEvent(domEvent);
	            };
	        } else if (typeof Event === "function") {
	            var event = new Event("CustomEvent");
	            util$$2.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = new Event(name.toLowerCase(), {
	                    cancelable: true
	                });
	                domEvent.detail = event;
	                return !util$$2.global.dispatchEvent(domEvent);
	            };
	        } else {
	            var event = document.createEvent("CustomEvent");
	            event.initCustomEvent("testingtheevent", false, true, {});
	            util$$2.global.dispatchEvent(event);
	            return function(name, event) {
	                var domEvent = document.createEvent("CustomEvent");
	                domEvent.initCustomEvent(name.toLowerCase(), false, true,
	                    event);
	                return !util$$2.global.dispatchEvent(domEvent);
	            };
	        }
	    } catch (e) {}
	    return function() {
	        return false;
	    };
	})();

	var fireGlobalEvent = (function() {
	    if (util$$2.isNode) {
	        return function() {
	            return process.emit.apply(process, arguments);
	        };
	    } else {
	        if (!util$$2.global) {
	            return function() {
	                return false;
	            };
	        }
	        return function(name) {
	            var methodName = "on" + name.toLowerCase();
	            var method = util$$2.global[methodName];
	            if (!method) return false;
	            method.apply(util$$2.global, [].slice.call(arguments, 1));
	            return true;
	        };
	    }
	})();

	function generatePromiseLifecycleEventObject(name, promise) {
	    return {promise: promise};
	}

	var eventToObjectGenerator = {
	    promiseCreated: generatePromiseLifecycleEventObject,
	    promiseFulfilled: generatePromiseLifecycleEventObject,
	    promiseRejected: generatePromiseLifecycleEventObject,
	    promiseResolved: generatePromiseLifecycleEventObject,
	    promiseCancelled: generatePromiseLifecycleEventObject,
	    promiseChained: function(name, promise, child) {
	        return {promise: promise, child: child};
	    },
	    warning: function(name, warning) {
	        return {warning: warning};
	    },
	    unhandledRejection: function (name, reason, promise) {
	        return {reason: reason, promise: promise};
	    },
	    rejectionHandled: generatePromiseLifecycleEventObject
	};

	var activeFireEvent = function (name) {
	    var globalEventFired = false;
	    try {
	        globalEventFired = fireGlobalEvent.apply(null, arguments);
	    } catch (e) {
	        async.throwLater(e);
	        globalEventFired = true;
	    }

	    var domEventFired = false;
	    try {
	        domEventFired = fireDomEvent(name,
	                    eventToObjectGenerator[name].apply(null, arguments));
	    } catch (e) {
	        async.throwLater(e);
	        domEventFired = true;
	    }

	    return domEventFired || globalEventFired;
	};

	Promise.config = function(opts) {
	    opts = Object(opts);
	    if ("longStackTraces" in opts) {
	        if (opts.longStackTraces) {
	            Promise.longStackTraces();
	        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
	            disableLongStackTraces();
	        }
	    }
	    if ("warnings" in opts) {
	        var warningsOption = opts.warnings;
	        config.warnings = !!warningsOption;
	        wForgottenReturn = config.warnings;

	        if (util$$2.isObject(warningsOption)) {
	            if ("wForgottenReturn" in warningsOption) {
	                wForgottenReturn = !!warningsOption.wForgottenReturn;
	            }
	        }
	    }
	    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
	        if (async.haveItemsQueued()) {
	            throw new Error(
	                "cannot enable cancellation after promises are in use");
	        }
	        Promise.prototype._clearCancellationData =
	            cancellationClearCancellationData;
	        Promise.prototype._propagateFrom = cancellationPropagateFrom;
	        Promise.prototype._onCancel = cancellationOnCancel;
	        Promise.prototype._setOnCancel = cancellationSetOnCancel;
	        Promise.prototype._attachCancellationCallback =
	            cancellationAttachCancellationCallback;
	        Promise.prototype._execute = cancellationExecute;
	        propagateFromFunction = cancellationPropagateFrom;
	        config.cancellation = true;
	    }
	    if ("monitoring" in opts) {
	        if (opts.monitoring && !config.monitoring) {
	            config.monitoring = true;
	            Promise.prototype._fireEvent = activeFireEvent;
	        } else if (!opts.monitoring && config.monitoring) {
	            config.monitoring = false;
	            Promise.prototype._fireEvent = defaultFireEvent;
	        }
	    }
	    return Promise;
	};

	function defaultFireEvent() { return false; }

	Promise.prototype._fireEvent = defaultFireEvent;
	Promise.prototype._execute = function(executor, resolve, reject) {
	    try {
	        executor(resolve, reject);
	    } catch (e) {
	        return e;
	    }
	};
	Promise.prototype._onCancel = function () {};
	Promise.prototype._setOnCancel = function (handler) {  };
	Promise.prototype._attachCancellationCallback = function(onCancel) {
	    
	};
	Promise.prototype._captureStackTrace = function () {};
	Promise.prototype._attachExtraTrace = function () {};
	Promise.prototype._clearCancellationData = function() {};
	Promise.prototype._propagateFrom = function (parent, flags) {
	    
	    
	};

	function cancellationExecute(executor, resolve, reject) {
	    var promise = this;
	    try {
	        executor(resolve, reject, function(onCancel) {
	            if (typeof onCancel !== "function") {
	                throw new TypeError("onCancel must be a function, got: " +
	                                    util$$2.toString(onCancel));
	            }
	            promise._attachCancellationCallback(onCancel);
	        });
	    } catch (e) {
	        return e;
	    }
	}

	function cancellationAttachCancellationCallback(onCancel) {
	    if (!this._isCancellable()) return this;

	    var previousOnCancel = this._onCancel();
	    if (previousOnCancel !== undefined) {
	        if (util$$2.isArray(previousOnCancel)) {
	            previousOnCancel.push(onCancel);
	        } else {
	            this._setOnCancel([previousOnCancel, onCancel]);
	        }
	    } else {
	        this._setOnCancel(onCancel);
	    }
	}

	function cancellationOnCancel() {
	    return this._onCancelField;
	}

	function cancellationSetOnCancel(onCancel) {
	    this._onCancelField = onCancel;
	}

	function cancellationClearCancellationData() {
	    this._cancellationParent = undefined;
	    this._onCancelField = undefined;
	}

	function cancellationPropagateFrom(parent, flags) {
	    if ((flags & 1) !== 0) {
	        this._cancellationParent = parent;
	        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
	        if (branchesRemainingToCancel === undefined) {
	            branchesRemainingToCancel = 0;
	        }
	        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
	    }
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}

	function bindingPropagateFrom(parent, flags) {
	    if ((flags & 2) !== 0 && parent._isBound()) {
	        this._setBoundTo(parent._boundTo);
	    }
	}
	var propagateFromFunction = bindingPropagateFrom;

	function boundValueFunction() {
	    var ret = this._boundTo;
	    if (ret !== undefined) {
	        if (ret instanceof Promise) {
	            if (ret.isFulfilled()) {
	                return ret.value();
	            } else {
	                return undefined;
	            }
	        }
	    }
	    return ret;
	}

	function longStackTracesCaptureStackTrace() {
	    this._trace = new CapturedTrace(this._peekContext());
	}

	function longStackTracesAttachExtraTrace(error, ignoreSelf) {
	    if (canAttachTrace(error)) {
	        var trace = this._trace;
	        if (trace !== undefined) {
	            if (ignoreSelf) trace = trace._parent;
	        }
	        if (trace !== undefined) {
	            trace.attachExtraTrace(error);
	        } else if (!error.__stackCleaned__) {
	            var parsed = parseStackAndMessage(error);
	            util$$2.notEnumerableProp(error, "stack",
	                parsed.message + "\n" + parsed.stack.join("\n"));
	            util$$2.notEnumerableProp(error, "__stackCleaned__", true);
	        }
	    }
	}

	function checkForgottenReturns(returnValue, promiseCreated, name, promise,
	                               parent) {
	    if (returnValue === undefined && promiseCreated !== null &&
	        wForgottenReturn) {
	        if (parent !== undefined && parent._returnedNonUndefined()) return;
	        if ((promise._bitField & 65535) === 0) return;

	        if (name) name = name + " ";
	        var handlerLine = "";
	        var creatorLine = "";
	        if (promiseCreated._trace) {
	            var traceLines = promiseCreated._trace.stack.split("\n");
	            var stack = cleanStack(traceLines);
	            for (var i = stack.length - 1; i >= 0; --i) {
	                var line = stack[i];
	                if (!nodeFramePattern.test(line)) {
	                    var lineMatches = line.match(parseLinePattern);
	                    if (lineMatches) {
	                        handlerLine  = "at " + lineMatches[1] +
	                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
	                    }
	                    break;
	                }
	            }

	            if (stack.length > 0) {
	                var firstUserLine = stack[0];
	                for (var i = 0; i < traceLines.length; ++i) {

	                    if (traceLines[i] === firstUserLine) {
	                        if (i > 0) {
	                            creatorLine = "\n" + traceLines[i - 1];
	                        }
	                        break;
	                    }
	                }

	            }
	        }
	        var msg = "a promise was created in a " + name +
	            "handler " + handlerLine + "but was not returned from it, " +
	            "see http://goo.gl/rRqMUw" +
	            creatorLine;
	        promise._warn(msg, true, promiseCreated);
	    }
	}

	function deprecated(name, replacement) {
	    var message = name +
	        " is deprecated and will be removed in a future version.";
	    if (replacement) message += " Use " + replacement + " instead.";
	    return warn(message);
	}

	function warn(message, shouldUseOwnTrace, promise) {
	    if (!config.warnings) return;
	    var warning = new Warning(message);
	    var ctx;
	    if (shouldUseOwnTrace) {
	        promise._attachExtraTrace(warning);
	    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
	        ctx.attachExtraTrace(warning);
	    } else {
	        var parsed = parseStackAndMessage(warning);
	        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
	    }

	    if (!activeFireEvent("warning", warning)) {
	        formatAndLogError(warning, "", true);
	    }
	}

	function reconstructStack(message, stacks) {
	    for (var i = 0; i < stacks.length - 1; ++i) {
	        stacks[i].push("From previous event:");
	        stacks[i] = stacks[i].join("\n");
	    }
	    if (i < stacks.length) {
	        stacks[i] = stacks[i].join("\n");
	    }
	    return message + "\n" + stacks.join("\n");
	}

	function removeDuplicateOrEmptyJumps(stacks) {
	    for (var i = 0; i < stacks.length; ++i) {
	        if (stacks[i].length === 0 ||
	            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
	            stacks.splice(i, 1);
	            i--;
	        }
	    }
	}

	function removeCommonRoots(stacks) {
	    var current = stacks[0];
	    for (var i = 1; i < stacks.length; ++i) {
	        var prev = stacks[i];
	        var currentLastIndex = current.length - 1;
	        var currentLastLine = current[currentLastIndex];
	        var commonRootMeetPoint = -1;

	        for (var j = prev.length - 1; j >= 0; --j) {
	            if (prev[j] === currentLastLine) {
	                commonRootMeetPoint = j;
	                break;
	            }
	        }

	        for (var j = commonRootMeetPoint; j >= 0; --j) {
	            var line = prev[j];
	            if (current[currentLastIndex] === line) {
	                current.pop();
	                currentLastIndex--;
	            } else {
	                break;
	            }
	        }
	        current = prev;
	    }
	}

	function cleanStack(stack) {
	    var ret = [];
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        var isTraceLine = "    (No stack trace)" === line ||
	            stackFramePattern.test(line);
	        var isInternalFrame = isTraceLine && shouldIgnore(line);
	        if (isTraceLine && !isInternalFrame) {
	            if (indentStackFrames && line.charAt(0) !== " ") {
	                line = "    " + line;
	            }
	            ret.push(line);
	        }
	    }
	    return ret;
	}

	function stackFramesAsArray(error) {
	    var stack = error.stack.replace(/\s+$/g, "").split("\n");
	    for (var i = 0; i < stack.length; ++i) {
	        var line = stack[i];
	        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
	            break;
	        }
	    }
	    if (i > 0 && error.name != "SyntaxError") {
	        stack = stack.slice(i);
	    }
	    return stack;
	}

	function parseStackAndMessage(error) {
	    var stack = error.stack;
	    var message = error.toString();
	    stack = typeof stack === "string" && stack.length > 0
	                ? stackFramesAsArray(error) : ["    (No stack trace)"];
	    return {
	        message: message,
	        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
	    };
	}

	function formatAndLogError(error, title, isSoft) {
	    if (typeof console !== "undefined") {
	        var message;
	        if (util$$2.isObject(error)) {
	            var stack = error.stack;
	            message = title + formatStack(stack, error);
	        } else {
	            message = title + String(error);
	        }
	        if (typeof printWarning === "function") {
	            printWarning(message, isSoft);
	        } else if (typeof console.log === "function" ||
	            typeof console.log === "object") {
	            console.log(message);
	        }
	    }
	}

	function fireRejectionEvent(name, localHandler, reason, promise) {
	    var localEventFired = false;
	    try {
	        if (typeof localHandler === "function") {
	            localEventFired = true;
	            if (name === "rejectionHandled") {
	                localHandler(promise);
	            } else {
	                localHandler(reason, promise);
	            }
	        }
	    } catch (e) {
	        async.throwLater(e);
	    }

	    if (name === "unhandledRejection") {
	        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
	            formatAndLogError(reason, "Unhandled rejection ");
	        }
	    } else {
	        activeFireEvent(name, promise);
	    }
	}

	function formatNonError(obj) {
	    var str;
	    if (typeof obj === "function") {
	        str = "[function " +
	            (obj.name || "anonymous") +
	            "]";
	    } else {
	        str = obj && typeof obj.toString === "function"
	            ? obj.toString() : util$$2.toString(obj);
	        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
	        if (ruselessToString.test(str)) {
	            try {
	                var newStr = JSON.stringify(obj);
	                str = newStr;
	            }
	            catch(e) {

	            }
	        }
	        if (str.length === 0) {
	            str = "(empty array)";
	        }
	    }
	    return ("(<" + snip(str) + ">, no stack trace)");
	}

	function snip(str) {
	    var maxChars = 41;
	    if (str.length < maxChars) {
	        return str;
	    }
	    return str.substr(0, maxChars - 3) + "...";
	}

	function longStackTracesIsSupported() {
	    return typeof captureStackTrace === "function";
	}

	var shouldIgnore = function() { return false; };
	var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
	function parseLineInfo(line) {
	    var matches = line.match(parseLineInfoRegex);
	    if (matches) {
	        return {
	            fileName: matches[1],
	            line: parseInt(matches[2], 10)
	        };
	    }
	}

	function setBounds(firstLineError, lastLineError) {
	    if (!longStackTracesIsSupported()) return;
	    var firstStackLines = firstLineError.stack.split("\n");
	    var lastStackLines = lastLineError.stack.split("\n");
	    var firstIndex = -1;
	    var lastIndex = -1;
	    var firstFileName;
	    var lastFileName;
	    for (var i = 0; i < firstStackLines.length; ++i) {
	        var result = parseLineInfo(firstStackLines[i]);
	        if (result) {
	            firstFileName = result.fileName;
	            firstIndex = result.line;
	            break;
	        }
	    }
	    for (var i = 0; i < lastStackLines.length; ++i) {
	        var result = parseLineInfo(lastStackLines[i]);
	        if (result) {
	            lastFileName = result.fileName;
	            lastIndex = result.line;
	            break;
	        }
	    }
	    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
	        firstFileName !== lastFileName || firstIndex >= lastIndex) {
	        return;
	    }

	    shouldIgnore = function(line) {
	        if (bluebirdFramePattern.test(line)) return true;
	        var info = parseLineInfo(line);
	        if (info) {
	            if (info.fileName === firstFileName &&
	                (firstIndex <= info.line && info.line <= lastIndex)) {
	                return true;
	            }
	        }
	        return false;
	    };
	}

	function CapturedTrace(parent) {
	    this._parent = parent;
	    this._promisesCreated = 0;
	    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
	    captureStackTrace(this, CapturedTrace);
	    if (length > 32) this.uncycle();
	}
	util$$2.inherits(CapturedTrace, Error);
	Context.CapturedTrace = CapturedTrace;

	CapturedTrace.prototype.uncycle = function() {
	    var length = this._length;
	    if (length < 2) return;
	    var nodes = [];
	    var stackToIndex = {};

	    for (var i = 0, node = this; node !== undefined; ++i) {
	        nodes.push(node);
	        node = node._parent;
	    }
	    length = this._length = i;
	    for (var i = length - 1; i >= 0; --i) {
	        var stack = nodes[i].stack;
	        if (stackToIndex[stack] === undefined) {
	            stackToIndex[stack] = i;
	        }
	    }
	    for (var i = 0; i < length; ++i) {
	        var currentStack = nodes[i].stack;
	        var index = stackToIndex[currentStack];
	        if (index !== undefined && index !== i) {
	            if (index > 0) {
	                nodes[index - 1]._parent = undefined;
	                nodes[index - 1]._length = 1;
	            }
	            nodes[i]._parent = undefined;
	            nodes[i]._length = 1;
	            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

	            if (index < length - 1) {
	                cycleEdgeNode._parent = nodes[index + 1];
	                cycleEdgeNode._parent.uncycle();
	                cycleEdgeNode._length =
	                    cycleEdgeNode._parent._length + 1;
	            } else {
	                cycleEdgeNode._parent = undefined;
	                cycleEdgeNode._length = 1;
	            }
	            var currentChildLength = cycleEdgeNode._length + 1;
	            for (var j = i - 2; j >= 0; --j) {
	                nodes[j]._length = currentChildLength;
	                currentChildLength++;
	            }
	            return;
	        }
	    }
	};

	CapturedTrace.prototype.attachExtraTrace = function(error) {
	    if (error.__stackCleaned__) return;
	    this.uncycle();
	    var parsed = parseStackAndMessage(error);
	    var message = parsed.message;
	    var stacks = [parsed.stack];

	    var trace = this;
	    while (trace !== undefined) {
	        stacks.push(cleanStack(trace.stack.split("\n")));
	        trace = trace._parent;
	    }
	    removeCommonRoots(stacks);
	    removeDuplicateOrEmptyJumps(stacks);
	    util$$2.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
	    util$$2.notEnumerableProp(error, "__stackCleaned__", true);
	};

	var captureStackTrace = (function stackDetection() {
	    var v8stackFramePattern = /^\s*at\s*/;
	    var v8stackFormatter = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if (error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    if (typeof Error.stackTraceLimit === "number" &&
	        typeof Error.captureStackTrace === "function") {
	        Error.stackTraceLimit += 6;
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        var captureStackTrace = Error.captureStackTrace;

	        shouldIgnore = function(line) {
	            return bluebirdFramePattern.test(line);
	        };
	        return function(receiver, ignoreUntil) {
	            Error.stackTraceLimit += 6;
	            captureStackTrace(receiver, ignoreUntil);
	            Error.stackTraceLimit -= 6;
	        };
	    }
	    var err = new Error();

	    if (typeof err.stack === "string" &&
	        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
	        stackFramePattern = /@/;
	        formatStack = v8stackFormatter;
	        indentStackFrames = true;
	        return function captureStackTrace(o) {
	            o.stack = new Error().stack;
	        };
	    }

	    var hasStackAfterThrow;
	    try { throw new Error(); }
	    catch(e) {
	        hasStackAfterThrow = ("stack" in e);
	    }
	    if (!("stack" in err) && hasStackAfterThrow &&
	        typeof Error.stackTraceLimit === "number") {
	        stackFramePattern = v8stackFramePattern;
	        formatStack = v8stackFormatter;
	        return function captureStackTrace(o) {
	            Error.stackTraceLimit += 6;
	            try { throw new Error(); }
	            catch(e) { o.stack = e.stack; }
	            Error.stackTraceLimit -= 6;
	        };
	    }

	    formatStack = function(stack, error) {
	        if (typeof stack === "string") return stack;

	        if ((typeof error === "object" ||
	            typeof error === "function") &&
	            error.name !== undefined &&
	            error.message !== undefined) {
	            return error.toString();
	        }
	        return formatNonError(error);
	    };

	    return null;

	})([]);

	if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
	    printWarning = function (message) {
	        console.warn(message);
	    };
	    if (util$$2.isNode && process.stderr.isTTY) {
	        printWarning = function(message, isSoft) {
	            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
	            console.warn(color + message + "\u001b[0m\n");
	        };
	    } else if (!util$$2.isNode && typeof (new Error().stack) === "string") {
	        printWarning = function(message, isSoft) {
	            console.warn("%c" + message,
	                        isSoft ? "color: darkorange" : "color: red");
	        };
	    }
	}

	var config = {
	    warnings: warnings,
	    longStackTraces: false,
	    cancellation: false,
	    monitoring: false
	};

	if (longStackTraces) Promise.longStackTraces();

	return {
	    longStackTraces: function() {
	        return config.longStackTraces;
	    },
	    warnings: function() {
	        return config.warnings;
	    },
	    cancellation: function() {
	        return config.cancellation;
	    },
	    monitoring: function() {
	        return config.monitoring;
	    },
	    propagateFromFunction: function() {
	        return propagateFromFunction;
	    },
	    boundValueFunction: function() {
	        return boundValueFunction;
	    },
	    checkForgottenReturns: checkForgottenReturns,
	    setBounds: setBounds,
	    warn: warn,
	    deprecated: deprecated,
	    CapturedTrace: CapturedTrace,
	    fireDomEvent: fireDomEvent,
	    fireGlobalEvent: fireGlobalEvent
	};
	};

	var catch_filter = function(NEXT_FILTER) {
	var util$$2 = util;
	var getKeys = es5.keys;
	var tryCatch = util$$2.tryCatch;
	var errorObj = util$$2.errorObj;

	function catchFilter(instances, cb, promise) {
	    return function(e) {
	        var boundTo = promise._boundValue();
	        predicateLoop: for (var i = 0; i < instances.length; ++i) {
	            var item = instances[i];

	            if (item === Error ||
	                (item != null && item.prototype instanceof Error)) {
	                if (e instanceof item) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (typeof item === "function") {
	                var matchesPredicate = tryCatch(item).call(boundTo, e);
	                if (matchesPredicate === errorObj) {
	                    return matchesPredicate;
	                } else if (matchesPredicate) {
	                    return tryCatch(cb).call(boundTo, e);
	                }
	            } else if (util$$2.isObject(e)) {
	                var keys = getKeys(item);
	                for (var j = 0; j < keys.length; ++j) {
	                    var key = keys[j];
	                    if (item[key] != e[key]) {
	                        continue predicateLoop;
	                    }
	                }
	                return tryCatch(cb).call(boundTo, e);
	            }
	        }
	        return NEXT_FILTER;
	    };
	}

	return catchFilter;
	};

	var _finally = function(Promise, tryConvertToPromise, NEXT_FILTER) {
	var util$$2 = util;
	var CancellationError = Promise.CancellationError;
	var errorObj = util$$2.errorObj;
	var catchFilter = catch_filter(NEXT_FILTER);

	function PassThroughHandlerContext(promise, type, handler) {
	    this.promise = promise;
	    this.type = type;
	    this.handler = handler;
	    this.called = false;
	    this.cancelPromise = null;
	}

	PassThroughHandlerContext.prototype.isFinallyHandler = function() {
	    return this.type === 0;
	};

	function FinallyHandlerCancelReaction(finallyHandler) {
	    this.finallyHandler = finallyHandler;
	}

	FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
	    checkCancel(this.finallyHandler);
	};

	function checkCancel(ctx, reason) {
	    if (ctx.cancelPromise != null) {
	        if (arguments.length > 1) {
	            ctx.cancelPromise._reject(reason);
	        } else {
	            ctx.cancelPromise._cancel();
	        }
	        ctx.cancelPromise = null;
	        return true;
	    }
	    return false;
	}

	function succeed() {
	    return finallyHandler.call(this, this.promise._target()._settledValue());
	}
	function fail(reason) {
	    if (checkCancel(this, reason)) return;
	    errorObj.e = reason;
	    return errorObj;
	}
	function finallyHandler(reasonOrValue) {
	    var promise = this.promise;
	    var handler = this.handler;

	    if (!this.called) {
	        this.called = true;
	        var ret = this.isFinallyHandler()
	            ? handler.call(promise._boundValue())
	            : handler.call(promise._boundValue(), reasonOrValue);
	        if (ret === NEXT_FILTER) {
	            return ret;
	        } else if (ret !== undefined) {
	            promise._setReturnedNonUndefined();
	            var maybePromise = tryConvertToPromise(ret, promise);
	            if (maybePromise instanceof Promise) {
	                if (this.cancelPromise != null) {
	                    if (maybePromise._isCancelled()) {
	                        var reason =
	                            new CancellationError("late cancellation observer");
	                        promise._attachExtraTrace(reason);
	                        errorObj.e = reason;
	                        return errorObj;
	                    } else if (maybePromise.isPending()) {
	                        maybePromise._attachCancellationCallback(
	                            new FinallyHandlerCancelReaction(this));
	                    }
	                }
	                return maybePromise._then(
	                    succeed, fail, undefined, this, undefined);
	            }
	        }
	    }

	    if (promise.isRejected()) {
	        checkCancel(this);
	        errorObj.e = reasonOrValue;
	        return errorObj;
	    } else {
	        checkCancel(this);
	        return reasonOrValue;
	    }
	}

	Promise.prototype._passThrough = function(handler, type, success, fail) {
	    if (typeof handler !== "function") return this.then();
	    return this._then(success,
	                      fail,
	                      undefined,
	                      new PassThroughHandlerContext(this, type, handler),
	                      undefined);
	};

	Promise.prototype.lastly =
	Promise.prototype["finally"] = function (handler) {
	    return this._passThrough(handler,
	                             0,
	                             finallyHandler,
	                             finallyHandler);
	};


	Promise.prototype.tap = function (handler) {
	    return this._passThrough(handler, 1, finallyHandler);
	};

	Promise.prototype.tapCatch = function (handlerOrPredicate) {
	    var len = arguments.length;
	    if(len === 1) {
	        return this._passThrough(handlerOrPredicate,
	                                 1,
	                                 undefined,
	                                 finallyHandler);
	    } else {
	         var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util$$2.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return Promise.reject(new TypeError(
	                    "tapCatch statement predicate: "
	                    + "expecting an object but got " + util$$2.classString(item)
	                ));
	            }
	        }
	        catchInstances.length = j;
	        var handler = arguments[i];
	        return this._passThrough(catchFilter(catchInstances, handler, this),
	                                 1,
	                                 undefined,
	                                 finallyHandler);
	    }

	};

	return PassThroughHandlerContext;
	};

	var maybeWrapAsError$1 = util.maybeWrapAsError;

	var OperationalError$1 = errors.OperationalError;


	function isUntypedError(obj) {
	    return obj instanceof Error &&
	        es5.getPrototypeOf(obj) === Error.prototype;
	}

	var rErrorKey = /^(?:name|message|stack|cause)$/;
	function wrapAsOperationalError(obj) {
	    var ret;
	    if (isUntypedError(obj)) {
	        ret = new OperationalError$1(obj);
	        ret.name = obj.name;
	        ret.message = obj.message;
	        ret.stack = obj.stack;
	        var keys = es5.keys(obj);
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!rErrorKey.test(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    util.markAsOriginatingFromRejection(obj);
	    return obj;
	}

	function nodebackForPromise(promise, multiArgs) {
	    return function(err, value) {
	        if (promise === null) return;
	        if (err) {
	            var wrapped = wrapAsOperationalError(maybeWrapAsError$1(err));
	            promise._attachExtraTrace(wrapped);
	            promise._reject(wrapped);
	        } else if (!multiArgs) {
	            promise._fulfill(value);
	        } else {
	            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}
	            promise._fulfill(args);
	        }
	        promise = null;
	    };
	}

	var nodeback = nodebackForPromise;

	var method =
	function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
	var util$$2 = util;
	var tryCatch = util$$2.tryCatch;

	Promise.method = function (fn) {
	    if (typeof fn !== "function") {
	        throw new Promise.TypeError("expecting a function but got " + util$$2.classString(fn));
	    }
	    return function () {
	        var ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._pushContext();
	        var value = tryCatch(fn).apply(this, arguments);
	        var promiseCreated = ret._popContext();
	        debug.checkForgottenReturns(
	            value, promiseCreated, "Promise.method", ret);
	        ret._resolveFromSyncValue(value);
	        return ret;
	    };
	};

	Promise.attempt = Promise["try"] = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$$2.classString(fn));
	    }
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._pushContext();
	    var value;
	    if (arguments.length > 1) {
	        debug.deprecated("calling Promise.try with more than 1 argument");
	        var arg = arguments[1];
	        var ctx = arguments[2];
	        value = util$$2.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
	                                  : tryCatch(fn).call(ctx, arg);
	    } else {
	        value = tryCatch(fn)();
	    }
	    var promiseCreated = ret._popContext();
	    debug.checkForgottenReturns(
	        value, promiseCreated, "Promise.try", ret);
	    ret._resolveFromSyncValue(value);
	    return ret;
	};

	Promise.prototype._resolveFromSyncValue = function (value) {
	    if (value === util$$2.errorObj) {
	        this._rejectCallback(value.e, false);
	    } else {
	        this._resolveCallback(value, true);
	    }
	};
	};

	var bind = function(Promise, INTERNAL, tryConvertToPromise, debug) {
	var calledBind = false;
	var rejectThis = function(_, e) {
	    this._reject(e);
	};

	var targetRejected = function(e, context) {
	    context.promiseRejectionQueued = true;
	    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
	};

	var bindingResolved = function(thisArg, context) {
	    if (((this._bitField & 50397184) === 0)) {
	        this._resolveCallback(context.target);
	    }
	};

	var bindingRejected = function(e, context) {
	    if (!context.promiseRejectionQueued) this._reject(e);
	};

	Promise.prototype.bind = function (thisArg) {
	    if (!calledBind) {
	        calledBind = true;
	        Promise.prototype._propagateFrom = debug.propagateFromFunction();
	        Promise.prototype._boundValue = debug.boundValueFunction();
	    }
	    var maybePromise = tryConvertToPromise(thisArg);
	    var ret = new Promise(INTERNAL);
	    ret._propagateFrom(this, 1);
	    var target = this._target();
	    ret._setBoundTo(maybePromise);
	    if (maybePromise instanceof Promise) {
	        var context = {
	            promiseRejectionQueued: false,
	            promise: ret,
	            target: target,
	            bindingPromise: maybePromise
	        };
	        target._then(INTERNAL, targetRejected, undefined, ret, context);
	        maybePromise._then(
	            bindingResolved, bindingRejected, undefined, ret, context);
	        ret._setOnCancel(maybePromise);
	    } else {
	        ret._resolveCallback(target);
	    }
	    return ret;
	};

	Promise.prototype._setBoundTo = function (obj) {
	    if (obj !== undefined) {
	        this._bitField = this._bitField | 2097152;
	        this._boundTo = obj;
	    } else {
	        this._bitField = this._bitField & (~2097152);
	    }
	};

	Promise.prototype._isBound = function () {
	    return (this._bitField & 2097152) === 2097152;
	};

	Promise.bind = function (thisArg, value) {
	    return Promise.resolve(value).bind(thisArg);
	};
	};

	var cancel = function(Promise, PromiseArray, apiRejection, debug) {
	var util$$2 = util;
	var tryCatch = util$$2.tryCatch;
	var errorObj = util$$2.errorObj;
	var async = Promise._async;

	Promise.prototype["break"] = Promise.prototype.cancel = function() {
	    if (!debug.cancellation()) return this._warn("cancellation is disabled");

	    var promise = this;
	    var child = promise;
	    while (promise._isCancellable()) {
	        if (!promise._cancelBy(child)) {
	            if (child._isFollowing()) {
	                child._followee().cancel();
	            } else {
	                child._cancelBranched();
	            }
	            break;
	        }

	        var parent = promise._cancellationParent;
	        if (parent == null || !parent._isCancellable()) {
	            if (promise._isFollowing()) {
	                promise._followee().cancel();
	            } else {
	                promise._cancelBranched();
	            }
	            break;
	        } else {
	            if (promise._isFollowing()) promise._followee().cancel();
	            promise._setWillBeCancelled();
	            child = promise;
	            promise = parent;
	        }
	    }
	};

	Promise.prototype._branchHasCancelled = function() {
	    this._branchesRemainingToCancel--;
	};

	Promise.prototype._enoughBranchesHaveCancelled = function() {
	    return this._branchesRemainingToCancel === undefined ||
	           this._branchesRemainingToCancel <= 0;
	};

	Promise.prototype._cancelBy = function(canceller) {
	    if (canceller === this) {
	        this._branchesRemainingToCancel = 0;
	        this._invokeOnCancel();
	        return true;
	    } else {
	        this._branchHasCancelled();
	        if (this._enoughBranchesHaveCancelled()) {
	            this._invokeOnCancel();
	            return true;
	        }
	    }
	    return false;
	};

	Promise.prototype._cancelBranched = function() {
	    if (this._enoughBranchesHaveCancelled()) {
	        this._cancel();
	    }
	};

	Promise.prototype._cancel = function() {
	    if (!this._isCancellable()) return;
	    this._setCancelled();
	    async.invoke(this._cancelPromises, this, undefined);
	};

	Promise.prototype._cancelPromises = function() {
	    if (this._length() > 0) this._settlePromises();
	};

	Promise.prototype._unsetOnCancel = function() {
	    this._onCancelField = undefined;
	};

	Promise.prototype._isCancellable = function() {
	    return this.isPending() && !this._isCancelled();
	};

	Promise.prototype.isCancellable = function() {
	    return this.isPending() && !this.isCancelled();
	};

	Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
	    if (util$$2.isArray(onCancelCallback)) {
	        for (var i = 0; i < onCancelCallback.length; ++i) {
	            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
	        }
	    } else if (onCancelCallback !== undefined) {
	        if (typeof onCancelCallback === "function") {
	            if (!internalOnly) {
	                var e = tryCatch(onCancelCallback).call(this._boundValue());
	                if (e === errorObj) {
	                    this._attachExtraTrace(e.e);
	                    async.throwLater(e.e);
	                }
	            }
	        } else {
	            onCancelCallback._resultCancelled(this);
	        }
	    }
	};

	Promise.prototype._invokeOnCancel = function() {
	    var onCancelCallback = this._onCancel();
	    this._unsetOnCancel();
	    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
	};

	Promise.prototype._invokeInternalOnCancel = function() {
	    if (this._isCancellable()) {
	        this._doInvokeOnCancel(this._onCancel(), true);
	        this._unsetOnCancel();
	    }
	};

	Promise.prototype._resultCancelled = function() {
	    this.cancel();
	};

	};

	var direct_resolve = function(Promise) {
	function returner() {
	    return this.value;
	}
	function thrower() {
	    throw this.reason;
	}

	Promise.prototype["return"] =
	Promise.prototype.thenReturn = function (value) {
	    if (value instanceof Promise) value.suppressUnhandledRejections();
	    return this._then(
	        returner, undefined, undefined, {value: value}, undefined);
	};

	Promise.prototype["throw"] =
	Promise.prototype.thenThrow = function (reason) {
	    return this._then(
	        thrower, undefined, undefined, {reason: reason}, undefined);
	};

	Promise.prototype.catchThrow = function (reason) {
	    if (arguments.length <= 1) {
	        return this._then(
	            undefined, thrower, undefined, {reason: reason}, undefined);
	    } else {
	        var _reason = arguments[1];
	        var handler = function() {throw _reason;};
	        return this.caught(reason, handler);
	    }
	};

	Promise.prototype.catchReturn = function (value) {
	    if (arguments.length <= 1) {
	        if (value instanceof Promise) value.suppressUnhandledRejections();
	        return this._then(
	            undefined, returner, undefined, {value: value}, undefined);
	    } else {
	        var _value = arguments[1];
	        if (_value instanceof Promise) _value.suppressUnhandledRejections();
	        var handler = function() {return _value;};
	        return this.caught(value, handler);
	    }
	};
	};

	var synchronous_inspection = function(Promise) {
	function PromiseInspection(promise) {
	    if (promise !== undefined) {
	        promise = promise._target();
	        this._bitField = promise._bitField;
	        this._settledValueField = promise._isFateSealed()
	            ? promise._settledValue() : undefined;
	    }
	    else {
	        this._bitField = 0;
	        this._settledValueField = undefined;
	    }
	}

	PromiseInspection.prototype._settledValue = function() {
	    return this._settledValueField;
	};

	var value = PromiseInspection.prototype.value = function () {
	    if (!this.isFulfilled()) {
	        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var reason = PromiseInspection.prototype.error =
	PromiseInspection.prototype.reason = function () {
	    if (!this.isRejected()) {
	        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    return this._settledValue();
	};

	var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
	    return (this._bitField & 33554432) !== 0;
	};

	var isRejected = PromiseInspection.prototype.isRejected = function () {
	    return (this._bitField & 16777216) !== 0;
	};

	var isPending = PromiseInspection.prototype.isPending = function () {
	    return (this._bitField & 50397184) === 0;
	};

	var isResolved = PromiseInspection.prototype.isResolved = function () {
	    return (this._bitField & 50331648) !== 0;
	};

	PromiseInspection.prototype.isCancelled = function() {
	    return (this._bitField & 8454144) !== 0;
	};

	Promise.prototype.__isCancelled = function() {
	    return (this._bitField & 65536) === 65536;
	};

	Promise.prototype._isCancelled = function() {
	    return this._target().__isCancelled();
	};

	Promise.prototype.isCancelled = function() {
	    return (this._target()._bitField & 8454144) !== 0;
	};

	Promise.prototype.isPending = function() {
	    return isPending.call(this._target());
	};

	Promise.prototype.isRejected = function() {
	    return isRejected.call(this._target());
	};

	Promise.prototype.isFulfilled = function() {
	    return isFulfilled.call(this._target());
	};

	Promise.prototype.isResolved = function() {
	    return isResolved.call(this._target());
	};

	Promise.prototype.value = function() {
	    return value.call(this._target());
	};

	Promise.prototype.reason = function() {
	    var target = this._target();
	    target._unsetRejectionIsUnhandled();
	    return reason.call(target);
	};

	Promise.prototype._value = function() {
	    return this._settledValue();
	};

	Promise.prototype._reason = function() {
	    this._unsetRejectionIsUnhandled();
	    return this._settledValue();
	};

	Promise.PromiseInspection = PromiseInspection;
	};

	var join =
	function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
	         getDomain) {
	var util$$2 = util;
	var canEvaluate = util$$2.canEvaluate;
	var tryCatch = util$$2.tryCatch;
	var errorObj = util$$2.errorObj;
	var reject;

	{
	if (canEvaluate) {
	    var thenCallback = function(i) {
	        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
	    };

	    var promiseSetter = function(i) {
	        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
	    };

	    var generateHolderClass = function(total) {
	        var props = new Array(total);
	        for (var i = 0; i < props.length; ++i) {
	            props[i] = "this.p" + (i+1);
	        }
	        var assignment = props.join(" = ") + " = null;";
	        var cancellationCode= "var promise;\n" + props.map(function(prop) {
	            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
	        }).join("\n");
	        var passedArguments = props.join(", ");
	        var name = "Holder$" + total;


	        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

	        code = code.replace(/\[TheName\]/g, name)
	            .replace(/\[TheTotal\]/g, total)
	            .replace(/\[ThePassedArguments\]/g, passedArguments)
	            .replace(/\[TheProperties\]/g, assignment)
	            .replace(/\[CancellationCode\]/g, cancellationCode);

	        return new Function("tryCatch", "errorObj", "Promise", "async", code)
	                           (tryCatch, errorObj, Promise, async);
	    };

	    var holderClasses = [];
	    var thenCallbacks = [];
	    var promiseSetters = [];

	    for (var i = 0; i < 8; ++i) {
	        holderClasses.push(generateHolderClass(i + 1));
	        thenCallbacks.push(thenCallback(i + 1));
	        promiseSetters.push(promiseSetter(i + 1));
	    }

	    reject = function (reason) {
	        this._reject(reason);
	    };
	}}

	Promise.join = function () {
	    var last = arguments.length - 1;
	    var fn;
	    if (last > 0 && typeof arguments[last] === "function") {
	        fn = arguments[last];
	        {
	            if (last <= 8 && canEvaluate) {
	                var ret = new Promise(INTERNAL);
	                ret._captureStackTrace();
	                var HolderClass = holderClasses[last - 1];
	                var holder = new HolderClass(fn);
	                var callbacks = thenCallbacks;

	                for (var i = 0; i < last; ++i) {
	                    var maybePromise = tryConvertToPromise(arguments[i], ret);
	                    if (maybePromise instanceof Promise) {
	                        maybePromise = maybePromise._target();
	                        var bitField = maybePromise._bitField;
	                        
	                        if (((bitField & 50397184) === 0)) {
	                            maybePromise._then(callbacks[i], reject,
	                                               undefined, ret, holder);
	                            promiseSetters[i](maybePromise, holder);
	                            holder.asyncNeeded = false;
	                        } else if (((bitField & 33554432) !== 0)) {
	                            callbacks[i].call(ret,
	                                              maybePromise._value(), holder);
	                        } else if (((bitField & 16777216) !== 0)) {
	                            ret._reject(maybePromise._reason());
	                        } else {
	                            ret._cancel();
	                        }
	                    } else {
	                        callbacks[i].call(ret, maybePromise, holder);
	                    }
	                }

	                if (!ret._isFateSealed()) {
	                    if (holder.asyncNeeded) {
	                        var domain = getDomain();
	                        if (domain !== null) {
	                            holder.fn = util$$2.domainBind(domain, holder.fn);
	                        }
	                    }
	                    ret._setAsyncGuaranteed();
	                    ret._setOnCancel(holder);
	                }
	                return ret;
	            }
	        }
	    }
	    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];}
	    if (fn) args.pop();
	    var ret = new PromiseArray(args).promise();
	    return fn !== undefined ? ret.spread(fn) : ret;
	};

	};

	var map = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util$$2 = util;
	var tryCatch = util$$2.tryCatch;
	var errorObj = util$$2.errorObj;
	var async = Promise._async;

	function MappingPromiseArray(promises, fn, limit, _filter) {
	    this.constructor$(promises);
	    this._promise._captureStackTrace();
	    var domain = getDomain();
	    this._callback = domain === null ? fn : util$$2.domainBind(domain, fn);
	    this._preservedValues = _filter === INTERNAL
	        ? new Array(this.length())
	        : null;
	    this._limit = limit;
	    this._inFlight = 0;
	    this._queue = [];
	    async.invoke(this._asyncInit, this, undefined);
	}
	util$$2.inherits(MappingPromiseArray, PromiseArray);

	MappingPromiseArray.prototype._asyncInit = function() {
	    this._init$(undefined, -2);
	};

	MappingPromiseArray.prototype._init = function () {};

	MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var values = this._values;
	    var length = this.length();
	    var preservedValues = this._preservedValues;
	    var limit = this._limit;

	    if (index < 0) {
	        index = (index * -1) - 1;
	        values[index] = value;
	        if (limit >= 1) {
	            this._inFlight--;
	            this._drainQueue();
	            if (this._isResolved()) return true;
	        }
	    } else {
	        if (limit >= 1 && this._inFlight >= limit) {
	            values[index] = value;
	            this._queue.push(index);
	            return false;
	        }
	        if (preservedValues !== null) preservedValues[index] = value;

	        var promise = this._promise;
	        var callback = this._callback;
	        var receiver = promise._boundValue();
	        promise._pushContext();
	        var ret = tryCatch(callback).call(receiver, value, index, length);
	        var promiseCreated = promise._popContext();
	        debug.checkForgottenReturns(
	            ret,
	            promiseCreated,
	            preservedValues !== null ? "Promise.filter" : "Promise.map",
	            promise
	        );
	        if (ret === errorObj) {
	            this._reject(ret.e);
	            return true;
	        }

	        var maybePromise = tryConvertToPromise(ret, this._promise);
	        if (maybePromise instanceof Promise) {
	            maybePromise = maybePromise._target();
	            var bitField = maybePromise._bitField;
	            
	            if (((bitField & 50397184) === 0)) {
	                if (limit >= 1) this._inFlight++;
	                values[index] = maybePromise;
	                maybePromise._proxy(this, (index + 1) * -1);
	                return false;
	            } else if (((bitField & 33554432) !== 0)) {
	                ret = maybePromise._value();
	            } else if (((bitField & 16777216) !== 0)) {
	                this._reject(maybePromise._reason());
	                return true;
	            } else {
	                this._cancel();
	                return true;
	            }
	        }
	        values[index] = ret;
	    }
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= length) {
	        if (preservedValues !== null) {
	            this._filter(values, preservedValues);
	        } else {
	            this._resolve(values);
	        }
	        return true;
	    }
	    return false;
	};

	MappingPromiseArray.prototype._drainQueue = function () {
	    var queue = this._queue;
	    var limit = this._limit;
	    var values = this._values;
	    while (queue.length > 0 && this._inFlight < limit) {
	        if (this._isResolved()) return;
	        var index = queue.pop();
	        this._promiseFulfilled(values[index], index);
	    }
	};

	MappingPromiseArray.prototype._filter = function (booleans, values) {
	    var len = values.length;
	    var ret = new Array(len);
	    var j = 0;
	    for (var i = 0; i < len; ++i) {
	        if (booleans[i]) ret[j++] = values[i];
	    }
	    ret.length = j;
	    this._resolve(ret);
	};

	MappingPromiseArray.prototype.preservedValues = function () {
	    return this._preservedValues;
	};

	function map(promises, fn, options, _filter) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$$2.classString(fn));
	    }

	    var limit = 0;
	    if (options !== undefined) {
	        if (typeof options === "object" && options !== null) {
	            if (typeof options.concurrency !== "number") {
	                return Promise.reject(
	                    new TypeError("'concurrency' must be a number but it is " +
	                                    util$$2.classString(options.concurrency)));
	            }
	            limit = options.concurrency;
	        } else {
	            return Promise.reject(new TypeError(
	                            "options argument must be an object but it is " +
	                             util$$2.classString(options)));
	        }
	    }
	    limit = typeof limit === "number" &&
	        isFinite(limit) && limit >= 1 ? limit : 0;
	    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
	}

	Promise.prototype.map = function (fn, options) {
	    return map(this, fn, options, null);
	};

	Promise.map = function (promises, fn, options, _filter) {
	    return map(promises, fn, options, _filter);
	};


	};

	var cr = Object.create;
	if (cr) {
	    var callerCache = cr(null);
	    var getterCache = cr(null);
	    callerCache[" size"] = getterCache[" size"] = 0;
	}

	var call_get = function(Promise) {
	var util$$2 = util;
	var canEvaluate = util$$2.canEvaluate;
	var isIdentifier = util$$2.isIdentifier;

	var getMethodCaller;
	var getGetter;
	{
	var makeMethodCaller = function (methodName) {
	    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
	};

	var makeGetter = function (propertyName) {
	    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
	};

	var getCompiled = function(name, compiler, cache) {
	    var ret = cache[name];
	    if (typeof ret !== "function") {
	        if (!isIdentifier(name)) {
	            return null;
	        }
	        ret = compiler(name);
	        cache[name] = ret;
	        cache[" size"]++;
	        if (cache[" size"] > 512) {
	            var keys = Object.keys(cache);
	            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
	            cache[" size"] = keys.length - 256;
	        }
	    }
	    return ret;
	};

	getMethodCaller = function(name) {
	    return getCompiled(name, makeMethodCaller, callerCache);
	};

	getGetter = function(name) {
	    return getCompiled(name, makeGetter, getterCache);
	};
	}

	function ensureMethod(obj, methodName) {
	    var fn;
	    if (obj != null) fn = obj[methodName];
	    if (typeof fn !== "function") {
	        var message = "Object " + util$$2.classString(obj) + " has no method '" +
	            util$$2.toString(methodName) + "'";
	        throw new Promise.TypeError(message);
	    }
	    return fn;
	}

	function caller(obj) {
	    var methodName = this.pop();
	    var fn = ensureMethod(obj, methodName);
	    return fn.apply(obj, this);
	}
	Promise.prototype.call = function (methodName) {
	    var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];}
	    {
	        if (canEvaluate) {
	            var maybeCaller = getMethodCaller(methodName);
	            if (maybeCaller !== null) {
	                return this._then(
	                    maybeCaller, undefined, undefined, args, undefined);
	            }
	        }
	    }
	    args.push(methodName);
	    return this._then(caller, undefined, undefined, args, undefined);
	};

	function namedGetter(obj) {
	    return obj[this];
	}
	function indexedGetter(obj) {
	    var index = +this;
	    if (index < 0) index = Math.max(0, index + obj.length);
	    return obj[index];
	}
	Promise.prototype.get = function (propertyName) {
	    var isIndex = (typeof propertyName === "number");
	    var getter;
	    if (!isIndex) {
	        if (canEvaluate) {
	            var maybeGetter = getGetter(propertyName);
	            getter = maybeGetter !== null ? maybeGetter : namedGetter;
	        } else {
	            getter = namedGetter;
	        }
	    } else {
	        getter = indexedGetter;
	    }
	    return this._then(getter, undefined, undefined, propertyName, undefined);
	};
	};

	var using = function (Promise, apiRejection, tryConvertToPromise,
	    createContext, INTERNAL, debug) {
	    var util$$2 = util;
	    var TypeError = errors.TypeError;
	    var inherits = util.inherits;
	    var errorObj = util$$2.errorObj;
	    var tryCatch = util$$2.tryCatch;
	    var NULL = {};

	    function thrower(e) {
	        setTimeout(function(){throw e;}, 0);
	    }

	    function castPreservingDisposable(thenable) {
	        var maybePromise = tryConvertToPromise(thenable);
	        if (maybePromise !== thenable &&
	            typeof thenable._isDisposable === "function" &&
	            typeof thenable._getDisposer === "function" &&
	            thenable._isDisposable()) {
	            maybePromise._setDisposable(thenable._getDisposer());
	        }
	        return maybePromise;
	    }
	    function dispose(resources, inspection) {
	        var i = 0;
	        var len = resources.length;
	        var ret = new Promise(INTERNAL);
	        function iterator() {
	            if (i >= len) return ret._fulfill();
	            var maybePromise = castPreservingDisposable(resources[i++]);
	            if (maybePromise instanceof Promise &&
	                maybePromise._isDisposable()) {
	                try {
	                    maybePromise = tryConvertToPromise(
	                        maybePromise._getDisposer().tryDispose(inspection),
	                        resources.promise);
	                } catch (e) {
	                    return thrower(e);
	                }
	                if (maybePromise instanceof Promise) {
	                    return maybePromise._then(iterator, thrower,
	                                              null, null, null);
	                }
	            }
	            iterator();
	        }
	        iterator();
	        return ret;
	    }

	    function Disposer(data, promise, context) {
	        this._data = data;
	        this._promise = promise;
	        this._context = context;
	    }

	    Disposer.prototype.data = function () {
	        return this._data;
	    };

	    Disposer.prototype.promise = function () {
	        return this._promise;
	    };

	    Disposer.prototype.resource = function () {
	        if (this.promise().isFulfilled()) {
	            return this.promise().value();
	        }
	        return NULL;
	    };

	    Disposer.prototype.tryDispose = function(inspection) {
	        var resource = this.resource();
	        var context = this._context;
	        if (context !== undefined) context._pushContext();
	        var ret = resource !== NULL
	            ? this.doDispose(resource, inspection) : null;
	        if (context !== undefined) context._popContext();
	        this._promise._unsetDisposable();
	        this._data = null;
	        return ret;
	    };

	    Disposer.isDisposer = function (d) {
	        return (d != null &&
	                typeof d.resource === "function" &&
	                typeof d.tryDispose === "function");
	    };

	    function FunctionDisposer(fn, promise, context) {
	        this.constructor$(fn, promise, context);
	    }
	    inherits(FunctionDisposer, Disposer);

	    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
	        var fn = this.data();
	        return fn.call(resource, resource, inspection);
	    };

	    function maybeUnwrapDisposer(value) {
	        if (Disposer.isDisposer(value)) {
	            this.resources[this.index]._setDisposable(value);
	            return value.promise();
	        }
	        return value;
	    }

	    function ResourceList(length) {
	        this.length = length;
	        this.promise = null;
	        this[length-1] = null;
	    }

	    ResourceList.prototype._resultCancelled = function() {
	        var len = this.length;
	        for (var i = 0; i < len; ++i) {
	            var item = this[i];
	            if (item instanceof Promise) {
	                item.cancel();
	            }
	        }
	    };

	    Promise.using = function () {
	        var len = arguments.length;
	        if (len < 2) return apiRejection(
	                        "you must pass at least 2 arguments to Promise.using");
	        var fn = arguments[len - 1];
	        if (typeof fn !== "function") {
	            return apiRejection("expecting a function but got " + util$$2.classString(fn));
	        }
	        var input;
	        var spreadArgs = true;
	        if (len === 2 && Array.isArray(arguments[0])) {
	            input = arguments[0];
	            len = input.length;
	            spreadArgs = false;
	        } else {
	            input = arguments;
	            len--;
	        }
	        var resources = new ResourceList(len);
	        for (var i = 0; i < len; ++i) {
	            var resource = input[i];
	            if (Disposer.isDisposer(resource)) {
	                var disposer = resource;
	                resource = resource.promise();
	                resource._setDisposable(disposer);
	            } else {
	                var maybePromise = tryConvertToPromise(resource);
	                if (maybePromise instanceof Promise) {
	                    resource =
	                        maybePromise._then(maybeUnwrapDisposer, null, null, {
	                            resources: resources,
	                            index: i
	                    }, undefined);
	                }
	            }
	            resources[i] = resource;
	        }

	        var reflectedResources = new Array(resources.length);
	        for (var i = 0; i < reflectedResources.length; ++i) {
	            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
	        }

	        var resultPromise = Promise.all(reflectedResources)
	            .then(function(inspections) {
	                for (var i = 0; i < inspections.length; ++i) {
	                    var inspection = inspections[i];
	                    if (inspection.isRejected()) {
	                        errorObj.e = inspection.error();
	                        return errorObj;
	                    } else if (!inspection.isFulfilled()) {
	                        resultPromise.cancel();
	                        return;
	                    }
	                    inspections[i] = inspection.value();
	                }
	                promise._pushContext();

	                fn = tryCatch(fn);
	                var ret = spreadArgs
	                    ? fn.apply(undefined, inspections) : fn(inspections);
	                var promiseCreated = promise._popContext();
	                debug.checkForgottenReturns(
	                    ret, promiseCreated, "Promise.using", promise);
	                return ret;
	            });

	        var promise = resultPromise.lastly(function() {
	            var inspection = new Promise.PromiseInspection(resultPromise);
	            return dispose(resources, inspection);
	        });
	        resources.promise = promise;
	        promise._setOnCancel(resources);
	        return promise;
	    };

	    Promise.prototype._setDisposable = function (disposer) {
	        this._bitField = this._bitField | 131072;
	        this._disposer = disposer;
	    };

	    Promise.prototype._isDisposable = function () {
	        return (this._bitField & 131072) > 0;
	    };

	    Promise.prototype._getDisposer = function () {
	        return this._disposer;
	    };

	    Promise.prototype._unsetDisposable = function () {
	        this._bitField = this._bitField & (~131072);
	        this._disposer = undefined;
	    };

	    Promise.prototype.disposer = function (fn) {
	        if (typeof fn === "function") {
	            return new FunctionDisposer(fn, this, createContext());
	        }
	        throw new TypeError();
	    };

	};

	var timers$1 = function(Promise, INTERNAL, debug) {
	var util$$2 = util;
	var TimeoutError = Promise.TimeoutError;

	function HandleWrapper(handle)  {
	    this.handle = handle;
	}

	HandleWrapper.prototype._resultCancelled = function() {
	    clearTimeout(this.handle);
	};

	var afterValue = function(value) { return delay(+this).thenReturn(value); };
	var delay = Promise.delay = function (ms, value) {
	    var ret;
	    var handle;
	    if (value !== undefined) {
	        ret = Promise.resolve(value)
	                ._then(afterValue, null, null, ms, undefined);
	        if (debug.cancellation() && value instanceof Promise) {
	            ret._setOnCancel(value);
	        }
	    } else {
	        ret = new Promise(INTERNAL);
	        handle = setTimeout(function() { ret._fulfill(); }, +ms);
	        if (debug.cancellation()) {
	            ret._setOnCancel(new HandleWrapper(handle));
	        }
	        ret._captureStackTrace();
	    }
	    ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.prototype.delay = function (ms) {
	    return delay(ms, this);
	};

	var afterTimeout = function (promise, message, parent) {
	    var err;
	    if (typeof message !== "string") {
	        if (message instanceof Error) {
	            err = message;
	        } else {
	            err = new TimeoutError("operation timed out");
	        }
	    } else {
	        err = new TimeoutError(message);
	    }
	    util$$2.markAsOriginatingFromRejection(err);
	    promise._attachExtraTrace(err);
	    promise._reject(err);

	    if (parent != null) {
	        parent.cancel();
	    }
	};

	function successClear(value) {
	    clearTimeout(this.handle);
	    return value;
	}

	function failureClear(reason) {
	    clearTimeout(this.handle);
	    throw reason;
	}

	Promise.prototype.timeout = function (ms, message) {
	    ms = +ms;
	    var ret, parent;

	    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
	        if (ret.isPending()) {
	            afterTimeout(ret, message, parent);
	        }
	    }, ms));

	    if (debug.cancellation()) {
	        parent = this.then();
	        ret = parent._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	        ret._setOnCancel(handleWrapper);
	    } else {
	        ret = this._then(successClear, failureClear,
	                            undefined, handleWrapper, undefined);
	    }

	    return ret;
	};

	};

	var generators = function(Promise,
	                          apiRejection,
	                          INTERNAL,
	                          tryConvertToPromise,
	                          Proxyable,
	                          debug) {
	var errors$$2 = errors;
	var TypeError = errors$$2.TypeError;
	var util$$2 = util;
	var errorObj = util$$2.errorObj;
	var tryCatch = util$$2.tryCatch;
	var yieldHandlers = [];

	function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
	    for (var i = 0; i < yieldHandlers.length; ++i) {
	        traceParent._pushContext();
	        var result = tryCatch(yieldHandlers[i])(value);
	        traceParent._popContext();
	        if (result === errorObj) {
	            traceParent._pushContext();
	            var ret = Promise.reject(errorObj.e);
	            traceParent._popContext();
	            return ret;
	        }
	        var maybePromise = tryConvertToPromise(result, traceParent);
	        if (maybePromise instanceof Promise) return maybePromise;
	    }
	    return null;
	}

	function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
	    if (debug.cancellation()) {
	        var internal = new Promise(INTERNAL);
	        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
	        this._promise = internal.lastly(function() {
	            return _finallyPromise;
	        });
	        internal._captureStackTrace();
	        internal._setOnCancel(this);
	    } else {
	        var promise = this._promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	    }
	    this._stack = stack;
	    this._generatorFunction = generatorFunction;
	    this._receiver = receiver;
	    this._generator = undefined;
	    this._yieldHandlers = typeof yieldHandler === "function"
	        ? [yieldHandler].concat(yieldHandlers)
	        : yieldHandlers;
	    this._yieldedPromise = null;
	    this._cancellationPhase = false;
	}
	util$$2.inherits(PromiseSpawn, Proxyable);

	PromiseSpawn.prototype._isResolved = function() {
	    return this._promise === null;
	};

	PromiseSpawn.prototype._cleanup = function() {
	    this._promise = this._generator = null;
	    if (debug.cancellation() && this._finallyPromise !== null) {
	        this._finallyPromise._fulfill();
	        this._finallyPromise = null;
	    }
	};

	PromiseSpawn.prototype._promiseCancelled = function() {
	    if (this._isResolved()) return;
	    var implementsReturn = typeof this._generator["return"] !== "undefined";

	    var result;
	    if (!implementsReturn) {
	        var reason = new Promise.CancellationError(
	            "generator .return() sentinel");
	        Promise.coroutine.returnSentinel = reason;
	        this._promise._attachExtraTrace(reason);
	        this._promise._pushContext();
	        result = tryCatch(this._generator["throw"]).call(this._generator,
	                                                         reason);
	        this._promise._popContext();
	    } else {
	        this._promise._pushContext();
	        result = tryCatch(this._generator["return"]).call(this._generator,
	                                                          undefined);
	        this._promise._popContext();
	    }
	    this._cancellationPhase = true;
	    this._yieldedPromise = null;
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseFulfilled = function(value) {
	    this._yieldedPromise = null;
	    this._promise._pushContext();
	    var result = tryCatch(this._generator.next).call(this._generator, value);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._promiseRejected = function(reason) {
	    this._yieldedPromise = null;
	    this._promise._attachExtraTrace(reason);
	    this._promise._pushContext();
	    var result = tryCatch(this._generator["throw"])
	        .call(this._generator, reason);
	    this._promise._popContext();
	    this._continue(result);
	};

	PromiseSpawn.prototype._resultCancelled = function() {
	    if (this._yieldedPromise instanceof Promise) {
	        var promise = this._yieldedPromise;
	        this._yieldedPromise = null;
	        promise.cancel();
	    }
	};

	PromiseSpawn.prototype.promise = function () {
	    return this._promise;
	};

	PromiseSpawn.prototype._run = function () {
	    this._generator = this._generatorFunction.call(this._receiver);
	    this._receiver =
	        this._generatorFunction = undefined;
	    this._promiseFulfilled(undefined);
	};

	PromiseSpawn.prototype._continue = function (result) {
	    var promise = this._promise;
	    if (result === errorObj) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._rejectCallback(result.e, false);
	        }
	    }

	    var value = result.value;
	    if (result.done === true) {
	        this._cleanup();
	        if (this._cancellationPhase) {
	            return promise.cancel();
	        } else {
	            return promise._resolveCallback(value);
	        }
	    } else {
	        var maybePromise = tryConvertToPromise(value, this._promise);
	        if (!(maybePromise instanceof Promise)) {
	            maybePromise =
	                promiseFromYieldHandler(maybePromise,
	                                        this._yieldHandlers,
	                                        this._promise);
	            if (maybePromise === null) {
	                this._promiseRejected(
	                    new TypeError(
	                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
	                        "From coroutine:\u000a" +
	                        this._stack.split("\n").slice(1, -7).join("\n")
	                    )
	                );
	                return;
	            }
	        }
	        maybePromise = maybePromise._target();
	        var bitField = maybePromise._bitField;
	        
	        if (((bitField & 50397184) === 0)) {
	            this._yieldedPromise = maybePromise;
	            maybePromise._proxy(this, null);
	        } else if (((bitField & 33554432) !== 0)) {
	            Promise._async.invoke(
	                this._promiseFulfilled, this, maybePromise._value()
	            );
	        } else if (((bitField & 16777216) !== 0)) {
	            Promise._async.invoke(
	                this._promiseRejected, this, maybePromise._reason()
	            );
	        } else {
	            this._promiseCancelled();
	        }
	    }
	};

	Promise.coroutine = function (generatorFunction, options) {
	    if (typeof generatorFunction !== "function") {
	        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var yieldHandler = Object(options).yieldHandler;
	    var PromiseSpawn$ = PromiseSpawn;
	    var stack = new Error().stack;
	    return function () {
	        var generator = generatorFunction.apply(this, arguments);
	        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
	                                      stack);
	        var ret = spawn.promise();
	        spawn._generator = generator;
	        spawn._promiseFulfilled(undefined);
	        return ret;
	    };
	};

	Promise.coroutine.addYieldHandler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util$$2.classString(fn));
	    }
	    yieldHandlers.push(fn);
	};

	Promise.spawn = function (generatorFunction) {
	    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
	    if (typeof generatorFunction !== "function") {
	        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var spawn = new PromiseSpawn(generatorFunction, this);
	    var ret = spawn.promise();
	    spawn._run(Promise.spawn);
	    return ret;
	};
	};

	var nodeify = function(Promise) {
	var util$$2 = util;
	var async = Promise._async;
	var tryCatch = util$$2.tryCatch;
	var errorObj = util$$2.errorObj;

	function spreadAdapter(val, nodeback) {
	    var promise = this;
	    if (!util$$2.isArray(val)) return successAdapter.call(promise, val, nodeback);
	    var ret =
	        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	function successAdapter(val, nodeback) {
	    var promise = this;
	    var receiver = promise._boundValue();
	    var ret = val === undefined
	        ? tryCatch(nodeback).call(receiver, null)
	        : tryCatch(nodeback).call(receiver, null, val);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}
	function errorAdapter(reason, nodeback) {
	    var promise = this;
	    if (!reason) {
	        var newReason = new Error(reason + "");
	        newReason.cause = reason;
	        reason = newReason;
	    }
	    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
	    if (ret === errorObj) {
	        async.throwLater(ret.e);
	    }
	}

	Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
	                                                                     options) {
	    if (typeof nodeback == "function") {
	        var adapter = successAdapter;
	        if (options !== undefined && Object(options).spread) {
	            adapter = spreadAdapter;
	        }
	        this._then(
	            adapter,
	            errorAdapter,
	            undefined,
	            this,
	            nodeback
	        );
	    }
	    return this;
	};
	};

	var promisify = function(Promise, INTERNAL) {
	var THIS = {};
	var util$$2 = util;
	var nodebackForPromise = nodeback;
	var withAppended = util$$2.withAppended;
	var maybeWrapAsError = util$$2.maybeWrapAsError;
	var canEvaluate = util$$2.canEvaluate;
	var TypeError = errors.TypeError;
	var defaultSuffix = "Async";
	var defaultPromisified = {__isPromisified__: true};
	var noCopyProps = [
	    "arity",    "length",
	    "name",
	    "arguments",
	    "caller",
	    "callee",
	    "prototype",
	    "__isPromisified__"
	];
	var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

	var defaultFilter = function(name) {
	    return util$$2.isIdentifier(name) &&
	        name.charAt(0) !== "_" &&
	        name !== "constructor";
	};

	function propsFilter(key) {
	    return !noCopyPropsPattern.test(key);
	}

	function isPromisified(fn) {
	    try {
	        return fn.__isPromisified__ === true;
	    }
	    catch (e) {
	        return false;
	    }
	}

	function hasPromisified(obj, key, suffix) {
	    var val = util$$2.getDataPropertyOrDefault(obj, key + suffix,
	                                            defaultPromisified);
	    return val ? isPromisified(val) : false;
	}
	function checkValid(ret, suffix, suffixRegexp) {
	    for (var i = 0; i < ret.length; i += 2) {
	        var key = ret[i];
	        if (suffixRegexp.test(key)) {
	            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
	            for (var j = 0; j < ret.length; j += 2) {
	                if (ret[j] === keyWithoutAsyncSuffix) {
	                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
	                        .replace("%s", suffix));
	                }
	            }
	        }
	    }
	}

	function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
	    var keys = util$$2.inheritedDataKeys(obj);
	    var ret = [];
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var value = obj[key];
	        var passesDefaultFilter = filter === defaultFilter
	            ? true : defaultFilter(key, value, obj);
	        if (typeof value === "function" &&
	            !isPromisified(value) &&
	            !hasPromisified(obj, key, suffix) &&
	            filter(key, value, obj, passesDefaultFilter)) {
	            ret.push(key, value);
	        }
	    }
	    checkValid(ret, suffix, suffixRegexp);
	    return ret;
	}

	var escapeIdentRegex = function(str) {
	    return str.replace(/([$])/, "\\$");
	};

	var makeNodePromisifiedEval;
	{
	var switchCaseArgumentOrder = function(likelyArgumentCount) {
	    var ret = [likelyArgumentCount];
	    var min = Math.max(0, likelyArgumentCount - 1 - 3);
	    for(var i = likelyArgumentCount - 1; i >= min; --i) {
	        ret.push(i);
	    }
	    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
	        ret.push(i);
	    }
	    return ret;
	};

	var argumentSequence = function(argumentCount) {
	    return util$$2.filledRange(argumentCount, "_arg", "");
	};

	var parameterDeclaration = function(parameterCount) {
	    return util$$2.filledRange(
	        Math.max(parameterCount, 3), "_arg", "");
	};

	var parameterCount = function(fn) {
	    if (typeof fn.length === "number") {
	        return Math.max(Math.min(fn.length, 1023 + 1), 0);
	    }
	    return 0;
	};

	makeNodePromisifiedEval =
	function(callback, receiver, originalName, fn, _, multiArgs) {
	    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
	    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
	    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

	    function generateCallForArgumentCount(count) {
	        var args = argumentSequence(count).join(", ");
	        var comma = count > 0 ? ", " : "";
	        var ret;
	        if (shouldProxyThis) {
	            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
	        } else {
	            ret = receiver === undefined
	                ? "ret = callback({{args}}, nodeback); break;\n"
	                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
	        }
	        return ret.replace("{{args}}", args).replace(", ", comma);
	    }

	    function generateArgumentSwitchCase() {
	        var ret = "";
	        for (var i = 0; i < argumentOrder.length; ++i) {
	            ret += "case " + argumentOrder[i] +":" +
	                generateCallForArgumentCount(argumentOrder[i]);
	        }

	        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
	                                ? "ret = callback.apply(this, args);\n"
	                                : "ret = callback.apply(receiver, args);\n"));
	        return ret;
	    }

	    var getFunctionCode = typeof callback === "string"
	                                ? ("this != null ? this['"+callback+"'] : fn")
	                                : "fn";
	    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
	        .replace("[GetFunctionCode]", getFunctionCode);
	    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
	    return new Function("Promise",
	                        "fn",
	                        "receiver",
	                        "withAppended",
	                        "maybeWrapAsError",
	                        "nodebackForPromise",
	                        "tryCatch",
	                        "errorObj",
	                        "notEnumerableProp",
	                        "INTERNAL",
	                        body)(
	                    Promise,
	                    fn,
	                    receiver,
	                    withAppended,
	                    maybeWrapAsError,
	                    nodebackForPromise,
	                    util$$2.tryCatch,
	                    util$$2.errorObj,
	                    util$$2.notEnumerableProp,
	                    INTERNAL);
	};
	}

	function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
	    var defaultThis = (function() {return this;})();
	    var method = callback;
	    if (typeof method === "string") {
	        callback = fn;
	    }
	    function promisified() {
	        var _receiver = receiver;
	        if (receiver === THIS) _receiver = this;
	        var promise = new Promise(INTERNAL);
	        promise._captureStackTrace();
	        var cb = typeof method === "string" && this !== defaultThis
	            ? this[method] : callback;
	        var fn = nodebackForPromise(promise, multiArgs);
	        try {
	            cb.apply(_receiver, withAppended(arguments, fn));
	        } catch(e) {
	            promise._rejectCallback(maybeWrapAsError(e), true, true);
	        }
	        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
	        return promise;
	    }
	    util$$2.notEnumerableProp(promisified, "__isPromisified__", true);
	    return promisified;
	}

	var makeNodePromisified = canEvaluate
	    ? makeNodePromisifiedEval
	    : makeNodePromisifiedClosure;

	function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
	    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
	    var methods =
	        promisifiableMethods(obj, suffix, suffixRegexp, filter);

	    for (var i = 0, len = methods.length; i < len; i+= 2) {
	        var key = methods[i];
	        var fn = methods[i+1];
	        var promisifiedKey = key + suffix;
	        if (promisifier === makeNodePromisified) {
	            obj[promisifiedKey] =
	                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
	        } else {
	            var promisified = promisifier(fn, function() {
	                return makeNodePromisified(key, THIS, key,
	                                           fn, suffix, multiArgs);
	            });
	            util$$2.notEnumerableProp(promisified, "__isPromisified__", true);
	            obj[promisifiedKey] = promisified;
	        }
	    }
	    util$$2.toFastProperties(obj);
	    return obj;
	}

	function promisify(callback, receiver, multiArgs) {
	    return makeNodePromisified(callback, receiver, undefined,
	                                callback, null, multiArgs);
	}

	Promise.promisify = function (fn, options) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util$$2.classString(fn));
	    }
	    if (isPromisified(fn)) {
	        return fn;
	    }
	    options = Object(options);
	    var receiver = options.context === undefined ? THIS : options.context;
	    var multiArgs = !!options.multiArgs;
	    var ret = promisify(fn, receiver, multiArgs);
	    util$$2.copyDescriptors(fn, ret, propsFilter);
	    return ret;
	};

	Promise.promisifyAll = function (target, options) {
	    if (typeof target !== "function" && typeof target !== "object") {
	        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    options = Object(options);
	    var multiArgs = !!options.multiArgs;
	    var suffix = options.suffix;
	    if (typeof suffix !== "string") suffix = defaultSuffix;
	    var filter = options.filter;
	    if (typeof filter !== "function") filter = defaultFilter;
	    var promisifier = options.promisifier;
	    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

	    if (!util$$2.isIdentifier(suffix)) {
	        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }

	    var keys = util$$2.inheritedDataKeys(target);
	    for (var i = 0; i < keys.length; ++i) {
	        var value = target[keys[i]];
	        if (keys[i] !== "constructor" &&
	            util$$2.isClass(value)) {
	            promisifyAll(value.prototype, suffix, filter, promisifier,
	                multiArgs);
	            promisifyAll(value, suffix, filter, promisifier, multiArgs);
	        }
	    }

	    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
	};
	};

	var props = function(
	    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
	var util$$2 = util;
	var isObject = util$$2.isObject;
	var es5$$2 = es5;
	var Es6Map;
	if (typeof Map === "function") Es6Map = Map;

	var mapToEntries = (function() {
	    var index = 0;
	    var size = 0;

	    function extractEntry(value, key) {
	        this[index] = value;
	        this[index + size] = key;
	        index++;
	    }

	    return function mapToEntries(map) {
	        size = map.size;
	        index = 0;
	        var ret = new Array(map.size * 2);
	        map.forEach(extractEntry, ret);
	        return ret;
	    };
	})();

	var entriesToMap = function(entries) {
	    var ret = new Es6Map();
	    var length = entries.length / 2 | 0;
	    for (var i = 0; i < length; ++i) {
	        var key = entries[length + i];
	        var value = entries[i];
	        ret.set(key, value);
	    }
	    return ret;
	};

	function PropertiesPromiseArray(obj) {
	    var isMap = false;
	    var entries;
	    if (Es6Map !== undefined && obj instanceof Es6Map) {
	        entries = mapToEntries(obj);
	        isMap = true;
	    } else {
	        var keys = es5$$2.keys(obj);
	        var len = keys.length;
	        entries = new Array(len * 2);
	        for (var i = 0; i < len; ++i) {
	            var key = keys[i];
	            entries[i] = obj[key];
	            entries[i + len] = key;
	        }
	    }
	    this.constructor$(entries);
	    this._isMap = isMap;
	    this._init$(undefined, isMap ? -6 : -3);
	}
	util$$2.inherits(PropertiesPromiseArray, PromiseArray);

	PropertiesPromiseArray.prototype._init = function () {};

	PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    this._values[index] = value;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        var val;
	        if (this._isMap) {
	            val = entriesToMap(this._values);
	        } else {
	            val = {};
	            var keyOffset = this.length();
	            for (var i = 0, len = this.length(); i < len; ++i) {
	                val[this._values[i + keyOffset]] = this._values[i];
	            }
	        }
	        this._resolve(val);
	        return true;
	    }
	    return false;
	};

	PropertiesPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	PropertiesPromiseArray.prototype.getActualLength = function (len) {
	    return len >> 1;
	};

	function props(promises) {
	    var ret;
	    var castValue = tryConvertToPromise(promises);

	    if (!isObject(castValue)) {
	        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    } else if (castValue instanceof Promise) {
	        ret = castValue._then(
	            Promise.props, undefined, undefined, undefined, undefined);
	    } else {
	        ret = new PropertiesPromiseArray(castValue).promise();
	    }

	    if (castValue instanceof Promise) {
	        ret._propagateFrom(castValue, 2);
	    }
	    return ret;
	}

	Promise.prototype.props = function () {
	    return props(this);
	};

	Promise.props = function (promises) {
	    return props(promises);
	};
	};

	var race = function(
	    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
	var util$$2 = util;

	var raceLater = function (promise) {
	    return promise.then(function(array) {
	        return race(array, promise);
	    });
	};

	function race(promises, parent) {
	    var maybePromise = tryConvertToPromise(promises);

	    if (maybePromise instanceof Promise) {
	        return raceLater(maybePromise);
	    } else {
	        promises = util$$2.asArray(promises);
	        if (promises === null)
	            return apiRejection("expecting an array or an iterable object but got " + util$$2.classString(promises));
	    }

	    var ret = new Promise(INTERNAL);
	    if (parent !== undefined) {
	        ret._propagateFrom(parent, 3);
	    }
	    var fulfill = ret._fulfill;
	    var reject = ret._reject;
	    for (var i = 0, len = promises.length; i < len; ++i) {
	        var val = promises[i];

	        if (val === undefined && !(i in promises)) {
	            continue;
	        }

	        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
	    }
	    return ret;
	}

	Promise.race = function (promises) {
	    return race(promises, undefined);
	};

	Promise.prototype.race = function () {
	    return race(this, undefined);
	};

	};

	var reduce = function(Promise,
	                          PromiseArray,
	                          apiRejection,
	                          tryConvertToPromise,
	                          INTERNAL,
	                          debug) {
	var getDomain = Promise._getDomain;
	var util$$2 = util;
	var tryCatch = util$$2.tryCatch;

	function ReductionPromiseArray(promises, fn, initialValue, _each) {
	    this.constructor$(promises);
	    var domain = getDomain();
	    this._fn = domain === null ? fn : util$$2.domainBind(domain, fn);
	    if (initialValue !== undefined) {
	        initialValue = Promise.resolve(initialValue);
	        initialValue._attachCancellationCallback(this);
	    }
	    this._initialValue = initialValue;
	    this._currentCancellable = null;
	    if(_each === INTERNAL) {
	        this._eachValues = Array(this._length);
	    } else if (_each === 0) {
	        this._eachValues = null;
	    } else {
	        this._eachValues = undefined;
	    }
	    this._promise._captureStackTrace();
	    this._init$(undefined, -5);
	}
	util$$2.inherits(ReductionPromiseArray, PromiseArray);

	ReductionPromiseArray.prototype._gotAccum = function(accum) {
	    if (this._eachValues !== undefined && 
	        this._eachValues !== null && 
	        accum !== INTERNAL) {
	        this._eachValues.push(accum);
	    }
	};

	ReductionPromiseArray.prototype._eachComplete = function(value) {
	    if (this._eachValues !== null) {
	        this._eachValues.push(value);
	    }
	    return this._eachValues;
	};

	ReductionPromiseArray.prototype._init = function() {};

	ReductionPromiseArray.prototype._resolveEmptyArray = function() {
	    this._resolve(this._eachValues !== undefined ? this._eachValues
	                                                 : this._initialValue);
	};

	ReductionPromiseArray.prototype.shouldCopyValues = function () {
	    return false;
	};

	ReductionPromiseArray.prototype._resolve = function(value) {
	    this._promise._resolveCallback(value);
	    this._values = null;
	};

	ReductionPromiseArray.prototype._resultCancelled = function(sender) {
	    if (sender === this._initialValue) return this._cancel();
	    if (this._isResolved()) return;
	    this._resultCancelled$();
	    if (this._currentCancellable instanceof Promise) {
	        this._currentCancellable.cancel();
	    }
	    if (this._initialValue instanceof Promise) {
	        this._initialValue.cancel();
	    }
	};

	ReductionPromiseArray.prototype._iterate = function (values) {
	    this._values = values;
	    var value;
	    var i;
	    var length = values.length;
	    if (this._initialValue !== undefined) {
	        value = this._initialValue;
	        i = 0;
	    } else {
	        value = Promise.resolve(values[0]);
	        i = 1;
	    }

	    this._currentCancellable = value;

	    if (!value.isRejected()) {
	        for (; i < length; ++i) {
	            var ctx = {
	                accum: null,
	                value: values[i],
	                index: i,
	                length: length,
	                array: this
	            };
	            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
	        }
	    }

	    if (this._eachValues !== undefined) {
	        value = value
	            ._then(this._eachComplete, undefined, undefined, this, undefined);
	    }
	    value._then(completed, completed, undefined, value, this);
	};

	Promise.prototype.reduce = function (fn, initialValue) {
	    return reduce(this, fn, initialValue, null);
	};

	Promise.reduce = function (promises, fn, initialValue, _each) {
	    return reduce(promises, fn, initialValue, _each);
	};

	function completed(valueOrReason, array) {
	    if (this.isFulfilled()) {
	        array._resolve(valueOrReason);
	    } else {
	        array._reject(valueOrReason);
	    }
	}

	function reduce(promises, fn, initialValue, _each) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$$2.classString(fn));
	    }
	    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
	    return array.promise();
	}

	function gotAccum(accum) {
	    this.accum = accum;
	    this.array._gotAccum(accum);
	    var value = tryConvertToPromise(this.value, this.array._promise);
	    if (value instanceof Promise) {
	        this.array._currentCancellable = value;
	        return value._then(gotValue, undefined, undefined, this, undefined);
	    } else {
	        return gotValue.call(this, value);
	    }
	}

	function gotValue(value) {
	    var array = this.array;
	    var promise = array._promise;
	    var fn = tryCatch(array._fn);
	    promise._pushContext();
	    var ret;
	    if (array._eachValues !== undefined) {
	        ret = fn.call(promise._boundValue(), value, this.index, this.length);
	    } else {
	        ret = fn.call(promise._boundValue(),
	                              this.accum, value, this.index, this.length);
	    }
	    if (ret instanceof Promise) {
	        array._currentCancellable = ret;
	    }
	    var promiseCreated = promise._popContext();
	    debug.checkForgottenReturns(
	        ret,
	        promiseCreated,
	        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
	        promise
	    );
	    return ret;
	}
	};

	var settle =
	    function(Promise, PromiseArray, debug) {
	var PromiseInspection = Promise.PromiseInspection;
	var util$$2 = util;

	function SettledPromiseArray(values) {
	    this.constructor$(values);
	}
	util$$2.inherits(SettledPromiseArray, PromiseArray);

	SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
	    this._values[index] = inspection;
	    var totalResolved = ++this._totalResolved;
	    if (totalResolved >= this._length) {
	        this._resolve(this._values);
	        return true;
	    }
	    return false;
	};

	SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 33554432;
	    ret._settledValueField = value;
	    return this._promiseResolved(index, ret);
	};
	SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
	    var ret = new PromiseInspection();
	    ret._bitField = 16777216;
	    ret._settledValueField = reason;
	    return this._promiseResolved(index, ret);
	};

	Promise.settle = function (promises) {
	    debug.deprecated(".settle()", ".reflect()");
	    return new SettledPromiseArray(promises).promise();
	};

	Promise.prototype.settle = function () {
	    return Promise.settle(this);
	};
	};

	var some =
	function(Promise, PromiseArray, apiRejection) {
	var util$$2 = util;
	var RangeError = errors.RangeError;
	var AggregateError = errors.AggregateError;
	var isArray = util$$2.isArray;
	var CANCELLATION = {};


	function SomePromiseArray(values) {
	    this.constructor$(values);
	    this._howMany = 0;
	    this._unwrap = false;
	    this._initialized = false;
	}
	util$$2.inherits(SomePromiseArray, PromiseArray);

	SomePromiseArray.prototype._init = function () {
	    if (!this._initialized) {
	        return;
	    }
	    if (this._howMany === 0) {
	        this._resolve([]);
	        return;
	    }
	    this._init$(undefined, -5);
	    var isArrayResolved = isArray(this._values);
	    if (!this._isResolved() &&
	        isArrayResolved &&
	        this._howMany > this._canPossiblyFulfill()) {
	        this._reject(this._getRangeError(this.length()));
	    }
	};

	SomePromiseArray.prototype.init = function () {
	    this._initialized = true;
	    this._init();
	};

	SomePromiseArray.prototype.setUnwrap = function () {
	    this._unwrap = true;
	};

	SomePromiseArray.prototype.howMany = function () {
	    return this._howMany;
	};

	SomePromiseArray.prototype.setHowMany = function (count) {
	    this._howMany = count;
	};

	SomePromiseArray.prototype._promiseFulfilled = function (value) {
	    this._addFulfilled(value);
	    if (this._fulfilled() === this.howMany()) {
	        this._values.length = this.howMany();
	        if (this.howMany() === 1 && this._unwrap) {
	            this._resolve(this._values[0]);
	        } else {
	            this._resolve(this._values);
	        }
	        return true;
	    }
	    return false;

	};
	SomePromiseArray.prototype._promiseRejected = function (reason) {
	    this._addRejected(reason);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._promiseCancelled = function () {
	    if (this._values instanceof Promise || this._values == null) {
	        return this._cancel();
	    }
	    this._addRejected(CANCELLATION);
	    return this._checkOutcome();
	};

	SomePromiseArray.prototype._checkOutcome = function() {
	    if (this.howMany() > this._canPossiblyFulfill()) {
	        var e = new AggregateError();
	        for (var i = this.length(); i < this._values.length; ++i) {
	            if (this._values[i] !== CANCELLATION) {
	                e.push(this._values[i]);
	            }
	        }
	        if (e.length > 0) {
	            this._reject(e);
	        } else {
	            this._cancel();
	        }
	        return true;
	    }
	    return false;
	};

	SomePromiseArray.prototype._fulfilled = function () {
	    return this._totalResolved;
	};

	SomePromiseArray.prototype._rejected = function () {
	    return this._values.length - this.length();
	};

	SomePromiseArray.prototype._addRejected = function (reason) {
	    this._values.push(reason);
	};

	SomePromiseArray.prototype._addFulfilled = function (value) {
	    this._values[this._totalResolved++] = value;
	};

	SomePromiseArray.prototype._canPossiblyFulfill = function () {
	    return this.length() - this._rejected();
	};

	SomePromiseArray.prototype._getRangeError = function (count) {
	    var message = "Input array must contain at least " +
	            this._howMany + " items but contains only " + count + " items";
	    return new RangeError(message);
	};

	SomePromiseArray.prototype._resolveEmptyArray = function () {
	    this._reject(this._getRangeError(0));
	};

	function some(promises, howMany) {
	    if ((howMany | 0) !== howMany || howMany < 0) {
	        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(howMany);
	    ret.init();
	    return promise;
	}

	Promise.some = function (promises, howMany) {
	    return some(promises, howMany);
	};

	Promise.prototype.some = function (howMany) {
	    return some(this, howMany);
	};

	Promise._SomePromiseArray = SomePromiseArray;
	};

	var filter = function(Promise, INTERNAL) {
	var PromiseMap = Promise.map;

	Promise.prototype.filter = function (fn, options) {
	    return PromiseMap(this, fn, options, INTERNAL);
	};

	Promise.filter = function (promises, fn, options) {
	    return PromiseMap(promises, fn, options, INTERNAL);
	};
	};

	var each = function(Promise, INTERNAL) {
	var PromiseReduce = Promise.reduce;
	var PromiseAll = Promise.all;

	function promiseAllThis() {
	    return PromiseAll(this);
	}

	function PromiseMapSeries(promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
	}

	Promise.prototype.each = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, this, undefined);
	};

	Promise.prototype.mapSeries = function (fn) {
	    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
	};

	Promise.each = function (promises, fn) {
	    return PromiseReduce(promises, fn, INTERNAL, 0)
	              ._then(promiseAllThis, undefined, undefined, promises, undefined);
	};

	Promise.mapSeries = PromiseMapSeries;
	};

	var any = function(Promise) {
	var SomePromiseArray = Promise._SomePromiseArray;
	function any(promises) {
	    var ret = new SomePromiseArray(promises);
	    var promise = ret.promise();
	    ret.setHowMany(1);
	    ret.setUnwrap();
	    ret.init();
	    return promise;
	}

	Promise.any = function (promises) {
	    return any(promises);
	};

	Promise.prototype.any = function () {
	    return any(this);
	};

	};

	var promise = createCommonjsModule(function (module) {
	"use strict";
	module.exports = function() {
	var makeSelfResolutionError = function () {
	    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	};
	var reflectHandler = function() {
	    return new Promise.PromiseInspection(this._target());
	};
	var apiRejection = function(msg) {
	    return Promise.reject(new TypeError(msg));
	};
	function Proxyable() {}
	var UNDEFINED_BINDING = {};
	var util$$1 = util;

	var getDomain;
	if (util$$1.isNode) {
	    getDomain = function() {
	        var ret = process.domain;
	        if (ret === undefined) ret = null;
	        return ret;
	    };
	} else {
	    getDomain = function() {
	        return null;
	    };
	}
	util$$1.notEnumerableProp(Promise, "_getDomain", getDomain);

	var es5$$1 = es5;
	var Async = async;
	var async$$1 = new Async();
	es5$$1.defineProperty(Promise, "_async", {value: async$$1});
	var errors$$1 = errors;
	var TypeError = Promise.TypeError = errors$$1.TypeError;
	Promise.RangeError = errors$$1.RangeError;
	var CancellationError = Promise.CancellationError = errors$$1.CancellationError;
	Promise.TimeoutError = errors$$1.TimeoutError;
	Promise.OperationalError = errors$$1.OperationalError;
	Promise.RejectionError = errors$$1.OperationalError;
	Promise.AggregateError = errors$$1.AggregateError;
	var INTERNAL = function(){};
	var APPLY = {};
	var NEXT_FILTER = {};
	var tryConvertToPromise = thenables(Promise, INTERNAL);
	var PromiseArray =
	    promise_array(Promise, INTERNAL,
	                               tryConvertToPromise, apiRejection, Proxyable);
	var Context = context(Promise);
	 /*jshint unused:false*/
	var createContext = Context.create;
	var debug = debuggability(Promise, Context);
	var CapturedTrace = debug.CapturedTrace;
	var PassThroughHandlerContext =
	    _finally(Promise, tryConvertToPromise, NEXT_FILTER);
	var catchFilter = catch_filter(NEXT_FILTER);
	var nodebackForPromise = nodeback;
	var errorObj = util$$1.errorObj;
	var tryCatch = util$$1.tryCatch;
	function check(self, executor) {
	    if (self == null || self.constructor !== Promise) {
	        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
	    }
	    if (typeof executor !== "function") {
	        throw new TypeError("expecting a function but got " + util$$1.classString(executor));
	    }

	}

	function Promise(executor) {
	    if (executor !== INTERNAL) {
	        check(this, executor);
	    }
	    this._bitField = 0;
	    this._fulfillmentHandler0 = undefined;
	    this._rejectionHandler0 = undefined;
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._resolveFromExecutor(executor);
	    this._promiseCreated();
	    this._fireEvent("promiseCreated", this);
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
	    var len = arguments.length;
	    if (len > 1) {
	        var catchInstances = new Array(len - 1),
	            j = 0, i;
	        for (i = 0; i < len - 1; ++i) {
	            var item = arguments[i];
	            if (util$$1.isObject(item)) {
	                catchInstances[j++] = item;
	            } else {
	                return apiRejection("Catch statement predicate: " +
	                    "expecting an object but got " + util$$1.classString(item));
	            }
	        }
	        catchInstances.length = j;
	        fn = arguments[i];
	        return this.then(undefined, catchFilter(catchInstances, fn, this));
	    }
	    return this.then(undefined, fn);
	};

	Promise.prototype.reflect = function () {
	    return this._then(reflectHandler,
	        reflectHandler, undefined, this, undefined);
	};

	Promise.prototype.then = function (didFulfill, didReject) {
	    if (debug.warnings() && arguments.length > 0 &&
	        typeof didFulfill !== "function" &&
	        typeof didReject !== "function") {
	        var msg = ".then() only accepts functions but was passed: " +
	                util$$1.classString(didFulfill);
	        if (arguments.length > 1) {
	            msg += ", " + util$$1.classString(didReject);
	        }
	        this._warn(msg);
	    }
	    return this._then(didFulfill, didReject, undefined, undefined, undefined);
	};

	Promise.prototype.done = function (didFulfill, didReject) {
	    var promise =
	        this._then(didFulfill, didReject, undefined, undefined, undefined);
	    promise._setIsFinal();
	};

	Promise.prototype.spread = function (fn) {
	    if (typeof fn !== "function") {
	        return apiRejection("expecting a function but got " + util$$1.classString(fn));
	    }
	    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
	};

	Promise.prototype.toJSON = function () {
	    var ret = {
	        isFulfilled: false,
	        isRejected: false,
	        fulfillmentValue: undefined,
	        rejectionReason: undefined
	    };
	    if (this.isFulfilled()) {
	        ret.fulfillmentValue = this.value();
	        ret.isFulfilled = true;
	    } else if (this.isRejected()) {
	        ret.rejectionReason = this.reason();
	        ret.isRejected = true;
	    }
	    return ret;
	};

	Promise.prototype.all = function () {
	    if (arguments.length > 0) {
	        this._warn(".all() was passed arguments but it does not take any");
	    }
	    return new PromiseArray(this).promise();
	};

	Promise.prototype.error = function (fn) {
	    return this.caught(util$$1.originatesFromRejection, fn);
	};

	Promise.getNewLibraryCopy = module.exports;

	Promise.is = function (val) {
	    return val instanceof Promise;
	};

	Promise.fromNode = Promise.fromCallback = function(fn) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
	                                         : false;
	    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
	    if (result === errorObj) {
	        ret._rejectCallback(result.e, true);
	    }
	    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
	    return ret;
	};

	Promise.all = function (promises) {
	    return new PromiseArray(promises).promise();
	};

	Promise.cast = function (obj) {
	    var ret = tryConvertToPromise(obj);
	    if (!(ret instanceof Promise)) {
	        ret = new Promise(INTERNAL);
	        ret._captureStackTrace();
	        ret._setFulfilled();
	        ret._rejectionHandler0 = obj;
	    }
	    return ret;
	};

	Promise.resolve = Promise.fulfilled = Promise.cast;

	Promise.reject = Promise.rejected = function (reason) {
	    var ret = new Promise(INTERNAL);
	    ret._captureStackTrace();
	    ret._rejectCallback(reason, true);
	    return ret;
	};

	Promise.setScheduler = function(fn) {
	    if (typeof fn !== "function") {
	        throw new TypeError("expecting a function but got " + util$$1.classString(fn));
	    }
	    return async$$1.setScheduler(fn);
	};

	Promise.prototype._then = function (
	    didFulfill,
	    didReject,
	    _,    receiver,
	    internalData
	) {
	    var haveInternalData = internalData !== undefined;
	    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
	    var target = this._target();
	    var bitField = target._bitField;

	    if (!haveInternalData) {
	        promise._propagateFrom(this, 3);
	        promise._captureStackTrace();
	        if (receiver === undefined &&
	            ((this._bitField & 2097152) !== 0)) {
	            if (!((bitField & 50397184) === 0)) {
	                receiver = this._boundValue();
	            } else {
	                receiver = target === this ? undefined : this._boundTo;
	            }
	        }
	        this._fireEvent("promiseChained", this, promise);
	    }

	    var domain = getDomain();
	    if (!((bitField & 50397184) === 0)) {
	        var handler, value, settler = target._settlePromiseCtx;
	        if (((bitField & 33554432) !== 0)) {
	            value = target._rejectionHandler0;
	            handler = didFulfill;
	        } else if (((bitField & 16777216) !== 0)) {
	            value = target._fulfillmentHandler0;
	            handler = didReject;
	            target._unsetRejectionIsUnhandled();
	        } else {
	            settler = target._settlePromiseLateCancellationObserver;
	            value = new CancellationError("late cancellation observer");
	            target._attachExtraTrace(value);
	            handler = didReject;
	        }

	        async$$1.invoke(settler, target, {
	            handler: domain === null ? handler
	                : (typeof handler === "function" &&
	                    util$$1.domainBind(domain, handler)),
	            promise: promise,
	            receiver: receiver,
	            value: value
	        });
	    } else {
	        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
	    }

	    return promise;
	};

	Promise.prototype._length = function () {
	    return this._bitField & 65535;
	};

	Promise.prototype._isFateSealed = function () {
	    return (this._bitField & 117506048) !== 0;
	};

	Promise.prototype._isFollowing = function () {
	    return (this._bitField & 67108864) === 67108864;
	};

	Promise.prototype._setLength = function (len) {
	    this._bitField = (this._bitField & -65536) |
	        (len & 65535);
	};

	Promise.prototype._setFulfilled = function () {
	    this._bitField = this._bitField | 33554432;
	    this._fireEvent("promiseFulfilled", this);
	};

	Promise.prototype._setRejected = function () {
	    this._bitField = this._bitField | 16777216;
	    this._fireEvent("promiseRejected", this);
	};

	Promise.prototype._setFollowing = function () {
	    this._bitField = this._bitField | 67108864;
	    this._fireEvent("promiseResolved", this);
	};

	Promise.prototype._setIsFinal = function () {
	    this._bitField = this._bitField | 4194304;
	};

	Promise.prototype._isFinal = function () {
	    return (this._bitField & 4194304) > 0;
	};

	Promise.prototype._unsetCancelled = function() {
	    this._bitField = this._bitField & (~65536);
	};

	Promise.prototype._setCancelled = function() {
	    this._bitField = this._bitField | 65536;
	    this._fireEvent("promiseCancelled", this);
	};

	Promise.prototype._setWillBeCancelled = function() {
	    this._bitField = this._bitField | 8388608;
	};

	Promise.prototype._setAsyncGuaranteed = function() {
	    if (async$$1.hasCustomScheduler()) return;
	    this._bitField = this._bitField | 134217728;
	};

	Promise.prototype._receiverAt = function (index) {
	    var ret = index === 0 ? this._receiver0 : this[
	            index * 4 - 4 + 3];
	    if (ret === UNDEFINED_BINDING) {
	        return undefined;
	    } else if (ret === undefined && this._isBound()) {
	        return this._boundValue();
	    }
	    return ret;
	};

	Promise.prototype._promiseAt = function (index) {
	    return this[
	            index * 4 - 4 + 2];
	};

	Promise.prototype._fulfillmentHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 0];
	};

	Promise.prototype._rejectionHandlerAt = function (index) {
	    return this[
	            index * 4 - 4 + 1];
	};

	Promise.prototype._boundValue = function() {};

	Promise.prototype._migrateCallback0 = function (follower) {
	    var bitField = follower._bitField;
	    var fulfill = follower._fulfillmentHandler0;
	    var reject = follower._rejectionHandler0;
	    var promise = follower._promise0;
	    var receiver = follower._receiverAt(0);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._migrateCallbackAt = function (follower, index) {
	    var fulfill = follower._fulfillmentHandlerAt(index);
	    var reject = follower._rejectionHandlerAt(index);
	    var promise = follower._promiseAt(index);
	    var receiver = follower._receiverAt(index);
	    if (receiver === undefined) receiver = UNDEFINED_BINDING;
	    this._addCallbacks(fulfill, reject, promise, receiver, null);
	};

	Promise.prototype._addCallbacks = function (
	    fulfill,
	    reject,
	    promise,
	    receiver,
	    domain
	) {
	    var index = this._length();

	    if (index >= 65535 - 4) {
	        index = 0;
	        this._setLength(0);
	    }

	    if (index === 0) {
	        this._promise0 = promise;
	        this._receiver0 = receiver;
	        if (typeof fulfill === "function") {
	            this._fulfillmentHandler0 =
	                domain === null ? fulfill : util$$1.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this._rejectionHandler0 =
	                domain === null ? reject : util$$1.domainBind(domain, reject);
	        }
	    } else {
	        var base = index * 4 - 4;
	        this[base + 2] = promise;
	        this[base + 3] = receiver;
	        if (typeof fulfill === "function") {
	            this[base + 0] =
	                domain === null ? fulfill : util$$1.domainBind(domain, fulfill);
	        }
	        if (typeof reject === "function") {
	            this[base + 1] =
	                domain === null ? reject : util$$1.domainBind(domain, reject);
	        }
	    }
	    this._setLength(index + 1);
	    return index;
	};

	Promise.prototype._proxy = function (proxyable, arg) {
	    this._addCallbacks(undefined, undefined, arg, proxyable, null);
	};

	Promise.prototype._resolveCallback = function(value, shouldBind) {
	    if (((this._bitField & 117506048) !== 0)) return;
	    if (value === this)
	        return this._rejectCallback(makeSelfResolutionError(), false);
	    var maybePromise = tryConvertToPromise(value, this);
	    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

	    if (shouldBind) this._propagateFrom(maybePromise, 2);

	    var promise = maybePromise._target();

	    if (promise === this) {
	        this._reject(makeSelfResolutionError());
	        return;
	    }

	    var bitField = promise._bitField;
	    if (((bitField & 50397184) === 0)) {
	        var len = this._length();
	        if (len > 0) promise._migrateCallback0(this);
	        for (var i = 1; i < len; ++i) {
	            promise._migrateCallbackAt(this, i);
	        }
	        this._setFollowing();
	        this._setLength(0);
	        this._setFollowee(promise);
	    } else if (((bitField & 33554432) !== 0)) {
	        this._fulfill(promise._value());
	    } else if (((bitField & 16777216) !== 0)) {
	        this._reject(promise._reason());
	    } else {
	        var reason = new CancellationError("late cancellation observer");
	        promise._attachExtraTrace(reason);
	        this._reject(reason);
	    }
	};

	Promise.prototype._rejectCallback =
	function(reason, synchronous, ignoreNonErrorWarnings) {
	    var trace = util$$1.ensureErrorObject(reason);
	    var hasStack = trace === reason;
	    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
	        var message = "a promise was rejected with a non-error: " +
	            util$$1.classString(reason);
	        this._warn(message, true);
	    }
	    this._attachExtraTrace(trace, synchronous ? hasStack : false);
	    this._reject(reason);
	};

	Promise.prototype._resolveFromExecutor = function (executor) {
	    if (executor === INTERNAL) return;
	    var promise = this;
	    this._captureStackTrace();
	    this._pushContext();
	    var synchronous = true;
	    var r = this._execute(executor, function(value) {
	        promise._resolveCallback(value);
	    }, function (reason) {
	        promise._rejectCallback(reason, synchronous);
	    });
	    synchronous = false;
	    this._popContext();

	    if (r !== undefined) {
	        promise._rejectCallback(r, true);
	    }
	};

	Promise.prototype._settlePromiseFromHandler = function (
	    handler, receiver, value, promise
	) {
	    var bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;
	    promise._pushContext();
	    var x;
	    if (receiver === APPLY) {
	        if (!value || typeof value.length !== "number") {
	            x = errorObj;
	            x.e = new TypeError("cannot .spread() a non-array: " +
	                                    util$$1.classString(value));
	        } else {
	            x = tryCatch(handler).apply(this._boundValue(), value);
	        }
	    } else {
	        x = tryCatch(handler).call(receiver, value);
	    }
	    var promiseCreated = promise._popContext();
	    bitField = promise._bitField;
	    if (((bitField & 65536) !== 0)) return;

	    if (x === NEXT_FILTER) {
	        promise._reject(value);
	    } else if (x === errorObj) {
	        promise._rejectCallback(x.e, false);
	    } else {
	        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
	        promise._resolveCallback(x);
	    }
	};

	Promise.prototype._target = function() {
	    var ret = this;
	    while (ret._isFollowing()) ret = ret._followee();
	    return ret;
	};

	Promise.prototype._followee = function() {
	    return this._rejectionHandler0;
	};

	Promise.prototype._setFollowee = function(promise) {
	    this._rejectionHandler0 = promise;
	};

	Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
	    var isPromise = promise instanceof Promise;
	    var bitField = this._bitField;
	    var asyncGuaranteed = ((bitField & 134217728) !== 0);
	    if (((bitField & 65536) !== 0)) {
	        if (isPromise) promise._invokeInternalOnCancel();

	        if (receiver instanceof PassThroughHandlerContext &&
	            receiver.isFinallyHandler()) {
	            receiver.cancelPromise = promise;
	            if (tryCatch(handler).call(receiver, value) === errorObj) {
	                promise._reject(errorObj.e);
	            }
	        } else if (handler === reflectHandler) {
	            promise._fulfill(reflectHandler.call(receiver));
	        } else if (receiver instanceof Proxyable) {
	            receiver._promiseCancelled(promise);
	        } else if (isPromise || promise instanceof PromiseArray) {
	            promise._cancel();
	        } else {
	            receiver.cancel();
	        }
	    } else if (typeof handler === "function") {
	        if (!isPromise) {
	            handler.call(receiver, value, promise);
	        } else {
	            if (asyncGuaranteed) promise._setAsyncGuaranteed();
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (receiver instanceof Proxyable) {
	        if (!receiver._isResolved()) {
	            if (((bitField & 33554432) !== 0)) {
	                receiver._promiseFulfilled(value, promise);
	            } else {
	                receiver._promiseRejected(value, promise);
	            }
	        }
	    } else if (isPromise) {
	        if (asyncGuaranteed) promise._setAsyncGuaranteed();
	        if (((bitField & 33554432) !== 0)) {
	            promise._fulfill(value);
	        } else {
	            promise._reject(value);
	        }
	    }
	};

	Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
	    var handler = ctx.handler;
	    var promise = ctx.promise;
	    var receiver = ctx.receiver;
	    var value = ctx.value;
	    if (typeof handler === "function") {
	        if (!(promise instanceof Promise)) {
	            handler.call(receiver, value, promise);
	        } else {
	            this._settlePromiseFromHandler(handler, receiver, value, promise);
	        }
	    } else if (promise instanceof Promise) {
	        promise._reject(value);
	    }
	};

	Promise.prototype._settlePromiseCtx = function(ctx) {
	    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
	};

	Promise.prototype._settlePromise0 = function(handler, value, bitField) {
	    var promise = this._promise0;
	    var receiver = this._receiverAt(0);
	    this._promise0 = undefined;
	    this._receiver0 = undefined;
	    this._settlePromise(promise, handler, receiver, value);
	};

	Promise.prototype._clearCallbackDataAtIndex = function(index) {
	    var base = index * 4 - 4;
	    this[base + 2] =
	    this[base + 3] =
	    this[base + 0] =
	    this[base + 1] = undefined;
	};

	Promise.prototype._fulfill = function (value) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    if (value === this) {
	        var err = makeSelfResolutionError();
	        this._attachExtraTrace(err);
	        return this._reject(err);
	    }
	    this._setFulfilled();
	    this._rejectionHandler0 = value;

	    if ((bitField & 65535) > 0) {
	        if (((bitField & 134217728) !== 0)) {
	            this._settlePromises();
	        } else {
	            async$$1.settlePromises(this);
	        }
	    }
	};

	Promise.prototype._reject = function (reason) {
	    var bitField = this._bitField;
	    if (((bitField & 117506048) >>> 16)) return;
	    this._setRejected();
	    this._fulfillmentHandler0 = reason;

	    if (this._isFinal()) {
	        return async$$1.fatalError(reason, util$$1.isNode);
	    }

	    if ((bitField & 65535) > 0) {
	        async$$1.settlePromises(this);
	    } else {
	        this._ensurePossibleRejectionHandled();
	    }
	};

	Promise.prototype._fulfillPromises = function (len, value) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._fulfillmentHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, value);
	    }
	};

	Promise.prototype._rejectPromises = function (len, reason) {
	    for (var i = 1; i < len; i++) {
	        var handler = this._rejectionHandlerAt(i);
	        var promise = this._promiseAt(i);
	        var receiver = this._receiverAt(i);
	        this._clearCallbackDataAtIndex(i);
	        this._settlePromise(promise, handler, receiver, reason);
	    }
	};

	Promise.prototype._settlePromises = function () {
	    var bitField = this._bitField;
	    var len = (bitField & 65535);

	    if (len > 0) {
	        if (((bitField & 16842752) !== 0)) {
	            var reason = this._fulfillmentHandler0;
	            this._settlePromise0(this._rejectionHandler0, reason, bitField);
	            this._rejectPromises(len, reason);
	        } else {
	            var value = this._rejectionHandler0;
	            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
	            this._fulfillPromises(len, value);
	        }
	        this._setLength(0);
	    }
	    this._clearCancellationData();
	};

	Promise.prototype._settledValue = function() {
	    var bitField = this._bitField;
	    if (((bitField & 33554432) !== 0)) {
	        return this._rejectionHandler0;
	    } else if (((bitField & 16777216) !== 0)) {
	        return this._fulfillmentHandler0;
	    }
	};

	function deferResolve(v) {this.promise._resolveCallback(v);}
	function deferReject(v) {this.promise._rejectCallback(v, false);}

	Promise.defer = Promise.pending = function() {
	    debug.deprecated("Promise.defer", "new Promise");
	    var promise = new Promise(INTERNAL);
	    return {
	        promise: promise,
	        resolve: deferResolve,
	        reject: deferReject
	    };
	};

	util$$1.notEnumerableProp(Promise,
	                       "_makeSelfResolutionError",
	                       makeSelfResolutionError);

	method(Promise, INTERNAL, tryConvertToPromise, apiRejection,
	    debug);
	bind(Promise, INTERNAL, tryConvertToPromise, debug);
	cancel(Promise, PromiseArray, apiRejection, debug);
	direct_resolve(Promise);
	synchronous_inspection(Promise);
	join(
	    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async$$1, getDomain);
	Promise.Promise = Promise;
	Promise.version = "3.5.0";
	map(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	call_get(Promise);
	using(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
	timers$1(Promise, INTERNAL, debug);
	generators(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
	nodeify(Promise);
	promisify(Promise, INTERNAL);
	props(Promise, PromiseArray, tryConvertToPromise, apiRejection);
	race(Promise, INTERNAL, tryConvertToPromise, apiRejection);
	reduce(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
	settle(Promise, PromiseArray, debug);
	some(Promise, PromiseArray, apiRejection);
	filter(Promise, INTERNAL);
	each(Promise, INTERNAL);
	any(Promise);
	                                                         
	    util$$1.toFastProperties(Promise);                                          
	    util$$1.toFastProperties(Promise.prototype);                                
	    function fillTypes(value) {                                              
	        var p = new Promise(INTERNAL);                                       
	        p._fulfillmentHandler0 = value;                                      
	        p._rejectionHandler0 = value;                                        
	        p._promise0 = value;                                                 
	        p._receiver0 = value;                                                
	    }                                                                        
	    // Complete slack tracking, opt out of field-type tracking and           
	    // stabilize map                                                         
	    fillTypes({a: 1});                                                       
	    fillTypes({b: 2});                                                       
	    fillTypes({c: 3});                                                       
	    fillTypes(1);                                                            
	    fillTypes(function(){});                                                 
	    fillTypes(undefined);                                                    
	    fillTypes(false);                                                        
	    fillTypes(new Promise(INTERNAL));                                        
	    debug.setBounds(Async.firstLineError, util$$1.lastLineError);               
	    return Promise;                                                          

	};
	});

	var old;
	if (typeof Promise !== "undefined") old = Promise;
	function noConflict() {
	    try { if (Promise === bluebird$2) Promise = old; }
	    catch (e) {}
	    return bluebird$2;
	}
	var bluebird$2 = promise();
	bluebird$2.noConflict = noConflict;
	var bluebird_1 = bluebird$2;

	function sendBasicRequest (url, method, type, body){
	  return new bluebird_1(function (resolve, reject) {

	    var xhr = new XMLHttpRequest();
	    xhr.onload = function (event) {
	      if (xhr.status >= 200 && xhr.status < 300) {
	        resolve(xhr.response);
	      } else {
	        reject('Http request to '+url+' returned status: '+xhr.status+'. Body:\n'+xhr.response);
	      }
	    };
	    xhr.onerror = function (event) {
	      reject('Http request error. URL: '+url);
	    };
	    xhr.open(method, url, true);
	    xhr.crossOrigin = 'Anonymous';
	    xhr.responseType = type.toLowerCase();
	    xhr.send(body);

	  })
	}

	function sendJsonRequest(url, method, type, data){
	  return new bluebird_1(function (resolve, reject) {

	    // internals
	    var jsonString = null;
	    var triedPreflightWorkaround = false;

	    // preprocess data
	    if (data) {
	      try {
	        jsonString = JSON.stringify(data);
	      } catch (e) {
	        reject('Error creating JSON string.');
	      }
	    }

	    // create request
	    var xhr = new XMLHttpRequest();
	    xhr.crossOrigin = 'Anonymous';

	    xhr.onload = function (event) {
	      // parse data
	      var json;
	      try {
	        json = JSON.parse(xhr.responseText);
	      } catch (e) {
	        reject({
	          message: 'Http Request failed: Error parsing response JSON',
	          url: url,
	          status: xhr.status,
	          headers: xhr.getAllResponseHeaders(),
	          event: event
	        });
	        return
	      }
	      if (xhr.status >= 200 && xhr.status < 300) {
	        resolve(json);
	      } else {
	        reject(json);
	      }
	    };
	    xhr.onerror = function (event) {

	      // When CORS preflight fails then xhr.status is 0
	      if (!triedPreflightWorkaround && xhr.status === 0) {

	        // try again with simple header to avoid OPTIONS preflight
	        triedPreflightWorkaround = true;
	        xhr.open(method, url, true);
	        xhr.setRequestHeader('Content-Type', 'text/plain');
	        xhr.send(jsonString);

	      } else {

	        reject({
	          message: 'Http Request error',
	          url: url,
	          status: xhr.status,
	          headers: xhr.getAllResponseHeaders(),
	          event: event
	        });

	      }

	    };

	    xhr.open(method, url, true);
	      if (method !== 'GET') {
	          xhr.setRequestHeader('Content-Type', 'application/json');
	      }
	    xhr.send(jsonString);
	    
	  })
	}

	// internals

	// graphic card max supported texture size
	var MAX_TEXTURE_SIZE = runtime.has.webGl ? runtime.webGl.maxTextureSize || 2048 : 2048;

	// helpers

	function checkPowerOfTwo (value) {
	  return ( value & ( value - 1 ) ) === 0 && value !== 0
	}

	function nearestPowerOfTwoOrMaxTextureSize (n) {
	  // max texture size supported by vga
	    if (n > MAX_TEXTURE_SIZE) {
	        return MAX_TEXTURE_SIZE
	    }
	  // next best power of two
	  var l = Math.log(n) / Math.LN2;
	  return Math.pow(2, Math.round(l))
	}

	function resizeImage (image, url) {

	  var width = nearestPowerOfTwoOrMaxTextureSize(image.width);
	  var height = nearestPowerOfTwoOrMaxTextureSize(image.height);

	  var canvas = document.createElement('canvas');
	  canvas.width = width;
	  canvas.height = height;
	  canvas.getContext('2d').drawImage(image, 0, 0, width, height);

	  console.log('Image size not compatible. Image has been resized from ' + image.width + 'x' + image.height + 'px to ' + canvas.width + 'x' + canvas.height +
	  'px.\n' + url);

	  return canvas
	}

	// function

	function sendTextureRequest (url, type, dataType, data, progress, s3Key) {
	  return new bluebird_1(function (resolve, reject) {
	    
	    var image = document.createElement('img');
	    image.crossOrigin = 'Anonymous';

	    image.onload = function () {
	      
	      var texture = new THREE.Texture();

	      texture.sourceFile = url;
	      texture.url = url;

	      // image size compatibility check

	      var isPowerOfTwo = (checkPowerOfTwo(image.width) && checkPowerOfTwo(image.height));
	      var isNotTooBig = (image.width <= MAX_TEXTURE_SIZE && image.height <= MAX_TEXTURE_SIZE);

	      if (isPowerOfTwo && isNotTooBig) {

	        // use image as it is
	        texture.image = image;

	      } else {

	        // resize image to make it compatible
	        texture.image = resizeImage(image, url);
	        // add url reference
	        texture.image.src = url;

	      }
	      
	      resolve(texture);

	    };

	    var triedWithCacheBust = false;
	    image.onerror = function () {
	      if(triedWithCacheBust) {
	        reject('Error loading texture ' + url);
	      } else {
	        // try again with cache busting to avoid things like #1510
	        triedWithCacheBust = true;
	        if (url.indexOf('?') === -1) {
	          url += '?cacheBust=' + new Date().getTime();
	        } else {
	          url += '&cacheBust=' + new Date().getTime();
	        }
	        image.src = url;
	      }
	    };

	    // initiate image loading
	    image.src = url;

	  })
	}

	var DDS_MAGIC = 0x20534444;

	var DDSD_MIPMAPCOUNT = 0x20000;

	var DDSCAPS2_CUBEMAP = 0x200;

	var DDPF_FOURCC = 0x4;

	// internals

	var FOURCC_DXT1 = fourCCToInt32("DXT1");
	var FOURCC_DXT3 = fourCCToInt32("DXT3");
	var FOURCC_DXT5 = fourCCToInt32("DXT5");

	// functions

	function fourCCToInt32 (value) {

	  return value.charCodeAt(0) +
	    (value.charCodeAt(1) << 8) +
	    (value.charCodeAt(2) << 16) +
	    (value.charCodeAt(3) << 24);

	}

	function int32ToFourCC (value) {

	  return String.fromCharCode(
	    value & 0xff,
	    (value >> 8) & 0xff,
	    (value >> 16) & 0xff,
	    (value >> 24) & 0xff
	  );
	}

	function loadARGBMip (buffer, dataOffset, width, height) {
	  var dataLength = width * height * 4;
	  var srcBuffer = new Uint8Array(buffer, dataOffset, dataLength);
	  var byteArray = new Uint8Array(dataLength);
	  var dst = 0;
	  var src = 0;
	  for (var y = 0; y < height; y++) {
	    for (var x = 0; x < width; x++) {
	      var b = srcBuffer[ src ];
	      src++;
	      var g = srcBuffer[ src ];
	      src++;
	      var r = srcBuffer[ src ];
	      src++;
	      var a = srcBuffer[ src ];
	      src++;
	      byteArray[ dst ] = r;
	      dst++;  //r
	      byteArray[ dst ] = g;
	      dst++;  //g
	      byteArray[ dst ] = b;
	      dst++;  //b
	      byteArray[ dst ] = a;
	      dst++;  //a
	    }
	  }
	  return byteArray;
	}

	function parse (buffer, loadMipmaps) {

	  var dds = { mipmaps: [], width: 0, height: 0, format: null, mipmapCount: 1 };

	  var headerLengthInt = 31; // The header length in 32 bit ints

	  // Offsets into the header array

	  var off_magic = 0;

	  var off_size = 1;
	  var off_flags = 2;
	  var off_height = 3;
	  var off_width = 4;

	  var off_mipmapCount = 7;

	  var off_pfFlags = 20;
	  var off_pfFourCC = 21;
	  var off_RGBBitCount = 22;
	  var off_RBitMask = 23;
	  var off_GBitMask = 24;
	  var off_BBitMask = 25;
	  var off_ABitMask = 26;

	  var off_caps = 27;
	  var off_caps2 = 28;
	  var off_caps3 = 29;
	  var off_caps4 = 30;

	  // Parse header

	  var header = new Int32Array(buffer, 0, headerLengthInt);

	  if (header[ off_magic ] !== DDS_MAGIC) {

	    console.error('THREE.DDSLoader.parse: Invalid magic number in DDS header.');
	    return dds;

	  }

	  if (!header[ off_pfFlags ] & DDPF_FOURCC) {

	    console.error('THREE.DDSLoader.parse: Unsupported format, must contain a FourCC code.');
	    return dds;

	  }

	  var blockBytes;

	  var fourCC = header[ off_pfFourCC ];

	  var isRGBAUncompressed = false;

	  switch (fourCC) {

	    case FOURCC_DXT1:

	      blockBytes = 8;
	      dds.format = THREE.RGB_S3TC_DXT1_Format;
	      break;

	    case FOURCC_DXT3:

	      blockBytes = 16;
	      dds.format = THREE.RGBA_S3TC_DXT3_Format;
	      break;

	    case FOURCC_DXT5:

	      blockBytes = 16;
	      dds.format = THREE.RGBA_S3TC_DXT5_Format;
	      break;

	    default:

	      if (header[ off_RGBBitCount ] == 32
	        && header[ off_RBitMask ] & 0xff0000
	        && header[ off_GBitMask ] & 0xff00
	        && header[ off_BBitMask ] & 0xff
	        && header[ off_ABitMask ] & 0xff000000) {
	        isRGBAUncompressed = true;
	        blockBytes = 64;
	        dds.format = THREE.RGBAFormat;
	      } else {
	        console.error('THREE.DDSLoader.parse: Unsupported FourCC code ', int32ToFourCC(fourCC));
	        return dds;
	      }
	  }

	  dds.mipmapCount = 1;

	  if (header[ off_flags ] & DDSD_MIPMAPCOUNT && loadMipmaps !== false) {

	    dds.mipmapCount = Math.max(1, header[ off_mipmapCount ]);

	  }

	  //TODO: Verify that all faces of the cubemap are present with DDSCAPS2_CUBEMAP_POSITIVEX, etc.

	  dds.isCubemap = header[ off_caps2 ] & DDSCAPS2_CUBEMAP ? true : false;

	  dds.width = header[ off_width ];
	  dds.height = header[ off_height ];

	  var dataOffset = header[ off_size ] + 4;

	  // Extract mipmaps buffers

	  var width = dds.width;
	  var height = dds.height;

	  var faces = dds.isCubemap ? 6 : 1;

	  for (var face = 0; face < faces; face++) {

	    for (var i = 0; i < dds.mipmapCount; i++) {

	      var byteArray, dataLength;
	      if (isRGBAUncompressed) {
	        byteArray = loadARGBMip(buffer, dataOffset, width, height);
	        dataLength = byteArray.length;
	      } else {
	        dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;
	        byteArray = new Uint8Array(buffer, dataOffset, dataLength);
	      }

	      var mipmap = { "data": byteArray, "width": width, "height": height };
	      dds.mipmaps.push(mipmap);

	      dataOffset += dataLength;

	      width = Math.max(width * 0.5, 1);
	      height = Math.max(height * 0.5, 1);

	    }

	    width = dds.width;
	    height = dds.height;

	  }

	  return dds;

	}

	function log2 (x) {
	  return Math.log(x) / Math.LN2
	}

	// load function

	function sendDdsTextureRequest (url, type, dataType, data, progress, s3Key) {
	  return new bluebird_1(function (resolve, reject) {

	    var xhr = new XMLHttpRequest();

	    xhr.onload = function (event) {

	      if (xhr.status >= 200 && xhr.status < 300) {

	        var buffer = xhr.response,
	          dds;

	        // parse data
	        try {
	          dds = parse(buffer, true);
	        } catch (e) {
	          var message = 'Error Loading DDS Texture\n' + url + '\n' + e.name + ': ' + e.message;
	          console.error(message);
	          reject(message);
	          return
	        }

	        // See OpenGL ES 2.0.25 p. 81 paragraph 1 for the number of required mipmaps.
	        var mipmapCount = log2(Math.max(dds.width, dds.height)) + 1;
	        if (dds.mipmapCount != mipmapCount) {
	          console.error('Reading DDS texture failed: ' + url + '\nmipmaps counted: ' + dds.mipmapCount + ', should be: ' + mipmapCount +
	            '\nPlease make sure you have mipmap generation enabled when creating DDS textures from images.');
	          reject('Error parsing DDS. Wrong mipmaps count. ' + url);
	          return
	        }

	        // create compressed texture
	        var texture = new THREE.CompressedTexture();

	        texture.format = dds.format;
	        texture.mipmaps = dds.mipmaps;
	        texture.image.width = dds.width;
	        texture.image.height = dds.height;
	        texture.image.src = url;
	        texture.sourceFile = url;
	        texture.url = url;
	        texture.bufferByteLength = buffer.byteLength;

	        // gl.generateMipmap fails for compressed textures
	        // mipmaps must be embedded in the DDS file
	        // or texture filters must not use mipmapping
	        texture.generateMipmaps = false;

	        resolve(texture);

	      } else {
	        reject({
	          message: 'Http Request error',
	          url: url,
	          status: xhr.status,
	          headers: xhr.getAllResponseHeaders(),
	          event: event
	        });
	      }

	    };
	    xhr.onerror = function (event) {
	      reject({
	        message: 'Http Request error',
	        url: url,
	        status: xhr.status,
	        headers: xhr.getAllResponseHeaders(),
	        event: event
	      });
	    };

	    xhr.open('GET', url, true);
	    xhr.crossOrigin = "Anonymous";
	    xhr.responseType = 'arraybuffer';
	    xhr.send(null);

	  })
	}

	// main

	function request(args) {
	  // API
	  var url = args.url || args.uri;
	  var method = args.method || 'GET';
	  var body = args.body;
	  var type = getType(args.type, url, body);
	  
	  // TODO: add support for additional params
	  //var headers = args.headers || {}
	  //var qs = args.qs

	  //var noCache = !!args.noCache

	  // TODO: validate params
	  if (sendRequestByType[type]) {
	    return sendRequestByType[type](url, method, type, body)
	  } else {
	    return bluebird_1.reject('Type '+type+' not supported.')
	  }

	}

	// shortcuts

	request.get = function get (url) {
	  return request({
	    method: 'GET',
	    url: url
	  })
	};

	request.getTexture = function getTexture (url) {
	  return request({
	    method: 'GET',
	    type: 'texture',
	    url: url
	  })

	};

	// private properties and methods

	var sendRequestByType = {
	  'text': sendBasicRequest,
	  'arrayBuffer': sendBasicRequest,
	  'blob': sendBasicRequest,
	  'json': sendJsonRequest, // IE11 does not support responseType=json
	  //'ddsTexture': getDdsTexture,
	  'imageTexture': sendTextureRequest,
	  'ddsTexture': sendDdsTextureRequest
	  // TODO: add support for following types
	  //'document': sendDocumentRequest,
	  //'urlEncoded': sendUrlEncodedRequest,
	  //'formData': sendFormDataRequest,
	  //'img': sendImgRequest
	};

	var typeByExtension = {
	  'buffer': 'arrayBuffer',
	  'txt': 'text',
	  'json': 'json'
	  // TODO: enable these once support for those types is provided
	  //'jpg': 'img',
	  //'jpeg': 'img',
	  //'jpe': 'img',
	  //'png': 'img',
	  //'gif': 'img',
	  //'xml': 'document',
	  //'html': 'document',
	  //'svg': 'document'
	};

	var textureTypeByExtension = {
	  '.dds': 'ddsTexture',
	  '.jpg': 'imageTexture',
	  '.jpeg': 'imageTexture',
	  '.jpe': 'imageTexture',
	  '.png': 'imageTexture',
	  '.gif': 'imageTexture',
	  '.svg': 'imageTexture'
	};

	function getType (type, url, data) {
	  if (!url) return 'text'
	  var fileName = url.split('/').pop();
	  var extension = fileName.split('.').pop();

	  if (!type) {

	    if (data) {
	      // estimate dataType from data
	      if (data instanceof FormData) {
	        type = 'form-data';
	      } else if (_.isObject(data)) {
	        type = 'url-encoded';
	      }
	    } else {
	      // estimate dataType from URL
	      type = dataTypeFromUrl(url);
	    }

	    // fallback to text request
	    if (!type) {
	      type = 'text';
	    }

	  } else if (type === 'texture') {

	    // estimate texture type from URL
	    type = getTextureTypeFromUrl(url);

	  }

	  return type
	}

	var typeByExtensionKeys = Object.keys(typeByExtension);
	function dataTypeFromUrl (url) {

	  var extension, i, l, urlLow = url.toLowerCase();

	  for (i= 0, l=typeByExtensionKeys.length; i<l; i++ ) {
	    extension = typeByExtensionKeys[i];
	    if (urlLow.substring( urlLow.length - extension.length ) === extension) {
	      return typeByExtension[ extension ]
	    }
	  }

	  return 'text'

	}

	function getTextureTypeFromUrl (url, isTexture) {

	  // get file extension
	  var search = url.match(/\.[A-Za-z]+(?=\?|$)/i);

	  if (search) {
	    var extension = search[ 0 ].toLowerCase();
	    return textureTypeByExtension[ extension ]
	  } else {
	    return false
	  }

	}

	/*

	 PERFORMANCE CRITICAL CODE

	 readability may suffer from performance optimization
	 ask tomas-polach if you have questions

	*/

	// static method, @memberof View

	// constants

	var THREEJS_TEXTURE_TYPES_MAP = {
	  // hi-res textures
	  'mapDiffuse': 'map',
	  'mapSpecular': 'specularMap',
	  'mapNormal':'normalMap',
	  'mapAlpha':'alphaMap',
	  'mapLight':'lightMap',
	  // lo-res textures
	  'mapDiffusePreview': 'map',
	  'mapSpecularPreview': 'specularMap',
	  'mapNormalPreview':'normalMap',
	  'mapAlphaPreview':'alphaMap',
	  'mapLightPreview':'lightMap'
	};
	var WEBGL_WRAP_TYPES = {
	  repeat: 1000,
	  mirror: 1002,
	  clamp: 1001
	};
	// RepeatWrapping: 1000 / ClampToEdgeWrapping: 1001 / MirroredRepeatWrapping: 1002

	// helpers

	function onError (e) {
	  console.error('Texture could not been loaded: ', e);
	}

	var textureRefCount = {};

	function countTextureReference ( key ) {
	  if ( key !== undefined ) {
	    if (textureRefCount[ key ]) {
	      textureRefCount[ key ]++;
	    } else {
	      textureRefCount[ key ] = 1;
	    }
	  }
	}

	function disposeIfPossible () {
	  var texture3d = this;
	  var key = this.url;
	  if (key) {
	    if (textureRefCount[ key ]) {
	      textureRefCount[ key ]--;
	      if (textureRefCount[ key ] === 0) {
	//          console.log('dispose texture', texture3d.url)
	        texture3d.dispose();
	//          texture3d.needsUpdate = true
	      }
	    } else {
	//        console.warn('texture not in cache ' + key)
	      texture3d.dispose();
	    }
	  } else {
	    texture3d.dispose();
	//      texture3d.needsUpdate = true
	  }
	}

	// class

	function loadTextures ( queue, TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, resetTexturesOnLoadStart) {

	  // new textures

	  var
	    texture3dKeys = [],
	    textureKeys = [],
	    texturePromises = [],
	    textureCount = 0,
	    textureS3Key,
	    texture3d,
	    textureType3d,
	    textureType,
	    needsUpdate,
	    hasUv1Textures = false,
	    geometry3d = mesh3d ? mesh3d.geometry : null,
	    attributes3d = geometry3d ? geometry3d.attributes : null,
	    hasUvVertices = attributes3d && attributes3d.uv && attributes3d.uv.count > 0,
	    hasUv2Vertices = attributes3d && attributes3d.uv2 && attributes3d.uv2.count > 0,
	    i,
	    l;

	  // UV1 textures

	  for (i = 0, l = TEXTURE_TYPES.UV1.length; i < l; i++) {
	    textureType = TEXTURE_TYPES.UV1[ i ];
	    textureS3Key = _attributes[ textureType ];
	    textureType3d = THREEJS_TEXTURE_TYPES_MAP[ textureType ];
	    texture3d = material3d[ textureType3d ];

	    if (textureS3Key) {
	      if (hasUvVertices) {
	        hasUv1Textures = true;
	      } else {
	        console.error('Texture ' + textureS3Key + ' could not be assigned because geometry has no UV vertices.');
	        continue
	      }
	    }

	    if (textureS3Key) {

	      needsUpdate = true;

	      // update wrap
	      wrap = WEBGL_WRAP_TYPES[ _attributes.wrap ] || WEBGL_WRAP_TYPES[ 'repeat' ];
	      if (texture3d && wrap !== texture3d.wrapS) {
	        texture3d.wrapS = wrap;
	        texture3d.wrapT = wrap;
	        texture3d.needsUpdate = true;
	      }

	      // don't reload texture if files are of same origin
	      if (
	        texture3d
	        && texture3d.url
	        && textureS3Key === texture3d.url
	      ) {
	        needsUpdate = false;
	      }

	      if (needsUpdate && texture3d && resetTexturesOnLoadStart) {
	        // dispose old texture
	        if (material3d[ textureType3d ] && material3d[ textureType3d ].disposeIfPossible) {
	          material3d[ textureType3d ].disposeIfPossible();
	        }
	        material3d[ textureType3d ] = null;
	      }

	      if (needsUpdate) {
	        // load new texture
	        texturePromises[ textureCount ] = request.getTexture(textureS3Key, { queue: queue }).catch(onError);
	        textureKeys[ textureCount ] = textureType;
	        texture3dKeys[ textureCount ] = textureType3d;
	        textureCount++;
	        material3d.needsUpdate = true;
	      }

	    } else if (material3d[ textureType3d ]) {

	      // no new texture: just dispose old texture
	      if (material3d[ textureType3d ] && material3d[ textureType3d ].disposeIfPossible) {
	        material3d[ textureType3d ].disposeIfPossible();
	      }
	      material3d[ textureType3d ] = null;
	      material3d.needsUpdate = true;

	    }

	  }

	  // UV1 vectors

	  if (attributes3d) {

	    // UV channel 1

	    if (hasUv1Textures) {

	      // resize UV array

	      if (_attributes.size) {

	        var
	          targetScaleU = _attributes.size[ 0 ],
	          targetScaleV = _attributes.size[ 1 ],
	          currentScaleU = attributes3d.uv._scaleU || 1,
	          currentScaleV = attributes3d.uv._scaleV || 1;
	        // check if uv recalculation is needed
	        if (targetScaleU !== currentScaleU || targetScaleV !== currentScaleV) {
	          // remember original uv array
	          if (!attributes3d.uv._source) {
	            attributes3d.uv._source = attributes3d.uv.array;
	          }
	          // internals
	          var
	            sourceUVs = attributes3d.uv._source,
	            resizedUVs = new Float32Array(sourceUVs.length);
	          // resize array
	          for (var i = 0, l = resizedUVs.length; i < l; i += 2) {
	            resizedUVs[ i ] = sourceUVs[ i ] / targetScaleU;
	            resizedUVs[ i + 1 ] = sourceUVs[ i + 1 ] / targetScaleV;
	          }
	          // set resized array
	          attributes3d.uv.array = resizedUVs;
	          // remember size
	          attributes3d.uv._scaleU = targetScaleU;
	          attributes3d.uv._scaleV = targetScaleV;
	          // set update flag
	          attributes3d.uv.needsUpdate = true;
	        }

	      }

	    }

	    // UV channel 2

	    if (_attributes[ TEXTURE_TYPES.UV2 ]) {

	      // check uv count
	      if (hasUv2Vertices) {

	        // everything ok - load lightmap
	        textureType = TEXTURE_TYPES.UV2;
	        textureS3Key = _attributes[ textureType ];
	        texturePromises[ textureCount ] = request.getTexture(textureS3Key, { queue: queue }).catch(onError);
	        textureKeys[ textureCount ] = textureType;
	        texture3dKeys[ textureCount ] = THREEJS_TEXTURE_TYPES_MAP[ textureType ];
	        textureCount++;

	      } else {

	        console.error('Lightmap ' + _attributes[ TEXTURE_TYPES.UV2 ] + ' could not be assigned because geometry has no lightmap UV (UV2) vertices.');

	      }

	    }

	  }

	  // load textures

	  var promise, wrap;
	  if (textureCount) {

	    promise = bluebird_1.all(texturePromises).then(function (textures) {

	      // assign textures
	      wrap = WEBGL_WRAP_TYPES[ _attributes.wrap ] || WEBGL_WRAP_TYPES[ 'repeat' ];
	      for (i = 0; i < textureCount; i++) {
	        // FIXME:
	        // if (
	        //   // avoid racing conditions
	        // textures[ i ] && textures[ i ].url === material3d._texturesToBeLoaded[ textureKeys[i] ] &&
	        //   // filter texture loading errors
	        // (textures[i] instanceof THREE.CompressedTexture || textures[i] instanceof THREE.Texture)
	        // ){

	          // cache
	          countTextureReference(textures[ i ].url);
	          textures[ i ].disposeIfPossible = disposeIfPossible;

	          // set texture settings
	          textures[ i ].wrapS = wrap;
	          textures[ i ].wrapT = wrap;
	          textures[ i ].anisotropy = 2;
	          // dispose previous texture
	          if (material3d[ texture3dKeys[ i ] ] && material3d[ texture3dKeys[ i ] ].disposeIfPossible) {
	            material3d[ texture3dKeys[ i ] ].disposeIfPossible();
	          }
	          // add new texture
	          material3d[ texture3dKeys[ i ] ] = textures[ i ];
	          material3d.uniforms[ texture3dKeys[ i ] ].value = textures[ i ];
	          material3d[ texture3dKeys[ i ] ].needsUpdate = true;
	        // }
	      }
	      // update material
	      material3d.needsUpdate = true;

	      // to prevent warnings: "GL ERROR :GL_INVALID_OPERATION : glDrawElements: attempt to access out of range vertices in attribute 1 "
	      // this happens when switching from a material without texture to a material with texture or vice versa
	      if ( mesh3d && mesh3d.geometry ) {
	        mesh3d.geometry.buffersNeedUpdate = true;
	        mesh3d.geometry.uvsNeedUpdate = true;
	      }

	      // render
	      if (vm) vm.viewport.render();

	    });

	  } else {

	    promise = bluebird_1.resolve();

	    // render
	    if (vm) vm.viewport.render();

	  }

	  return promise

	}

	/*

	 PERFORMANCE CRITICAL CODE

	 readability may suffer from performance optimization
	 ask tomas-polach if you have questions

	*/

	// static method, @memberof View

	// constants

	var HI_RES_TEXTURE_TYPES = {
	  UV1: [ 'mapDiffuse', 'mapSpecular', 'mapNormal', 'mapAlpha' ],
	  UV2: 'mapLight'
	};
	var LO_RES_TEXTURE_TYPES = {
	  UV1: [ 'mapDiffusePreview', 'mapSpecularPreview', 'mapNormalPreview', 'mapAlphaPreview' ],
	  UV2: 'mapLightPreview'
	};

	var DEFAULT_LIGHT_MAP_INTENSITY = 1.2;
	var DEFAULT_LIGHT_MAP_EXPOSURE = 0.6;
	var DEFAULT_LIGHT_MAP_FALLOFF = 0;

	// RepeatWrapping: 1000 / ClampToEdgeWrapping: 1001 / MirroredRepeatWrapping: 1002

	// function

	function setMaterial (args) {

	  // Args
	  var vm = args.vm;
	  var material3d = args.material3d;
	  var mesh3d = args.mesh3d;
	  var _attributes = args.attributes || {};
	  var reset = args.reset !== undefined ? args.reset : true;
	  var loadingQueuePrefix = args.loadingQueuePrefix;
	  var onFirstTextureSetLoaded = args.onFirstTextureSetLoaded;
	  var lightMapIntensity = args.lightMapIntensity;
	  var lightMapExposure = args.lightMapExposure;


	  // transparency

	  //     material3d.transparent = true
	  //     material3d.opacity = 0.55

	  // depth buffer
	  //    if (material3d.opacity < 1) {
	  //      material3d.depthWrite = false
	  //      var alphaTest = material3d.opacity - 0.001
	  //      if (alphaTest < 0) alphaTest = 0
	  //      material3d.alphaTest = alphaTest
	  //    }

	  // specular coefficient

	  material3d.shininess = (_attributes.specularCoef !== undefined) ? (_attributes.specularCoef ) : 0.1;
	  material3d.uniforms.shininess.value = material3d.shininess;

	  // colors
	  var diffuse = {};
	  if (_attributes.colorDiffuse) {
	    diffuse.r = _attributes.colorDiffuse[ 0 ];
	    diffuse.g = _attributes.colorDiffuse[ 1 ];
	    diffuse.b = _attributes.colorDiffuse[ 2 ];
	  } else if (reset) {
	    if (_attributes.mapDiffuse ) {
	      // has diffuse texture
	      diffuse.r = 1;
	      diffuse.g = 1;
	      diffuse.b = 1;
	    } else {
	      // has NO diffuse texture
	      diffuse.r = 0.85;
	      diffuse.g = 0.85;
	      diffuse.b = 0.85;
	    }
	  }
	  material3d.diffuse = diffuse;
	  material3d.uniforms.diffuse.value = new THREE.Color(diffuse.r, diffuse.g, diffuse.b);

	  /*if (_attributes.colorAmbient) {
	    // material3d.ambient.r = _attributes.colorAmbient[ 0 ]
	    // material3d.ambient.g = _attributes.colorAmbient[ 1 ]
	    // material3d.ambient.b = _attributes.colorAmbient[ 2 ]
	  } else if (reset) {
	    // if (!material3d.ambient) {
	    //   material3d.ambient = new THREE.Color()
	    // }
	    // material3d.ambient.r = material3d.color.r
	    // material3d.ambient.g = material3d.color.g
	    // material3d.ambient.b = material3d.color.b
	  }*/

	  var specular = {};
	  if (_attributes.colorSpecular) {
	    specular.r = _attributes.colorSpecular[ 0 ];
	    specular.g = _attributes.colorSpecular[ 1 ];
	    specular.b = _attributes.colorSpecular[ 2 ];
	  } else if (reset) {
	    specular.r = 0.25;
	    specular.g = 0.25;
	    specular.b = 0.25;
	  }
	  material3d.specular = specular;
	  material3d.uniforms.specular.value = new THREE.Color(specular.r, specular.g, specular.b);

	  var emissive = {};
	  if (_attributes.colorEmissive) {
	    emissive.r = _attributes.colorEmissive[ 0 ];
	    emissive.g = _attributes.colorEmissive[ 1 ];
	    emissive.b = _attributes.colorEmissive[ 2 ];
	  } else if (_attributes.lightEmissionCoef) {
	    var emissiveIntensity = _attributes.lightEmissionCoef / 10;
	    if (_attributes.colorDiffuse) {
	      emissive.r = _attributes.colorDiffuse[ 0 ];
	      emissive.g = _attributes.colorDiffuse[ 1 ];
	      emissive.b = _attributes.colorDiffuse[ 2 ];
	    } else {
	      emissive.r = 1.0;
	      emissive.g = 1.0;
	      emissive.b = 1.0;
	    }
	    emissive.r *= emissiveIntensity;
	    emissive.g *= emissiveIntensity;
	    emissive.b *= emissiveIntensity;

	  } else if (reset) {
	    emissive.r = 0;
	    emissive.g = 0;
	    emissive.b = 0;
	  }
	  material3d.emissive = emissive;
	  material3d.uniforms.emissive.value = new THREE.Color(emissive.r, emissive.g, emissive.b);

	  // lightmap settings
	  if (_attributes.mapLight || _attributes.mapLightPreview) {
	    // Fallback lightmap intensity and exposure values
	    var lmi = DEFAULT_LIGHT_MAP_INTENSITY;
	    var lme = DEFAULT_LIGHT_MAP_EXPOSURE;

	    if (lightMapIntensity !== undefined && lightMapIntensity != null && lightMapIntensity !== -100) {
	      lmi = lightMapIntensity;
	    } else if (_attributes.mapLightIntensity !== undefined) {
	      lmi = _attributes.mapLightIntensity;
	    }

	    if (lightMapExposure !== undefined && lightMapExposure != null && lightMapExposure !== -100) {
	      lme = lightMapExposure;
	    } else if (_attributes.mapLightCenter !== undefined) {
	      // in data3d lightMapExposure is mapLightCenter
	      lme = _attributes.mapLightCenter;
	    }

	    material3d.lightMapIntensity = (lmi >= 0.0) ? lmi : 0.0;
	    material3d.lightMapExposure = lme;
	    material3d.lightMapFalloff = (_attributes.mapLightFalloff !== undefined) ? _attributes.mapLightFalloff : DEFAULT_LIGHT_MAP_FALLOFF;
	    material3d.uniforms.lightMapIntensity.value = material3d.lightMapIntensity;
	    material3d.uniforms.lightMapExposure.value = material3d.lightMapExposure;
	    material3d.uniforms.lightMapFalloff.value = material3d.lightMapFalloff;
	  }

	  // shadows

	  if (mesh3d) {
	    // (2017/04/05) Interiors are currently not shadow receivers, as this
	    // would produce many artifacts. However, flat and thin objects laying
	    // very close to the floor (such as carpets) need to be excepted from
	    // that rule. This is a temporary way to achieve that.
	    if (!mesh3d.geometry.boundingBox)
	      mesh3d.geometry.computeBoundingBox();
	    var boundingBox = mesh3d.geometry.boundingBox;
	    var position    = boundingBox.min.clone();
	    position.applyMatrix4(mesh3d.matrixWorld);
	    var meshIsFlat          = boundingBox.max.y - boundingBox.min.y < 0.05;
	    var meshIsOnGroundLevel = position.y < 0.1;
	    mesh3d.castShadow    = !(meshIsFlat && meshIsOnGroundLevel) && _attributes.castRealTimeShadows;
	    mesh3d.receiveShadow =  (meshIsFlat && meshIsOnGroundLevel) || _attributes.receiveRealTimeShadows;
	    mesh3d.material.needsUpdate = true; // without this, receiveShadow does not become effective
	  }

	  // load textures

	  // remember current textures (avoiding racing conditions between texture loading and material updates)
	  material3d._texturesToBeLoaded = {
	    // hires textures
	    mapDiffuse: _attributes.mapDiffuse,
	    mapSpecular: _attributes.mapSpecular,
	    mapNormal: _attributes.mapNormal,
	    mapAlpha: _attributes.mapAlpha,
	    mapLight: _attributes.mapLight,
	    // lores textures
	    mapDiffusePreview: _attributes.mapDiffusePreview,
	    mapSpecularPreview: _attributes.mapSpecularPreview,
	    mapNormalPreview: _attributes.mapNormalPreview,
	    mapAlphaPreview: _attributes.mapAlphaPreview,
	    mapLightPreview: _attributes.mapLightPreview
	  };

	  var
	    loadingTexturesPromise,
	    loadingQueue,
	    isLoadingLoResTextures,
	    hasLoResTextures = _attributes.mapDiffusePreview || _attributes.mapSpecularPreview || _attributes.mapNormalPreview || _attributes.mapAlphaPreview || _attributes.mapLightPreview,
	    // hasHiResTextures = _attributes.mapDiffuse || _attributes.mapSpecular || _attributes.mapNormal || _attributes.mapAlpha || _attributes.mapLight,
	    // TODO: readd hiResTextures configs
	    // hiResTexturesEnabled = !configs.isMobile && vm.viewport.a.hiResTextures && configs.compatibility.webglCompressedTextures
	    hiResTexturesEnabled = !runtime.isMobile && runtime.webGl.supportsDds;

	  if (!hiResTexturesEnabled || (hasLoResTextures && !material3d.firstTextureLoaded)) {
	    if (loadingQueuePrefix) {
	      loadingQueue = loadingQueuePrefix + 'TexturesLoRes';
	    }
	    loadingTexturesPromise = loadTextures(loadingQueue, LO_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false);
	    isLoadingLoResTextures = true;
	  } else {
	    if (loadingQueuePrefix) {
	      loadingQueue = loadingQueuePrefix + 'TexturesHiRes';
	    }
	    loadingTexturesPromise = loadTextures(loadingQueue, HI_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false);
	    isLoadingLoResTextures = false;
	  }


	  // set opacity after textures have loaded
	  loadingTexturesPromise.then(function(){

	    if (_attributes.opacity !== undefined && _attributes.opacity < 1) {
	      // 0 = fully transparent, 1 = non-transparent
	      material3d.transparent = true;
	      material3d.opacity = _attributes.opacity;
	    } else if (_attributes.mapAlpha) {
	      // has alpha map
	      material3d.transparent = true;
	      material3d.opacity = 1;
	    } else {
	      material3d.transparent = false;
	      material3d.opacity = 1;
	    }
	    material3d.uniforms.opacity = { value: material3d.opacity };

	    // trigger callback
	    if (onFirstTextureSetLoaded) onFirstTextureSetLoaded();

	    // set onFirstTextureLoaded
	    if (hasLoResTextures) material3d.firstTextureLoaded = true;

	  });

	  // 2. load hi-res textures (if: material has preview texture set, not on mobile, hi-res enabled and supported)
	  if (isLoadingLoResTextures && hiResTexturesEnabled) {
	    loadingTexturesPromise.then(function(){
	      if (loadingQueuePrefix) {
	        loadingQueue = loadingQueuePrefix + 'TexturesHiRes';
	      }
	      loadTextures(loadingQueue, HI_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false);
	    });
	  }

	  // return texture loading promise

	  return loadingTexturesPromise
	}

	// static class, @memberof View

	// TODO: add dependencies
	// * compareArrays
	// * generateWireframeBuffer

	// class

	var Wireframe = checkDependencies({
	  three: true,
	  aframe: false
	}, function makeData3dView () {

	  function Wireframe () {

	    // internals
	    this._wireframeGeometry = new THREE.BufferGeometry();
	    this._wireframeGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(0), 3 ) );
	    this._wireframeMaterial = new THREE.LineBasicMaterial();

	    this._positions = null;
	    this._buffer = null;
	    this._thresholdAngle = 10;
	    this._thickness = 1;
	    this._color = [0,0,0];
	    this._opacity = 1;

	    // init
	    THREE.Line.call( this, this._wireframeGeometry, this._wireframeMaterial, THREE.LinePieces );

	  }

	// inherit from THREE Line prototype

	  Wireframe.prototype = Object.create( THREE.Line.prototype );
	  Wireframe.prototype.constructor = Wireframe;

	// extend with own methods

	  Wireframe.prototype.update = function (options) {

	    // API
	    var positions = options.positions;
	    //var normals = options.normals
	    var thresholdAngle = options.thresholdAngle === undefined ? this._thresholdAngle : options.thresholdAngle;
	    var thickness = options.thickness === undefined ? this._thickness : options.thickness;
	    var color = options.color === undefined ? this._color : options.color;
	    var opacity = options.opacity === undefined ? this._opacity : options.opacity;


	    if (thickness === 0) {

	      this.visible = false;

	    } else {

	      // take care of line buffer
	      var regenerateBuffer = (!this._buffer || thresholdAngle !== this._thresholdAngle || !compareArrays(this._positions, positions));
	      if (regenerateBuffer) {

	        // generate new buffer from positions
	        //var newBuffer = generateWireframeBuffer( positions, thresholdAngle )
	        var newBuffer = new Float32Array(27);
	        if (newBuffer.length) {
	          this._wireframeGeometry.attributes.position.array = newBuffer;
	          this._wireframeGeometry.attributes.position.needsUpdate = true;
	          this.visible = true;
	        } else {
	          this.visible = false;
	        }
	        // remember settings
	        this._buffer = newBuffer;
	        this._positions = positions;
	        this._thresholdAngle = thresholdAngle;

	      } else if (this._thickness === 0) {

	        // was hidden
	        this.visible = true;

	      }

	      // update material
	      this._wireframeMaterial.color.r = color[ 0 ];
	      this._wireframeMaterial.color.g = color[ 1 ];
	      this._wireframeMaterial.color.b = color[ 2 ];
	      this._wireframeMaterial.opacity = opacity;
	      this._wireframeMaterial.linewidth = thickness;
	      // remember settings
	      this._color = color;
	      this._opacity = opacity;

	    }

	    this._thickness = thickness;

	  };

	  Wireframe.prototype.destroy = function () {

	    this._wireframeGeometry = null;
	    this._wireframeMaterial = null;

	    this._positions = null;
	    this._buffer = null;
	    this._thresholdAngle = null;
	    this._thickness = null;
	    this._color = null;
	    this._opacity = null;

	  };

	  return Wireframe

	});

	var fragmentShader = "uniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#ifdef USE_LIGHTMAP\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n\tuniform float lightMapExposure;\n\tuniform float lightMapFalloff;\n#endif\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\nvoid main() {\n    vec4 diffuseColor = vec4( diffuse, opacity );\n    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n    vec3 totalEmissiveRadiance = emissive;\n    #include <map_fragment>\n    #include <alphamap_fragment>\n    #include <alphatest_fragment>\n    #include <specularmap_fragment>\n    #include <normal_flip>\n    #include <normal_fragment>\n    #include <lights_phong_fragment>\n    GeometricContext geometry;\n    geometry.position = - vViewPosition;\n    geometry.normal = normal;\n    geometry.viewDir = normalize( vViewPosition );\n    IncidentLight directLight;\n    #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n        PointLight pointLight;\n        for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n            pointLight = pointLights[ i ];\n            getPointDirectLightIrradiance( pointLight, geometry, directLight );\n            #ifdef USE_SHADOWMAP\n            directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\n            #endif\n            RE_Direct( directLight, geometry, material, reflectedLight );\n        }\n    #endif\n    #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n        SpotLight spotLight;\n        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n            spotLight = spotLights[ i ];\n            getSpotDirectLightIrradiance( spotLight, geometry, directLight );\n            #ifdef USE_SHADOWMAP\n            directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n            #endif\n            RE_Direct( directLight, geometry, material, reflectedLight );\n        }\n    #endif\n    #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n        DirectionalLight directionalLight;\n        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n            directionalLight = directionalLights[ i ];\n            getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n            #ifdef USE_SHADOWMAP\n            directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n            #endif\n            RE_Direct( directLight, geometry, material, reflectedLight );\n        }\n    #endif\n    #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n        RectAreaLight rectAreaLight;\n        for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n            rectAreaLight = rectAreaLights[ i ];\n            RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\n        }\n    #endif\n    #if defined( RE_IndirectDiffuse )\n        vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n        #ifdef USE_LIGHTMAP\n            vec3 unit = vec3(1.0);\n            vec3 light = 2.0 * (texture2D( lightMap, vUv2 ).xyz - lightMapExposure * unit);\n            vec3 modifier = -lightMapFalloff * light * light + unit;\n            vec3 lightMapIrradiance = light * modifier * lightMapIntensity;\n            #ifndef PHYSICALLY_CORRECT_LIGHTS\n                lightMapIrradiance *= PI;\n            #endif\n            irradiance += lightMapIrradiance;\n        #endif\n        #if ( NUM_HEMI_LIGHTS > 0 )\n            for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n                irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n            }\n        #endif\n        RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n    #endif\n    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n    gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n}";

	var vertexShader = "varying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main()\n{\n  #include <uv_vertex>\n  #include <uv2_vertex>\n  #include <beginnormal_vertex>\n  #include <defaultnormal_vertex>\n  #ifndef FLAT_SHADED\n  \tvNormal = normalize( transformedNormal );\n  #endif\n  #include <begin_vertex>\n  #include <project_vertex>\n  vViewPosition = - mvPosition.xyz;\n  #include <worldpos_vertex>\n  #include <shadowmap_vertex>\n}";

	// CONFIGS

	var DEFAULT_LIGHT_MAP_INTENSITY$1 = 1.2;
	var DEFAULT_LIGHT_MAP_EXPOSURE$1 = 0.6;
	var DEFAULT_LIGHT_MAP_FALLOFF$1 = 0;

	var Io3dMaterial = checkDependencies ({
	  three: true,
	  aframe: false
	}, function makeIo3dMaterial () {

	  function Io3dMaterial( params ) {
	    THREE.ShaderMaterial.call( this, params );

	    var params = params || {};
	    this.lightMapExposure = params.lightMapExposure || DEFAULT_LIGHT_MAP_EXPOSURE$1;
	    this.lightMapFalloff = params.lightMapFalloff || DEFAULT_LIGHT_MAP_FALLOFF$1;

	    this.uniforms = THREE.UniformsUtils.merge( [
	      THREE.UniformsLib[ "lights" ],
	      THREE.UniformsLib[ "shadowmap" ],
	      { diffuse: { value: params.diffuse || new THREE.Color(1.0, 1.0, 1.0) },
	        map: { value: params.map || null },
	        specularMap: { value: params.specularMap || null },
	        alphaMap: { value: params.alphaMap || null },
	        lightMap: { value: params.lightMap || null },
	        lightMapIntensity: { value: params.lightMapIntensity || DEFAULT_LIGHT_MAP_INTENSITY$1 },
	        lightMapFalloff: { value: params.lightMapFalloff || DEFAULT_LIGHT_MAP_FALLOFF$1 },
	        lightMapExposure: { value: params.lightMapExposure || DEFAULT_LIGHT_MAP_EXPOSURE$1 },
	        normalMap: { value: params.normalMap || null },
	        shininess: { value: params.shininess || 1.0 },
	        specular: { value: params.specular || new THREE.Color(0.25, 0.25, 0.25) },
	        emissive: { value: params.emissive || new THREE.Color(0.0, 0.0, 0.0) },
	        opacity: { value: params.opacity || 1 },
	        offsetRepeat: { value: params.offsetRepeat || new THREE.Vector4( 0, 0, 1, 1) }
	      }
	    ]);

	    this.vertexShader = vertexShader;
	    this.fragmentShader = fragmentShader;
	    this.lights = true;
	  }

	  Io3dMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
	  Io3dMaterial.prototype.constructor = Io3dMaterial;

	  return Io3dMaterial

	});

	// constants

	var Data3dView = checkDependencies({
	  three: true,
	  aframe: false
	}, function makeData3dView () {
	  
	  var WEBGL_SIDE = {
	    front: 0,
	    back: 1,
	    both: 2
	  };

	  var DEG_TO_RAD = Math.PI / 180;
	  var RAD_TO_DEG = 180 / Math.PI;

	// shared variables

	  var geometry3dCache = {};

	  /**
	   * @name three.Data3dView
	   * @memberof three
	   * @param options
	   * @constructor
	   */

	  function Data3dView (options) {

	    // API
	    this.threeParent = options.parent;

	    // internals
	    this.meshKeys = [];
	    this.meshes = {};
	    this.materialKeys = [];
	    this.materials = {};
	    this._meshes3d = {}; // three meshes indexed by meshId
	    this._wireframes3d = {}; // wireframe  three meshes indexed by meshId
	    this._materials3d = {}; // three materials indexed by meshId

	  }

	  Data3dView.prototype = {

	    set: function (data3d, options) {

	      // API
	      options = options || {};
	      var
	        meshes = data3d.meshes || this.meshes,
	        meshKeys = data3d.meshKeys,
	        materials = data3d.materials || this.materials,
	        materialKeys = data3d.materialKeys,
	        loadingQueuePrefix = data3d.loadingQueuePrefix || options.loadingQueuePrefix,
	        onFirstTextureSetLoaded = options.onFirstTextureSetLoaded,
	        lightMapIntensity = options.lightMapIntensity,
	        lightMapExposure = options.lightMapExposure;

	      // internals
	      var self = this, meshId, mesh, materialId, wireframe3d, positions, uvs, uvs2, scale,
	        normals, mesh3d, geometry3d, material3d, position, rotRad, rotDeg, i, l;

	      // output
	      var promise;

	      ///////////////// meshes

	      if (meshes) {

	        // generate IDs if not provided
	        if (!meshKeys) {
	          meshKeys = Object.keys(meshes);
	        }

	        for (i = 0, l = meshKeys.length; i < l; i++) {

	          meshId = meshKeys[ i ];
	          mesh = meshes[ meshId ];

	          // internals
	          materialId = mesh.material;
	          positions = mesh.positions;
	          uvs = mesh.uvs;
	          uvs2 = mesh.uvsLightmap;
	          normals = mesh.normals;
	          position = mesh.position;
	          rotRad = mesh.rotRad;
	          rotDeg = mesh.rotDeg;
	          scale = mesh.scale;

	          // three.js materials
	          if (!self._materials3d[ meshId ]) {
	            // (one material pro mesh, because some of our mesh properties are material properties and it does not matter performance wise)
	            //material3d = new THREE.MeshPhongMaterial({ opacity: 0.5, transparent: true})
	            material3d = new Io3dMaterial();
	            material3d.name = materialId;
	            if (!materials) {
	              // there is no material properties. using default properties
	              setMaterial({ material3d: material3d });
	            }
	            self._materials3d[ meshId ] = material3d;
	          }

	          // set face side (a mesh property in our data structure, but a material property in three.js data structure)
	          self._materials3d[ meshId ].side = WEBGL_SIDE[ meshes[ meshId ].side ] || WEBGL_SIDE['front'];

	          // create three.js meshes

	          if (!self._meshes3d[ meshId ]) {

	            // create geometry
	            geometry3d = createOrReuseGeometry3d( mesh.cacheKey );
	            // create mesh
	            mesh3d = new THREE.Mesh(geometry3d, material3d);
	            mesh3d.userData = self.userData;
	            // add to parent
	            self.threeParent.add(mesh3d);
	            // remembers
	            self._meshes3d[ meshId ] = mesh3d;

	            // create a separate geometry object for wireframes
	            wireframe3d = new Wireframe();
	            // add to parent
	            //self._meshes3d[ meshId ].add(wireframe3d)
	            // remember
	            self._wireframes3d[ meshId ] = wireframe3d;

	          } else {

	            mesh3d = self._meshes3d[ meshId ];
	            geometry3d = mesh3d.geometry;

	          }

	          // apply scale
	          if (scale) {
	            mesh3d.scale.set( scale[0] , scale[1], scale[2] );
	          }

	          // apply position
	          if (rotRad) {
	            mesh3d.rotation.set( rotRad[0] , rotRad[1], rotRad[2] );
	          } else if (rotDeg) {
	            mesh3d.rotation.set( rotDeg[0] * DEG_TO_RAD, rotDeg[1] * DEG_TO_RAD, rotDeg[2] * DEG_TO_RAD );
	          }

	          // apply buffers if they are different than current buffers
	          if (geometry3d.attributes.position === undefined) {
	            geometry3d.attributes.position = new THREE.BufferAttribute(positions, 3);
	//              geometry3d.addAttribute( 'position', new THREE.BufferAttribute(positions, 3) )
	            // The bounding box of the scene may need to be updated
	            if (this.vm && this.vm.viewport && this.vm.viewport.webglView)
	              self.vm.viewport.webglView.modelBoundingBoxNeedsUpdate = true;
	          } else if (geometry3d.attributes.position.array !== positions ) {
	            geometry3d.attributes.position.array = positions;
	            geometry3d.attributes.position.needsUpdate = true;
	            // Three.js needs this to update
	            geometry3d.computeBoundingSphere();
	            // The bounding box of the scene may need to be updated
	            if (this.vm && this.vm.viewport && this.vm.viewport.webglView)
	              self.vm.viewport.webglView.modelBoundingBoxNeedsUpdate = true;
	          }
	          if (geometry3d.attributes.normal === undefined) {
	            geometry3d.attributes.normal = new THREE.BufferAttribute(normals, 3);
	//              geometry3d.addAttribute( 'normal', new THREE.BufferAttribute(normals, 3) )
	          } else if (geometry3d.attributes.normal.array !== normals ) {
	            geometry3d.attributes.normal.array = normals;
	            geometry3d.attributes.normal.needsUpdate = true;
	          }
	          // geometry3d.attributesKeys = ['position', 'normal']
	          // set uvs channel 1 (material)
	          if (uvs) {
	            if (geometry3d.attributes.uv === undefined) {
	              geometry3d.attributes.uv = new THREE.BufferAttribute(uvs, 2);
	            } else if (geometry3d.attributes.uv.array !== uvs ) {
	              geometry3d.attributes.uv.array = uvs;
	              geometry3d.attributes.uv.needsUpdate = true;
	              // remove previous scale settings
	              delete geometry3d.attributes.uv._scaleU;
	              delete geometry3d.attributes.uv._scaleV;
	              delete geometry3d.attributes.uv._source;
	            }
	            // geometry3d.attributesKeys[ 2 ] = 'uv'
	          } else if (geometry3d.attributes.uv) {
	            delete geometry3d.attributes.uv;
	          }
	          if (uvs2) {
	            if (geometry3d.attributes.uv2 === undefined) {
	              geometry3d.attributes.uv2 = new THREE.BufferAttribute(uvs2, 2);
	            } else if (geometry3d.attributes.uv2.array !== uvs2 ) {
	              geometry3d.attributes.uv2.array = uvs2;
	              geometry3d.attributes.uv2.needsUpdate = true;
	            }
	            // geometry3d.attributesKeys[ geometry3d.attributesKeys.length++ ] = 'uv2'
	          } else if (geometry3d.attributes.uv2) {
	            delete geometry3d.attributes.uv2;
	          }

	          // (2017/01/09) The WebGL buffer of the pickingColor attribute is erroneously deleted
	          // by ThreeJS (r69) in deallocateGeometry(). ThreeJS doesn't seem to account for the fact
	          // that the attribute is shared by multiple geometries. It then does not get recreated, because
	          // this function was attempting to manually set BufferGeometry.attributesKeys, missing any
	          // extra attributes such as pickingColor.
	          geometry3d.attributesKeys = Object.keys(geometry3d.attributes);

	          // update wireframe

	          if (materials[ materialId ]) {
	            self._wireframes3d[ meshId ].update({
	              positions: positions,
	              thickness: materials[ materialId ].wireframeThickness === undefined ? 0 : materials[ materialId ].wireframeThickness,
	              thresholdAngle: materials[ materialId ].wireframeThresholdAngle,
	              color: materials[ materialId ].wireframeColor,
	              opacity: materials[ materialId ].wireframeOpacity
	            });
	          }

	        }

	        // remove obsolete three.js meshes
	        var mesh, meshIds = Object.keys(self._meshes3d);
	        meshIds.forEach(function(meshId, i){
	          mesh = self._meshes3d[meshId];
	          if (!meshes[ meshId ]) {
	            // destroy wireframe geometry
	            /*
	             var wireframe3d = self._wireframes3d[ meshId ]
	             if (wireframe3d.parent) {
	             wireframe3d.parent.remove( wireframe3d )
	             wireframe3d.geometry.dispose()
	             }
	             */
	            // destroy geometry
	            var geometry3d = self._meshes3d[ meshId ].geometry;
	            disposeGeometry3dIfNotUsedElsewhere(self.meshes[ meshId ].cacheKey, geometry3d);
	            // destroy threejs mesh
	            var mesh3d = self._meshes3d[ meshId ];
	            if (mesh3d.parent) {
	              mesh3d.parent.remove( mesh3d );
	            }
	            // destroy material
	            var material3d = self._materials3d[ meshId ];
	            if (material3d.map) material3d.map.disposeIfPossible();
	            if (material3d.specularMap) material3d.specularMap.disposeIfPossible();
	            if (material3d.normalMap) material3d.normalMap.disposeIfPossible();
	            if (material3d.alphaMap) material3d.alphaMap.disposeIfPossible();
	            if (material3d.lightMap) material3d.lightMap.disposeIfPossible();
	            material3d.dispose();
	            // remove reference to destroyed 3d objects
	            delete self._meshes3d[ meshId ];
	            delete self._wireframes3d[ meshId ];
	            delete self._materials3d[ meshId ];
	          }
	        });

	        // update properties
	        self.meshKeys = meshKeys;
	        self.meshes = meshes;

	      }

	      ///////////////// materials

	      if (materials) {

	        var materialPromises = [], material;
	        for (i = 0, l = self.meshKeys.length; i < l; i++) {
	          meshId = self.meshKeys[ i ];
	          materialId = self.meshes[ meshId ].material;

	          // material attributes
	          material = materials[ materialId ];
	          if (material && Object.keys(material).length) {
	            // set material
	            materialPromises[ i ] = setMaterial({
	              vm: self.vm,
	              loadingQueuePrefix: loadingQueuePrefix,
	              mesh3d: self._meshes3d[ meshId ],
	              material3d: self._materials3d[ meshId ],
	              attributes: materials[ materialId ],
	              onFirstTextureSetLoaded: onFirstTextureSetLoaded,
	              lightMapIntensity: lightMapIntensity,
	              lightMapExposure: lightMapExposure
	            });
	          }

	        }

	        // output
	        promise = bluebird_1.all(materialPromises);

	        // update properties
	        self.materialKeys = materialKeys;
	        self.materials = materials;

	      }

	      ///////////////// return

	      if (!promise) {
	        promise = bluebird_1.resolve();
	      }

	      return promise.then(function(){
	        if (self.isDestroyed) return
	        //self.vm.viewport.render()
	      })

	    },

	    hasMeshes: function hasMeshes() {
	      return Object.keys(this._meshes3d).length > 0
	    },

	    setMeshes: function(meshes){
	      this.set({
	        meshes: meshes
	      });
	    },

	    setMaterials: function(materials, options){
	      this.set({
	        materials: materials
	      }, options);
	    },

	    reset: function(){

	      this.set({
	        meshes: {},
	        materials: {}
	      });

	    },

	    destroy: function(){

	      this.isDestroyed = true;

	      this.reset();

	      this.vm = null;
	      this.threeParent = null;
	      this.userData = null;

	      this.threeParent = null;

	      // internals
	      this.meshKeys = null;
	      this.meshes = null;
	      this.materialKeys = null;
	      this.materials = null;
	      this._meshes3d = null;
	      this._materials3d = null;

	    }

	  };

	// helpers

	  function createOrReuseGeometry3d( key ) {
	    if (key) {
	      // use cache
	      if (geometry3dCache[ key ]) {
	        geometry3dCache[ key ].refCount++;
	      } else {
	        geometry3dCache[ key ] = {
	          geometry3d: new THREE.BufferGeometry(),
	          refCount: 1
	        };
	      }
	      return geometry3dCache[ key ].geometry3d
	    } else {
	      // no key no cache
	      return new THREE.BufferGeometry()
	    }
	  }

	  function disposeGeometry3dIfNotUsedElsewhere( key, geometry3d ) {
	    if (key) {
	      // involve cache
	      if (geometry3dCache[ key ]) {
	        geometry3dCache[ key ].refCount--;
	        if (geometry3dCache[ key ].refCount < 1) {
	          geometry3dCache[ key ].geometry3d.dispose();
	          delete geometry3dCache[ key ];
	        }
	      } else {
	        // (2017/01/09) See comment in ThreeView.set()
	        // if (geometry3d.attributes.pickingColor)
	        //  delete geometry3d.attributes['pickingColor'];
	        geometry3d.dispose();
	      }
	    } else {
	      // no key bo cache
	      // (2017/01/09) See comment in ThreeView.set()
	      // if (geometry3d.attributes.pickingColor)
	      //   delete geometry3d.attributes['pickingColor'];
	      geometry3d.dispose();
	    }
	  }

	  return Data3dView

	});

	var fetch$1 = (function(){

	  if (runtime.isNode) {
	    return require('node-fetch')
	  } else if (typeof fetch !== 'undefined') {
	    return fetch
	  } else {
	    console.warn('Missing global fetch API.');
	    return function() {
	      throw new Error('Missing global fetch API.')
	    }
	  }

	})();

	var PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	/**
	 * Generate an UUID as specified in RFC4122
	 */

	var uuid = {};

	uuid.generate = function generateUuid () {
	  var d = Date.now();
	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	  });
	  return uuid
	};

	/**
	 * Validates UUID as specified in RFC4122
	 */

	uuid.validate = function validateUuid (str) {
	  if (!str || typeof str !== "string") return false
	  return PATTERN.test(str)
	};

	// main

	function JsonRpc2Client () {

	  this._openRequests = {}; // open request cache (indexed by request id)
	  this._closedRequestIds = [];

	}

	JsonRpc2Client.prototype = {

	  // private methods

	  _handleError: function (message, additionalInfo) {
	    console.error(message, additionalInfo);
	  },

	  _closeRequest: function(id) {
	    // remove request from open request cache
	    delete this._openRequests[ id ];
	    // remember closed request
	    this._closedRequestIds.push(id);
	  },

	  // public methods

	  createRequest: function (methodName, params) {

	    var self = this;

	    var id = uuid.generate();
	    var timestamp = Date.now();
	    var message = {
	      jsonrpc: '2.0',
	      method: methodName,
	      params: params,
	      id: id
	    };
	    var request = {
	      id: id,
	      message: message,
	      timestamp: timestamp
	    };
	    var promise = new bluebird_1(function(resolve, reject){
	      request._resolve = resolve;
	      request._reject = reject;
	      request.cancel = reject;
	    });
	    request.promise = promise;

	    // remember open request
	    self._openRequests[ id ] = request;

	    // handle closing of request independent of promise fate
	    promise.finally(function(){
	      self._closeRequest(id);
	    }).catch(function(){
	      self._closeRequest(id);
	    });

	    // return request
	    return request

	  },

	  handleResponse: function (response) {

	    var id = response.id;
	    var request = this._openRequests[ id ];

	    if (id === undefined) {
	      // not valid JSON-RPC2 response
	      if (runtime.isDebugMode) console.error('Incoming message is not a valid JSON-RPC2 response (ID should be present as string, number or null).', response);

	    } else if (request) {

	      // response to an open request
	      if (response.error) {
	        if (response.error.message) {
	          // valid JSON-RPC2 error message. log only in debug mode
	          if (runtime.isDebugMode) console.error('API error response: "'+response.error.message+'"\nResponse JSON-RPC2 ID: '+id+'\nOriginal JSON-RPC2 request: '+JSON.stringify(request.message, null, 2));
	          request._reject(response.error.message);
	        } else {
	          // non-standard (unexpected) error: log everything into console
	          console.error('API error (not JSON-RPC2 standard): '+JSON.stringify(response)+'\nOriginal JSON-RPC2 request: '+JSON.stringify(request.message, null, 2));
	          request._reject('Undefined Error. Check console for details.');
	        }
	      } else {
	        // success
	        request._resolve(response.result);
	      }

	    } else if (this._closedRequestIds.indexOf(id) !== -1) {
	      // Request has been closed already or timed out
	      if (runtime.isDebugMode) console.error('JSON-RPC2 request has already been responded, canceled or timed out.', id);

	    } else if (id === null) {
	      // id = null (valid according to JSON-RPC2 specs. but can not be matched with request. should be avoided!)
	      if (runtime.isDebugMode) console.error('Incoming JSON-RPC2 response has ID = null.', response);

	    } else {
	      // unknown id
	      if (runtime.isDebugMode) console.error('Incoming JSON-RPC2 response has an unknown ID.', id);

	    }

	  }

	};

	// import cache from './common/promise-cache.js'

	// internals
	var rpcClient = new JsonRpc2Client();

	// main

	// TODO: add api.onMethod('methodName')
	// TODO: add api.onNotification('methodName')

	function callService (methodName, params, options) {

	  // API
	  params = params || {};
	  options = options || {};
	  var secretApiKey = options.secretApiKey || configs.secretApiKey;
	  var publishableApiKey = options.publishableApiKey || configs.publishableApiKey;

	  // try cache
	  // var cacheKey
	  // if (useCache) {
	  //   cacheKey = JSON.stringify([methodName, params, options])
	  //   var promiseFromCache = cache.get(cacheKey)
	  //   if (promiseFromCache) {
	  //     return promiseFromCache
	  //   }
	  // }

	  // internals
	  var rpcRequest = rpcClient.createRequest(methodName, params);

	  sendHttpRequest(rpcRequest, secretApiKey, publishableApiKey);

	  // add to cache
	  // if (useCache) {
	  //   cache.add(cacheKey, rpcRequest.promise)
	  // }

	  return rpcRequest.promise

	}

	function sendHttpRequest (rpcRequest, secretApiKey, publishableApiKey) {

	  var isTrustedOrigin = ( runtime.isBrowser && window.location.href.match(/^[^\:]+:\/\/([^\.]+\.)?(3d\.io|archilogic.com|localhost)(:\d+)?\//) );
	  var headers = {
	    'Content-Type': 'application/json',
	    'Accept': 'application/json'
	  };
	  if (secretApiKey) headers['X-Secret-Key'] = secretApiKey;
	  if (publishableApiKey) headers['X-Publishable-Key'] = publishableApiKey;

	  // send request
	  fetch$1(configs.servicesUrl, {
	    body: JSON.stringify(rpcRequest.message),
	    method: 'POST',
	    headers: headers,
	    credentials: (isTrustedOrigin ? 'include' : 'omit' ) //TODO: Find a way to allow this more broadly yet safely
	  }).then(function (response) {
	    // try to parse JSON in any case because valid JSON-RPC2 errors do have error status too
	    response.json().then(function onParsingSuccess(data){
	      // rpc client will handle JSON-RPC2 success messages and errors and resolve or reject prcRequest promise accordingly
	      rpcClient.handleResponse(data);
	    }).catch(function onParsingError(){
	      // response is not a valid json error message. (most likely a network error)
	      var errorMessage = 'API request to '+configs.servicesUrl+' failed: '+response.status+': '+response.statusText+'\nOriginal JSON-RPC2 request: '+JSON.stringify(rpcRequest.message, null, 2);
	      console.error(errorMessage);
	      rpcRequest.cancel(errorMessage);
	    });
	  });

	}

	var data3dComponent = {

	  schema: {
	    url: {
	      type: 'string',
	      default: ''
	    },
	    key: {
	      type: 'string',
	      default: ''
	    },
	    scene: {
	      type: 'string',
	      default: ''
	    },
	    lightMapIntensity: {
	      type: 'float',
	      default: 1.2,
	      parse: function (value) {
	        if (parseFloat(value) >= 0.0) {
	          return parseFloat(value)
	        }
	        return -100.0 // = fallback to value from data3d file
	      }
	    },
	    lightMapExposure: {
	      type: 'float',
	      default: 0.6,
	      parse: function (value) {
	        if (parseFloat(value)) {
	          return parseFloat(value)
	        }
	        return -100.0 // = fallback to value from data3d file
	      }
	    }
	  },

	  init: function () {
	  },

	  update: function () {
	    var this_ = this;
	    var url = this_.data.url || this_.data.URL;
	    var key = this_.data.key || this_.data.KEY;
	    var scene = this_.data.scene;
	    var lightMapIntensity = this_.data.lightMapIntensity;
	    var lightMapExposure = this_.data.lightMapExposure;

	    if(scene !== '') {
	      callService('Model.read', {arguments: { resourceId: scene}}).then(function onResult(result) {
	        var level = result.modelStructure.children.filter(function(item) { return item.type === 'level' })[0];
	        if (!level) {
	          console.error('Unable to load data3d from scene ' + scene + ': The scene does not contain data in the expected format. Error was: No level found.');
	          return
	        }
	        if (!level.bakedModelUrl) {
	          console.error('Unable to load data3d from scene ' + scene + ': The scene is not baked. Enable realistic lighting on this scene. Error was: No baked data3d present.');
	          return
	        }
	        var bakedModel = level.bakedModelUrl;
	        if (bakedModel.split('.')[bakedModel.split('.').length - 1] !== 'buffer') {
	          console.error('Unable to load data3d from scene ' + scene + ': The scene is not in Data3D format. Disable and enable realistic lighting on this scene. Error was: No buffer3d found.');
	          return
	        }
	        this_.data.key = bakedModel;
	        key = bakedModel;
	        console.log('Loading scene', key);
	        this_.data.scene = '';
	        this_.update();
	      }).catch(function onApiError(err) {
	        console.error('Unable to load data3d from scene ' + scene + ': The API returned an error. Error was:', err);
	      });
	    }

	    // check params
	    if ((!url || url === '') && (!key || key === '')) return

	    // remove old mesh
	    this_.remove();

	    // create new one
	    this_.mesh = new THREE.Object3D();
	    this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh});
	    this.el.data3dView = this.data3dView
	    // load 3d file
	    ;(key ? io3d.storage.get(key) : io3d.utils.data3d.load(url)).then(function (data3d) {
	      this_.el.data3d = data3d;
	      // update view
	      this_.data3dView.set(data3d, { lightMapIntensity: lightMapIntensity, lightMapExposure: lightMapExposure });
	      this_.el.setObject3D('mesh', this_.mesh);
	      // emit event
	      this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
	    });
	  },

	  remove: function () {
	    if (this.data3dView) {
	      this.data3dView.destroy();
	      this.data3dView = null;
	    }
	    if (this.mesh) {
	      this.el.removeObject3D('mesh');
	      this.mesh = null;
	    }
	  }

	};

	var furnitureComponent = {

	  schema: {
	    id: {
	      type: 'string',
	      default: '10344b13-d981-47a0-90ac-f048ee2780a6'
	    }
	  },

	  init: function () {
	  },

	  update: function () {
	    var this_ = this;
	    var furnitureId = this_.data.id;

	    // check params
	    if (!furnitureId || furnitureId === '') return

	    // remove old mesh
	    this_.remove();

	    // create new one
	    this_.mesh = new THREE.Object3D();
	    this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh});

	    // get furniture data
	    io3d.furniture.get(furnitureId).then(function (result) {
	      // Expose properties
	      this_.info = result.info; // lightweight info like name, manufacturer, description ...
	      this_.data3d = result.data3d; // geometries and materials

	      // Parse & expose materials
	      this_.availableMaterials = {};
	      Object.keys(result.data3d.meshes).forEach(function eachMesh (meshName) {
	        this_.availableMaterials[meshName] = result.data3d.alternativeMaterialsByMeshKey ? result.data3d.alternativeMaterialsByMeshKey[meshName] : result.data3d.meshes[meshName].material;

	        //update material based on inspector
	        var materialPropName = 'material_' + meshName.replace(/\s/g, '_');
	        if (this_.data[materialPropName] !== undefined) {
	          result.data3d.meshes[meshName].material = this_.data[materialPropName];
	          this_.el.emit('material-changed', {mesh: meshName, material: this_.data[materialPropName]});
	        } else {
	          // register it as part of the schema for the inspector
	          var prop = {};
	          prop[materialPropName] = {
	            type: 'string',
	            default: result.data3d.meshes[meshName].material,
	            oneOf: result.data3d.alternativeMaterialsByMeshKey ? result.data3d.alternativeMaterialsByMeshKey[meshName] : result.data3d.meshes[meshName].material
	          };
	          this_.extendSchema(prop);
	          this_.data[materialPropName] = result.data3d.meshes[meshName].material;
	        }
	      });

	      // update view
	      this_.data3dView.set(result.data3d);
	      this_.el.data3d = result.data3d;
	      this_.el.setObject3D('mesh', this_.mesh);
	      // emit event
	      if (this_._prevId !== furnitureId) this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
	      this_._prevId = furnitureId;
	    });
	  },

	  remove: function () {
	    if (this.data3dView) {
	      this.data3dView.destroy();
	      this.data3dView = null;
	    }
	    if (this.mesh) {
	      this.el.removeObject3D('mesh');
	      this.mesh = null;
	    }
	  }

	};

	// initialize aframe components

	checkDependencies({
	  three: false,
	  aFrame: true,
	  onError: function (){
	    // show aframe dependency warning, since it is unexpected to run aframe on server
	    if (runtime.isBrowser) console.log('AFRAME library not found: related features will be disabled.');
	  }
	}, function registerComponents () {
	  AFRAME.registerComponent('io3d-data3d', data3dComponent);
	  AFRAME.registerComponent('io3d-furniture', furnitureComponent);
	});

	// export

	var aFrame = {
	  three: {
	    Data3dView: Data3dView,
	  }
	};

	function normalizeFurnitureInfo (rawInfo) {
	  // normalizes furniture definitions from server side endpoints
	  return {
	    // main info
	    id: rawInfo.productResourceId,
	    name: rawInfo.productDisplayName,
	    description: rawInfo.description,
	    manufacturer: rawInfo.manufacturer,
	    designer: rawInfo.designer,
	    indexImage: convertKeyToUrl(rawInfo.preview),
	    images: rawInfo.images.map(convertKeyToUrl),
	    url: rawInfo.link,
	    year: rawInfo.year,
	    // grouping
	    collectionIds: rawInfo.productCollectionResourceIds,
	    tags: cleanUpArrays(rawInfo.tags),
	    styles: cleanUpArrays(rawInfo.styles),
	    categories: cleanUpArrays(rawInfo.categories),
	    colors: cleanUpArrays(rawInfo.colours),
	    // geometry
	    boundingBox: rawInfo.boundingBox,
	    boundingPoints: rawInfo.boundingPoints,
	    data3dUrl: convertKeyToUrl(rawInfo.fileKey),
	    // data info
	    created: rawInfo.createdAt,
	    updated: rawInfo.updatedAt
	  }
	}

	// helpers

	function convertKeyToUrl (key) {
	  // add leading slash
	  if (key[0] !== '/') key = '/'+key;
	  return 'https://storage.3d.io' + key
	}

	function cleanUpArrays (arr) {
	  // TODO: remove this once #252 is resolved https://github.com/archilogic-com/services/issues/252
	  return arr[0] === '' ? arr.slice(1) : arr
	}

	function searchFurniture (query, options) {

	  // API
	  options = options || {};
	  var limit = options.limit || 50;
	  // TODO: add this param once #251 https://github.com/archilogic-com/services/issues/251 is resolved
	  //var offset = options.offset || 0

	  // internals
	  var apiErrorCount = 0;
	  // call API
	  function callApi () {
	    return io3d.utils.services.call('Product.search', {
	      searchQuery: {query: 'isPublished:true ' + query},
	      limit: limit
	      // TODO: add this param once #251 https://github.com/archilogic-com/services/issues/251 is resolved
	      //offset: offset
	    }).then(function onSuccess (rawResults) {
	      apiErrorCount = 0;
	      // normalize furniture data coming from server side endpoint
	      return rawResults.map(normalizeFurnitureInfo)
	    }, function onReject (err) {
	      console.error('Error fetching furniture:', err);
	      // try again 3 times
	      return ++apiErrorCount < 3 ? callApi() : Promise.reject('Whoops, that did not work, please try another query.')
	    })
	  }
	  // expose
	  return callApi()

	}

	function getFurnitureInfo (id) {
	  return callService('Product.read', { resourceId:id }).then(function(rawInfo){
	    return normalizeFurnitureInfo(rawInfo)
	  })
	}

	// from https://github.com/jbgutierrez/path-parse
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

	function parsePath (path) {
	  if (typeof path !== 'string') {
	    throw new TypeError(
	      "Parameter 'path' must be a string, not " + typeof path
	    );
	  }
	  var allParts = splitPathRe.exec(path).slice(1);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + path + "'");
	  }
	  allParts[2] = allParts[2] || '';
	  allParts[3] = allParts[3] || '';

	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  }
	}

	var path = {
	  parse: parsePath
	};

	// source: https://github.com/petkaantonov/urlparser
	// modified for browser compatibility

	/*
	 Copyright (c) 2014 Petka Antonov

	 Permission is hereby granted, free of charge, to any person obtaining a copy
	 of this software and associated documentation files (the "Software"), to deal
	 in the Software without restriction, including without limitation the rights
	 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 copies of the Software, and to permit persons to whom the Software is
	 furnished to do so, subject to the following conditions:

	 The above copyright notice and this permission notice shall be included in
	 all copies or substantial portions of the Software.

	 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 THE SOFTWARE.
	 */
	function Url() {
	  //For more efficient internal representation and laziness.
	  //The non-underscore versions of these properties are accessor functions
	  //defined on the prototype.
	  this._protocol = null;
	  this._href = "";
	  this._port = -1;
	  this._query = null;

	  this.auth = null;
	  this.slashes = null;
	  this.host = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.pathname = null;

	  this._prependSlash = false;
	}

	Url.prototype.parse =
	  function Url$parse(str, parseQueryString, hostDenotesSlash, disableAutoEscapeChars) {
	    if (typeof str !== "string") {
	      throw new TypeError("Parameter 'url' must be a string, not " +
	        typeof str);
	    }
	    if (str.substr(0,2) === '//' && typeof window !== 'undefined' && window.location && window.location.protocol) {
	      str = window.location.protocol + str;
	    }
	    var start = 0;
	    var end = str.length - 1;

	    //Trim leading and trailing ws
	    while (str.charCodeAt(start) <= 0x20 /*' '*/) start++;
	    while (str.charCodeAt(end) <= 0x20 /*' '*/) end--;

	    start = this._parseProtocol(str, start, end);

	    //Javascript doesn't have host
	    if (this._protocol !== "javascript") {
	      start = this._parseHost(str, start, end, hostDenotesSlash);
	      var proto = this._protocol;
	      if (!this.hostname &&
	        (this.slashes || (proto && !slashProtocols[proto]))) {
	        this.hostname = this.host = "";
	      }
	    }

	    if (start <= end) {
	      var ch = str.charCodeAt(start);

	      if (ch === 0x2F /*'/'*/ || ch === 0x5C /*'\'*/) {
	        this._parsePath(str, start, end, disableAutoEscapeChars);
	      }
	      else if (ch === 0x3F /*'?'*/) {
	        this._parseQuery(str, start, end, disableAutoEscapeChars);
	      }
	      else if (ch === 0x23 /*'#'*/) {
	        this._parseHash(str, start, end, disableAutoEscapeChars);
	      }
	      else if (this._protocol !== "javascript") {
	        this._parsePath(str, start, end, disableAutoEscapeChars);
	      }
	      else { //For javascript the pathname is just the rest of it
	        this.pathname = str.slice(start, end + 1 );
	      }

	    }

	    if (!this.pathname && this.hostname &&
	      this._slashProtocols[this._protocol]) {
	      this.pathname = "/";
	    }

	    if (parseQueryString) {
	      var search = this.search;
	      if (search == null) {
	        search = this.search = "";
	      }
	      if (search.charCodeAt(0) === 0x3F /*'?'*/) {
	        search = search.slice(1);
	      }
	      //This calls a setter function, there is no .query data property
	      this.query = Url.queryString.parse(search);
	    }
	  };

	Url.prototype.resolve = function Url$resolve(relative) {
	  return this.resolveObject(Url.parse(relative, false, true)).format();
	};

	Url.prototype.format = function Url$format() {
	  var auth = this.auth || "";

	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ":");
	    auth += "@";
	  }

	  var protocol = this.protocol || "";
	  var pathname = this.pathname || "";
	  var hash = this.hash || "";
	  var search = this.search || "";
	  var query = "";
	  var hostname = this.hostname || "";
	  var port = this.port || "";
	  var host = false;
	  var scheme = "";

	  //Cache the result of the getter function
	  var q = this.query;
	  if (q && typeof q === "object") {
	    query = Url.queryString.stringify(q);
	  }

	  if (!search) {
	    search = query ? "?" + query : "";
	  }

	  if (protocol && protocol.charCodeAt(protocol.length - 1) !== 0x3A /*':'*/)
	    protocol += ":";

	  if (this.host) {
	    host = auth + this.host;
	  }
	  else if (hostname) {
	    var ip6 = hostname.indexOf(":") > -1;
	    if (ip6) hostname = "[" + hostname + "]";
	    host = auth + hostname + (port ? ":" + port : "");
	  }

	  var slashes = this.slashes ||
	    ((!protocol ||
	    slashProtocols[protocol]) && host !== false);


	  if (protocol) scheme = protocol + (slashes ? "//" : "");
	  else if (slashes) scheme = "//";

	  if (slashes && pathname && pathname.charCodeAt(0) !== 0x2F /*'/'*/) {
	    pathname = "/" + pathname;
	  }
	  if (search && search.charCodeAt(0) !== 0x3F /*'?'*/)
	    search = "?" + search;
	  if (hash && hash.charCodeAt(0) !== 0x23 /*'#'*/)
	    hash = "#" + hash;

	  pathname = escapePathName(pathname);
	  search = escapeSearch(search);

	  return scheme + (host === false ? "" : host) + pathname + search + hash;
	};

	Url.prototype.resolveObject = function Url$resolveObject(relative) {
	  if (typeof relative === "string")
	    relative = Url.parse(relative, false, true);

	  var result = this._clone();

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there"s nothing left to do here.
	  if (!relative.href) {
	    result._href = "";
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative._protocol) {
	    relative._copyPropsTo(result, true);

	    if (slashProtocols[result._protocol] &&
	      result.hostname && !result.pathname) {
	      result.pathname = "/";
	    }
	    result._href = "";
	    return result;
	  }

	  if (relative._protocol && relative._protocol !== result._protocol) {
	    // if it"s a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it"s not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that"s known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashProtocols[relative._protocol]) {
	      relative._copyPropsTo(result, false);
	      result._href = "";
	      return result;
	    }

	    result._protocol = relative._protocol;
	    if (!relative.host && relative._protocol !== "javascript") {
	      var relPath = (relative.pathname || "").split("/");
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = "";
	      if (!relative.hostname) relative.hostname = "";
	      if (relPath[0] !== "") relPath.unshift("");
	      if (relPath.length < 2) relPath.unshift("");
	      result.pathname = relPath.join("/");
	    } else {
	      result.pathname = relative.pathname;
	    }

	    result.search = relative.search;
	    result.host = relative.host || "";
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result._port = relative._port;
	    result.slashes = result.slashes || relative.slashes;
	    result._href = "";
	    return result;
	  }

	  var isSourceAbs =
	    (result.pathname && result.pathname.charCodeAt(0) === 0x2F /*'/'*/);
	  var isRelAbs = (
	    relative.host ||
	    (relative.pathname &&
	    relative.pathname.charCodeAt(0) === 0x2F /*'/'*/)
	  );
	  var mustEndAbs = (isRelAbs || isSourceAbs ||
	  (result.host && relative.pathname));

	  var removeAllDots = mustEndAbs;

	  var srcPath = result.pathname && result.pathname.split("/") || [];
	  var relPath = relative.pathname && relative.pathname.split("/") || [];
	  var psychotic = result._protocol && !slashProtocols[result._protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = "";
	    result._port = -1;
	    if (result.host) {
	      if (srcPath[0] === "") srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = "";
	    if (relative._protocol) {
	      relative.hostname = "";
	      relative._port = -1;
	      if (relative.host) {
	        if (relPath[0] === "") relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = "";
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
	  }

	  if (isRelAbs) {
	    // it"s absolute.
	    result.host = relative.host ?
	      relative.host : result.host;
	    result.hostname = relative.hostname ?
	      relative.hostname : result.hostname;
	    result.search = relative.search;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it"s relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	  } else if (relative.search) {
	    // just pull out the search.
	    // like href="?foo".
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject("mailto:local1@domain1", "local2@domain2")
	      var authInHost = result.host && result.host.indexOf("@") > 0 ?
	        result.host.split("@") : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result._href = "";
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we"ve already handled the other stuff above.
	    result.pathname = null;
	    result._href = "";
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	  (result.host || relative.host) && (last === "." || last === "..") ||
	  last === "");

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === ".") {
	      srcPath.splice(i, 1);
	    } else if (last === "..") {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift("..");
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== "" &&
	    (!srcPath[0] || srcPath[0].charCodeAt(0) !== 0x2F /*'/'*/)) {
	    srcPath.unshift("");
	  }

	  if (hasTrailingSlash && (srcPath.join("/").substr(-1) !== "/")) {
	    srcPath.push("");
	  }

	  var isAbsolute = srcPath[0] === "" ||
	    (srcPath[0] && srcPath[0].charCodeAt(0) === 0x2F /*'/'*/);

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? "" :
	      srcPath.length ? srcPath.shift() : "";
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject("mailto:local1@domain1", "local2@domain2")
	    var authInHost = result.host && result.host.indexOf("@") > 0 ?
	      result.host.split("@") : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift("");
	  }

	  result.pathname = srcPath.length === 0 ? null : srcPath.join("/");
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result._href = "";
	  return result;
	};

	var escapePathName = Url.prototype._escapePathName =
	  function Url$_escapePathName(pathname) {
	    if (!containsCharacter2(pathname, 0x23 /*'#'*/, 0x3F /*'?'*/)) {
	      return pathname;
	    }
	    //Avoid closure creation to keep this inlinable
	    return _escapePath(pathname);
	  };

	var escapeSearch = Url.prototype._escapeSearch =
	  function Url$_escapeSearch(search) {
	    if (!containsCharacter2(search, 0x23 /*'#'*/, -1)) return search;
	    //Avoid closure creation to keep this inlinable
	    return _escapeSearch(search);
	  };

	Url.prototype._parseProtocol = function Url$_parseProtocol(str, start, end) {
	  var doLowerCase = false;
	  var protocolCharacters = this._protocolCharacters;

	  for (var i = start; i <= end; ++i) {
	    var ch = str.charCodeAt(i);

	    if (ch === 0x3A /*':'*/) {
	      var protocol = str.slice(start, i);
	      if (doLowerCase) protocol = protocol.toLowerCase();
	      this._protocol = protocol;
	      return i + 1;
	    }
	    else if (protocolCharacters[ch] === 1) {
	      if (ch < 0x61 /*'a'*/)
	        doLowerCase = true;
	    }
	    else {
	      return start;
	    }

	  }
	  return start;
	};

	Url.prototype._parseAuth = function Url$_parseAuth(str, start, end, decode) {
	  var auth = str.slice(start, end + 1);
	  if (decode) {
	    auth = decodeURIComponent(auth);
	  }
	  this.auth = auth;
	};

	Url.prototype._parsePort = function Url$_parsePort(str, start, end) {
	  //Internal format is integer for more efficient parsing
	  //and for efficient trimming of leading zeros
	  var port = 0;
	  //Distinguish between :0 and : (no port number at all)
	  var hadChars = false;
	  var validPort = true;

	  for (var i = start; i <= end; ++i) {
	    var ch = str.charCodeAt(i);

	    if (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/) {
	      port = (10 * port) + (ch - 0x30 /*'0'*/);
	      hadChars = true;
	    }
	    else {
	      validPort = false;
	      if (ch === 0x5C/*'\'*/ || ch === 0x2F/*'/'*/) {
	        validPort = true;
	      }
	      break;
	    }

	  }
	  if ((port === 0 && !hadChars) || !validPort) {
	    if (!validPort) {
	      this._port = -2;
	    }
	    return 0;
	  }

	  this._port = port;
	  return i - start;
	};

	Url.prototype._parseHost =
	  function Url$_parseHost(str, start, end, slashesDenoteHost) {
	    var hostEndingCharacters = this._hostEndingCharacters;
	    var first = str.charCodeAt(start);
	    var second = str.charCodeAt(start + 1);
	    if ((first === 0x2F /*'/'*/ || first === 0x5C /*'\'*/) &&
	      (second === 0x2F /*'/'*/ || second === 0x5C /*'\'*/)) {
	      this.slashes = true;

	      //The string starts with //
	      if (start === 0) {
	        //The string is just "//"
	        if (end < 2) return start;
	        //If slashes do not denote host and there is no auth,
	        //there is no host when the string starts with //
	        var hasAuth =
	          containsCharacter(str, 0x40 /*'@'*/, 2, hostEndingCharacters);
	        if (!hasAuth && !slashesDenoteHost) {
	          this.slashes = null;
	          return start;
	        }
	      }
	      //There is a host that starts after the //
	      start += 2;
	    }
	    //If there is no slashes, there is no hostname if
	    //1. there was no protocol at all
	    else if (!this._protocol ||
	      //2. there was a protocol that requires slashes
	      //e.g. in 'http:asd' 'asd' is not a hostname
	      slashProtocols[this._protocol]
	    ) {
	      return start;
	    }

	    var doLowerCase = false;
	    var idna = false;
	    var hostNameStart = start;
	    var hostNameEnd = end;
	    var lastCh = -1;
	    var portLength = 0;
	    var charsAfterDot = 0;
	    var authNeedsDecoding = false;

	    var j = -1;

	    //Find the last occurrence of an @-sign until hostending character is met
	    //also mark if decoding is needed for the auth portion
	    for (var i = start; i <= end; ++i) {
	      var ch = str.charCodeAt(i);

	      if (ch === 0x40 /*'@'*/) {
	        j = i;
	      }
	      //This check is very, very cheap. Unneeded decodeURIComponent is very
	      //very expensive
	      else if (ch === 0x25 /*'%'*/) {
	        authNeedsDecoding = true;
	      }
	      else if (hostEndingCharacters[ch] === 1) {
	        break;
	      }
	    }

	    //@-sign was found at index j, everything to the left from it
	    //is auth part
	    if (j > -1) {
	      this._parseAuth(str, start, j - 1, authNeedsDecoding);
	      //hostname starts after the last @-sign
	      start = hostNameStart = j + 1;
	    }

	    //Host name is starting with a [
	    if (str.charCodeAt(start) === 0x5B /*'['*/) {
	      for (var i = start + 1; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        //Assume valid IP6 is between the brackets
	        if (ch === 0x5D /*']'*/) {
	          if (str.charCodeAt(i + 1) === 0x3A /*':'*/) {
	            portLength = this._parsePort(str, i + 2, end) + 1;
	          }
	          var hostname = str.slice(start + 1, i).toLowerCase();
	          this.hostname = hostname;
	          this.host = this._port > 0 ?
	            "[" + hostname + "]:" + this._port :
	            "[" + hostname + "]";
	          this.pathname = "/";
	          return i + portLength + 1;
	        }
	      }
	      //Empty hostname, [ starts a path
	      return start;
	    }

	    for (var i = start; i <= end; ++i) {
	      if (charsAfterDot > 62) {
	        this.hostname = this.host = str.slice(start, i);
	        return i;
	      }
	      var ch = str.charCodeAt(i);

	      if (ch === 0x3A /*':'*/) {
	        portLength = this._parsePort(str, i + 1, end) + 1;
	        hostNameEnd = i - 1;
	        break;
	      }
	      else if (ch < 0x61 /*'a'*/) {
	        if (ch === 0x2E /*'.'*/) {
	          //Node.js ignores this error
	          /*
	           if (lastCh === DOT || lastCh === -1) {
	           this.hostname = this.host = "";
	           return start;
	           }
	           */
	          charsAfterDot = -1;
	        }
	        else if (0x41 /*'A'*/ <= ch && ch <= 0x5A /*'Z'*/) {
	          doLowerCase = true;
	        }
	        //Valid characters other than ASCII letters -, _, +, 0-9
	        else if (!(ch === 0x2D /*'-'*/ ||
	          ch === 0x5F /*'_'*/ ||
	          ch === 0x2B /*'+'*/ ||
	          (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/))
	        ) {
	          if (hostEndingCharacters[ch] === 0 &&
	            this._noPrependSlashHostEnders[ch] === 0) {
	            this._prependSlash = true;
	          }
	          hostNameEnd = i - 1;
	          break;
	        }
	      }
	      else if (ch >= 0x7B /*'{'*/) {
	        if (ch <= 0x7E /*'~'*/) {
	          if (this._noPrependSlashHostEnders[ch] === 0) {
	            this._prependSlash = true;
	          }
	          hostNameEnd = i - 1;
	          break;
	        }
	        idna = true;
	      }
	      lastCh = ch;
	      charsAfterDot++;
	    }

	    //Node.js ignores this error
	    /*
	     if (lastCh === DOT) {
	     hostNameEnd--;
	     }
	     */

	    if (hostNameEnd + 1 !== start &&
	      hostNameEnd - hostNameStart <= 256) {
	      var hostname = str.slice(hostNameStart, hostNameEnd + 1);
	      if (doLowerCase) hostname = hostname.toLowerCase();
	      this.hostname = hostname;
	      this.host = this._port > 0 ? hostname + ":" + this._port : hostname;
	    }

	    return hostNameEnd + 1 + portLength;

	  };

	Url.prototype._copyPropsTo = function Url$_copyPropsTo(input, noProtocol) {
	  if (!noProtocol) {
	    input._protocol = this._protocol;
	  }
	  input._href = this._href;
	  input._port = this._port;
	  input._prependSlash = this._prependSlash;
	  input.auth = this.auth;
	  input.slashes = this.slashes;
	  input.host = this.host;
	  input.hostname = this.hostname;
	  input.hash = this.hash;
	  input.search = this.search;
	  input.pathname = this.pathname;
	};

	Url.prototype._clone = function Url$_clone() {
	  var ret = new Url();
	  ret._protocol = this._protocol;
	  ret._href = this._href;
	  ret._port = this._port;
	  ret._prependSlash = this._prependSlash;
	  ret.auth = this.auth;
	  ret.slashes = this.slashes;
	  ret.host = this.host;
	  ret.hostname = this.hostname;
	  ret.hash = this.hash;
	  ret.search = this.search;
	  ret.pathname = this.pathname;
	  return ret;
	};

	Url.prototype._getComponentEscaped =
	  function Url$_getComponentEscaped(str, start, end, isAfterQuery) {
	    var cur = start;
	    var i = start;
	    var ret = "";
	    var autoEscapeMap = isAfterQuery ?
	      this._afterQueryAutoEscapeMap : this._autoEscapeMap;
	    for (; i <= end; ++i) {
	      var ch = str.charCodeAt(i);
	      var escaped = autoEscapeMap[ch];

	      if (escaped !== "" && escaped !== undefined) {
	        if (cur < i) ret += str.slice(cur, i);
	        ret += escaped;
	        cur = i + 1;
	      }
	    }
	    if (cur < i + 1) ret += str.slice(cur, i);
	    return ret;
	  };

	Url.prototype._parsePath =
	  function Url$_parsePath(str, start, end, disableAutoEscapeChars) {
	    var pathStart = start;
	    var pathEnd = end;
	    var escape = false;
	    var autoEscapeCharacters = this._autoEscapeCharacters;
	    var prePath = this._port === -2 ? "/:" : "";

	    for (var i = start; i <= end; ++i) {
	      var ch = str.charCodeAt(i);
	      if (ch === 0x23 /*'#'*/) {
	        this._parseHash(str, i, end, disableAutoEscapeChars);
	        pathEnd = i - 1;
	        break;
	      }
	      else if (ch === 0x3F /*'?'*/) {
	        this._parseQuery(str, i, end, disableAutoEscapeChars);
	        pathEnd = i - 1;
	        break;
	      }
	      else if (!disableAutoEscapeChars && !escape && autoEscapeCharacters[ch] === 1) {
	        escape = true;
	      }
	    }

	    if (pathStart > pathEnd) {
	      this.pathname = prePath === "" ? "/" : prePath;
	      return;
	    }

	    var path;
	    if (escape) {
	      path = this._getComponentEscaped(str, pathStart, pathEnd, false);
	    }
	    else {
	      path = str.slice(pathStart, pathEnd + 1);
	    }
	    this.pathname = prePath === ""
	      ? (this._prependSlash ? "/" + path : path)
	      : prePath + path;
	  };

	Url.prototype._parseQuery = function Url$_parseQuery(str, start, end, disableAutoEscapeChars) {
	  var queryStart = start;
	  var queryEnd = end;
	  var escape = false;
	  var autoEscapeCharacters = this._autoEscapeCharacters;

	  for (var i = start; i <= end; ++i) {
	    var ch = str.charCodeAt(i);

	    if (ch === 0x23 /*'#'*/) {
	      this._parseHash(str, i, end, disableAutoEscapeChars);
	      queryEnd = i - 1;
	      break;
	    }
	    else if (!disableAutoEscapeChars && !escape && autoEscapeCharacters[ch] === 1) {
	      escape = true;
	    }
	  }

	  if (queryStart > queryEnd) {
	    this.search = "";
	    return;
	  }

	  var query;
	  if (escape) {
	    query = this._getComponentEscaped(str, queryStart, queryEnd, true);
	  }
	  else {
	    query = str.slice(queryStart, queryEnd + 1);
	  }
	  this.search = query;
	};

	Url.prototype._parseHash = function Url$_parseHash(str, start, end, disableAutoEscapeChars) {
	  if (start > end) {
	    this.hash = "";
	    return;
	  }

	  this.hash = disableAutoEscapeChars ?
	    str.slice(start, end + 1) : this._getComponentEscaped(str, start, end, true);
	};

	Object.defineProperty(Url.prototype, "port", {
	  get: function() {
	    if (this._port >= 0) {
	      return ("" + this._port);
	    }
	    return null;
	  },
	  set: function(v) {
	    if (v == null) {
	      this._port = -1;
	    }
	    else {
	      this._port = parseInt(v, 10);
	    }
	  }
	});

	Object.defineProperty(Url.prototype, "query", {
	  get: function() {
	    var query = this._query;
	    if (query != null) {
	      return query;
	    }
	    var search = this.search;

	    if (search) {
	      if (search.charCodeAt(0) === 0x3F /*'?'*/) {
	        search = search.slice(1);
	      }
	      if (search !== "") {
	        this._query = search;
	        return search;
	      }
	    }
	    return search;
	  },
	  set: function(v) {
	    this._query = v;
	  }
	});

	Object.defineProperty(Url.prototype, "path", {
	  get: function() {
	    var p = this.pathname || "";
	    var s = this.search || "";
	    if (p || s) {
	      return p + s;
	    }
	    return (p == null && s) ? ("/" + s) : null;
	  },
	  set: function() {}
	});

	Object.defineProperty(Url.prototype, "protocol", {
	  get: function() {
	    var proto = this._protocol;
	    return proto ? proto + ":" : proto;
	  },
	  set: function(v) {
	    if (typeof v === "string") {
	      var end = v.length - 1;
	      if (v.charCodeAt(end) === 0x3A /*':'*/) {
	        this._protocol = v.slice(0, end);
	      }
	      else {
	        this._protocol = v;
	      }
	    }
	    else if (v == null) {
	      this._protocol = null;
	    }
	  }
	});

	Object.defineProperty(Url.prototype, "href", {
	  get: function() {
	    var href = this._href;
	    if (!href) {
	      href = this._href = this.format();
	    }
	    return href;
	  },
	  set: function(v) {
	    this._href = v;
	  }
	});

	Url.parse = function Url$Parse(str, parseQueryString, hostDenotesSlash, disableAutoEscapeChars) {
	  if (str instanceof Url) return str;
	  var ret = new Url();
	  ret.parse(str, !!parseQueryString, !!hostDenotesSlash, !!disableAutoEscapeChars);
	  return ret;
	};

	Url.format = function Url$Format(obj) {
	  if (typeof obj === "string") {
	    obj = Url.parse(obj);
	  }
	  if (!(obj instanceof Url)) {
	    return Url.prototype.format.call(obj);
	  }
	  return obj.format();
	};

	Url.resolve = function Url$Resolve(source, relative) {
	  return Url.parse(source, false, true).resolve(relative);
	};

	Url.resolveObject = function Url$ResolveObject(source, relative) {
	  if (!source) return relative;
	  return Url.parse(source, false, true).resolveObject(relative);
	};

	function _escapePath(pathname) {
	  return pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	}

	function _escapeSearch(search) {
	  return search.replace(/#/g, function(match) {
	    return encodeURIComponent(match);
	  });
	}

	//Search `char1` (integer code for a character) in `string`
	//starting from `fromIndex` and ending at `string.length - 1`
	//or when a stop character is found
	function containsCharacter(string, char1, fromIndex, stopCharacterTable) {
	  var len = string.length;
	  for (var i = fromIndex; i < len; ++i) {
	    var ch = string.charCodeAt(i);

	    if (ch === char1) {
	      return true;
	    }
	    else if (stopCharacterTable[ch] === 1) {
	      return false;
	    }
	  }
	  return false;
	}

	//See if `char1` or `char2` (integer codes for characters)
	//is contained in `string`
	function containsCharacter2(string, char1, char2) {
	  for (var i = 0, len = string.length; i < len; ++i) {
	    var ch = string.charCodeAt(i);
	    if (ch === char1 || ch === char2) return true;
	  }
	  return false;
	}

	//Makes an array of 128 uint8's which represent boolean values.
	//Spec is an array of ascii code points or ascii code point ranges
	//ranges are expressed as [start, end]

	//Create a table with the characters 0x30-0x39 (decimals '0' - '9') and
	//0x7A (lowercaseletter 'z') as `true`:
	//
	//var a = makeAsciiTable([[0x30, 0x39], 0x7A]);
	//a[0x30]; //1
	//a[0x15]; //0
	//a[0x35]; //1
	function makeAsciiTable(spec) {
	  var ret = new Uint8Array(128);
	  spec.forEach(function(item){
	    if (typeof item === "number") {
	      ret[item] = 1;
	    }
	    else {
	      var start = item[0];
	      var end = item[1];
	      for (var j = start; j <= end; ++j) {
	        ret[j] = 1;
	      }
	    }
	  });

	  return ret;
	}


	var autoEscape = ["<", ">", "\"", "`", " ", "\r", "\n",
	  "\t", "{", "}", "|", "\\", "^", "`", "'"];

	var autoEscapeMap = new Array(128);



	for (var i$1 = 0, len = autoEscapeMap.length; i$1 < len; ++i$1) {
	  autoEscapeMap[i$1] = "";
	}

	for (var i$1 = 0, len = autoEscape.length; i$1 < len; ++i$1) {
	  var c = autoEscape[i$1];
	  var esc = encodeURIComponent(c);
	  if (esc === c) {
	    esc = escape(c);
	  }
	  autoEscapeMap[c.charCodeAt(0)] = esc;
	}
	var afterQueryAutoEscapeMap = autoEscapeMap.slice();
	autoEscapeMap[0x5C /*'\'*/] = "/";

	var slashProtocols = Url.prototype._slashProtocols = {
	  http: true,
	  https: true,
	  gopher: true,
	  file: true,
	  ftp: true,

	  "http:": true,
	  "https:": true,
	  "gopher:": true,
	  "file:": true,
	  "ftp:": true
	};

	Url.prototype._protocolCharacters = makeAsciiTable([
	  [0x61 /*'a'*/, 0x7A /*'z'*/],
	  [0x41 /*'A'*/, 0x5A /*'Z'*/],
	  0x2E /*'.'*/, 0x2B /*'+'*/, 0x2D /*'-'*/
	]);

	Url.prototype._hostEndingCharacters = makeAsciiTable([
	  0x23 /*'#'*/, 0x3F /*'?'*/, 0x2F /*'/'*/, 0x5C /*'\'*/
	]);

	Url.prototype._autoEscapeCharacters = makeAsciiTable(
	  autoEscape.map(function(v) {
	    return v.charCodeAt(0);
	  })
	);

	//If these characters end a host name, the path will not be prepended a /
	Url.prototype._noPrependSlashHostEnders = makeAsciiTable(
	  [
	    "<", ">", "'", "`", " ", "\r",
	    "\n", "\t", "{", "}", "|",
	    "^", "`", "\"", "%", ";"
	  ].map(function(v) {
	    return v.charCodeAt(0);
	  })
	);

	Url.prototype._autoEscapeMap = autoEscapeMap;
	Url.prototype._afterQueryAutoEscapeMap = afterQueryAutoEscapeMap;

	// configs

	var HEADER_BYTE_LENGTH = 16;
	var MAGIC_NUMBER = 0x41443344; // AD3D encoded as ASCII characters in hex
	var VERSION = 1;
	var TEXTURE_PATH_KEYS = [
	  // source
	  'mapDiffuseSource',
	  'mapSpecularSource',
	  'mapNormalSource',
	  'mapAlphaSource',
	  'mapLightSource',
	  // hi-res
	  'mapDiffuse',
	  'mapSpecular',
	  'mapNormal',
	  'mapAlpha',
	  'mapLight',
	  // preview
	  'mapDiffusePreview',
	  'mapSpecularPreview',
	  'mapNormalPreview',
	  'mapAlphaPreview',
	  'mapLightPreview'
	];
	// TODO: use StringDecoder in Node environment
	var textDecoder = runtime.isBrowser && window.TextDecoder ? new window.TextDecoder('utf-16') : makeUtf16Decoder();

	// public methods

	function decodeBuffer (buffer, options) {

	  // API
	  options = options || {};
	  var url$$1 = options.url;

	  var parsedUrl = Url.parse(url$$1);
	  var rootDir = path.parse(parsedUrl.path || '').dir;
	  var origin = parsedUrl.protocol + '//' + parsedUrl.host;

	  // check buffer type
	  if (!buffer) {
	    return bluebird_1.reject('Missing buffer parameter.')
	  } else if (typeof Buffer !== 'undefined' && buffer instanceof Buffer) {
	    // convert node buffer to arrayBuffer
	    buffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	  }

	  // internals
	  var headerArray = new Int32Array(buffer, 0, HEADER_BYTE_LENGTH / 4);
	  var magicNumber = headerArray[0];
	  var version = headerArray[1];
	  var structureByteLength = headerArray[2];
	  var payloadByteLength = headerArray[3];
	  var expectedFileByteLength = HEADER_BYTE_LENGTH + structureByteLength + payloadByteLength;

	  // validation warnings

	  if (magicNumber !== MAGIC_NUMBER) {
	    console.error('File header error: Wrong magic number. File is probably not data3d buffer format.');
	  }
	  if (version !== VERSION) {
	    console.error('File header error: Wrong version number: ' + version + '. Parser supports version: ' + VERSION);
	  }

	  // validation errors

	  if (buffer.byteLength !== expectedFileByteLength) {
	    var errorMessage = 'Can not parse Data3d buffer. Wrong buffer size: ' + buffer.byteLength + ' Expected: ' + expectedFileByteLength;
	    console.error(errorMessage);
	    return bluebird_1.reject(errorMessage)
	  }

	  // parse structure info

	  var structureArray = new Uint16Array(buffer, HEADER_BYTE_LENGTH, structureByteLength / 2);
	  var structureString = textDecoder.decode(structureArray);
	  var structure;
	  try {
	    structure = JSON.parse(structureString);
	  } catch (e) {
	    return bluebird_1.reject(e)
	  }

	  // add geometry arrays to data3d

	  var payloadByteOffset = HEADER_BYTE_LENGTH + structureByteLength;
	  traverseData3d(structure.data3d, function (data3d) {

	    // map typed arrays to payload area in file buffer
	    mapArraysToBuffer(data3d, buffer, payloadByteOffset, url$$1);

	    //  convert relative material keys into absolute once
	    if (origin && data3d.materials) convertTextureKeys(data3d, origin, rootDir);

	  });

	  return bluebird_1.resolve(structure.data3d)

	}

	// text decoder shim
	function makeUtf16Decoder () {
	  return {

	    decode: function decodeText (a) {
	      var
	        string = '',
	        // ignore any initial character other than '{' = 123 and '[' = 91 (>> bug #9818)
	        i = a[0] === 123 || a[1] === 91 ? 0 : 1,
	        l20 = a.length - 20,
	        l2 = a.length;
	      // passing 20 arguments into fromCharCode function provides fastest performance
	      // (based on practical performance testing)
	      for (; i < l20; i += 20) {
	        string += String.fromCharCode(
	          a[i], a[i + 1], a[i + 2], a[i + 3], a[i + 4], a[i + 5], a[i + 6], a[i + 7], a[i + 8], a[i + 9],
	          a[i + 10], a[i + 11], a[i + 12], a[i + 13], a[i + 14], a[i + 15], a[i + 16], a[i + 17], a[i + 18], a[i + 19]
	        );
	      }
	      // the rest we do char by char
	      for (; i < l2; i++) {
	        string += String.fromCharCode(a[i]);
	      }
	      return string
	    }

	  }
	}

	function convertTextureKeys (data3d, origin, rootDir) {
	  
	  var i, l, i2, l2, m, materialKeys = data3d.materialKeys || Object.keys(data3d.materials || {}), texturePathKey;

	  for (i = 0, l = materialKeys.length; i < l; i++) {
	    m = data3d.materials[materialKeys[i]];

	    // hi-res textures
	    for (i2 = 0, l2 = TEXTURE_PATH_KEYS.length; i2 < l2; i2++) {
	      texturePathKey = TEXTURE_PATH_KEYS[i2];
	      if (m[texturePathKey]) {
	        if (m[texturePathKey][0] === '/') {
	          // absolute path
	          m[texturePathKey] = origin + m[texturePathKey];
	        } else {
	          // relative path
	          m[texturePathKey] = origin + rootDir +'/'+ m[texturePathKey];
	        }
	      }
	    }

	  }

	}

	function mapArraysToBuffer (data3d, buffer, payloadByteOffset, url$$1) {

	  var mesh, i, l, meshKeys = data3d.meshKeys || Object.keys(data3d.meshes || {});

	  for (i = 0, l = meshKeys.length; i < l; i++) {
	    mesh = data3d.meshes[meshKeys[i]];

	    // map arrays to meshes
	    if (mesh.positionsOffset !== undefined && mesh.positionsLength !== undefined) {
	      mesh.positions = new Float32Array(buffer, payloadByteOffset + mesh.positionsOffset * 4, mesh.positionsLength);
	      delete mesh.positionsOffset;
	      delete mesh.positionsLength;
	    }
	    if (mesh.normalsOffset !== undefined && mesh.normalsLength !== undefined) {
	      mesh.normals = new Float32Array(buffer, payloadByteOffset + mesh.normalsOffset * 4, mesh.normalsLength);
	      delete mesh.normalsOffset;
	      delete mesh.normalsLength;
	    }
	    if (mesh.uvsOffset !== undefined && mesh.uvsLength !== undefined) {
	      mesh.uvs = new Float32Array(buffer, payloadByteOffset + mesh.uvsOffset * 4, mesh.uvsLength);
	      delete mesh.uvsOffset;
	      delete mesh.uvsLength;
	    }
	    if (mesh.uvsLightmapOffset !== undefined && mesh.uvsLightmapLength !== undefined) {
	      mesh.uvsLightmap = new Float32Array(buffer, payloadByteOffset + mesh.uvsLightmapOffset * 4, mesh.uvsLightmapLength);
	      delete mesh.uvsLightmapOffset;
	      delete mesh.uvsLightmapLength;
	    }

	    // add cache key
	    if (url$$1) mesh.cacheKey = url$$1 + ':' + meshKeys[i];

	  }

	}

	function traverseData3d (data3d, callback) {

	  callback(data3d);

	  if (data3d.children) {
	    for (var i = 0, l = data3d.children.length; i < l; i++) {
	      traverseData3d(data3d.children[i], callback);
	    }
	  }

	}

	function loadData3d (url, options) {
	  return fetch$1(url, options).then(function(res){
	    return res.arrayBuffer()
	  }).then(function(buffer){
	    return decodeBuffer(buffer, { url: url })
	  })
	}

	function getFurniture (id) {
	  // we need to call furniture info first in order to obtain data3d URL
	  return getFurnitureInfo(id).then(function(info){
	    return loadData3d(info.data3dUrl).then(function(data3d){
	      return {
	        // contains lightweight metadata like designer name and description
	        info: info,
	        // contains geometry and material definitions
	        data3d: data3d
	      }
	    })
	  })
	}

	var furniture = {
	  search: searchFurniture,
	  get: getFurniture,
	  getInfo: getFurnitureInfo
	};

	var FormData_;
	if (runtime.isNode) {
	  FormData_ = require('form-data');
	} else if (typeof FormData !== 'undefined') {
	  FormData_ = FormData;
	} else {
	  console.warn('Missing FormData API.');
	  FormData_ = function FormDataError () {
	    throw new Error('Missing FormData API.')
	  };
	}

	var FormData$1 = FormData_;

	function getShortId (length) {
	  length = length || 6;
	  var shortId = '';
	  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  for (var i = 0; i < length; i++) shortId += possible.charAt(Math.floor(Math.random() * possible.length));
	  return shortId
	}

	/**
	 * Sign up: Create a new user
	 * @function io3d.auth.signUp
	 * @param {object} args
	 * @param {string} args.email
	 * @param {string} args.password (optional)
	 */
	function signUp (args) {

	  var credentials = {
	    email: args.email,
	    password: args.password || uuid.generate()
	  };

	  // log out first
	  return callService('User.logOut').then(function(){

	    // send sign up request
	    logger.debug('Sending API sign up request for email "' + credentials.email + '" ...');
	    return callService('User.create', credentials)

	  }).then(function onSignUpSuccess(result) {

	    // success
	    logger.debug('API: User sign up with email "' + credentials.email + '" was successful.');
	    return bluebird_1.resolve()

	  }, function onSignUpError(error){

	    // denied
	    logger.debug('API: Could not sign up using email "' + credentials.email + '".', error);
	    return bluebird_1.reject(error)

	  })

	}

	function normalizeSession(session_) {

	  var isAuthenticated = !!session_.user;
	  var user = {};

	  // populate user object if authenticated
	  if (isAuthenticated) {
	    user.id = session_.user.resourceId;
	    user.username = session_.user.resourceName;
	    user.email = session_.user.email;
	  }

	  return {
	    isAuthenticated: isAuthenticated,
	    user: user
	  }

	}

	/**
	 * Creates a session stream
	 * @function io3d.auth.session$
	 */

	var session$ = new BehaviorSubject_1.BehaviorSubject(normalizeSession({}));

	// init
	getSession();

	// update session state every time when tab becomes visible
	if (runtime.isBrowser) {
	  runtime.isFocused$.subscribe(function(isFocused){
	    if (isFocused) getSession();
	  });
	}

	// export

	/**
	 * Get information about the current session.
	 * @function io3d.auth.getSession
	 */
	function getSession () {
	  logger.debug('Sending API session request...');
	  return callService('User.getSession')
	    .then(normalizeSession)
	    .then(function onSuccess (session) {
	      logger.debug('API: session data:\n', session);
	      // stream session object
	      session$.next(session);
	      // return result
	      return session
	    }, function onError (error) {
	      logger.debug('API: error receiving session data.', error);
	      return bluebird_1.reject(error)
	    })
	}

	/**
	 * Set password for a specific user
	 * @function io3d.auth.setPassword
	 * @param {object} args
	 * @param {string} args.token
	 * @param {string} args.password
	 */
	function setPassword (args) {

	  var credentials = {
	    token: args.token,
	    password: args.password
	  };

	  // log out first
	  return callService('User.logOut').then(function(){

	    // send sign up request
	    logger.debug('Setting new password ...');
	    return callService('User.changePassword', {
	      token: credentials.token,
	      oldPassword: null,
	      newPassword: password
	    })

	  }).then(function onSuccess(result) {

	    // success
	    logger.debug('API: setting password successful.');
	    return getSession()

	  }, function onError(error){

	    // denied
	    logger.debug('API: setting password failed.', error);
	    return bluebird_1.reject(error)

	  })

	}

	/**
	 * Request password reset for a specific user
	 * @function io3d.auth.requestPasswordReset
	 * @param {object} args
	 * @param {string} args.email
	 */
	function requestPasswordReset (args) {

	  var credentials = {
	    email: args.email
	  };

	  logger.debug('Sending password reset request to API ...');
	  return callService('User.requestPasswordReset', credentials)
	    .then(function onSuccess(result) {

	      // success
	      logger.debug('API: requesting password reset successful.');
	      return bluebird_1.resolve()

	    }, function onError(error){

	      // denied
	      logger.debug('API: requesting password reset failed.', error);
	      return bluebird_1.reject(error)

	    })

	}

	/**
	 * Resend activation email
	 * @function io3d.auth.resendActivationEmail
	 * @param {object} args
	 * @param {string} args.email
	 */
	function resendActivationEmail (args) {

	  var credentials = {
	    email: args.email
	  };

	  //
	  logger.debug('Sending account activation request to API ...');
	  return callService('User.requestAccountActivation', credentials)
	    .then(function onSuccess(result) {

	      // success
	      logger.debug('API: requesting account activation successful.');
	      return bluebird_1.resolve()

	    }, function onError(error){

	      // denied
	      logger.debug('API: requesting account activation failed.', error);
	      return bluebird_1.reject(error)

	    })


	}

	/**
	 * Login in user using credentials
	 * @function io3d.auth.logIn
	 * @param {object} args
	 * @param {string} args.email - User email or username
	 * @param {string} args.password - User password
	 */

	function logIn (args) {

	  var credentials = {
	    email: args.email,
	    password: args.password || uuid.generate()
	  };

	  // log out first
	  logger.debug('Sending API login request for user "' + credentials.email + '" ...');
	  return callService('User.logOut').then(function onLogoutSuccess() {

	    // send log in request
	    return callService('User.logIn', {
	      loginData: {
	        resourceName: credentials.email,
	        password: credentials.password
	      }
	    })

	  }).then(function onLoginSuccess () {

	    // request session to verify login with a separate request
	    return getSession()

	  }).then(function onSessionSuccess (session) {

	    if (session.isAuthenticated) {
	      logger.debug('API: User "' + session.user.email + '" logged in successfully.');
	      return session
	    } else {
	      return bluebird_1.reject('Log in error: Session could not been established.')
	    }

	  }).catch(function onError (error) {

	    // login failed
	    logger.debug('API: Could not log in user "' + credentials.email + '".', error);
	    return bluebird_1.reject(error)

	  })

	}

	/**
	 * Log out currently authenticated user.
	 * @function io3d.auth.logOut
	 */
	function logOut () {

	  logger.debug('Sending API log out request...');
	  return callService('User.logOut').then(function onLogoutSuccess (result) {

	    // verify if user has been logged out
	    return getSession()

	  }).then(function onSessionSuccess (session) {

	    if (!session.isAuthenticated) {
	      logger.debug('API: Log out successful.');
	      return session
	    } else {
	      return bluebird_1.reject('Log out error: Session has not been terminated.')
	    }

	  }).catch(function onError (error) {

	    logger.error('Log out error.', error);
	    return bluebird_1.reject(error)

	  })
	}

	/**
	 * Reenerate secret API key
	 */

	function regenerateSecretApiKey () {
	  logger.debug('Sending API request to generate secret API key ...');
	  return callService('Organization.generateSecretApiKey').then(function onSuccess(key) {
	    logger.debug('API: Generating secret API key successful: ', key);
	    return key
	  }, function onReject(error) {
	    logger.error('API: Error generating secret key.', error);
	    return bluebird_1.reject(error)
	  })
	}

	/**
	 * Get secret API key
	 * @function io3d.auth.getSecretApiKey
	 */

	function getSecretApiKey () {
	  logger.debug('Sent API request reading secret key ...');
	  return callService('Organization.read').then(function onSuccess (result) {
	    if (result.secretApiKey) {
	      logger.debug('Received secret API key from API');
	      return result.secretApiKey
	    } else {
	      // user has no secret key yet: generate one
	      logger.debug('User has no secret key. Sent request to generate one.');
	      return regenerateSecretApiKey()
	    }
	  }, function onError (error) {
	    logger.debug('Error receiving secret API key');
	    return Promise.reject(error)
	  })
	}

	/**
	 * Generate publishable API key
	 */

	function generatePublishableApiKey (args) {

	  var allowedDomains = args.allowedDomains;

	  logger.debug('Sending API request to generate publishable API key ...');
	  return callService('Organization.generatePublishableApiKey', {
	    allowedDomains: allowedDomains
	  }).then(function onSuccess(key) {
	    logger.debug('API: Generating publishable API key successful: ', key);
	    return key
	  }, function onReject(error) {
	    logger.error('API: Error generating publishable key.', error);
	    return bluebird_1.reject(error)
	  })
	}

	/**
	 * List publishable API keys
	 */

	function listPublishableApiKeys () {
	  logger.debug('Sending API request to list publishable API keys ...');
	  return callService('Organization.listPublishableApiKeys').then(function onSuccess(keys) {
	    logger.debug('API: Listing publishable API keys successful: ', keys);
	    return keys
	  }, function onReject(error) {
	    logger.error('API: Error listing publishable keys.', error);
	    return bluebird_1.reject(error)
	  })
	}

	/**
	 * Update publishable API key domains
	 */

	function updatePublishableApiKeyDomains (args) {

	  var key = args.key;
	  var allowedDomains = args.allowedDomains;

	  logger.debug('Sending API request to update publishable API key domains ...');
	  return callService('Organization.updatePublishableApiKeyDomains', {
	    key: key,
	    allowedDomains: allowedDomains
	  }).then(function onSuccess(message) {
	    logger.debug('API: Updating publishable API key domains successful: ', message);
	    return message
	  }, function onReject(error) {
	    logger.error('API: Error updating publishable key domains.', error);
	    return bluebird_1.reject(error)
	  })
	}

	/**
	 * Revoke publishable API key
	 */

	function revokePublishableApiKey (args) {

	  var key = args.key;

	  logger.debug('Sending API request to generate publishable API key ...');
	  return callService('Organization.revokePublishableApiKey', {
	    key: key
	  }).then(function onSuccess(message) {
	    logger.debug('API: Revoking publishable API key successful: ', message);
	    return message
	  }, function onReject(error) {
	    logger.error('API: Error revoking publishable key.', error);
	    return bluebird_1.reject(error)
	  })
	}

	// export

	var auth = {
	  // user
	  getSession: getSession,
	  session$: session$,
	  signUp: signUp,
	  signup: signUp, // alias
	  logIn: logIn,
	  login: logIn, // alias
	  logOut: logOut,
	  logout: logOut, // alias
	  setPassword: setPassword,
	  requestPasswordReset: requestPasswordReset,
	  resendActivationEmail: resendActivationEmail,
	  // secret api key
	  getSecretApiKey: getSecretApiKey,
	  regenerateSecretApiKey: regenerateSecretApiKey,
	  // publishable api keys
	  generatePublishableApiKey: generatePublishableApiKey,
	  listPublishableApiKeys: listPublishableApiKeys,
	  updatePublishableApiKeyDomains: updatePublishableApiKeyDomains,
	  revokePublishableApiKey: revokePublishableApiKey
	};

	var FALLBACK_MIME_TYPE = 'application/octet-stream';
	var EXTENSION_TO_MIME_TYPE = {
	    obj: 'text/plain',
	    dds: 'application/octet-stream',
	    dwg: 'application/acad',
	    dxf: 'application/dxf',
	    jpg: 'image/jpeg',
	    jpeg: 'image/jpeg',
	    png: 'image/png',
	    gif: 'image/gif',
	    txt: 'text/plain',
	    log: 'text/plain',
	    svg: 'svg+xml',
	    html: 'text/html',
	    htm: 'text/html',
	    js: 'application/javascript',
	    json: 'application/json',
	    md: 'text/markdown',
	    csv: 'text/csv',
	    gz:	'application/x-gzip',
	    gzip:	'application/x-gzip',
	    zip:'application/x-zip',
	    pdf: 'application/pdf',
	    '3ds': 'application/x-3ds'
	  };

	function getMimeTypeFromFileName (filename) {
	  var
	    result = FALLBACK_MIME_TYPE,
	    extension;

	  // get extension if file has one
	  if (filename.indexOf('.') > -1) {
	    extension = filename.split('.').pop().toLowerCase();
	    if (EXTENSION_TO_MIME_TYPE[extension]) {
	      // set mime type if it exists in the map
	      result = EXTENSION_TO_MIME_TYPE[extension];
	    }
	  }

	  return result
	}

	// configs

	var ANONYMOUS_USER_ID = 'anonymous-uploads';
	var KEY_USER_ID_PLACEHOLDER = '{{userId}}';

	// main

	function putToStorage (files, options) {

	  options = options || {};

	  if (!Array.isArray(files)) {

	    // upload single file

	    return putSingleFileToStore(files, options)

	  } else {

	    // upload multiple files and bundle progress events
	    // TODO: add dir option

	    var totalSize_ = 0;
	    var progress_ = [];
	    var onProgress_ = options.onProgress;

	    return bluebird_1.map(files, function(file, i){
	      totalSize_ += file.size;
	      return putSingleFileToStore(file, {
	        dir: options.dir,
	        onProgress: function(progress, total){
	          progress_[i] = progress;
	          if (onProgress_) onProgress_(progress_.reduce(function(a, b) { return a+b; }, 0), totalSize_);
	        }
	      })
	    })

	  }

	}

	// private

	function putSingleFileToStore (file, options) {

	  // API
	  var key = options.key;
	  var dir = options.dir;
	  var fileName = options.filename || options.fileName || file.name || 'unnamed.txt';
	  var onProgress = options.onProgress;

	  return resolveKey(key, dir, fileName)
	    .then(validateKey)
	    .then(function (key) {
	      return getCredentials(file, key, fileName)
	    })
	    .then(function (credentials) {
	      return uploadFile(file, credentials, onProgress)
	    })

	}

	function resolveKey (key, dir, fileName) {
	  // prefer key. fallback to dir + fileName
	  key = key ? key : (dir ? (dir[dir.length - 1] === '/' ? dir : dir + '/') + fileName : null);
	  var isTemplateKey = !!(key && key.indexOf(KEY_USER_ID_PLACEHOLDER) > -1);

	  // full key including userId provided
	  if (key && !isTemplateKey) return bluebird_1.resolve(key)

	  // get user id
	  return auth.getSession().then(function(session){
	    if (isTemplateKey) {
	      if (session.isAuthenticated) {
	        // replace user id in template key
	        return key.replace( '{{userId}}', session.user.id )
	      } else {
	        console.error('Using key parameter with template syntax requires authentication.');
	        // reject with user friendly error message
	        return bluebird_1.reject('Please log in to upload file.')
	      }
	    } else {
	      // key not provided
	      var uploadFolder = getFormattedDate() + '_' + getShortId();
	      if (session.isAuthenticated) {
	        // construct new user specific key
	        return '/' + session.user.id + '/' + uploadFolder + '/' + fileName
	      } else {
	        // construct anonymous key
	        var k = '/' + ANONYMOUS_USER_ID + '/' + uploadFolder + '/' + fileName;
	        return null
	      }
	    }
	  })
	}

	var keyValidationRegex = /^\/([a-zA-Z0-9\.\-\_]+\/)+([a-zA-Z0-9\.\-\_]+)$/;
	function validateKey (key) {
	  if (!key) {
	    return bluebird_1.resolve(null)
	  } else if (keyValidationRegex.test(key)) {
	    return bluebird_1.resolve(key)
	  } else {
	    return bluebird_1.reject(
	      'Key format validation failed.\n'
	      + key + '\n'
	      + 'Key must match the following pattern\n'
	      + '- must start with a slash\n'
	      + '- must not end with a slash\n'
	      + '- must have one or more directories\n'
	      + '- must not include double slashes like: "//"\n'
	      + '- allowed characters are: a-z A-Z 0-9 _ - . /'
	    )
	  }
	}

	function getCredentials (file, key, fileName) {
	  // strip leading slash
	  if (key && key[0] === '/') key = key.substring(1);
	  // get credentials for upload
	  var params = {
	    contentLength: file.size || file.length
	  };
	  if (key) {
	    params.contentType = getMimeTypeFromFileName(key);
	    params.key = key;
	  } else if (fileName) {
	    params.contentType = getMimeTypeFromFileName(fileName);
	    params.fileName = fileName;
	  } else {
	    return bluebird_1.reject('Key or fileName param must be provided.')
	  }
	  return callService('S3.getCredentials', params)
	}

	function uploadFile (file, credentials, onProgress) {
	  // upload directly to S3 using credentials
	  var fd = new FormData$1();
	  fd.append('key', credentials.key);
	  fd.append('AWSAccessKeyId', credentials.AWSAccessKeyId);
	  fd.append('acl', credentials.acl);
	  fd.append('Content-Type', credentials.contentType);
	  fd.append('policy', credentials.policy);
	  fd.append('signature', credentials.signature);
	  fd.append('success_action_status', '201');
	  if (credentials.contentEncoding) {
	    fd.append('Content-Encoding', credentials.contentEncoding);
	  }
	  fd.append('file', file);

	  if (runtime.isBrowser) {

	    // upload using XHR (in order to provide progress info)
	    return new bluebird_1(function(resolve, reject){
	      var xhr = new XMLHttpRequest();
	      xhr.crossOrigin = 'Anonymous';
	      xhr.onload = function (event) {
	        if (xhr.status >= 200 && xhr.status < 300) {
	          var key = getKeyFromS3Response(xhr.responseText);
	          key ? resolve(key) : reject ('Error Uploading File: '+xhr.responseText);
	        } else {
	          reject ('Error Uploading File: '+xhr.responseText);
	        }
	      };
	      xhr.onerror = function (event) {
	        reject(event);
	      };
	      if (onProgress) {
	        xhr.upload.addEventListener('progress', function(e){
	          onProgress(e.loaded, e.total);
	        }, false);
	      }
	      xhr.open('POST', credentials.url, true);
	      xhr.send(fd);
	    })

	  } else {

	    // node environment: upload using fetch
	    return fetch$1(credentials.url, {method: 'POST', body: fd}).then(function (res) {
	      return res.text()
	    }).then(function(str){
	      return getKeyFromS3Response(str) || bluebird_1.reject('Error Uploading File: '+str)
	    })

	  }
	}

	function getKeyFromS3Response (str) {
	  // get file key from response
	  var s = /<Key>(.*)<\/Key>/gi.exec(str);
	  return s ? '/'+s[1] : false
	}

	function getFormattedDate() {
	  var d = new Date();
	  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
	    + '_' + d.getHours() + '-' + d.getMinutes() // + '-' + d.getSeconds()
	}

	// main

	function getFromStorage (key, options) {

	  // WIP: for now, assume that this is only being used for data3d
	  // TODO: use options.type or filename extension to specify loader
	  return loadData3d(convertKeyToUrl$1(key))

	}

	// helpers

	function convertKeyToUrl$1 (key, options) {
	  // API
	  options = options || {};
	  var cdn = options.cdn !== undefined ? options.cdn : true;
	  var encode = options.encode !== undefined ? options.encode : true;
	  // check cache
	  // if (keyToUrlCache[ key + cdn + encode ]) {
	  //   return keyToUrlCache[ key + cdn + encode ]
	  // }
	  // internals
	  var processedKey = key;
	  // remove leading slash
	  var startsWithSlash = /^\/(.*)$/.exec(processedKey);
	  if (startsWithSlash) {
	    processedKey = startsWithSlash[1];
	  }
	  // encode key if containig special chars
	  if (encode && !/^[\.\-\_\/a-zA-Z0-9]+$/.test(processedKey)) {
	    processedKey = encodeURIComponent(processedKey);
	  }
	  // compose url
	  var url = 'https://'+(cdn ? configs.storageDomain : configs.storageDomainNoCdn)+'/' + processedKey;
	  // add to cache
	  // keyToUrlCache[ key + cdn + encode ] = url
	  return url
	}

	var storage = {
	  get: getFromStorage,
	  put: putToStorage
	};

	function getViewerUrl (args) {
	  return 'https://spaces.archilogic.com/3d/!'+args.sceneId
	}

	var scene = {
	  getViewerUrl: getViewerUrl
	};

	var css = ".io3d-message-list {\n  z-index: 100001;\n  position: fixed;\n  top: 0;\n  left: 50%;\n  margin-left: -200px;\n  width: 400px;\n  font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;\n  font-weight: normal;\n  letter-spacing: 1px;\n  line-height: 1.3;\n  text-align: center;\n}\n.io3d-message-list .message {\n  display: block;\n  opacity: 0;\n}\n.io3d-message-list .message .spacer {\n  display: block;\n  height: 10px;\n}\n.io3d-message-list .message .text {\n  display: inline-block;\n  padding: 10px 12px 10px 12px;\n  border-radius: 3px;\n  color: white;\n  font-size: 18px;\n}\n.io3d-message-list .message .text a {\n  color: white;\n  text-decoration: none;\n  padding-bottom: 0px;\n  border-bottom: 2px solid white;\n}\n.io3d-message-list .message .neutral {\n  background: rgba(0, 0, 0, 0.9);\n}\n.io3d-message-list .message .success {\n  background: linear-gradient(50deg, rgba(35, 165, 9, 0.93), rgba(102, 194, 10, 0.93));\n}\n.io3d-message-list .message .warning {\n  background: linear-gradient(50deg, rgba(165, 113, 9, 0.93), rgba(194, 169, 10, 0.93));\n}\n.io3d-message-list .message .error {\n  background: linear-gradient(50deg, rgba(165, 9, 22, 0.93), rgba(194, 56, 10, 0.93));\n}\n.io3d-overlay {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  z-index: 100000;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;\n  font-weight: 200;\n  font-size: 18px;\n  letter-spacing: 1px;\n  color: white;\n  text-align: center;\n  line-height: 1.3;\n  background: linear-gradient(70deg, rgba(20, 17, 34, 0.96), rgba(51, 68, 77, 0.96));\n}\n@keyframes overlay-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes overlay-fade-out {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.io3d-overlay .centered-content {\n  display: inline-block;\n  position: relative;\n  top: 50%;\n  text-align: left;\n}\n.io3d-overlay .centered-content .button {\n  margin-right: 4px;\n  margin-top: 1.5em;\n}\n.io3d-overlay .bottom-container {\n  width: 100%;\n  display: block;\n  position: absolute;\n  bottom: 1em;\n}\n.io3d-overlay .bottom-container .bottom-content {\n  display: inline-block;\n  position: relative;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: left;\n  color: rgba(255, 255, 255, 0.35);\n}\n.io3d-overlay .bottom-container .bottom-content .clickable {\n  cursor: pointer;\n  transition: color 500ms;\n}\n.io3d-overlay .bottom-container .bottom-content .clickable:hover {\n  color: white;\n}\n.io3d-overlay .bottom-container .bottom-content a {\n  color: rgba(255, 255, 255, 0.35);\n  text-decoration: none;\n  transition: color 500ms;\n}\n.io3d-overlay .bottom-container .bottom-content a:hover {\n  color: white;\n}\n@keyframes content-slide-in {\n  0% {\n    transform: translateY(-40%);\n  }\n  100% {\n    transform: translateY(-50%);\n  }\n}\n@keyframes content-slide-out {\n  0% {\n    transform: translateY(-50%);\n  }\n  100% {\n    transform: translateY(-40%);\n  }\n}\n.io3d-overlay h1 {\n  margin: 0 0 0.5em 0;\n  font-size: 42px;\n  font-weight: 200;\n  color: white;\n}\n.io3d-overlay p {\n  margin: 1em 0 0 0;\n  font-size: 18px;\n  font-weight: 200;\n}\n.io3d-overlay .hint {\n  position: relative;\n  margin: 1em 0 0 0;\n  color: rgba(255, 255, 255, 0.35);\n  font-size: 18px;\n  font-weight: 200;\n}\n.io3d-overlay .hint a {\n  color: rgba(255, 255, 255, 0.35);\n  text-decoration: none;\n  transition: color 600ms;\n}\n.io3d-overlay .hint a:hover {\n  color: white;\n}\n.io3d-overlay .button {\n  cursor: pointer;\n  display: inline-block;\n  color: rgba(255, 255, 255, 0.35);\n  width: 40px;\n  height: 40px;\n  line-height: 32px;\n  border: 2px solid rgba(255, 255, 255, 0.35);\n  border-radius: 50%;\n  text-align: center;\n  font-size: 18px;\n  font-weight: 200;\n  transition: opacity 300ms, color 300ms;\n}\n.io3d-overlay .button:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n  color: white;\n  border: 2px solid white;\n}\n.io3d-overlay .button-highlighted {\n  color: white;\n  border: 2px solid white;\n}\n.io3d-overlay .close-button {\n  display: block;\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  font-size: 18px;\n  font-weight: 200;\n}\n.io3d-overlay input,\n.io3d-overlay select,\n.io3d-overlay option,\n.io3d-overlay textarea {\n  font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;\n  font-size: 24px;\n  font-weight: normal;\n  letter-spacing: 1px;\n  outline: none;\n  margin: 0 0 0 0;\n  color: white;\n}\n.io3d-overlay select,\n.io3d-overlay option,\n.io3d-overlay input:not([type='checkbox']):not([type='range']) {\n  padding: 0.2em 0 0.4em 0;\n  width: 100%;\n  line-height: 20px;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border-radius: 0px;\n  border: 0px;\n  background: transparent;\n  border-bottom: 2px solid rgba(255, 255, 255, 0.3);\n  transition: border-color 1s;\n}\n.io3d-overlay select:focus,\n.io3d-overlay option:focus,\n.io3d-overlay input:not([type='checkbox']):not([type='range']):focus {\n  border-color: white;\n}\n.io3d-overlay textarea {\n  display: box;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  padding: 0.2em 0 0.4em 0;\n  min-width: 100%;\n  max-width: 100%;\n  line-height: 26px;\n  border: 0px;\n  background: rgba(255, 255, 255, 0.08);\n  border-bottom: 2px solid rgba(255, 255, 255, 0.3);\n}\n.io3d-overlay input[type='checkbox'] {\n  position: relative;\n  height: 20px;\n  vertical-align: bottom;\n  margin: 0;\n}\n.io3d-overlay .reveal-api-key-button {\n  cursor: pointer;\n  position: absolute;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 2px;\n  bottom: 0.7em;\n  padding: 0.1em 0.2em 0.2em 0.2em;\n  line-height: 20px;\n  transition: color 600ms;\n}\n.io3d-overlay .reveal-api-key-button:hover {\n  color: white;\n}\n.io3d-overlay a {\n  color: white;\n  text-decoration: none;\n}\n.io3d-overlay .key-menu {\n  position: relative;\n  margin: 3em 0 0 0;\n}\n.io3d-overlay .key-menu .key-image {\n  width: 172px;\n  height: 127px;\n}\n.io3d-overlay .key-menu .key-button {\n  position: absolute;\n  left: 156px;\n  height: 36px;\n  line-height: 36px;\n  background: rgba(255, 255, 255, 0.1);\n  cursor: pointer;\n  padding: 0 14px 0 14px;\n  border-radius: 2px;\n  transition: background 300ms linear;\n}\n.io3d-overlay .key-menu .key-button:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.io3d-overlay .key-menu .go-to-publishable-api-key-ui {\n  top: 11px;\n}\n.io3d-overlay .key-menu .go-to-secret-api-key-ui {\n  bottom: 11px;\n}\n.io3d-overlay .regegenerate-secret-key-button {\n  cursor: pointer;\n}\n.io3d-overlay .publishable-api-keys .list {\n  max-height: 50vh;\n  overflow: auto;\n  padding: 0 15px 0 0;\n}\n.io3d-overlay .publishable-api-keys .list .key-item {\n  position: relative;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 3px;\n  margin-bottom: 12px;\n  padding: 4px 5px 3px 8px;\n}\n.io3d-overlay .publishable-api-keys .list .key {\n  font-weight: 200 !important;\n  border-bottom: 0 !important;\n  margin-bottom: 0 !important;\n  padding: 0 !important;\n}\n.io3d-overlay .publishable-api-keys .list .domains {\n  margin: 0 0 0 0 !important;\n}\n.io3d-overlay .publishable-api-keys .list .button {\n  position: absolute !important;\n  margin: 0 !important;\n  background-repeat: no-repeat;\n  background-position: center;\n  color: white;\n  opacity: 0.5;\n}\n.io3d-overlay .publishable-api-keys .list .button:hover {\n  opacity: 1;\n}\n.io3d-overlay .publishable-api-keys .list .delete-key-button {\n  right: 8px;\n  top: 9px;\n}\n.io3d-overlay .publishable-api-keys .list .edit-domains-button {\n  positions: absolute;\n  right: 56px;\n  top: 9px;\n  background-size: 75%;\n  padding: 5px;\n}\n.io3d-overlay .publishable-api-keys .generate-new-key-button {\n  margin: 1.5em 0 0 0;\n  display: inline-block;\n  cursor: pointer;\n}\n";

	// basic element utils for convenience inspired by jquery API

	var elementStringRegex = /^<(\S+)>$/i;

	// main

	var el = function (x, attributes) {
	  runtime.assertBrowser();

	  if (x) {
	    if (typeof x === 'string') {
	      // create element
	      var tagSearch = elementStringRegex.exec(x);
	      var tag = tagSearch ? tagSearch[1] : null;
	      if (tag) {
	        return addElement(tag, attributes)
	      } else {
	        throw 'Only basic tags like "<div>" without attributes are currently supported. (No queries and no HTML strings)'
	      }
	    } else if (isElement(x)) {
	      // only add convenience methods
	      extendWithConvenienceMethods(x);
	    } else {
	      throw 'Please provide html element string (i.e. "<div>") or element object as first argument.'
	    }
	  }
	};

	// utils
	el.isElement = isElement;

	// helpers

	function addElement (type, attrs) {
	  runtime.assertBrowser();

	  // create element
	  var el = document.createElement(type);

	  // add attributes
	  if (attrs) Object.keys(attrs).forEach(function (key) {
	    if (key === 'text') {
	      // text
	      el.appendChild(document.createTextNode(attrs.text));
	    } else if (key === 'html') {
	      // html
	      el.innerHTML = attrs.html;
	    } else if (key === 'click' || key === 'keydown' || key === 'keyup') {
	      // events
	      el.addEventListener(key, attrs[key]);
	    } else {
	      // any other attributes
	      el.setAttribute(key, attrs[key]);
	    }
	  });

	  extendWithConvenienceMethods(el);

	  return el
	}

	function extendWithConvenienceMethods (el) {
	  el.remove = function removeElement (child) {
	    child ? el.removeChild(child) : el.parentNode.removeChild(el);
	    return el
	  };
	  el.append = function append (o) {
	    if (o) isElement(o) ? el.appendChild(o) : el.innerHTML = o;
	    return el
	  };
	  el.appendTo = function appendToElement (parentEl) {
	    parentEl === 'body' ? document.body.appendChild(el) : parentEl.appendChild(el);
	    return el
	  };
	  el.prependTo = function prependToElement (parentEl) {
	    parentEl === 'body' ? document.body.prepend(el) : parentEl.prepend(el);
	    return el
	  };
	  el.val = function handleValue (str) {
	    str ? el.setAttribute('value', str) : null;
	    return el.value
	  };
	  el.addClass = function addCssClass (str) {
	    el.classList.add(str);
	    return el
	  };
	  el.removeClass = function removeCssClass (str) {
	    el.classList.remove(str);
	    return el
	  };
	  el.hide = function hideElement () {
	    el.___originalStyleDisplay = el.style.display;
	    el.style.display = 'none';
	    return el
	  };
	  el.show = function showElement () {
	    el.style.display = el.___originalStyleDisplay && el.___originalStyleDisplay !== '' ? el.___originalStyleDisplay : 'block';
	    return el
	  };
	  el.toggleSlide = function toggleSlide () {
	    toggleSlideEl(el);
	  };
	}

	// Returns true if it is a DOM element
	// https://stackoverflow.com/a/384380/2835973
	function isElement(o){
	  return (
	    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
	      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
	  );
	}

	// https://stackoverflow.com/a/3797442/2835973
	function getHiddenElementHeight (el) {
	  var el_style = window.getComputedStyle(el),
	    el_display = el_style.display,
	    el_position = el_style.position,
	    el_visibility = el_style.visibility,
	    el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),

	    wanted_height = 0;

	  // if its not hidden we just return normal height
	  if (el_display !== 'none' && el_max_height !== '0') {
	    return el.offsetHeight;
	  }

	  // the element is hidden so:
	  // making the el block so we can meassure its height but still be hidden
	  el.style.position = 'absolute';
	  el.style.visibility = 'hidden';
	  el.style.display = 'block';

	  wanted_height = el.offsetHeight;

	  // reverting to the original values
	  el.style.display = el_display;
	  el.style.position = el_position;
	  el.style.visibility = el_visibility;

	  return wanted_height;
	}

	// https://stackoverflow.com/a/3797442/2835973
	function toggleSlideEl (el) {
	  var el_max_height = 0;

	  if (el.getAttribute('data-max-height')) {
	    // we've already used this before, so everything is setup
	    if (el.style.maxHeight.replace('px', '').replace('%', '') === '0') {
	      el.style.maxHeight = el.getAttribute('data-max-height');
	      el.style.opacity = 1;
	    } else {
	      el.style.maxHeight = 0;
	      el.style.opacity = 0;
	    }
	  } else {
	    el_max_height = getHiddenElementHeight(el) + 'px';
	    //el.style['-webkit-transition'] = 'background 0.5a linear, max-height 0.5s ease-in-out';
	    el.style['-webkit-transition'] = 'opacity 0.5s ease-out, max-height 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
	    el.style.transition = 'opacity 0.5s ease-out, max-height 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
	    el.style.overflowY = 'hidden';
	    el.style.maxHeight = '0';
	    el.setAttribute('data-max-height', el_max_height);
	    el.style.display = 'block';

	    // we use setTimeout to modify maxHeight later than display (to we have the transition effect)
	    setTimeout(function () {
	      el.style.maxHeight = el_max_height;
	      el.style.opacity = 1;
	    }, 10);
	  }
	}

	// container DOM element
	var mainEl;
	if (runtime.isBrowser) runtime.domReady(function(){
	  mainEl = el('<div>',{ class: 'io3d-message-list' }).appendTo('body');
	});

	// main
	function message (message, expire, type) {
	  runtime.assertBrowser();

	  // do nothing if there is no message
	  if (!message || message === '') return bluebird_1.resolve()
	  // default expire value is 4 secs
	  var expire = expire !== undefined ? expire : 4000; // ms
	  // default message type
	  var type = type || 'neutral'; // can be: neutral, success, warning, error

	  // internals
	  var isClosed = false;

	  // create main html element
	  var messageEl = el('<div>',{
	    class: 'message'
	  }).prependTo(mainEl).hide();
	  el('<div>',{ class: 'spacer' }).appendTo(messageEl);

	  // insert content
	  var contentEl = el('<div>',{
	    class: 'text '+type
	  }).appendTo(messageEl);
	  el.isElement(message) ? contentEl.append(message) : contentEl.innerHTML = message;

	  // create message object
	  var resolve;
	  var result = new bluebird_1(function(resolve_, reject_){
	    resolve = resolve_;
	  });

	  // close method
	  result.close = function close () {
	    if (isClosed) return
	    isClosed = true;
	    messageEl.toggleSlide();
	    setTimeout(function(){
	      messageEl.remove();
	    }, 500);
	    resolve();
	  };

	  // init
	  messageEl.toggleSlide();

	  // close message on expire
	  if (expire) setTimeout(result.close, expire);

	  // expose message object
	  return result

	}

	// shortcuts for convenience
	message.success = function createErrorMessage (str, expire) {
	  return message (str, expire, 'success')
	};
	message.warning = function createErrorMessage (str, expire) {
	  return message (str, expire, 'warning')
	};
	message.error = function createErrorMessage (str, expire) {
	  return message (str, expire !== undefined ? expire : 5000, 'error')
	};

	// configs

	var EXTENSION_WHITE_LIST = [
	  // generic
	  '.json', '.buffer', '.js', '.md', '.txt', '.csv',
	  // 3d formats
	  '.obj', '.mtl', '.ifc', '.fbx', '.gltf', '.bin',
	  // 2d formats
	  '.jpg', '.jpeg', '.jpe', '.png', '.gif', '.tga', '.dds', '.svg', '.pdf', '.dxf'
	];

	// main

	function getFilesFromDragAndDropEvent (event, options) {
	  // compatibility function to extract files

	  // API
	  options = options || {};
	  var warningCallback = options.onWarning || function () {};

	  // internals
	  var result;
	  var dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;

	  if (dataTransfer.items && dataTransfer.items.length) {
	    // more sophisticated drop API, supporting folders structures
	    // works in webkit browsers only
	    // get files with directories
	    //http://code.flickr.net/2012/12/10/drag-n-drop/
	    result = getFlatFileArrayFromItems(dataTransfer.items).then(function (files) {
	      return removeRootDir(filterValidFiles(files, warningCallback))
	    });

	  } else if (dataTransfer.files) {
	    // "classic" drag and drop api, not supporting folders
	    // check if user tries to dragdrop a folder = only one "file" with no extension
	    var isFolder = dataTransfer.files.length === 0 || (dataTransfer.files.length === 1 && dataTransfer.files[0].name.indexOf('.') < 0);
	    if (isFolder) {
	      result = Promise.reject('Sorry, but this browser doesn\'t support drag&drop of folders. (use Chrome)');
	    } else {
	      // create Blobs from Files because in File name property is read only.
	      // but we may want file.name to be writable later.
	      var i, l, _file, file, files = [];
	      for (i = 0, l = dataTransfer.files.length; i < l; i++) {
	        _file = dataTransfer.files[i];
	        file = new Blob([_file], {type: _file.type});
	        file.name = _file.name;
	        files.push(file);
	      }
	      result = Promise.resolve(filterValidFiles(files, warningCallback));

	    }

	  } else {

	    result = Promise.reject('Event does not contain "items" nor "files" property.');

	  }

	  return result

	}

	// private methods

	function filterValidFiles (_files, warningCallback) {
	  var file, fileName, extension, hasValidExtension, filteredFiles = [];
	  for (var i = 0, l = _files.length; i < l; i++) {
	    file = _files[i];
	    fileName = file.name;
	    if (typeof fileName === 'string') {
	      // ignore system files
	      if (fileName[0] === '.' || fileName.substring(0, 9) === '__MACOSX/') {
	        continue
	      }
	      // check extensions
	      extension = fileName.split('.').length > 1 ? '.' + fileName.split('.').pop().toLowerCase() : null;
	      if (!extension) {
	        console.error('File ' + fileName + ' has no extension and will be ignored.');
	        warningCallback('File ' + fileName + ' has no extension and will be ignored.');
	      } else {
	        hasValidExtension = EXTENSION_WHITE_LIST.indexOf(extension) > -1;
	        if (!hasValidExtension) {
	          console.error('File ' + fileName + ' is not supported and will be ignored.');
	          warningCallback('File ' + fileName + ' is not supported and will be ignored.');
	        } else {
	          filteredFiles[filteredFiles.length] = file;
	        }
	      }
	    }
	  }
	  return filteredFiles
	}

	function getFlatFileArrayFromItems (items) {

	  // get entries from items
	  var entries = [], item;
	  for (var i = 0, l = items.length; i < l; i++) {
	    item = items[i];
	    entries[entries.length] = item.webkitGetAsEntry ? item.webkitGetAsEntry() : item.getAsFile();
	  }

	  // recursively parse directories and collect files
	  var files = [];
	  return recursivelyParseEntries(entries, files).then(function () {
	    return files
	  })

	}

	function recursivelyParseEntries (entries, resultArray) {
	  return Promise.all(
	    entries.map(function (entry) {

	      if (entry.isFile) {

	        // convert File into Blob
	        return new Promise(function (resolve, reject) {
	          // add file to file array
	          entry
	            .file(function (_file) {
	              // create Blob from File because in File name property is read only.
	              // but we want file.name to include path so we need to overwrite it.
	              var file = new Blob([_file], {type: _file.type});
	              file.name = entry.fullPath.substring(1);
	              resultArray[resultArray.length] = file;
	              resolve();
	            });
	        })

	      } else if (entry instanceof File) {

	        // create Blob from File because in File name property is read only.
	        // but we want file.name to include path so we need to overwrite it.
	        var file = new Blob([entry], {type: entry.type});
	        file.name = entry.name;
	        // add file to file array
	        resultArray[resultArray.length] = file;

	      } else if (entry.isDirectory) {

	        // read directory
	        return new Promise(function (resolve, reject) {
	          entry
	            .createReader()
	            .readEntries(function (_entries) {
	              resolve(recursivelyParseEntries(_entries, resultArray));
	            });
	        })

	      }
	    })
	  )
	}

	function removeRootDir (files) {
	  // get root dir from first file
	  var rootDir, i, l;
	  if (files.length && files[0].name && files[0].name.indexOf('/') > -1) {
	    rootDir = files[0].name.split('/')[0];
	  } else {
	    return files
	  }

	  // check if all files have the same root dir
	  var hasSameRootDir;
	  for (i = 1, l = files.length; i < l; i++) {
	    hasSameRootDir = files[i].name && files[i].name.indexOf('/') > -1 && files[i].name.split('/')[0] === rootDir;
	    if (!hasSameRootDir) {
	      return files
	    }
	  }

	  // remove root dir from file names
	  for (i = 0, l = files.length; i < l; i++) {
	    files[i].name = files[i].name.substring(rootDir.length + 1);
	  }

	  // iterate recursively until all equal leading directories are removed
	  return removeRootDir(files)

	}

	// main

	function createFileDropUi (args) {
	  runtime.assertBrowser();

	  // API

	  // html
	  var elementId = args.elementId;
	  var onInput = args.onInput;
	  var dragOverCssClass = args.dragOverCssClass;
	  // drag events
	  var onDragEnter = args.onDragEnter;
	  var onDragLeave = args.onDragLeave;
	  // upload related
	  var upload = args.upload !== undefined ? args.upload : true;
	  var onUploadProgress = args.onUploadProgress;
	  var uploadProgressBarCss = args.uploadProgressBarCss || 'background: rgba(0,0,0,0.2);';

	  // DOM

	  // get reference to main DOM element
	  var mainEl = document.getElementById(elementId);
	  // input allows selecting files on click
	  var fileInputEl = document.createElement('input');
	  fileInputEl.setAttribute('type', 'file');
	  fileInputEl.setAttribute('multiple', true);
	  fileInputEl.setAttribute('style', 'cursor:pointer; position:absolute; top:0; left:0; height:100%; width:100%; opacity:0;');
	  mainEl.appendChild(fileInputEl);
	  // progress bar
	  var progressBarEl = document.createElement('div');
	  progressBarEl.setAttribute('style', 'position:absolute; top:0; left:0; bottom:0; width:0; transition: width 1s linear;'+uploadProgressBarCss);
	  if(mainEl.style.position === null) mainEl.style.position = 'relative';
	  mainEl.appendChild(progressBarEl);

	  // events

	  function dragEnter (event) {
	    if (dragOverCssClass) mainEl.classList.add(dragOverCssClass);
	    if (onDragEnter) onDragEnter(event);
	    preventBrowserDefaults(event);
	  }

	  function dragLeave (event) {
	    if (dragOverCssClass) mainEl.classList.remove(dragOverCssClass);
	    if (onDragLeave) onDragLeave(event);
	    preventBrowserDefaults(event);
	  }

	  function dropFiles (event) {
	    if (dragOverCssClass) mainEl.classList.remove(dragOverCssClass);
	    preventBrowserDefaults(event);
	    getFilesFromDragAndDropEvent(event).then(function (files) {
	      handleFileInput(files, event);
	    }).catch(console.error);
	  }

	  function selectFiles (event) {
	    // convert FileList into array
	    // https://developer.mozilla.org/en/docs/Web/API/FileList
	    var files = [], fileList = event.target.files;
	    for (var i = 0; i < fileList.length; i++) files[i] = fileList[i];
	    handleFileInput(files, event);
	  }

	  function handleFileInput(files, event) {
	    // uploading files is optional
	    (upload ? uploadFiles(files) : bluebird_1.resolve()).then(function(storageIds){
	      // create convenient collection with file info including storageIds if available
	      var fileCollection = files.map(function(file, i){
	        var item = { file: file, name: file.name, size: file.size, type: file.type };
	        if (storageIds) {
	          item.storageId = storageIds[i];
	          item.url = 'https://storage.3d.io' + storageIds[i];
	        }
	        return item
	      });
	      onInput(fileCollection, event);
	    });
	  }

	  function uploadFiles (files) {
	    progressBarEl.style.width = '0';
	    progressBarEl.style.display = 'block';
	    return putToStorage(files, {
	      onProgress: function onProgress(uploaded, total) {
	        progressBarEl.style.width = Math.min(100, Math.round(100 * (uploaded / total))) + '%';
	        if (onUploadProgress) onUploadProgress(uploaded, total);
	      }
	    }).then(function (storageIds) {
	      progressBarEl.style.display = 'none';
	      progressBarEl.style.width = '0';
	      return storageIds
	    })
	  }

	  // events fired on the draggable target
	  // document.addEventListener("drag", function( event ) {}, false)
	  // document.addEventListener("dragstart", function( event ) {}, false)
	  // document.addEventListener("dragend", function( event ) {}, false)
	  // prevent events on window drop
	  window.addEventListener('dragover', preventBrowserDefaults, false);
	  window.addEventListener('drop', preventBrowserDefaults, false);
	  // events fired on the drop targets
	  fileInputEl.addEventListener('dragover', function (event) {
	    preventBrowserDefaults(event);
	    event.dataTransfer.dropEffect = 'copy'; // // adds a little "+" to mouse cursor
	  }, false);
	  fileInputEl.addEventListener('dragenter', dragEnter, false);
	  fileInputEl.addEventListener('dragleave', dragLeave, false);
	  fileInputEl.addEventListener('dragend', dragLeave, false);
	  fileInputEl.addEventListener('drop', dropFiles, false);
	  // events from input element
	  fileInputEl.addEventListener('change', selectFiles, false);

	}

	// helpers

	function preventBrowserDefaults (event) {
	  event.stopPropagation();
	  event.preventDefault();
	}

	function poll(callback, options) {

	  // API
	  options = options || {};
	  var timeout = options.timeout || 10 * 60 * 1000;
	  var minInterval = options.minInterval || 1000;
	  var maxInterval = options.maxInterval || 5000;
	  var intervalIncreaseFactor = options.intervalIncreaseFactor || 1.05;

	  return new bluebird_1(function( fulfill, reject, onCancel ){
	    var flags = { isCancelled: false };
	    // cancellation is supported in bluebird version > 3.x
	    // enable cancellation in Promise.config as it is off by default
	    if (onCancel) onCancel(function(){ flags.isCancelled = true; });
	    // start recursive poll
	    recursivePoll(callback, fulfill, reject, minInterval, maxInterval, intervalIncreaseFactor, 0, timeout, flags);
	  })

	}

	// helper

	function recursivePoll(callback, fulfill, reject, interval, maxInterval, intervalIncreaseFactor, timeElapsed, timeout, flags) {

	  // return if poll has been cancelled in meanwhile
	  if (flags.isCancelled) return reject('Poll request has been cancelled')
	  // increase interval
	  if (interval < maxInterval) interval *= intervalIncreaseFactor;
	  // check timeout
	  if (timeElapsed > timeout) return reject('Poll request timed out')
	  // count time
	  timeElapsed += interval;
	  // call
	  callback(fulfill, reject, function next() {
	    window.setTimeout(function(){
	      recursivePoll(callback, fulfill, reject, interval, maxInterval, intervalIncreaseFactor, timeElapsed, timeout, flags);
	    }, interval);
	  });

	}

	// main

	function createOverlay () {
	  runtime.assertBrowser();

	  // DOM
	  var mainEl = el('<div>', { class: 'io3d-overlay' }).appendTo(document.body);
	  var centerEl = el('<div>', { class: 'centered-content' }).appendTo(mainEl);
	  var bottomContainerEl = el('<div>', { class: 'bottom-container' }).appendTo(mainEl);
	  var bottomEl = el('<div>', { class: 'bottom-content' }).appendTo(bottomContainerEl);

	  // overlay object
	  var result = {
	    isDestroyed: false,
	    isVisible: false,
	    mainEl: mainEl,
	    centerEl: centerEl,
	    bottomEl: bottomEl,
	    show: show,
	    hide: hide,
	    destroy: destroy
	  };

	  // methods

	  function show (callback) {
	    if (result.isVisible) return
	    result.isVisible = true;

	    mainEl.style.opacity = 0;
	    mainEl.style.display = 'block';
	    mainEl.style.animation = '600ms ease-out 0s 1 normal forwards running overlay-fade-in';
	    centerEl.style.animation = '600ms cubic-bezier(0.2, 0.80, 0.5, 1) 0s 1 normal forwards running content-slide-in';

	    if (callback && typeof callback === 'function') setTimeout(function(){
	      callback();
	    }, 500);

	    return result
	  }

	  function hide (callback) {
	    if (!result.isVisible) return
	    result.isVisible = false;

	    mainEl.style.animation = '600ms ease-out 0s 1 normal forwards running overlay-fade-out';
	    centerEl.style.animation = '600ms ease-in 0s 1 normal forwards running content-slide-out';

	    // remove element
	    setTimeout(function(){
	      mainEl.remove();
	    }, 600);
	    // trigger callback function
	    setTimeout(function(){
	      if (callback && typeof callback === 'function') callback();
	    }, 300);

	    return result
	  }

	  function destroy (callback) {
	    if (result.isDestroyed) return
	    hide(function () {
	      result.isDestroyed = true;
	      if (callback && typeof callback === 'function') callback();
	    });
	    return result
	  }

	  // expose overlay object

	  return result

	}

	// config

	var CSS_WIDTH$2 = 'width:300px;';

	// main

	function createResetPasswordUi (credentials, options) {
	  runtime.assertBrowser();
	  return new bluebird_1(function (resolve, reject){

	    credentials = credentials || {};
	    var email = credentials.email;

	    // overlay
	    var overlay = createOverlay().show();

	    // DOM

	    el('<div>',{
	      text: 'x',
	      class: 'button close-button',
	      click: function onCancel () {
	        destroy(function(){
	          reject('User canceled action.');
	        });
	      }
	    }).appendTo(overlay.mainEl);

	    // centered content

	    var centerEl = el('<div>', { style: CSS_WIDTH$2 }).appendTo(overlay.centerEl);

	    // tab with email input

	    var emailTabEl = el('<div>').appendTo(centerEl);

	    el('<h1>',{ text: 'Reset Password' }).appendTo(emailTabEl);

	    el('<p>', { text:'email:', class:'hint' }).appendTo(emailTabEl);
	    var emailEl = el('<input>',{ type: 'text' }).appendTo(emailTabEl);
	    if (email) emailEl.val(email);
	    emailEl.focus();
	    function onEmailElKeyDown (e) {
	      if (e.which === 13) passwordEl.focus();
	    }
	    emailEl.addEventListener('keydown', onEmailElKeyDown);
	    emailEl.addEventListener('input', updateGoButton);

	    var goButtonEl = el('<div>',{
	      text: 'go',
	      class: 'button',
	      click: onConfirm
	    }).appendTo(emailTabEl);

	    // tab with loading screen

	    var loadingTabEl = el('<div>', {
	      text: '...'
	    }).appendTo(centerEl).hide();

	    // tab with action message

	    var requestSentTabEl = el('<div>').hide().appendTo(centerEl);

	    el('<p>',{
	      html: 'Check your email for<br>support@archilogic.com<br>and follow instructions.'
	    }).appendTo(requestSentTabEl);

	    var goButton2El = el('<div>',{
	      text: 'ok',
	      class: 'button',
	      click: function(){
	        destroy(function(){
	          resolve();
	        });
	      }
	    }).appendTo(requestSentTabEl);

	    // stuff at the bottom

	    var bottomEl = el('<div>',{
	      text: 'Resend activation email.',
	      style: CSS_WIDTH$2,
	      class: 'clickable',
	      click: function(){
	        destroy(function(){
	          createSignUpUi(
	            {email: emailEl.val()},
	            {resendActivation: true}
	          ).then(resolve, reject);
	        });
	      }
	    }).appendTo(overlay.bottomEl);

	    var bottomEl = el('<div>',{
	      text: 'Already have an account? Log in.',
	      style: CSS_WIDTH$2,
	      class: 'clickable',
	      click: function(){
	        destroy(function(){
	          createLogInUi({ email: emailEl.val() }).then(resolve, reject);
	        });
	      }
	    }).appendTo(overlay.bottomEl);

	    // register ESC key

	    function onKeyDown(e) {
	      // ESC
	      if (e.keyCode === 27) {
	        destroy(function(){
	          reject('User canceled action.');
	        });
	      }
	    }
	    document.body.addEventListener('keydown', onKeyDown);

	    // methods

	    function updateGoButton () {
	      // highlight button if email has entry
	      emailEl.val() !== ''
	        ? goButtonEl.addClass('button-highlighted')
	        : goButtonEl.removeClass('button-highlighted');
	    }
	    updateGoButton();

	    function onConfirm () {
	      // show loading screen
	      emailTabEl.hide();
	      loadingTabEl.show();
	      requestPasswordReset({ email: emailEl.val() }).then(function(){
	        // show tab saying that email has been sent
	        loadingTabEl.hide();
	        requestSentTabEl.show();
	      }).then();
	    }

	    function destroy (callback) {
	      // unbind events
	      document.body.removeEventListener('keydown', onKeyDown);
	      emailEl.removeEventListener('keydown', onEmailElKeyDown);
	      emailEl.removeEventListener('input', updateGoButton);
	      // remove DOM elements
	      overlay.destroy(callback);
	    }

	  })
	}

	// configs

	var CSS_WIDTH$1 = 'width:300px;';

	// main

	function createLogInUi (args) {
	  runtime.assertBrowser();
	  return new bluebird_1(function (resolve, reject) {

	    // params

	    args = args || {};
	    var credentials = {
	      email: args.email,
	      password: args.password
	    };

	    // DOM

	    var overlay = createOverlay().show();

	    // close button
	    el('<div>', {
	      text: 'x',
	      class: 'button close-button',
	      click: function cancel () {
	        destroy(function () {
	          reject('User canceled action.');
	        });
	      }
	    }).appendTo(overlay.mainEl);

	    // stuff at the bottom

	    el('<div>', {
	      text: 'New? Sign up now.',
	      style: CSS_WIDTH$1,
	      class: 'clickable',
	      click: function () {
	        destroy(function () {
	          createSignUpUi({email: emailEl.val()}).then(resolve, reject);
	        });
	      }
	    }).appendTo(overlay.bottomEl);

	    el('<div>', {
	      text: 'Lost Password? Get a new one.',
	      style: CSS_WIDTH$1,
	      class: 'clickable',
	      click: function () {
	        destroy(function () {
	          createResetPasswordUi({email: emailEl.val()}).then(resolve, reject);
	        });
	      }
	    }).appendTo(overlay.bottomEl);

	    // centered content

	    var centerEl = el('<div>', {style: CSS_WIDTH$1}).appendTo(overlay.centerEl);

	    el('<h1>', {
	      text: 'Log In'
	    }).appendTo(centerEl);

	    // email field

	    el('<p>', {text: 'email:', class: 'hint'}).appendTo(centerEl);
	    var emailEl = el('<input>', {type: 'text'}).appendTo(centerEl);
	    if (credentials.email) emailEl.val(credentials.email);
	    function onEmailElKeyDown (e) {
	      if (e.which === 13) passwordEl.focus();
	    }
	    emailEl.addEventListener('keydown', onEmailElKeyDown);
	    emailEl.addEventListener('input', updateGoButton);

	    // password field

	    el('<p>', {text: 'password:', class: 'hint'}).appendTo(centerEl);
	    var passwordEl = el('<input>', {type: 'password'}).appendTo(centerEl);
	    if (credentials.password) passwordEl.val(credentials.password);
	    function onPasswordElKeyDown (e) {
	      if (e.which === 13) confirm();
	    }
	    passwordEl.addEventListener('keydown', onPasswordElKeyDown);
	    passwordEl.addEventListener('input', updateGoButton);

	    // focus input field

	    if (!credentials.email) {
	      emailEl.focus();
	    } else if (!credentials.password) {
	      passwordEl.focus();
	    }

	    var goButtonEl = el('<div>', {
	      text: 'go',
	      class: 'button',
	      click: confirm
	    }).appendTo(centerEl);

	    // register ESC key

	    function onKeyDown (e) {
	      // ESC
	      if (e.keyCode === 27) {
	        destroy(function () {
	          reject('User canceled action.');
	        });
	      }
	    }
	    document.body.addEventListener('keydown', onKeyDown);

	    // methods

	    function updateGoButton () {
	      // highlight button if email and password have entries
	      emailEl.val() !== '' && passwordEl.val() !== ''
	        ? goButtonEl.addClass('button-highlighted')
	        : goButtonEl.removeClass('button-highlighted');
	    }

	    updateGoButton();

	    function confirm () {
	      // TODO: show loading or provide other visual feedback
	      logIn({
	        email: emailEl.val(),
	        password: passwordEl.val()
	      }).then(function onLogInSuccess () {
	        // log in successful
	        destroy(resolve);
	      }, function onLogInReject (error) {
	        // show message
	        message.error(error);
	        // offer to resend activation email
	        if (error.indexOf('check your email and activate your account first') > -1) {
	          destroy(function () {
	            createSignUpUi(
	              {email: emailEl.val()},
	              {resendActivation: true}
	            ).then(resolve, reject);
	          });
	        }
	      });

	    }

	    function destroy (callback) {
	      // unbind events
	      document.body.removeEventListener('keydown', onKeyDown);
	      emailEl.removeEventListener('keydown', onEmailElKeyDown);
	      emailEl.removeEventListener('input', updateGoButton);
	      passwordEl.removeEventListener('keydown', onPasswordElKeyDown);
	      passwordEl.removeEventListener('input', updateGoButton);
	      // remove DOM elements
	      overlay.destroy(callback);
	    }

	  })
	}

	// config

	var CSS_WIDTH = 'width:300px;';

	// main

	function createSignUpUi (credentials, options) {
	  runtime.assertBrowser();
	  return new bluebird_1(function (resolve, reject){

	    credentials = credentials || {};
	    options = options || {};
	    var email = credentials.email;
	    var resendActivation = !!options.resendActivation;
	    var waitForActivation = options.waitForActivation !== undefined ? options.waitForActivation : true;

	    // DOM

	    var overlay = createOverlay().show();

	    el('<div>',{
	      text: 'x',
	      class: 'button close-button',
	      click: function onCancel () {
	        destroy(function(){
	          reject('User canceled action.');
	        });
	      }
	    }).appendTo(overlay.mainEl);

	    // stuff at the bottom

	    var bottomEl = el('<div>',{
	      text: 'Already have an account? Log in.',
	      style: CSS_WIDTH,
	      class: 'clickable',
	      click: function(){
	        destroy(function(){
	          createLogInUi({ email: emailEl.val() }).then(resolve, reject);
	        });
	      }
	    }).appendTo(overlay.bottomEl);

	    var bottomEl = el('<div>',{
	      text: 'Lost Password? Get a new one.',
	      style: CSS_WIDTH,
	      class: 'clickable',
	      click: function(){
	        destroy(function(){
	          createResetPasswordUi({ email: emailEl.val() }).then(resolve, reject);
	        });
	      }
	    }).appendTo(overlay.bottomEl);

	    // centered content

	    var centerEl = el('<div>', { style: CSS_WIDTH }).appendTo(overlay.centerEl);

	    // tab with email input

	    var emailTabEl = el('<div>').appendTo(centerEl);

	    el('<h1>',{
	      text: resendActivation ? 'Resend Activation Email' : 'Sign Up'
	    }).appendTo(emailTabEl);

	    el('<p>', { text:'email:', class:'hint' }).appendTo(emailTabEl);
	    var emailEl = el('<input>',{ type: 'text' }).appendTo(emailTabEl);
	    if (email) emailEl.val(email);
	    emailEl.focus();
	    function onEmailElKeyDown (e) {
	      if (e.which === 13) onConfirm();
	    }
	    emailEl.addEventListener('keydown', onEmailElKeyDown);
	    emailEl.addEventListener('input', updateGoButton);

	    var goButtonEl = el('<div>',{
	      text: 'go',
	      class: 'button',
	      click: onConfirm
	    }).appendTo(emailTabEl);

	    // register ESC key

	    function onKeyDown (e) {
	      // ESC
	      if (e.keyCode === 27) {
	        destroy(function () {
	          reject('User canceled action.');
	        });
	      }
	    }
	    document.body.addEventListener('keydown', onKeyDown);

	    // tab with loading screen

	    var loadingTabEl = el('<div>', { text: '...' }).appendTo(centerEl).hide();

	    // tab with activation message

	    var activationTabEl = el('<div>').hide().appendTo(centerEl);

	    el('<p>',{
	      html: 'Check your email for<br>support@archilogic.com<br>and set your password.<br><br>Then simply return here ;)'
	    }).appendTo(activationTabEl);

	    // methods

	    function updateGoButton () {
	      // highlight button if email has entry
	      emailEl.val() !== ''
	        ? goButtonEl.addClass('button-highlighted')
	        : goButtonEl.removeClass('button-highlighted');
	    }
	    updateGoButton();

	    function onConfirm () {

	      if (!validateEmail(emailEl.val())) {
	        message.error('Please provide a valid email.');
	        return
	      }

	      // show loading screen
	      emailTabEl.hide();
	      loadingTabEl.show();

	      logOut()
	        .then(function(){
	          if (resendActivation) {
	            // resend activation email
	            return resendActivationEmail({ email: emailEl.val() })
	          } else {
	            // sign up
	            return signUp({ email: emailEl.val() })
	          }
	        })
	        .then(function(){
	          // wait for activation
	          if (waitForActivation) return pollForActivation()
	          // or show error if signup rejected
	        }, function(error){
	          message.error(error);
	          // catch specific errors
	          if (error.indexOf('User with this email already exists') > -1) {
	            // switch to log in tab
	            destroy(function(){
	              createLogInUi({ email: emailEl.val() }).then(resolve, reject);
	            });
	          } else {
	            loadingTabEl.hide();
	            emailTabEl.show();
	            return bluebird_1.reject(error)
	          }
	        })
	        .then(function(){
	          // all done
	          destroy(resolve);
	        });
	    }

	    function pollForActivation () {
	      emailTabEl.hide();
	      loadingTabEl.hide();
	      activationTabEl.show();

	      return poll(function(resolve, reject, next){
	        getSession().then(function(session){
	          session.isAuthenticated ? resolve(session) : next();
	        });
	      })
	    }

	    function destroy (callback) {
	      // unbind events
	      document.body.removeEventListener('keydown', onKeyDown);
	      emailEl.removeEventListener('keydown', onEmailElKeyDown);
	      emailEl.removeEventListener('input', updateGoButton);
	      // remove DOM elements
	      overlay.destroy(callback);
	    }

	  })
	}

	// helpers

	function validateEmail(email) {
	  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  return re.test(email)
	}

	// main

	function createConfirmUi (a, b) {
	  runtime.assertBrowser();
	  return new Promise(function (resolve, reject){

	    var options;
	    if (el.isElement(a) || typeof a === 'string') {
	      options = b || {};
	      options.message = a;
	    } else if (typeof a === 'object') {
	      options = a;
	    } else {
	      throw 'Argument mismatch https://3d.io/docs/api/1/ui.html'
	    }

	    var title = options.title;
	    var message = options.message;
	    var bottom = options.bottom;
	    var fixWidth = options.width && typeof options.width === 'number' ? options.width+'px' : options.width;
	    var maxWidth = options.maxWidth && typeof options.maxWidth === 'number' ? options.maxWidth+'px' : options.maxWidth || '450px';
	    var hasCloseButton = defaultTo(options.closeButton, true);
	    var hasConfirmButton = defaultTo(options.confirmButton, true);
	    var hasCancelButton = defaultTo(options.cancelButton, true);

	    // internals
	    var widthCss = fixWidth ? 'width:'+fixWidth+';' : 'max-width:'+maxWidth+';';

	    // overlay
	    var overlay = createOverlay().show();

	    // DOM

	    if (hasCloseButton) el('<div>',{
	      text: 'x',
	      class: 'button close-button',
	      click: cancel
	    }).appendTo(overlay.mainEl);

	    // centered content

	    var centerEl = el('<div>', { style: widthCss }).appendTo(overlay.centerEl);

	    if (title) el('<h1>').append(title).appendTo(centerEl);
	    if (message) el('<div>').append(message).appendTo(centerEl);

	    if (hasCancelButton) el('<div>', {
	      text: 'x',
	      class: 'button',
	      click: cancel
	    }).appendTo(centerEl);

	    if (hasConfirmButton) el('<div>', {
	      text: 'ok',
	      class: 'button',
	      click: confirm
	    }).appendTo(centerEl);

	    // stuff at the bottom

	    if (bottom) el('<div>', { style: widthCss }).append(bottom).appendTo(overlay.bottomEl);

	    // register ESC key

	    function onKeyDown(e) {
	      if (e.keyCode === 27) cancel(); // ESC
	    }
	    document.body.addEventListener('keydown', onKeyDown);

	    // methods

	    function confirm () {
	      destroy(function(){
	        resolve(true);
	      });
	    }

	    function cancel () {
	      destroy(function(){
	        resolve(false);
	      });
	    }

	    function destroy (callback) {
	      // unbind events
	      document.body.removeEventListener('keydown', onKeyDown);
	      // remove DOM elements
	      overlay.destroy(callback);
	    }

	  })
	}

	// helper

	function defaultTo (x, val) {
	  return x !== undefined ? x : val
	}

	// main

	function createAlertUi (a, b) {
	  runtime.assertBrowser();

	  if (el.isElement(a) || typeof a === 'string') {
	    b = b || {};
	    b.closeButton = false;
	    b.cancelButton = false;
	    b.confirmButton = true;
	  } else if (typeof a === 'object') {
	    a.closeButton = false;
	    a.cancelButton = false;
	    a.confirmButton = true;
	  } else {
	    throw 'Argument mismatch https://3d.io/docs/api/1/ui.html'
	  }
	  
	  return createConfirmUi(a, b)
	}

	function createLogOutUi () {
	  return logOut().then(function onSuccess(){
	    return createAlertUi('Log out successful')
	  }, function onReject(e) {
	    return createAlertUi('Log out error:<br><br>'+e)
	  })
	}

	// main

	function createPromptUi (a, b) {
	  runtime.assertBrowser();

	  var options;
	  if (el.isElement(a) || typeof a === 'string') {
	    options = b || {};
	    options.message = a;
	  } else if (typeof a === 'object') {
	    options = a;
	  } else {
	    throw 'Argument mismatch https://3d.io/docs/api/1/ui.html'
	  }

	  var value = options.value || '';
	  var inputMessage = options.message;
	  var multiLine = options.multiLine;
	  var multiLineHeight = options.multiLineHeight && typeof options.multiLineHeight === 'number' ? options.multiLineHeight+'px' : options.multiLineHeight;
	  options.width = options.width ? options.width : '500px';

	  // override message with new one
	  options.message = el('<div>');
	  // append input message
	  if (inputMessage) options.message.append(inputMessage);
	  // create input box for prompt
	  if (multiLine) {
	    var style = inputMessage && !el.isElement(inputMessage) ? 'margin: 1em 0 0 0;' : 'margin: 0 0 0 0;';
	    style += 'min-height: '+(multiLineHeight ? multiLineHeight : '150px')+';';
	    var inputEl = el('<textarea>', {
	      style: style,
	      autocomplete: 'off',
	      autocorrect: 'off',
	      autocapitalize: 'off',
	      spellcheck: false
	    }).appendTo(options.message);
	    inputEl.innerHTML = value;
	  } else {
	    var style = inputMessage && !el.isElement(inputMessage) ? 'margin: 1em 0 0.5em 0;' : 'margin: 0 0 0.5em 0;';
	    var inputEl = el('<input>', {
	      value: value,
	      style: style,
	      autocomplete: 'off',
	      autocorrect: 'off',
	      autocapitalize: 'off',
	      spellcheck: false
	    }).appendTo(options.message);
	  }
	  // focus input element
	  setTimeout(function () {
	    inputEl.focus();
	  }, 100);

	  return createConfirmUi(options).then(function onConfirm (isConfirmed) {
	    // behaves like window.confirm() => return value on confirm or null on cancel
	    return isConfirmed ? inputEl.val() : null
	  })

	}

	// configs

	var CSS_WIDTH$4 = 'width:620px;';

	// main

	function createPublishableApiKeysUi (a, b) {
	  runtime.assertBrowser();

	  return getSession().then(function (session) {
	    if (!session.isAuthenticated) {
	      // show sign up screen
	      message('Please sign up or log in to<br>access your publishable API keys.');
	      return createSignUpUi().then(function () {
	        return createPublishableApiKeysUi()
	      })
	    }

	    return new Promise(function (resolve, reject) {

	      // overlay
	      var overlay = createOverlay().show();

	      // close button

	      el('<div>', {
	        text: 'x',
	        class: 'button close-button',
	        click: cancel
	      }).appendTo(overlay.mainEl);

	      // centered

	      var centerEl = el('<div>', {
	        class: 'publishable-api-keys',
	        style:CSS_WIDTH$4
	      }).appendTo(overlay.centerEl);

	      el('<h1>', {html: 'Publishable API Keys'}).appendTo(centerEl);

	      var listEl = el('<div>', {class: 'list'}).appendTo(centerEl);
	      listPublishableApiKeys().then(function onSuccess (list) {
	        // create html elements for every key
	        list.forEach(function (item) {

	          var containerEl = el('<div>', {
	            class: 'key-item'
	          }).appendTo(listEl);

	          var keyEl = el('<input>', {
	            class: 'key',
	            type: 'text',
	            value: item.key
	          }).appendTo(containerEl);
	          keyEl.addEventListener('click', keyEl.select);

	          el('<div>', {
	            class: 'hint domains',
	            html: 'Domains: ' + item.allowedDomains.join(' ')
	          }).appendTo(containerEl);

	          el('<div>', {
	            class: 'button delete-key-button',
	            html: 'x',
	            click: function () {
	              destroy(function(){
	                createConfirmUi({
	                  width: 500,
	                  title: 'Delete Publishable API Key ?',
	                  message: 'This action can not be undone.<br><br>Key:<br><b>'+item.key+'</b><br><br>Allowed domains:<br><b>'+item.allowedDomains.join(' ')+'</b>'
	                }).then(function(isConfirmed){
	                  if (isConfirmed) {
	                    return revokePublishableApiKey({ key: item.key }).then(function(){
	                      message.success('Deleted publishable API key<br>'+item.key);
	                    })
	                  }
	                }).then(function(){
	                  // return to publishable api key ui
	                  createPublishableApiKeysUi().then(resolve, reject);
	                }).catch(function(error){
	                  message.error('Error deleting publishable API key<br>'+error);
	                  // return to publishable api key ui
	                  createPublishableApiKeysUi().then(resolve, reject);
	                });
	              });
	            }
	          }).appendTo(containerEl);

	          el('<div>', {
	            class: 'button edit-domains-button',
	            html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><style type="text/css">.st0{fill:none;stroke:#fff;stroke-miterlimit:10;}</style><line class="st0" x1="14" y1="25.8" x2="28.6" y2="11.2"/><polygon class="st0" points="8.4,31.6 10.1,24.1 25.8,8.4 31.5,14.1 15.8,29.8"/></svg>',
	            click: function () {
	              destroy(function () {
	                // ask user for allowed domains
	                createPromptUi({
	                  title: 'Allowed Domains',
	                  message: 'Publishable API key:<br><b>'+item.key+'</b><br><br>Please specify allowed domains separated by empty space.<br>Example: "localhost *.3d.io mypage.com"',
	                  bottom: el('<a>', {
	                    html: 'Read more about allowed domains',
	                    href: 'https://3d.io/docs/api/1/authentication.html',
	                    target: '_blank'
	                  }),
	                  value: item.allowedDomains.join(' ')
	                }).then(function (result) {
	                  // update key if user has confirmed
	                  if (result || result === '') {
	                    return updatePublishableApiKeyDomains({
	                      key: item.key,
	                      allowedDomains: result.split(' ')
	                    }).then(function(){
	                      message.success('Updated allowed domains to:<br>'+result);
	                    })
	                  }
	                }).then(function () {
	                  // return to publishable api key ui
	                  createPublishableApiKeysUi().then(resolve, reject);
	                }).catch(function(error){
	                  message.error('Error updating publishable API key:<br>'+error);
	                  // return to publishable api key ui
	                  createPublishableApiKeysUi().then(resolve, reject);
	                });
	              });
	            }
	          }).appendTo(containerEl);

	        });
	      });

	      el('<div>', {
	        class: 'generate-new-key-button',
	        html: 'Generate new key',
	        click: function () {
	          destroy(function () {
	            // ask user for allowed domains
	            createPromptUi({
	              width: 550,
	              title: 'Generate Publishable Api Key',
	              message: 'Please specify allowed domains separated by empty space.<br>Example: "localhost *.3d.io mypage.com"',
	              bottom: el('<a>', {
	                html: 'Read more about allowed domains',
	                href: 'https://3d.io/docs/api/1/authentication.html',
	                target: '_blank'
	              })
	            }).then(function (result) {
	              // generate key if user has confirmed
	              if (result || result === '') {
	                return generatePublishableApiKey({allowedDomains: result.split(' ')}).then(function(key){
	                  message.success('Generated new publishable API key<br>'+key);
	                })
	              }
	            }).then(function () {
	              // return to publishable api key ui
	              createPublishableApiKeysUi().then(resolve, reject);
	            }).catch(function(error){
	              message.error('Error generating publishable API key:<br>'+error);
	              // return to publishable api key ui
	              createPublishableApiKeysUi().then(resolve, reject);
	            });
	          });
	        }
	      }).appendTo(centerEl);

	      // stuff at the bottom

	      el('<a>', {
	        class: 'clickable',
	        style: 'display:block;'+CSS_WIDTH$4,
	        html: 'Read documentaion about publishable API keys.',
	        href: 'https://3d.io/docs/api/1/authentication.html',
	        target: '_blank'
	      }).appendTo(overlay.bottomEl);

	      // methods

	      function cancel () {
	        destroy(function () {
	          resolve(false);
	        });
	      }

	      function destroy (callback) {
	        // remove DOM elements
	        overlay.destroy(callback);
	      }

	    })

	  })
	}

	// config

	var CSS_WIDTH$5 = 'width:510px;';

	// main

	function createSecretApiKeyUi () {
	  runtime.assertBrowser();

	  return getSession().then(function (session) {
	    if (!session.isAuthenticated) {
	      // show sign up screen
	      message('Please sign up or log in to<br>access your secret API key.');
	      return createSignUpUi().then(function () {
	        return createSecretApiKeyUi()
	      })
	    }

	    // create dashboard promise
	    return new bluebird_1(function (resolve, reject) {

	      // DOM

	      // overlay
	      var overlay = createOverlay().show();

	      // close button
	      el('<div>', {
	        text: 'x',
	        class: 'button close-button',
	        click: function () {
	          destroy(function () {
	            resolve();
	          });
	        }
	      }).appendTo(overlay.mainEl);

	      // stuff at the bottom

	      el('<a>', {
	        class: 'clickable',
	        style: 'display:block;'+CSS_WIDTH$5,
	        html: 'Read documentation about secret API key.',
	        href: 'https://3d.io/docs/api/1/authentication.html',
	        target: '_blank'
	      }).appendTo(overlay.bottomEl);

	      // centered

	      var centerEl = el('<div>', {style: CSS_WIDTH$5}).appendTo(overlay.centerEl);

	      el('<h1>', {text: 'Secret API Key'}).appendTo(centerEl);

	      // main tab

	      var mainTabEl = el('<div>').appendTo(centerEl);

	      var secretApiKeyElTitle = el('<p>', {
	        html: 'Please use this key only in secure environments and expose it only to trusted 3rd parties.'
	      }).appendTo(mainTabEl);

	      var secretApiKeyContainerEl = el('<p>',{
	        style: 'position:relative;'
	      }).appendTo(mainTabEl);

	      var secretApiKeyEl = el('<input>', {type: 'text'}).appendTo(secretApiKeyContainerEl);
	      var revealButtonEl = el('<div>', {
	        text: 'reveal',
	        class: 'reveal-api-key-button',
	        click: function () {
	          revealButtonEl.hide();
	          getSecretApiKey().then(function (key) {
	            secretApiKeyEl.val(key);
	          });
	        }
	      }).appendTo(secretApiKeyContainerEl);
	      secretApiKeyEl.addEventListener('click', secretApiKeyEl.select);

	      el('<p>', {
	        class: 'regegenerate-secret-key-button',
	        html: 'Regenerate key',
	        click: function () {
	          destroy(function () {
	            // ask user for allowed domains
	            createConfirmUi({
	              title: 'Regenrate Key',
	              message: 'Are you sure you want to regenrate your secret key ?<br><br>This action can not be undone.'
	            }).then(function (isConfirmed) {
	              // regenerate key if user has confirmed
	              if (isConfirmed) {
	                return regenerateSecretApiKey().then(function(key){
	                  message.success('Regenerated secret API key');
	                })
	              }
	            }).then(function () {
	              // return to secret api key ui
	              createSecretApiKeyUi().then(resolve, reject);
	            }).catch(function(error){
	              message.error('Error regenerating secret API key:<br>'+error);
	              // return to secret api key ui
	              createSecretApiKeyUi().then(resolve, reject);
	            });
	          });
	        }
	      }).appendTo(mainTabEl);

	      // register ESC key

	      function onKeyDown (e) {
	        // ESC
	        if (e.keyCode === 27) destroy(resolve);
	      }
	      document.body.addEventListener('keydown', onKeyDown);

	      // methods

	      function destroy (callback) {
	        // unbind events
	        document.body.removeEventListener('keydown', onKeyDown);
	        // remove DOM elements
	        overlay.destroy(callback);
	      }

	    })
	  })
	}

	// config

	var CSS_WIDTH$3 = 'width:440px;';

	// main

	function createDevDashboardUi () {
	  runtime.assertBrowser();

	  return getSession().then(function (session) {
	    if (!session.isAuthenticated) {
	      // show sign up screen
	      message('Please sign up or log in to<br>access your dev dashboard.');
	      return createSignUpUi().then(function () {
	        return createDevDashboardUi()
	      })
	    }

	    // create dashboard promise
	    return new bluebird_1(function (resolve, reject) {

	      // DOM

	      // overlay
	      var overlay = createOverlay().show();

	      // close button
	      el('<div>', {
	        text: 'x',
	        class: 'button close-button',
	        click: function () {
	          destroy(function () {
	            resolve();
	          });
	        }
	      }).appendTo(overlay.mainEl);

	      // stuff at the bottom

	      var bottomEl = el('<div>', {
	        style: 'white-space: nowrap;',
	      }).appendTo(overlay.bottomEl);

	      el('<a>', {
	        text: 'Get started using 3d.io',
	        style: 'display: inline-block;', //+CSS_WIDTH,
	        class: 'clickable',
	        href: 'https://3d.io/docs/api/1/get-started.html',
	        target: '_blank'
	      }).appendTo(bottomEl);

	      el('<span>', {html: ' | '}).appendTo(bottomEl);

	      el('<a>', {
	        text: 'Read more about keys',
	        style: 'display: inline-block;', //+CSS_WIDTH,
	        class: 'clickable',
	        href: 'https://3d.io/docs/api/1/authentication.html',
	        target: '_blank'
	      }).appendTo(bottomEl);

	      el('<span>', {html: ' | '}).appendTo(bottomEl);

	      el('<div>', {
	        text: 'Change password',
	        style: 'display: inline-block;', //+CSS_WIDTH,
	        class: 'clickable',
	        click: function () {
	          destroy(function () {
	            createResetPasswordUi({email: emailEl.val()}).then(function(){
	              // return dev dashboard
	              return createDevDashboardUi()
	            }, function(){
	              // return dev dashboard
	              return createDevDashboardUi()
	            }).then(resolve, reject);
	        });
	        }
	      }).appendTo(bottomEl);

	      // centered

	      var centerEl = el('<div>', {
	        style: CSS_WIDTH$3,
	        class: 'dev-dashobard'
	      }).appendTo(overlay.centerEl);

	      el('<h1>', {text: 'Dev Dashboard'}).appendTo(centerEl);

	      // main tab

	      var mainTabEl = el('<div>').appendTo(centerEl);

	      el('<p>', {text: 'Email:', class: 'hint'}).appendTo(mainTabEl);
	      var emailEl = el('<input>', {type: 'text'}).appendTo(mainTabEl);
	      emailEl.val(session.user.email);

	      var keyMenuEl = el('<div>', {
	        class:'key-menu'
	      }).appendTo(mainTabEl);

	      el('<div>', {
	        class:'key-image',
	        html:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 127"><defs><style>.a{opacity:0.7;stroke-dasharray: 1, 4;}.b{fill:#fff;}.c{fill:none;stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:1px;}.d{opacity:1;}</style></defs><g class="a"><circle class="c" cx="64" cy="64" r="62"/><line class="c" x1="150" y1="30" x2="130" y2="30"/><line class="c" x1="119" y1="36" x2="130" y2="30"/></g><g class="d"><circle class="c" cx="64" cy="64" r="36"/><line class="c" x1="150" y1="98" x2="130" y2="98"/><line class="c" x1="130" y1="98" x2="96.192" y2="82.337"/></g><polygon class="b" points="69.375 60.227 59.813 60.227 59.813 83.867 64.594 86.523 69.375 83.867 67.478 81.581 69.375 79.684 67.478 77.319 69.375 75.422 67.478 73.057 69.375 71.159 67.478 68.794 69.375 66.897 67.478 64.532 69.375 62.635 69.375 60.227"/><path class="b" d="M64.7,39.361A10.894,10.894,0,1,0,75.589,50.255,10.894,10.894,0,0,0,64.7,39.361Zm0,9.056a2.812,2.812,0,1,1,2.812-2.812A2.812,2.812,0,0,1,64.7,48.417Z"/></svg>'
	      }).appendTo(keyMenuEl);

	      el('<div>', {
	        class:'key-button go-to-publishable-api-key-ui',
	        html: 'Get Publishable API Keys',
	        click: function(){
	          destroy(function(){
	            createPublishableApiKeysUi().then(function(){
	              // return dev dashboard
	              return createDevDashboardUi()
	            }).then(resolve, reject);
	          });
	        }
	      }).appendTo(keyMenuEl);

	      el('<div>', {
	        class:'key-button go-to-secret-api-key-ui',
	        html: 'Get Secret API Key',
	        click: function(){
	          destroy(function(){
	            createSecretApiKeyUi().then(function(){
	              // return dev dashboard
	              return createDevDashboardUi()
	            }).then(resolve, reject);
	          });
	        }
	      }).appendTo(keyMenuEl);

	      // register ESC key

	      function onKeyDown (e) {
	        // ESC
	        if (e.keyCode === 27) destroy(resolve);
	      }
	      document.body.addEventListener('keydown', onKeyDown);

	      // methods

	      function destroy (callback) {
	        // unbind events
	        document.body.removeEventListener('keydown', onKeyDown);
	        // remove DOM elements
	        overlay.destroy(callback);
	      }

	    })
	  })
	}

	// add css to page
	if (runtime.isBrowser) {
	  var style = document.createElement('style');
	  style.setAttribute('media', 'screen');
	  //style.innerHTML = css
	  style.appendChild(document.createTextNode(css));
	  document.head.appendChild(style);
	}

	// export

	var ui = {
	  fileDrop: createFileDropUi,
	  // authentication
	  signUp: createSignUpUi,
	  signup: createSignUpUi, // alias
	  logIn: createLogInUi,
	  login: createLogInUi, // alias
	  logOut: createLogOutUi,
	  logout: createLogOutUi, // alias
	  requestPasswordReset: createResetPasswordUi,
	  devDashboard: createDevDashboardUi,
	  publishableApiKeys: createPublishableApiKeysUi,
	  secretApiKey: createSecretApiKeyUi,
	  // messages
	  message: message,
	  alert: createAlertUi,
	  confirm: createConfirmUi,
	  prompt: createPromptUi
	};

	// function

	function wait(duration, passThroughValue) {
	  return new bluebird_1(function (resolve, reject) {
	    setTimeout(function(){
	      resolve(passThroughValue);
	    }, duration);
	  })
	}

	var utils = {

	  data3d: {
	    load: loadData3d,
	    decodeBuffer: decodeBuffer
	  },
	  ui: ui,
	  auth: auth,
	  io: {
	    fetch: fetch$1,
	    request: request
	  },
	  services: {
	    call: callService
	  },
	  getMimeTypeFromFilename: getMimeTypeFromFileName,
	  url: Url,
	  uuid: uuid,
	  getShortId: getShortId,
	  path: path,
	  wait: wait

	};

	var io3d$1 = {

	  // APIs
	  aFrame: aFrame,
	  furniture: furniture,
	  storage: storage,
	  scene: scene,

	  // utils
	  auth: utils.auth,
	  ui: utils.ui,
	  utils: utils,

	  // core
	  runtime: runtime,
	  configs: configs,
	  config: configs  // alias

	};

	// create upper case alias fro main lib object in browser environment
	if (runtime.isBrowser) window.IO3D = io3d$1;

	return io3d$1;

})));
//# sourceMappingURL=3dio.js.map
