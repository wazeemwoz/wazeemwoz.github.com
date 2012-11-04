var DISQUS = function (c) {
    var g = c.DISQUS || {};
    g.AssertionError = function (d) {
        this.message = d
    };
    g.AssertionError.prototype.toString = function () {
        return "Assertion Error: " + (this.message || "[no message]")
    };
    g.assert = function (d, m, f) {
        if (!d) if (f) c.console && c.console.log("DISQUS assertion failed: " + m);
        else throw new g.AssertionError(m);
    };
    var d = [];
    g.define = function (h, m) {
        typeof h === "function" && (m = h, h = "");
        for (var f = h.split("."), a = f.shift(), b = g, k = (m || function () {
            return {}
        }).call({
            overwrites: function (a) {
                a.__overwrites__ = !0;
                return a
            }
        }, c); a;) b = b[a] ? b[a] : b[a] = {}, a = f.shift();
        for (var e in k) k.hasOwnProperty(e) && (!k.__overwrites__ && b[e] !== null && g.assert(!b.hasOwnProperty(e), "Unsafe attempt to redefine existing module: " + e, !0), b[e] = k[e], d.push(function (a, b) {
            return function () {
                delete a[b]
            }
        }(b, e)));
        return b
    };
    g.use = function (d) {
        return g.define(d)
    };
    g.cleanup = function () {
        for (var c = 0; c < d.length; c++) d[c]()
    };
    return g
}(window);
DISQUS.define(function (c, g) {
    var d = c.DISQUS,
        h = c.document,
        m = h.getElementsByTagName("head")[0] || h.body,
        f = {
            running: !1,
            timer: null,
            queue: []
        };
    d.defer = function (a, b) {
        function d() {
            var a = f.queue;
            if (a.length === 0) f.running = !1, clearInterval(f.timer);
            for (var b = 0, k; k = a[b]; b++) k[0]() && (a.splice(b--, 1), k[1]())
        }
        f.queue.push([a, b]);
        d();
        if (!f.running) f.running = !0, f.timer = setInterval(d, 100)
    };
    d.each = function (a, b) {
        var d = a.length,
            e = Array.prototype.forEach;
        if (isNaN(d)) for (var c in a) a.hasOwnProperty(c) && b(a[c], c, a);
        else if (e) e.call(a,
        b);
        else for (e = 0; e < d; e++) b(a[e], e, a)
    };
    d.extend = function (a) {
        d.each(Array.prototype.slice.call(arguments, 1), function (b) {
            for (var d in b) a[d] = b[d]
        });
        return a
    };
    d.serializeArgs = function (a) {
        var b = [];
        d.each(a, function (a, d) {
            a !== g && b.push(d + (a !== null ? "=" + encodeURIComponent(a) : ""))
        });
        return b.join("&")
    };
    d.isString = function (a) {
        return Object.prototype.toString.call(a) === "[object String]"
    };
    d.serialize = function (a, b, c) {
        b && (a += ~a.indexOf("?") ? a.charAt(a.length - 1) == "&" ? "" : "&" : "?", a += d.serializeArgs(b));
        if (c) return b = {}, b[(new Date).getTime()] = null, d.serialize(a, b);
        b = a.length;
        return a.charAt(b - 1) == "&" ? a.slice(0, b - 1) : a
    };
    d.require = function (a, b, c, e, f) {
        function g(a) {
            if (a.type == "load" || /^(complete|loaded)$/.test(a.target.readyState)) e && e(), q && clearTimeout(q), d.bean.remove(a.target, n, g)
        }
        var i = h.createElement("script"),
            n = i.addEventListener ? "load" : "readystatechange",
            q = null;
        i.src = d.serialize(a, b, c);
        i.async = !0;
        i.charset = "UTF-8";
        (e || f) && d.bean.add(i, n, g);
        f && (q = setTimeout(function () {
            f()
        }, 2E4));
        m.appendChild(i);
        return d
    };
    d.requireStylesheet = function (a, b, c) {
        var e = h.createElement("link");
        e.rel = "stylesheet";
        e.type = "text/css";
        e.href = d.serialize(a, b, c);
        m.appendChild(e);
        return d
    };
    d.requireSet = function (a, b, c) {
        var e = a.length;
        d.each(a, function (a) {
            d.require(a, {}, b, function () {
                --e === 0 && c()
            })
        })
    };
    d.injectCss = function (a) {
        var b = h.createElement("style");
        b.setAttribute("type", "text/css");
        a = a.replace(/\}/g, "}\n");
        c.location.href.match(/^https/) && (a = a.replace(/http:\/\//g, "https://"));
        b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(h.createTextNode(a));
        m.appendChild(b)
    }
});
DISQUS.define("JSON", function () {
    function c(a) {
        return a < 10 ? "0" + a : a
    }
    function g(b) {
        a.lastIndex = 0;
        return a.test(b) ? '"' + b.replace(a, function (a) {
            var b = e[a];
            return typeof b === "string" ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + b + '"'
    }
    function d(a, n) {
        var c, e, f, h, i = b,
            l, o = n[a];
        o && typeof o === "object" && typeof o.toJSON === "function" && !m && (o = o.toJSON(a));
        typeof p === "function" && (o = p.call(n, a, o));
        switch (typeof o) {
            case "string":
                return g(o);
            case "number":
                return isFinite(o) ? String(o) : "null";
            case "boolean":
            case "null":
                return String(o);
            case "object":
                if (!o) return "null";
                b += k;
                l = [];
                if (Object.prototype.toString.apply(o) === "[object Array]") {
                    h = o.length;
                    for (c = 0; c < h; c += 1) l[c] = d(c, o) || "null";
                    f = l.length === 0 ? "[]" : b ? "[\n" + b + l.join(",\n" + b) + "\n" + i + "]" : "[" + l.join(",") + "]";
                    b = i;
                    return f
                }
                if (p && typeof p === "object") {
                    h = p.length;
                    for (c = 0; c < h; c += 1) e = p[c], typeof e === "string" && (f = d(e, o)) && l.push(g(e) + (b ? ": " : ":") + f)
                } else for (e in o) Object.hasOwnProperty.call(o, e) && (f = d(e, o)) && l.push(g(e) + (b ? ": " : ":") + f);
                f = l.length === 0 ? "{}" : b ? "{\n" + b + l.join(",\n" + b) + "\n" + i + "}" : "{" + l.join(",") + "}";
                b = i;
                return f
        }
    }
    var h = {}, m = !1;
    if (typeof Date.prototype.toJSON !== "function") Date.prototype.toJSON = function () {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + c(this.getUTCMonth() + 1) + "-" + c(this.getUTCDate()) + "T" + c(this.getUTCHours()) + ":" + c(this.getUTCMinutes()) + ":" + c(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
        return this.valueOf()
    };
    var f = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        a = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        b, k, e = {
            "\u0008": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\u000c": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, p;
    h.stringify = function (a, n, c) {
        var e;
        k = b = "";
        if (typeof c === "number") for (e = 0; e < c; e += 1) k += " ";
        else typeof c === "string" && (k = c);
        if ((p = n) && typeof n !== "function" && (typeof n !== "object" || typeof n.length !== "number")) throw Error("JSON.stringify");
        return d("", {
            "": a
        })
    };
    h.parse = function (a, b) {
        function n(a,
        c) {
            var e, d, q = a[c];
            if (q && typeof q === "object") for (e in q) Object.hasOwnProperty.call(q, e) && (d = n(q, e), d !== void 0 ? q[e] = d : delete q[e]);
            return b.call(a, c, q)
        }
        var c, a = String(a);
        f.lastIndex = 0;
        f.test(a) && (a = a.replace(f, function (a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return c = eval("(" + a + ")"),
        typeof b === "function" ? n({
            "": c
        }, "") : c;
        throw new SyntaxError("JSON.parse");
    };
    var l = {
        a: [1, 2, 3]
    }, i, n;
    if (Object.toJSON && Object.toJSON(l).replace(/\s/g, "") === '{"a":[1,2,3]}') i = Object.toJSON;
    typeof String.prototype.evalJSON === "function" && (l = '{"a":[1,2,3]}'.evalJSON(), l.a && l.a.length === 3 && l.a[2] === 3 && (n = function (a) {
        return a.evalJSON()
    }));
    (function () {
        var a = [1, 2, 3];
        typeof a.toJSON === "function" && (a = a.toJSON(), m = !(a && a.length === 3 && a[2] === 3))
    })();
    if (m || !i || !n) return {
        stringify: h.stringify,
        parse: h.parse
    };
    return {
        stringify: i,
        parse: n
    }
});
DISQUS.define(function () {
    function c(b) {
        for (a = 1; b = g.shift();) b()
    }
    var g = [],
        d, h = document,
        m = h.documentElement,
        f = m.doScroll,
        a = /^loade|c/.test(h.readyState),
        b;
    h.addEventListener && h.addEventListener("DOMContentLoaded", d = function () {
        h.removeEventListener("DOMContentLoaded", d, !1);
        c()
    }, !1);
    f && h.attachEvent("onreadystatechange", d = function () {
        /^c/.test(h.readyState) && (h.detachEvent("onreadystatechange", d), c())
    });
    b = f ? function (c) {
        self != top ? a ? c() : g.push(c) : function () {
            try {
                m.doScroll("left")
            } catch (a) {
                return setTimeout(function () {
                    b(c)
                }, 50)
            }
            c()
        }()
    } : function (b) {
        a ? b() : g.push(b)
    };
    return {
        domready: b
    }
});
DISQUS.define("Events", function () {
    var c = /\s+/,
        g = {
            on: function (d, h, g) {
                var f, a;
                if (!h) return this;
                d = d.split(c);
                for (f = this._callbacks || (this._callbacks = {}); a = d.shift();) a = f[a] || (f[a] = []), a.push(h), a.push(g);
                return this
            },
            off: function (d, h, g) {
                var f, a, b;
                if (!(a = this._callbacks)) return this;
                if (!d && !h && !g) return delete this._callbacks, this;
                for (d = d ? d.split(c) : _.keys(a); f = d.shift();) if (!(b = a[f]) || !h && !g) delete a[f];
                else for (f = b.length - 2; f >= 0; f -= 2) h && b[f] !== h || g && b[f + 1] !== g || b.splice(f, 2);
                return this
            },
            trigger: function (d) {
                var g,
                m, f, a, b, k, e;
                if (!(m = this._callbacks)) return this;
                e = [];
                d = d.split(c);
                a = 1;
                for (b = arguments.length; a < b; a++) e[a - 1] = arguments[a];
                for (; g = d.shift();) {
                    if (k = m.all) k = k.slice();
                    if (f = m[g]) f = f.slice();
                    if (f) {
                        a = 0;
                        for (b = f.length; a < b; a += 2) f[a].apply(f[a + 1] || this, e)
                    }
                    if (k) {
                        g = [g].concat(e);
                        a = 0;
                        for (b = k.length; a < b; a += 2) k[a].apply(k[a + 1] || this, g)
                    }
                }
                return this
            }
        };
    g.bind = g.on;
    g.unbind = g.off;
    return g
});
DISQUS.define(function (c) {
    function g() {
        throw Error(Array.prototype.join.call(arguments, " "));
    }
    function d(a, b, c) {
        if (a.addEventListener) a.addEventListener(b, c, !1);
        else if (a.attachEvent) a.attachEvent("on" + b, c);
        else throw Error("No event support.");
    }
    var h = c.document,
        m = DISQUS.use("JSON"),
        f = {}, a = {}, b = 0;
    if (!(DISQUS.version && DISQUS.version() === "2")) {
        d(c, "message", function (b) {
            var c, e;
            for (e in a) if (Object.prototype.hasOwnProperty.call(a, e) && b.origin == a[e].origin) {
                c = !0;
                break
            }
            if (c) switch (c = m.parse(b.data), (e = a[c.sender]) || g("Message from our server but with invalid sender UID:", c.sender), c.scope) {
                case "host":
                    e.trigger(c.name, c.data);
                    break;
                case "global":
                    DISQUS.trigger(c.name, c.data);
                    break;
                default:
                    g("Message", c.scope, "not supported. Sender:", b.origin)
            }
        }, !1);
        d(c, "hashchange", function () {
            DISQUS.trigger("window.hashchange", {
                hash: c.location.hash
            })
        }, !1);
        d(c, "resize", function () {
            DISQUS.trigger("window.resize")
        }, !1);
        var k = function () {
            DISQUS.trigger("window.scroll")
        };
        (function (a, b, c, e) {
            var g = (new Date).getTime();
            d(a, b, function () {
                var a = (new Date).getTime();
                a - g >= e && (g = a, c())
            })
        })(c, "scroll", k, 250);
        (function (a, b, c, e) {
            var g;
            d(a, b, function (a) {
                g && clearTimeout(g);
                g = setTimeout(function () {
                    c(a)
                }, e)
            })
        })(c, "scroll", k, 300);
        d(h, "click", function () {
            DISQUS.trigger("window.click")
        });
        k = function () {
            this.uid = b++;
            f[this.uid] = this
        };
        DISQUS.extend(k.prototype, DISQUS.Events);
        k.prototype.destroy = function () {
            delete f[this.uid]
        };
        DISQUS.extend(k, {
            listByKey: function () {
                var a = {}, b;
                for (b in f) Object.prototype.hasOwnProperty.call(f, b) && (a[b] = f[b]);
                return a
            },
            list: function () {
                var a = [],
                    b;
                for (b in f) Object.prototype.hasOwnProperty.call(f, b) && a.push(f[b]);
                return a
            },
            get: function (a) {
                if (Object.prototype.hasOwnProperty.call(f, a)) return f[a];
                return null
            }
        });
        var e = function (a) {
            a = a || {};
            this.isReady = !1;
            this.uid = a.uid || b++;
            this.elem = null;
            this.styles = {};
            this.role = a.role || "application"
        };
        e.prototype.load = function () {
            var a = this.elem = h.createElement("iframe");
            a.setAttribute("id", "dsq" + this.uid);
            a.setAttribute("data-disqus-uid", this.uid);
            a.setAttribute("allowTransparency", "true");
            a.setAttribute("frameBorder", "0");
            a.setAttribute("role", this.role);
            for (var b in this.styles) this.styles.hasOwnProperty(b) && (a.style[b] = this.styles[b])
        };
        e.prototype.destroy = function () {
            this.elem && this.elem.parentNode.removeChild(this.elem)
        };
        var p = function (b) {
            var c = this;
            e.call(c, b);
            c.listeners = {};
            c.origin = b.origin;
            c.target = b.target;
            c.container = b.container;
            c.styles = {
                width: "100%",
                border: "none",
                overflow: "hidden",
                display: "none"
            };
            a[c.uid] = c;
            c.on("ready", function () {
                c.isReady = !0
            })
        };
        DISQUS.extend(p.prototype,
        DISQUS.Events);
        p.prototype.load = function (a) {
            e.prototype.load.call(this);
            var b = this.elem;
            b.setAttribute("width", "100%");
            b.setAttribute("src", this.target + "#" + this.uid);
            d(b, "load", function () {
                b.style.display = "";
                a && a()
            });
            (h.getElementById(this.container) || h.body).appendChild(b);
            this.elem = b
        };
        p.prototype.sendMessage = function (a, b) {
            var c = function (a, b, c) {
                return function () {
                    c.elem.contentWindow.postMessage(a, b)
                }
            }(m.stringify({
                scope: "client",
                data: {
                    eventName: a,
                    data: b
                }
            }), this.origin, this);
            if (this.isReady) c();
            else this.on("ready",
            c)
        };
        p.prototype.getPosition = function () {
            for (var a = this.elem, b = 0, c = 0; a;) b += a.offsetLeft, c += a.offsetTop, a = a.offsetParent;
            return {
                top: c,
                left: b
            }
        };
        p.prototype.inViewport = function (a) {
            var a = a || this.getPosition(),
                a = a.top,
                b = a + this.elem.offsetHeight,
                e = c.pageYOffset;
            return !(a > e + c.innerHeight || b < e)
        };
        p.prototype.destroy = function () {
            this.off();
            e.prototype.destroy.call(this)
        };
        var l = function (a) {
            e.call(this, a);
            this.contents = a.contents;
            this.container = a.container;
            this.styles = {
                width: "100%",
                border: "none",
                overflow: "hidden"
            };
            a.styles = a.styles || {};
            for (var b in a.styles) a.styles.hasOwnProperty(b) && (this.styles[b] = a.styles[b])
        };
        l.prototype.load = function () {
            e.prototype.load.call(this);
            var a = this.elem;
            a.setAttribute("scrolling", "no");
            (h.getElementById(this.container) || h.body).appendChild(a);
            this.element = a;
            this.window = a.contentWindow;
            try {
                this.window.document.open()
            } catch (b) {
                a.src = "javascript:var d=document.open();d.domain='" + h.domain + "';void(0);"
            }
            this.document = this.window.document;
            this.document.write(this.contents);
            this.document.close();
            if (a = this.document.body) this.element.style.height = a.offsetHeight + "px"
        };
        l.prototype.exec = function (a) {
            a.call(this, this.window, this.document)
        };
        l.prototype.hide = function () {
            var a = this.element.style.display;
            if (a !== "none") this._display = a;
            this.element.style.display = "none"
        };
        l.prototype.show = function () {
            this.element.style.display = this._display || "block"
        };
        l.prototype.click = function (a) {
            d(this.document.body, "click", function (b) {
                a(b)
            })
        };
        l.prototype.destroy = e.prototype.destroy;
        var i = DISQUS.extend({}, DISQUS.Events);
        return {
            IFRAME: "__widget_iframe__",
            log: function (a) {
                var b = h.getElementById("messages");
                if (b) {
                    var c = h.createElement("p");
                    c.innerHTML = a;
                    b.appendChild(c)
                }
            },
            version: function () {
                return "2"
            },
            on: i.on,
            off: i.off,
            trigger: i.trigger,
            Channel: p,
            Sandbox: l,
            App: k
        }
    }
});
DISQUS.define("publisher", function (c) {
    function g(a, b, d) {
        var e, d = d || b;
        if (a === f) return "";
        c.getComputedStyle ? e = f.defaultView.getComputedStyle(a, null).getPropertyValue(b) : a.currentStyle && (e = a.currentStyle[b] ? a.currentStyle[b] : a.currentStyle[d]);
        return e == "transparent" || e === "" || e == "rgba(0, 0, 0, 0)" ? g(a.parentNode, b, d) : e || null
    }
    function d(a) {
        function b(a) {
            a = Number(a).toString(16);
            return a.length == 1 ? "0" + a : a
        }
        if (a.substr(0, 1) === "#") return a;
        var c = /.*?rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(a);
        if (!c || c.length !== 4) return "";
        var a = b(c[1]),
            e = b(c[2]),
            c = b(c[3]);
        return "#" + a + e + c
    }
    function h(a, b, c, e) {
        DISQUS.isString(b) && (b = f.createElement(b));
        var d = null;
        b.style.visibility = "hidden";
        a.appendChild(b);
        d = g(b, c, e);
        a.removeChild(b);
        return d
    }
    function m(a) {
        return a.toLowerCase().replace(/^\s+|\s+$/g, "").replace(/['"]/g, "")
    }
    var f = c.document;
    return {
        getContrastYIQ: function (a) {
            a.match("^rgb") && (a = d(a).substr(1));
            var b = parseInt(a.substr(0, 2), 16),
                c = parseInt(a.substr(2, 2), 16),
                a = parseInt(a.substr(4, 2), 16);
            return (b * 299 + c * 587 + a * 114) / 1E3
        },
        colorToHex: d,
        getElementStyle: h,
        getAnchorColor: function (a) {
            var b = f.createElement("a");
            b.href = +new Date;
            return h(a, b, "color")
        },
        normalizeFontValue: m,
        isSerif: function (a) {
            for (var a = h(a, "span", "font-family", "fontFamily").split(","), b = {
                courier: 1,
                times: 1,
                "times new roman": 1,
                georgia: 1,
                palatino: 1,
                serif: 1
            }, c, e = 0; e < a.length; e++) if (c = m(a[e]), b.hasOwnProperty(c)) return !0;
            return !1
        }
    }
});
DISQUS.define(function () {
    function c(c) {
        DISQUS.App.call(this);
        this.switches = {};
        var d = {
            target: c.useSSL ? "https://securecdn.disqus.com/1351906900/build/next-switches/client_ssl.html" : "http://mediacdn.disqus.com/1351906900/build/next-switches/client.html",
            container: c.container
        };
        d.origin = c.useSSL ? "https://securecdn.disqus.com" : "http://mediacdn.disqus.com";
        this.frame = new DISQUS.Channel(d);
        var h = this;
        this.frame.load(function () {
            h.frame.elem.style.display = "none"
        })
    }
    c.prototype = DISQUS.extend({
        fetch: function (c) {
            var d = this,
                c = c || {}, h = c.success;
            delete c.success;
            this.frame.on("switches.received", function (c) {
                d.switches = c;
                DISQUS.trigger("switches.changed", c);
                h && h(c)
            });
            this.frame.sendMessage("fetch", c)
        },
        enabled: function (c) {
            return this.switches[c] ? this.switches[c] : !1
        }
    }, DISQUS.App.prototype);
    return {
        Switches: function (g) {
            return new c(g)
        }
    }
});
DISQUS.define(function (c, g) {
    function d(a, c, b, d, f, g) {
        return '<img width="' + a + '" height="' + c + '" alt="' + d + '" src="data:image/' + b + ";base64," + f + '"' + (g ? 'style="' + g + '"' : "") + "/>"
    }
    function h(a) {
        for (var c = DISQUS.App.list(), d = 0, f = c.length, c = c[d]; d < f; d++) c instanceof b && a(c)
    }
    var m = c.document,
        f = ["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", "TkSuQmCC"],
        a = ["R0lGODlhEAALAPQAAP///z2LqeLt8dvp7u7090GNqz2LqV+fuJ/F1IW2ycrf51aatHWs", "waXJ14i4ys3h6FmctUCMqniuw+vz9eHs8fb5+meku+Tu8vT4+cfd5bbT3tbm7PH2+AAA", "AAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQu", "aW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27if", "DgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeR", "vsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjoth", "LOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh", "+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+", "YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY", "5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAs", "AAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00k", "j5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpy", "HCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAA", "BS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7", "AAAAAAAAAAAA"],
        b = function (a) {
            DISQUS.App.call(this);
            this.settings = a;
            this.indicators = {
                north: null,
                south: null
            };
            this._boundGlobalEvents = [];
            this.frame = null
        };
    DISQUS.extend(b.prototype, DISQUS.App.prototype);
    b.prototype.init = function () {
        function b(a, d, e) {
            j.on("affiliateLink", function (b) {
                if (!c.vglnk.$) return void j.sendMessage("affiliateLink");
                c.vglnk.$.request(a + "/click", {
                    format: "jsonp",
                    out: b.url,
                    key: d,
                    loc: j.target,
                    subId: e
                }, {
                    fn: function (a) {
                        return function (c) {
                            var b = {
                                token: a
                            };
                            if (c) b.url = c;
                            j.sendMessage("affiliateLink",
                            b)
                        }
                    }(b.token),
                    timeout: c.vglnk.opt("click_timeout")
                })
            })
        }
        function h(a, c) {
            l._boundGlobalEvents.push(a);
            DISQUS.on(a, c, l)
        }
        var l = this,
            i = l.settings,
            k = "http://disqus.com/embed/comments/",
            q = "http://disqus.com";
        i.useSSL && (k = "https://disqus.com/embed/comments/", q = "https://disqus.com");
        var r = {
            f: i.forum,
            t_i: i.identifier,
            t_u: i.url || c.location.href,
            t_s: i.slug,
            t_t: i.title,
            s_o: i.sortOrder,
            c: i.useConman || g
        };
        if (i.notSupported) r.n_s = 1;
        var s = DISQUS.isString(i.container) ? m.getElementById(i.container) : i.container,
            j = l.frame = new DISQUS.Channel({
                origin: q,
                target: DISQUS.serialize(k, r),
                container: i.container,
                uid: this.uid
            });
        if (i.notSupported) j.styles.height = "500px";
        var u = !1,
            t, v;
        if (!i.notSupported) t = m.createElement("div"), t.innerHTML = d(71, 17, "png", "DISQUS", f.join("")) + d(16, 11, "gif", "...", a.join(""), "margin:0 0 3px 5px"), s.appendChild(t);
        k = function () {
            var a = j.getPosition(),
                b = c.pageYOffset,
                d = c.innerHeight,
                e = j.inViewport(a);
            e ? (u = !0, j.sendMessage("window.scroll", {
                frameOffset: a,
                pageOffset: b,
                height: d
            }), j.sendMessage("window.inViewport")) : u && !e && (u = !1, j.sendMessage("window.scrollOffViewport"))
        };
        j.on("ready", function o(a) {
            j.off("ready", o);
            t && t.parentNode === s && s.removeChild(t);
            c.clearTimeout(v);
            var b = {
                themeUrl: i.themeUrl,
                permalink: i.permalink,
                anchorColor: i.anchorColor,
                referrer: c.location.href,
                colorScheme: i.colorScheme,
                language: i.language,
                customStrings: i.customStrings,
                typeface: i.typeface,
                remoteAuthS3: i.remoteAuthS3,
                apiKey: i.apiKey,
                sso: i.sso,
                parentWindowHash: c.location.hash
            };
            if (c.navigator.userAgent.match(/(iPad|iPhone|iPod)/)) b.width = j.elem.offsetWidth;
            j.inViewport() && j.sendMessage("window.inViewport");
            l.clientData = a;
            j.sendMessage("init", b);
            l.trigger("loading.init")
        });
        j.on("resize", function (a) {
            j.elem.style.height = a.height + "px"
        });
        j.on("reload", function () {
            c.location.reload()
        });
        j.on("reset", function () {
            DISQUS.reset({
                reload: !0
            })
        });
        j.on("posts.paginate", function () {
            l.trigger("posts.paginate")
        });
        j.on("posts.create", function (a) {
            l.trigger("posts.create", {
                id: a.id,
                text: a.raw_message
            })
        });
        j.on("scrollTo", function (a) {
            var b = j.getPosition(),
                b = a.relative === "window" ? a.top : b.top + a.top;
            (a.force || !(b > c.pageYOffset && b < c.pageYOffset + c.innerHeight)) && c.scrollTo(0, b)
        });
        j.on("fakeScroll", k);
        j.on("realtime.init", function (a) {
            for (var b = ["north", "south"], c, d, e = 0; e < b.length; e++) d = b[e], c = new DISQUS.Sandbox({
                uid: "-indicator-" + d,
                container: l.settings.container,
                contents: a[d].contents,
                styles: a[d].styles
            }), c.load(), c.hide(),
            function (a) {
                c.click(function () {
                    j.sendMessage("realtime.click", a)
                })
            }(d), l.indicators[d] = c
        });
        j.on("realtime.showNorth", function (a) {
            var b = l.indicators.north;
            b.document.getElementById("message").innerHTML = a;
            b.show()
        });
        j.on("realtime.hideNorth", function () {
            l.indicators.north.hide()
        });
        j.on("realtime.showSouth", function (a) {
            var b = l.indicators.south;
            b.document.getElementById("message").innerHTML = a;
            b.show()
        });
        j.on("realtime.hideSouth", function () {
            l.indicators.south.hide()
        });
        j.on("mainViewRendered", function () {
            DISQUS.trigger("lounge:mainViewRendered");
            l.trigger("loading.done")
        });
        j.on("loadLinkAffiliator", function (a) {
            j.off("loadLinkAffiliator");
            if (!c.vglnk_self && !c.vglnk && ! function () {
                for (var a in c) if (a.indexOf("skimlinks") === 0 || a.indexOf("skimwords") === 0) return !0;
                return !1
            }()) {
                var d = a.apiUrl,
                    f = a.key,
                    g = String(a.id);
                if (!(a.clientUrl == null || d == null || f == null || a.id == null)) c.vglnk = {
                    api_url: d,
                    key: f,
                    sub_id: g
                }, DISQUS.require(a.clientUrl), DISQUS.defer(function () {
                    return c.vglnk.opt
                }, function () {
                    j.sendMessage("affiliationOptions", {
                        timeout: c.vglnk.opt("click_timeout")
                    })
                }), b(d, f, g)
            }
        });
        v = c.setTimeout(function () {
            t.innerHTML += '<p>DISQUS seems to be taking longer than usual. <a href="#" onclick="DISQUS.reset({reload: true}); return false;">Reload</a>?</p>'
        },
        1E4);
        j.load(function () {
            i.notSupported ? (j.elem.setAttribute("height", "500px"), j.elem.setAttribute("scrolling", "yes"), j.elem.setAttribute("horizontalscrolling", "no"), j.elem.setAttribute("verticalscrolling", "yes")) : (j.elem.setAttribute("scrolling", "no"), j.elem.setAttribute("horizontalscrolling", "no"), j.elem.setAttribute("verticalscrolling", "no"))
        });
        h("window.hashchange", function (a) {
            j.sendMessage("window.hashchange", a.hash)
        });
        h("window.resize", function () {
            j.sendMessage("window.resize")
        });
        h("window.scroll",
        k);
        h("window.click", function () {
            j.sendMessage("window.click")
        });
        h("switches.changed", function (a) {
            j.sendMessage("switches.changed", a)
        });
        l.trigger("loading.start")
    };
    b.prototype.destroy = function () {
        var a = this.indicators;
        this.off();
        if (this._boundGlobalEvents.length) DISQUS.off(this._boundGlobalEvents.join(" "), null, this), this._boundGlobalEvents = null;
        this.frame && this.frame.destroy();
        if (a.north) a.north.destroy(), a.north = null;
        if (a.south) a.south.destroy(), a.south = null;
        DISQUS.App.prototype.destroy.call(this)
    };
    var k = function (a) {
        return new b(a)
    };
    DISQUS.extend(k, {
        listByKey: function () {
            var a = {};
            h(function (b) {
                a[b.uid] = b
            });
            return a
        },
        list: function () {
            var a = [];
            h(function (b) {
                a.push(b)
            });
            return a
        },
        get: function (a) {
            a = DISQUS.App.get(a);
            return a instanceof b && a
        }
    });
    return {
        Lounge: k
    }
});
(function (c, g, d) {
    function h() {
        function a(b) {
            var b = b.getAttribute ? b.getAttribute("src") : b.src,
                c = [/(https?:)\/\/(www\.)?disqus\.com\/forums\/([\w_\-]+)/i, /(https?:)\/\/(www\.)?([\w_\-]+)\.disqus\.com/i, /(https?:)\/\/(www\.)?dev\.disqus\.org\/forums\/([\w_\-]+)/i, /(https?:)\/\/(www\.)?([\w_\-]+)\.dev\.disqus\.org/i],
                d = c.length;
            if (!b || b.substring(b.length - 8) != "embed.js") return null;
            for (var e = 0; e < d; e++) {
                var f = b.match(c[e]);
                if (f && f.length && f.length == 4) return p = f[1] || null, f[3]
            }
            return null
        }
        for (var b = g.getElementsByTagName("script"),
        c = b.length - 1; c >= 0; c--) {
            var d = a(b[c]);
            if (d !== null) return d
        }
        return null
    }
    function m() {
        if (c.location.protocol === "https:") return !0;
        p === d && h();
        return p === "https:"
    }
    function f() {
        for (var a = g.getElementsByTagName("h1"), b = g.title, c = b.length, e = b, f = 0.6, h = 0; h < a.length; h++)(function (a) {
            var a = a.textContent || a.innerText,
                g;
            if (!(a === null || a === d)) {
                g = 0;
                for (var h = Array(b.length), i = 0; i <= b.length; i++) {
                    h[i] = Array(a.length);
                    for (var j = 0; j <= a.length; j++) h[i][j] = 0
                }
                for (i = 0; i < b.length; i++) for (j = 0; j < a.length; j++) b[i] == a[j] && (h[i + 1][j + 1] = h[i][j] + 1, h[i + 1][j + 1] > g && (g = h[i + 1][j + 1]));
                g /= c;
                g > f && (f = g, e = a)
            }
        })(a[h]);
        return e
    }
    function a() {
        g.getElementById(k).innerHTML = "";
        var a = i.page;
        if (!c.postMessage || !c.JSON) s = !0;
        if (c.navigator.appName === "Microsoft Internet Explorer" && (!g.documentMode || g.documentMode < 8)) s = !0;
        a = {
            container: k,
            forum: n,
            sortOrder: "popular",
            permalink: l,
            useSSL: m(),
            language: i.language,
            customStrings: i.strings || c.disqus_custom_strings,
            typeface: b.isSerif(e) ? "serif" : "sans-serif",
            anchorColor: b.getAnchorColor(e),
            colorScheme: 128 < b.getContrastYIQ(b.getElementStyle(e, "span", "color")) ? "dark" : "light",
            url: a.url || c.location.href.replace(/#.*$/, ""),
            title: a.title || f(),
            slug: a.slug,
            category: a.category_id,
            identifier: a.identifier,
            apiKey: a.api_key,
            remoteAuthS3: a.remote_auth_s3,
            sso: i.sso,
            themeUrl: c.disqus_theme_root_url,
            useConman: c.disqus_demo,
            notSupported: s
        };
        r = DISQUS.Lounge(a);
        var d = {
            onReady: "loading.done",
            onNewComment: "posts.create",
            onPaginate: "posts.paginate"
        };
        DISQUS.each(i.callbacks, function (a, b) {
            d[b] && DISQUS.each(a, function (a) {
                r.on(d[b],
                a)
            })
        });
        r.init()
    }
    var b = DISQUS.use("publisher"),
        k = c.disqus_container_id || "disqus_thread",
        e = g.getElementById(k),
        p, l = function () {
            var a = c.location.hash;
            return (a = a && a.match(/comment\-([0-9]+)/)) && a[1]
        }(),
        i = {
            page: {
                url: d,
                title: d,
                slug: d,
                category_id: d,
                identifier: d,
                language: d,
                api_key: d,
                remote_auth_s3: d,
                author_s3: d,
                developer: d
            },
            strings: d,
            sso: {},
            callbacks: {
                preData: [],
                preInit: [],
                onInit: [],
                afterRender: [],
                onReady: [],
                onNewComment: [],
                preReset: [],
                onPaginate: []
            }
        };
    DISQUS.each(["developer", "shortname", "identifier", "url", "title", "category_id", "language", "slug"], function (a) {
        var b = c["disqus_" + a];
        typeof b !== "undefined" && (i.page[a] = b)
    });
    var n = c.disqus_shortname || h(),
        n = n.toLowerCase();
    if (typeof c.disqus_config === "function") try {
        c.disqus_config.call(i)
    } catch (q) {}
    var r, s = !1;
    a();
    if (!s) {
        var j = DISQUS.Switches({
            container: k,
            useSSL: m()
        });
        j.fetch({
            data: {
                forum: n
            }
        });
        DISQUS.domready(function () {
            if (g.getElementsByClassName) {
                var a = g.getElementsByClassName("dsq-brlink");
                a && a.length && a[0].parentNode.removeChild(a[0])
            }
        });
        DISQUS.request = {
            get: function (a, b, c) {
                DISQUS.require(a, b, c)
            }
        };
        DISQUS.reset = function (b) {
            b = b || {};
            if (typeof b.config === "function") try {
                b.config.call(i)
            } catch (c) {}
            r && (r.destroy(), r = null);
            b.reload && (a(), DISQUS.trigger("switches.changed", j.switches))
        }
    }
})(this, this.document);