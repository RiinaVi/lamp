(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createNullActor(id) {
    return {
        id: id,
        send: function () { return void 0; },
        subscribe: function () { return ({
            unsubscribe: function () { return void 0; }
        }); },
        toJSON: function () { return ({
            id: id
        }); }
    };
}
exports.createNullActor = createNullActor;
/**
 * Creates a null actor that is able to be invoked given the provided
 * invocation information in its `.meta` value.
 *
 * @param invokeDefinition The meta information needed to invoke the actor.
 */
function createInvocableActor(invokeDefinition) {
    var tempActor = createNullActor(invokeDefinition.id);
    tempActor.meta = invokeDefinition;
    return tempActor;
}
exports.createInvocableActor = createInvocableActor;
function isActor(item) {
    try {
        return typeof item.send === 'function';
    }
    catch (e) {
        return false;
    }
}
exports.isActor = isActor;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateNode_1 = require("./StateNode");
function Machine(config, options, initialContext) {
    if (initialContext === void 0) { initialContext = config.context; }
    var resolvedInitialContext = typeof initialContext === 'function'
        ? initialContext()
        : initialContext;
    return new StateNode_1.StateNode(config, options, resolvedInitialContext);
}
exports.Machine = Machine;
function createMachine(config, options) {
    var resolvedInitialContext = typeof config.context === 'function'
        ? config.context()
        : config.context;
    return new StateNode_1.StateNode(config, options, resolvedInitialContext);
}
exports.createMachine = createMachine;

},{"./StateNode":5}],4:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var stateUtils_1 = require("./stateUtils");
var actions_1 = require("./actions");
function stateValuesEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a === undefined || b === undefined) {
        return false;
    }
    if (utils_1.isString(a) || utils_1.isString(b)) {
        return a === b;
    }
    var aKeys = utils_1.keys(a);
    var bKeys = utils_1.keys(b);
    return (aKeys.length === bKeys.length &&
        aKeys.every(function (key) { return stateValuesEqual(a[key], b[key]); }));
}
exports.stateValuesEqual = stateValuesEqual;
function isState(state) {
    if (utils_1.isString(state)) {
        return false;
    }
    return 'value' in state && 'history' in state;
}
exports.isState = isState;
function bindActionToState(action, state) {
    var exec = action.exec;
    var boundAction = __assign(__assign({}, action), { exec: exec !== undefined
            ? function () {
                return exec(state.context, state.event, {
                    action: action,
                    state: state,
                    _event: state._event
                });
            }
            : undefined });
    return boundAction;
}
exports.bindActionToState = bindActionToState;
var State = /** @class */ (function () {
    /**
     * Creates a new State instance.
     * @param value The state value
     * @param context The extended state
     * @param historyValue The tree representing historical values of the state nodes
     * @param history The previous state
     * @param actions An array of action objects to execute as side-effects
     * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
     * @param meta
     * @param events Internal event queue. Should be empty with run-to-completion semantics.
     * @param configuration
     */
    function State(config) {
        var _this = this;
        this.actions = [];
        this.activities = constants_1.EMPTY_ACTIVITY_MAP;
        this.meta = {};
        this.events = [];
        this.value = config.value;
        this.context = config.context;
        this._event = config._event;
        this._sessionid = config._sessionid;
        this.event = this._event.data;
        this.historyValue = config.historyValue;
        this.history = config.history;
        this.actions = config.actions || [];
        this.activities = config.activities || constants_1.EMPTY_ACTIVITY_MAP;
        this.meta = config.meta || {};
        this.events = config.events || [];
        this.matches = this.matches.bind(this);
        this.toStrings = this.toStrings.bind(this);
        this.configuration = config.configuration;
        this.transitions = config.transitions;
        this.children = config.children;
        this.done = !!config.done;
        Object.defineProperty(this, 'nextEvents', {
            get: function () {
                return stateUtils_1.nextEvents(_this.configuration);
            }
        });
    }
    /**
     * Creates a new State instance for the given `stateValue` and `context`.
     * @param stateValue
     * @param context
     */
    State.from = function (stateValue, context) {
        if (stateValue instanceof State) {
            if (stateValue.context !== context) {
                return new State({
                    value: stateValue.value,
                    context: context,
                    _event: stateValue._event,
                    _sessionid: null,
                    historyValue: stateValue.historyValue,
                    history: stateValue.history,
                    actions: [],
                    activities: stateValue.activities,
                    meta: {},
                    events: [],
                    configuration: [],
                    transitions: [],
                    children: {}
                });
            }
            return stateValue;
        }
        var _event = actions_1.initEvent;
        return new State({
            value: stateValue,
            context: context,
            _event: _event,
            _sessionid: null,
            historyValue: undefined,
            history: undefined,
            actions: [],
            activities: undefined,
            meta: undefined,
            events: [],
            configuration: [],
            transitions: [],
            children: {}
        });
    };
    /**
     * Creates a new State instance for the given `config`.
     * @param config The state config
     */
    State.create = function (config) {
        return new State(config);
    };
    /**
     * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
     * @param stateValue
     * @param context
     */
    State.inert = function (stateValue, context) {
        if (stateValue instanceof State) {
            if (!stateValue.actions.length) {
                return stateValue;
            }
            var _event = actions_1.initEvent;
            return new State({
                value: stateValue.value,
                context: context,
                _event: _event,
                _sessionid: null,
                historyValue: stateValue.historyValue,
                history: stateValue.history,
                activities: stateValue.activities,
                configuration: stateValue.configuration,
                transitions: [],
                children: {}
            });
        }
        return State.from(stateValue, context);
    };
    /**
     * Returns an array of all the string leaf state node paths.
     * @param stateValue
     * @param delimiter The character(s) that separate each subpath in the string state node path.
     */
    State.prototype.toStrings = function (stateValue, delimiter) {
        var _this = this;
        if (stateValue === void 0) { stateValue = this.value; }
        if (delimiter === void 0) { delimiter = '.'; }
        if (utils_1.isString(stateValue)) {
            return [stateValue];
        }
        var valueKeys = utils_1.keys(stateValue);
        return valueKeys.concat.apply(valueKeys, __spread(valueKeys.map(function (key) {
            return _this.toStrings(stateValue[key], delimiter).map(function (s) { return key + delimiter + s; });
        })));
    };
    State.prototype.toJSON = function () {
        var _a = this, configuration = _a.configuration, transitions = _a.transitions, jsonValues = __rest(_a, ["configuration", "transitions"]);
        return jsonValues;
    };
    /**
     * Whether the current state value is a subset of the given parent state value.
     * @param parentStateValue
     */
    State.prototype.matches = function (parentStateValue) {
        return utils_1.matchesState(parentStateValue, this.value);
    };
    return State;
}());
exports.State = State;

},{"./actions":7,"./constants":8,"./stateUtils":17,"./utils":19}],5:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var types_1 = require("./types");
var utils_2 = require("./utils");
var State_1 = require("./State");
var actionTypes = require("./actionTypes");
var actions_1 = require("./actions");
var environment_1 = require("./environment");
var constants_1 = require("./constants");
var stateUtils_1 = require("./stateUtils");
var Actor_1 = require("./Actor");
var NULL_EVENT = '';
var STATE_IDENTIFIER = '#';
var WILDCARD = '*';
var EMPTY_OBJECT = {};
var isStateId = function (str) { return str[0] === STATE_IDENTIFIER; };
var createDefaultOptions = function () { return ({
    actions: {},
    guards: {},
    services: {},
    activities: {},
    delays: {}
}); };
var validateArrayifiedTransitions = function (stateNode, event, transitions) {
    var hasNonLastUnguardedTarget = transitions
        .slice(0, -1)
        .some(function (transition) {
        return !('cond' in transition) &&
            !('in' in transition) &&
            (utils_1.isString(transition.target) || utils_1.isMachine(transition.target));
    });
    var eventText = event === NULL_EVENT ? 'the transient event' : "event '" + event + "'";
    utils_1.warn(!hasNonLastUnguardedTarget, "One or more transitions for " + eventText + " on state '" + stateNode.id + "' are unreachable. " +
        "Make sure that the default transition is the last one defined.");
};
var StateNode = /** @class */ (function () {
    function StateNode(
    /**
     * The raw config used to create the machine.
     */
    config, options, 
    /**
     * The initial extended state
     */
    context) {
        var _this = this;
        this.config = config;
        this.context = context;
        /**
         * The order this state node appears. Corresponds to the implicit SCXML document order.
         */
        this.order = -1;
        this.__xstatenode = true;
        this.__cache = {
            events: undefined,
            relativeValue: new Map(),
            initialStateValue: undefined,
            initialState: undefined,
            on: undefined,
            transitions: undefined,
            candidates: {},
            delayedTransitions: undefined
        };
        this.idMap = {};
        this.options = Object.assign(createDefaultOptions(), options);
        this.parent = this.options._parent;
        this.key =
            this.config.key || this.options._key || this.config.id || '(machine)';
        this.machine = this.parent ? this.parent.machine : this;
        this.path = this.parent ? this.parent.path.concat(this.key) : [];
        this.delimiter =
            this.config.delimiter ||
                (this.parent ? this.parent.delimiter : constants_1.STATE_DELIMITER);
        this.id =
            this.config.id || __spread([this.machine.key], this.path).join(this.delimiter);
        this.version = this.parent
            ? this.parent.version
            : this.config.version;
        this.type =
            this.config.type ||
                (this.config.parallel
                    ? 'parallel'
                    : this.config.states && utils_1.keys(this.config.states).length
                        ? 'compound'
                        : this.config.history
                            ? 'history'
                            : 'atomic');
        if (!environment_1.IS_PRODUCTION) {
            utils_1.warn(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. " + (this.config.parallel
                ? "Replace with `type: 'parallel'`"
                : "Use `type: '" + this.type + "'`") + " in the config for state node '" + this.id + "' instead.");
        }
        this.initial = this.config.initial;
        this.states = (this.config.states
            ? utils_1.mapValues(this.config.states, function (stateConfig, key) {
                var _a;
                var stateNode = new StateNode(stateConfig, {
                    _parent: _this,
                    _key: key
                });
                Object.assign(_this.idMap, __assign((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
                return stateNode;
            })
            : EMPTY_OBJECT);
        // Document order
        var order = 0;
        function dfs(stateNode) {
            var e_1, _a;
            stateNode.order = order++;
            try {
                for (var _b = __values(stateUtils_1.getChildren(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    dfs(child);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        dfs(this);
        // History config
        this.history =
            this.config.history === true ? 'shallow' : this.config.history || false;
        this._transient = !this.config.on
            ? false
            : Array.isArray(this.config.on)
                ? this.config.on.some(function (_a) {
                    var event = _a.event;
                    return event === NULL_EVENT;
                })
                : NULL_EVENT in this.config.on;
        this.strict = !!this.config.strict;
        // TODO: deprecate (entry)
        this.onEntry = utils_1.toArray(this.config.entry || this.config.onEntry).map(function (action) { return actions_1.toActionObject(action); });
        // TODO: deprecate (exit)
        this.onExit = utils_1.toArray(this.config.exit || this.config.onExit).map(function (action) { return actions_1.toActionObject(action); });
        this.meta = this.config.meta;
        this.data =
            this.type === 'final'
                ? this.config.data
                : undefined;
        this.invoke = utils_1.toArray(this.config.invoke).map(function (invokeConfig, i) {
            var _a, _b;
            if (utils_1.isMachine(invokeConfig)) {
                _this.machine.options.services = __assign((_a = {}, _a[invokeConfig.id] = invokeConfig, _a), _this.machine.options.services);
                return {
                    type: actionTypes.invoke,
                    src: invokeConfig.id,
                    id: invokeConfig.id
                };
            }
            else if (typeof invokeConfig.src !== 'string') {
                var invokeSrc = _this.id + ":invocation[" + i + "]"; // TODO: util function
                _this.machine.options.services = __assign((_b = {}, _b[invokeSrc] = invokeConfig.src, _b), _this.machine.options.services);
                return __assign(__assign({ type: actionTypes.invoke, id: invokeSrc }, invokeConfig), { src: invokeSrc });
            }
            else {
                return __assign(__assign({}, invokeConfig), { type: actionTypes.invoke, id: invokeConfig.id || invokeConfig.src, src: invokeConfig.src });
            }
        });
        this.activities = utils_1.toArray(this.config.activities)
            .concat(this.invoke)
            .map(function (activity) { return actions_1.toActivityDefinition(activity); });
        this.transition = this.transition.bind(this);
    }
    StateNode.prototype._init = function () {
        if (this.__cache.transitions) {
            return;
        }
        stateUtils_1.getAllStateNodes(this).forEach(function (stateNode) { return stateNode.on; });
    };
    /**
     * Clones this state machine with custom options and context.
     *
     * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
     * @param context Custom context (will override predefined context)
     */
    StateNode.prototype.withConfig = function (options, context) {
        if (context === void 0) { context = this.context; }
        var _a = this.options, actions = _a.actions, activities = _a.activities, guards = _a.guards, services = _a.services, delays = _a.delays;
        return new StateNode(this.config, {
            actions: __assign(__assign({}, actions), options.actions),
            activities: __assign(__assign({}, activities), options.activities),
            guards: __assign(__assign({}, guards), options.guards),
            services: __assign(__assign({}, services), options.services),
            delays: __assign(__assign({}, delays), options.delays)
        }, context);
    };
    /**
     * Clones this state machine with custom context.
     *
     * @param context Custom context (will override predefined context, not recursive)
     */
    StateNode.prototype.withContext = function (context) {
        return new StateNode(this.config, this.options, context);
    };
    Object.defineProperty(StateNode.prototype, "definition", {
        /**
         * The well-structured state node definition.
         */
        get: function () {
            return {
                id: this.id,
                key: this.key,
                version: this.version,
                context: this.context,
                type: this.type,
                initial: this.initial,
                history: this.history,
                states: utils_1.mapValues(this.states, function (state) { return state.definition; }),
                on: this.on,
                transitions: this.transitions,
                entry: this.onEntry,
                exit: this.onExit,
                activities: this.activities || [],
                meta: this.meta,
                order: this.order || -1,
                data: this.data,
                invoke: this.invoke
            };
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.toJSON = function () {
        return this.definition;
    };
    Object.defineProperty(StateNode.prototype, "on", {
        /**
         * The mapping of events to transitions.
         */
        get: function () {
            if (this.__cache.on) {
                return this.__cache.on;
            }
            var transitions = this.transitions;
            return (this.__cache.on = transitions.reduce(function (map, transition) {
                map[transition.eventType] = map[transition.eventType] || [];
                map[transition.eventType].push(transition);
                return map;
            }, {}));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "after", {
        get: function () {
            return (this.__cache.delayedTransitions ||
                ((this.__cache.delayedTransitions = this.getDelayedTransitions()),
                    this.__cache.delayedTransitions));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "transitions", {
        /**
         * All the transitions that can be taken from this state node.
         */
        get: function () {
            return (this.__cache.transitions ||
                ((this.__cache.transitions = this.formatTransitions()),
                    this.__cache.transitions));
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.getCandidates = function (eventName) {
        if (this.__cache.candidates[eventName]) {
            return this.__cache.candidates[eventName];
        }
        var transient = eventName === NULL_EVENT;
        var candidates = this.transitions.filter(function (transition) {
            var sameEventType = transition.eventType === eventName;
            // null events should only match against eventless transitions
            return transient
                ? sameEventType
                : sameEventType || transition.eventType === WILDCARD;
        });
        this.__cache.candidates[eventName] = candidates;
        return candidates;
    };
    /**
     * All delayed transitions from the config.
     */
    StateNode.prototype.getDelayedTransitions = function () {
        var _this = this;
        var afterConfig = this.config.after;
        if (!afterConfig) {
            return [];
        }
        var mutateEntryExit = function (delay, i) {
            var delayRef = utils_1.isFunction(delay) ? _this.id + ":delay[" + i + "]" : delay;
            var eventType = actions_1.after(delayRef, _this.id);
            _this.onEntry.push(actions_1.send(eventType, { delay: delay }));
            _this.onExit.push(actions_1.cancel(eventType));
            return eventType;
        };
        var delayedTransitions = utils_1.isArray(afterConfig)
            ? afterConfig.map(function (transition, i) {
                var eventType = mutateEntryExit(transition.delay, i);
                return __assign(__assign({}, transition), { event: eventType });
            })
            : utils_1.flatten(utils_1.keys(afterConfig).map(function (delay, i) {
                var configTransition = afterConfig[delay];
                var resolvedTransition = utils_1.isString(configTransition)
                    ? { target: configTransition }
                    : configTransition;
                var resolvedDelay = !isNaN(+delay) ? +delay : delay;
                var eventType = mutateEntryExit(resolvedDelay, i);
                return utils_1.toArray(resolvedTransition).map(function (transition) { return (__assign(__assign({}, transition), { event: eventType, delay: resolvedDelay })); });
            }));
        return delayedTransitions.map(function (delayedTransition) {
            var delay = delayedTransition.delay;
            return __assign(__assign({}, _this.formatTransition(delayedTransition)), { delay: delay });
        });
    };
    /**
     * Returns the state nodes represented by the current state value.
     *
     * @param state The state value or State instance
     */
    StateNode.prototype.getStateNodes = function (state) {
        var _a;
        var _this = this;
        if (!state) {
            return [];
        }
        var stateValue = state instanceof State_1.State
            ? state.value
            : utils_1.toStateValue(state, this.delimiter);
        if (utils_1.isString(stateValue)) {
            var initialStateValue = this.getStateNode(stateValue).initial;
            return initialStateValue !== undefined
                ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a))
                : [this.states[stateValue]];
        }
        var subStateKeys = utils_1.keys(stateValue);
        var subStateNodes = subStateKeys.map(function (subStateKey) { return _this.getStateNode(subStateKey); });
        return subStateNodes.concat(subStateKeys.reduce(function (allSubStateNodes, subStateKey) {
            var subStateNode = _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
            return allSubStateNodes.concat(subStateNode);
        }, []));
    };
    /**
     * Returns `true` if this state node explicitly handles the given event.
     *
     * @param event The event in question
     */
    StateNode.prototype.handles = function (event) {
        var eventType = utils_1.getEventType(event);
        return this.events.includes(eventType);
    };
    /**
     * Resolves the given `state` to a new `State` instance relative to this machine.
     *
     * This ensures that `.events` and `.nextEvents` represent the correct values.
     *
     * @param state The state to resolve
     */
    StateNode.prototype.resolveState = function (state) {
        var configuration = Array.from(stateUtils_1.getConfiguration([], this.getStateNodes(state.value)));
        return new State_1.State(__assign(__assign({}, state), { value: this.resolve(state.value), configuration: configuration }));
    };
    StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
        var stateNode = this.getStateNode(stateValue);
        var next = stateNode.next(state, _event);
        if (!next || !next.transitions.length) {
            return this.next(state, _event);
        }
        return next;
    };
    StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
        var subStateKeys = utils_1.keys(stateValue);
        var stateNode = this.getStateNode(subStateKeys[0]);
        var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);
        if (!next || !next.transitions.length) {
            return this.next(state, _event);
        }
        return next;
    };
    StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
        var e_2, _a;
        var transitionMap = {};
        try {
            for (var _b = __values(utils_1.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var subStateKey = _c.value;
                var subStateValue = stateValue[subStateKey];
                if (!subStateValue) {
                    continue;
                }
                var subStateNode = this.getStateNode(subStateKey);
                var next = subStateNode._transition(subStateValue, state, _event);
                if (next) {
                    transitionMap[subStateKey] = next;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var stateTransitions = utils_1.keys(transitionMap).map(function (key) { return transitionMap[key]; });
        var enabledTransitions = utils_1.flatten(stateTransitions.map(function (st) { return st.transitions; }));
        var willTransition = stateTransitions.some(function (st) { return st.transitions.length > 0; });
        if (!willTransition) {
            return this.next(state, _event);
        }
        var entryNodes = utils_1.flatten(stateTransitions.map(function (t) { return t.entrySet; }));
        var configuration = utils_1.flatten(utils_1.keys(transitionMap).map(function (key) { return transitionMap[key].configuration; }));
        return {
            transitions: enabledTransitions,
            entrySet: entryNodes,
            exitSet: utils_1.flatten(stateTransitions.map(function (t) { return t.exitSet; })),
            configuration: configuration,
            source: state,
            actions: utils_1.flatten(utils_1.keys(transitionMap).map(function (key) {
                return transitionMap[key].actions;
            }))
        };
    };
    StateNode.prototype._transition = function (stateValue, state, _event) {
        // leaf node
        if (utils_1.isString(stateValue)) {
            return this.transitionLeafNode(stateValue, state, _event);
        }
        // hierarchical node
        if (utils_1.keys(stateValue).length === 1) {
            return this.transitionCompoundNode(stateValue, state, _event);
        }
        // orthogonal node
        return this.transitionParallelNode(stateValue, state, _event);
    };
    StateNode.prototype.next = function (state, _event) {
        var e_3, _a;
        var _this = this;
        var eventName = _event.name;
        var actions = [];
        var nextStateNodes = [];
        var selectedTransition;
        try {
            for (var _b = __values(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var candidate = _c.value;
                var cond = candidate.cond, stateIn = candidate.in;
                var resolvedContext = state.context;
                var isInState = stateIn
                    ? utils_1.isString(stateIn) && isStateId(stateIn)
                        ? // Check if in state by ID
                            state.matches(utils_1.toStateValue(this.getStateNodeById(stateIn).path, this.delimiter))
                        : // Check if in state by relative grandparent
                            utils_2.matchesState(utils_1.toStateValue(stateIn, this.delimiter), utils_1.path(this.path.slice(0, -2))(state.value))
                    : true;
                var guardPassed = false;
                try {
                    guardPassed =
                        !cond ||
                            utils_1.evaluateGuard(this.machine, cond, resolvedContext, _event, state);
                }
                catch (err) {
                    throw new Error("Unable to evaluate guard '" + (cond.name || cond.type) + "' in transition for event '" + eventName + "' in state node '" + this.id + "':\n" + err.message);
                }
                if (guardPassed && isInState) {
                    if (candidate.target !== undefined) {
                        nextStateNodes = candidate.target;
                    }
                    actions.push.apply(actions, __spread(candidate.actions));
                    selectedTransition = candidate;
                    break;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (!selectedTransition) {
            return undefined;
        }
        if (!nextStateNodes.length) {
            return {
                transitions: [selectedTransition],
                entrySet: [],
                exitSet: [],
                configuration: state.value ? [this] : [],
                source: state,
                actions: actions
            };
        }
        var allNextStateNodes = utils_1.flatten(nextStateNodes.map(function (stateNode) {
            return _this.getRelativeStateNodes(stateNode, state.historyValue);
        }));
        var isInternal = !!selectedTransition.internal;
        var reentryNodes = isInternal
            ? []
            : utils_1.flatten(allNextStateNodes.map(function (n) { return _this.nodesFromChild(n); }));
        return {
            transitions: [selectedTransition],
            entrySet: reentryNodes,
            exitSet: isInternal ? [] : [this],
            configuration: allNextStateNodes,
            source: state,
            actions: actions
        };
    };
    StateNode.prototype.nodesFromChild = function (childStateNode) {
        if (childStateNode.escapes(this)) {
            return [];
        }
        var nodes = [];
        var marker = childStateNode;
        while (marker && marker !== this) {
            nodes.push(marker);
            marker = marker.parent;
        }
        nodes.push(this); // inclusive
        return nodes;
    };
    /**
     * Whether the given state node "escapes" this state node. If the `stateNode` is equal to or the parent of
     * this state node, it does not escape.
     */
    StateNode.prototype.escapes = function (stateNode) {
        if (this === stateNode) {
            return false;
        }
        var parent = this.parent;
        while (parent) {
            if (parent === stateNode) {
                return false;
            }
            parent = parent.parent;
        }
        return true;
    };
    StateNode.prototype.getActions = function (transition, currentContext, _event, prevState) {
        var e_4, _a, e_5, _b;
        var prevConfig = stateUtils_1.getConfiguration([], prevState ? this.getStateNodes(prevState.value) : [this]);
        var resolvedConfig = transition.configuration.length
            ? stateUtils_1.getConfiguration(prevConfig, transition.configuration)
            : prevConfig;
        try {
            for (var resolvedConfig_1 = __values(resolvedConfig), resolvedConfig_1_1 = resolvedConfig_1.next(); !resolvedConfig_1_1.done; resolvedConfig_1_1 = resolvedConfig_1.next()) {
                var sn = resolvedConfig_1_1.value;
                if (!stateUtils_1.has(prevConfig, sn)) {
                    transition.entrySet.push(sn);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (resolvedConfig_1_1 && !resolvedConfig_1_1.done && (_a = resolvedConfig_1.return)) _a.call(resolvedConfig_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var prevConfig_1 = __values(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
                var sn = prevConfig_1_1.value;
                if (!stateUtils_1.has(resolvedConfig, sn) || stateUtils_1.has(transition.exitSet, sn.parent)) {
                    transition.exitSet.push(sn);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (!transition.source) {
            transition.exitSet = [];
            // Ensure that root StateNode (machine) is entered
            transition.entrySet.push(this);
        }
        var doneEvents = utils_1.flatten(transition.entrySet.map(function (sn) {
            var events = [];
            if (sn.type !== 'final') {
                return events;
            }
            var parent = sn.parent;
            if (!parent.parent) {
                return events;
            }
            events.push(actions_1.done(sn.id, sn.data), // TODO: deprecate - final states should not emit done events for their own state.
            actions_1.done(parent.id, sn.data ? utils_1.mapContext(sn.data, currentContext, _event) : undefined));
            var grandparent = parent.parent;
            if (grandparent.type === 'parallel') {
                if (stateUtils_1.getChildren(grandparent).every(function (parentNode) {
                    return stateUtils_1.isInFinalState(transition.configuration, parentNode);
                })) {
                    events.push(actions_1.done(grandparent.id, grandparent.data));
                }
            }
            return events;
        }));
        transition.exitSet.sort(function (a, b) { return b.order - a.order; });
        transition.entrySet.sort(function (a, b) { return a.order - b.order; });
        var entryStates = new Set(transition.entrySet);
        var exitStates = new Set(transition.exitSet);
        var _c = __read([
            utils_1.flatten(Array.from(entryStates).map(function (stateNode) {
                return __spread(stateNode.activities.map(function (activity) { return actions_1.start(activity); }), stateNode.onEntry);
            })).concat(doneEvents.map(actions_1.raise)),
            utils_1.flatten(Array.from(exitStates).map(function (stateNode) { return __spread(stateNode.onExit, stateNode.activities.map(function (activity) { return actions_1.stop(activity); })); }))
        ], 2), entryActions = _c[0], exitActions = _c[1];
        var actions = actions_1.toActionObjects(exitActions.concat(transition.actions).concat(entryActions), this.machine.options.actions);
        return actions;
    };
    /**
     * Determines the next state given the current `state` and sent `event`.
     *
     * @param state The current State instance or state value
     * @param event The event that was sent at the current state
     * @param context The current context (extended state) of the current state
     */
    StateNode.prototype.transition = function (state, event, context) {
        if (state === void 0) { state = this.initialState; }
        var _event = utils_1.toSCXMLEvent(event);
        var currentState;
        if (state instanceof State_1.State) {
            currentState =
                context === undefined
                    ? state
                    : this.resolveState(State_1.State.from(state, context));
        }
        else {
            var resolvedStateValue = utils_1.isString(state)
                ? this.resolve(utils_1.pathToStateValue(this.getResolvedPath(state)))
                : this.resolve(state);
            var resolvedContext = context ? context : this.machine.context;
            currentState = this.resolveState(State_1.State.from(resolvedStateValue, resolvedContext));
        }
        if (!environment_1.IS_PRODUCTION && _event.name === WILDCARD) {
            throw new Error("An event cannot have the wildcard type ('" + WILDCARD + "')");
        }
        if (this.strict) {
            if (!this.events.includes(_event.name) && !utils_1.isBuiltInEvent(_event.name)) {
                throw new Error("Machine '" + this.id + "' does not accept event '" + _event.name + "'");
            }
        }
        var stateTransition = this._transition(currentState.value, currentState, _event) || {
            transitions: [],
            configuration: [],
            entrySet: [],
            exitSet: [],
            source: currentState,
            actions: []
        };
        var prevConfig = stateUtils_1.getConfiguration([], this.getStateNodes(currentState.value));
        var resolvedConfig = stateTransition.configuration.length
            ? stateUtils_1.getConfiguration(prevConfig, stateTransition.configuration)
            : prevConfig;
        stateTransition.configuration = __spread(resolvedConfig);
        return this.resolveTransition(stateTransition, currentState, _event);
    };
    StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent) {
        var _a;
        var currentActions = state.actions;
        state = this.transition(state, _event);
        // Save original event to state
        state._event = originalEvent;
        state.event = originalEvent.data;
        (_a = state.actions).unshift.apply(_a, __spread(currentActions));
        return state;
    };
    StateNode.prototype.resolveTransition = function (stateTransition, currentState, _event, context) {
        var e_6, _a;
        if (_event === void 0) { _event = actions_1.initEvent; }
        if (context === void 0) { context = this.machine.context; }
        var configuration = stateTransition.configuration;
        // Transition will "apply" if:
        // - this is the initial state (there is no current state)
        // - OR there are transitions
        var willTransition = !currentState || stateTransition.transitions.length > 0;
        var resolvedStateValue = willTransition
            ? stateUtils_1.getValue(this.machine, configuration)
            : undefined;
        var historyValue = currentState
            ? currentState.historyValue
                ? currentState.historyValue
                : stateTransition.source
                    ? this.machine.historyValue(currentState.value)
                    : undefined
            : undefined;
        var currentContext = currentState ? currentState.context : context;
        var actions = this.getActions(stateTransition, currentContext, _event, currentState);
        var activities = currentState ? __assign({}, currentState.activities) : {};
        try {
            for (var actions_2 = __values(actions), actions_2_1 = actions_2.next(); !actions_2_1.done; actions_2_1 = actions_2.next()) {
                var action = actions_2_1.value;
                if (action.type === actionTypes.start) {
                    activities[action.activity.type] = action;
                }
                else if (action.type === actionTypes.stop) {
                    activities[action.activity.type] = false;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (actions_2_1 && !actions_2_1.done && (_a = actions_2.return)) _a.call(actions_2);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var _b = __read(actions_1.resolveActions(this, currentState, currentContext, _event, actions), 2), resolvedActions = _b[0], updatedContext = _b[1];
        var _c = __read(utils_1.partition(resolvedActions, function (action) {
            return action.type === actionTypes.raise ||
                (action.type === actionTypes.send &&
                    action.to ===
                        types_1.SpecialTargets.Internal);
        }), 2), raisedEvents = _c[0], nonRaisedActions = _c[1];
        var invokeActions = resolvedActions.filter(function (action) {
            return (action.type === actionTypes.start &&
                action.activity.type ===
                    actionTypes.invoke);
        });
        var children = invokeActions.reduce(function (acc, action) {
            acc[action.activity.id] = Actor_1.createInvocableActor(action.activity);
            return acc;
        }, currentState
            ? __assign({}, currentState.children) : {});
        var resolvedConfiguration = resolvedStateValue
            ? stateTransition.configuration
            : currentState
                ? currentState.configuration
                : [];
        var meta = resolvedConfiguration.reduce(function (acc, stateNode) {
            if (stateNode.meta !== undefined) {
                acc[stateNode.id] = stateNode.meta;
            }
            return acc;
        }, {});
        var isDone = stateUtils_1.isInFinalState(resolvedConfiguration, this);
        var nextState = new State_1.State({
            value: resolvedStateValue || currentState.value,
            context: updatedContext,
            _event: _event,
            // Persist _sessionid between states
            _sessionid: currentState ? currentState._sessionid : null,
            historyValue: resolvedStateValue
                ? historyValue
                    ? utils_1.updateHistoryValue(historyValue, resolvedStateValue)
                    : undefined
                : currentState
                    ? currentState.historyValue
                    : undefined,
            history: !resolvedStateValue || stateTransition.source
                ? currentState
                : undefined,
            actions: resolvedStateValue ? nonRaisedActions : [],
            activities: resolvedStateValue
                ? activities
                : currentState
                    ? currentState.activities
                    : {},
            meta: resolvedStateValue
                ? meta
                : currentState
                    ? currentState.meta
                    : undefined,
            events: [],
            configuration: resolvedConfiguration,
            transitions: stateTransition.transitions,
            children: children,
            done: isDone
        });
        var didUpdateContext = currentContext !== updatedContext;
        nextState.changed = _event.name === actionTypes.update || didUpdateContext;
        // Dispose of penultimate histories to prevent memory leaks
        var history = nextState.history;
        if (history) {
            delete history.history;
        }
        if (!resolvedStateValue) {
            return nextState;
        }
        var maybeNextState = nextState;
        if (!isDone) {
            var isTransient = this._transient ||
                configuration.some(function (stateNode) { return stateNode._transient; });
            if (isTransient) {
                maybeNextState = this.resolveRaisedTransition(maybeNextState, {
                    type: actionTypes.nullEvent
                }, _event);
            }
            while (raisedEvents.length) {
                var raisedEvent = raisedEvents.shift();
                maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event);
            }
        }
        // Detect if state changed
        var changed = maybeNextState.changed ||
            (history
                ? !!maybeNextState.actions.length ||
                    didUpdateContext ||
                    typeof history.value !== typeof maybeNextState.value ||
                    !State_1.stateValuesEqual(maybeNextState.value, history.value)
                : undefined);
        maybeNextState.changed = changed;
        // Preserve original history after raised events
        maybeNextState.historyValue = nextState.historyValue;
        maybeNextState.history = history;
        return maybeNextState;
    };
    /**
     * Returns the child state node from its relative `stateKey`, or throws.
     */
    StateNode.prototype.getStateNode = function (stateKey) {
        if (isStateId(stateKey)) {
            return this.machine.getStateNodeById(stateKey);
        }
        if (!this.states) {
            throw new Error("Unable to retrieve child state '" + stateKey + "' from '" + this.id + "'; no child states exist.");
        }
        var result = this.states[stateKey];
        if (!result) {
            throw new Error("Child state '" + stateKey + "' does not exist on '" + this.id + "'");
        }
        return result;
    };
    /**
     * Returns the state node with the given `stateId`, or throws.
     *
     * @param stateId The state ID. The prefix "#" is removed.
     */
    StateNode.prototype.getStateNodeById = function (stateId) {
        var resolvedStateId = isStateId(stateId)
            ? stateId.slice(STATE_IDENTIFIER.length)
            : stateId;
        if (resolvedStateId === this.id) {
            return this;
        }
        var stateNode = this.machine.idMap[resolvedStateId];
        if (!stateNode) {
            throw new Error("Child state node '#" + resolvedStateId + "' does not exist on machine '" + this.id + "'");
        }
        return stateNode;
    };
    /**
     * Returns the relative state node from the given `statePath`, or throws.
     *
     * @param statePath The string or string array relative path to the state node.
     */
    StateNode.prototype.getStateNodeByPath = function (statePath) {
        if (typeof statePath === 'string' && isStateId(statePath)) {
            try {
                return this.getStateNodeById(statePath.slice(1));
            }
            catch (e) {
                // try individual paths
                // throw e;
            }
        }
        var arrayStatePath = utils_1.toStatePath(statePath, this.delimiter).slice();
        var currentStateNode = this;
        while (arrayStatePath.length) {
            var key = arrayStatePath.shift();
            if (!key.length) {
                break;
            }
            currentStateNode = currentStateNode.getStateNode(key);
        }
        return currentStateNode;
    };
    /**
     * Resolves a partial state value with its full representation in this machine.
     *
     * @param stateValue The partial state value to resolve.
     */
    StateNode.prototype.resolve = function (stateValue) {
        var _a;
        var _this = this;
        if (!stateValue) {
            return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
        }
        switch (this.type) {
            case 'parallel':
                return utils_1.mapValues(this.initialStateValue, function (subStateValue, subStateKey) {
                    return subStateValue
                        ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue)
                        : EMPTY_OBJECT;
                });
            case 'compound':
                if (utils_1.isString(stateValue)) {
                    var subStateNode = this.getStateNode(stateValue);
                    if (subStateNode.type === 'parallel' ||
                        subStateNode.type === 'compound') {
                        return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
                    }
                    return stateValue;
                }
                if (!utils_1.keys(stateValue).length) {
                    return this.initialStateValue || {};
                }
                return utils_1.mapValues(stateValue, function (subStateValue, subStateKey) {
                    return subStateValue
                        ? _this.getStateNode(subStateKey).resolve(subStateValue)
                        : EMPTY_OBJECT;
                });
            default:
                return stateValue || EMPTY_OBJECT;
        }
    };
    StateNode.prototype.getResolvedPath = function (stateIdentifier) {
        if (isStateId(stateIdentifier)) {
            var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];
            if (!stateNode) {
                throw new Error("Unable to find state node '" + stateIdentifier + "'");
            }
            return stateNode.path;
        }
        return utils_1.toStatePath(stateIdentifier, this.delimiter);
    };
    Object.defineProperty(StateNode.prototype, "initialStateValue", {
        get: function () {
            var _a;
            if (this.__cache.initialStateValue) {
                return this.__cache.initialStateValue;
            }
            var initialStateValue;
            if (this.type === 'parallel') {
                initialStateValue = utils_1.mapFilterValues(this.states, function (state) { return state.initialStateValue || EMPTY_OBJECT; }, function (stateNode) { return !(stateNode.type === 'history'); });
            }
            else if (this.initial !== undefined) {
                if (!this.states[this.initial]) {
                    throw new Error("Initial state '" + this.initial + "' not found on '" + this.key + "'");
                }
                initialStateValue = (stateUtils_1.isLeafNode(this.states[this.initial])
                    ? this.initial
                    : (_a = {},
                        _a[this.initial] = this.states[this.initial].initialStateValue,
                        _a));
            }
            this.__cache.initialStateValue = initialStateValue;
            return this.__cache.initialStateValue;
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.getInitialState = function (stateValue, context) {
        var configuration = this.getStateNodes(stateValue);
        return this.resolveTransition({
            configuration: configuration,
            entrySet: configuration,
            exitSet: [],
            transitions: [],
            source: undefined,
            actions: []
        }, undefined, undefined, context);
    };
    Object.defineProperty(StateNode.prototype, "initialState", {
        /**
         * The initial State instance, which includes all actions to be executed from
         * entering the initial state.
         */
        get: function () {
            this._init();
            var initialStateValue = this.initialStateValue;
            if (!initialStateValue) {
                throw new Error("Cannot retrieve initial state from simple state '" + this.id + "'.");
            }
            return this.getInitialState(initialStateValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "target", {
        /**
         * The target state value of the history state node, if it exists. This represents the
         * default state value to transition to if no history value exists yet.
         */
        get: function () {
            var target;
            if (this.type === 'history') {
                var historyConfig = this.config;
                if (utils_1.isString(historyConfig.target)) {
                    target = isStateId(historyConfig.target)
                        ? utils_1.pathToStateValue(this.machine
                            .getStateNodeById(historyConfig.target)
                            .path.slice(this.path.length - 1))
                        : historyConfig.target;
                }
                else {
                    target = historyConfig.target;
                }
            }
            return target;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the leaf nodes from a state path relative to this state node.
     *
     * @param relativeStateId The relative state path to retrieve the state nodes
     * @param history The previous state to retrieve history
     * @param resolve Whether state nodes should resolve to initial child state nodes
     */
    StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
        if (resolve === void 0) { resolve = true; }
        return resolve
            ? relativeStateId.type === 'history'
                ? relativeStateId.resolveHistory(historyValue)
                : relativeStateId.initialStateNodes
            : [relativeStateId];
    };
    Object.defineProperty(StateNode.prototype, "initialStateNodes", {
        get: function () {
            var _this = this;
            if (stateUtils_1.isLeafNode(this)) {
                return [this];
            }
            // Case when state node is compound but no initial state is defined
            if (this.type === 'compound' && !this.initial) {
                if (!environment_1.IS_PRODUCTION) {
                    utils_1.warn(false, "Compound state node '" + this.id + "' has no initial state.");
                }
                return [this];
            }
            var initialStateNodePaths = utils_1.toStatePaths(this.initialStateValue);
            return utils_1.flatten(initialStateNodePaths.map(function (initialPath) {
                return _this.getFromRelativePath(initialPath);
            }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Retrieves state nodes from a relative path to this state node.
     *
     * @param relativePath The relative path from this state node
     * @param historyValue
     */
    StateNode.prototype.getFromRelativePath = function (relativePath) {
        if (!relativePath.length) {
            return [this];
        }
        var _a = __read(relativePath), stateKey = _a[0], childStatePath = _a.slice(1);
        if (!this.states) {
            throw new Error("Cannot retrieve subPath '" + stateKey + "' from node with no states");
        }
        var childStateNode = this.getStateNode(stateKey);
        if (childStateNode.type === 'history') {
            return childStateNode.resolveHistory();
        }
        if (!this.states[stateKey]) {
            throw new Error("Child state '" + stateKey + "' does not exist on '" + this.id + "'");
        }
        return this.states[stateKey].getFromRelativePath(childStatePath);
    };
    StateNode.prototype.historyValue = function (relativeStateValue) {
        if (!utils_1.keys(this.states).length) {
            return undefined;
        }
        return {
            current: relativeStateValue || this.initialStateValue,
            states: utils_1.mapFilterValues(this.states, function (stateNode, key) {
                if (!relativeStateValue) {
                    return stateNode.historyValue();
                }
                var subStateValue = utils_1.isString(relativeStateValue)
                    ? undefined
                    : relativeStateValue[key];
                return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
            }, function (stateNode) { return !stateNode.history; })
        };
    };
    /**
     * Resolves to the historical value(s) of the parent state node,
     * represented by state nodes.
     *
     * @param historyValue
     */
    StateNode.prototype.resolveHistory = function (historyValue) {
        var _this = this;
        if (this.type !== 'history') {
            return [this];
        }
        var parent = this.parent;
        if (!historyValue) {
            var historyTarget = this.target;
            return historyTarget
                ? utils_1.flatten(utils_1.toStatePaths(historyTarget).map(function (relativeChildPath) {
                    return parent.getFromRelativePath(relativeChildPath);
                }))
                : parent.initialStateNodes;
        }
        var subHistoryValue = utils_1.nestedPath(parent.path, 'states')(historyValue).current;
        if (utils_1.isString(subHistoryValue)) {
            return [parent.getStateNode(subHistoryValue)];
        }
        return utils_1.flatten(utils_1.toStatePaths(subHistoryValue).map(function (subStatePath) {
            return _this.history === 'deep'
                ? parent.getFromRelativePath(subStatePath)
                : [parent.states[subStatePath[0]]];
        }));
    };
    Object.defineProperty(StateNode.prototype, "stateIds", {
        /**
         * All the state node IDs of this state node and its descendant state nodes.
         */
        get: function () {
            var _this = this;
            var childStateIds = utils_1.flatten(utils_1.keys(this.states).map(function (stateKey) {
                return _this.states[stateKey].stateIds;
            }));
            return [this.id].concat(childStateIds);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "events", {
        /**
         * All the event types accepted by this state node and its descendants.
         */
        get: function () {
            var e_7, _a, e_8, _b;
            if (this.__cache.events) {
                return this.__cache.events;
            }
            var states = this.states;
            var events = new Set(this.ownEvents);
            if (states) {
                try {
                    for (var _c = __values(utils_1.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var stateId = _d.value;
                        var state = states[stateId];
                        if (state.states) {
                            try {
                                for (var _e = (e_8 = void 0, __values(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                    var event_1 = _f.value;
                                    events.add("" + event_1);
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            return (this.__cache.events = Array.from(events));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "ownEvents", {
        /**
         * All the events that have transitions directly from this state node.
         *
         * Excludes any inert events.
         */
        get: function () {
            var events = new Set(this.transitions
                .filter(function (transition) {
                return !(!transition.target &&
                    !transition.actions.length &&
                    transition.internal);
            })
                .map(function (transition) { return transition.eventType; }));
            return Array.from(events);
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.resolveTarget = function (_target) {
        var _this = this;
        if (_target === undefined) {
            // an undefined target signals that the state node should not transition from that state when receiving that event
            return undefined;
        }
        return _target.map(function (target) {
            if (!utils_1.isString(target)) {
                return target;
            }
            var isInternalTarget = target[0] === _this.delimiter;
            // If internal target is defined on machine,
            // do not include machine key on target
            if (isInternalTarget && !_this.parent) {
                return _this.getStateNodeByPath(target.slice(1));
            }
            var resolvedTarget = isInternalTarget ? _this.key + target : target;
            if (_this.parent) {
                try {
                    var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);
                    return targetStateNode;
                }
                catch (err) {
                    throw new Error("Invalid transition definition for state node '" + _this.id + "':\n" + err.message);
                }
            }
            else {
                return _this.getStateNodeByPath(resolvedTarget);
            }
        });
    };
    StateNode.prototype.formatTransition = function (transitionConfig) {
        var _this = this;
        var normalizedTarget = utils_1.normalizeTarget(transitionConfig.target);
        var internal = 'internal' in transitionConfig
            ? transitionConfig.internal
            : normalizedTarget
                ? normalizedTarget.some(function (_target) { return utils_1.isString(_target) && _target[0] === _this.delimiter; })
                : true;
        var guards = this.machine.options.guards;
        var target = this.resolveTarget(normalizedTarget);
        var transition = __assign(__assign({}, transitionConfig), { actions: actions_1.toActionObjects(utils_1.toArray(transitionConfig.actions)), cond: utils_1.toGuard(transitionConfig.cond, guards), target: target, source: this, internal: internal, eventType: transitionConfig.event });
        Object.defineProperty(transition, 'toJSON', {
            value: function () { return (__assign(__assign({}, transition), { target: transition.target
                    ? transition.target.map(function (t) { return "#" + t.id; })
                    : undefined, source: "#{this.id}" })); }
        });
        return transition;
    };
    StateNode.prototype.formatTransitions = function () {
        var e_9, _a;
        var _this = this;
        var onConfig;
        if (!this.config.on) {
            onConfig = [];
        }
        else if (Array.isArray(this.config.on)) {
            onConfig = this.config.on;
        }
        else {
            var _b = this.config.on, _c = WILDCARD, _d = _b[_c], wildcardConfigs = _d === void 0 ? [] : _d, strictOnConfigs_1 = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
            onConfig = utils_1.flatten(utils_1.keys(strictOnConfigs_1)
                .map(function (key) {
                var arrayified = utils_1.toTransitionConfigArray(key, strictOnConfigs_1[key]);
                if (!environment_1.IS_PRODUCTION) {
                    validateArrayifiedTransitions(_this, key, arrayified);
                }
                return arrayified;
            })
                .concat(utils_1.toTransitionConfigArray(WILDCARD, wildcardConfigs)));
        }
        var doneConfig = this.config.onDone
            ? utils_1.toTransitionConfigArray(String(actions_1.done(this.id)), this.config.onDone)
            : [];
        var invokeConfig = utils_1.flatten(this.invoke.map(function (invokeDef) {
            var settleTransitions = [];
            if (invokeDef.onDone) {
                settleTransitions.push.apply(settleTransitions, __spread(utils_1.toTransitionConfigArray(String(actions_1.doneInvoke(invokeDef.id)), invokeDef.onDone)));
            }
            if (invokeDef.onError) {
                settleTransitions.push.apply(settleTransitions, __spread(utils_1.toTransitionConfigArray(String(actions_1.error(invokeDef.id)), invokeDef.onError)));
            }
            return settleTransitions;
        }));
        var delayedTransitions = this.after;
        var formattedTransitions = utils_1.flatten(__spread(doneConfig, invokeConfig, onConfig).map(function (transitionConfig) {
            return utils_1.toArray(transitionConfig).map(function (transition) {
                return _this.formatTransition(transition);
            });
        }));
        try {
            for (var delayedTransitions_1 = __values(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
                var delayedTransition = delayedTransitions_1_1.value;
                formattedTransitions.push(delayedTransition);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return formattedTransitions;
    };
    return StateNode;
}());
exports.StateNode = StateNode;

},{"./Actor":2,"./State":4,"./actionTypes":6,"./actions":7,"./constants":8,"./environment":10,"./stateUtils":17,"./types":18,"./utils":19}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
// xstate-specific action types
exports.start = types_1.ActionTypes.Start;
exports.stop = types_1.ActionTypes.Stop;
exports.raise = types_1.ActionTypes.Raise;
exports.send = types_1.ActionTypes.Send;
exports.cancel = types_1.ActionTypes.Cancel;
exports.nullEvent = types_1.ActionTypes.NullEvent;
exports.assign = types_1.ActionTypes.Assign;
exports.after = types_1.ActionTypes.After;
exports.doneState = types_1.ActionTypes.DoneState;
exports.log = types_1.ActionTypes.Log;
exports.init = types_1.ActionTypes.Init;
exports.invoke = types_1.ActionTypes.Invoke;
exports.errorExecution = types_1.ActionTypes.ErrorExecution;
exports.errorPlatform = types_1.ActionTypes.ErrorPlatform;
exports.error = types_1.ActionTypes.ErrorCustom;
exports.update = types_1.ActionTypes.Update;
exports.choose = types_1.ActionTypes.Choose;
exports.pure = types_1.ActionTypes.Pure;

},{"./types":18}],7:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var actionTypes = require("./actionTypes");
exports.actionTypes = actionTypes;
var utils_1 = require("./utils");
var utils_2 = require("./utils");
var environment_1 = require("./environment");
exports.initEvent = utils_1.toSCXMLEvent({ type: actionTypes.init });
function getActionFunction(actionType, actionFunctionMap) {
    return actionFunctionMap
        ? actionFunctionMap[actionType] || undefined
        : undefined;
}
exports.getActionFunction = getActionFunction;
function toActionObject(action, actionFunctionMap) {
    var actionObject;
    if (utils_1.isString(action) || typeof action === 'number') {
        var exec = getActionFunction(action, actionFunctionMap);
        if (utils_1.isFunction(exec)) {
            actionObject = {
                type: action,
                exec: exec
            };
        }
        else if (exec) {
            actionObject = exec;
        }
        else {
            actionObject = { type: action, exec: undefined };
        }
    }
    else if (utils_1.isFunction(action)) {
        actionObject = {
            // Convert action to string if unnamed
            type: action.name || action.toString(),
            exec: action
        };
    }
    else {
        var exec = getActionFunction(action.type, actionFunctionMap);
        if (utils_1.isFunction(exec)) {
            actionObject = __assign(__assign({}, action), { exec: exec });
        }
        else if (exec) {
            var type = action.type, other = __rest(action, ["type"]);
            actionObject = __assign(__assign({ type: type }, exec), other);
        }
        else {
            actionObject = action;
        }
    }
    Object.defineProperty(actionObject, 'toString', {
        value: function () { return actionObject.type; },
        enumerable: false,
        configurable: true
    });
    return actionObject;
}
exports.toActionObject = toActionObject;
exports.toActionObjects = function (action, actionFunctionMap) {
    if (!action) {
        return [];
    }
    var actions = utils_2.isArray(action) ? action : [action];
    return actions.map(function (subAction) {
        return toActionObject(subAction, actionFunctionMap);
    });
};
function toActivityDefinition(action) {
    var actionObject = toActionObject(action);
    return __assign(__assign({ id: utils_1.isString(action) ? action : actionObject.id }, actionObject), { type: actionObject.type });
}
exports.toActivityDefinition = toActivityDefinition;
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */
function raise(event) {
    if (!utils_1.isString(event)) {
        return send(event, { to: types_1.SpecialTargets.Internal });
    }
    return {
        type: actionTypes.raise,
        event: event
    };
}
exports.raise = raise;
function resolveRaise(action) {
    return {
        type: actionTypes.raise,
        _event: utils_1.toSCXMLEvent(action.event)
    };
}
exports.resolveRaise = resolveRaise;
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */
function send(event, options) {
    return {
        to: options ? options.to : undefined,
        type: actionTypes.send,
        event: utils_1.isFunction(event) ? event : utils_1.toEventObject(event),
        delay: options ? options.delay : undefined,
        id: options && options.id !== undefined
            ? options.id
            : utils_1.isFunction(event)
                ? event.name
                : utils_1.getEventType(event)
    };
}
exports.send = send;
function resolveSend(action, ctx, _event, delaysMap) {
    var meta = {
        _event: _event
    };
    // TODO: helper function for resolving Expr
    var resolvedEvent = utils_1.toSCXMLEvent(utils_1.isFunction(action.event)
        ? action.event(ctx, _event.data, meta)
        : action.event);
    var resolvedDelay;
    if (utils_1.isString(action.delay)) {
        var configDelay = delaysMap && delaysMap[action.delay];
        resolvedDelay = utils_1.isFunction(configDelay)
            ? configDelay(ctx, _event.data, meta)
            : configDelay;
    }
    else {
        resolvedDelay = utils_1.isFunction(action.delay)
            ? action.delay(ctx, _event.data, meta)
            : action.delay;
    }
    var resolvedTarget = utils_1.isFunction(action.to)
        ? action.to(ctx, _event.data, meta)
        : action.to;
    return __assign(__assign({}, action), { to: resolvedTarget, _event: resolvedEvent, event: resolvedEvent.data, delay: resolvedDelay });
}
exports.resolveSend = resolveSend;
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */
function sendParent(event, options) {
    return send(event, __assign(__assign({}, options), { to: types_1.SpecialTargets.Parent }));
}
exports.sendParent = sendParent;
/**
 * Sends an update event to this machine's parent.
 */
function sendUpdate() {
    return sendParent(actionTypes.update);
}
exports.sendUpdate = sendUpdate;
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */
function respond(event, options) {
    return send(event, __assign(__assign({}, options), { to: function (_, __, _a) {
            var _event = _a._event;
            return _event.origin; // TODO: handle when _event.origin is undefined
        } }));
}
exports.respond = respond;
var defaultLogExpr = function (context, event) { return ({
    context: context,
    event: event
}); };
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */
function log(expr, label) {
    if (expr === void 0) { expr = defaultLogExpr; }
    return {
        type: actionTypes.log,
        label: label,
        expr: expr
    };
}
exports.log = log;
exports.resolveLog = function (action, ctx, _event) { return (__assign(__assign({}, action), { value: utils_1.isString(action.expr)
        ? action.expr
        : action.expr(ctx, _event.data, {
            _event: _event
        }) })); };
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */
exports.cancel = function (sendId) {
    return {
        type: actionTypes.cancel,
        sendId: sendId
    };
};
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */
function start(activity) {
    var activityDef = toActivityDefinition(activity);
    return {
        type: types_1.ActionTypes.Start,
        activity: activityDef,
        exec: undefined
    };
}
exports.start = start;
/**
 * Stops an activity.
 *
 * @param activity The activity to stop.
 */
function stop(activity) {
    var activityDef = toActivityDefinition(activity);
    return {
        type: types_1.ActionTypes.Stop,
        activity: activityDef,
        exec: undefined
    };
}
exports.stop = stop;
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */
exports.assign = function (assignment) {
    return {
        type: actionTypes.assign,
        assignment: assignment
    };
};
function isActionObject(action) {
    return typeof action === 'object' && 'type' in action;
}
exports.isActionObject = isActionObject;
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function after(delayRef, id) {
    var idSuffix = id ? "#" + id : '';
    return types_1.ActionTypes.After + "(" + delayRef + ")" + idSuffix;
}
exports.after = after;
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */
function done(id, data) {
    var type = types_1.ActionTypes.DoneState + "." + id;
    var eventObject = {
        type: type,
        data: data
    };
    eventObject.toString = function () { return type; };
    return eventObject;
}
exports.done = done;
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */
function doneInvoke(id, data) {
    var type = types_1.ActionTypes.DoneInvoke + "." + id;
    var eventObject = {
        type: type,
        data: data
    };
    eventObject.toString = function () { return type; };
    return eventObject;
}
exports.doneInvoke = doneInvoke;
function error(id, data) {
    var type = types_1.ActionTypes.ErrorPlatform + "." + id;
    var eventObject = { type: type, data: data };
    eventObject.toString = function () { return type; };
    return eventObject;
}
exports.error = error;
function pure(getActions) {
    return {
        type: types_1.ActionTypes.Pure,
        get: getActions
    };
}
exports.pure = pure;
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */
function forwardTo(target, options) {
    return send(function (_, event) { return event; }, __assign(__assign({}, options), { to: target }));
}
exports.forwardTo = forwardTo;
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */
function escalate(errorData, options) {
    return sendParent(function (context, event, meta) {
        return {
            type: actionTypes.error,
            data: utils_1.isFunction(errorData)
                ? errorData(context, event, meta)
                : errorData
        };
    }, __assign(__assign({}, options), { to: types_1.SpecialTargets.Parent }));
}
exports.escalate = escalate;
function choose(conds) {
    return {
        type: types_1.ActionTypes.Choose,
        conds: conds
    };
}
exports.choose = choose;
function resolveActions(machine, currentState, currentContext, _event, actions) {
    var _a = __read(utils_1.partition(actions, function (action) {
        return action.type === actionTypes.assign;
    }), 2), assignActions = _a[0], otherActions = _a[1];
    var updatedContext = assignActions.length
        ? utils_1.updateContext(currentContext, _event, assignActions, currentState)
        : currentContext;
    var resolvedActions = utils_1.flatten(otherActions.map(function (actionObject) {
        var _a;
        switch (actionObject.type) {
            case actionTypes.raise:
                return resolveRaise(actionObject);
            case actionTypes.send:
                var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init
                if (!environment_1.IS_PRODUCTION) {
                    // warn after resolving as we can create better contextual message here
                    utils_1.warn(!utils_1.isString(actionObject.delay) ||
                        typeof sendAction.delay === 'number', 
                    // tslint:disable-next-line:max-line-length
                    "No delay reference for delay expression '" + actionObject.delay + "' was found on machine '" + machine.id + "'");
                }
                return sendAction;
            case actionTypes.log:
                return exports.resolveLog(actionObject, updatedContext, _event);
            case actionTypes.choose: {
                var chooseAction = actionObject;
                var matchedActions = (_a = chooseAction.conds.find(function (condition) {
                    var guard = utils_1.toGuard(condition.cond, machine.options.guards);
                    return (!guard ||
                        utils_1.evaluateGuard(machine, guard, updatedContext, _event, currentState));
                })) === null || _a === void 0 ? void 0 : _a.actions;
                if (!matchedActions) {
                    return [];
                }
                var resolved = resolveActions(machine, currentState, updatedContext, _event, exports.toActionObjects(utils_1.toArray(matchedActions)));
                updatedContext = resolved[1];
                return resolved[0];
            }
            case actionTypes.pure: {
                var matchedActions = actionObject.get(updatedContext, _event.data);
                if (!matchedActions) {
                    return [];
                }
                var resolved = resolveActions(machine, currentState, updatedContext, _event, exports.toActionObjects(utils_1.toArray(matchedActions)));
                updatedContext = resolved[1];
                return resolved[0];
            }
            default:
                return toActionObject(actionObject, machine.options.actions);
        }
    }));
    return [resolvedActions, updatedContext];
}
exports.resolveActions = resolveActions;

},{"./actionTypes":6,"./environment":10,"./types":18,"./utils":19}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE_DELIMITER = '.';
exports.EMPTY_ACTIVITY_MAP = {};
exports.DEFAULT_GUARD_TYPE = 'xstate.guard';
exports.TARGETLESS_KEY = '';

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
function getDevTools() {
    var w = window;
    if (!!w.__xstate__) {
        return w.__xstate__;
    }
    return undefined;
}
function registerService(service) {
    if (environment_1.IS_PRODUCTION || typeof window === 'undefined') {
        return;
    }
    var devTools = getDevTools();
    if (devTools) {
        devTools.register(service);
    }
}
exports.registerService = registerService;

},{"./environment":10}],10:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_PRODUCTION = process.env.NODE_ENV === 'production';

}).call(this,require('_process'))
},{"_process":1}],11:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
exports.matchesState = utils_1.matchesState;
var mapState_1 = require("./mapState");
exports.mapState = mapState_1.mapState;
var StateNode_1 = require("./StateNode");
exports.StateNode = StateNode_1.StateNode;
var State_1 = require("./State");
exports.State = State_1.State;
var Machine_1 = require("./Machine");
exports.Machine = Machine_1.Machine;
exports.createMachine = Machine_1.createMachine;
var actions_1 = require("./actions");
exports.send = actions_1.send;
exports.sendParent = actions_1.sendParent;
exports.sendUpdate = actions_1.sendUpdate;
exports.assign = actions_1.assign;
exports.doneInvoke = actions_1.doneInvoke;
exports.forwardTo = actions_1.forwardTo;
var interpreter_1 = require("./interpreter");
exports.interpret = interpreter_1.interpret;
exports.Interpreter = interpreter_1.Interpreter;
exports.spawn = interpreter_1.spawn;
var match_1 = require("./match");
exports.matchState = match_1.matchState;
var actions = {
    raise: actions_1.raise,
    send: actions_1.send,
    sendParent: actions_1.sendParent,
    sendUpdate: actions_1.sendUpdate,
    log: actions_1.log,
    cancel: actions_1.cancel,
    start: actions_1.start,
    stop: actions_1.stop,
    assign: actions_1.assign,
    after: actions_1.after,
    done: actions_1.done,
    respond: actions_1.respond,
    forwardTo: actions_1.forwardTo,
    escalate: actions_1.escalate,
    choose: actions_1.choose,
    pure: actions_1.pure
};
exports.actions = actions;
__export(require("./types"));

},{"./Machine":3,"./State":4,"./StateNode":5,"./actions":7,"./interpreter":12,"./mapState":13,"./match":14,"./types":18,"./utils":19}],12:[function(require,module,exports){
(function (global){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var State_1 = require("./State");
var actionTypes = require("./actionTypes");
var actions_1 = require("./actions");
var environment_1 = require("./environment");
var utils_1 = require("./utils");
var scheduler_1 = require("./scheduler");
var Actor_1 = require("./Actor");
var stateUtils_1 = require("./stateUtils");
var registry_1 = require("./registry");
var devTools_1 = require("./devTools");
var DEFAULT_SPAWN_OPTIONS = { sync: false, autoForward: false };
/**
 * Maintains a stack of the current service in scope.
 * This is used to provide the correct service to spawn().
 *
 * @private
 */
var withServiceScope = (function () {
    var serviceStack = [];
    return function (service, fn) {
        service && serviceStack.push(service);
        var result = fn(service || serviceStack[serviceStack.length - 1]);
        service && serviceStack.pop();
        return result;
    };
})();
var InterpreterStatus;
(function (InterpreterStatus) {
    InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
    InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
    InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
})(InterpreterStatus || (InterpreterStatus = {}));
var Interpreter = /** @class */ (function () {
    /**
     * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
     *
     * @param machine The machine to be interpreted
     * @param options Interpreter options
     */
    function Interpreter(machine, options) {
        var _this = this;
        if (options === void 0) { options = Interpreter.defaultOptions; }
        this.machine = machine;
        this.scheduler = new scheduler_1.Scheduler();
        this.delayedEventsMap = {};
        this.listeners = new Set();
        this.contextListeners = new Set();
        this.stopListeners = new Set();
        this.doneListeners = new Set();
        this.eventListeners = new Set();
        this.sendListeners = new Set();
        /**
         * Whether the service is started.
         */
        this.initialized = false;
        this._status = InterpreterStatus.NotStarted;
        this.children = new Map();
        this.forwardTo = new Set();
        /**
         * Alias for Interpreter.prototype.start
         */
        this.init = this.start;
        /**
         * Sends an event to the running interpreter to trigger a transition.
         *
         * An array of events (batched) can be sent as well, which will send all
         * batched events to the running interpreter. The listeners will be
         * notified only **once** when all events are processed.
         *
         * @param event The event(s) to send
         */
        this.send = function (event, payload) {
            if (utils_1.isArray(event)) {
                _this.batch(event);
                return _this.state;
            }
            var _event = utils_1.toSCXMLEvent(utils_1.toEventObject(event, payload));
            if (_this._status === InterpreterStatus.Stopped) {
                // do nothing
                if (!environment_1.IS_PRODUCTION) {
                    utils_1.warn(false, "Event \"" + _event.name + "\" was sent to stopped service \"" + _this.machine.id + "\". This service has already reached its final state, and will not transition.\nEvent: " + JSON.stringify(_event.data));
                }
                return _this.state;
            }
            if (_this._status === InterpreterStatus.NotStarted &&
                _this.options.deferEvents) {
                // tslint:disable-next-line:no-console
                if (!environment_1.IS_PRODUCTION) {
                    utils_1.warn(false, "Event \"" + _event.name + "\" was sent to uninitialized service \"" + _this.machine.id + "\" and is deferred. Make sure .start() is called for this service.\nEvent: " + JSON.stringify(_event.data));
                }
            }
            else if (_this._status !== InterpreterStatus.Running) {
                throw new Error("Event \"" + _event.name + "\" was sent to uninitialized service \"" + _this.machine.id + "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: " + JSON.stringify(_event.data));
            }
            _this.scheduler.schedule(function () {
                // Forward copy of event to child actors
                _this.forward(_event);
                var nextState = _this.nextState(_event);
                _this.update(nextState, _event);
            });
            return _this._state; // TODO: deprecate (should return void)
            // tslint:disable-next-line:semicolon
        };
        this.sendTo = function (event, to) {
            var isParent = _this.parent && (to === types_1.SpecialTargets.Parent || _this.parent.id === to);
            var target = isParent
                ? _this.parent
                : Actor_1.isActor(to)
                    ? to
                    : _this.children.get(to) || registry_1.registry.get(to);
            if (!target) {
                if (!isParent) {
                    throw new Error("Unable to send event to child '" + to + "' from service '" + _this.id + "'.");
                }
                // tslint:disable-next-line:no-console
                if (!environment_1.IS_PRODUCTION) {
                    utils_1.warn(false, "Service '" + _this.id + "' has no parent: unable to send event " + event.type);
                }
                return;
            }
            if ('machine' in target) {
                // Send SCXML events to machines
                target.send(__assign(__assign({}, event), { name: event.name === actionTypes.error ? "" + actions_1.error(_this.id) : event.name, origin: _this.sessionId }));
            }
            else {
                // Send normal events to other targets
                target.send(event.data);
            }
        };
        var resolvedOptions = __assign(__assign({}, Interpreter.defaultOptions), options);
        var clock = resolvedOptions.clock, logger = resolvedOptions.logger, parent = resolvedOptions.parent, id = resolvedOptions.id;
        var resolvedId = id !== undefined ? id : machine.id;
        this.id = resolvedId;
        this.logger = logger;
        this.clock = clock;
        this.parent = parent;
        this.options = resolvedOptions;
        this.scheduler = new scheduler_1.Scheduler({
            deferEvents: this.options.deferEvents
        });
        this.sessionId = registry_1.registry.bookId();
    }
    Object.defineProperty(Interpreter.prototype, "initialState", {
        get: function () {
            var _this = this;
            if (this._initialState) {
                return this._initialState;
            }
            return withServiceScope(this, function () {
                _this._initialState = _this.machine.initialState;
                return _this._initialState;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Interpreter.prototype, "state", {
        get: function () {
            if (!environment_1.IS_PRODUCTION) {
                utils_1.warn(this._status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '" + this.id + "'. Make sure the service is started first.");
            }
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Executes the actions of the given state, with that state's `context` and `event`.
     *
     * @param state The state whose actions will be executed
     * @param actionsConfig The action implementations to use
     */
    Interpreter.prototype.execute = function (state, actionsConfig) {
        var e_1, _a;
        try {
            for (var _b = __values(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var action = _c.value;
                this.exec(action, state, actionsConfig);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Interpreter.prototype.update = function (state, _event) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        var _this = this;
        // Attach session ID to state
        state._sessionid = this.sessionId;
        // Update state
        this._state = state;
        // Execute actions
        if (this.options.execute) {
            this.execute(this.state);
        }
        // Dev tools
        if (this.devTools) {
            this.devTools.send(_event.data, state);
        }
        // Execute listeners
        if (state.event) {
            try {
                for (var _e = __values(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var listener = _f.value;
                    listener(state.event);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        try {
            for (var _g = __values(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
                var listener = _h.value;
                listener(state, state.event);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _j = __values(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
                var contextListener = _k.value;
                contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var isDone = stateUtils_1.isInFinalState(state.configuration || [], this.machine);
        if (this.state.configuration && isDone) {
            // get final child state node
            var finalChildStateNode = state.configuration.find(function (sn) { return sn.type === 'final' && sn.parent === _this.machine; });
            var doneData = finalChildStateNode && finalChildStateNode.data
                ? utils_1.mapContext(finalChildStateNode.data, state.context, _event)
                : undefined;
            try {
                for (var _l = __values(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var listener = _m.value;
                    listener(actions_1.doneInvoke(this.id, doneData));
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_5) throw e_5.error; }
            }
            this.stop();
        }
    };
    /*
     * Adds a listener that is notified whenever a state transition happens. The listener is called with
     * the next state and the event object that caused the state transition.
     *
     * @param listener The state listener
     */
    Interpreter.prototype.onTransition = function (listener) {
        this.listeners.add(listener);
        // Send current state to listener
        if (this._status === InterpreterStatus.Running) {
            listener(this.state, this.state.event);
        }
        return this;
    };
    Interpreter.prototype.subscribe = function (nextListenerOrObserver, 
    // @ts-ignore
    errorListener, completeListener) {
        var _this = this;
        if (!nextListenerOrObserver) {
            return { unsubscribe: function () { return void 0; } };
        }
        var listener;
        var resolvedCompleteListener = completeListener;
        if (typeof nextListenerOrObserver === 'function') {
            listener = nextListenerOrObserver;
        }
        else {
            listener = nextListenerOrObserver.next.bind(nextListenerOrObserver);
            resolvedCompleteListener = nextListenerOrObserver.complete.bind(nextListenerOrObserver);
        }
        this.listeners.add(listener);
        // Send current state to listener
        if (this._status === InterpreterStatus.Running) {
            listener(this.state);
        }
        if (resolvedCompleteListener) {
            this.onDone(resolvedCompleteListener);
        }
        return {
            unsubscribe: function () {
                listener && _this.listeners.delete(listener);
                resolvedCompleteListener &&
                    _this.doneListeners.delete(resolvedCompleteListener);
            }
        };
    };
    /**
     * Adds an event listener that is notified whenever an event is sent to the running interpreter.
     * @param listener The event listener
     */
    Interpreter.prototype.onEvent = function (listener) {
        this.eventListeners.add(listener);
        return this;
    };
    /**
     * Adds an event listener that is notified whenever a `send` event occurs.
     * @param listener The event listener
     */
    Interpreter.prototype.onSend = function (listener) {
        this.sendListeners.add(listener);
        return this;
    };
    /**
     * Adds a context listener that is notified whenever the state context changes.
     * @param listener The context listener
     */
    Interpreter.prototype.onChange = function (listener) {
        this.contextListeners.add(listener);
        return this;
    };
    /**
     * Adds a listener that is notified when the machine is stopped.
     * @param listener The listener
     */
    Interpreter.prototype.onStop = function (listener) {
        this.stopListeners.add(listener);
        return this;
    };
    /**
     * Adds a state listener that is notified when the statechart has reached its final state.
     * @param listener The state listener
     */
    Interpreter.prototype.onDone = function (listener) {
        this.doneListeners.add(listener);
        return this;
    };
    /**
     * Removes a listener.
     * @param listener The listener to remove
     */
    Interpreter.prototype.off = function (listener) {
        this.listeners.delete(listener);
        this.eventListeners.delete(listener);
        this.sendListeners.delete(listener);
        this.stopListeners.delete(listener);
        this.doneListeners.delete(listener);
        this.contextListeners.delete(listener);
        return this;
    };
    /**
     * Starts the interpreter from the given state, or the initial state.
     * @param initialState The state to start the statechart from
     */
    Interpreter.prototype.start = function (initialState) {
        var _this = this;
        if (this._status === InterpreterStatus.Running) {
            // Do not restart the service if it is already started
            return this;
        }
        registry_1.registry.register(this.sessionId, this);
        this.initialized = true;
        this._status = InterpreterStatus.Running;
        var resolvedState = initialState === undefined
            ? this.initialState
            : withServiceScope(this, function () {
                return State_1.isState(initialState)
                    ? _this.machine.resolveState(initialState)
                    : _this.machine.resolveState(State_1.State.from(initialState, _this.machine.context));
            });
        if (this.options.devTools) {
            this.attachDev();
        }
        this.scheduler.initialize(function () {
            _this.update(resolvedState, actions_1.initEvent);
        });
        return this;
    };
    /**
     * Stops the interpreter and unsubscribe all listeners.
     *
     * This will also notify the `onStop` listeners.
     */
    Interpreter.prototype.stop = function () {
        var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;
        try {
            for (var _f = __values(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
                var listener = _g.value;
                this.listeners.delete(listener);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            for (var _h = __values(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
                var listener = _j.value;
                // call listener, then remove
                listener();
                this.stopListeners.delete(listener);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
            }
            finally { if (e_7) throw e_7.error; }
        }
        try {
            for (var _k = __values(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
                var listener = _l.value;
                this.contextListeners.delete(listener);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
            }
            finally { if (e_8) throw e_8.error; }
        }
        try {
            for (var _m = __values(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
                var listener = _o.value;
                this.doneListeners.delete(listener);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
            }
            finally { if (e_9) throw e_9.error; }
        }
        // Stop all children
        this.children.forEach(function (child) {
            if (utils_1.isFunction(child.stop)) {
                child.stop();
            }
        });
        try {
            // Cancel all delayed events
            for (var _p = __values(utils_1.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
                var key = _q.value;
                this.clock.clearTimeout(this.delayedEventsMap[key]);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
            }
            finally { if (e_10) throw e_10.error; }
        }
        this.scheduler.clear();
        this.initialized = false;
        this._status = InterpreterStatus.Stopped;
        registry_1.registry.free(this.sessionId);
        return this;
    };
    Interpreter.prototype.batch = function (events) {
        var _this = this;
        if (this._status === InterpreterStatus.NotStarted &&
            this.options.deferEvents) {
            // tslint:disable-next-line:no-console
            if (!environment_1.IS_PRODUCTION) {
                utils_1.warn(false, events.length + " event(s) were sent to uninitialized service \"" + this.machine.id + "\" and are deferred. Make sure .start() is called for this service.\nEvent: " + JSON.stringify(event));
            }
        }
        else if (this._status !== InterpreterStatus.Running) {
            throw new Error(
            // tslint:disable-next-line:max-line-length
            events.length + " event(s) were sent to uninitialized service \"" + this.machine.id + "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.");
        }
        this.scheduler.schedule(function () {
            var e_11, _a;
            var nextState = _this.state;
            var batchChanged = false;
            var batchedActions = [];
            var _loop_1 = function (event_1) {
                var _event = utils_1.toSCXMLEvent(event_1);
                _this.forward(_event);
                nextState = withServiceScope(_this, function () {
                    return _this.machine.transition(nextState, _event);
                });
                batchedActions.push.apply(batchedActions, __spread(nextState.actions.map(function (a) {
                    return State_1.bindActionToState(a, nextState);
                })));
                batchChanged = batchChanged || !!nextState.changed;
            };
            try {
                for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                    var event_1 = events_1_1.value;
                    _loop_1(event_1);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
                }
                finally { if (e_11) throw e_11.error; }
            }
            nextState.changed = batchChanged;
            nextState.actions = batchedActions;
            _this.update(nextState, utils_1.toSCXMLEvent(events[events.length - 1]));
        });
    };
    /**
     * Returns a send function bound to this interpreter instance.
     *
     * @param event The event to be sent by the sender.
     */
    Interpreter.prototype.sender = function (event) {
        return this.send.bind(this, event);
    };
    /**
     * Returns the next state given the interpreter's current state and the event.
     *
     * This is a pure method that does _not_ update the interpreter's state.
     *
     * @param event The event to determine the next state
     */
    Interpreter.prototype.nextState = function (event) {
        var _this = this;
        var _event = utils_1.toSCXMLEvent(event);
        if (_event.name.indexOf(actionTypes.errorPlatform) === 0 &&
            !this.state.nextEvents.some(function (nextEvent) { return nextEvent.indexOf(actionTypes.errorPlatform) === 0; })) {
            throw _event.data.data;
        }
        var nextState = withServiceScope(this, function () {
            return _this.machine.transition(_this.state, _event);
        });
        return nextState;
    };
    Interpreter.prototype.forward = function (event) {
        var e_12, _a;
        try {
            for (var _b = __values(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
                var id = _c.value;
                var child = this.children.get(id);
                if (!child) {
                    throw new Error("Unable to forward event '" + event + "' from interpreter '" + this.id + "' to nonexistant child '" + id + "'.");
                }
                child.send(event);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
    };
    Interpreter.prototype.defer = function (sendAction) {
        var _this = this;
        this.delayedEventsMap[sendAction.id] = this.clock.setTimeout(function () {
            if (sendAction.to) {
                _this.sendTo(sendAction._event, sendAction.to);
            }
            else {
                _this.send(sendAction._event);
            }
        }, sendAction.delay);
    };
    Interpreter.prototype.cancel = function (sendId) {
        this.clock.clearTimeout(this.delayedEventsMap[sendId]);
        delete this.delayedEventsMap[sendId];
    };
    Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
        var context = state.context, _event = state._event;
        var actionOrExec = actions_1.getActionFunction(action.type, actionFunctionMap) || action.exec;
        var exec = utils_1.isFunction(actionOrExec)
            ? actionOrExec
            : actionOrExec
                ? actionOrExec.exec
                : action.exec;
        if (exec) {
            try {
                return exec(context, _event.data, {
                    action: action,
                    state: this.state,
                    _event: _event
                });
            }
            catch (err) {
                if (this.parent) {
                    this.parent.send({
                        type: 'xstate.error',
                        data: err
                    });
                }
                throw err;
            }
        }
        switch (action.type) {
            case actionTypes.send:
                var sendAction = action;
                if (typeof sendAction.delay === 'number') {
                    this.defer(sendAction);
                    return;
                }
                else {
                    if (sendAction.to) {
                        this.sendTo(sendAction._event, sendAction.to);
                    }
                    else {
                        this.send(sendAction._event);
                    }
                }
                break;
            case actionTypes.cancel:
                this.cancel(action.sendId);
                break;
            case actionTypes.start: {
                var activity = action
                    .activity;
                // If the activity will be stopped right after it's started
                // (such as in transient states)
                // don't bother starting the activity.
                if (!this.state.activities[activity.type]) {
                    break;
                }
                // Invoked services
                if (activity.type === types_1.ActionTypes.Invoke) {
                    var serviceCreator = this
                        .machine.options.services
                        ? this.machine.options.services[activity.src]
                        : undefined;
                    var id = activity.id, data = activity.data;
                    if (!environment_1.IS_PRODUCTION) {
                        utils_1.warn(!('forward' in activity), 
                        // tslint:disable-next-line:max-line-length
                        "`forward` property is deprecated (found in invocation of '" + activity.src + "' in in machine '" + this.machine.id + "'). " +
                            "Please use `autoForward` instead.");
                    }
                    var autoForward = 'autoForward' in activity
                        ? activity.autoForward
                        : !!activity.forward;
                    if (!serviceCreator) {
                        // tslint:disable-next-line:no-console
                        if (!environment_1.IS_PRODUCTION) {
                            utils_1.warn(false, "No service found for invocation '" + activity.src + "' in machine '" + this.machine.id + "'.");
                        }
                        return;
                    }
                    var source = utils_1.isFunction(serviceCreator)
                        ? serviceCreator(context, _event.data)
                        : serviceCreator;
                    if (utils_1.isPromiseLike(source)) {
                        this.state.children[id] = this.spawnPromise(Promise.resolve(source), id);
                    }
                    else if (utils_1.isFunction(source)) {
                        this.state.children[id] = this.spawnCallback(source, id);
                    }
                    else if (utils_1.isObservable(source)) {
                        this.state.children[id] = this.spawnObservable(source, id);
                    }
                    else if (utils_1.isMachine(source)) {
                        // TODO: try/catch here
                        this.state.children[id] = this.spawnMachine(data
                            ? source.withContext(utils_1.mapContext(data, context, _event))
                            : source, {
                            id: id,
                            autoForward: autoForward
                        });
                    }
                    else {
                        // service is string
                    }
                }
                else {
                    this.spawnActivity(activity);
                }
                break;
            }
            case actionTypes.stop: {
                this.stopChild(action.activity.id);
                break;
            }
            case actionTypes.log:
                var label = action.label, value = action.value;
                if (label) {
                    this.logger(label, value);
                }
                else {
                    this.logger(value);
                }
                break;
            default:
                if (!environment_1.IS_PRODUCTION) {
                    utils_1.warn(false, "No implementation found for action type '" + action.type + "'");
                }
                break;
        }
        return undefined;
    };
    Interpreter.prototype.removeChild = function (childId) {
        this.children.delete(childId);
        this.forwardTo.delete(childId);
        delete this.state.children[childId];
    };
    Interpreter.prototype.stopChild = function (childId) {
        var child = this.children.get(childId);
        if (!child) {
            return;
        }
        this.removeChild(childId);
        if (utils_1.isFunction(child.stop)) {
            child.stop();
        }
    };
    Interpreter.prototype.spawn = function (entity, name, options) {
        if (utils_1.isPromiseLike(entity)) {
            return this.spawnPromise(Promise.resolve(entity), name);
        }
        else if (utils_1.isFunction(entity)) {
            return this.spawnCallback(entity, name);
        }
        else if (Actor_1.isActor(entity)) {
            return this.spawnActor(entity);
        }
        else if (utils_1.isObservable(entity)) {
            return this.spawnObservable(entity, name);
        }
        else if (utils_1.isMachine(entity)) {
            return this.spawnMachine(entity, __assign(__assign({}, options), { id: name }));
        }
        else {
            throw new Error("Unable to spawn entity \"" + name + "\" of type \"" + typeof entity + "\".");
        }
    };
    Interpreter.prototype.spawnMachine = function (machine, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var childService = new Interpreter(machine, __assign(__assign({}, this.options), { parent: this, id: options.id || machine.id }));
        var resolvedOptions = __assign(__assign({}, DEFAULT_SPAWN_OPTIONS), options);
        if (resolvedOptions.sync) {
            childService.onTransition(function (state) {
                _this.send(actionTypes.update, {
                    state: state,
                    id: childService.id
                });
            });
        }
        var actor = childService;
        this.children.set(childService.id, actor);
        if (resolvedOptions.autoForward) {
            this.forwardTo.add(childService.id);
        }
        childService
            .onDone(function (doneEvent) {
            _this.removeChild(childService.id);
            _this.send(utils_1.toSCXMLEvent(doneEvent, { origin: childService.id }));
        })
            .start();
        return actor;
    };
    Interpreter.prototype.spawnPromise = function (promise, id) {
        var _this = this;
        var canceled = false;
        promise.then(function (response) {
            if (!canceled) {
                _this.removeChild(id);
                _this.send(utils_1.toSCXMLEvent(actions_1.doneInvoke(id, response), { origin: id }));
            }
        }, function (errorData) {
            if (!canceled) {
                _this.removeChild(id);
                var errorEvent = actions_1.error(id, errorData);
                try {
                    // Send "error.platform.id" to this (parent).
                    _this.send(utils_1.toSCXMLEvent(errorEvent, { origin: id }));
                }
                catch (error) {
                    utils_1.reportUnhandledExceptionOnInvocation(errorData, error, id);
                    if (_this.devTools) {
                        _this.devTools.send(errorEvent, _this.state);
                    }
                    if (_this.machine.strict) {
                        // it would be better to always stop the state machine if unhandled
                        // exception/promise rejection happens but because we don't want to
                        // break existing code so enforce it on strict mode only especially so
                        // because documentation says that onError is optional
                        _this.stop();
                    }
                }
            }
        });
        var actor = {
            id: id,
            send: function () { return void 0; },
            subscribe: function (next, handleError, complete) {
                var unsubscribed = false;
                promise.then(function (response) {
                    if (unsubscribed) {
                        return;
                    }
                    next && next(response);
                    if (unsubscribed) {
                        return;
                    }
                    complete && complete();
                }, function (err) {
                    if (unsubscribed) {
                        return;
                    }
                    handleError(err);
                });
                return {
                    unsubscribe: function () { return (unsubscribed = true); }
                };
            },
            stop: function () {
                canceled = true;
            },
            toJSON: function () {
                return { id: id };
            }
        };
        this.children.set(id, actor);
        return actor;
    };
    Interpreter.prototype.spawnCallback = function (callback, id) {
        var _this = this;
        var canceled = false;
        var receivers = new Set();
        var listeners = new Set();
        var receive = function (e) {
            listeners.forEach(function (listener) { return listener(e); });
            if (canceled) {
                return;
            }
            _this.send(e);
        };
        var callbackStop;
        try {
            callbackStop = callback(receive, function (newListener) {
                receivers.add(newListener);
            });
        }
        catch (err) {
            this.send(actions_1.error(id, err));
        }
        if (utils_1.isPromiseLike(callbackStop)) {
            // it turned out to be an async function, can't reliably check this before calling `callback`
            // because transpiled async functions are not recognizable
            return this.spawnPromise(callbackStop, id);
        }
        var actor = {
            id: id,
            send: function (event) { return receivers.forEach(function (receiver) { return receiver(event); }); },
            subscribe: function (next) {
                listeners.add(next);
                return {
                    unsubscribe: function () {
                        listeners.delete(next);
                    }
                };
            },
            stop: function () {
                canceled = true;
                if (utils_1.isFunction(callbackStop)) {
                    callbackStop();
                }
            },
            toJSON: function () {
                return { id: id };
            }
        };
        this.children.set(id, actor);
        return actor;
    };
    Interpreter.prototype.spawnObservable = function (source, id) {
        var _this = this;
        var subscription = source.subscribe(function (value) {
            _this.send(utils_1.toSCXMLEvent(value, { origin: id }));
        }, function (err) {
            _this.removeChild(id);
            _this.send(utils_1.toSCXMLEvent(actions_1.error(id, err), { origin: id }));
        }, function () {
            _this.removeChild(id);
            _this.send(utils_1.toSCXMLEvent(actions_1.doneInvoke(id), { origin: id }));
        });
        var actor = {
            id: id,
            send: function () { return void 0; },
            subscribe: function (next, handleError, complete) {
                return source.subscribe(next, handleError, complete);
            },
            stop: function () { return subscription.unsubscribe(); },
            toJSON: function () {
                return { id: id };
            }
        };
        this.children.set(id, actor);
        return actor;
    };
    Interpreter.prototype.spawnActor = function (actor) {
        this.children.set(actor.id, actor);
        return actor;
    };
    Interpreter.prototype.spawnActivity = function (activity) {
        var implementation = this.machine.options && this.machine.options.activities
            ? this.machine.options.activities[activity.type]
            : undefined;
        if (!implementation) {
            if (!environment_1.IS_PRODUCTION) {
                utils_1.warn(false, "No implementation found for activity '" + activity.type + "'");
            }
            // tslint:disable-next-line:no-console
            return;
        }
        // Start implementation
        var dispose = implementation(this.state.context, activity);
        this.spawnEffect(activity.id, dispose);
    };
    Interpreter.prototype.spawnEffect = function (id, dispose) {
        this.children.set(id, {
            id: id,
            send: function () { return void 0; },
            subscribe: function () {
                return { unsubscribe: function () { return void 0; } };
            },
            stop: dispose || undefined,
            toJSON: function () {
                return { id: id };
            }
        });
    };
    Interpreter.prototype.attachDev = function () {
        if (this.options.devTools && typeof window !== 'undefined') {
            if (window.__REDUX_DEVTOOLS_EXTENSION__) {
                var devToolsOptions = typeof this.options.devTools === 'object'
                    ? this.options.devTools
                    : undefined;
                this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(__assign(__assign({ name: this.id, autoPause: true, stateSanitizer: function (state) {
                        return {
                            value: state.value,
                            context: state.context,
                            actions: state.actions
                        };
                    } }, devToolsOptions), { features: __assign({ jump: false, skip: false }, (devToolsOptions
                        ? devToolsOptions.features
                        : undefined)) }), this.machine);
                this.devTools.init(this.state);
            }
            // add XState-specific dev tooling hook
            devTools_1.registerService(this);
        }
    };
    Interpreter.prototype.toJSON = function () {
        return {
            id: this.id
        };
    };
    Interpreter.prototype[utils_1.symbolObservable] = function () {
        return this;
    };
    /**
     * The default interpreter options:
     *
     * - `clock` uses the global `setTimeout` and `clearTimeout` functions
     * - `logger` uses the global `console.log()` method
     */
    Interpreter.defaultOptions = (function (global) { return ({
        execute: true,
        deferEvents: true,
        clock: {
            setTimeout: function (fn, ms) {
                return global.setTimeout.call(null, fn, ms);
            },
            clearTimeout: function (id) {
                return global.clearTimeout.call(null, id);
            }
        },
        logger: global.console.log.bind(console),
        devTools: false
    }); })(typeof window === 'undefined' ? global : window);
    Interpreter.interpret = interpret;
    return Interpreter;
}());
exports.Interpreter = Interpreter;
var createNullActor = function (name) {
    if (name === void 0) { name = 'null'; }
    return ({
        id: name,
        send: function () { return void 0; },
        subscribe: function () {
            // tslint:disable-next-line:no-empty
            return { unsubscribe: function () { } };
        },
        toJSON: function () { return ({ id: name }); }
    });
};
var resolveSpawnOptions = function (nameOrOptions) {
    if (utils_1.isString(nameOrOptions)) {
        return __assign(__assign({}, DEFAULT_SPAWN_OPTIONS), { name: nameOrOptions });
    }
    return __assign(__assign(__assign({}, DEFAULT_SPAWN_OPTIONS), { name: utils_1.uniqueId() }), nameOrOptions);
};
function spawn(entity, nameOrOptions) {
    var resolvedOptions = resolveSpawnOptions(nameOrOptions);
    return withServiceScope(undefined, function (service) {
        if (!environment_1.IS_PRODUCTION) {
            utils_1.warn(!!service, "Attempted to spawn an Actor (ID: \"" + (utils_1.isMachine(entity) ? entity.id : 'undefined') + "\") outside of a service. This will have no effect.");
        }
        if (service) {
            return service.spawn(entity, resolvedOptions.name, resolvedOptions);
        }
        else {
            return createNullActor(resolvedOptions.name);
        }
    });
}
exports.spawn = spawn;
/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */
function interpret(machine, options) {
    var interpreter = new Interpreter(machine, options);
    return interpreter;
}
exports.interpret = interpret;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Actor":2,"./State":4,"./actionTypes":6,"./actions":7,"./devTools":9,"./environment":10,"./registry":15,"./scheduler":16,"./stateUtils":17,"./types":18,"./utils":19}],13:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function mapState(stateMap, stateId) {
    var e_1, _a;
    var foundStateId;
    try {
        for (var _b = __values(utils_1.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var mappedStateId = _c.value;
            if (utils_1.matchesState(mappedStateId, stateId) &&
                (!foundStateId || stateId.length > foundStateId.length)) {
                foundStateId = mappedStateId;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return stateMap[foundStateId];
}
exports.mapState = mapState;

},{"./utils":19}],14:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = require("./State");
function matchState(state, patterns, defaultValue) {
    var e_1, _a;
    var resolvedState = State_1.State.from(state, state instanceof State_1.State ? state.context : undefined);
    try {
        for (var patterns_1 = __values(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
            var _b = __read(patterns_1_1.value, 2), stateValue = _b[0], getValue = _b[1];
            if (resolvedState.matches(stateValue)) {
                return getValue(resolvedState);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return defaultValue(resolvedState);
}
exports.matchState = matchState;

},{"./State":4}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var children = new Map();
var sessionIdIndex = 0;
exports.registry = {
    bookId: function () {
        return "x:" + sessionIdIndex++;
    },
    register: function (id, actor) {
        children.set(id, actor);
        return id;
    },
    get: function (id) {
        return children.get(id);
    },
    free: function (id) {
        children.delete(id);
    }
};

},{}],16:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var defaultOptions = {
    deferEvents: false
};
var Scheduler = /** @class */ (function () {
    function Scheduler(options) {
        this.processingEvent = false;
        this.queue = [];
        this.initialized = false;
        this.options = __assign(__assign({}, defaultOptions), options);
    }
    Scheduler.prototype.initialize = function (callback) {
        this.initialized = true;
        if (callback) {
            if (!this.options.deferEvents) {
                this.schedule(callback);
                return;
            }
            this.process(callback);
        }
        this.flushEvents();
    };
    Scheduler.prototype.schedule = function (task) {
        if (!this.initialized || this.processingEvent) {
            this.queue.push(task);
            return;
        }
        if (this.queue.length !== 0) {
            throw new Error('Event queue should be empty when it is not processing events');
        }
        this.process(task);
        this.flushEvents();
    };
    Scheduler.prototype.clear = function () {
        this.queue = [];
    };
    Scheduler.prototype.flushEvents = function () {
        var nextCallback = this.queue.shift();
        while (nextCallback) {
            this.process(nextCallback);
            nextCallback = this.queue.shift();
        }
    };
    Scheduler.prototype.process = function (callback) {
        this.processingEvent = true;
        try {
            callback();
        }
        catch (e) {
            // there is no use to keep the future events
            // as the situation is not anymore the same
            this.clear();
            throw e;
        }
        finally {
            this.processingEvent = false;
        }
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;

},{}],17:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
exports.isLeafNode = function (stateNode) {
    return stateNode.type === 'atomic' || stateNode.type === 'final';
};
function getChildren(stateNode) {
    return utils_1.keys(stateNode.states).map(function (key) { return stateNode.states[key]; });
}
exports.getChildren = getChildren;
function getAllStateNodes(stateNode) {
    var stateNodes = [stateNode];
    if (exports.isLeafNode(stateNode)) {
        return stateNodes;
    }
    return stateNodes.concat(utils_1.flatten(getChildren(stateNode).map(getAllStateNodes)));
}
exports.getAllStateNodes = getAllStateNodes;
function getConfiguration(prevStateNodes, stateNodes) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    var prevConfiguration = new Set(prevStateNodes);
    var prevAdjList = getAdjList(prevConfiguration);
    var configuration = new Set(stateNodes);
    try {
        // add all ancestors
        for (var configuration_1 = __values(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
            var s = configuration_1_1.value;
            var m = s.parent;
            while (m && !configuration.has(m)) {
                configuration.add(m);
                m = m.parent;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var adjList = getAdjList(configuration);
    try {
        // add descendants
        for (var configuration_2 = __values(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
            var s = configuration_2_1.value;
            // if previously active, add existing child nodes
            if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
                if (prevAdjList.get(s)) {
                    prevAdjList.get(s).forEach(function (sn) { return configuration.add(sn); });
                }
                else {
                    s.initialStateNodes.forEach(function (sn) { return configuration.add(sn); });
                }
            }
            else {
                if (s.type === 'parallel') {
                    try {
                        for (var _e = (e_3 = void 0, __values(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var child = _f.value;
                            if (child.type === 'history') {
                                continue;
                            }
                            if (!configuration.has(child)) {
                                configuration.add(child);
                                if (prevAdjList.get(child)) {
                                    prevAdjList.get(child).forEach(function (sn) { return configuration.add(sn); });
                                }
                                else {
                                    child.initialStateNodes.forEach(function (sn) { return configuration.add(sn); });
                                }
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    try {
        // add all ancestors
        for (var configuration_3 = __values(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
            var s = configuration_3_1.value;
            var m = s.parent;
            while (m && !configuration.has(m)) {
                configuration.add(m);
                m = m.parent;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return configuration;
}
exports.getConfiguration = getConfiguration;
function getValueFromAdj(baseNode, adjList) {
    var childStateNodes = adjList.get(baseNode);
    if (!childStateNodes) {
        return {}; // todo: fix?
    }
    if (baseNode.type === 'compound') {
        var childStateNode = childStateNodes[0];
        if (childStateNode) {
            if (exports.isLeafNode(childStateNode)) {
                return childStateNode.key;
            }
        }
        else {
            return {};
        }
    }
    var stateValue = {};
    childStateNodes.forEach(function (csn) {
        stateValue[csn.key] = getValueFromAdj(csn, adjList);
    });
    return stateValue;
}
function getAdjList(configuration) {
    var e_5, _a;
    var adjList = new Map();
    try {
        for (var configuration_4 = __values(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
            var s = configuration_4_1.value;
            if (!adjList.has(s)) {
                adjList.set(s, []);
            }
            if (s.parent) {
                if (!adjList.has(s.parent)) {
                    adjList.set(s.parent, []);
                }
                adjList.get(s.parent).push(s);
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return adjList;
}
exports.getAdjList = getAdjList;
function getValue(rootNode, configuration) {
    var config = getConfiguration([rootNode], configuration);
    return getValueFromAdj(rootNode, getAdjList(config));
}
exports.getValue = getValue;
function has(iterable, item) {
    if (Array.isArray(iterable)) {
        return iterable.some(function (member) { return member === item; });
    }
    if (iterable instanceof Set) {
        return iterable.has(item);
    }
    return false; // TODO: fix
}
exports.has = has;
function nextEvents(configuration) {
    return utils_1.flatten(__spread(new Set(configuration.map(function (sn) { return sn.ownEvents; }))));
}
exports.nextEvents = nextEvents;
function isInFinalState(configuration, stateNode) {
    if (stateNode.type === 'compound') {
        return getChildren(stateNode).some(function (s) { return s.type === 'final' && has(configuration, s); });
    }
    if (stateNode.type === 'parallel') {
        return getChildren(stateNode).every(function (sn) {
            return isInFinalState(configuration, sn);
        });
    }
    return false;
}
exports.isInFinalState = isInFinalState;

},{"./utils":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["Start"] = "xstate.start";
    ActionTypes["Stop"] = "xstate.stop";
    ActionTypes["Raise"] = "xstate.raise";
    ActionTypes["Send"] = "xstate.send";
    ActionTypes["Cancel"] = "xstate.cancel";
    ActionTypes["NullEvent"] = "";
    ActionTypes["Assign"] = "xstate.assign";
    ActionTypes["After"] = "xstate.after";
    ActionTypes["DoneState"] = "done.state";
    ActionTypes["DoneInvoke"] = "done.invoke";
    ActionTypes["Log"] = "xstate.log";
    ActionTypes["Init"] = "xstate.init";
    ActionTypes["Invoke"] = "xstate.invoke";
    ActionTypes["ErrorExecution"] = "error.execution";
    ActionTypes["ErrorCommunication"] = "error.communication";
    ActionTypes["ErrorPlatform"] = "error.platform";
    ActionTypes["ErrorCustom"] = "xstate.error";
    ActionTypes["Update"] = "xstate.update";
    ActionTypes["Pure"] = "xstate.pure";
    ActionTypes["Choose"] = "xstate.choose";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
var SpecialTargets;
(function (SpecialTargets) {
    SpecialTargets["Parent"] = "#_parent";
    SpecialTargets["Internal"] = "#_internal";
})(SpecialTargets = exports.SpecialTargets || (exports.SpecialTargets = {}));

},{}],19:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var environment_1 = require("./environment");
function keys(value) {
    return Object.keys(value);
}
exports.keys = keys;
function matchesState(parentStateId, childStateId, delimiter) {
    if (delimiter === void 0) { delimiter = constants_1.STATE_DELIMITER; }
    var parentStateValue = toStateValue(parentStateId, delimiter);
    var childStateValue = toStateValue(childStateId, delimiter);
    if (isString(childStateValue)) {
        if (isString(parentStateValue)) {
            return childStateValue === parentStateValue;
        }
        // Parent more specific than child
        return false;
    }
    if (isString(parentStateValue)) {
        return parentStateValue in childStateValue;
    }
    return keys(parentStateValue).every(function (key) {
        if (!(key in childStateValue)) {
            return false;
        }
        return matchesState(parentStateValue[key], childStateValue[key]);
    });
}
exports.matchesState = matchesState;
function getEventType(event) {
    try {
        return isString(event) || typeof event === 'number'
            ? "" + event
            : event.type;
    }
    catch (e) {
        throw new Error('Events must be strings or objects with a string event.type property.');
    }
}
exports.getEventType = getEventType;
function getActionType(action) {
    try {
        return isString(action) || typeof action === 'number'
            ? "" + action
            : isFunction(action)
                ? action.name
                : action.type;
    }
    catch (e) {
        throw new Error('Actions must be strings or objects with a string action.type property.');
    }
}
exports.getActionType = getActionType;
function toStatePath(stateId, delimiter) {
    try {
        if (isArray(stateId)) {
            return stateId;
        }
        return stateId.toString().split(delimiter);
    }
    catch (e) {
        throw new Error("'" + stateId + "' is not a valid state path.");
    }
}
exports.toStatePath = toStatePath;
function isStateLike(state) {
    return (typeof state === 'object' &&
        'value' in state &&
        'context' in state &&
        'event' in state &&
        '_event' in state);
}
exports.isStateLike = isStateLike;
function toStateValue(stateValue, delimiter) {
    if (isStateLike(stateValue)) {
        return stateValue.value;
    }
    if (isArray(stateValue)) {
        return pathToStateValue(stateValue);
    }
    if (typeof stateValue !== 'string') {
        return stateValue;
    }
    var statePath = toStatePath(stateValue, delimiter);
    return pathToStateValue(statePath);
}
exports.toStateValue = toStateValue;
function pathToStateValue(statePath) {
    if (statePath.length === 1) {
        return statePath[0];
    }
    var value = {};
    var marker = value;
    for (var i = 0; i < statePath.length - 1; i++) {
        if (i === statePath.length - 2) {
            marker[statePath[i]] = statePath[i + 1];
        }
        else {
            marker[statePath[i]] = {};
            marker = marker[statePath[i]];
        }
    }
    return value;
}
exports.pathToStateValue = pathToStateValue;
function mapValues(collection, iteratee) {
    var result = {};
    var collectionKeys = keys(collection);
    for (var i = 0; i < collectionKeys.length; i++) {
        var key = collectionKeys[i];
        result[key] = iteratee(collection[key], key, collection, i);
    }
    return result;
}
exports.mapValues = mapValues;
function mapFilterValues(collection, iteratee, predicate) {
    var e_1, _a;
    var result = {};
    try {
        for (var _b = __values(keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var item = collection[key];
            if (!predicate(item)) {
                continue;
            }
            result[key] = iteratee(item, key, collection);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
exports.mapFilterValues = mapFilterValues;
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */
exports.path = function (props) { return function (object) {
    var e_2, _a;
    var result = object;
    try {
        for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
            var prop = props_1_1.value;
            result = result[prop];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}; };
/**
 * Retrieves a value at the given path via the nested accessor prop.
 * @param props The deep path to the prop of the desired value
 */
function nestedPath(props, accessorProp) {
    return function (object) {
        var e_3, _a;
        var result = object;
        try {
            for (var props_2 = __values(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
                var prop = props_2_1.value;
                result = result[accessorProp][prop];
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
}
exports.nestedPath = nestedPath;
function toStatePaths(stateValue) {
    if (!stateValue) {
        return [[]];
    }
    if (isString(stateValue)) {
        return [[stateValue]];
    }
    var result = flatten(keys(stateValue).map(function (key) {
        var subStateValue = stateValue[key];
        if (typeof subStateValue !== 'string' &&
            (!subStateValue || !Object.keys(subStateValue).length)) {
            return [[key]];
        }
        return toStatePaths(stateValue[key]).map(function (subPath) {
            return [key].concat(subPath);
        });
    }));
    return result;
}
exports.toStatePaths = toStatePaths;
function pathsToStateValue(paths) {
    var e_4, _a;
    var result = {};
    if (paths && paths.length === 1 && paths[0].length === 1) {
        return paths[0][0];
    }
    try {
        for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
            var currentPath = paths_1_1.value;
            var marker = result;
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < currentPath.length; i++) {
                var subPath = currentPath[i];
                if (i === currentPath.length - 2) {
                    marker[subPath] = currentPath[i + 1];
                    break;
                }
                marker[subPath] = marker[subPath] || {};
                marker = marker[subPath];
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return result;
}
exports.pathsToStateValue = pathsToStateValue;
function flatten(array) {
    var _a;
    return (_a = []).concat.apply(_a, __spread(array));
}
exports.flatten = flatten;
function toArrayStrict(value) {
    if (isArray(value)) {
        return value;
    }
    return [value];
}
exports.toArrayStrict = toArrayStrict;
function toArray(value) {
    if (value === undefined) {
        return [];
    }
    return toArrayStrict(value);
}
exports.toArray = toArray;
function mapContext(mapper, context, _event) {
    var e_5, _a;
    if (isFunction(mapper)) {
        return mapper(context, _event.data);
    }
    var result = {};
    try {
        for (var _b = __values(keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var subMapper = mapper[key];
            if (isFunction(subMapper)) {
                result[key] = subMapper(context, _event.data);
            }
            else {
                result[key] = subMapper;
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return result;
}
exports.mapContext = mapContext;
function isBuiltInEvent(eventType) {
    return /^(done|error)\./.test(eventType);
}
exports.isBuiltInEvent = isBuiltInEvent;
function isPromiseLike(value) {
    if (value instanceof Promise) {
        return true;
    }
    // Check if shape matches the Promise/A+ specification for a "thenable".
    if (value !== null &&
        (isFunction(value) || typeof value === 'object') &&
        isFunction(value.then)) {
        return true;
    }
    return false;
}
exports.isPromiseLike = isPromiseLike;
function partition(items, predicate) {
    var e_6, _a;
    var _b = __read([[], []], 2), truthy = _b[0], falsy = _b[1];
    try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            if (predicate(item)) {
                truthy.push(item);
            }
            else {
                falsy.push(item);
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return [truthy, falsy];
}
exports.partition = partition;
function updateHistoryStates(hist, stateValue) {
    return mapValues(hist.states, function (subHist, key) {
        if (!subHist) {
            return undefined;
        }
        var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) ||
            (subHist ? subHist.current : undefined);
        if (!subStateValue) {
            return undefined;
        }
        return {
            current: subStateValue,
            states: updateHistoryStates(subHist, subStateValue)
        };
    });
}
exports.updateHistoryStates = updateHistoryStates;
function updateHistoryValue(hist, stateValue) {
    return {
        current: stateValue,
        states: updateHistoryStates(hist, stateValue)
    };
}
exports.updateHistoryValue = updateHistoryValue;
function updateContext(context, _event, assignActions, state) {
    if (!environment_1.IS_PRODUCTION) {
        warn(!!context, 'Attempting to update undefined context');
    }
    var updatedContext = context
        ? assignActions.reduce(function (acc, assignAction) {
            var e_7, _a;
            var assignment = assignAction.assignment;
            var meta = {
                state: state,
                action: assignAction,
                _event: _event
            };
            var partialUpdate = {};
            if (isFunction(assignment)) {
                partialUpdate = assignment(acc, _event.data, meta);
            }
            else {
                try {
                    for (var _b = __values(keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var key = _c.value;
                        var propAssignment = assignment[key];
                        partialUpdate[key] = isFunction(propAssignment)
                            ? propAssignment(acc, _event.data, meta)
                            : propAssignment;
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            return Object.assign({}, acc, partialUpdate);
        }, context)
        : context;
    return updatedContext;
}
exports.updateContext = updateContext;
// tslint:disable-next-line:no-empty
var warn = function () { };
exports.warn = warn;
if (!environment_1.IS_PRODUCTION) {
    exports.warn = warn = function (condition, message) {
        var error = condition instanceof Error ? condition : undefined;
        if (!error && condition) {
            return;
        }
        if (console !== undefined) {
            var args = ["Warning: " + message];
            if (error) {
                args.push(error);
            }
            // tslint:disable-next-line:no-console
            console.warn.apply(console, args);
        }
    };
}
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
// tslint:disable-next-line:ban-types
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
// export function memoizedGetter<T, TP extends { prototype: object }>(
//   o: TP,
//   property: string,
//   getter: () => T
// ): void {
//   Object.defineProperty(o.prototype, property, {
//     get: getter,
//     enumerable: false,
//     configurable: false
//   });
// }
function toGuard(condition, guardMap) {
    if (!condition) {
        return undefined;
    }
    if (isString(condition)) {
        return {
            type: constants_1.DEFAULT_GUARD_TYPE,
            name: condition,
            predicate: guardMap ? guardMap[condition] : undefined
        };
    }
    if (isFunction(condition)) {
        return {
            type: constants_1.DEFAULT_GUARD_TYPE,
            name: condition.name,
            predicate: condition
        };
    }
    return condition;
}
exports.toGuard = toGuard;
function isObservable(value) {
    try {
        return 'subscribe' in value && isFunction(value.subscribe);
    }
    catch (e) {
        return false;
    }
}
exports.isObservable = isObservable;
exports.symbolObservable = (function () {
    return (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
})();
function isMachine(value) {
    try {
        return '__xstatenode' in value;
    }
    catch (e) {
        return false;
    }
}
exports.isMachine = isMachine;
function isActor(value) {
    return !!value && typeof value.send === 'function';
}
exports.isActor = isActor;
exports.uniqueId = (function () {
    var currentId = 0;
    return function () {
        currentId++;
        return currentId.toString(16);
    };
})();
function toEventObject(event, payload
// id?: TEvent['type']
) {
    if (isString(event) || typeof event === 'number') {
        return __assign({ type: event }, payload);
    }
    return event;
}
exports.toEventObject = toEventObject;
function toSCXMLEvent(event, scxmlEvent) {
    if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
        return event;
    }
    var eventObject = toEventObject(event);
    return __assign({ name: eventObject.type, data: eventObject, $$type: 'scxml', type: 'external' }, scxmlEvent);
}
exports.toSCXMLEvent = toSCXMLEvent;
function toTransitionConfigArray(event, configLike) {
    var transitions = toArrayStrict(configLike).map(function (transitionLike) {
        if (typeof transitionLike === 'undefined' ||
            typeof transitionLike === 'string' ||
            isMachine(transitionLike)) {
            // @ts-ignore until Type instantiation is excessively deep and possibly infinite bug is fixed
            return { target: transitionLike, event: event };
        }
        return __assign(__assign({}, transitionLike), { event: event });
    });
    return transitions;
}
exports.toTransitionConfigArray = toTransitionConfigArray;
function normalizeTarget(target) {
    if (target === undefined || target === constants_1.TARGETLESS_KEY) {
        return undefined;
    }
    return toArray(target);
}
exports.normalizeTarget = normalizeTarget;
function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
    if (!environment_1.IS_PRODUCTION) {
        var originalStackTrace = originalError.stack
            ? " Stacktrace was '" + originalError.stack + "'"
            : '';
        if (originalError === currentError) {
            // tslint:disable-next-line:no-console
            console.error("Missing onError handler for invocation '" + id + "', error was '" + originalError + "'." + originalStackTrace);
        }
        else {
            var stackTrace = currentError.stack
                ? " Stacktrace was '" + currentError.stack + "'"
                : '';
            // tslint:disable-next-line:no-console
            console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '" + id + "'. " +
                ("Original error: '" + originalError + "'. " + originalStackTrace + " Current error is '" + currentError + "'." + stackTrace));
        }
    }
}
exports.reportUnhandledExceptionOnInvocation = reportUnhandledExceptionOnInvocation;
function evaluateGuard(machine, guard, context, _event, state) {
    var guards = machine.options.guards;
    var guardMeta = {
        state: state,
        cond: guard,
        _event: _event
    };
    // TODO: do not hardcode!
    if (guard.type === constants_1.DEFAULT_GUARD_TYPE) {
        return guard.predicate(context, _event.data, guardMeta);
    }
    var condFn = guards[guard.type];
    if (!condFn) {
        throw new Error("Guard '" + guard.type + "' is not implemented on machine '" + machine.id + "'.");
    }
    return condFn(context, _event.data, guardMeta);
}
exports.evaluateGuard = evaluateGuard;

},{"./constants":8,"./environment":10}],20:[function(require,module,exports){
const service = require ('./stateMachine');

const light = document.getElementById('lamp__light');
const redButton = document.getElementById('redButton');
const increaseButton = document.getElementById('increaseButton');
const decreaseButton = document.getElementById('decreaseButton');
const switcher = document.getElementById('checkbox');

const GRADIENT = {
    WHITE: 'linear-gradient(white, rgba(255, 255, 255, 0))',
    YELLOW: 'linear-gradient(yellow, rgba(255, 255, 0, 0))',
    NONE: 'none'
}

increaseButton.onclick = increaseBrightness;
decreaseButton.onclick = decreaseBrightness;
redButton.onclick = redButtonToggle;
switcher.onchange = toggleSwitcher;


function toggleSwitcher() {
    if (this.checked) {
        light.style.backgroundImage = GRADIENT.WHITE;
        service.send('ENABLE');
        light.style.opacity = service.state.context.brightness;
    } else {
        light.style.backgroundImage = GRADIENT.NONE;
        service.send('DISABLE');
    }
}

function increaseBrightness() {
    if (service.state.value === 'disabled') return;
    service.send('INCREASE_BRIGHTNESS');
    light.style.opacity = service.state.context.brightness;
}

function decreaseBrightness() {
    if (service.state.value === 'disabled') return;
    service.send('DECREASE_BRIGHTNESS');
    light.style.opacity = service.state.context.brightness
}

function redButtonToggle() {
    switch (service.state.value) {
        case 'whiteLight':
            light.style.backgroundImage = GRADIENT.YELLOW;
            service.send('TOGGLE');
            break;
        case 'yellowLight':
            light.style.backgroundImage = GRADIENT.NONE;
            service.send('TOGGLE');
            break;
        case 'noLight':
            light.style.backgroundImage = GRADIENT.WHITE;
            service.send('TOGGLE');
            break;
    }
}


},{"./stateMachine":21}],21:[function(require,module,exports){
const {Machine, interpret, assign} = require('xstate');

//watchify stateMachine.js  -o bundle.js

const whiteLight = {
    on: {
        TOGGLE: {
            target: 'yellowLight',
        },
        DISABLE: 'disabled',
        INCREASE_BRIGHTNESS: {
            actions: ['increaseBrightness'],
            cond: 'isLessThanMax'
        },
        DECREASE_BRIGHTNESS: {
            actions: ['decreaseBrightness'],
            cond: 'isMoreThanMin'
        }
    }
}

const yellowLight = {
    on: {
        TOGGLE: 'noLight',
        DISABLE: 'disabled',
        INCREASE_BRIGHTNESS: {
            actions: ['increaseBrightness'],
            cond: 'isLessThanMax'
        },
        DECREASE_BRIGHTNESS: {
            actions: ['decreaseBrightness'],
            cond: 'isMoreThanMin'
        }
    }
}
const noLight = {
    on: {
        TOGGLE: 'whiteLight',
        DISABLE: 'disabled',
    }
}

const disabled = {
    entry: ['discardBrightness'],
    on: {
        ENABLE: 'whiteLight'
    }
}


const states = {whiteLight, yellowLight, noLight, disabled};
const initial = 'whiteLight';
const MIN_BRIGHTNESS = 0.2;
const MAX_BRIGHTNESS = 1;
const STEP = 0.1;
const INITIAL_BRIGHTNESS = 0.3;

const config = {
    id: 'lightBulb',
    initial,
    states,
    context: {
        brightness: INITIAL_BRIGHTNESS
    },
    strict: true
};

const lightBulbMachine = Machine(config, {
    actions: {
        increaseBrightness: assign(context => ({
            brightness: Number(((context.brightness) + STEP).toFixed(1))
        })),
        decreaseBrightness: assign(context => ({
            brightness: Number(((context.brightness) - STEP).toFixed(1))
        })),
        discardBrightness: assign(() =>
            ({brightness: INITIAL_BRIGHTNESS})
        ),
    },
    guards: {
        isLessThanMax: context => context.brightness < MAX_BRIGHTNESS,
        isMoreThanMin: context => context.brightness > MIN_BRIGHTNESS
    }
});

const service = interpret(lightBulbMachine).start();

module.exports = service;


},{"xstate":11}]},{},[20]);
