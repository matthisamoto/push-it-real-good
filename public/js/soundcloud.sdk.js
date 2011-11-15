var __hasProp = Object.prototype.hasOwnProperty, __bind = function(a, b) {
    return function() {
        return a.apply(b, arguments);
    };
};

window.SC || (window.SC = {
    options: {
        site: "soundcloud.com"
    },
    connectCallbacks: {},
    _popupWindow: void 0,
    initialize: function(a) {
        var b, c, d;
        a == null && (a = {});
        this.accessToken(a.access_token);
        for (b in a) __hasProp.call(a, b) && (c = a[b], this.options[b] = c);
        (d = this.options).flashXHR || (d.flashXHR = (new XMLHttpRequest).withCredentials === void 0);
        return this;
    },
    hostname: function(a) {
        var b;
        b = "";
        a != null && (b += a + ".");
        b += this.options.site;
        return b;
    },
    connect: function(a) {
        var b;
        a.client_id || (a.client_id = SC.options.client_id);
        a.redirect_uri || (a.redirect_uri = SC.options.redirect_uri);
        SC.connectCallbacks.success = a.connected;
        SC.connectCallbacks.error = a.error;
        SC.connectCallbacks.general = a.callback;
        if (a.client_id && a.redirect_uri) return b = new SC.URI("https://" + this.hostname() + "/connect/?"), b.query = {
            client_id: a.client_id,
            redirect_uri: a.redirect_uri,
            response_type: "code_and_token",
            scope: a.scope || "non-expiring",
            display: "popup"
        }, SC._popupWindow = SC.Helper.openCenteredPopup(b.toString(), 456, 510); else throw "Either client_id and redirect_uri (for user agent flow) must be passed as an option";
    },
    connectCallback: function() {
        var a, b, c;
        b = SC._popupWindow;
        c = new SC.URI(b.location.toString(), {
            decodeQuery: !0,
            decodeFragment: !0
        });
        a = c.query.error || c.fragment.error;
        b.close();
        if (a) throw Error("SC OAuth2 Error: " + c.query.error_description); else SC.accessToken(c.fragment.access_token), SC._trigger("success");
        return SC._trigger("general", a);
    },
    disconnect: function() {
        return this.accessToken(null);
    },
    _trigger: function(a, b) {
        if (this.connectCallbacks[a] != null) return this.connectCallbacks[a](b);
    },
    accessToken: function(a) {
        var b;
        b = this.storage();
        return a === void 0 ? b.getItem("SC.accessToken") : a === null ? b.removeItem("SC.accessToken") : b.setItem("SC.accessToken", a);
    },
    isConnected: function() {
        return this.accessToken() != null;
    },
    whenStreamingReady: function(a) {
        var b;
        return window.soundManager ? a() : (b = "http://" + this.hostname("connect") + "/soundmanager2/", window.SM2_DEFER = !0, SC.Helper.loadJavascript(b + "soundmanager2.js", function() {
            window.soundManager = new SoundManager;
            soundManager.url = b;
            soundManager.flashVersion = 9;
            soundManager.useFlashBlock = !1;
            soundManager.useHTML5Audio = !1;
            soundManager.beginDelayedInit();
            return soundManager.onready(function() {
                return a();
            });
        }));
    },
    stream: function(a, b) {
        b == null && (b = {});
        return SC.whenStreamingReady(function() {
            var c;
            b.id = "T" + a;
            b.url = "http://" + SC.hostname("api") + "/tracks/" + a + "/stream?client_id=YOUR_CLIENT_ID";
            if (!(c = soundManager.getSoundById(b.id))) c = soundManager.createSound(b);
            return c;
        });
    },
    whenXDMReady: function(a) {
        return window.crossdomain != null ? a() : (window.CROSSDOMAINJS_PATH = "http://" + this.hostname("connect") + "/crossdomain-requests-js", SC.Helper.loadJavascript(CROSSDOMAINJS_PATH + "/crossdomain-ajax.js", function() {
            return a();
        }));
    },
    request: function(a, b, c, d) {
        var e, g, f;
        d == null && (d = c, c = void 0);
        c || (c = {});
        f = SC.prepareRequestURI(b, c);
        f.query.format = "json";
        SC.options.flashXHR && SC.Helper.setFlashStatusCodeMaps(f.query);
        if (a === "PUT" || a === "DELETE") f.query._method = a, a = "POST";
        if (a !== "GET") e = f.encodeParams(f.query), f.query = {};
        g = function(a, b) {
            var c;
            c = SC.Helper.responseHandler(a, b);
            return d(c.json, c.error);
        };
        return SC.options.flashXHR ? this.whenRecordingReady(function() {
            return Recorder.request(a, f.toString(), e, g);
        }) : this._request(a, f.toString(), e, g);
    },
    _request: function(a, b, c, d) {
        var e;
        e = new XMLHttpRequest;
        e.open(a, b.toString(), !0);
        e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        e.onreadystatechange = function(a) {
            if (a.target.readyState === 4) return d(a.target.responseText, a.target);
        };
        return e.send(c);
    },
    post: function(a, b, c) {
        return this.request("POST", a, b, c);
    },
    put: function(a, b, c) {
        return this.request("PUT", a, b, c);
    },
    get: function(a, b, c) {
        return this.request("GET", a, b, c);
    },
    "delete": function(a, b) {
        return this.request("DELETE", a, {}, b);
    },
    prepareRequestURI: function(a, b) {
        var c, d, e;
        b == null && (b = {});
        d = new SC.URI(a, {
            decodeQuery: !0
        });
        for (c in b) __hasProp.call(b, c) && (e = b[c], d.query[c] = e);
        if (d.isRelative()) d.host = this.hostname("api"), d.scheme = "http";
        this.accessToken() != null ? (d.query.oauth_token = this.accessToken(), d.scheme = "https") : d.query.client_id = this.options.client_id;
        return d;
    },
    oEmbed: function(a, b, c) {
        var d;
        c == null && (c = b, b = void 0);
        b || (b = {});
        b.url = a;
        a = new SC.URI("http://" + SC.hostname("api") + "/oembed");
        a.query = b;
        c.nodeType !== void 0 && c.nodeType === 1 && (d = c, c = __bind(function(a) {
            return d.innerHTML = a.html;
        }, this));
        return SC.Helper.JSONP.get(a, c);
    },
    storage: function() {
        return window.localStorage || (this._fakeStorage = new SC.Helper.FakeStorage);
    },
    whenRecordingReady: function(a) {
        return window.Recorder.flashInterface() && window.Recorder.flashInterface().record != null ? a() : Recorder.initialize({
            swfSrc: "http://" + this.hostname("connect") + "/recorder.js/recorder.swf",
            initialized: function() {
                return a();
            }
        });
    },
    record: function(a) {
        a == null && (a = {});
        return this.whenRecordingReady(function() {
            return Recorder.record(a);
        });
    },
    recordStop: function() {
        return Recorder.stop();
    },
    recordPlay: function(a) {
        a == null && (a = {});
        return Recorder.play(a);
    },
    recordUpload: function(a, b) {
        var c;
        a == null && (a = {});
        c = SC.prepareRequestURI("/tracks", a);
        c.query.format = "json";
        SC.Helper.setFlashStatusCodeMaps(c.query);
        c = c.flattenParams(c.query);
        return Recorder.upload({
            method: "POST",
            url: "https://" + this.hostname("api") + "/tracks",
            audioParam: "track[asset_data]",
            params: c,
            success: function(a) {
                a = SC.Helper.responseHandler(a);
                return b(a.json, a.error);
            }
        });
    },
    Helper: {
        loadJavascript: function(a, b) {
            var c;
            c = document.createElement("script");
            c.async = !0;
            c.src = a;
            SC.Helper.attachEvent(c, "load", b);
            document.body.appendChild(c);
            return c;
        },
        openCenteredPopup: function(a, b, c) {
            var d, e, b = {
                location: 1,
                width: b,
                height: c,
                left: window.screenX + (window.outerWidth - b) / 2,
                top: window.screenY + (window.outerHeight - c) / 2,
                toolbar: "no",
                scrollbars: "yes"
            }, c = [];
            for (d in b) __hasProp.call(b, d) && (e = b[d], c.push(d + "=" + e));
            return window.open(a, "connectWithSoundCloud", c.join(", "));
        },
        attachEvent: function(a, b, c) {
            return a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c, !1);
        },
        millisecondsToHMS: function(a) {
            var b, c, d, a = {
                h: Math.floor(a / 36e5),
                m: Math.floor(a / 6e4 % 60),
                s: Math.floor(a / 1e3 % 60)
            };
            d = [];
            a.h > 0 && d.push(a.h);
            c = b = "";
            a.m < 10 && a.h > 0 && (b = "0");
            a.s < 10 && (c = "0");
            d.push(b + a.m);
            d.push(c + a.s);
            return d.join(".");
        },
        setFlashStatusCodeMaps: function(a) {
            a["_status_code_map[400]"] = 200;
            a["_status_code_map[401]"] = 200;
            a["_status_code_map[403]"] = 200;
            a["_status_code_map[404]"] = 200;
            a["_status_code_map[422]"] = 200;
            a["_status_code_map[500]"] = 200;
            a["_status_code_map[503]"] = 200;
            return a["_status_code_map[504]"] = 200;
        },
        responseHandler: function(a, b) {
            var c, d;
            d = SC.Helper.JSON.parse(a);
            c = null;
            d ? d.errors && (c = {
                message: d.errors && d.errors[0].error_message
            }) : c = b ? {
                message: "HTTP Error: " + b.status
            } : {
                message: "Unknown error"
            };
            return {
                json: d,
                error: c
            };
        },
        FakeStorage: function() {
            return {
                _store: {},
                getItem: function(a) {
                    return this._store[a] || null;
                },
                setItem: function(a, b) {
                    return this._store[a] = b.toString();
                },
                removeItem: function() {
                    return delete this._store.key;
                }
            };
        },
        JSON: {
            parse: function(a) {
                return a[0] !== "{" && a[0] !== "[" ? null : window.JSON != null ? window.JSON.parse(a) : eval(a);
            }
        },
        JSONP: {
            callbacks: {},
            randomCallbackName: function() {
                return "CB" + parseInt(Math.random() * 999999, 10);
            },
            get: function(a, b) {
                var c;
                c = this.randomCallbackName();
                a.query.format = "js";
                a.query.callback = "SC.Helper.JSONP.callbacks." + c;
                SC.Helper.JSONP.callbacks[c] = b;
                return SC.Helper.loadJavascript(a.toString(), function() {
                    return document.body.removeChild(this);
                });
            }
        }
    }
});

