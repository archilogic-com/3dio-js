/**
 * @preserve
 * @name 3dio
 * @version 1.0.0-beta.71
 * @date 2017/09/14 01:33
 * @branch master
 * @commit 5d5a1e326ece42f28cf2d435e7b49a13643f4f6e
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

	var BUILD_DATE='2017/09/14 01:33', GIT_BRANCH = 'master', GIT_COMMIT = '5d5a1e326ece42f28cf2d435e7b49a13643f4f6e'

	var name = "3dio";
	var version = "1.0.0-beta.71";
	var description = "toolkit for interior apps";
	var keywords = ["3d","aframe","cardboard","components","oculus","vive","rift","vr","WebVR","WegGL","three","three.js","3D model","api","visualization","furniture","real estate","interior","building","architecture","3d.io"];
	var homepage = "https://3d.io";
	var repository = "archilogic-com/3dio-js";
	var license = "MIT";
	var author = {"name":"archilogic","email":"dev.rocks@archilogic.com","url":"https://archilogic.com"};
	var main = "index.js";
	var scripts = {"start":"gulp dev-browser","dev-browser":"gulp dev-browser","dev-node":"gulp dev-node","test":"gulp test","build":"gulp build","release":"gulp release"};
	var dependencies = {"bluebird":"^3.5.0","form-data":"^2.1.4","js-logger":"^1.3.0","lodash":"^4.17.4","node-fetch":"2.0.0-alpha.8","pako":"^1.0.5","rxjs":"^5.4.2","three":"^0.85.2","whatwg-fetch":"^2.0.3"};
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

	function assertBrowser(message) {
	  if (!isBrowser) throw (message || 'Sorry this feature requires a browser environment.')
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

	  // prevent secret API key to be included in browser environments
	  if (runtime.isBrowser && args.secretApiKey) {
	    logger.error('The secret API key is not supposed to be used in browser environments!\nPlease see https://3d.io/docs/api/1/get-started-browser.html#secret-api-key for more information.');
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

	function fetchDdsTexture (url) {
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

	function fetchImageTexture (url) {
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

	// configs

	var maxConcurrentQueuedRequests = 15; // not queued requests are not limited in running parallel
	var queuesByPriority = [
	  'architectureGeometries',
	  'architectureTexturesLoRes',
	  'interiorGeometries',
	  'interiorTexturesLoRes',
	  'architectureTexturesHiRes',
	  'interiorTexturesHiRes'
	];

	var queueFences = [
	  false,
	  false,
	  true,
	  false,
	  false
	];

	// prepare objects for queueing
	var _queues = {};
	var _queueFences = {};
	var _queuesChanged = false;
	window.queueInfo = {};
	var _queuesLength = queuesByPriority.length;
	var _concurrentRequests = 0;
	var _concurrentPerQueue = {};
	window.loadingQueueData = '';

	var queueName;
	for (var i$1 = 0, l = _queuesLength; i$1 < l; i$1++) {
	  queueName = queuesByPriority[i$1];
	  _queues[queueName] = [];
	  _queueFences[queueName] = queueFences[i$1];
	  window.queueInfo[queueName] = {requestCount: 0};
	  _concurrentPerQueue[queueName] = 0;
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
	      _startRequest(queueName);
	    if (_concurrentPerQueue[queueName] !== 0)
	      break;
	  }
	}

	function _doProcessQueueOverstep(){
	  for (var i = 0; i < _queuesLength; i++) {
	    var queueName = queuesByPriority[i];
	    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
	      _startRequest(queueName);
	  }
	}

	function _doProcessQueueOverstepOne(){
	  var anchorStage = null;
	  for (var i = 0; i < _queuesLength; i++) {
	    var queueName = queuesByPriority[i];
	    while (_queues[queueName].length > 0 && _concurrentRequests < window.loadingQueuePipelineDepth)
	      _startRequest(queueName);
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
	      _startRequest(queueName);
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
	      _startRequest(queueName);
	    if (anchorStage === null && _concurrentPerQueue[queueName] !== 0)
	      anchorStage = i;
	    if (anchorStage !== null && (_queueFences[queueName] || (i - anchorStage > 0)))
	      break;
	  }
	}

	function _processQueue() {
	  if (window.loadingQueueAlgorithm === 'original')
	    _doProcessQueueOriginal();
	  else if (window.loadingQueueAlgorithm === 'original-fixed')
	    _doProcessQueueOriginalFixed();
	  else if (window.loadingQueueAlgorithm === 'overstep')
	    _doProcessQueueOverstep();
	  else if (window.loadingQueueAlgorithm === 'overstep-one')
	    _doProcessQueueOverstepOne();
	  else if (window.loadingQueueAlgorithm === 'overstep-fenced')
	    _doProcessQueueOverstepFenced();
	  else if (window.loadingQueueAlgorithm === 'overstep-one-fenced')
	    _doProcessQueueOverstepOneFenced();
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
	    if (queueName) console.error('onknown queue ', queueName);
	    queueName = queuesByPriority[0];
	  }

	  // create promise and add to queue
	  return new Promise(function(resolve, reject){
	    // has to be asynchronous in order to decouple queue processing from synchronous code
	    setTimeout(function(){
	      var queue = _queues[queueName];
	      queue[ queue.length ] = { url: url, start: resolve };
	      _processQueue();
	    },1);
	  })

	}

	function _dequeue(queueName, url) {
	  var queueInfo = window.queueInfo[queueName];
	  if (!queueInfo) {
	    if (queueName) console.warn('Queue info not found for queue name "'+queueName+'"');
	    return
	  }
	  var time = performance.now() / 1000;
	  queueInfo.timeLastFinished = time;
	  var t1 = queueInfo.timeFirst;
	  var t2 = queueInfo.timeLast;
	  var t3 = queueInfo.timeLastFinished;
	  var d  = t3 - t1;
	  _concurrentPerQueue[queueName] -= 1;
	  _concurrentRequests -= 1;
	  _queuesChanged = true;
	  _processQueue();
	}

	// expose API

	var queueManager = {
	  enqueue: _enqueue,
	  dequeue: _dequeue
	};

	window.setInterval(function(){
	  _processQueue();
	},1000);

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	var _arrayPush = arrayPush;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root$2 = _freeGlobal || freeSelf || Function('return this')();

	var _root$1 = root$2;

	/** Built-in value references. */
	var Symbol$1 = _root$1.Symbol;

	var _Symbol = Symbol$1;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto$1.toString;

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$2 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$2.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]';
	var undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
	}

	var _baseIsArguments = baseIsArguments;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
	  return isObjectLike_1(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	var isArguments_1 = isArguments;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray$2 = Array.isArray;

	var isArray_1$2 = isArray$2;

	/** Built-in value references. */
	var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray_1$2(value) || isArguments_1(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	var _isFlattenable = isFlattenable;

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = _isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        _arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	var _baseFlatten = baseFlatten;

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap;

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq_1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return _assocIndexOf(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = _listCacheClear;
	ListCache.prototype['delete'] = _listCacheDelete;
	ListCache.prototype.get = _listCacheGet;
	ListCache.prototype.has = _listCacheHas;
	ListCache.prototype.set = _listCacheSet;

	var _ListCache = ListCache;

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new _ListCache;
	  this.size = 0;
	}

	var _stackClear = stackClear;

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	var _stackDelete = stackDelete;

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	var _stackGet = stackGet;

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	var _stackHas = stackHas;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject$2(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1$3 = isObject$2;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]';
	var funcTag = '[object Function]';
	var genTag = '[object GeneratorFunction]';
	var proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction$1(value) {
	  if (!isObject_1$3(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1$3 = isFunction$1;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root$1['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString$1.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto$3 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1$3(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1$3(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	/* Built-in method references that are verified to be native. */
	var Map$1 = _getNative(_root$1, 'Map');

	var _Map = Map$1;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = _getNative(Object, 'create');

	var _nativeCreate = nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (_nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet;

	/** Used for built-in method references. */
	var objectProto$5 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
	}

	var _hashHas = hashHas;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
	  return this;
	}

	var _hashSet = hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = _hashClear;
	Hash.prototype['delete'] = _hashDelete;
	Hash.prototype.get = _hashGet;
	Hash.prototype.has = _hashHas;
	Hash.prototype.set = _hashSet;

	var _Hash = Hash;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new _Hash,
	    'map': new (_Map || _ListCache),
	    'string': new _Hash
	  };
	}

	var _mapCacheClear = mapCacheClear;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return _isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = _getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return _getMapData(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return _getMapData(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = _getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = _mapCacheClear;
	MapCache.prototype['delete'] = _mapCacheDelete;
	MapCache.prototype.get = _mapCacheGet;
	MapCache.prototype.has = _mapCacheHas;
	MapCache.prototype.set = _mapCacheSet;

	var _MapCache = MapCache;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof _ListCache) {
	    var pairs = data.__data__;
	    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new _MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	var _stackSet = stackSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new _ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = _stackClear;
	Stack.prototype['delete'] = _stackDelete;
	Stack.prototype.get = _stackGet;
	Stack.prototype.has = _stackHas;
	Stack.prototype.set = _stackSet;

	var _Stack = Stack;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED$2);
	  return this;
	}

	var _setCacheAdd = setCacheAdd;

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	var _setCacheHas = setCacheHas;

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new _MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
	SetCache.prototype.has = _setCacheHas;

	var _SetCache = SetCache;

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	var _arraySome = arraySome;

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	var _cacheHas = cacheHas;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$2 = 1;
	var COMPARE_UNORDERED_FLAG$1 = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & COMPARE_UNORDERED_FLAG$1) ? new _SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!_arraySome(other, function(othValue, othIndex) {
	            if (!_cacheHas(seen, othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
	              return seen.push(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	var _equalArrays = equalArrays;

	/** Built-in value references. */
	var Uint8Array$1 = _root$1.Uint8Array;

	var _Uint8Array = Uint8Array$1;

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	var _mapToArray = mapToArray;

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	var _setToArray = setToArray;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$3 = 1;
	var COMPARE_UNORDERED_FLAG$2 = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]';
	var dateTag = '[object Date]';
	var errorTag = '[object Error]';
	var mapTag = '[object Map]';
	var numberTag = '[object Number]';
	var regexpTag = '[object RegExp]';
	var setTag = '[object Set]';
	var stringTag = '[object String]';
	var symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]';
	var dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = _Symbol ? _Symbol.prototype : undefined;
	var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq_1(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = _mapToArray;

	    case setTag:
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3;
	      convert || (convert = _setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= COMPARE_UNORDERED_FLAG$2;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	var _equalByTag = equalByTag;

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray_1$2(object) ? result : _arrayPush(result, symbolsFunc(object));
	}

	var _baseGetAllKeys = baseGetAllKeys;

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	var _arrayFilter = arrayFilter;

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	var stubArray_1 = stubArray;

	/** Used for built-in method references. */
	var objectProto$8 = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable$1.call(object, symbol);
	  });
	};

	var _getSymbols = getSymbols;

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	var _baseTimes = baseTimes;

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	var stubFalse_1 = stubFalse;

	var isBuffer_1 = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root$1.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse_1;

	module.exports = isBuffer;
	});

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
	}

	var isLength_1 = isLength;

	/** `Object#toString` result references. */
	var argsTag$2 = '[object Arguments]';
	var arrayTag$1 = '[object Array]';
	var boolTag$1 = '[object Boolean]';
	var dateTag$1 = '[object Date]';
	var errorTag$1 = '[object Error]';
	var funcTag$1 = '[object Function]';
	var mapTag$1 = '[object Map]';
	var numberTag$1 = '[object Number]';
	var objectTag$1 = '[object Object]';
	var regexpTag$1 = '[object RegExp]';
	var setTag$1 = '[object Set]';
	var stringTag$1 = '[object String]';
	var weakMapTag = '[object WeakMap]';

	var arrayBufferTag$1 = '[object ArrayBuffer]';
	var dataViewTag$1 = '[object DataView]';
	var float32Tag = '[object Float32Array]';
	var float64Tag = '[object Float64Array]';
	var int8Tag = '[object Int8Array]';
	var int16Tag = '[object Int16Array]';
	var int32Tag = '[object Int32Array]';
	var uint8Tag = '[object Uint8Array]';
	var uint8ClampedTag = '[object Uint8ClampedArray]';
	var uint16Tag = '[object Uint16Array]';
	var uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$1] =
	typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
	typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
	typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
	typedArrayTags[objectTag$1] = typedArrayTags[regexpTag$1] =
	typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike_1(value) &&
	    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
	}

	var _baseIsTypedArray = baseIsTypedArray;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary;

	var _nodeUtil = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && _freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	});

	/* Node.js helper references. */
	var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

	var isTypedArray_1 = isTypedArray;

	/** Used for built-in method references. */
	var objectProto$9 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray_1$2(value),
	      isArg = !isArr && isArguments_1(value),
	      isBuff = !isArr && !isArg && isBuffer_1(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? _baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$7.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           _isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _arrayLikeKeys = arrayLikeKeys;

	/** Used for built-in method references. */
	var objectProto$11 = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$11;

	  return value === proto;
	}

	var _isPrototype = isPrototype;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = _overArg(Object.keys, Object);

	var _nativeKeys = nativeKeys;

	/** Used for built-in method references. */
	var objectProto$10 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!_isPrototype(object)) {
	    return _nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeys = baseKeys;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength_1(value.length) && !isFunction_1$3(value);
	}

	var isArrayLike_1 = isArrayLike;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
	}

	var keys_1 = keys;

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return _baseGetAllKeys(object, keys_1, _getSymbols);
	}

	var _getAllKeys = getAllKeys;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$4 = 1;

	/** Used for built-in method references. */
	var objectProto$7 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4,
	      objProps = _getAllKeys(object),
	      objLength = objProps.length,
	      othProps = _getAllKeys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty$6.call(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	var _equalObjects = equalObjects;

	/* Built-in method references that are verified to be native. */
	var DataView$1 = _getNative(_root$1, 'DataView');

	var _DataView = DataView$1;

	/* Built-in method references that are verified to be native. */
	var Promise$2 = _getNative(_root$1, 'Promise');

	var _Promise = Promise$2;

	/* Built-in method references that are verified to be native. */
	var Set = _getNative(_root$1, 'Set');

	var _Set = Set;

	/* Built-in method references that are verified to be native. */
	var WeakMap = _getNative(_root$1, 'WeakMap');

	var _WeakMap = WeakMap;

	/** `Object#toString` result references. */
	var mapTag$2 = '[object Map]';
	var objectTag$2 = '[object Object]';
	var promiseTag = '[object Promise]';
	var setTag$2 = '[object Set]';
	var weakMapTag$1 = '[object WeakMap]';

	var dataViewTag$2 = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = _toSource(_DataView);
	var mapCtorString = _toSource(_Map);
	var promiseCtorString = _toSource(_Promise);
	var setCtorString = _toSource(_Set);
	var weakMapCtorString = _toSource(_WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = _baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
	    (_Map && getTag(new _Map) != mapTag$2) ||
	    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
	    (_Set && getTag(new _Set) != setTag$2) ||
	    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
	  getTag = function(value) {
	    var result = _baseGetTag(value),
	        Ctor = result == objectTag$2 ? value.constructor : undefined,
	        ctorString = Ctor ? _toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag$2;
	        case mapCtorString: return mapTag$2;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag$2;
	        case weakMapCtorString: return weakMapTag$1;
	      }
	    }
	    return result;
	  };
	}

	var _getTag = getTag;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$1 = 1;

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]';
	var arrayTag = '[object Array]';
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto$6 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	  var objIsArr = isArray_1$2(object),
	      othIsArr = isArray_1$2(other),
	      objTag = objIsArr ? arrayTag : _getTag(object),
	      othTag = othIsArr ? arrayTag : _getTag(other);

	  objTag = objTag == argsTag$1 ? objectTag : objTag;
	  othTag = othTag == argsTag$1 ? objectTag : othTag;

	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && isBuffer_1(object)) {
	    if (!isBuffer_1(other)) {
	      return false;
	    }
	    objIsArr = true;
	    objIsObj = false;
	  }
	  if (isSameTag && !objIsObj) {
	    stack || (stack = new _Stack);
	    return (objIsArr || isTypedArray_1(object))
	      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
	      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	  }
	  if (!(bitmask & COMPARE_PARTIAL_FLAG$1)) {
	    var objIsWrapped = objIsObj && hasOwnProperty$5.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty$5.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new _Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new _Stack);
	  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}

	var _baseIsEqualDeep = baseIsEqualDeep;

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Unordered comparison
	 *  2 - Partial comparison
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, bitmask, customizer, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
	    return value !== value && other !== other;
	  }
	  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}

	var _baseIsEqual = baseIsEqual;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	var COMPARE_UNORDERED_FLAG = 2;

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new _Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	var _baseIsMatch = baseIsMatch;

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject_1$3(value);
	}

	var _isStrictComparable = isStrictComparable;

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys_1(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, _isStrictComparable(value)];
	  }
	  return result;
	}

	var _getMatchData = getMatchData;

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	var _matchesStrictComparable = matchesStrictComparable;

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = _getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || _baseIsMatch(object, source, matchData);
	  };
	}

	var _baseMatches = baseMatches;

	/** `Object#toString` result references. */
	var symbolTag$1 = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
	}

	var isSymbol_1 = isSymbol;

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
	var reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray_1$2(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol_1(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	var _isKey = isKey;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || _MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = _MapCache;

	var memoize_1 = memoize;

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize_1(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	var _memoizeCapped = memoizeCapped;

	/** Used to match property names within property paths. */
	var reLeadingDot = /^\./;
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = _memoizeCapped(function(string) {
	  var result = [];
	  if (reLeadingDot.test(string)) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	var _stringToPath = stringToPath;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined;
	var symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray_1$2(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return _arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol_1(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	var _baseToString = baseToString;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : _baseToString(value);
	}

	var toString_1 = toString;

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray_1$2(value)) {
	    return value;
	  }
	  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
	}

	var _castPath = castPath;

	/** Used as references for various `Number` constants. */
	var INFINITY$1 = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol_1(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
	}

	var _toKey = toKey;

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = _castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[_toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	var _baseGet = baseGet;

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : _baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	var get_1 = get;

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}

	var _baseHasIn = baseHasIn;

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = _castPath(path, object);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = _toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength_1(length) && _isIndex(key, length) &&
	    (isArray_1$2(object) || isArguments_1(object));
	}

	var _hasPath = hasPath;

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && _hasPath(object, path, _baseHasIn);
	}

	var hasIn_1 = hasIn;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$5 = 1;
	var COMPARE_UNORDERED_FLAG$3 = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (_isKey(path) && _isStrictComparable(srcValue)) {
	    return _matchesStrictComparable(_toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get_1(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn_1(object, path)
	      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
	  };
	}

	var _baseMatchesProperty = baseMatchesProperty;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	var identity_1 = identity;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	var _baseProperty = baseProperty;

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return _baseGet(object, path);
	  };
	}

	var _basePropertyDeep = basePropertyDeep;

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
	}

	var property_1 = property;

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity_1;
	  }
	  if (typeof value == 'object') {
	    return isArray_1$2(value)
	      ? _baseMatchesProperty(value[0], value[1])
	      : _baseMatches(value);
	  }
	  return property_1(value);
	}

	var _baseIteratee = baseIteratee;

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	var _createBaseFor = createBaseFor;

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = _createBaseFor();

	var _baseFor = baseFor;

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && _baseFor(object, iteratee, keys_1);
	}

	var _baseForOwn = baseForOwn;

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike_1(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	var _createBaseEach = createBaseEach;

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = _createBaseEach(_baseForOwn);

	var _baseEach = baseEach;

	/**
	 * The base implementation of `_.map` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike_1(collection) ? Array(collection.length) : [];

	  _baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	var _baseMap = baseMap;

	/**
	 * The base implementation of `_.sortBy` which uses `comparer` to define the
	 * sort order of `array` and replaces criteria objects with their corresponding
	 * values.
	 *
	 * @private
	 * @param {Array} array The array to sort.
	 * @param {Function} comparer The function to define sort order.
	 * @returns {Array} Returns `array`.
	 */
	function baseSortBy(array, comparer) {
	  var length = array.length;

	  array.sort(comparer);
	  while (length--) {
	    array[length] = array[length].value;
	  }
	  return array;
	}

	var _baseSortBy = baseSortBy;

	/**
	 * Compares values to sort them in ascending order.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {number} Returns the sort order indicator for `value`.
	 */
	function compareAscending(value, other) {
	  if (value !== other) {
	    var valIsDefined = value !== undefined,
	        valIsNull = value === null,
	        valIsReflexive = value === value,
	        valIsSymbol = isSymbol_1(value);

	    var othIsDefined = other !== undefined,
	        othIsNull = other === null,
	        othIsReflexive = other === other,
	        othIsSymbol = isSymbol_1(other);

	    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
	        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
	        (valIsNull && othIsDefined && othIsReflexive) ||
	        (!valIsDefined && othIsReflexive) ||
	        !valIsReflexive) {
	      return 1;
	    }
	    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
	        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
	        (othIsNull && valIsDefined && valIsReflexive) ||
	        (!othIsDefined && valIsReflexive) ||
	        !othIsReflexive) {
	      return -1;
	    }
	  }
	  return 0;
	}

	var _compareAscending = compareAscending;

	/**
	 * Used by `_.orderBy` to compare multiple properties of a value to another
	 * and stable sort them.
	 *
	 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
	 * specify an order of "desc" for descending or "asc" for ascending sort order
	 * of corresponding values.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {boolean[]|string[]} orders The order to sort by for each property.
	 * @returns {number} Returns the sort order indicator for `object`.
	 */
	function compareMultiple(object, other, orders) {
	  var index = -1,
	      objCriteria = object.criteria,
	      othCriteria = other.criteria,
	      length = objCriteria.length,
	      ordersLength = orders.length;

	  while (++index < length) {
	    var result = _compareAscending(objCriteria[index], othCriteria[index]);
	    if (result) {
	      if (index >= ordersLength) {
	        return result;
	      }
	      var order = orders[index];
	      return result * (order == 'desc' ? -1 : 1);
	    }
	  }
	  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	  // that causes it, under certain circumstances, to provide the same value for
	  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	  // for more details.
	  //
	  // This also ensures a stable sort in V8 and other engines.
	  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
	  return object.index - other.index;
	}

	var _compareMultiple = compareMultiple;

	/**
	 * The base implementation of `_.orderBy` without param guards.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	 * @param {string[]} orders The sort orders of `iteratees`.
	 * @returns {Array} Returns the new sorted array.
	 */
	function baseOrderBy(collection, iteratees, orders) {
	  var index = -1;
	  iteratees = _arrayMap(iteratees.length ? iteratees : [identity_1], _baseUnary(_baseIteratee));

	  var result = _baseMap(collection, function(value, key, collection) {
	    var criteria = _arrayMap(iteratees, function(iteratee) {
	      return iteratee(value);
	    });
	    return { 'criteria': criteria, 'index': ++index, 'value': value };
	  });

	  return _baseSortBy(result, function(object, other) {
	    return _compareMultiple(object, other, orders);
	  });
	}

	var _baseOrderBy = baseOrderBy;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	var defineProperty = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800;
	var HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject_1$3(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike_1(object) && _isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq_1(object[index], value);
	  }
	  return false;
	}

	var _isIterateeCall = isIterateeCall;

	/**
	 * Creates an array of elements, sorted in ascending order by the results of
	 * running each element in a collection thru each iteratee. This method
	 * performs a stable sort, that is, it preserves the original sort order of
	 * equal elements. The iteratees are invoked with one argument: (value).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {...(Function|Function[])} [iteratees=[_.identity]]
	 *  The iteratees to sort by.
	 * @returns {Array} Returns the new sorted array.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'fred',   'age': 48 },
	 *   { 'user': 'barney', 'age': 36 },
	 *   { 'user': 'fred',   'age': 40 },
	 *   { 'user': 'barney', 'age': 34 }
	 * ];
	 *
	 * _.sortBy(users, [function(o) { return o.user; }]);
	 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
	 *
	 * _.sortBy(users, ['user', 'age']);
	 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
	 */
	var sortBy = _baseRest(function(collection, iteratees) {
	  if (collection == null) {
	    return [];
	  }
	  var length = iteratees.length;
	  if (length > 1 && _isIterateeCall(collection, iteratees[0], iteratees[1])) {
	    iteratees = [];
	  } else if (length > 2 && _isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
	    iteratees = [iteratees[0]];
	  }
	  return _baseOrderBy(collection, _baseFlatten(iteratees, 1), []);
	});

	var sortBy_1 = sortBy;

	// main

	function PromiseCache (args) {

	  var args = args || {};

	  this.maxResolvedCache = args.maxResolvedCache || 1000;

	  this._pendingPromises = {};
	  this._resolvedPromises = {};

	}

	PromiseCache.prototype = {

	  add: function (key, promise) {

	    var self = this;

	    // check if it already exists
	    if (this._pendingPromises[ key ]) {
	      return this._pendingPromises[ key ]
	    }
	    if (this._resolvedPromises[ key ]) {
	      return this._resolvedPromises[ key ]
	    }

	    // create cache object
	    var cacheObject = {
	      key: key,
	      timestamp: Date.now(),
	      promise: promise
	    };

	    // add to store
	    this._pendingPromises[ key ] = cacheObject;

	    // move to resolved store and update state when resolved
	    promise.then(function (data) {

	      var cacheObject = self._pendingPromises[ key ];
	      delete self._pendingPromises[ key ];

	      cacheObject.data = data;

	      self._resolvedPromises[ key ] = cacheObject;

	    }, function () {

	      delete self._pendingPromises[ key ];

	    });

	    // collect garbage
	    this._collectGarbage();

	    // return cache object
	    return cacheObject

	  },

	  get: function (key) {

	    // check store
	    var cacheObject = this._pendingPromises[ key ] || this._resolvedPromises[ key ];
	    if (!cacheObject) {
	      return false
	    }

	    // update timestamp
	    cacheObject.timestamp = Date.now();

	    // return promise
	    return cacheObject.promise

	  },

	  purge: function () {

	    for (var key in this._resolvedPromises) {
	      delete this._resolvedPromises[ key ];
	    }

	  },

	  _collectGarbage: function () {

	    // sort archive by timestamp
	    var sortedPromises = sortBy_1(this._resolvedPromises, function (obj) {
	      return obj.timestamp
	    });

	    // the amount of cache objects that have to be removed
	    var removeCount = (sortedPromises.length - this.maxResolvedCache);
	    if (removeCount <= 0) {
	      return
	    }

	    for (var i = 0; i < removeCount; i++) {
	      delete this._resolvedPromises[ sortedPromises[ i ].key ];
	    }

	  }

	};

	var cache = new PromiseCache();

	var fetchTextureByType = {
	  '.dds': fetchDdsTexture,
	  '.jpg': fetchImageTexture,
	  '.jpeg': fetchImageTexture,
	  '.jpe': fetchImageTexture,
	  '.png': fetchImageTexture,
	  '.gif': fetchImageTexture,
	  '.svg': fetchImageTexture
	};

	function fetchTexture (url, queueName) {
	  
	  // internals
	  var cacheKey = url;

	  // try cache
	  var promiseFromCache = cache.get(cacheKey);
	  if (promiseFromCache) return promiseFromCache

	  // get file extension
	  var extSearch = url.match(/\.[A-Za-z]+(?=\?|$)/i);
	  var type = extSearch ? extSearch[0].toLowerCase() : '.jpg';

	  if (!fetchTextureByType[type]) {
	    // unknown texture type. fallback to JPG
	    console.warn('Unknown texture type ' + type + '. Trying to load as JPG.');
	    type = '.jpg';
	  }

	  var promise = queueManager.enqueue(queueName, url).then(function(){

	    return fetchTextureByType[type](url)

	  }).then(function(texture){

	    queueManager.dequeue(queueName, url);
	    return texture

	  }).catch(function (error) {

	    queueManager.dequeue(queueName, url);
	    return bluebird_1.reject(error)

	  });

	  // add to cache
	  cache.add(cacheKey, promise);

	  return promise

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

	function loadTextureSet ( queueName, TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, resetTexturesOnLoadStart) {
	  
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
	        texturePromises[ textureCount ] = fetchTexture(textureS3Key, queueName).catch(onError);
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
	        texturePromises[ textureCount ] = fetchTexture(textureS3Key, queueName).catch(onError);
	        textureKeys[ textureCount ] = textureType;
	        texture3dKeys[ textureCount ] = THREEJS_TEXTURE_TYPES_MAP[ textureType ];
	        textureCount++;

	      } else {

	        console.error('Lightmap ' + _attributes[ TEXTURE_TYPES.UV2 ] + ' could not be assigned because geometry has no lightmap UV (UV2) vertices.');

	      }

	    }

	  }

	  // load textures

	  var promise, wrap, isTexture, isTextureToBeLoadedNext;
	  if (textureCount) {

	    promise = bluebird_1.all(texturePromises).then(function (textures) {

	      // assign textures
	      wrap = WEBGL_WRAP_TYPES[ _attributes.wrap ] || WEBGL_WRAP_TYPES[ 'repeat' ];
	      for (i = 0; i < textureCount; i++) {

	        // filter texture loading errors
	        isTexture = textures[i] instanceof THREE.CompressedTexture || textures[i] instanceof THREE.Texture;
	        // avoid racing conditions
	        isTextureToBeLoadedNext = textures[i] && textures[i].url === material3d._texturesToBeLoaded[textureKeys[i]];

	        if (!isTexture || !isTextureToBeLoadedNext) continue

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


	  material3d.userData = material3d.userData || {};
	  material3d.userData.data3dMaterial = args.attributes;

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

	  // We are not using color ambient
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
	    mesh3d.castShadow    = _attributes.castRealTimeShadows;
	    mesh3d.receiveShadow = _attributes.receiveRealTimeShadows;
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
	    loadingQueueName,
	    isLoadingLoResTextures,
	    hasLoResTextures = _attributes.mapDiffusePreview || _attributes.mapSpecularPreview || _attributes.mapNormalPreview || _attributes.mapAlphaPreview || _attributes.mapLightPreview,
	    // hasHiResTextures = _attributes.mapDiffuse || _attributes.mapSpecular || _attributes.mapNormal || _attributes.mapAlpha || _attributes.mapLight,
	    // TODO: readd hiResTextures configs
	    // hiResTexturesEnabled = !configs.isMobile && vm.viewport.a.hiResTextures && configs.compatibility.webglCompressedTextures
	    hiResTexturesEnabled = !runtime.isMobile && runtime.webGl.supportsDds;

	  if (!hiResTexturesEnabled || (hasLoResTextures && !material3d.firstTextureLoaded)) {
	    if (loadingQueuePrefix) {
	      loadingQueueName = loadingQueuePrefix + 'TexturesLoRes';
	    }
	    loadingTexturesPromise = loadTextureSet(loadingQueueName, LO_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false);
	    isLoadingLoResTextures = true;
	  } else {
	    if (loadingQueuePrefix) {
	      loadingQueueName = loadingQueuePrefix + 'TexturesHiRes';
	    }
	    loadingTexturesPromise = loadTextureSet(loadingQueueName, HI_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false);
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
	        loadingQueueName = loadingQueuePrefix + 'TexturesHiRes';
	      }
	      loadTextureSet(loadingQueueName, HI_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false);
	    });
	  }

	  // return texture loading promise

	  return loadingTexturesPromise
	}

	var fragmentShader = "uniform vec3 diffuse;\r\nuniform vec3 emissive;\r\nuniform vec3 specular;\r\nuniform float shininess;\r\nuniform float opacity;\r\n\r\n#include <common>\r\n#include <packing>\r\n#include <uv_pars_fragment>\r\n#include <uv2_pars_fragment>\r\n#include <map_pars_fragment>\r\n#include <alphamap_pars_fragment>\r\n\r\n// Replaces <lightmap_pars_fragment>;\r\n\r\n#ifdef USE_LIGHTMAP\r\n\tuniform sampler2D lightMap;\r\n\tuniform float lightMapIntensity;\r\n\tuniform float lightMapExposure;\r\n\tuniform float lightMapFalloff;\r\n#endif\r\n\r\n#include <normalmap_pars_fragment>\r\n#include <specularmap_pars_fragment>\r\n\r\n#include <bsdfs>\r\n#include <lights_pars>\r\n#include <lights_phong_pars_fragment>\r\n#include <shadowmap_pars_fragment>\r\n\r\n\r\nvoid main() {\r\n\r\n    vec4 diffuseColor = vec4( diffuse, opacity );\r\n    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r\n\r\n    vec3 totalEmissiveRadiance = emissive;\r\n\r\n    #include <map_fragment>\r\n    #include <alphamap_fragment>\r\n    #include <alphatest_fragment>\r\n    #include <specularmap_fragment>\r\n    #include <normal_flip>\r\n    #include <normal_fragment>\r\n\r\n    // accumulation\r\n    #include <lights_phong_fragment>\r\n\r\n    // Start of <light-template> replace block\r\n    GeometricContext geometry;\r\n\r\n    geometry.position = - vViewPosition;\r\n    geometry.normal = normal;\r\n    geometry.viewDir = normalize( vViewPosition );\r\n\r\n    IncidentLight directLight;\r\n\r\n    #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\r\n\r\n        PointLight pointLight;\r\n\r\n        for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\r\n\r\n            pointLight = pointLights[ i ];\r\n\r\n            getPointDirectLightIrradiance( pointLight, geometry, directLight );\r\n\r\n            #ifdef USE_SHADOWMAP\r\n            directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;\r\n            #endif\r\n\r\n            RE_Direct( directLight, geometry, material, reflectedLight );\r\n\r\n        }\r\n\r\n    #endif\r\n\r\n    #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\r\n\r\n        SpotLight spotLight;\r\n\r\n        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\r\n\r\n            spotLight = spotLights[ i ];\r\n\r\n            getSpotDirectLightIrradiance( spotLight, geometry, directLight );\r\n\r\n            #ifdef USE_SHADOWMAP\r\n            directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\r\n            #endif\r\n\r\n            RE_Direct( directLight, geometry, material, reflectedLight );\r\n\r\n        }\r\n\r\n    #endif\r\n\r\n    #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\r\n\r\n        DirectionalLight directionalLight;\r\n\r\n        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\r\n\r\n            directionalLight = directionalLights[ i ];\r\n\r\n            getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\r\n\r\n            #ifdef USE_SHADOWMAP\r\n            directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\r\n            #endif\r\n\r\n            RE_Direct( directLight, geometry, material, reflectedLight );\r\n\r\n        }\r\n\r\n    #endif\r\n\r\n    #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\r\n\r\n        RectAreaLight rectAreaLight;\r\n\r\n        for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\r\n\r\n            rectAreaLight = rectAreaLights[ i ];\r\n            RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\r\n\r\n        }\r\n\r\n    #endif\r\n\r\n    #if defined( RE_IndirectDiffuse )\r\n\r\n        vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\r\n\r\n        #ifdef USE_LIGHTMAP\r\n\r\n            // compute the light value\r\n            vec3 unit = vec3(1.0);\r\n            vec3 light = 2.0 * (texture2D( lightMap, vUv2 ).xyz - lightMapExposure * unit);\r\n            // compute the light intensity modifier\r\n            vec3 modifier = -lightMapFalloff * light * light + unit;\r\n            // apply light\r\n            vec3 lightMapIrradiance = light * modifier * lightMapIntensity;\r\n\r\n            #ifndef PHYSICALLY_CORRECT_LIGHTS\r\n\r\n                lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage\r\n\r\n            #endif\r\n\r\n            irradiance += lightMapIrradiance;\r\n\r\n        #endif\r\n\r\n        #if ( NUM_HEMI_LIGHTS > 0 )\r\n\r\n            for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\r\n\r\n                irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\r\n\r\n            }\r\n\r\n        #endif\r\n\r\n        RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\r\n\r\n    #endif\r\n    // End of <light-template> replace block\r\n\r\n    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\r\n\r\n    gl_FragColor = vec4( outgoingLight, diffuseColor.a );\r\n\r\n}";

	var vertexShader = "varying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\tvarying vec3 vNormal;\r\n#endif\r\n\r\n#include <uv_pars_vertex>\r\n#include <uv2_pars_vertex>\r\n#include <shadowmap_pars_vertex>\r\n\r\nvoid main()\r\n{\r\n//  vUv = uv;\r\n  #include <uv_vertex>\r\n  #include <uv2_vertex>\r\n\r\n  #include <beginnormal_vertex>\r\n  #include <defaultnormal_vertex>\r\n\r\n  #ifndef FLAT_SHADED\r\n    // Normal computed with derivatives when FLAT_SHADED\r\n  \tvNormal = normalize( transformedNormal );\r\n  #endif\r\n\r\n  #include <begin_vertex>\r\n  #include <project_vertex>\r\n\r\n  vViewPosition = - mvPosition.xyz;\r\n\r\n  #include <worldpos_vertex>\r\n  #include <shadowmap_vertex>\r\n\r\n}";

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

	// TODO: increase performance
	// TODO: decouple from THREEjs
	// TODO: make use of edge case threshold=0 (no need to compare face normals)

	function generateWireframeBuffer( positions, thresholdAngle ) {
		
	//    console.time('calc')

		// internals
		var thresholdDot = Math.cos( thresholdAngle * Math.PI / 180 );
		var edge = [ 0, 0 ];
		var hash = {};
		var keys = [ 'a', 'b', 'c' ];

		var tempGeometry = new THREE.Geometry();
		for (var i = 0, j = 0; i < positions.length / 3; i += 3, j += 9) {
			tempGeometry.vertices[ tempGeometry.vertices.length ] = new THREE.Vector3( positions[ j ], positions[ j + 1 ], positions[ j + 2 ] );
			tempGeometry.vertices[ tempGeometry.vertices.length ] = new THREE.Vector3( positions[ j + 3 ], positions[ j + 4 ], positions[ j + 5 ] );
			tempGeometry.vertices[ tempGeometry.vertices.length ] = new THREE.Vector3( positions[ j + 6 ], positions[ j + 7 ], positions[ j + 8 ] );
			tempGeometry.faces[ tempGeometry.faces.length ] = new THREE.Face3( i, i + 1, i + 2, [], [] );
		}
		tempGeometry.mergeVertices();
		tempGeometry.computeFaceNormals();

		var vertices = tempGeometry.vertices;
		var faces = tempGeometry.faces;
		var numEdges = 0;

		for ( var i = 0, l = faces.length; i < l; i ++ ) {
			var face = faces[ i ];
			for ( var j = 0; j < 3; j ++ ) {

				edge[ 0 ] = face[ keys[ j ] ];
				edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
				edge.sort( sortFunction );

				var key = edge.toString();

				if ( hash[ key ] === undefined ) {
					hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };
					numEdges ++;
				} else {
					hash[ key ].face2 = i;
				}
			}
		}

		var coords = new Float32Array( numEdges * 2 * 3 );
		var index = 0;

		for ( var key in hash ) {
			var h = hash[ key ];
			if ( h.face2 === undefined || faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {

				var vertex = vertices[ h.vert1 ];
				coords[ index ++ ] = vertex.x;
				coords[ index ++ ] = vertex.y;
				coords[ index ++ ] = vertex.z;

				vertex = vertices[ h.vert2 ];
				coords[ index ++ ] = vertex.x;
				coords[ index ++ ] = vertex.y;
				coords[ index ++ ] = vertex.z;

			}
		}

	//    console.timeEnd('calc')

		return coords

	}

	// helpers

	function sortFunction ( a, b ) { return a - b }

	function compareArrays(a, b, precision) {

		if (a === b) {
			return true
		} else if (a.length !== b.length) {
			return false
		} else {
			precision = precision === undefined ? 1 : precision;
			var step = ~~(a.length / (a.length * precision));
			for (var i = 0, l = a.length; i<l; i+=step) if (a[i] !== b[i]) return false
			return true
		}

	}

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
	    this.isLineSegments = true;
	    THREE.Line.call( this, this._wireframeGeometry, this._wireframeMaterial );

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
	        var newBuffer = generateWireframeBuffer( positions, thresholdAngle );
	        if (newBuffer.length) {
						this._wireframeGeometry.attributes.position.setArray( newBuffer );
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
	        loadingQueuePrefix = data3d.loadingQueuePrefix || options.loadingQueuePrefix || 'architecture',
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
	            material3d = new Io3dMaterial();
	            material3d.name = materialId;
	            if (!materials) {
	              // there is no material properties. using default properties
	              setMaterial({
	                material3d: material3d
	              });
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
	            // add to parent
	            self.threeParent.add(mesh3d);
	            // remembers
	            self._meshes3d[ meshId ] = mesh3d;

	            // create a separate geometry object for wireframes
	            wireframe3d = new Wireframe();
	            // add to parent
	            self._meshes3d[ meshId ].add(wireframe3d);
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
	          if (position) {
	            mesh3d.position.set( position[0] , position[1], position[2] );
	          }

	          // apply rotation
	          if (rotRad) {
	            mesh3d.rotation.set( rotRad[0] , rotRad[1], rotRad[2] );
	          } else if (rotDeg) {
	            mesh3d.rotation.set( rotDeg[0] * DEG_TO_RAD, rotDeg[1] * DEG_TO_RAD, rotDeg[2] * DEG_TO_RAD );
	          }

	          // apply buffers if they are different than current buffers
	          if (geometry3d.attributes.position === undefined) {
	            geometry3d.addAttribute( 'position', new THREE.BufferAttribute(positions, 3) );
	            // The bounding box of the scene may need to be updated
	            // self.vm.viewport.webglView.modelBoundingBoxNeedsUpdate = true
	          } else if (geometry3d.attributes.position.array !== positions ) {
	            geometry3d.attributes.position.array = positions;
	            geometry3d.attributes.position.needsUpdate = true;
	            // Three.js needs this to update
	            geometry3d.computeBoundingSphere();
	            // The bounding box of the scene may need to be updated
	            // self.vm.viewport.webglView.modelBoundingBoxNeedsUpdate = true
	          }
	          if (geometry3d.attributes.normal === undefined) {
	            geometry3d.addAttribute( 'normal', new THREE.BufferAttribute(normals, 3) );
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
	           var wireframe3d = self._wireframes3d[ meshId ];
	           if (wireframe3d.parent) {
	             wireframe3d.parent.remove( wireframe3d );
	             wireframe3d.geometry.dispose();
	           }
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

	      return promise ? promise : bluebird_1.resolve()

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
	  var headers = { 'Content-Type': 'application/json' };
	  if (secretApiKey) headers['X-Secret-Key'] = secretApiKey;
	  if (publishableApiKey) headers['X-Publishable-Key'] = publishableApiKey;

	  // send request
	  fetch$1(configs.servicesUrl, {
	    body: JSON.stringify(rpcRequest.message),
	    method: 'POST',
	    headers: headers,
	    credentials: (isTrustedOrigin ? 'include' : 'omit' ) //TODO: Find a way to allow this more broadly yet safely
	  }).then(function (response) {
	    return response.text().then(function onParsingSuccess(body){
	      // try to parse JSON in any case because valid JSON-RPC2 errors do have error status too
	      var message;
	      try {
	        message = JSON.parse(body);
	      } catch (error) {
	        return bluebird_1.reject('JSON parsing Error: "'+error+'" Response body: "'+body+'"')
	      }
	      // rpc client will handle JSON-RPC2 success messages and errors and resolve or reject prcRequest promise accordingly
	      rpcClient.handleResponse(message);
	    }).catch(function onParsingError(error){
	      var errorString = '';
	      if (error instanceof Error || typeof error === 'string') {
	        errorString = error;
	      } else {
	        try {
	          errorString = JSON.stringify(error, null, 2);
	        } catch (e) {
	          errorString = error && error.toString ? error.toString() : '';
	        }
	      }
	      // response is not a valid json error message. (most likely a network error)
	      var errorMessage = 'API request to '+configs.servicesUrl+' failed: '+response.status+': '+response.statusText+'\n'+errorString+'\nOriginal JSON-RPC2 request to 3d.io: '+JSON.stringify(rpcRequest.message, null, 2);
	      rpcRequest.cancel(errorMessage);
	    })
	  }).catch(function(error){
	    rpcRequest.cancel('Error sending request to 3d.io API: "'+(error.code || JSON.stringify(error) )+'"');
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
	    this.el.data3dView = this.data3dView;
	    // load 3d file
	    Promise.resolve().then(function(){
	      if (key) {
	        return io3d.storage.get(key, { loadingQueuePrefix: 'architecture' })
	      } else {
	        return io3d.utils.data3d.load(url, { loadingQueuePrefix: 'architecture' })
	      }
	    }).then(function (data3d) {
	      this_.el.data3d = data3d;
	      // update view
	      this_.data3dView.set(data3d, {
	        lightMapIntensity: lightMapIntensity,
	        lightMapExposure: lightMapExposure,
	        loadingQueuePrefix: 'architecture'
	      });
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
	    var el = this.el;
	    var data = this.data;
	    var furnitureId = data.id;

	    // check params
	    if (!furnitureId || furnitureId === '') return

	    // remove old mesh
	    this_.remove();

	    // create new one
	    this_.mesh = new THREE.Object3D();
	    this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh});

	    // get furniture data
	    io3d.furniture.get(furnitureId).then(function (result) {

	      var info = result.info; // lightweight info like name, manufacturer, description...
	      var data3d = result.data3d; // geometries and materials
	      var availableMaterials = {};

	      // Expose properties
	      this_.info = info;
	      this_.data3d = data3d;
	      this_.availableMaterials = availableMaterials;

	      // check for material presets in the furniture sceneStructure definition
	      var materialPreset = info.sceneStructure && JSON.parse(info.sceneStructure).materials;
	      // Parse materials
	      Object.keys(data3d.meshes).forEach(function eachMesh (meshId) {
	        availableMaterials[meshId] = data3d.alternativeMaterialsByMeshKey ? data3d.alternativeMaterialsByMeshKey[meshId] : data3d.meshes[meshId].material;

	        // get material name from inspector
	        var materialPropName = 'material_' + meshId.replace(/\s/g, '_');
	        // get materialId from a-frame attribute or from furniture API scene structure preset
	        var newMaterialId =  data[materialPropName] || (materialPreset ? materialPreset[meshId] : null);

	        // set custom material if available
	        if (newMaterialId) {

	          // update material
	          data3d.meshes[meshId].material = newMaterialId;
	          // trigger event
	          el.emit('material-changed', {mesh: meshId, material: newMaterialId});

	        } else {

	          // register it as part of the schema for the inspector
	          var prop = {};
	          prop[materialPropName] = {
	            type: 'string',
	            default: data3d.meshes[meshId].material,
	            oneOf: data3d.alternativeMaterialsByMeshKey ? data3d.alternativeMaterialsByMeshKey[meshId] : data3d.meshes[meshId].material
	          };
	          this_.extendSchema(prop);
	          this_.data[materialPropName] = data3d.meshes[meshId].material;

	        }
	      });

	      // update view
	      this_.data3dView.set(data3d, {
	        loadingQueuePrefix: 'interior'
	      });
	      this_.el.data3d = data3d;
	      this_.el.setObject3D('mesh', this_.mesh);

	      // emit events
	      if (this_._previousFurnitureId !== furnitureId) {
	        this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
	        this_._previousFurnitureId = furnitureId;
	      }

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

	var tourComponent = {
	  schema: {
	    autoStart: {
	      type: 'boolean',
	      default: true
	    },
	    loop: {
	      type: 'boolean',
	      default: true
	    },
	    wait: {
	      type: 'number',
	      default: 2000
	    },
	    move: {
	      type: 'number',
	      default: 3000
	    }
	  },

	  init: function () {
	    this._currentWayPoint = -1;
	    this.el.setAttribute('animation__move', { startEvents: 'doNotFire', pauseEvents: 'pauseTour', resumeEvents:'resumeTour', property: 'position', easing: 'easeInOutSine', dur: 100 });
	    this.el.setAttribute('animation__turn', { startEvents: 'doNotFire', pauseEvents: 'pauseTour', resumeEvents:'resumeTour', property: 'rotation', easing: 'easeInOutSine', dur: 100 });
	    this._nextWaypointHandler = this._nextWaypoint.bind(this);
	  },

	  update: function () {
	    this._waypoints = Array.from(this.el.querySelectorAll('[tour-waypoint]'));

	    if(this.data.autoStart) {
	      this.playTour();
	    }
	  },

	  playTour: function () {
	    if (this._isPlaying) {
	      if(this._isChangingAnimation) {
	        clearTimeout(this._nextAnimationTimeout);
	        this.goTo(this._waypoints[this._currentWayPoint].getAttribute('tour-waypoint'), this._isPlaying);
	      } else {
	        this.el.dispatchEvent(new CustomEvent('resumeTour'));
	      }
	      this._isPaused = false;
	    } else {
	      this._isPlaying = true;
	      this._isPaused = false;
	      this.el.addEventListener('animation__move-complete', this._nextWaypointHandler);
	      var next = this._waypoints[++this._currentWayPoint];
	      if (next) this.goTo(next.getAttribute('tour-waypoint'), true);
	      else if (this.data.loop) {
	        this._currentWayPoint = 0;
	        this.goTo(this._waypoints[0].getAttribute('tour-waypoint'), true);
	      }
	    }
	  },

	  pauseTour: function () {
	    this._isPaused = true;
	    this.el.dispatchEvent(new CustomEvent('pauseTour'));
	  },

	  stopTour: function () {
	    this.pauseTour();
	    this.el.removeEventListener('animation__move-complete', this._nextWaypointHandler);
	    this._isPlaying = false;
	    this._isPaused = false;
	  },

	  goTo: function (label, keepPlaying) {
	    this._isPlaying = !!keepPlaying;
	    var target = this._waypoints.find(function (item) { return item.getAttribute('tour-waypoint') === label });
	    if (!target) {
	      console.error('The given waypoint '+ label + ' does not exist. Available waypoints:', this._waypoints.map(function (elem) { elem.getAttribute('tour-waypoint'); }));
	      return
	    }

	    this.animate(target);
	  },

	  animate: function (bookmark) {
	    var entity = this.el;
	    var newPosition = bookmark.getAttribute('position');
	    var newRotation = bookmark.getAttribute('rotation');
	    var currentPosition = entity.getAttribute('position');
	    var currentRotation = entity.getAttribute('rotation');
	    var startPosition = AFRAME.utils.coordinates.stringify(currentPosition);
	    var startRotation = AFRAME.utils.coordinates.stringify(currentRotation);

	    // compute distance to adapt speed
	    var d = dist(currentPosition, AFRAME.utils.coordinates.parse(newPosition));
	    // compute angle difference to adapt speed
	    var angle = Math.abs(currentRotation.y - AFRAME.utils.coordinates.parse(newRotation).y);
	    // compute animation time
	    // add 1 to the this.data.move parameter to allow users to specify 0 without the animation cancelling out
	    var t = Math.round((this.data.move === undefined ? 3000 : this.data.move + 1) / 6 * (d + angle / 30));
	    if (t > Math.max(10000, this.data.move)) t = Math.max(10000, this.data.move);

	    // prevent zero length animation
	    if (!t) return this._nextWaypoint()

	    entity.components.animation__move.pauseAnimation();
	    entity.components.animation__turn.pauseAnimation();
	    entity.components.animation__move.data.dur = t;
	    entity.components.animation__move.data.from = startPosition;
	    entity.components.animation__move.data.to = newPosition;
	    entity.components.animation__move.update();
	    entity.components.animation__turn.data.dur = t;
	    entity.components.animation__turn.data.from = startRotation;
	    entity.components.animation__turn.data.to = newRotation;
	    entity.components.animation__turn.update();
	    entity.components.animation__move.resumeAnimation();
	    entity.components.animation__turn.resumeAnimation();
	    this._isChangingAnimation = false;
	  },

	  _nextWaypoint: function () {
	    if (!this._isPlaying) return this.stopTour()
	    if (this._currentWayPoint === this._waypoints.length - 1) {
	      if (!this.data.loop) return
	      this._currentWayPoint = -1;
	    }
	    this._isChangingAnimation = true;
	    var next = this._waypoints[++this._currentWayPoint];
	    this._nextAnimationTimeout = setTimeout(function () { this.goTo(next.getAttribute('tour-waypoint'), this._isPlaying); }.bind(this), this.data.wait === undefined ? 0 : this.data.wait);
	  }
	};

	function dist(p, q) {
	  var a = parseFloat(q.x) - parseFloat(p.x);
	  var b = parseFloat(q.y) - parseFloat(p.y);
	  var c = parseFloat(q.z) - parseFloat(p.z);
	  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2))
	}

	// initialize aframe components

	checkDependencies({
	  three: false,
	  aFrame: true,
	  onError: function (){
	    // show aframe dependency warning, since it is unexpected to run aframe on server
	    if (runtime.isBrowser) console.warn('AFRAME library not found: related features will be disabled.');
	  }
	}, function registerComponents () {
	  AFRAME.registerComponent('io3d-data3d', data3dComponent);
	  AFRAME.registerComponent('io3d-furniture', furnitureComponent);
	  AFRAME.registerComponent('tour', tourComponent);
	});

	// export

	var aFrame = {
	  three: {
	    Data3dView: Data3dView
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
	    // scene Structure definition
	    sceneStructure: rawInfo.modelStructure,
	    // data info
	    created: rawInfo.createdAt,
	    updated: rawInfo.updatedAt
	  }
	}

	// helpers

	function convertKeyToUrl (key) {
	  if (!key) return
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
	    // let's make sure we don't have trailing or double spaces
	    query = 'isPublished:true ' + query;
	    query = query.trim().replace(/\s+/g, ' ');
	    return callService('Product.search', {
	      searchQuery: {query: query},
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

	    // check for relative URL in a browser
	    if(typeof window !== 'undefined' && !str.match(/^[^:]+:\/\//) && str.substr(0, 2) !== '//') {
	      if(str[0] === '/') str = str.slice(1);
	      str = window.location.protocol + '//' + window.location.host + window.location.pathname + str;
	      console.error('mutated', str);
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



	for (var i$2 = 0, len = autoEscapeMap.length; i$2 < len; ++i$2) {
	  autoEscapeMap[i$2] = "";
	}

	for (var i$2 = 0, len = autoEscape.length; i$2 < len; ++i$2) {
	  var c = autoEscape[i$2];
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

	function decodeBinary (buffer, options) {

	  // API
	  options = options || {};
	  var url$$1 = options.url;

	  var parsedUrl = Url.parse(url$$1);
	  var rootDir = path.parse(parsedUrl.path || parsedUrl.pathname || '').dir;
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

	    //  convert relative material keys into absolute one
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
	        if (m[texturePathKey].substring(0,5) === '/http') {
	          // FIXME: prevent leading slashes being added to absolute paths
	          m[texturePathKey] = m[texturePathKey].substring(1);
	        } else if (m[texturePathKey][0] === '/') {
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

	  options = options || {};
	  var queueName;
	  if (options.queueName) {
	    queueName = options.queueName;
	  } else if (options.loadingQueuePrefix) {
	    queueName = options.loadingQueuePrefix + 'Geometries';
	  }

	  // run

	  return queueManager.enqueue(queueName, url).then(function(){

	    return fetch$1(url, options).then(function(res){

	      return res.arrayBuffer()

	    }).then(function(buffer){

	      queueManager.dequeue(queueName, url);
	      return decodeBinary(buffer, { url: url })

	    })

	  }).catch(function (error) {

	    queueManager.dequeue(queueName, url);
	    return bluebird_1.reject(error)

	  })
	  
	}

	function getFurniture (id) {
	  // we need to call furniture info first in order to obtain data3d URL
	  return getFurnitureInfo(id).then(function(info){
	    return loadData3d(info.data3dUrl, { loadingQueuePrefix: 'interior' }).then(function(data3d){
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

	var generic = {
	  params: {
	    type: {
	      type: 'string',
	      possibleValues: ['plan', 'level', 'box', 'wall', 'camera-bookmarks', 'interior', 'group', 'railing', 'window', 'door', 'floor', 'polyfloor', 'floorplan'],
	      optional: false
	    },
	    x: { // x position in meters
	      type: 'number',
	      defaultValue: 0,
	      optional: true
	    },
	    y: { // y position in meters
	      type: 'number',
	      defaultValue: 0,
	      optional: true
	    },
	    z: { // z position in meters
	      type: 'number',
	      defaultValue: 0,
	      optional: true
	    },
	    ry: { // y rotation in angle degrees
	      type: 'number',
	      defaultValue: 0,
	      optional: true
	    },
	    children: {
	      //type: 'array-with-objects',
	      type: 'array',
	      defaultValue: [],
	      optional: true
	    },
	    id: {
	      type: 'string',
	      optional: true
	    }
	  }
	};

	var box = {
	  params: {
	    w: { // width in meters
	      type: 'number',
	      defaultValue: 1,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    h: { // height in meters
	      type: 'number',
	      defaultValue: 1,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      defaultValue: 1,
	      optional: false,
	      min: 0.01
	    }
	  },
	  possibleChildrenTypes: []
	};

	var cameraBookmark = {
	  params: {}
	};

	var door = {
	  params: {
	    v: {
	      type: 'number',
	      defaultValue: 3,
	      possibleValues: [3],
	      optional: false
	    },
	    w: { // width in meters
	      type: 'number',
	      defaultValue: 0.05,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    h: { // height in meters
	      type: 'number',
	      defaultValue: 2,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      defaultValue: 0.9,
	      optional: false,
	      min: 0.01
	    },
	    frameLength: { // in meters
	      type: 'number',
	      defaultValue: 0.05,
	      optional: true,
	      min: 0.01
	    },
	    frameOffset: { // in meters
	      type: 'number',
	      defaultValue: 0,
	      optional: true
	    },
	    leafWidth: { // in meters
	      type: 'number',
	      defaultValue: 0.03,
	      optional: true
	    },
	    leafOffset: { // in meters
	      type: 'number',
	      defaultValue: 0.005,
	      optional: true
	    },
	    doorType: {
	      type: 'string',
	      defaultValue: 'singleSwing',
	      optional: false,
	      possibleValues: ['singleSwing', 'doubleSwing', 'swingFix', 'swingDoubleFix', 'doubleSwingDoubleFix', 'slidingDoor', 'opening']
	    },
	    fixLeafRatio: { // in meters
	      type: 'number',
	      defaultValue: 0.3,
	      optional: true
	    },
	    doorAngle: { // in angle degrees
	      type: 'number',
	      defaultValue: 92,
	      optional: true
	    },
	    hinge: {
	      type: 'string',
	      defaultValue: 'right',
	      optional: false,
	      possibleValues: ['right', 'left']
	    },
	    side: {
	      type: 'string',
	      defaultValue: 'back',
	      optional: false,
	      possibleValues: ['front', 'back']
	    },
	    thresholdHeight: {
	      type: 'number',
	      defaultValue: 0.01,
	      optional: true
	    }
	  },
	  possibleChildrenTypes: []
	};

	var floor = {
	  params: {
	    w: { // width in meters
	      type: 'number',
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    h: { // height in meters
	      type: 'number',
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      optional: false,
	      min: 0.01
	    },
	    hasCeiling: { // in meters
	      type: 'boolean',
	      optional: false
	    },
	    hCeiling: { // in meters
	      type: 'number',
	      optional: false
	    }
	  },
	  possibleChildrenTypes: []
	};

	var floorplan = {
	  params: {
	    w: { // width in meters
	      type: 'number',
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      optional: false,
	      min: 0.01
	    },
	    file: {
	      type: 'string',
	      optional: false
	    }
	  },
	  possibleChildrenTypes: []
	};

	var group = {
	  params: {
	    src: {
	      type: 'string',
	      optional: true
	    }
	  },
	  possibleChildrenTypes: ['interior', 'object', 'wall', 'box', 'group', 'polybox']
	};

	var interior = {
	  params: {
	    src: {
	      type: 'string',
	      optional: false
	    }
	  },
	  possibleChildrenTypes: ['interior']
	};

	var level$1 = {
	  params: {},
	  possibleChildrenTypes: ['wall', 'railing', 'floor', 'polyfloor', 'floorplan', 'group', 'box']
	};

	var plan = {
	  params: {
	    modelDisplayName: {
	      type: 'string',
	      optional: false
	    },
	    v: {
	      type: 'number',
	      possibleValues: [1],
	      optional: false
	    }
	  },
	  possibleChildrenTypes: ['level']
	};

	var polyfloor = {
	  params: {
	    h: { // height in meters
	      type: 'number',
	      defaultValue: 0.2,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    polygon: {
	      //type: 'array-with-arrays-with-numbers',
	      type: 'array',
	      optional: false
	    },
	    hasCeiling: { // in meters
	      type: 'boolean',
	      optional: false
	    },
	    hCeiling: { // in meters
	      type: 'number',
	      optional: false
	    },
	    usage: { // in meters
	      type: 'string',
	      optional: true
	    }
	  },
	  possibleChildrenTypes: []
	};

	var railing = {
	  params: {
	    w: { // width in meters
	      type: 'number',
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    h: { // height in meters
	      type: 'number',
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      optional: false,
	      min: 0.01
	    },
	  },
	  possibleChildrenTypes: []
	};

	var wall = {
	  params: {
	    w: { // width in meters
	      type: 'number',
	      defaultValue: 0.15,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    h: { // height in meters
	      type: 'number',
	      defaultValue: 2.4,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      defaultValue: 1,
	      optional: false,
	      min: 0.01
	    },
	    baseHeight: {type: 'number', optional: true, defaultValue: 0},
	    frontHasBase: {type: 'boolean', optional: true, defaultValue: false},
	    backHasBase: {type: 'boolean', optional: true, defaultValue: false}
	  },
	  possibleChildrenTypes: ['window', 'door']
	};

	var window$1 = {
	  params: {
	    h: { // height in meters
	      type: 'number',
	      defaultValue: 1.5,
	      optional: false,
	      min: 0.01 // 1cm
	    },
	    l: { // length in meters
	      type: 'number',
	      optional: false,
	      min: 0.01
	    },
	    rowRatios: { // in meters
	      //type: 'array-with-numbers',
	      type: 'array',
	      optional: true
	    },
	    columnRatios: { // in meters
	      //type: 'array-with-arrays-with-numbers',
	      type: 'array',
	      optional: true
	    },
	    frameLength: { // in meters
	      type: 'number',
	      optional: true,
	      min: 0.01
	    },
	    frameWidth: { // in meters
	      type: 'number',
	      optional: true,
	      min: 0.01
	    },
	    y: {
	      defaultValue: 0.9,
	    }
	  },
	  possibleChildrenTypes: []
	};

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && _defineProperty) {
	    _defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	var _baseAssignValue = baseAssignValue;

	/** Used for built-in method references. */
	var objectProto$12 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty$9.call(object, key) && eq_1(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignValue = assignValue;

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      _baseAssignValue(object, key, newValue);
	    } else {
	      _assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	var _copyObject = copyObject;

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return _baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	var _createAssigner = createAssigner;

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _nativeKeysIn = nativeKeysIn;

	/** Used for built-in method references. */
	var objectProto$13 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject_1$3(object)) {
	    return _nativeKeysIn(object);
	  }
	  var isProto = _isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty$10.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeysIn = baseKeysIn;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
	}

	var keysIn_1 = keysIn;

	/**
	 * This method is like `_.assignIn` except that it accepts `customizer`
	 * which is invoked to produce the assigned values. If `customizer` returns
	 * `undefined`, assignment is handled by the method instead. The `customizer`
	 * is invoked with five arguments: (objValue, srcValue, key, object, source).
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @alias extendWith
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} sources The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 * @see _.assignWith
	 * @example
	 *
	 * function customizer(objValue, srcValue) {
	 *   return _.isUndefined(objValue) ? srcValue : objValue;
	 * }
	 *
	 * var defaults = _.partialRight(_.assignInWith, customizer);
	 *
	 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var assignInWith = _createAssigner(function(object, source, srcIndex, customizer) {
	  _copyObject(source, keysIn_1(source), object, customizer);
	});

	var assignInWith_1 = assignInWith;

	/** Used for built-in method references. */
	var objectProto$14 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

	/**
	 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
	 * of source objects to the destination object for all destination properties
	 * that resolve to `undefined`.
	 *
	 * @private
	 * @param {*} objValue The destination value.
	 * @param {*} srcValue The source value.
	 * @param {string} key The key of the property to assign.
	 * @param {Object} object The parent object of `objValue`.
	 * @returns {*} Returns the value to assign.
	 */
	function customDefaultsAssignIn(objValue, srcValue, key, object) {
	  if (objValue === undefined ||
	      (eq_1(objValue, objectProto$14[key]) && !hasOwnProperty$11.call(object, key))) {
	    return srcValue;
	  }
	  return objValue;
	}

	var _customDefaultsAssignIn = customDefaultsAssignIn;

	/**
	 * Assigns own and inherited enumerable string keyed properties of source
	 * objects to the destination object for all destination properties that
	 * resolve to `undefined`. Source objects are applied from left to right.
	 * Once a property is set, additional values of the same property are ignored.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.defaultsDeep
	 * @example
	 *
	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var defaults$1 = _baseRest(function(args) {
	  args.push(undefined, _customDefaultsAssignIn);
	  return _apply(assignInWith_1, undefined, args);
	});

	var defaults_1 = defaults$1;

	// import sceneStructure types
	function getDefaultsByType() {
	  var types = {
	    box: box,
	    cameraBookmark: cameraBookmark,
	    door: door,
	    floor: floor,
	    floorplan: floorplan,
	    group: group,
	    interior: interior,
	    level: level$1,
	    plan: plan,
	    polyfloor: polyfloor,
	    railing: railing,
	    wall: wall,
	    window: window$1
	  };

	  var typeSpecificValidations = {};

	  Object.keys(types).forEach(function(key) {
	    typeSpecificValidations[key] = {
	      params: defaults_1({}, generic.params, types[key].params),
	      possibleChildrenTypes: types[key].possibleChildrenTypes
	    };
	  });

	  return typeSpecificValidations
	}

	function applyDefaults(element3d) {
	  if (!element3d || !element3d.type) return

	  var typeSpecificDefaults = getDefaultsByType();
	  var defaultParams = typeSpecificDefaults[element3d.type].params;

	  Object.keys(defaultParams).forEach(function (key) {
	    if (!element3d[key]) {
	      // id needs to be generated hence no defaultValue
	      if (key === 'id') element3d[key] = uuid.generate();
	      // apply default value
	      else if (defaultParams[key].defaultValue !== undefined) element3d[key] = defaultParams[key].defaultValue;
	    }
	  });
	  return element3d
	}

	function removeUnknown(element3d) {
	  var knownParameters = getDefaultsByType();
	  // remove invalid types entirely
	  if (!knownParameters[element3d.type]) return

	  var params = knownParameters[element3d.type].params;
	  var possibleChildren = knownParameters[element3d.type].possibleChildrenTypes;
	  // remove invalid params
	  Object.keys(element3d).forEach(function(key) {
	    if (!params[key]) {
	      delete element3d[key];
	    }
	  });
	  // remove invalid children
	  if (element3d.children && element3d.children.length) {
	    element3d.children = element3d.children.filter(function(child) {
	      return possibleChildren.indexOf(child.type) > -1
	    });
	  }
	  return element3d
	}

	function normalizeSceneStructure(elements3d) {

	  // model structure can be a sole element or array of element
	  // make sure we return the same type
	  var inputIsArray = Array.isArray(elements3d);
	  // start recursive validation
	  var normalizedSceneStructure = normalizeElements3d(inputIsArray ? elements3d : [elements3d]);

	  return Promise.resolve(inputIsArray ? normalizedSceneStructure : normalizedSceneStructure[0])
	}

	function normalizeElements3d(input) {
	  return input.map(function(element3d) {
	    element3d = removeUnknown(element3d);
	    // recursive parsing through scene structure
	    if (element3d && element3d.children && element3d.children.length) {
	      element3d.children = normalizeElements3d(element3d.children);
	    }
	    return applyDefaults(element3d)
	  }).filter(function(element3d) {
	    return element3d !== undefined
	  })
	}

	function furnish (sceneStructure, options) {

	  var
	    modelStructure,
	    options = options || {},
	    spaceId = options.spaceId,
	    label = options.label,
	    spaceLabels = {};

	  // make sure we're having a plan and a level object
	  return normalizeInput(sceneStructure)
	    .then(function(result) {

	      // choose first space if none is specified
	      if (!spaceId) {
	        var polyfloors = result.children[0].children.filter(function(element3d) {
	          return element3d.type === 'polyfloor'
	        });
	        spaceId = polyfloors[0].id;
	      }

	      // set default space label if none provided
	      spaceLabels[spaceId] = label || 'dining_living';

	      // TODO: cleanup params after API review
	      var params = {
	        floors: spaceLabels,
	        modelStructure: result,
	        maxResults: 1,
	        tags: ['generic']
	      };

	      // do the actual home staging api call
	      return callService('Autofurnishing.furnish', { arguments: params })
	    })
	    .then(getSceneStructureFromFurnishingResult)
	    .catch(function(error) {
	      console.error('HomeStaging error:', error);
	      return bluebird_1.reject('HomeStaging failed - check console for details')
	    })
	}

	// completes sceneStructure with plan and level object
	function normalizeInput(input) {
	  if (input.type !== 'plan') {
	    if (Array.isArray(input)) {
	      if (input[0].type !== 'level') {
	        var levelId = uuid.generate();
	        input = {
	          type: "plan",
	          activeLevelId: levelId,
	          children: [{
	            type: 'level',
	            id: levelId,
	            children: input
	          }]
	        };
	      } else {
	        input = {
	          type: "plan",
	          children: input
	        };
	      }
	    } else if (input.type === 'level') {
	      input = {
	        type: "plan",
	        children: [ input ]
	      };
	    } else {
	      console.error('Furnishing failed - input is invalid:', input);
	      return bluebird_1.reject('Furnishing failed - check console for details')
	    }
	  }
	  return normalizeSceneStructure(input)
	}

	function getSceneStructureFromFurnishingResult(result) {
	  var furnishing = result.furnishings;
	  var spaceIds = Object.keys(furnishing);
	  if (!uuid.validate(spaceIds[0])) return bluebird_1.reject('No furnishings were found')

	  // get furniture groups from api result
	  var groups = furnishing[spaceIds[0]][0].groups;

	  // get normailzed sceneStructure for each furniture group
	  return bluebird_1.map(groups, getFurnitureGroupData)
	    .then(normalizeSceneStructure)
	}

	// combine data from staging API with data from furniture API
	function getFurnitureGroupData(group) {
	  var id = group.src.substring(1);
	  // get raw data from Furniture API
	  return callService('Product.read', { arguments: id})
	    .then(function(furniture) {
	      // get sceneStructure from Furniture API -> info on type and possible children
	      var sceneStructure = JSON.parse(furniture.modelStructure);
	      // combine data from both API calls to turn result into full sceneStructure
	      sceneStructure = defaults_1({}, group, sceneStructure);
	      return bluebird_1.resolve(sceneStructure)
	    })
	}

	var config = {
	  'default_margin': 0.1,
	  'default_search': 'isPublished:true -generic',
	  'tag_black_list': [
	    'simplygon',
	    'hasChangeableMaterials',
	    'autofurnish',
	    'wallAttached',
	    '2 seater',
	    '3 seater',
	    '4 seater'
	  ],
	  'tag_white_list': [
	    'shelf',
	    'armchair',
	    'sofa',
	    'plant',
	    'sideboard',
	    'coffee table',
	    'dining table',
	    'round',
	    'TV',
	    'lamps',
	    'free standing lamp',
	    'living',
	    'dining',
	    'relaxing',
	    'picture'
	  ],
	  'edgeAligned': ['sofa', 'shelf', 'armchair', 'sideboad', 'double bed', 'single bed', 'bed'],
	};

	var getAlternatives = function(id, options) {
	  if (typeof id !== 'string') return Promise.reject('invalid input')

	  options = options || {};

	  this.userQuery = options.query || null;
	  this.searchCount = 0;
	  this.margin = config['default_margin'];
	  this.furnitureInfo = null;

	  var self = this;
	  return getFurnitureInfo(id)
	    .then(function(info){
	      self.furnitureInfo = info;
	      var searchQuery = self.getQuery(self.furnitureInfo);
	      return search(searchQuery)
	    })
	    .then(function(result) {
	      return self.verifyResult(result, id)
	    })
	    .catch(function(error) {
	      console.error(error);
	    })
	};

	getAlternatives.prototype.verifyResult = function(result, id) {
	  if (this.searchCount > 10 ) {
	    return Promise.reject(new Error('No furniture was found'))
	  }
	  var rawResult = result.filter(function(el){
	    return el.productResourceId !== id
	  });
	  // if we didn't find anything in the first place
	  // let's increase dimensions a bit
	  var self = this;
	  if (rawResult.length < 1) {
	    if (this.searchCount >= 3) this.margin += 0.10;
	    var searchQuery = this.getQuery(this.furnitureInfo);
	    this.searchCount += 1;
	    return search(searchQuery)
	      .then(function(result) {
	        return self.verifyResult(result, id)
	      })
	      .catch(function(error) {
	        console.error('catch', searchQuery.query, error);
	        return Promise.reject('No alternatives were found')
	      })
	  } else {
	    var cleanResult = rawResult.map(normalizeFurnitureInfo).map(function(res) {
	      return {
	        furniture: res,
	        offset: getOffset(self.furnitureInfo, res)
	      }
	    });
	    return Promise.resolve(cleanResult)
	  }
	};

	getAlternatives.prototype.getQuery = function(info) {
	  var query = config['default_search'];
	  var tags = this.searchCount < 6 ? info.tags.concat(info.categories) : info.tags;
	  tags = tags.filter(function(tag) {
	    // removes blacklisted tags as well as 1P, 2P, ...
	    return config['tag_black_list'].indexOf(tag) < 0 && !/^\d+P$/.test(tag)
	  });
	  // remove secondary tags from query when increasing dimensions didn't work
	  if (this.searchCount > 2) {
	    tags = tags.filter(function(tag) {
	      return config['tag_white_list'].indexOf(tag) > -1
	    });
	  }

	  query += ' ' + tags.join(' ');
	  if (this.userQuery && tags.indexOf('TV') < 0) query += ' ' + this.userQuery;
	  var searchQuery = {query: query};

	  // add dimension search params if source provides dimensions
	  var dim = info.boundingBox;
	  var self = this;
	  if (dim) {
	    ['length', 'height', 'width'].forEach(function(d) {
	      if (dim[d] -self.margin > 0) {
	        searchQuery[d + 'Min'] = Math.round((dim[d] - self.margin) * 1e2) / 1e2;
	        searchQuery[d + 'Max'] = Math.round((dim[d] + self.margin) * 1e2) / 1e2;
	      }
	    });
	  }
	  return searchQuery
	};

	// helper

	function search(searchQuery) {
	  // let's make sure we don't have trailing or double spaces
	  searchQuery.query = searchQuery.query.trim().replace(/\s+/g, ' ');
	  return callService('Product.search', {searchQuery: searchQuery, limit: 200})
	}

	// get offset based on bounding boxes
	function getOffset(a, b) {
	  // for elements that are aligned at the wall we want to compute the offset accordingly
	  var edgeAligned = config.edgeAligned;

	  var tags = a.tags;
	  a = a.boundingPoints;
	  b = b.boundingPoints;
	  if (!a || !b) return {x: 0, y:0, z:0}

	  // check if the furniture's virtual origin should be center or edge
	  var isEdgeAligned = edgeAligned.some(function(t) { return tags.includes(t) });

	  var zOffset;
	  // compute offset between edges or centers
	  if (isEdgeAligned) zOffset = a.min[2] - b.min[2];
	  else zOffset = (a.max[2] + a.min[2]) / 2 - (b.max[2] + b.min[2]) / 2;

	  var offset = {
	    // compute offset between centers
	    x: (a.max[0] + a.min[0]) / 2 - (b.max[0] + b.min[0]) / 2,
	    y: 0,
	    z: zOffset
	  };
	  return offset
	}

	function getSceneStructureFromHtml(el) {
	  if (!isValidElement(el)) {
	    console.error('element is not an "a-entity" DOM element');
	  }
	  var
	    position = el.getAttribute('position'),
	    rotation = el.getAttribute('rotation'),
	    furnitureInfo = el.getAttribute('io3d-furniture'),
	    furnitureUuid = el.getAttribute('io3d-uuid'),
	    sceneStructure;

	  sceneStructure = {
	    x: position.x,
	    y: position.y,
	    z: position.z,
	    ry: rotation.y,
	    type: 'interior',
	    src: '!' + furnitureInfo.id,
	    id: furnitureUuid || uuid.generate()
	  };

	  return sceneStructure
	}


	// Returns true if it is a DOM element with nodeName a-entity
	// https://stackoverflow.com/a/384380/2835973
	function isValidElement(o){
	  return (
	    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
	      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string" && o.nodeName.toLowerCase() === 'a-entity'
	  );
	}

	// TODO: extend this for bakedModel
	var validTypes = [
	  'interior',
	  'group',
	  'level',
	  'plan'
	];

	function toHtml(sceneStructure, options) {
	  if (!sceneStructure) {
	    console.error('nothing to convert');
	    return
	  }
	  // check if the request was made by a browser
	  runtime.assertBrowser();

	  // api
	  options = options || {};
	  var isArray = Array.isArray(sceneStructure);
	  sceneStructure = isArray ? sceneStructure : [sceneStructure];

	  // start parsing
	  var html = getHtmlFromSceneStructure(sceneStructure);
	  return isArray ? html : html[0]
	}

	// recursive parsing through sceneStructre
	function getHtmlFromSceneStructure(sceneStructure, parent) {
	  var collection = parent ? null : []; // use collection or parent
	  sceneStructure.forEach(function(element3d) {
	    if (validTypes.indexOf(element3d.type) > -1) {
	      var el = addEntity({
	        attributes: getAttributes(element3d),
	        parent: parent
	      });
	      if (element3d.children && element3d.children.length) getHtmlFromSceneStructure(element3d.children, el);
	      if (collection) collection.push(el);
	    }
	  });
	  return collection
	}

	// get html attributes from element3d params
	function getAttributes(element3d) {
	  var attributes = {
	    'io3d-uuid': element3d.id,
	    position: element3d.x + ' ' + element3d.y + ' ' + element3d.z,
	    rotation: '0 ' + element3d.ry + ' 0'
	  };
	  if (element3d.type === 'interior') {
	    attributes['io3d-furniture'] = {id: element3d.src.substring(1)};
	    attributes['shadow'] = {cast: true, receive: false};
	  }

	  return attributes
	}

	function addEntity(args) {
	  var
	    tag = args.tag || 'a-entity',
	    parent = args.parent,
	    attributes = args.attributes || {};

	  var el = document.createElement(tag);

	  Object.keys(attributes).forEach(function(key) {
	    el.setAttribute(key, attributes[key]);
	  });

	  if (parent) return parent.appendChild(el)
	  else return el
	}

	// consumes sceneStructure or DOM elements
	// replaces furniture Ids and adjusts positioning
	// outputs input type
	function replaceFurniture (input, options) {

	  options = options || {};
	  var query = options.query;
	  // defaults to pick a random item from alternatives
	  var random = options.random || true;
	  var furnitureIds;

	  // check for DOM element
	  var isDomElement = isElement(input);
	  if (isDomElement) {
	    // convert to sceneStructure
	    input = getSceneStructureFromHtml(input);
	  }

	  return normalizeSceneStructure(input)
	    .then(function(sceneStructure) {
	      furnitureIds = getIdsFromSceneStructure(sceneStructure);

	      if (Object.keys(furnitureIds).length === 0) return bluebird_1.reject('No valid furniture elements were found')

	      var promises = [];
	      Object.keys(furnitureIds).forEach(function(id) {
	        promises.push(new getAlternatives(id, options));
	      });

	      return bluebird_1.all(promises)
	    })
	    .then(function(result) {
	      var alternatives = {};
	      Object.keys(furnitureIds).forEach(function(id, index) {
	        alternatives[id] = result[index];
	      });

	      // replace params in furniture elements
	      var sceneStructure = updateSceneStructureWithResult(input, alternatives, random);
	      if (isDomElement) {
	        return toHtml(sceneStructure)
	      } else return sceneStructure
	    })
	    .catch(function(error) {
	      console.error(error);
	      return bluebird_1.reject(error)
	    })
	}

	function getIdsFromSceneStructure(sceneStructure) {
	  var isArray = Array.isArray(sceneStructure);
	  sceneStructure = isArray ? sceneStructure : [sceneStructure];

	  var collection = {};
	  sceneStructure.forEach(function(element3d) {
	    // get all furniture elements = type: 'interior'
	    if (element3d.type === 'interior' && element3d.src && typeof element3d.src === 'string') collection[element3d.src.substring(1)] = true;
	    // recursively search through scene structure
	    if (element3d.children && element3d.children.length) {
	      collection = defaults_1({}, collection, getIdsFromSceneStructure (element3d.children));
	    }
	  });
	  return collection
	}

	// Returns true if it is a DOM element
	// https://stackoverflow.com/a/384380/2835973
	function isElement(o){
	  return (
	    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
	      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
	  );
	}

	function updateSceneStructureWithResult(input, alternatives, random) {
	  var
	    sceneStructure = input,
	    replacement,
	    index = 0;

	  Object.keys(alternatives).forEach(function(id) {

	    if (!alternatives[id] || !alternatives[id].length) return
	    // we the pick a random item or take the first one
	    if (random) index = Math.floor(Math.random() * alternatives[id].length);

	    replacement = alternatives[id][index];

	    sceneStructure = updateElementsById(sceneStructure, id, replacement);
	  });
	  return sceneStructure
	}

	// search by furniture id and replace params
	function updateElementsById(sceneStructure, id, replacement) {
	  var isArray = Array.isArray(sceneStructure);
	  sceneStructure = isArray ? sceneStructure : [sceneStructure];

	  sceneStructure = sceneStructure.map(function(element3d) {
	    // furniture id is stored in src param
	    if (element3d.type === 'interior' && element3d.src.substring(1) === id && replacement.furniture) {
	      // apply new id
	      element3d.src = '!' + replacement.furniture.id;
	      // compute new position for items that differ in size and mesh origin
	      var newPosition = getNewPosition(element3d, replacement.offset);
	      // apply new position
	      element3d.x = newPosition.x;
	      element3d.y = newPosition.y;
	      element3d.z = newPosition.z;
	    }
	    // recursivley search tree
	    if (element3d.children && element3d.children.length) {
	      element3d.children = updateElementsById(element3d.children, id, replacement);
	    }
	    return element3d
	  });

	  return isArray ? sceneStructure : sceneStructure[0]
	}

	// compute new position based on bounding boxes
	function getNewPosition(element3d, offset) {

	  var s = Math.sin(element3d.ry / 180 * Math.PI);
	  var c = Math.cos(element3d.ry / 180 * Math.PI);
	  var newPosition = {
	    x: element3d.x + offset.x * c + offset.z * s,
	    y: element3d.y + offset.y,
	    z: element3d.z - offset.x * s + offset.z * c
	  };
	  return newPosition
	}

	var staging = {
	  getFurnishings: furnish,
	  replaceFurniture: replaceFurniture
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
	    password: args.password || uuid.generate(),
	    accountSetup: '3dio'
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
	getSession().catch(function(error) {
	  console.warn('Session info not available: ', error);
	});

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

	// constants
	var IS_URL = new RegExp('^http:\\/\\/.*$|^https:\\/\\/.*$');
	var ID_TO_URL_CACHE = {};

	// main
	function getUrlFromStorageId (storageId, options) {

	  // API
	  options = options || {};
	  var cdn = options.cdn !== undefined ? options.cdn : true;
	  var encode = options.encode !== undefined ? options.encode : true;

	  // check cache
	  if (ID_TO_URL_CACHE[storageId + cdn + encode]) {
	    return ID_TO_URL_CACHE[storageId + cdn + encode]
	  }

	  // check if storageId is URL already
	  if (IS_URL.test(storageId)) {
	    // add to cache
	    ID_TO_URL_CACHE[ storageId + cdn + encode ] = storageId;
	    // return URL
	    return storageId
	  }

	  // internals
	  var processedStorageId = storageId;

	  // remove leading slash
	  var startsWithSlash = /^\/(.*)$/.exec(processedStorageId);
	  if (startsWithSlash) {
	    processedStorageId = startsWithSlash[1];
	  }

	  // encode storageId if containig special chars
	  if (encode && !/^[\.\-\_\/a-zA-Z0-9]+$/.test(processedStorageId)) {
	    processedStorageId = encodeURIComponent(processedStorageId);
	  }

	  // compose url
	  var url = 'https://' + (cdn ? configs.storageDomain : configs.storageDomainNoCdn) + '/' + processedStorageId;

	  // add to cache
	  ID_TO_URL_CACHE[ storageId + cdn + encode ] = url;
	  
	  return url
	}

	// main

	function getFromStorage (storageId, options) {

	  // WIP: for now, assume that this is only being used for data3d
	  options = options || {};
	  options.type = options.type || 'data3d'; // TODO: support more types
	  var queueName = options.queueName;
	  var loadingQueuePrefix = options.loadingQueuePrefix;

	  switch(options.type) {
	    case 'json':
	      // do not use queue for generic JSON requests
	      return fetch$1(getUrlFromStorageId(storageId, options)).then(function(response) { return response.json() })
	    break
	    default:
	      return loadData3d(getUrlFromStorageId(storageId), {
	        queueName: queueName,
	        loadingQueuePrefix: loadingQueuePrefix
	      })
	    break
	  }

	}

	var storage = {
	  get: getFromStorage,
	  getUrlFromStorageId: getUrlFromStorageId,
	  put: putToStorage
	};

	function getViewerUrl (args) {
	  return 'https://spaces.archilogic.com/3d/!'+args.sceneId
	}

	var ErrorCodes = {
	  OK: 0,
	  MIN_VALUE: 1,
	  MAX_VALUE: 2,
	  MISSED: 3,
	  NOT_SUPPOPRTED: 4,
	  VALUE: 5,
	  TYPE: 6,
	  CHILDREN_TYPE: 7
	};

	var typeSpecificValidations = getDefaultsByType();

	// methods

	function validateSceneStructure (elements3d) {

	  var result = {
	    isValid: true,
	    validatedSceneStructure: null,
	    warnings: [],
	    errors: []
	  };

	  // model structure can be a sole element or array of element
	  // make sure we return the same type
	  var inputIsArray = Array.isArray(elements3d);
	  // start recursive validation
	  var validatedSceneStructure = validateElements3d(result, inputIsArray ? elements3d : [elements3d]);
	  // add result to in corresponding input type
	  result.validatedSceneStructure = inputIsArray ? validatedSceneStructure : validatedSceneStructure[0];

	  return Promise.resolve(result)

	}

	function validateElements3d (result, sourceElements3d, parentType) {
	  var validatedElements3d = [];

	  sourceElements3d.forEach(function (sourceElement3d) {

	    // validate if children types are correct
	    if (parentType) {
	      var validChild = typeSpecificValidations[parentType].possibleChildrenTypes.indexOf(sourceElement3d.type) > -1;
	      if (!validChild)  {
	        result.isValid = false;
	        var message = '"' + sourceElement3d.type + '" is invalid child for "' + parentType + '"';
	        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.CHILDREN_TYPE});
	        return
	      }
	    }

	    if (!sourceElement3d || !sourceElement3d.type) {
	      // missing type param => invalid
	      result.isValid = false;
	      var message = 'Missing "type" parameter';
	      result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.TYPE});
	      return
	    } else if (!typeSpecificValidations[sourceElement3d.type]) {
	      // missing type validation (typ not supported) => invalid
	      result.isValid = false;
	      var message = 'Parameter "type" of value "'+sourceElement3d.type+'" is not supported';
	      result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.NOT_SUPPOPRTED});
	      return
	    }

	    var validatedElement3d = {};
	    var passedValidations = validateParams(result, typeSpecificValidations[sourceElement3d.type], sourceElement3d, validatedElement3d);

	    // if element passed validations...
	    if (passedValidations) {

	      // add to array
	      validatedElements3d.push(validatedElement3d);

	      // parse children
	      if (validatedElement3d.children && validatedElement3d.children.length) {
	        validatedElement3d.children = validateElements3d(result, validatedElement3d.children, validatedElement3d.type);
	      }

	    }

	  });

	  return validatedElements3d
	}

	function validateParams (result, validations, sourceElement3d, validatedElement3d) {

	  var isValid = true;

	  // iterate through param validations and copy valid params from source to validated element
	  Object.keys(validations.params).sort().forEach(function (paramName) {
	    var v = validations.params[paramName];
	    var value = sourceElement3d[paramName];

	    if (value !== undefined) {

	      // check type
	      var paramValueType = getParamValueType(value);
	      if (v.type !== paramValueType) {
	        isValid = false;
	        var message = 'Parameter "' + paramName + '" is of type "' + paramValueType + '" but should be type "' + v.type + '"';
	        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.TYPE});
	        return
	      }

	      // check if value allowed
	      if (v.possibleValues !== undefined && v.possibleValues.indexOf(value) === -1) {
	        isValid = false;
	        var message = 'Parameter "' + paramName + '" has value "' + value + '" but should be one of: ' + JSON.stringify(v.possibleValues);
	        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.VALUE});
	        return
	      }

	      // check if above min
	      if (v.min !== undefined && (v.type === 'number' && value <= v.min)) {
	        isValid = false;
	        var message = 'Parameter "' + paramName + '" has value ' + value + ' which is below allowed minimum of ' + v.min;
	        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.MIN_VALUE});
	        return
	      }

	      // check if below max
	      if (v.max !== undefined && (v.type === 'number' && value >= v.max)) {
	        isValid = false;
	        var message = 'Parameter "' + paramName + '" has value ' + value + ' which is above allowed maximum of ' + v.max;
	        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.MAX_VALUE});
	        return
	      }

	      // everything ok: assign value to validated object
	      validatedElement3d[paramName] = value;

	    } else if (!v.optional) {
	      // param not set but mandatory

	      isValid = false;
	      var message = 'Parameter "' + paramName + '" is mandatory but not set';
	      result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.MISSED});
	      return

	    }

	  });

	  // check for unexpected params
	  Object.keys(sourceElement3d).forEach(function (paramName) {
	    if (!validations.params[paramName]) {
	      var message = 'Parameter "' + paramName + '" is not supported and will be ignored';
	      result.warnings.push({message: message, item: sourceElement3d, code: ErrorCodes.NOT_SUPPOPRTED});
	    }
	  });

	  if (!isValid) result.isValid = false;
	  return isValid

	}

	function getParamValueType (value) {
	  if (Array.isArray(value)) {
	    // TODO: add support for more sophisticated array types
	    // array-with-objects, array-with-numbers, array-with-arrays-with-numbers
	    return 'array'
	  } else {
	    return typeof value
	  }
	}

	var scene = {
	  getViewerUrl: getViewerUrl,
	  validateSceneStructure: validateSceneStructure,
	  normalizeSceneStructure: normalizeSceneStructure,
	  getHtmlFromSceneStructure: toHtml
	};

	function traverseData3d$1(data3d, callback) {

	  callback(data3d);

	  if (data3d.children) for (var i=0, l=data3d.children.length; i<l; i++) traverseData3d$1(data3d.children[i], callback);

	}

	// methods

	traverseData3d$1.materials = function traverseMaterials (data3d, callback) {
	  
	  (function traverseMaterials_(data3d, callback) {

	    var material;
	    var materialKeys = data3d.materialKeys || Object.keys(data3d.materials || {});
	    for (var i = 0; i < materialKeys.length; i++) {
	      material = data3d.materials[ materialKeys[ i ] ];
	      callback(material, data3d);
	    }

	    if (data3d.children) {
	      for (var i=0, l=data3d.children.length; i<l; i++) {
	        traverseMaterials_(data3d.children[i], callback);
	      }
	    }

	  })(data3d, callback);

	};

	traverseData3d$1.meshes = function traverseMeshes (data3d, callback) {

	  (function traverseMeshes_(data3d, callback) {

	    var mesh, material;
	    var meshKeys = data3d.meshKeys || Object.keys(data3d.meshes || {});
	    for (var i = 0; i < meshKeys.length; i++) {
	      mesh = data3d.meshes[ meshKeys[ i ] ];
	      material = data3d.materials[ mesh.material ];
	      callback(mesh, material, data3d);
	    }

	    if (data3d.children) {
	      for (var i=0, l=data3d.children.length; i<l; i++) {
	        traverseMeshes_(data3d.children[i], callback);
	      }
	    }

	  })(data3d, callback);

	};

	// API

	var clone = cloneData3d$1;
	clone.withPayload = cloneData3dWithPayload;
	clone.meshes = cloneMeshes;
	clone.meshe = cloneSingleMesh;
	clone.materials = cloneMaterials;
	clone.material = cloneSingleMaterial;

	// methods

	function cloneData3d$1 (_data3d, options) {

	  var clone = {};

	  clone.meshes = cloneMeshes(_data3d.meshes, options);
	  clone.materials = cloneMaterials(_data3d.materials);

	  if (_data3d.alternativeMaterialsByMeshKey) {
	    clone.alternativeMaterialsByMeshKey = JSON.parse(JSON.stringify(_data3d.alternativeMaterialsByMeshKey));
	  }
	  if (_data3d._params) {
	    clone._params = _data3d._params;
	  }
	  if (_data3d.position) {
	    clone.position = _data3d.position.slice(0);
	  }
	  if (_data3d.rotDeg) {
	    clone.rotDeg = _data3d.rotDeg.slice(0);
	  }
	  if (_data3d.rotRad) {
	    clone.rotRad = _data3d.rotRad.slice(0);
	  }
	  if (_data3d.children) {
	    clone.children = _data3d.children.map(function (childData3d) {
	      return cloneData3d$1(childData3d, options)
	    });
	  }

	  return clone
	}

	function cloneData3dWithPayload (data3d) {
	  // payload = heavy arrays containing geometry & uv data
	  return cloneData3d$1(data3d, {
	    clonePositions: true,
	    cloneNormals: true,
	    cloneUvs: true,
	    cloneUvsLightmap: true
	  })
	}

	function cloneSingleMesh (mesh, options) {
	  return cloneMeshes({x: mesh}, options).x
	}

	function cloneMeshes (_meshes, options) {

	  if (!_meshes) {
	    return {}
	  }

	  // API
	  options = options || {};
	  var clonePositions = !!options.clonePositions;
	  var cloneNormals = !!options.cloneNormals;
	  var cloneUvs = !!options.cloneUvs;
	  var cloneUvsLightmap = !!options.cloneUvsLightmap;

	  // internals
	  var
	    meshId, _mesh, mesh,
	    meshKeys = Object.keys(_meshes),
	    meshes = {};

	  for (var i = 0, l = meshKeys.length; i < l; i++) {

	    meshId = meshKeys[i];
	    mesh = {};
	    _mesh = _meshes[meshId];

	    // vertices
	    if (_mesh.positions) {
	      if (clonePositions && (_mesh.positions instanceof Array || _mesh.positions instanceof Float32Array)) {
	        mesh.positions = _mesh.positions.slice(0);
	      } else {
	        mesh.positions = _mesh.positions;
	      }
	    }

	    // normals
	    if (_mesh.normals) {
	      if (cloneNormals && (_mesh.normals instanceof Array || _mesh.normals instanceof Float32Array)) {
	        mesh.normals = _mesh.normals.slice(0);
	      } else {
	        mesh.normals = _mesh.normals;
	      }
	    }

	    // uvs
	    if (_mesh.uvs) {
	      if (cloneUvs && (_mesh.uvs instanceof Array || _mesh.uvs instanceof Float32Array)) {
	        mesh.uvs = _mesh.uvs.slice(0);
	      } else {
	        mesh.uvs = _mesh.uvs;
	      }
	    }

	    // uvs lightmap
	    if (_mesh.uvsLightmap) {
	      if (cloneUvsLightmap && (_mesh.uvsLightmap instanceof Array || _mesh.uvsLightmap instanceof Float32Array)) {
	        mesh.uvsLightmap = _mesh.uvsLightmap.slice(0);
	      } else {
	        mesh.uvsLightmap = _mesh.uvsLightmap;
	      }
	    }

	    // other arrays
	    if (_mesh.matrix) mesh.matrix = _mesh.matrix.slice(0);
	    if (_mesh.uvMatrix) mesh.uvMatrix = _mesh.uvMatrix.slice(0);
	    if (_mesh.meshKeys) mesh.meshKeys = _mesh.meshKeys.slice(0);
	    if (_mesh.position) mesh.position = _mesh.position.slice(0);
	    if (_mesh.rotDeg) mesh.rotDeg = _mesh.rotDeg.slice(0);
	    if (_mesh.rotRad) mesh.rotRad = _mesh.rotRad.slice(0);
	    if (_mesh.scale) mesh.scale = _mesh.scale.slice(0);

	    // primitives
	    if (_mesh.v) mesh.v = _mesh.v;
	    if (_mesh.vertexMode) mesh.vertexMode = _mesh.vertexMode;
	    if (_mesh.side) mesh.side = _mesh.side;
	    if (_mesh.material) mesh.material = _mesh.material;
	    if (_mesh.visibleInPersonView) mesh.visibleInPersonView = _mesh.visibleInPersonView;
	    if (_mesh.visibleInBirdView) mesh.visibleInBirdView = _mesh.visibleInBirdView;
	    if (_mesh.visibleInFloorplanView) mesh.visibleInFloorplanView = _mesh.visibleInFloorplanView;

	    meshes[meshId] = mesh;
	  }

	  // output
	  return meshes
	}

	function cloneSingleMaterial (material) {
	  return cloneMaterials({x: material}).x
	}

	function cloneMaterials (_materials) {

	  if (!_materials) {
	    return {}
	  }

	  var materialId, _material, materials, material, materialKeys, _attributes, _attributeKeys, attributeKey, type,
	    attributes, isExtended;

	  materialKeys = Object.keys(_materials);
	  // result
	  materials = {};

	  if (materialKeys.length === 0) {
	    return {}
	  }

	  if (_materials[materialKeys[0]].attributes) {
	    isExtended = true;
	    // deep copy source
	    materials = JSON.parse(JSON.stringify(_materials));
	  } else {
	    isExtended = false;
	  }

	  for (var i = 0, l = materialKeys.length; i < l; i++) {

	    materialId = materialKeys[i];
	    _attributes = isExtended ? _materials[materialId].attributes : _materials[materialId];

	    if (typeof _attributes === 'string') {

	      if (isExtended) {
	        materials[materialId].attributes = _attributes;
	      } else {
	        materials[materialId] = _attributes;
	      }

	    } else if (_attributes) {

	      attributes = {};
	      _attributeKeys = Object.keys(_attributes);

	      for (var j = 0, k = _attributeKeys.length; j < k; j++) {
	        attributeKey = _attributeKeys[j];
	        type = typeof _attributes[attributeKey];
	        if (type === 'string' || type === 'number' || type === 'boolean') {
	          // primitive
	          attributes[attributeKey] = _attributes[attributeKey];
	        } else if (_attributes[attributeKey]) {
	          if (_attributes[attributeKey].length === 3) {
	            // color array
	            attributes[attributeKey] = [
	              _attributes[attributeKey][0],
	              _attributes[attributeKey][1],
	              _attributes[attributeKey][2]
	            ];
	          } else if (_attributes[attributeKey].length === 2) {
	            // size array
	            attributes[attributeKey] = [
	              _attributes[attributeKey][0],
	              _attributes[attributeKey][1]
	            ];
	          }
	        }
	      }

	      if (isExtended) {
	        materials[materialId].attributes = attributes;
	      } else {
	        materials[materialId] = attributes;
	      }

	    }

	  }

	  return materials

	}

	// methods

	function projectAxisY (v) {

	  var uvs = new Float32Array(v.length / 1.5);
	  var uvPos = 0;

	  var i, l;
	  for (i = 0, l = v.length; i < l; i += 9) {

	    uvs[uvPos] = v[i + 2];
	    uvs[uvPos + 1] = v[i];
	    uvs[uvPos + 2] = v[i + 5];
	    uvs[uvPos + 3] = v[i + 3];
	    uvs[uvPos + 4] = v[i + 8];
	    uvs[uvPos + 5] = v[i + 6];
	    uvPos += 6;

	  }

	  return uvs

	}
	projectAxisY.title = 'Project Top Down';

	function architectural (v) {

	  var uvs = new Float32Array(v.length / 1.5);
	  var uvPos = 0;

	  var i, l, n, components;
	  for (i = 0, l = v.length; i < l; i += 9) {

	    // calculate face normal
	    // cross product (a-b) x (c-b)
	    n = [
	      (v[i + 7] - v[i + 4]) * (v[i + 2] - v[i + 5]) - (v[i + 8] - v[i + 5]) * (v[i + 1] - v[i + 4]),
	      (v[i + 8] - v[i + 5]) * (v[i] - v[i + 3]) - (v[i + 6] - v[i + 3]) * (v[i + 2] - v[i + 5]),
	      (v[i + 6] - v[i + 3]) * (v[i + 1] - v[i + 4]) - (v[i + 7] - v[i + 4]) * (v[i] - v[i + 3])
	    ];

	    // normals should be absolute
	    if (n[0] < 0) {
	      n[0] *= -1;
	    }
	    if (n[1] < 0) {
	      n[1] *= -1;
	    }
	    if (n[2] < 0) {
	      n[2] *= -1;
	    }

	    // highest first?
	    components = [1, 0, 2].sort(function (a, b) {
	      return n[a] - n[b]
	    });

	    uvs[uvPos] = v[i + components[1]];
	    uvs[uvPos + 1] = v[i + components[0]];
	    uvs[uvPos + 2] = v[i + 3 + components[1]];
	    uvs[uvPos + 3] = v[i + 3 + components[0]];
	    uvs[uvPos + 4] = v[i + 6 + components[1]];
	    uvs[uvPos + 5] = v[i + 6 + components[0]];
	    uvPos += 6;

	  }

	  return uvs

	}
	architectural.title = 'Architectural';

	// API

	var getUvsBuffer = {
	  architectural: architectural,
	  projectAxisY: projectAxisY
	};

	var DEBUG = true;

	// methods

	function flat (v) {
	  // calculate normals for flat shading
	  var n = new Float32Array(v.length);
	  var i, l, crx, cry, crz, invScalar;
	  var hasFaultyTrigons = false;
	  for (i = 0, l = v.length; i < l; i += 9) {
	    // cross product (a-b) x (c-b)
	    crx = (v[i + 7] - v[i + 4]) * (v[i + 2] - v[i + 5]) - (v[i + 8] - v[i + 5]) * (v[i + 1] - v[i + 4]);
	    cry = (v[i + 8] - v[i + 5]) * (v[i] - v[i + 3]) - (v[i + 6] - v[i + 3]) * (v[i + 2] - v[i + 5]);
	    crz = (v[i + 6] - v[i + 3]) * (v[i + 1] - v[i + 4]) - (v[i + 7] - v[i + 4]) * (v[i] - v[i + 3]);
	    // normalize
	    invScalar = 1 / Math.sqrt(crx * crx + cry * cry + crz * crz);
	    // Fallback for trigons that don't span an area
	    if (invScalar === Infinity) {
	      invScalar = 0;
	      hasFaultyTrigons = true;
	    }
	    // set normals
	    n[i] = n[i + 3] = n[i + 6] = crx * invScalar;
	    n[i + 1] = n[i + 4] = n[i + 7] = cry * invScalar;
	    n[i + 2] = n[i + 5] = n[i + 8] = crz * invScalar;

	  }
	  if (DEBUG && hasFaultyTrigons) console.error('Geometry contains trigons that don\'t span an area.');
	  return n
	}
	flat.title = 'Flat';

	function smooth (v) {

	  // output

	  var normals = new Float32Array(v.length);

	  // internals

	  var hash, hashes = [], vertexRelatedNormals = {}, faceNormals, averageNormal;
	  var n;
	  var crx, cry, crz, invScalar;
	  var hasFaultyTrigons = false;
	  var i, l, i2, l2;

	  ////////// 1. connect vertices to faces

	  // go face by face
	  for (i = 0, l = v.length; i < l; i += 9) {

	    // calculate face normal
	    // cross product (a-b) x (c-b)
	    crx = (v[i + 7] - v[i + 4]) * (v[i + 2] - v[i + 5]) - (v[i + 8] - v[i + 5]) * (v[i + 1] - v[i + 4]);
	    cry = (v[i + 8] - v[i + 5]) * (v[i] - v[i + 3]) - (v[i + 6] - v[i + 3]) * (v[i + 2] - v[i + 5]);
	    crz = (v[i + 6] - v[i + 3]) * (v[i + 1] - v[i + 4]) - (v[i + 7] - v[i + 4]) * (v[i] - v[i + 3]);
	    // normalize
	    invScalar = 1 / Math.sqrt(crx * crx + cry * cry + crz * crz);
	    if (invScalar === Infinity) {
	      hasFaultyTrigons = true;
	      invScalar = 0;
	    }
	    // set normals
	    n = [crx * invScalar, cry * invScalar, crz * invScalar];

	    for (i2 = 0, l2 = 9; i2 < l2; i2 += 3) {
	      hash = v[i + i2] + '_' + v[i + i2 + 1] + '_' + v[i + i2 + 2];
	      if (!vertexRelatedNormals[hash]) {
	        vertexRelatedNormals[hash] = {
	          faceNormals: [n]
	        };
	        hashes[hashes.length] = hash;
	      } else {
	        vertexRelatedNormals[hash].faceNormals.push(n);
	      }
	    }
	  }

	  ////////// 2. calculate average normals from related face normals

	  var avx, avy, avz;
	  for (i = 0, l = hashes.length; i < l; i++) {
	    hash = hashes[i];
	    faceNormals = vertexRelatedNormals[hash].faceNormals;
	    avx = 0;
	    avy = 0;
	    avz = 0;
	    for (i2 = 0, l2 = faceNormals.length; i2 < l2; i2++) {
	      avx += faceNormals[i2][0];
	      avy += faceNormals[i2][1];
	      avz += faceNormals[i2][2];
	    }
	    // normalize
	    invScalar = 1 / Math.sqrt(avx * avx + avy * avy + avz * avz);
	    if (invScalar === Infinity) {
	      hasFaultyTrigons = true;
	      invScalar = 0;
	    }
	    // set average normal
	    vertexRelatedNormals[hash].averageNormal = [avx * invScalar, avy * invScalar, avz * invScalar];
	  }

	  ////////// 3. apply average normals to vertices

	  for (i = 0, l = v.length; i < l; i += 3) {
	    hash = v[i] + '_' + v[i + 1] + '_' + v[i + 2];
	    averageNormal = vertexRelatedNormals[hash].averageNormal;
	    normals[i] = averageNormal[0];
	    normals[i + 1] = averageNormal[1];
	    normals[i + 2] = averageNormal[2];
	  }

	  // return
	  if (DEBUG && hasFaultyTrigons) console.error('Shade Smooth: Geometry contains trigons that don\'t span an area.');
	  return normals

	}
	smooth.title = 'Smooth';

	// API

	var getNormalsBuffer = {
	  flat: flat,
	  smooth: smooth,
	};

	// placeholder
	function normalizeMaterials(x) { return x; }

	// API

	var consolidate = consolidateData3d;
	consolidate.meshes = consolidateMeshes;
	consolidate.materials = consolidateMaterials;

	// constants

	var IS_DEBUG_MODE = true;
	var DEG_TO_RAD = Math.PI / 180;
	var RAD_TO_DEG = 180 / Math.PI;

	// main
	function consolidateData3d(data3d, options){

	  // API
	  options = options || {};
	  var consolidateMaterialsEnabled = options.consolidateMaterials !== undefined ? options.consolidateMaterials : true;
	  var consolidateMeshesEnabled = options.consolidateMeshes !== undefined ? options.consolidateMeshes : true;
	  var el3d = options.el3d;
	  var warningCallback = options.onWarning;

	  // make clone so that we can apply changes
	  data3d = clone(data3d);

	  // support hierarchy
	  var resolvePromises = [];
	  traverseData3d$1(data3d, function(data3d){

	    // add node id
	    data3d.nodeId = el3d ? el3d.params.id : uuid.generate();

	    // add keys to data3d if not present
	    data3d.meshes = data3d.meshes || {};
	    data3d.meshKeys = data3d.meshKeys || Object.keys(data3d.meshes);
	    data3d.materials = data3d.materials || {};
	    data3d.materialKeys = data3d.materialKeys || Object.keys(data3d.materials);

	    // add params
	    if (el3d && !data3d._params) {
	      data3d._params = el3d.toObject({ recursive: false });
	    }

	    // add position
	    if (!data3d.position) {
	      if (el3d) {
	        data3d.position = [ el3d.params.x || 0, el3d.params.y || 0, el3d.params.z || 0 ];
	      } else {
	        data3d.position = [ 0, 0, 0 ];
	      }
	    }

	    // add rotation
	    if (!data3d.rotRad && !data3d.rotDeg) {
	      // both missing
	      if (el3d) {
	        data3d.rotDeg = [ el3d.params.rx || 0, el3d.params.ry || 0, el3d.params.rz || 0 ];
	      } else {
	        data3d.rotDeg = [ 0, 0, 0 ];
	      }
	      data3d.rotRad = [ data3d.rotDeg[0] * DEG_TO_RAD, data3d.rotDeg[1] * DEG_TO_RAD, data3d.rotDeg[2] * DEG_TO_RAD ];
	    } else if (!data3d.rotDeg) {
	      // only rot deg missing
	      data3d.rotDeg = [ data3d.rotRad[0] * RAD_TO_DEG, data3d.rotRad[1] * RAD_TO_DEG, data3d.rotRad[2] * RAD_TO_DEG ];
	    } else {
	      // only rot rad missing
	      data3d.rotRad = [ data3d.rotDeg[0] * DEG_TO_RAD, data3d.rotDeg[1] * DEG_TO_RAD, data3d.rotDeg[2] * DEG_TO_RAD ];
	    }

	    // add children
	    if (!data3d.children) {
	      data3d.children = [];
	    }

	    // resolve meshes
	    if (consolidateMeshesEnabled) {
	      data3d.meshes = consolidateMeshes(data3d.meshes, el3d ? el3d.params.id : null);
	      data3d.meshKeys = Object.keys(data3d.meshes);
	    }

	    // internals
	    var
	      meshes = data3d.meshes,
	      meshKeys = data3d.meshKeys,
	      materials = data3d.materials,
	      nodeId = el3d && el3d.params ? el3d.params.id : null,
	      i, l, meshId, mesh, materialId, positions, uvs, uvs2, normals, material, materialKeysHaveChanged;

	    // check meshes
	    for (i = 0, l = meshKeys.length; i < l; i++) {

	      meshId = meshKeys[ i ];
	      mesh = meshes[ meshId ];
	      materialId = mesh.material;
	      material = materials && materials[ materialId ] ? materials[ materialId ] : null;
	      positions = mesh.positions;
	      normals = mesh.normals;
	      uvs = mesh.uvs;
	      uvs2 = mesh.uvsLightmap;

	      // mesh position
	      if (!mesh.position) {
	        mesh.position = [ 0,0,0 ];
	      }

	      // mesh rotation
	      if (!mesh.rotRad && !mesh.rotDeg) {
	        // both missing
	        mesh.rotDeg = [ 0,0,0 ];
	        mesh.rotRad = [ 0,0,0 ];
	      } else if (!mesh.rotDeg) {
	        // only rot deg missing
	        mesh.rotDeg = [ mesh.rotRad[0] * RAD_TO_DEG, mesh.rotRad[1] * RAD_TO_DEG, mesh.rotRad[2] * RAD_TO_DEG ];
	      } else {
	        // only rot rad missing
	        mesh.rotRad = [ mesh.rotDeg[0] * DEG_TO_RAD, mesh.rotDeg[1] * DEG_TO_RAD, mesh.rotDeg[2] * DEG_TO_RAD ];
	      }

	      // mesh scale
	      if (!mesh.scale) {
	        mesh.scale = [ 1,1,1 ];
	      }

	      // mesh in relation to material
	      if (material) {

	        // check if material with texture has UVs
	        if (
	          materialHasTexture(material) &&
	          (mesh.uvs === undefined || mesh.uvs.length === 0)
	        ) {
	          // generate fallback UVs
	          if (IS_DEBUG_MODE) console.error('Mesh with material "'+materialId+'" has texture(s) has no UVs. Fallback to architectural UV mapping.');
	          if (warningCallback) warningCallback('Mesh with material "'+materialId+'" has texture(s) has no UVs. Fallback to architectural UV mapping.');
	          mesh.uvs = getUvsBuffer.architectural(mesh.positions);
	        }

	        // check if material with lightmap has lightmap uvs
	        if (
	          (material.mapLight || material.mapLightPreview) &&
	          (mesh.uvsLightmap === undefined || mesh.uvsLightmap.length === 0)
	        ) {
	          // delete texture references as we can not generate lightmap fallbacks
	          if (IS_DEBUG_MODE) console.error('Mesh with material "'+materialId+'" has lightmap has no lightmap UVs. Lightmap will be ignored.');
	          if (warningCallback) warningCallback('Mesh with material "'+materialId+'" has lightmap has no lightmap UVs. Lightmap will be ignored.');
	          delete material.mapLight;
	          delete material.mapLightPreview;

	        }

	        // create fallback material
	      } else {
	        if (materialId) {
	          console.error('Node:'+nodeId+' Material by ID "' + materialId + '" not found.', materials);
	          if (warningCallback) warningCallback('Material by ID "' + materialId + '" not found.');
	        } else {
	          materialId = getShortId();
	          mesh.material = materialId;
	        }
	        materials[ materialId ] = {
	          colorDiffuse: [0.85,0.85,0.85]
	        };
	        materialKeysHaveChanged = true;
	      }

	    }

	    // regenerate material keys if needed
	    if (materialKeysHaveChanged) {
	      data3d.materialKeys = Object.keys(materials);
	    }

	    // resolve materials
	    if (consolidateMaterialsEnabled) {

	      resolvePromises.push(
	        consolidateMaterials(data3d.materials).then(function(materials){
	          data3d.materials = normalizeMaterials(materials);
	          return data3d
	        })
	      );

	    } else {

	      data3d.materials = normalizeMaterials(data3d.materials);
	      resolvePromises.push(Promise.resolve(data3d));

	    }

	  });

	  return Promise.all(resolvePromises).then(function(){
	    return data3d
	  })

	}

	// helpers

	function materialHasTexture(m) {
	  return m.mapDiffuse ||
	    m.mapSpecular ||
	    m.mapNormal ||
	    m.mapAlpha ||
	    m.mapDiffusePreview ||
	    m.mapSpecularPreview ||
	    m.mapNormalPreview ||
	    m.mapAlphaPreview
	}

	function consolidateMaterials(_materials){

	  // TODO: introduce bundled calls to material API to request multiple materials in one call

	  var promiseKeys = [];
	  var promises = [];
	  var materialKeys = _materials ? Object.keys(_materials) : [];
	  var materialKey;
	  var i, l;
	  // result
	  var materials = {};

	  if (!materialKeys.length) {
	    return Promise.resolve(materials)
	  }

	  var isExtended = (materialKeys.length && _materials[ materialKeys[0] ].attributes);

	  // process
	  for (i= 0, l=materialKeys.length; i<l; i++) {
	    materialKey = materialKeys[i];

	    // shallow clone material
	    if (isExtended) {
	      materials[ materialKey ] = _materials[ materialKey ].attributes;
	    } else {
	      materials[ materialKey ] = _materials[ materialKey ];
	    }

	    // convert material ids to attributes
	    if (typeof materials[ materialKey ] === 'string') {
	      if (materials[ materialKey ][0] === '#') {
	        // is hex color definition: convert to rgb
	        materials[ materialKey ] = {
	          colorDiffuse: hexToRgb(materials[ materialKey ])
	        };
	      } else {
	        // is global id: get attributes from registry
	        promiseKeys[ promiseKeys.length ] = materialKey;
	        promises[ promises.length ] = api.call('Material.get', materials[ materialKey ]);
	      }
	    }

	  }

	  if (promiseKeys.length === 0) {

	    return Promise.resolve(normalizeMaterials(materials))

	  } else {

	    return Promise.all(promises).then(function(resolvedMaterials){

	      // replace resolved materials
	      for (i= 0, l=promiseKeys.length; i<l; i++) {
	        materials[ promiseKeys[ i ] ] = resolvedMaterials[ i ].attributes;
	      }

	      return normalizeMaterials(materials)

	    })

	  }

	}
	  
	function consolidateMeshes (meshes, nodeId){
	    
	    if (!meshes) {

	      return meshes

	    } else {

	      // internals
	      var
	        meshKeys = Object.keys(meshes),
	        i, l, mesh;

	      for (i = 0, l = meshKeys.length; i < l; i++) {
	        mesh = meshes[ meshKeys[ i ] ];

	        // check if positions are defined
	        if (mesh.positions === undefined || mesh.positions.length === 0) {
	          delete meshes[ meshKeys[ i ] ];
	          continue
	        }
	        // check type
	        else if (!(mesh.positions instanceof Float32Array)) {
	          // convert to float array if needed
	          if (mesh.positions instanceof Array) {
	            mesh.positions = new Float32Array(mesh.positions);
	          }
	          // type not supported
	          else {
	            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position vertices must be of type Float32Array or Array. Mesh will be ignored', mesh.position);
	            delete meshes[ meshKeys[ i ] ];
	            continue
	          }
	        }
	        // check if multiple of 9
	        if (mesh.positions.length/9 % 1 !== 0) {
	          if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Invalid position vertices count: ' + mesh.positions.length + '. Has to be multiple of 9. Mesh will be ignored.');
	          delete meshes[ meshKeys[ i ] ];
	          continue
	        }

	        // check if normals are defined
	        if (mesh.normals === undefined || mesh.normals.length === 0) {
	          mesh.normals = getNormalsBuffer.flat(mesh.positions);
	        }
	        // check if normal generation method exists
	        else if (typeof mesh.normals === 'string') {
	          if (getNormalsBuffer[ mesh.normals ]) {
	            // generate normals
	            mesh.normals = getNormalsBuffer[ mesh.normals ](mesh.positions);
	          } else {
	            // unknown shading method. fallback to flat
	            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Unknown normal shading method "' + mesh.normals + '". Fallback to flat shading.');
	            mesh.normals = getNormalsBuffer.flat(mesh.positions);
	          }
	        }
	        // check type
	        else if (!(mesh.normals instanceof Float32Array)) {
	          // convert to float array if needed
	          if (mesh.normals instanceof Array) {
	            mesh.normals = new Float32Array(mesh.normals);
	          }
	          // type not supported
	          else {
	            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Normal vertices should be of type Float32Array or Array. Fallback to flat shading.', mesh.normals);
	            mesh.normals = getNormalsBuffer.flat(mesh.positions);
	          }
	        }
	        // check count
	        if (mesh.normals.length !== mesh.positions.length) {
	          if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position vertices and normal vertices count has to be the same. Fallback to flat Shading. ', mesh.normals.length, mesh.normals.length);
	          mesh.normals = getNormalsBuffer.flat(mesh.positions);
	        }

	        // check uvs channel 1
	        if (mesh.uvs) {
	          // defined as string
	          if (typeof mesh.uvs === 'string') {
	            // check if uv generation method exists
	            if (getUvsBuffer[ mesh.uvs ]) {
	              // generate uvs
	              mesh.uvs = getUvsBuffer[ mesh.uvs ](mesh.positions);
	            } else {
	              // unknown mapping method. fallback to architectural
	              if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Unknown UV1 mapping method "' + mesh.uvs + '". Fallback to architectural UV mapping.');
	              mesh.uvs = getUvsBuffer.architectural(mesh.positions);
	            }
	          }
	          // check type
	          else if (!(mesh.uvs instanceof Float32Array)) {
	            // convert to float32array if needed
	            if (mesh.uvs instanceof Array) {
	              mesh.uvs = new Float32Array(mesh.uvs);
	            }
	            // mesh uvs not of supported type
	            else {
	              if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' UV Vertices should be of type Float32Array or Array. Fallback to architectural UV mapping.', mesh.uvs);
	              mesh.uvs = getUvsBuffer.architectural(mesh.positions);
	            }
	          }
	          // check length
	          if (mesh.uvs.length && mesh.uvs.length * 1.5 !== mesh.positions.length) {
	            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position Vertices and UV vertices count not in ratio of 3:2. Fallback to architectural UV mapping. ', mesh.positions.length, mesh.uvs.length);
	            mesh.uvs = getUvsBuffer.architectural(mesh.positions);
	          }
	        }

	        // check uvs channel 2
	        if (mesh.uvsLightmap && mesh.uvsLightmap.length && mesh.uvs.length * 1.5 !== mesh.positions.length) {
	          if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position Vertices and Lightmap UV Vertices count not in ratio of 3:2.', mesh.positions.length, mesh.uvs.length);
	          delete mesh.uvsLightmap;
	        }

	      }

	      return meshes

	    }
	  }

	// function

	function wait(duration, passThroughValue) {
	  return new bluebird_1(function (resolve, reject) {
	    setTimeout(function(){
	      resolve(passThroughValue);
	    }, duration);
	  })
	}

	function fetchImage (url) {
		return new bluebird_1(function (resolve, reject) {

			var img = document.createElement('img');
			img.crossOrigin = 'Anonymous';

			img.onload = function () {
				resolve(img);
			};

			var triedWithCacheBust = false;
			img.onerror = function () {
				if(triedWithCacheBust) {
					reject('Error loading image ' + url);
				} else {
					// try again with cache busting to avoid things like #1510
					triedWithCacheBust = true;
					img.src = ( url.indexOf('?') > -1 ? '&' : '&' ) + 'cacheBust=' + new Date().getTime();
				}
			};

			// initiate image loading
			img.src = url;

		})
	}

	// settings

	var DEFAULT_MAX_WIDTH = 2048;
	var DEFAULT_MAX_HEIGHT = 2048;

	// main

	function scaleDownImage (input, options) {
	  runtime.assertBrowser();

	  // API
	  options = options || {};
	  var maxWidth = options.maxWidth || DEFAULT_MAX_WIDTH;
	  var maxHeight = options.maxHeight || DEFAULT_MAX_HEIGHT;
	  var powerOfTwo = !!options.powerOfTwo;

	  // run
	  return new bluebird_1(function(resolve, reject){

	    // internals
	    var canvas;
	    var scale;
	    var result;
	    var originalWidth = input.width;
	    var originalHeight = input.height;

	    // convert original image size to power of two before scaling
	    // because pixelPerfect algorithm allows only one dimensional scaling
	    var makePowerOfTwo = powerOfTwo && !(checkPowerOfTwo$1(originalWidth) && checkPowerOfTwo$1(originalHeight));
	    if (makePowerOfTwo) {
	      originalWidth = getNearestPowerOfTwo(originalWidth);
	      originalHeight = getNearestPowerOfTwo(originalHeight);
	    }

	    // cap width and height to max
	    var width = Math.min(originalWidth, maxWidth);
	    var height = Math.min(originalHeight, maxHeight);

	    // scale down smaller size
	    if (originalWidth < originalHeight) {
	      width = height * (originalWidth / originalHeight);
	    } else {
	      height = width * (originalHeight / originalWidth);
	    }

	    // normalize input
	    canvas = getCanvas(input, originalWidth, originalHeight);

	    // scale if needed
	    scale = width / originalWidth;
	    if (scale < 1) {
	      // scale image
	      result = downScaleCanvas(canvas, width / originalWidth);
	    } else {
	      // nothing to scale
	      result = canvas;
	    }

	    resolve(result);

	  })
	}

	// helpers

	function checkPowerOfTwo$1 (value) {
	  return ( value & ( value - 1 ) ) === 0 && value !== 0
	}

	function getNearestPowerOfTwo (n) {
	  // next best power of two
	  var l = Math.log(n) / Math.LN2;
	  return Math.pow(2, Math.round(l))
	}

	function getCanvas(input, width, height) {
	  var canvas = document.createElement('canvas');
	  canvas.width = width;
	  canvas.height = height;
	  var context = canvas.getContext('2d');
	  // add filled white background, otherwise transparent png image areas turn black
	  context.fillStyle="#FFFFFF";
	  context.fillRect(0,0,width,height);
	  context.drawImage(input, 0, 0, width, height);
	  return canvas
	}

	// scales the canvas by (float) scale < 1
	// returns a new canvas containing the scaled image.
	function downScaleCanvas(cv, scale) {
	  if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
	  scale = normaliseScale(scale);
	  var tBuffer = new Float32Array(3 * cv.width * cv.height); // temporary buffer Float32 rgb
	  var sqScale = scale * scale; // square scale =  area of a source pixel within target
	  var sw = cv.width; // source image width
	  var sh = cv.height; // source image height
	  var tw = Math.floor(sw * scale); // target image width
	  var th = Math.floor(sh * scale); // target image height
	  var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
	  var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
	  var tX = 0, tY = 0; // rounded tx, ty
	  var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
	  // weight is weight of current source point within target.
	  // next weight is weight of current source point within next target's point.
	  var crossX = false; // does scaled px cross its current px right border ?
	  var crossY = false; // does scaled px cross its current px bottom border ?
	  var sBuffer = cv.getContext('2d').getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
	  var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b

	  for (sy = 0; sy < sh; sy++) {
	    ty = sy * scale; // y src position within target
	    tY = 0 | ty;     // rounded : target pixel's y
	    yIndex = 3 * tY * tw;  // line index within target array
	    crossY = (tY !== (0 | ( ty + scale )));
	    if (crossY) { // if pixel is crossing botton target pixel
	      wy = (tY + 1 - ty); // weight of point within target pixel
	      nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
	    }
	    for (sx = 0; sx < sw; sx++, sIndex += 4) {
	      tx = sx * scale; // x src position within target
	      tX = 0 |  tx;    // rounded : target pixel's x
	      tIndex = yIndex + tX * 3; // target pixel index within target array
	      crossX = (tX !== (0 | (tx + scale)));
	      if (crossX) { // if pixel is crossing target pixel's right
	        wx = (tX + 1 - tx); // weight of point within target pixel
	        nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
	      }
	      sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
	      sG = sBuffer[sIndex + 1];
	      sB = sBuffer[sIndex + 2];
	      if (!crossX && !crossY) { // pixel does not cross
	        // just add components weighted by squared scale.
	        tBuffer[tIndex    ] += sR * sqScale;
	        tBuffer[tIndex + 1] += sG * sqScale;
	        tBuffer[tIndex + 2] += sB * sqScale;
	      } else if (crossX && !crossY) { // cross on X only
	        w = wx * scale;
	        // add weighted component for current px
	        tBuffer[tIndex    ] += sR * w;
	        tBuffer[tIndex + 1] += sG * w;
	        tBuffer[tIndex + 2] += sB * w;
	        // add weighted component for next (tX+1) px
	        nw = nwx * scale;
	        tBuffer[tIndex + 3] += sR * nw;
	        tBuffer[tIndex + 4] += sG * nw;
	        tBuffer[tIndex + 5] += sB * nw;
	      } else if (!crossX && crossY) { // cross on Y only
	        w = wy * scale;
	        // add weighted component for current px
	        tBuffer[tIndex    ] += sR * w;
	        tBuffer[tIndex + 1] += sG * w;
	        tBuffer[tIndex + 2] += sB * w;
	        // add weighted component for next (tY+1) px
	        nw = nwy * scale;
	        tBuffer[tIndex + 3 * tw    ] += sR * nw;
	        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
	        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
	      } else { // crosses both x and y : four target points involved
	        // add weighted component for current px
	        w = wx * wy;
	        tBuffer[tIndex    ] += sR * w;
	        tBuffer[tIndex + 1] += sG * w;
	        tBuffer[tIndex + 2] += sB * w;
	        // for tX + 1; tY px
	        nw = nwx * wy;
	        tBuffer[tIndex + 3] += sR * nw;
	        tBuffer[tIndex + 4] += sG * nw;
	        tBuffer[tIndex + 5] += sB * nw;
	        // for tX ; tY + 1 px
	        nw = wx * nwy;
	        tBuffer[tIndex + 3 * tw    ] += sR * nw;
	        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
	        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
	        // for tX + 1 ; tY +1 px
	        nw = nwx * nwy;
	        tBuffer[tIndex + 3 * tw + 3] += sR * nw;
	        tBuffer[tIndex + 3 * tw + 4] += sG * nw;
	        tBuffer[tIndex + 3 * tw + 5] += sB * nw;
	      }
	    } // end for sx
	  } // end for sy

	  // create result canvas
	  var resCV = document.createElement('canvas');
	  resCV.width = tw;
	  resCV.height = th;
	  var resCtx = resCV.getContext('2d');

	//    var imgRes = resCtx.getImageData(resCV.width/2 - tw/2, resCV.height/2 - th/2, tw, th);
	  var imgRes = resCtx.getImageData(0, 0, tw, th);
	  var tByteBuffer = imgRes.data;
	  // convert float32 array into a UInt8Clamped Array
	  var pxIndex = 0; //
	  for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
	    tByteBuffer[tIndex] = 0 | ( tBuffer[sIndex]);
	    tByteBuffer[tIndex + 1] = 0 | (tBuffer[sIndex + 1]);
	    tByteBuffer[tIndex + 2] = 0 | (tBuffer[sIndex + 2]);
	    tByteBuffer[tIndex + 3] = 255;
	    // set back temp buffer
	    tBuffer[sIndex] = 0;
	    tBuffer[sIndex + 1] = 0;
	    tBuffer[sIndex + 2] = 0;
	  }

	  // writing result to canvas.
	  resCtx.putImageData(imgRes, 0, 0);
	  return resCV;

	}

	function log2$1(v) {
	  // taken from http://graphics.stanford.edu/~seander/bithacks.html
	  var b =  [ 0x2, 0xC, 0xF0, 0xFF00, 0xFFFF0000 ];
	  var S =  [1, 2, 4, 8, 16];
	  var i=0, r=0;

	  for (i = 4; i >= 0; i--) {
	    if (v & b[i])  {
	      v >>= S[i];
	      r |= S[i];
	    }
	  }
	  return r;
	}

	// normalize a scale <1 to avoid some rounding issue with js numbers
	function normaliseScale(s) {
	  if (s>1) throw('s must be <1');
	  s = 0 | (1/s);
	  var l = log2$1(s);
	  var mask = 1 << l;
	  var accuracy = 4;
	  while(accuracy && l) { l--; mask |= 1<<l; accuracy--; }
	  return 1 / ( s & mask );
	}

	function getDefaultFilename () {
	  var d = new Date();
	  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
	    + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + getShortId()
	}

	function getBlobFromCanvas (canvas, options) {
	  runtime.assertBrowser();

	  // API
	  options = options || {};
	  var mimeType = options.mimeType || 'image/jpeg'; // can be: 'image/jpeg' or 'image/png'
	  var quality = options.quality || 98;
	  var fileName = options.fileName || getDefaultFilename() + (mimeType === 'image/jpeg' ? '.jpg' : '.png');

	  // run
	  return new bluebird_1(function (resolve, reject) {
	    canvas.toBlob(function (blob) {
	      blob.name = fileName;
	      resolve(blob);
	    }, mimeType, quality);
	  })

	}

	var FILE_READ_METHODS = {
	  undefined: 'readAsText',
	  text: 'readAsText',
	  dataUrl: 'readAsDataURL',
	  binaryString: 'readAsBinaryString',
	  arrayBuffer: 'readAsArrayBuffer'
	};

	function readFile(blob, type) {
	  runtime.assertBrowser();
	  
	  return new Promise(function(resolve, reject){
	    var fileReader = new window.FileReader();
	    fileReader.onload = function (e) {
	      // IE 11 requires this
	      // http://stackoverflow.com/a/32665193/2835973
	      resolve(fileReader.content || fileReader.result);
	    };
	    fileReader.onerror = function (err){
	      reject(err);
	    };
	    // start reading file
	    fileReader[ FILE_READ_METHODS[type] ](blob);
	  })
	}

	function fetchModule (url) {
	  runtime.assertBrowser('Please use "require()" to fetch modules in server environment.');

	  // module wrapper
	  window.___modules = window.___modules || {};

	  // return module if it has been loaded already
	  if (window.___modules[url]) {
	    return Promise.resolve(window.___modules[url])

	  } else {
	  // load code and use module wrapper
	    return fetch$1(url).then(function(response){
	      return response.text()
	    }).then(function(code){

	      // check module type
	      var moduleWrapper;
	      if (code.indexOf('define(function()') > -1) {
	        // AMD
	        moduleWrapper = code+'\nfunction define(cb){ window.___modules["'+url+'"] = cb(); };';
	      } else {
	        // CommonJS
	        moduleWrapper = 'window.___modules["'+url+'"] = (function(){ var exports = {}, module = {exports:exports};'+code+'\nreturn module.exports\n})()';
	      }

	      var script = document.createElement('script');
	      try {
	        script.appendChild(document.createTextNode(moduleWrapper));
	        document.body.appendChild(script);
	      } catch (e) {
	        script.text = moduleWrapper;
	        document.body.appendChild(script);
	      }
	      return window.___modules[url]
	    })

	  }

	}

	// dependencies

	var TARGA_PARSER_LIB = 'https://cdn.rawgit.com/archilogic-com/roBrowser/e4b5b53a/src/Loaders/Targa.js';

	// main

	function getImageFromFile (file, options) {

	  // API
	  options = options || {};
	  var format = options.format;

	  // FIXME get image from blob based on format (to also support DDS, PDF, DXF...)
	  // at the moment we assume that blob is JPG or PNG

	  var fileName = file.name;
	  var type = fileName ? fileName.split('.').pop().toLowerCase() : 'jpg';

	  if (type === 'jpg' || type === 'jpeg' || type === 'jpe' || type === 'png') {
	    return getImageFromJpgOrPngFile(file)

	  } else if (type === 'tga') {
	    return getImageFromTga(file)

	  } else {
	    return bluebird_1.reject('Image of type '+type+' not supported')

	  }

	}

	// methods

	function getImageFromJpgOrPngFile (file) {
	  var filename = file.name;
	  return new bluebird_1(function(resolve, reject){

	    var image = new Image();
	    var urlCreator = window.URL || window.webkitURL;
	    var imageUrl = urlCreator.createObjectURL(file);

	    // event handlers
	    image.onload = function () {
	      urlCreator.revokeObjectURL(imageUrl);
	      resolve(image);
	    };
	    image.onerror = function (error) {
	      urlCreator.revokeObjectURL(imageUrl);
	      console.error('Error converting image: ' + filename, error);
	      reject('Error converting image: ' + filename);
	    };

	    // initiate loading process
	    image.src = imageUrl;

	  })
	}

	function getImageFromTga (file) {
	  return fetchModule(TARGA_PARSER_LIB).then(function(Targa){
	    return readFile(file, 'arrayBuffer').then(function(buffer){
	      return new bluebird_1(function(resolve, reject){

	        var
	          targa = new Targa(),
	          image = new Image();

	        // add event handlers to image
	        image.onload = function () {
	          resolve(image);
	        };
	        image.onerror = function (error) {
	          console.error('Error converting image: ' + file.name, error);
	          reject('Error converting image: ' + file.name);
	        };

	        // buffer -> targa
	        targa.load(new Uint8Array(buffer));
	        // targa -> image
	        image.src = targa.getDataURL();

	      })
	    })
	  })
	}

	// main

	function getTextureSet (input) {

	  // internals
	  var result = {
	    loRes: null,
	    source: null,
	    dds: null
	  };

	  // normalize input
	  return getSourceCanvasFromInput(input).then(function (sourceCanvas) {

	    // TODO: readd back hash based optimizations (should happen on server)

	    return bluebird_1.all([
	      // generate loRes texture localy and upload it
	      getLoResCanvas(sourceCanvas).then(getBlobFromCanvas).then(putToStorage).then(function (previewStorageId) {
	        // loRes texture uploaded and ready for use
	        result.loRes = previewStorageId;
	      }),
	      // upload source texture...
	      getBlobFromCanvas(sourceCanvas).then(putToStorage).then(function (sourceStorageId) {
	        // ... to have it ready for server side processing
	        result.source = sourceStorageId;
	        // ... like DDS conversion (or baking)
	        return requestDdsConversion(sourceStorageId).then(function (processingId) {
	          // we know the future DDS storageId but will not wait for conversion being done
	          // TODO: future DDS file storageId should be fetched from status file using processingId (same as baking)
	          result.dds = sourceStorageId.replace('.jpg', '.hi-res.gz.dds');
	        })
	      })
	    ])

	  }).then(function () {

	    return result

	  })

	}

	// private methods

	function getSourceCanvasFromInput (input) {
	  // input can be url, img, canvas or file
	  return bluebird_1.resolve().then(function () {
	    if (typeof input === 'string') {
	      // infoCallback('Loading image '+file.name)
	      return fetchImage(input)
	    } else if (input instanceof Blob) {
	      // infoCallback('Reading image '+file.name)
	      return getImageFromFile(input)
	    } else {
	      return input
	    }
	  }).then(function (canvas) {
	    // infoCallback(file.name + ' - Generating source texture file')
	    // return canvas
	    return scaleDownImage(canvas, {
	      powerOfTwo: false,
	      maxWidth: 2048,
	      maxHeight: 2048
	    })
	  })
	}

	function getLoResCanvas (sourceCanvas) {
	  //infoCallback(file.name + ' - Generating lo-res texture file')
	  return scaleDownImage(sourceCanvas, {
	    powerOfTwo: true,
	    maxWidth: 256,
	    maxHeight: 256
	  })
	}

	function requestDdsConversion (sourceStorageId) {
	  sourceStorageId = sourceStorageId.substring(1);
	  return callService('Processing.task.enqueue', {
	    method: 'convertImage',
	    params: {
	      inputFileKey: sourceStorageId,
	      options: {
	        outputFormat: 'dds',
	        outputDirectory: path.parse(sourceStorageId).dir
	      }
	    }
	  })
	}

	// main

	var getData3dFromThreeJs = checkDependencies({
	  three: true,
	  aframe: false
	}, function () {

	  return function getData3d(object3d) {
	    
	    // returns data3d when a minimal texture is ready:
	    // - source textures for server side processing
	    // - loRes textures for rendering
	    var texturePromises = [];

	    // internals
	    var data3d = { meshes: {}, materials: {} };(function traverseThreeSceneGraph (threeObject3D) {

	      threeObject3D.updateMatrixWorld();

	      if (threeObject3D.geometry) {

	        var threeGeometry = threeObject3D.geometry;

	        // ensure buffer geometry
	        if (threeGeometry.type.indexOf('BufferGeometry') === -1) {
	          threeGeometry = new THREE.BufferGeometry().fromGeometry(threeGeometry);
	        }

	        if (threeGeometry.index) {
	          if (threeGeometry.attributes.color) {
	            translateIndexedBufferGeometryWithColor(data3d, threeObject3D);
	          } else {
	            translateIndexedBufferGeometry(data3d, threeObject3D, texturePromises);
	          }
	        } else {
	          translateNonIndexedBufferGeometry(data3d, threeObject3D, texturePromises);
	        }

	      }

	      // parse children
	      threeObject3D.children.forEach(function(child){
	        traverseThreeSceneGraph(child);
	      });

	    })(object3d);

	    return bluebird_1.all([
	      consolidate(data3d),
	      bluebird_1.all(texturePromises)
	    ]).then(function(results){
	      // return data3d
	      return results[0]
	    })

	  }
	});

	// helpers

	function translateSceneGraph (data3dMesh, threeObject3D) {
	  var p = threeObject3D.getWorldPosition();
	  var r = threeObject3D.getWorldRotation();
	  var s = threeObject3D.getWorldScale();
	  data3dMesh.position = [p.x, p.y, p.z];
	  data3dMesh.rotRad = [r.x, r.y, r.z];
	  data3dMesh.scale = [s.x, s.y, s.z];
	}


	function translateNonIndexedBufferGeometry (data3d, threeObject3D, texturePromises) {

	  // mesh
	  var threeGeometry = threeObject3D.geometry;
	  // create data3d mesh
	  var data3dMesh = data3d.meshes[threeObject3D.uuid] = {};
	  // positions
	  data3dMesh.positions = threeGeometry.attributes.position.array;
	  // normals
	  if (threeGeometry.attributes.normal) data3dMesh.normals = threeGeometry.attributes.normal.array;
	  // uvs
	  if (threeGeometry.attributes.uv) data3dMesh.uvs = threeGeometry.attributes.uv.array;

	  // material
	  translateMaterial(data3d, data3dMesh, threeObject3D, threeObject3D.material, texturePromises);

	  // scene graph
	  translateSceneGraph(data3dMesh, threeObject3D);

	}

	function translateIndexedBufferGeometry (data3d, threeObject3D, texturePromises) {

	  var threeGeometry = threeObject3D.geometry;
	  // create data3d mesh
	  var data3dMesh = data3d.meshes[threeObject3D.uuid] = {};

	  var index = threeGeometry.index.array;
	  var i = 0, l = threeGeometry.index.array.length;

	  // translate positions
	  var pIn = threeGeometry.attributes.position.array;
	  var pOut = new Float32Array(l * 3);
	  for (i = 0; i < l; i++) {
	    pOut[i * 3] = pIn[index[i] * 3];
	    pOut[i * 3 + 1] = pIn[index[i] * 3 + 1];
	    pOut[i * 3 + 2] = pIn[index[i] * 3 + 2];
	  }
	  data3dMesh.positions = pOut;

	  // translate normals
	  if (threeGeometry.attributes.normal) {
	    var nIn = threeGeometry.attributes.normal.array;
	    var nOut = new Float32Array(l * 3);
	    for (i = 0; i < l; i++) {
	      nOut[i * 3] = nIn[index[i] * 3];
	      nOut[i * 3 + 1] = nIn[index[i] * 3 + 1];
	      nOut[i * 3 + 2] = nIn[index[i] * 3 + 2];
	    }
	    data3dMesh.normals = nOut;
	  }

	  // translate uvs
	  if (threeGeometry.attributes.uv) {
	    var uvIn = threeGeometry.attributes.uv.array;
	    var uvOut = new Float32Array(l * 2);
	    for (i = 0; i < l; i++) {
	      nOut[i * 2] = nIn[index[i] * 2];
	      nOut[i * 2 + 1] = nIn[index[i] * 2 + 1];
	    }
	    data3dMesh.normals = nOut;
	  }

	  // material
	  var threeMaterial = threeObject3D.material;
	  translateMaterial(data3d, data3dMesh, threeObject3D, threeObject3D.material, texturePromises);

	  // scene graph
	  translateSceneGraph(data3dMesh, threeObject3D);

	}

	function translateIndexedBufferGeometryWithColor (data3d, threeObject3D) {

	  var colorMap = {};

	  var threeGeometry = threeObject3D.geometry;

	  var index = threeGeometry.index.array;
	  var colors = threeGeometry.attributes.color.array;
	  var colorSize = threeGeometry.attributes.color.itemSize;
	  var defaultOpacity = colorSize === 3 ? 1 : null; // null because we will extract opacity from color array while parsing it
	  var i = 0, l = threeGeometry.index.array.length, materialId;

	  var color, colorKey, opacity;
	  // build color map & create materials (loop over index face by face)
	  for (i = 0; i < l; i+=3) {
	    // get color of first vertex
	    color = [colors[index[i] * colorSize], colors[index[i] * colorSize + 1], colors[index[i] * colorSize + 2]];
	    opacity = defaultOpacity || colors[index[i] * colorSize + 3];
	    colorKey = color.join('-') + '-' + opacity;

	    // .itemSize of faces
	    if (colorMap[colorKey]) {
	      colorMap[colorKey].faceCount++;
	    } else {
	      materialId = getShortId();
	      colorMap[colorKey] = {
	        faceCount: 1,
	        materialId: materialId
	      };
	      // create material
	      data3d.materials[ materialId ] = {
	        colorDiffuse: color,
	        opacity: opacity
	      };
	    }
	  }

	  // create arrays & meshes
	  Object.keys(colorMap).forEach(function(key, i){
	    // create arrays
	    colorMap[key].positions = new Float32Array(colorMap[key].faceCount * 9);
	    colorMap[key].positionIndex = 0;
	    if (threeGeometry.attributes.normal) {
	      colorMap[key].normals = new Float32Array(colorMap[key].faceCount * 9);
	      colorMap[key].normalIndex = 0;
	    }
	    // create data3d mesh
	    var meshId = getShortId();
	    var data3dMesh = data3d.meshes[meshId] = {
	      positions: colorMap[key].positions,
	      normals: colorMap[key].normals,
	      material: colorMap[key].materialId
	    };
	    // scene graph
	    translateSceneGraph(data3dMesh, threeObject3D);
	  });
	  
	  // fill arrays: translate positions and normals (loop over index face by face)
	  var pOut, pOutI, pIn = threeGeometry.attributes.position.array,
	    nOut, nOutI, nIn = threeGeometry.attributes.normal.array;
	  for (i = 0; i < l; i+=3) {
	    // get color of this face (use first vertex)
	    color = [colors[index[i] * colorSize], colors[index[i] * colorSize + 1], colors[index[i] * colorSize + 2]];
	    opacity = defaultOpacity || colors[index[i] * colorSize + 3];
	    colorKey = color.join('-') + '-' + opacity;

	    // get output array for positions
	    pOut = colorMap[colorKey].positions;
	    pOutI = colorMap[colorKey].positionIndex;
	    // vertex 1
	    pOut[pOutI]     = pIn[index[i] * 3];
	    pOut[pOutI + 1] = pIn[index[i] * 3 + 1];
	    pOut[pOutI + 2] = pIn[index[i] * 3 + 2];
	    // vertex 1
	    pOut[pOutI + 3] = pIn[index[i + 1] * 3];
	    pOut[pOutI + 4] = pIn[index[i + 1] * 3 + 1];
	    pOut[pOutI + 5] = pIn[index[i + 1] * 3 + 2];
	    // vertex 1
	    pOut[pOutI + 6] = pIn[index[i + 2] * 3];
	    pOut[pOutI + 7] = pIn[index[i + 2] * 3 + 1];
	    pOut[pOutI + 8] = pIn[index[i + 2] * 3 + 2];
	    // move index
	    colorMap[colorKey].positionIndex += 9;

	    // get output array for normals
	    if (nIn) {
	      nOut = colorMap[colorKey].normals;
	      nOutI = colorMap[colorKey].normalIndex;
	      // vertex 1
	      nOut[nOutI]     = nIn[index[i] * 3];
	      nOut[nOutI + 1] = nIn[index[i] * 3 + 1];
	      nOut[nOutI + 2] = nIn[index[i] * 3 + 2];
	      // vertex 1
	      nOut[nOutI + 3] = nIn[index[i + 1] * 3];
	      nOut[nOutI + 4] = nIn[index[i + 1] * 3 + 1];
	      nOut[nOutI + 5] = nIn[index[i + 1] * 3 + 2];
	      // vertex 1
	      nOut[nOutI + 6] = nIn[index[i + 2] * 3];
	      nOut[nOutI + 7] = nIn[index[i + 2] * 3 + 1];
	      nOut[nOutI + 8] = nIn[index[i + 2] * 3 + 2];
	      // move index
	      colorMap[colorKey].normalIndex += 9;
	    }

	  }

	  return data3d

	}

	function translateMaterial (data3d, data3dMesh, threeObject3D, threeMaterial, texturePromises) {

	  // create data3d material
	  var data3dMaterial = data3d.materials[threeMaterial.uuid] = {};
	  // link data3d mesh with material
	  data3dMesh.material = threeMaterial.uuid;

	  // material attributes

	  translateMaterialNumericValues([
	    // three attribs -> data3d attribs
	    ['opacity', 'opacity'],
	    ['specularCoef', 'shininess'],
	  ], threeMaterial, data3dMaterial);

	  translateMaterialColors([
	    // three attribs -> data3d attribs
	    ['color', 'colorDiffuse'],
	    ['specular', 'colorSpecular'],
	    ['emissive', 'colorEmissive']
	  ], threeMaterial, data3dMaterial);

	  translateMaterialTextures([
	    // three attribs -> data3d attribs
	    ['map', 'mapDiffuse'],
	    ['specularMap', 'mapSpecular'],
	    ['normalMap', 'mapNormal'],
	    ['alphaMap', 'mapAlpha']
	  ], threeMaterial, data3dMaterial, texturePromises);

	}

	function translateMaterialNumericValues(attribMap, threeMaterial, data3dMaterial) {

	  attribMap.forEach(function(attribs){
	    var threeName = attribs[0], data3dName = attribs[1];
	    // translate material numeric values from three.js to data3d
	    if (threeMaterial[threeName] !== undefined) data3dMaterial[data3dName] = threeMaterial[threeName];
	  });

	}

	function translateMaterialColors(attribMap, threeMaterial, data3dMaterial) {

	  attribMap.forEach(function(attribs){
	    var threeName = attribs[0], data3dName = attribs[1];
	    // translate material colors from three.js to data3d
	    if (threeMaterial[threeName]) data3dMaterial[data3dName] = [
	      threeMaterial[threeName].r, threeMaterial[threeName].g, threeMaterial[threeName].b
	    ];
	  });

	}

	function translateMaterialTextures(attribMap, threeMaterial, data3dMaterial, texturePromises) {

	  attribMap.forEach(function(attribs){
	    // translate texture from three.js to data3d
	    var threeAttribName = attribs[0];
	    var data3dAttribName = attribs[1];

	    // if not compressed get textures from threejs material:
	    var isNonCompressedImage = threeMaterial[threeAttribName] && threeMaterial[threeAttribName].image && !threeMaterial[threeAttribName].isCompressedTexture;
	    if (isNonCompressedImage) {

	      var image = threeMaterial[threeName].image;
	      texturePromises.push(
	        getTextureSet(image).then(function (result) {
	          // add texture keys to data3d
	          data3dMaterial[data3dName + 'Preview'] = result.loRes;
	          data3dMaterial[data3dName + 'Source'] = result.source;
	          data3dMaterial[data3dName] = result.dds;
	        })
	      );

	    } else {
	      // fallback to data from data3dMaterial (if available)
	      var hasOriginalData3dMaterial = threeMaterial.userData && threeMaterial.userData.data3dMaterial && threeMaterial.userData.data3dMaterial[data3dAttribName];
	      if (hasOriginalData3dMaterial) {
	        var originalData3dMaterial = threeMaterial.userData.data3dMaterial;
	        data3dMaterial[data3dAttribName+'Preview'] = originalData3dMaterial[data3dAttribName+'Preview'];
	        data3dMaterial[data3dAttribName+'Source'] = originalData3dMaterial[data3dAttribName+'Source'];
	        data3dMaterial[data3dAttribName] = originalData3dMaterial[data3dAttribName];
	      }
	    }

	  });

	}

	// API

	var gzip = {
	  inflate: inflate,
	  inflateFile: inflateFile,
	  deflate: deflate,
	  deflateFile: deflateFile
	};

	// internals

	var PAKO_LIB = {
	  deflate: {
	    url: 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js',
	    module: 'pako/deflate'
	  },
	  inflate: {
	    url: 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_inflate.min.js',
	    module: 'pako/inflate'
	  }
	};

	// methods

	function inflate (input) {
	  return loadInflateLib().then(function (pakoInflate) {
	    return pakoInflate.ungzip(input)
	  })
	}

	function inflateFile (gzippedFile) {
	  return loadInflateLib().then(function (pakoInflate) {
	    return readFile(gzippedFile, 'arrayBuffer')
	      .then(pakoInflate.ungzip)
	      .then(function(arrayBuffer){
	        var file = new Blob([ arrayBuffer ], { type: getMimeTypeFromFileName(gzippedFile.name) });
	        // remove '.gz.' tag from filename
	        if (gzippedFile.name) {
	          file.name = gzippedFile.name.replace('.gz.','.');
	        }
	        return file
	      })
	  })
	}

	function deflate (input) {
	  return loadDeflateLib().then(function (pakoDeflate) {
	    return pakoDeflate.gzip(input)
	  })
	}

	function deflateFile (file) {
	  return loadDeflateLib().then(function (pakoDeflate) {
	    return readFile(file, 'arrayBuffer')
	      .then(pakoDeflate.gzip)
	      .then(function(arrayBuffer){
	        var gzippedFile = new Blob([ arrayBuffer ], { type: 'application/x-gzip' });
	        // add '.gz.' tag to filename
	        if (file.name) {
	          gzippedFile.name = file.name.replace('.','.gz.');
	        }
	        return gzippedFile
	      })
	  })
	}

	// helpers

	function loadDeflateLib () {
	  return runtime.isBrowser ? fetchModule(PAKO_LIB.deflate.url) : Promise.resolve(require(PAKO_LIB.deflate.module))
	}

	function loadInflateLib () {
	  return runtime.isBrowser ? fetchModule(PAKO_LIB.inflate.url) : Promise.resolve(require(PAKO_LIB.inflate.module))
	}

	// config

	var FILE_EXTENSION = '.data3d.buffer';
	var HEADER_BYTE_LENGTH$1 = 16;
	var MAGIC_NUMBER$1 = 0x41443344; // AD3D encoded as ASCII characters in hex
	var VERSION$1 = 1;

	// main

	function encodeBinary (data3d, options) {

	  // API
	  options = options || {};
	  var createFile = options.createFile !== undefined ? options.createFile : true;
	  var gzipFile = options.gzipFile !== undefined ? options.gzipFile : true;
	  var filename = options.filename || getDefaultFilename() + FILE_EXTENSION;
	  
	  // internals
	  var result = {
	    buffer: null,
	    file: null,
	    warnings: []
	  };
	  var resultingPromise;
	  
	  // add correct ending
	  if (filename.substring( filename.length - FILE_EXTENSION.length ) !== FILE_EXTENSION) filename += FILE_EXTENSION;
	  
	  // decouple heavy arrays from data3d and store them in dataArrays
	  
	  var payloadArrays = [];
	  var payloadLength = 0;
	  var meshes, meshKeys, i, l, array, mesh;
	  var arrayNames = ['positions', 'normals', 'uvs', 'uvsLightmap']; // heavy arrays
	  var _data3d = clone(data3d);
	  traverseData3d$1( _data3d, function(data3d){
	    meshes = data3d.meshes;
	    meshKeys = data3d.meshKeys || Object.keys(meshes);
	    for (i=0, l=meshKeys.length; i<l; i++) {
	      mesh = meshes[ meshKeys[i] ];
	      arrayNames.forEach(function(name){
	        array = mesh[name];
	        if (array) {
	          if (array.length) {
	            // remember offset and length
	            mesh[name + 'Offset'] = payloadLength;
	            mesh[name + 'Length'] = array.length;
	            // increase overall offset
	            payloadLength += array.length;
	            payloadArrays[payloadArrays.length] = array;
	          }
	          // delete heavy array in structure
	          delete mesh[name];
	        }
	      });
	    }
	  });
	  var payloadByteLength = payloadLength * 4;
	  
	  // create structure
	  
	  var structure = {
	    version: VERSION$1,
	    data3d: _data3d
	  };
	  
	  // serialize structure
	  
	  var structureString = JSON.stringify( structure, function(key, value) {
	    if (value instanceof  Float32Array) {
	      // make typed array look like normal array json (otherwise the will look like objects)
	      return Array.apply([], value)
	    } else {
	      return value
	    }
	  });
	  var structureByteLength = structureString.length * 2;
	  // byte length has to be a multiple of four! adding one string if it is not
	  // http://stackoverflow.com/questions/7372124/why-is-creating-a-float32array-with-an-offset-that-isnt-a-multiple-of-the-eleme
	  if (!isMultipleOf(structureByteLength, 4)) {
	    structureString += ' ';
	    structureByteLength += 2;
	  }
	  
	  // create file buffer
	  
	  var fileBuffer = new ArrayBuffer( HEADER_BYTE_LENGTH$1 + structureByteLength + payloadByteLength );
	  
	  // write structure data into file buffer
	  
	  var structureArray = new Uint16Array( fileBuffer, HEADER_BYTE_LENGTH$1, structureByteLength / 2 );
	  for (i = 0, l = structureString.length; i < l; i++) {
	    structureArray[i] = structureString.charCodeAt(i);
	  }
	  
	  // write payload into file buffer
	  
	  var payloadByteOffset = HEADER_BYTE_LENGTH$1 + structureByteLength;
	  var payloadArray = new Float32Array( fileBuffer, payloadByteOffset, payloadByteLength / 4 );
	  var payloadPointer = 0;
	  for (i = 0, l = payloadArrays.length; i < l; i++) {
	    array = payloadArrays[i];
	    payloadArray.set( array, payloadPointer );
	    payloadPointer += array.length;
	  }
	  
	  // write file header
	  
	  var fileHeaderArray = new Int32Array( fileBuffer, 0, HEADER_BYTE_LENGTH$1 / 4 );
	  // magic number
	  fileHeaderArray[0] = MAGIC_NUMBER$1;
	  // version number
	  fileHeaderArray[1] = VERSION$1;
	  // structure length
	  fileHeaderArray[2] = structureByteLength;
	  // payload length
	  fileHeaderArray[3] = payloadByteLength;
	  
	  result.buffer = fileBuffer;
	  
	  if (createFile && !gzipFile) {
	  
	    var file = new Blob([ new DataView(fileBuffer) ], { type: 'application/octet-stream' });
	    file.name = filename;
	    result.file = file;
	  
	  } else if (createFile && gzipFile) {
	  
	    resultingPromise = gzip.deflate(fileBuffer)
	      .then(function (zippedArray) {
	        var file = new Blob([ zippedArray ], { type: 'application/x-gzip' });
	        file.name = filename.replace('.', '.gz.');
	        result.file = file;
	        return result
	      });
	  
	  }
	  
	  // make sure that output is a promise
	  if (!resultingPromise) {
	    resultingPromise = bluebird_1.resolve(result);
	  }
	  
	  // return result
	  return resultingPromise.then(function(){
	    return createFile ? result.file : result.buffer
	  })

	}

	// helpers

	function isMultipleOf (value, multiple) {
	  return Math.ceil(value / multiple) === value / multiple
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

	function addCacheBustToQuery (url) {
	  var cacheBust = '___cacheBust='+Date.now();
	  if (url.indexOf('?') > -1) {
	    // url has query: append cache bust
	    url = url.replace('?','?'+cacheBust+'&');
	  } else if (url.indexOf('#') > -1) {
	    // url has no query but hash: prepend cache bust to hash tag
	    url = url.replace('#', '?'+cacheBust+'#');
	  } else {
	    // no query and no hash tag: add cache bust
	    url = url + '?' + cacheBust;
	  }
	  return url
	}

	function checkIfFileExists (url) {
	  return fetch$1(
	    addCacheBustToQuery(url),
	    {
	      method: 'HEAD',
	      cache: 'reload'
	    }
	  ).then(function onSuccess(){
	    return true
	  }, function onReject(){
	    return false
	  })
	}

	function getTextureKeys (data3d, options) {

	  // API
	  var options = options || {};
	  var filter = options.filter;

	  // internals
	  var cache = {};

	  // internals
	  traverseData3d$1.materials(data3d, function(material) {

	    var filteredResult, attr, type, format, value;
	    for (var i=0, l=ATTRIBUTES.length; i<l; i++) {

	      attr = ATTRIBUTES[i];
	      value = material[attr];

	      // apply filter function if specified in options
	      if (filter) {
	        // provide info on type and format of texture to the filter function
	        type = ATTRIBUTE_TO_TYPE[attr];
	        format = ATTRIBUTE_TO_FORMAT[attr];
	        value = filter(value, type, format, material, data3d);
	      }

	      if (value) cache[value] = true;

	    }

	  });

	  return Object.keys(cache)

	}

	// constants

	var ATTRIBUTES = [
	  'mapDiffuse',
	  'mapDiffusePreview',
	  'mapDiffuseSource',
	  // specular
	  'mapSpecular',
	  'mapSpecularPreview',
	  'mapSpecularPreview',
	  // normal
	  'mapNormal',
	  'mapNormalPreview',
	  'mapNormalPreview',
	  // alpha
	  'mapAlpha',
	  'mapAlphaPreview',
	  'mapAlphaPreview',
	];

	var ATTRIBUTE_TO_TYPE = {
	  // diffuse
	  mapDiffuse: 'diffuse',
	  mapDiffusePreview: 'diffuse',
	  mapDiffuseSource: 'diffuse',
	  // specular
	  mapSpecular: 'specular',
	  mapSpecularPreview: 'specular',
	  mapSpecularPreview: 'specular',
	  // normal
	  mapNormal: 'normal',
	  mapNormalPreview: 'normal',
	  mapNormalPreview: 'normal',
	  // alpha
	  mapAlpha: 'alpha',
	  mapAlphaPreview: 'alpha',
	  mapAlphaPreview: 'alpha',
	};

	var ATTRIBUTE_TO_FORMAT = {
	  // loRes
	  mapDiffusePreview: 'loRes',
	  mapSpecularPreview: 'loRes',
	  mapNormalPreview: 'loRes',
	  mapAlphaPreview: 'loRes',
	  // source
	  mapDiffuseSource: 'source',
	  mapSpecularSource: 'source',
	  mapNormalSource: 'source',
	  mapAlphaSource: 'source',
	  // dds
	  mapDiffuse: 'dds',
	  mapSpecular: 'dds',
	  mapNormal: 'dds',
	  mapAlpha: 'dds',
	};

	/*
	input: data3d or storageId to a data3d file
	returns promise
	 */

	function whenHiResTexturesReady (input) {

	  // resolves when hi-res textures are available
	  // - DXT (DDS) for hires on desktop
	  // - PVRTC for iOS (not yet implemented)
	  // - ETC1 for Android (not yet implemented)

	  return normalizeInput$2(input).then(function (data3d) {

	    var values = getTextureKeys(data3d, {
	      filter: function (value, type, format, material, data3d) {
	        return format === 'dds' ? value : null
	      }
	    });

	    return Promise.all(values.map(pollTexture))

	  })

	}

	// helpers

	function normalizeInput$2(input) {
	  var inputType = typeof input;
	  if (inputType === 'string') {
	    // load data3d from URL
	    return loadData3d(input)
	  } else if (input instanceof Blob) {
	    // decode binary data3d
	    return decodeBinary(input)
	  } else if (inputType === 'object') {
	    // data3d object
	    return Promise.resolve(input)
	  } else {
	    return Promise.reject('Unknown param type')
	  }
	}

	// poll for DDS storageIds

	function pollTexture(val) {

	  // normalize input to URL
	  var url = getUrlFromStorageId(val);

	  return poll(function (resolve, reject, next) {

	    checkIfFileExists(url).then(function(exists){
	      exists ? resolve() : next();
	    });

	  })

	}

	// main

	/*
	 input: dom selector referencing aframe element, file, array of files, three.js Object3D
	 returns storageId
	 */
	function publish(input) {

	  return normalizeInput$1(input)
	    .then(encodeBinary)
	    .then(putToStorage)

	}

	// public methods

	publish.whenHiResTexturesReady = whenHiResTexturesReady;

	// private methods

	/*
	 input: dom selector referencing aframe element, file, array of files, three.js Object3D
	 returns data3d
	 */
	function normalizeInput$1(input) {

	  if (typeof input === 'string') {

	    if (input[0] === '#' || input === 'a-scene') {
	      // selector
	      return getData3dFromThreeJs(document.querySelector(input).object3D)

	    } else {
	      // url
	      return fetch(input).then(function(response){
	        return response.blob()
	      }).then(getData3dFromFiles)
	    }

	  } else if (Array.isArray(input) || input instanceof Blob) {
	    // files
	    return getData3dFromFiles(input)

	  } else if (typeof input === 'object' && input.isObject3D) {
	    // three.js object
	    return getData3dFromThreeJs(input)

	  } else {
	    // not supported
	    throw new Error('Unknown input param')
	  }
	}

	/*
	input: file or array of files
	returns data3d
	 */
	function getData3dFromFiles(files) {

	  // TODO: implement
	  if (!Arrray.isArray(files)) files = [files];
	  return Promise.reject('Importing files is not supported yet')

	}

	function convertFloorPlanToBasic3dModel (args) {

	  // API
	  var floorPlan = args.floorPlan;
	  var address = args.address;
	  var callback = args.callback;

	  // send request to server side endpoint
	  return callService('FloorPlan.convertToBasic3dModel', {
	    floorplan: floorPlan,
	    address: address,
	    callback: callback
	  }).then(function onSuccess (result) {
	    // conversion request accepted
	    return result.conversionId
	  }).catch(function onError (error) {
	    // conversion request error
	    // TODO: provide info in debug mode
	    return bluebird_1.reject(error)
	  })

	}

	function getConversionStatus (args) {

	  // API
	  var conversionId = args.conversionId;

	  // send request to server side endpoint
	  return callService('FloorPlan.getConversionStatus', {
	    conversionId: conversionId
	  }).catch(function onError (error) {
	    // conversion request error
	    // TODO: provide info in debug mode
	    return bluebird_1.reject(error)
	  })

	}

	function recognize (args) {
	  var el = typeof args === 'string' ? document.querySelector(args) : null;

	  var url, width, height, pixelsPerMeter;

	  if (el) {
	    // get floor plan image date info from aframe element
	    url = el.attributes.src.value;
	    width = el.attributes.width.value;
	    height = el.attributes.height.value;

	    // TODO: fetch image directly to make sure we get it
	    var texture = el.components.material.material.map.image;
	    pixelsPerMeter = getPixelPerMeterRatio(texture.width, texture.height, width, height);

	  } else {
	    return
	    // TODO: add option for user provided arguments & fetch image to get dimensions
	    /*
	    url = args.url
	    width = args.width
	    height = args.height
	    */
	  }

	  var args = {
	    colorCoded: false,
	    floorPlanUrl: url,
	    pixelsPerMeter: pixelsPerMeter,
	    colorCoded: true
	  };

	  return callService('Recognizer.recognize', {arguments: args})
	    .then(function(result) {
	      // normalize scene structure to add ids and default values
	      return normalizeSceneStructure(result.planStructure)
	    })
	    .catch(function(error) {
	      console.error('Recognition error:', error);
	      return Promise.reject('Recognition failed - check console for details')
	    })
	}

	function getPixelPerMeterRatio(pxWidth, pxHeight, width, height) {

	  // from pixels
	  var areaPx2 = pxWidth * pxHeight; //this.getPixelArea()

	  // from input
	  var areaM2 = width * height; //parseFloat(this.$distanceInput.val())

	  var pixelPerMeterRatio = Math.sqrt(areaPx2 / areaM2);

	  return pixelPerMeterRatio
	}

	var floorPlan = {
	  convertToBasic3dModel: convertFloorPlanToBasic3dModel,
	  getConversionStatus: getConversionStatus,
	  recognize: recognize
	};

	// main

	function getBakeResult (processingId) {

	  return poll(function(resolve, reject, next){

	    var url = 'https://storage-nocdn.3d.io/' + processingId;

	    fetch$1(url).then(function(response) {
	      return response.json()
	    }).then(function(message){
	      var status = message.params.status;

	      if (status === 'ERROR') {
	        reject(message.params.data);
	      } else if (status === 'SUCCESS') {
	        resolve(message.params.data);
	      } else {
	        next();
	      }

	    });
	  })

	}

	// main

	function bake (storageId, options) {

	  // API
	  options = options || {};
	  var sunDirection = sunDirection || [0.7487416646324341, -0.47789104947352223, -0.45935396425474223];

	  // internals
	  var assetStorageIds = [];
	  // TODO: reimplement caching mechanism on server side
	  var cacheKey = null;

	  console.log('Baking file: https://spaces.archilogic.com/3d/?mode=sdk&file='+storageId);

	  return callService('Processing.task.enqueue', {
	    method: 'bakePreview',
	    params: {
	      inputFileKey: storageId,
	      options: {
	        inputAssetKeys: assetStorageIds,
	        sunDirection: sunDirection,
	        cacheKey: cacheKey
	      }
	    }
	  })

	}

	// public methods

	bake.whenDone = getBakeResult;

	var light = {
	  bake: bake
	};

	var css = ".io3d-message-list {\n  z-index: 100001;\n  position: fixed;\n  top: 0;\n  left: 50%;\n  margin-left: -200px;\n  width: 400px;\n  font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;\n  font-weight: normal;\n  letter-spacing: 1px;\n  line-height: 1.3;\n  text-align: center;\n}\n.io3d-message-list .message {\n  display: block;\n  opacity: 0;\n}\n.io3d-message-list .message .spacer {\n  display: block;\n  height: 10px;\n}\n.io3d-message-list .message .text {\n  display: inline-block;\n  padding: 10px 12px 10px 12px;\n  border-radius: 3px;\n  color: white;\n  font-size: 18px;\n}\n.io3d-message-list .message .text a {\n  color: white;\n  text-decoration: none;\n  padding-bottom: 0px;\n  border-bottom: 2px solid white;\n}\n.io3d-message-list .message .neutral {\n  background: rgba(0, 0, 0, 0.9);\n}\n.io3d-message-list .message .success {\n  background: linear-gradient(50deg, rgba(35, 165, 9, 0.93), rgba(102, 194, 10, 0.93));\n}\n.io3d-message-list .message .warning {\n  background: linear-gradient(50deg, rgba(165, 113, 9, 0.93), rgba(194, 169, 10, 0.93));\n}\n.io3d-message-list .message .error {\n  background: linear-gradient(50deg, rgba(165, 9, 22, 0.93), rgba(194, 56, 10, 0.93));\n}\n.io3d-overlay {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  z-index: 100000;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;\n  font-weight: 200;\n  font-size: 18px;\n  letter-spacing: 1px;\n  color: white;\n  text-align: center;\n  line-height: 1.3;\n  background: linear-gradient(70deg, rgba(20, 17, 34, 0.96), rgba(51, 68, 77, 0.96));\n}\n@-webkit-keyframes overlay-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes overlay-fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes overlay-fade-out {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@keyframes overlay-fade-out {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.io3d-overlay .centered-content {\n  display: inline-block;\n  position: relative;\n  top: 50%;\n  text-align: left;\n}\n.io3d-overlay .centered-content .button {\n  margin-right: 4px;\n  margin-top: 1.5em;\n}\n.io3d-overlay .bottom-container {\n  width: 100%;\n  display: block;\n  position: absolute;\n  bottom: 1em;\n}\n.io3d-overlay .bottom-container .bottom-content {\n  display: inline-block;\n  position: relative;\n  margin-left: auto;\n  margin-right: auto;\n  text-align: left;\n  color: rgba(255, 255, 255, 0.35);\n}\n.io3d-overlay .bottom-container .bottom-content .clickable {\n  cursor: pointer;\n  -webkit-transition: color 500ms;\n  transition: color 500ms;\n}\n.io3d-overlay .bottom-container .bottom-content .clickable:hover {\n  color: white;\n}\n.io3d-overlay .bottom-container .bottom-content a {\n  color: rgba(255, 255, 255, 0.35);\n  text-decoration: none;\n  -webkit-transition: color 500ms;\n  transition: color 500ms;\n}\n.io3d-overlay .bottom-container .bottom-content a:hover {\n  color: white;\n}\n@-webkit-keyframes content-slide-in {\n  0% {\n    -webkit-transform: translateY(-40%);\n  }\n  100% {\n    -webkit-transform: translateY(-50%);\n  }\n}\n@keyframes content-slide-in {\n  0% {\n    transform: translateY(-40%);\n  }\n  100% {\n    transform: translateY(-50%);\n  }\n}\n@-webkit-keyframes content-slide-out {\n  0% {\n    -webkit-transform: translateY(-50%);\n  }\n  100% {\n    -webkit-transform: translateY(-40%);\n  }\n}\n@keyframes content-slide-out {\n  0% {\n    transform: translateY(-50%);\n  }\n  100% {\n    transform: translateY(-40%);\n  }\n}\n.io3d-overlay h1 {\n  margin: 0 0 0.5em 0;\n  font-size: 42px;\n  font-weight: 200;\n  color: white;\n}\n.io3d-overlay p {\n  margin: 1em 0 0 0;\n  font-size: 18px;\n  font-weight: 200;\n}\n.io3d-overlay .hint {\n  position: relative;\n  margin: 1em 0 0 0;\n  color: rgba(255, 255, 255, 0.35);\n  font-size: 18px;\n  font-weight: 200;\n}\n.io3d-overlay .hint a {\n  color: rgba(255, 255, 255, 0.35);\n  text-decoration: none;\n  -webkit-transition: color 600ms;\n  transition: color 600ms;\n}\n.io3d-overlay .hint a:hover {\n  color: white;\n}\n.io3d-overlay .button {\n  cursor: pointer;\n  display: inline-block;\n  color: rgba(255, 255, 255, 0.35);\n  width: 40px;\n  height: 40px;\n  line-height: 32px;\n  border: 2px solid rgba(255, 255, 255, 0.35);\n  border-radius: 50%;\n  text-align: center;\n  font-size: 18px;\n  font-weight: 200;\n  -webkit-transition: opacity 300ms, color 300ms;\n  transition: opacity 300ms, color 300ms;\n}\n.io3d-overlay .button:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n  color: white;\n  border: 2px solid white;\n}\n.io3d-overlay .button-highlighted {\n  color: white;\n  border: 2px solid white;\n}\n.io3d-overlay .close-button {\n  display: block;\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  font-size: 18px;\n  font-weight: 200;\n}\n.io3d-overlay input,\n.io3d-overlay select,\n.io3d-overlay option,\n.io3d-overlay textarea {\n  font-family: Gill Sans, Gill Sans MT, Calibri, sans-serif;\n  font-size: 24px;\n  font-weight: normal;\n  letter-spacing: 1px;\n  outline: none;\n  margin: 0 0 0 0;\n  color: white;\n}\n.io3d-overlay select,\n.io3d-overlay option,\n.io3d-overlay input:not([type='checkbox']):not([type='range']) {\n  padding: 0.2em 0 0.4em 0;\n  width: 100%;\n  line-height: 20px;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border-radius: 0px;\n  border: 0px;\n  background: transparent;\n  border-bottom: 2px solid rgba(255, 255, 255, 0.3);\n  -webkit-transition: border-color 1s;\n  transition: border-color 1s;\n}\n.io3d-overlay select:focus,\n.io3d-overlay option:focus,\n.io3d-overlay input:not([type='checkbox']):not([type='range']):focus {\n  border-color: white;\n}\n.io3d-overlay textarea {\n  display: box;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  padding: 0.2em 0 0.4em 0;\n  min-width: 100%;\n  max-width: 100%;\n  line-height: 26px;\n  border: 0px;\n  background: rgba(255, 255, 255, 0.08);\n  border-bottom: 2px solid rgba(255, 255, 255, 0.3);\n}\n.io3d-overlay input[type='checkbox'] {\n  position: relative;\n  height: 20px;\n  vertical-align: bottom;\n  margin: 0;\n}\n.io3d-overlay .reveal-api-key-button {\n  cursor: pointer;\n  position: absolute;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 2px;\n  bottom: 0.7em;\n  padding: 0.1em 0.2em 0.2em 0.2em;\n  line-height: 20px;\n  -webkit-transition: color 600ms;\n  transition: color 600ms;\n}\n.io3d-overlay .reveal-api-key-button:hover {\n  color: white;\n}\n.io3d-overlay a {\n  color: white;\n  text-decoration: none;\n}\n.io3d-overlay .key-menu {\n  position: relative;\n  margin: 3em 0 0 0;\n}\n.io3d-overlay .key-menu .key-image {\n  width: 172px;\n  height: 127px;\n}\n.io3d-overlay .key-menu .key-button {\n  position: absolute;\n  left: 156px;\n  height: 36px;\n  line-height: 36px;\n  background: rgba(255, 255, 255, 0.1);\n  cursor: pointer;\n  padding: 0 14px 0 14px;\n  border-radius: 2px;\n  -webkit-transition: background 300ms linear;\n  transition: background 300ms linear;\n}\n.io3d-overlay .key-menu .key-button:hover {\n  background: rgba(255, 255, 255, 0.3);\n}\n.io3d-overlay .key-menu .go-to-publishable-api-key-ui {\n  top: 11px;\n}\n.io3d-overlay .key-menu .go-to-secret-api-key-ui {\n  bottom: 11px;\n}\n.io3d-overlay .regegenerate-secret-key-button {\n  cursor: pointer;\n}\n.io3d-overlay .publishable-api-keys .list {\n  max-height: 50vh;\n  overflow: auto;\n  padding: 0 15px 0 0;\n}\n.io3d-overlay .publishable-api-keys .list .key-item {\n  position: relative;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 3px;\n  margin-bottom: 12px;\n  padding: 4px 5px 3px 8px;\n}\n.io3d-overlay .publishable-api-keys .list .key {\n  font-weight: 200 !important;\n  border-bottom: 0 !important;\n  margin-bottom: 0 !important;\n  padding: 0 !important;\n}\n.io3d-overlay .publishable-api-keys .list .domains {\n  margin: 0 0 0 0 !important;\n}\n.io3d-overlay .publishable-api-keys .list .button {\n  position: absolute !important;\n  margin: 0 !important;\n  background-repeat: no-repeat;\n  background-position: center;\n  color: white;\n  opacity: 0.5;\n}\n.io3d-overlay .publishable-api-keys .list .button:hover {\n  opacity: 1;\n}\n.io3d-overlay .publishable-api-keys .list .delete-key-button {\n  right: 8px;\n  top: 9px;\n}\n.io3d-overlay .publishable-api-keys .list .edit-domains-button {\n  positions: absolute;\n  right: 56px;\n  top: 9px;\n  background-size: 75%;\n  padding: 5px;\n}\n.io3d-overlay .publishable-api-keys .generate-new-key-button {\n  margin: 1.5em 0 0 0;\n  display: inline-block;\n  cursor: pointer;\n}\n";

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
	    } else if (isElement$1(x)) {
	      // only add convenience methods
	      extendWithConvenienceMethods(x);
	    } else {
	      throw 'Please provide html element string (i.e. "<div>") or element object as first argument.'
	    }
	  }
	};

	// utils
	el.isElement = isElement$1;

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
	    if (o) isElement$1(o) ? el.appendChild(o) : el.innerHTML = o;
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
	function isElement$1(o){
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
	    
	    mainEl.style['-webkit-animation'] = '600ms overlay-fade-in ease-out';
	    mainEl.style['animation'] = '600ms overlay-fade-in ease-out';
	    mainEl.style['-webkit-animation-fill-mode'] = 'forwards';
	    mainEl.style['animation-fill-mode'] = 'forwards';
	    
	    centerEl.style['-webkit-animation'] = '600ms content-slide-in cubic-bezier(0.2, 0.80, 0.5, 1)';
	    centerEl.style['animation'] = '600ms content-slide-in cubic-bezier(0.2, 0.80, 0.5, 1)';
	    centerEl.style['-webkit-animation-fill-mode'] = 'forwards';
	    centerEl.style['animation-fill-mode'] = 'forwards';
	    
	    if (callback && typeof callback === 'function') setTimeout(function(){
	      callback();
	    }, 500);

	    return result
	  }

	  function hide (callback) {
	    if (!result.isVisible) return
	    result.isVisible = false;

	    mainEl.style['-webkit-animation'] = '600ms overlay-fade-out ease-out';
	    mainEl.style['animation'] = '600ms overlay-fade-out ease-out';
	    mainEl.style['-webkit-animation-fill-mode'] = 'forwards';
	    mainEl.style['animation-fill-mode'] = 'forwards';
	    
	    centerEl.style['-webkit-animation'] = '600ms content-slide-out ease-in';
	    centerEl.style['animation'] = '600ms content-slide-out ease-in';
	    centerEl.style['-webkit-animation-fill-mode'] = 'forwards';
	    centerEl.style['animation-fill-mode'] = 'forwards';
	    
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

	/**
	 http://www.myersdaily.org/joseph/javascript/md5-text.html
	 author: Joseph's Myers
	 http://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript
	 **/

	function md5cycle(x, k) {
	  var a = x[0], b = x[1], c = x[2], d = x[3];

	  a = ff(a, b, c, d, k[0], 7, -680876936);
	  d = ff(d, a, b, c, k[1], 12, -389564586);
	  c = ff(c, d, a, b, k[2], 17,  606105819);
	  b = ff(b, c, d, a, k[3], 22, -1044525330);
	  a = ff(a, b, c, d, k[4], 7, -176418897);
	  d = ff(d, a, b, c, k[5], 12,  1200080426);
	  c = ff(c, d, a, b, k[6], 17, -1473231341);
	  b = ff(b, c, d, a, k[7], 22, -45705983);
	  a = ff(a, b, c, d, k[8], 7,  1770035416);
	  d = ff(d, a, b, c, k[9], 12, -1958414417);
	  c = ff(c, d, a, b, k[10], 17, -42063);
	  b = ff(b, c, d, a, k[11], 22, -1990404162);
	  a = ff(a, b, c, d, k[12], 7,  1804603682);
	  d = ff(d, a, b, c, k[13], 12, -40341101);
	  c = ff(c, d, a, b, k[14], 17, -1502002290);
	  b = ff(b, c, d, a, k[15], 22,  1236535329);

	  a = gg(a, b, c, d, k[1], 5, -165796510);
	  d = gg(d, a, b, c, k[6], 9, -1069501632);
	  c = gg(c, d, a, b, k[11], 14,  643717713);
	  b = gg(b, c, d, a, k[0], 20, -373897302);
	  a = gg(a, b, c, d, k[5], 5, -701558691);
	  d = gg(d, a, b, c, k[10], 9,  38016083);
	  c = gg(c, d, a, b, k[15], 14, -660478335);
	  b = gg(b, c, d, a, k[4], 20, -405537848);
	  a = gg(a, b, c, d, k[9], 5,  568446438);
	  d = gg(d, a, b, c, k[14], 9, -1019803690);
	  c = gg(c, d, a, b, k[3], 14, -187363961);
	  b = gg(b, c, d, a, k[8], 20,  1163531501);
	  a = gg(a, b, c, d, k[13], 5, -1444681467);
	  d = gg(d, a, b, c, k[2], 9, -51403784);
	  c = gg(c, d, a, b, k[7], 14,  1735328473);
	  b = gg(b, c, d, a, k[12], 20, -1926607734);

	  a = hh(a, b, c, d, k[5], 4, -378558);
	  d = hh(d, a, b, c, k[8], 11, -2022574463);
	  c = hh(c, d, a, b, k[11], 16,  1839030562);
	  b = hh(b, c, d, a, k[14], 23, -35309556);
	  a = hh(a, b, c, d, k[1], 4, -1530992060);
	  d = hh(d, a, b, c, k[4], 11,  1272893353);
	  c = hh(c, d, a, b, k[7], 16, -155497632);
	  b = hh(b, c, d, a, k[10], 23, -1094730640);
	  a = hh(a, b, c, d, k[13], 4,  681279174);
	  d = hh(d, a, b, c, k[0], 11, -358537222);
	  c = hh(c, d, a, b, k[3], 16, -722521979);
	  b = hh(b, c, d, a, k[6], 23,  76029189);
	  a = hh(a, b, c, d, k[9], 4, -640364487);
	  d = hh(d, a, b, c, k[12], 11, -421815835);
	  c = hh(c, d, a, b, k[15], 16,  530742520);
	  b = hh(b, c, d, a, k[2], 23, -995338651);

	  a = ii(a, b, c, d, k[0], 6, -198630844);
	  d = ii(d, a, b, c, k[7], 10,  1126891415);
	  c = ii(c, d, a, b, k[14], 15, -1416354905);
	  b = ii(b, c, d, a, k[5], 21, -57434055);
	  a = ii(a, b, c, d, k[12], 6,  1700485571);
	  d = ii(d, a, b, c, k[3], 10, -1894986606);
	  c = ii(c, d, a, b, k[10], 15, -1051523);
	  b = ii(b, c, d, a, k[1], 21, -2054922799);
	  a = ii(a, b, c, d, k[8], 6,  1873313359);
	  d = ii(d, a, b, c, k[15], 10, -30611744);
	  c = ii(c, d, a, b, k[6], 15, -1560198380);
	  b = ii(b, c, d, a, k[13], 21,  1309151649);
	  a = ii(a, b, c, d, k[4], 6, -145523070);
	  d = ii(d, a, b, c, k[11], 10, -1120210379);
	  c = ii(c, d, a, b, k[2], 15,  718787259);
	  b = ii(b, c, d, a, k[9], 21, -343485551);

	  x[0] = add32(a, x[0]);
	  x[1] = add32(b, x[1]);
	  x[2] = add32(c, x[2]);
	  x[3] = add32(d, x[3]);

	}

	function cmn(q, a, b, x, s, t) {
	  a = add32(add32(a, q), add32(x, t));
	  return add32((a << s) | (a >>> (32 - s)), b);
	}

	function ff(a, b, c, d, x, s, t) {
	  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
	  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
	  return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
	  return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function md51(s) {
	//        txt = '';
	  var n = s.length,
	    state = [1732584193, -271733879, -1732584194, 271733878], i;
	  for (i=64; i<=s.length; i+=64) {
	    md5cycle(state, md5blk(s.substring(i-64, i)));
	  }
	  s = s.substring(i-64);
	  var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
	  for (i=0; i<s.length; i++)
	    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
	  tail[i>>2] |= 0x80 << ((i%4) << 3);
	  if (i > 55) {
	    md5cycle(state, tail);
	    for (i=0; i<16; i++) tail[i] = 0;
	  }
	  tail[14] = n*8;
	  md5cycle(state, tail);
	  return state;
	}

	/* there needs to be support for Unicode here,
	 * unless we pretend that we can redefine the MD-5
	 * algorithm for multi-byte characters (perhaps
	 * by adding every four 16-bit characters and
	 * shortening the sum to 32 bits). Otherwise
	 * I suggest performing MD-5 as if every character
	 * was two bytes--e.g., 0040 0025 = @%--but then
	 * how will an ordinary MD-5 sum be matched?
	 * There is no way to standardize text to something
	 * like UTF-8 before transformation; speed cost is
	 * utterly prohibitive. The JavaScript standard
	 * itself needs to look at this: it should start
	 * providing access to strings as preformed UTF-8
	 * 8-bit unsigned value arrays.
	 */
	function md5blk(s) { /* I figured global was faster.   */
	  var md5blks = [], i; /* Andy King said do it this way. */
	  for (i=0; i<64; i+=4) {
	    md5blks[i>>2] = s.charCodeAt(i)
	      + (s.charCodeAt(i+1) << 8)
	      + (s.charCodeAt(i+2) << 16)
	      + (s.charCodeAt(i+3) << 24);
	  }
	  return md5blks;
	}

	var hex_chr = '0123456789abcdef'.split('');

	function rhex(n)
	{
	  var s='', j=0;
	  for(; j<4; j++)
	    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
	      + hex_chr[(n >> (j * 8)) & 0x0F];
	  return s;
	}

	function hex(x) {
	  for (var i=0; i<x.length; i++)
	    x[i] = rhex(x[i]);
	  return x.join('');
	}

	/* this function is much faster,
	 so if possible we use it. Some IEs
	 are the only ones I know of that
	 need the idiotic second function,
	 generated by an if clause.  */

	function add32(a, b) {
	  return (a + b) & 0xFFFFFFFF;
	}

	if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
	  
	}

	// API

	function md5(s) {
	  return hex(md51(s));
	}

	/**
	 *
	 *  Secure Hash Algorithm (SHA1)
	 *  http://www.webtoolkit.info/
	 *
	 **/

	function sha1 (msg) {

	  function rotate_left(n,s) {
	    var t4 = ( n<<s ) | (n>>>(32-s));
	    return t4;
	  }

	  

	  function cvt_hex(val) {
	    var str="";
	    var i;
	    var v;

	    for( i=7; i>=0; i-- ) {
	      v = (val>>>(i*4))&0x0f;
	      str += v.toString(16);
	    }
	    return str;
	  }


	  function Utf8Encode(string) {
	    string = string.replace(/\r\n/g,"\n");
	    var utftext = "";

	    for (var n = 0; n < string.length; n++) {

	      var c = string.charCodeAt(n);

	      if (c < 128) {
	        utftext += String.fromCharCode(c);
	      }
	      else if((c > 127) && (c < 2048)) {
	        utftext += String.fromCharCode((c >> 6) | 192);
	        utftext += String.fromCharCode((c & 63) | 128);
	      }
	      else {
	        utftext += String.fromCharCode((c >> 12) | 224);
	        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	        utftext += String.fromCharCode((c & 63) | 128);
	      }

	    }

	    return utftext;
	  }

	  var blockstart;
	  var i, j;
	  var W = new Array(80);
	  var H0 = 0x67452301;
	  var H1 = 0xEFCDAB89;
	  var H2 = 0x98BADCFE;
	  var H3 = 0x10325476;
	  var H4 = 0xC3D2E1F0;
	  var A, B, C, D, E;
	  var temp;

	  msg = Utf8Encode(msg);

	  var msg_len = msg.length;

	  var word_array = new Array();
	  for( i=0; i<msg_len-3; i+=4 ) {
	    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
	      msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
	    word_array.push( j );
	  }

	  switch( msg_len % 4 ) {
	    case 0:
	      i = 0x080000000;
	      break;
	    case 1:
	      i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
	      break;

	    case 2:
	      i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
	      break;

	    case 3:
	      i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
	      break;
	  }

	  word_array.push( i );

	  while( (word_array.length % 16) != 14 ) word_array.push( 0 );

	  word_array.push( msg_len>>>29 );
	  word_array.push( (msg_len<<3)&0x0ffffffff );


	  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {

	    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
	    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);

	    A = H0;
	    B = H1;
	    C = H2;
	    D = H3;
	    E = H4;

	    for( i= 0; i<=19; i++ ) {
	      temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
	      E = D;
	      D = C;
	      C = rotate_left(B,30);
	      B = A;
	      A = temp;
	    }

	    for( i=20; i<=39; i++ ) {
	      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
	      E = D;
	      D = C;
	      C = rotate_left(B,30);
	      B = A;
	      A = temp;
	    }

	    for( i=40; i<=59; i++ ) {
	      temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
	      E = D;
	      D = C;
	      C = rotate_left(B,30);
	      B = A;
	      A = temp;
	    }

	    for( i=60; i<=79; i++ ) {
	      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
	      E = D;
	      D = C;
	      C = rotate_left(B,30);
	      B = A;
	      A = temp;
	    }

	    H0 = (H0 + A) & 0x0ffffffff;
	    H1 = (H1 + B) & 0x0ffffffff;
	    H2 = (H2 + C) & 0x0ffffffff;
	    H3 = (H3 + D) & 0x0ffffffff;
	    H4 = (H4 + E) & 0x0ffffffff;

	  }

	  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

	  return temp.toLowerCase();

	}

	function getMd5Hash (file) {
	  return readFile(file, 'binaryString').then(md5)
	}

	var utils = {

	  data3d: {
	    load: loadData3d,
	    encodeBinary: encodeBinary,
	    decodeBinary: decodeBinary,
	    fromThree: getData3dFromThreeJs,
	    clone: clone,
	    traverse: traverseData3d$1
	  },
	  ui: ui,
	  auth: auth,
	  io: {
	    fetch: fetch$1,
	    fetchModule: fetchModule,
	    checkIfFileExists: checkIfFileExists
	  },
	  image: {
	    scaleDown: scaleDownImage,
	    getFromFile: getImageFromFile,
	    getBlobFromCanvas: getBlobFromCanvas
	  },
	  math: {
	    md5: md5,
	    sha1: sha1
	  },
	  services: {
	    call: callService
	  },
	  file: {
	    getMimeTypeFromFilename: getMimeTypeFromFileName,
	    gzip: gzip,
	    read: readFile,
	    getMd5Hash: getMd5Hash
	  },
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
	  staging:staging,
	  storage: storage,
	  scene: scene,
	  publish: publish,
	  floorPlan: floorPlan,
	  light: light,

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