var Recorder = {
    swfCode: '<object id="Recorder" style="z-index: 200" width="231" height="141" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param value="transparent" name="wmode"><param value="RECORDER_URI" name="movie"><param value="always" name="allowScriptAccess"><embed width="231" height="141" wmode="transparent" name="Recorder" type="application/x-shockwave-flash" src="RECORDER_URI" allowscriptaccess="always">  </object>',
    swfObject: null,
    _callbacks: {},
    _events: {},
    options: {},
    initialize: function(options) {
        options = options || {};
        this.options = options;
        if (!options.flashContainer) {
            options.flashContainer = document.createElement("div");
            options.flashContainer.setAttribute("id", "recorderFlashContainer");
            options.flashContainer.setAttribute("style", "position: fixed; left: -9999px; top: -9999px; width: 230px; height: 140px; margin-left: 10px; border-top: 6px solid rgba(128, 128, 128, 0.6); border-bottom: 6px solid rgba(128, 128, 128, 0.6); border-radius: 5px 5px; padding-bottom: 1px; padding-right: 1px;");
            document.body.appendChild(options.flashContainer);
        }
        if (!options.onFlashSecurity) {
            options.onFlashSecurity = function() {
                var flashContainer = Recorder.options.flashContainer;
                flashContainer.style.left = window.innerWidth / 2 - 115 + "px";
                flashContainer.style.top = window.innerHeight / 2 - 70 + "px";
            };
        }
        this.bind("initialized", options.initialized);
        this.bind("showFlash", options.onFlashSecurity);
        options.flashContainer.innerHTML = this.swfCode.replace(/RECORDER_URI/g, options.swfSrc);
        this.swfObject = options.flashContainer.children[0];
    },
    clear: function() {
        Recorder._events = {};
    },
    record: function(options) {
        options = options || {};
        this.clearBindings("recordingStart");
        this.clearBindings("recordingProgress");
        this.bind("recordingStart", function() {
            var flashContainer = Recorder.options.flashContainer;
            flashContainer.style.left = "-9999px";
            flashContainer.style.top = "-9999px";
        });
        this.bind("recordingStart", options["start"]);
        this.bind("recordingProgress", options["progress"]);
        this.flashInterface().record();
    },
    stop: function() {
        return this.flashInterface().stop();
    },
    play: function(options) {
        options = options || {};
        this.clearBindings("playingProgress");
        this.bind("playingProgress", options["progress"]);
        this.bind("playingStop", options["finished"]);
        this.flashInterface().play();
    },
    upload: function(options) {
        options.audioParam = options.audioParam || "audio";
        options.params = options.params || {};
        this.clearBindings("uploadSuccess");
        this.bind("uploadSuccess", function(responseText) {
            options.success(responseText);
        });
        this.flashInterface().upload(options.url, options.audioParam, options.params);
    },
    audioData: function() {
        return this.flashInterface().audioData().split(";");
    },
    request: function(method, uri, params, callback) {
        var callbackName = this.registerCallback(callback);
        this.flashInterface().request(method, uri, params, callbackName);
    },
    clearBindings: function(eventName) {
        Recorder._events[eventName] = [];
    },
    bind: function(eventName, fn) {
        if (!Recorder._events[eventName]) {
            Recorder._events[eventName] = [];
        }
        Recorder._events[eventName].push(fn);
    },
    triggerEvent: function(eventName, arg0, arg1) {
        for (var cb in Recorder._events[eventName]) {
            Recorder._events[eventName][cb](arg0, arg1);
        }
    },
    triggerCallback: function(name, args) {
        Recorder._callbacks[name].apply(null, args);
    },
    registerCallback: function(fn) {
        var name = "CB" + parseInt(Math.random() * 999999, 10);
        Recorder._callbacks[name] = fn;
        return name;
    },
    flashInterface: function() {
        if (!this.swfObject) {
            return null;
        } else if (this.swfObject.record) {
            return this.swfObject;
        } else if (this.swfObject.children[3].record) {
            return this.swfObject.children[3];
        }
    }
};

var __hasProp = Object.prototype.hasOwnProperty;

window.SC.URI = function(uri, options) {
    var AUTHORITY_REGEXP, URI_REGEXP;
    if (uri == null) {
        uri = "";
    }
    if (options == null) {
        options = {};
    }
    URI_REGEXP = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
    AUTHORITY_REGEXP = /^(?:([^@]*)@)?([^:]*)(?::(\d*))?/;
    this.scheme = this.user = this.password = this.host = this.port = this.path = this.query = this.fragment = null;
    this.toString = function() {
        var str;
        str = "";
        if (this.isAbsolute()) {
            str += this.scheme;
            str += "://";
            if (this.user != null) {
                str += this.user + ":" + this.password + "@";
            }
            str += this.host;
            if (this.port != null) {
                str += ":" + this.port;
            }
        }
        str += this.path;
        if (this.path === "" && (this.query != null || this.fragment != null)) {
            str += "/";
        }
        if (this.query != null) {
            str += "?" + this.encodeParams(this.query);
        }
        if (this.fragment != null) {
            str += "#" + this.encodeParams(this.fragment);
        }
        return str;
    };
    this.isRelative = function() {
        return !this.isAbsolute();
    };
    this.isAbsolute = function() {
        return this.host != null;
    };
    this.decodeParams = function(string) {
        var key, params, part, splitted, value, _i, _len, _ref;
        if (string == null) {
            string = "";
        }
        params = {};
        _ref = string.split("&");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            part = _ref[_i];
            if (part !== "") {
                splitted = part.split("=");
                key = decodeURIComponent(splitted[0]);
                value = decodeURIComponent(splitted[1] || "").replace(/\+/g, " ");
                this.normalizeParams(params, key, value);
            }
        }
        return params;
    };
    this.normalizeParams = function(params, name, v) {
        var after, child_key, k, lastP, result, result_i;
        if (v == null) {
            v = NULL;
        }
        result = name.match(/^[\[\]]*([^\[\]]+)\]*(.*)/);
        k = result[1] || "";
        after = result[2] || "";
        if (after === "") {
            params[k] = v;
        } else if (after === "[]") {
            params[k] || (params[k] = []);
            params[k].push(v);
        } else if (result_i = after.match(/^\[\]\[([^\[\]]+)\]$/) || (result_i = after.match(/^\[\](.+)$/))) {
            child_key = result_i[1];
            params[k] || (params[k] = []);
            lastP = params[k][params[k].length - 1];
            if (lastP != null && lastP.constructor === Object && !(lastP[child_key] != null)) {
                this.normalizeParams(lastP, child_key, v);
            } else {
                params[k].push(this.normalizeParams({}, child_key, v));
            }
        } else {
            params[k] || (params[k] = {});
            params[k] = this.normalizeParams(params[k], after, v);
        }
        return params;
    };
    this.encodeParams = function(params) {
        var flattened, key, keyValueStrings, kv, paramString, value, _i, _len;
        paramString = "";
        if (params.constructor === String) {
            return paramString = params;
        } else {
            flattened = this.flattenParams(params);
            keyValueStrings = [];
            for (_i = 0, _len = flattened.length; _i < _len; _i++) {
                kv = flattened[_i];
                key = kv[0];
                value = kv[1];
                if (value === null) {
                    keyValueStrings.push(key);
                } else {
                    keyValueStrings.push(key + "=" + encodeURIComponent(value));
                }
            }
            return paramString = keyValueStrings.join("&");
        }
    };
    this.flattenParams = function(params, prefix, paramsArray) {
        var key, prefixedKey, value, _i, _len;
        if (prefix == null) {
            prefix = "";
        }
        if (paramsArray == null) {
            paramsArray = [];
        }
        if (params === null) {
            if (prefix != null) {
                paramsArray.push([ prefix, null ]);
            }
        } else if (params.constructor === Object) {
            for (key in params) {
                if (!__hasProp.call(params, key)) continue;
                value = params[key];
                if (prefix !== "") {
                    prefixedKey = prefix + "[" + key + "]";
                } else {
                    prefixedKey = key;
                }
                this.flattenParams(value, prefixedKey, paramsArray);
            }
        } else if (params.constructor === Array) {
            for (_i = 0, _len = params.length; _i < _len; _i++) {
                value = params[_i];
                this.flattenParams(value, prefix + "[]", paramsArray);
            }
        } else if (prefix !== "") {
            paramsArray.push([ prefix, params ]);
        }
        return paramsArray;
    };
    this.parse = function(uri, options) {
        var authority, authority_result, result, userinfo;
        if (uri == null) {
            uri = "";
        }
        if (options == null) {
            options = {};
        }
        result = uri.match(URI_REGEXP);
        this.scheme = result[1];
        authority = result[2];
        if (authority != null) {
            authority_result = authority.match(AUTHORITY_REGEXP);
            userinfo = authority_result[1];
            if (userinfo != null) {
                this.user = userinfo.split(":")[0];
                this.password = userinfo.split(":")[1];
            }
            this.host = authority_result[2];
            this.port = parseInt(authority_result[3], 10) || null;
        }
        this.path = result[3];
        this.query = result[4];
        if (options.decodeQuery) {
            this.query = this.decodeParams(this.query);
        }
        this.fragment = result[5];
        if (options.decodeFragment) {
            return this.fragment = this.decodeParams(this.fragment);
        }
    };
    this.parse(uri, options);
    return this;
};