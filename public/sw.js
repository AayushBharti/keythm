(() => {
  let e,
    t,
    a,
    s,
    r,
    n = {
      googleAnalytics: "googleAnalytics",
      precache: "precache-v2",
      prefix: "serwist",
      runtime: "runtime",
      suffix: typeof registration < "u" ? registration.scope : "",
    },
    i = (e) =>
      [n.prefix, e, n.suffix].filter((e) => e && e.length > 0).join("-"),
    c = (e) => e || i(n.precache),
    o = (e) => e || i(n.runtime);
  class l extends Error {
    details;
    constructor(e, t) {
      super(
        ((e, ...t) => {
          let a = e;
          return t.length > 0 && (a += ` :: ${JSON.stringify(t)}`), a;
        })(e, t)
      ),
        (this.name = e),
        (this.details = t);
    }
  }
  function h(e) {
    return new Promise((t) => setTimeout(t, e));
  }
  const u = new Set();
  function d(e, t) {
    const a = new URL(e);
    for (const e of t) {
      a.searchParams.delete(e);
    }
    return a.href;
  }
  async function m(e, t, a, s) {
    const r = d(t.url, a);
    if (t.url === r) {
      return e.match(t, s);
    }
    const n = { ...s, ignoreSearch: !0 };
    for (const i of await e.keys(t, n)) {
      if (r === d(i.url, a)) {
        return e.match(i, s);
      }
    }
  }
  class f {
    promise;
    resolve;
    reject;
    constructor() {
      this.promise = new Promise((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  }
  let g = async () => {
      for (const e of u) {
        await e();
      }
    },
    w = "-precache-",
    p = async (e, t = w) => {
      const a = (await self.caches.keys()).filter(
        (a) => a.includes(t) && a.includes(self.registration.scope) && a !== e
      );
      return await Promise.all(a.map((e) => self.caches.delete(e))), a;
    },
    y = (e, t) => {
      const a = t();
      return e.waitUntil(a), a;
    },
    _ = (e, t) => t.some((t) => e instanceof t),
    x = new WeakMap(),
    b = new WeakMap(),
    E = new WeakMap(),
    R = {
      get(e, t, a) {
        if (e instanceof IDBTransaction) {
          if (t === "done") {
            return x.get(e);
          }
          if (t === "store") {
            return a.objectStoreNames[1]
              ? void 0
              : a.objectStore(a.objectStoreNames[0]);
          }
        }
        return v(e[t]);
      },
      set: (e, t, a) => ((e[t] = a), !0),
      has: (e, t) =>
        (e instanceof IDBTransaction && (t === "done" || t === "store")) ||
        t in e,
    };
  function v(e) {
    if (e instanceof IDBRequest) {
      let t;
      return (
        (t = new Promise((t, a) => {
          const s = () => {
              e.removeEventListener("success", r),
                e.removeEventListener("error", n);
            },
            r = () => {
              t(v(e.result)), s();
            },
            n = () => {
              a(e.error), s();
            };
          e.addEventListener("success", r), e.addEventListener("error", n);
        })),
        E.set(t, e),
        t
      );
    }
    if (b.has(e)) {
      return b.get(e);
    }
    const t = ((e) => {
      if (typeof e == "function") {
        return (
          r ||
          (r = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
          ])
        ).includes(e)
          ? function (...t) {
              return e.apply(q(this), t), v(this.request);
            }
          : function (...t) {
              return v(e.apply(q(this), t));
            };
      }
      return (e instanceof IDBTransaction &&
        ((e) => {
          if (x.has(e)) {
            return;
          }
          const t = new Promise((t, a) => {
            const s = () => {
                e.removeEventListener("complete", r),
                  e.removeEventListener("error", n),
                  e.removeEventListener("abort", n);
              },
              r = () => {
                t(), s();
              },
              n = () => {
                a(e.error || new DOMException("AbortError", "AbortError")), s();
              };
            e.addEventListener("complete", r),
              e.addEventListener("error", n),
              e.addEventListener("abort", n);
          });
          x.set(e, t);
        })(e),
      _(
        e,
        s ||
          (s = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
          ])
      ))
        ? new Proxy(e, R)
        : e;
    })(e);
    return t !== e && (b.set(e, t), E.set(t, e)), t;
  }
  const q = (e) => E.get(e);
  function S(
    e,
    t,
    { blocked: a, upgrade: s, blocking: r, terminated: n } = {}
  ) {
    const i = indexedDB.open(e, t),
      c = v(i);
    return (
      s &&
        i.addEventListener("upgradeneeded", (e) => {
          s(v(i.result), e.oldVersion, e.newVersion, v(i.transaction), e);
        }),
      a &&
        i.addEventListener("blocked", (e) => a(e.oldVersion, e.newVersion, e)),
      c
        .then((e) => {
          n && e.addEventListener("close", () => n()),
            r &&
              e.addEventListener("versionchange", (e) =>
                r(e.oldVersion, e.newVersion, e)
              );
        })
        .catch(() => {}),
      c
    );
  }
  const D = ["get", "getKey", "getAll", "getAllKeys", "count"],
    N = ["put", "add", "delete", "clear"],
    C = new Map();
  function T(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string")) {
      return;
    }
    if (C.get(t)) {
      return C.get(t);
    }
    const a = t.replace(/FromIndex$/, ""),
      s = t !== a,
      r = N.includes(a);
    if (
      !(a in (s ? IDBIndex : IDBObjectStore).prototype && (r || D.includes(a)))
    ) {
      return;
    }
    const n = async function (e, ...t) {
      let n = this.transaction(e, r ? "readwrite" : "readonly"),
        i = n.store;
      return (
        s && (i = i.index(t.shift())),
        (await Promise.all([i[a](...t), r && n.done]))[0]
      );
    };
    return C.set(t, n), n;
  }
  R = {
    ...(e = R),
    get: (t, a, s) => T(t, a) || e.get(t, a, s),
    has: (t, a) => !!T(t, a) || e.has(t, a),
  };
  const P = ["continue", "continuePrimaryKey", "advance"],
    k = {},
    A = new WeakMap(),
    I = new WeakMap(),
    U = {
      get(e, t) {
        if (!P.includes(t)) {
          return e[t];
        }
        let a = k[t];
        return (
          a ||
            (a = k[t] =
              function (...e) {
                A.set(this, I.get(this)[t](...e));
              }),
          a
        );
      },
    };
  async function* L(...e) {
    let t = this;
    if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) {
      return;
    }
    const a = new Proxy(t, U);
    for (I.set(a, t), E.set(a, q(t)); t; ) {
      yield a, (t = await (A.get(a) || t.continue())), A.delete(a);
    }
  }
  function F(e, t) {
    return (
      (t === Symbol.asyncIterator &&
        _(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      (t === "iterate" && _(e, [IDBIndex, IDBObjectStore]))
    );
  }
  R = {
    ...(t = R),
    get: (e, a, s) => (F(e, a) ? L : t.get(e, a, s)),
    has: (e, a) => F(e, a) || t.has(e, a),
  };
  const M = async (e, t) => {
      let s = null;
      if ((e.url && (s = new URL(e.url).origin), s !== self.location.origin)) {
        throw new l("cross-origin-copy-response", { origin: s });
      }
      const r = e.clone(),
        n = {
          headers: new Headers(r.headers),
          status: r.status,
          statusText: r.statusText,
        },
        i = t ? t(n) : n,
        c = (() => {
          if (void 0 === a) {
            const e = new Response("");
            if ("body" in e) {
              try {
                new Response(e.body), (a = !0);
              } catch {
                a = !1;
              }
            }
            a = !1;
          }
          return a;
        })()
          ? r.body
          : await r.blob();
      return new Response(c, i);
    },
    O = "requests",
    B = "queueName";
  class K {
    _db = null;
    async addEntry(e) {
      const t = (await this.getDb()).transaction(O, "readwrite", {
        durability: "relaxed",
      });
      await t.store.add(e), await t.done;
    }
    async getFirstEntryId() {
      const e = await this.getDb(),
        t = await e.transaction(O).store.openCursor();
      return t?.value.id;
    }
    async getAllEntriesByQueueName(e) {
      const t = await this.getDb();
      return (await t.getAllFromIndex(O, B, IDBKeyRange.only(e))) || [];
    }
    async getEntryCountByQueueName(e) {
      return (await this.getDb()).countFromIndex(O, B, IDBKeyRange.only(e));
    }
    async deleteEntry(e) {
      const t = await this.getDb();
      await t.delete(O, e);
    }
    async getFirstEntryByQueueName(e) {
      return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "next");
    }
    async getLastEntryByQueueName(e) {
      return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "prev");
    }
    async getEndEntryFromIndex(e, t) {
      const a = await this.getDb(),
        s = await a.transaction(O).store.index(B).openCursor(e, t);
      return s?.value;
    }
    async getDb() {
      return (
        this._db ||
          (this._db = await S("serwist-background-sync", 3, {
            upgrade: this._upgradeDb,
          })),
        this._db
      );
    }
    _upgradeDb(e, t) {
      t > 0 &&
        t < 3 &&
        e.objectStoreNames.contains(O) &&
        e.deleteObjectStore(O),
        e
          .createObjectStore(O, { autoIncrement: !0, keyPath: "id" })
          .createIndex(B, B, { unique: !1 });
    }
  }
  class W {
    _queueName;
    _queueDb;
    constructor(e) {
      (this._queueName = e), (this._queueDb = new K());
    }
    async pushEntry(e) {
      delete e.id,
        (e.queueName = this._queueName),
        await this._queueDb.addEntry(e);
    }
    async unshiftEntry(e) {
      const t = await this._queueDb.getFirstEntryId();
      t ? (e.id = t - 1) : delete e.id,
        (e.queueName = this._queueName),
        await this._queueDb.addEntry(e);
    }
    async popEntry() {
      return this._removeEntry(
        await this._queueDb.getLastEntryByQueueName(this._queueName)
      );
    }
    async shiftEntry() {
      return this._removeEntry(
        await this._queueDb.getFirstEntryByQueueName(this._queueName)
      );
    }
    async getAll() {
      return await this._queueDb.getAllEntriesByQueueName(this._queueName);
    }
    async size() {
      return await this._queueDb.getEntryCountByQueueName(this._queueName);
    }
    async deleteEntry(e) {
      await this._queueDb.deleteEntry(e);
    }
    async _removeEntry(e) {
      return e && (await this.deleteEntry(e.id)), e;
    }
  }
  const j = [
    "method",
    "referrer",
    "referrerPolicy",
    "mode",
    "credentials",
    "cache",
    "redirect",
    "integrity",
    "keepalive",
  ];
  class $ {
    _requestData;
    static async fromRequest(e) {
      const t = { url: e.url, headers: {} };
      for (const a of (e.method !== "GET" &&
        (t.body = await e.clone().arrayBuffer()),
      e.headers.forEach((e, a) => {
        t.headers[a] = e;
      }),
      j)) {
        void 0 !== e[a] && (t[a] = e[a]);
      }
      return new $(t);
    }
    constructor(e) {
      e.mode === "navigate" && (e.mode = "same-origin"),
        (this._requestData = e);
    }
    toObject() {
      const e = { ...this._requestData };
      return (
        (e.headers = { ...this._requestData.headers }),
        e.body && (e.body = e.body.slice(0)),
        e
      );
    }
    toRequest() {
      return new Request(this._requestData.url, this._requestData);
    }
    clone() {
      return new $(this.toObject());
    }
  }
  const H = "serwist-background-sync",
    G = new Set(),
    Q = (e) => {
      const t = {
        request: new $(e.requestData).toRequest(),
        timestamp: e.timestamp,
      };
      return e.metadata && (t.metadata = e.metadata), t;
    };
  class V {
    _name;
    _onSync;
    _maxRetentionTime;
    _queueStore;
    _forceSyncFallback;
    _syncInProgress = !1;
    _requestsAddedDuringSync = !1;
    constructor(
      e,
      { forceSyncFallback: t, onSync: a, maxRetentionTime: s } = {}
    ) {
      if (G.has(e)) {
        throw new l("duplicate-queue-name", { name: e });
      }
      G.add(e),
        (this._name = e),
        (this._onSync = a || this.replayRequests),
        (this._maxRetentionTime = s || 10_080),
        (this._forceSyncFallback = !!t),
        (this._queueStore = new W(this._name)),
        this._addSyncListener();
    }
    get name() {
      return this._name;
    }
    async pushRequest(e) {
      await this._addRequest(e, "push");
    }
    async unshiftRequest(e) {
      await this._addRequest(e, "unshift");
    }
    async popRequest() {
      return this._removeRequest("pop");
    }
    async shiftRequest() {
      return this._removeRequest("shift");
    }
    async getAll() {
      const e = await this._queueStore.getAll(),
        t = Date.now(),
        a = [];
      for (const s of e) {
        const e = 60 * this._maxRetentionTime * 1e3;
        t - s.timestamp > e
          ? await this._queueStore.deleteEntry(s.id)
          : a.push(Q(s));
      }
      return a;
    }
    async size() {
      return await this._queueStore.size();
    }
    async _addRequest(
      { request: e, metadata: t, timestamp: a = Date.now() },
      s
    ) {
      const r = {
        requestData: (await $.fromRequest(e.clone())).toObject(),
        timestamp: a,
      };
      switch ((t && (r.metadata = t), s)) {
        case "push":
          await this._queueStore.pushEntry(r);
          break;
        case "unshift":
          await this._queueStore.unshiftEntry(r);
      }
      this._syncInProgress
        ? (this._requestsAddedDuringSync = !0)
        : await this.registerSync();
    }
    async _removeRequest(e) {
      let t,
        a = Date.now();
      switch (e) {
        case "pop":
          t = await this._queueStore.popEntry();
          break;
        case "shift":
          t = await this._queueStore.shiftEntry();
      }
      if (t) {
        const s = 60 * this._maxRetentionTime * 1e3;
        return a - t.timestamp > s ? this._removeRequest(e) : Q(t);
      }
    }
    async replayRequests() {
      let e;
      while ((e = await this.shiftRequest())) {
        try {
          await fetch(e.request.clone());
        } catch {
          throw (
            (await this.unshiftRequest(e),
            new l("queue-replay-failed", { name: this._name }))
          );
        }
      }
    }
    async registerSync() {
      if ("sync" in self.registration && !this._forceSyncFallback) {
        try {
          await self.registration.sync.register(`${H}:${this._name}`);
        } catch (e) {}
      }
    }
    _addSyncListener() {
      "sync" in self.registration && !this._forceSyncFallback
        ? self.addEventListener("sync", (e) => {
            if (e.tag === `${H}:${this._name}`) {
              const t = async () => {
                let t;
                this._syncInProgress = !0;
                try {
                  await this._onSync({ queue: this });
                } catch (e) {
                  if (e instanceof Error) {
                    throw e;
                  }
                } finally {
                  this._requestsAddedDuringSync &&
                    !(t && !e.lastChance) &&
                    (await this.registerSync()),
                    (this._syncInProgress = !1),
                    (this._requestsAddedDuringSync = !1);
                }
              };
              e.waitUntil(t());
            }
          })
        : this._onSync({ queue: this });
    }
    static get _queueNames() {
      return G;
    }
  }
  class z {
    _queue;
    constructor(e, t) {
      this._queue = new V(e, t);
    }
    async fetchDidFail({ request: e }) {
      await this._queue.pushRequest({ request: e });
    }
  }
  const J = {
    cacheWillUpdate: async ({ response: e }) =>
      e.status === 200 || e.status === 0 ? e : null,
  };
  function X(e) {
    return typeof e == "string" ? new Request(e) : e;
  }
  class Y {
    event;
    request;
    url;
    params;
    _cacheKeys = {};
    _strategy;
    _handlerDeferred;
    _extendLifetimePromises;
    _plugins;
    _pluginStateMap;
    constructor(e, t) {
      for (const a of ((this.event = t.event),
      (this.request = t.request),
      t.url && ((this.url = t.url), (this.params = t.params)),
      (this._strategy = e),
      (this._handlerDeferred = new f()),
      (this._extendLifetimePromises = []),
      (this._plugins = [...e.plugins]),
      (this._pluginStateMap = new Map()),
      this._plugins)) {
        this._pluginStateMap.set(a, {});
      }
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    async fetch(e) {
      let { event: t } = this,
        a = X(e),
        s = await this.getPreloadResponse();
      if (s) {
        return s;
      }
      const r = this.hasCallback("fetchDidFail") ? a.clone() : null;
      try {
        for (const e of this.iterateCallbacks("requestWillFetch")) {
          a = await e({ request: a.clone(), event: t });
        }
      } catch (e) {
        if (e instanceof Error) {
          throw new l("plugin-error-request-will-fetch", {
            thrownErrorMessage: e.message,
          });
        }
      }
      const n = a.clone();
      try {
        let e;
        for (const s of ((e = await fetch(
          a,
          a.mode === "navigate" ? void 0 : this._strategy.fetchOptions
        )),
        this.iterateCallbacks("fetchDidSucceed"))) {
          e = await s({ event: t, request: n, response: e });
        }
        return e;
      } catch (e) {
        throw (
          (r &&
            (await this.runCallbacks("fetchDidFail", {
              error: e,
              event: t,
              originalRequest: r.clone(),
              request: n.clone(),
            })),
          e)
        );
      }
    }
    async fetchAndCachePut(e) {
      const t = await this.fetch(e),
        a = t.clone();
      return this.waitUntil(this.cachePut(e, a)), t;
    }
    async cacheMatch(e) {
      let t,
        a = X(e),
        { cacheName: s, matchOptions: r } = this._strategy,
        n = await this.getCacheKey(a, "read"),
        i = { ...r, cacheName: s };
      for (const e of ((t = await caches.match(n, i)),
      this.iterateCallbacks("cachedResponseWillBeUsed"))) {
        t =
          (await e({
            cacheName: s,
            matchOptions: r,
            cachedResponse: t,
            request: n,
            event: this.event,
          })) || void 0;
      }
      return t;
    }
    async cachePut(e, t) {
      const a = X(e);
      await h(0);
      const s = await this.getCacheKey(a, "write");
      if (!t) {
        throw new l("cache-put-with-no-response", {
          url: new URL(String(s.url), location.href).href.replace(
            RegExp(`^${location.origin}`),
            ""
          ),
        });
      }
      const r = await this._ensureResponseSafeToCache(t);
      if (!r) {
        return !1;
      }
      const { cacheName: n, matchOptions: i } = this._strategy,
        c = await self.caches.open(n),
        o = this.hasCallback("cacheDidUpdate"),
        u = o ? await m(c, s.clone(), ["__WB_REVISION__"], i) : null;
      try {
        await c.put(s, o ? r.clone() : r);
      } catch (e) {
        if (e instanceof Error) {
          throw (e.name === "QuotaExceededError" && (await g()), e);
        }
      }
      for (const e of this.iterateCallbacks("cacheDidUpdate")) {
        await e({
          cacheName: n,
          oldResponse: u,
          newResponse: r.clone(),
          request: s,
          event: this.event,
        });
      }
      return !0;
    }
    async getCacheKey(e, t) {
      const a = `${e.url} | ${t}`;
      if (!this._cacheKeys[a]) {
        let s = e;
        for (const e of this.iterateCallbacks("cacheKeyWillBeUsed")) {
          s = X(
            await e({
              mode: t,
              request: s,
              event: this.event,
              params: this.params,
            })
          );
        }
        this._cacheKeys[a] = s;
      }
      return this._cacheKeys[a];
    }
    hasCallback(e) {
      for (const t of this._strategy.plugins) {
        if (e in t) {
          return !0;
        }
      }
      return !1;
    }
    async runCallbacks(e, t) {
      for (const a of this.iterateCallbacks(e)) {
        await a(t);
      }
    }
    *iterateCallbacks(e) {
      for (const t of this._strategy.plugins) {
        if (typeof t[e] == "function") {
          const a = this._pluginStateMap.get(t),
            s = (s) => {
              const r = { ...s, state: a };
              return t[e](r);
            };
          yield s;
        }
      }
    }
    waitUntil(e) {
      return this._extendLifetimePromises.push(e), e;
    }
    async doneWaiting() {
      let e;
      while ((e = this._extendLifetimePromises.shift())) {
        await e;
      }
    }
    destroy() {
      this._handlerDeferred.resolve(null);
    }
    async getPreloadResponse() {
      if (
        this.event instanceof FetchEvent &&
        this.event.request.mode === "navigate" &&
        "preloadResponse" in this.event
      ) {
        try {
          const e = await this.event.preloadResponse;
          if (e) {
            return e;
          }
        } catch (e) {}
      }
    }
    async _ensureResponseSafeToCache(e) {
      let t = e,
        a = !1;
      for (const e of this.iterateCallbacks("cacheWillUpdate")) {
        if (
          ((t =
            (await e({
              request: this.request,
              response: t,
              event: this.event,
            })) || void 0),
          (a = !0),
          !t)
        ) {
          break;
        }
      }
      return !a && t && t.status !== 200 && (t = void 0), t;
    }
  }
  class Z {
    cacheName;
    plugins;
    fetchOptions;
    matchOptions;
    constructor(e = {}) {
      (this.cacheName = o(e.cacheName)),
        (this.plugins = e.plugins || []),
        (this.fetchOptions = e.fetchOptions),
        (this.matchOptions = e.matchOptions);
    }
    handle(e) {
      const [t] = this.handleAll(e);
      return t;
    }
    handleAll(e) {
      e instanceof FetchEvent && (e = { event: e, request: e.request });
      const t = e.event,
        a = typeof e.request == "string" ? new Request(e.request) : e.request,
        s = new Y(
          this,
          e.url
            ? { event: t, request: a, url: e.url, params: e.params }
            : { event: t, request: a }
        ),
        r = this._getResponse(s, a, t),
        n = this._awaitComplete(r, s, a, t);
      return [r, n];
    }
    async _getResponse(e, t, a) {
      let s;
      await e.runCallbacks("handlerWillStart", { event: a, request: t });
      try {
        if (
          ((s = await this._handle(t, e)), void 0 === s || s.type === "error")
        ) {
          throw new l("no-response", { url: t.url });
        }
      } catch (r) {
        if (r instanceof Error) {
          for (const n of e.iterateCallbacks("handlerDidError")) {
            if (void 0 !== (s = await n({ error: r, event: a, request: t }))) {
              break;
            }
          }
        }
        if (!s) {
          throw r;
        }
      }
      for (const r of e.iterateCallbacks("handlerWillRespond")) {
        s = await r({ event: a, request: t, response: s });
      }
      return s;
    }
    async _awaitComplete(e, t, a, s) {
      let r, n;
      try {
        r = await e;
      } catch {}
      try {
        await t.runCallbacks("handlerDidRespond", {
          event: s,
          request: a,
          response: r,
        }),
          await t.doneWaiting();
      } catch (e) {
        e instanceof Error && (n = e);
      }
      if (
        (await t.runCallbacks("handlerDidComplete", {
          event: s,
          request: a,
          response: r,
          error: n,
        }),
        t.destroy(),
        n)
      ) {
        throw n;
      }
    }
  }
  class ee extends Z {
    _networkTimeoutSeconds;
    constructor(e = {}) {
      super(e),
        this.plugins.some((e) => "cacheWillUpdate" in e) ||
          this.plugins.unshift(J),
        (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
    }
    async _handle(e, t) {
      let a,
        s = [],
        r = [];
      if (this._networkTimeoutSeconds) {
        const { id: n, promise: i } = this._getTimeoutPromise({
          request: e,
          logs: s,
          handler: t,
        });
        (a = n), r.push(i);
      }
      const n = this._getNetworkPromise({
        timeoutId: a,
        request: e,
        logs: s,
        handler: t,
      });
      r.push(n);
      const i = await t.waitUntil(
        (async () => (await t.waitUntil(Promise.race(r))) || (await n))()
      );
      if (!i) {
        throw new l("no-response", { url: e.url });
      }
      return i;
    }
    _getTimeoutPromise({ request: e, logs: t, handler: a }) {
      let s;
      return {
        promise: new Promise((t) => {
          s = setTimeout(async () => {
            t(await a.cacheMatch(e));
          }, 1e3 * this._networkTimeoutSeconds);
        }),
        id: s,
      };
    }
    async _getNetworkPromise({
      timeoutId: e,
      request: t,
      logs: a,
      handler: s,
    }) {
      let r, n;
      try {
        n = await s.fetchAndCachePut(t);
      } catch (e) {
        e instanceof Error && (r = e);
      }
      return e && clearTimeout(e), (r || !n) && (n = await s.cacheMatch(t)), n;
    }
  }
  class et extends Z {
    _networkTimeoutSeconds;
    constructor(e = {}) {
      super(e), (this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
    }
    async _handle(e, t) {
      let a, s;
      try {
        const a = [t.fetch(e)];
        if (this._networkTimeoutSeconds) {
          const e = h(1e3 * this._networkTimeoutSeconds);
          a.push(e);
        }
        if (!(s = await Promise.race(a))) {
          throw Error(
            `Timed out the network response after ${this._networkTimeoutSeconds} seconds.`
          );
        }
      } catch (e) {
        e instanceof Error && (a = e);
      }
      if (!s) {
        throw new l("no-response", { url: e.url, error: a });
      }
      return s;
    }
  }
  const ea = (e) => (e && typeof e == "object" ? e : { handle: e });
  class es {
    handler;
    match;
    method;
    catchHandler;
    constructor(e, t, a = "GET") {
      (this.handler = ea(t)), (this.match = e), (this.method = a);
    }
    setCatchHandler(e) {
      this.catchHandler = ea(e);
    }
  }
  class er extends Z {
    _fallbackToNetwork;
    static defaultPrecacheCacheabilityPlugin = {
      cacheWillUpdate: async ({ response: e }) =>
        !e || e.status >= 400 ? null : e,
    };
    static copyRedirectedCacheableResponsesPlugin = {
      cacheWillUpdate: async ({ response: e }) =>
        e.redirected ? await M(e) : e,
    };
    constructor(e = {}) {
      (e.cacheName = c(e.cacheName)),
        super(e),
        (this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
        this.plugins.push(er.copyRedirectedCacheableResponsesPlugin);
    }
    async _handle(e, t) {
      const a = await t.getPreloadResponse();
      if (a) {
        return a;
      }
      const s = await t.cacheMatch(e);
      return (
        s ||
        (t.event && t.event.type === "install"
          ? await this._handleInstall(e, t)
          : await this._handleFetch(e, t))
      );
    }
    async _handleFetch(e, t) {
      let a,
        s = t.params || {};
      if (this._fallbackToNetwork) {
        const r = s.integrity,
          n = e.integrity,
          i = !n || n === r;
        (a = await t.fetch(
          new Request(e, { integrity: e.mode === "no-cors" ? void 0 : n || r })
        )),
          r &&
            i &&
            e.mode !== "no-cors" &&
            (this._useDefaultCacheabilityPluginIfNeeded(),
            await t.cachePut(e, a.clone()));
      } else {
        throw new l("missing-precache-entry", {
          cacheName: this.cacheName,
          url: e.url,
        });
      }
      return a;
    }
    async _handleInstall(e, t) {
      this._useDefaultCacheabilityPluginIfNeeded();
      const a = await t.fetch(e);
      if (!(await t.cachePut(e, a.clone()))) {
        throw new l("bad-precaching-response", {
          url: e.url,
          status: a.status,
        });
      }
      return a;
    }
    _useDefaultCacheabilityPluginIfNeeded() {
      let e = null,
        t = 0;
      for (const [a, s] of this.plugins.entries()) {
        s !== er.copyRedirectedCacheableResponsesPlugin &&
          (s === er.defaultPrecacheCacheabilityPlugin && (e = a),
          s.cacheWillUpdate && t++);
      }
      t === 0
        ? this.plugins.push(er.defaultPrecacheCacheabilityPlugin)
        : t > 1 && e !== null && this.plugins.splice(e, 1);
    }
  }
  class en extends es {
    _allowlist;
    _denylist;
    constructor(e, { allowlist: t = [/./], denylist: a = [] } = {}) {
      super((e) => this._match(e), e),
        (this._allowlist = t),
        (this._denylist = a);
    }
    _match({ url: e, request: t }) {
      if (t && t.mode !== "navigate") {
        return !1;
      }
      const a = e.pathname + e.search;
      for (const e of this._denylist) {
        if (e.test(a)) {
          return !1;
        }
      }
      return !!this._allowlist.some((e) => e.test(a));
    }
  }
  class ei extends es {
    constructor(e, t, a) {
      super(
        ({ url: t }) => {
          const a = e.exec(t.href);
          if (a) {
            return t.origin !== location.origin && a.index !== 0
              ? void 0
              : a.slice(1);
          }
        },
        t,
        a
      );
    }
  }
  const ec = (e) => {
    if (!e) {
      throw new l("add-to-cache-list-unexpected-type", { entry: e });
    }
    if (typeof e == "string") {
      const t = new URL(e, location.href);
      return { cacheKey: t.href, url: t.href };
    }
    const { revision: t, url: a } = e;
    if (!a) {
      throw new l("add-to-cache-list-unexpected-type", { entry: e });
    }
    if (!t) {
      const e = new URL(a, location.href);
      return { cacheKey: e.href, url: e.href };
    }
    const s = new URL(a, location.href),
      r = new URL(a, location.href);
    return (
      s.searchParams.set("__WB_REVISION__", t),
      { cacheKey: s.href, url: r.href }
    );
  };
  class eo {
    updatedURLs = [];
    notUpdatedURLs = [];
    handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    };
    cachedResponseWillBeUsed = async ({
      event: e,
      state: t,
      cachedResponse: a,
    }) => {
      if (
        e.type === "install" &&
        t?.originalRequest &&
        t.originalRequest instanceof Request
      ) {
        const e = t.originalRequest.url;
        a ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
      }
      return a;
    };
  }
  const el = async (e, t, a) => {
    const s = t.map((e, t) => ({ index: t, item: e })),
      r = async (e) => {
        const t = [];
        for (;;) {
          const r = s.pop();
          if (!r) {
            return e(t);
          }
          const n = await a(r.item);
          t.push({ result: n, index: r.index });
        }
      },
      n = Array.from({ length: e }, () => new Promise(r));
    return (await Promise.all(n))
      .flat()
      .sort((e, t) => (e.index < t.index ? -1 : 1))
      .map((e) => e.result);
  };
  typeof navigator < "u" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const eh = "cache-entries",
    eu = (e) => {
      const t = new URL(e, location.href);
      return (t.hash = ""), t.href;
    };
  class ed {
    _cacheName;
    _db = null;
    constructor(e) {
      this._cacheName = e;
    }
    _getId(e) {
      return `${this._cacheName}|${eu(e)}`;
    }
    _upgradeDb(e) {
      const t = e.createObjectStore(eh, { keyPath: "id" });
      t.createIndex("cacheName", "cacheName", { unique: !1 }),
        t.createIndex("timestamp", "timestamp", { unique: !1 });
    }
    _upgradeDbAndDeleteOldDbs(e) {
      this._upgradeDb(e),
        this._cacheName &&
          ((e, { blocked: t } = {}) => {
            const a = indexedDB.deleteDatabase(e);
            t && a.addEventListener("blocked", (e) => t(e.oldVersion, e)),
              v(a).then(() => void 0);
          })(this._cacheName);
    }
    async setTimestamp(e, t) {
      e = eu(e);
      const a = {
          id: this._getId(e),
          cacheName: this._cacheName,
          url: e,
          timestamp: t,
        },
        s = (await this.getDb()).transaction(eh, "readwrite", {
          durability: "relaxed",
        });
      await s.store.put(a), await s.done;
    }
    async getTimestamp(e) {
      const t = await this.getDb(),
        a = await t.get(eh, this._getId(e));
      return a?.timestamp;
    }
    async expireEntries(e, t) {
      let a = await this.getDb(),
        s = await a
          .transaction(eh, "readwrite")
          .store.index("timestamp")
          .openCursor(null, "prev"),
        r = [],
        n = 0;
      while (s) {
        const a = s.value;
        a.cacheName === this._cacheName &&
          ((e && a.timestamp < e) || (t && n >= t)
            ? (s.delete(), r.push(a.url))
            : n++),
          (s = await s.continue());
      }
      return r;
    }
    async getDb() {
      return (
        this._db ||
          (this._db = await S("serwist-expiration", 1, {
            upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
          })),
        this._db
      );
    }
  }
  class em {
    _isRunning = !1;
    _rerunRequested = !1;
    _maxEntries;
    _maxAgeSeconds;
    _matchOptions;
    _cacheName;
    _timestampModel;
    constructor(e, t = {}) {
      (this._maxEntries = t.maxEntries),
        (this._maxAgeSeconds = t.maxAgeSeconds),
        (this._matchOptions = t.matchOptions),
        (this._cacheName = e),
        (this._timestampModel = new ed(e));
    }
    async expireEntries() {
      if (this._isRunning) {
        this._rerunRequested = !0;
        return;
      }
      this._isRunning = !0;
      const e = this._maxAgeSeconds
          ? Date.now() - 1e3 * this._maxAgeSeconds
          : 0,
        t = await this._timestampModel.expireEntries(e, this._maxEntries),
        a = await self.caches.open(this._cacheName);
      for (const e of t) {
        await a.delete(e, this._matchOptions);
      }
      (this._isRunning = !1),
        this._rerunRequested &&
          ((this._rerunRequested = !1), this.expireEntries());
    }
    async updateTimestamp(e) {
      await this._timestampModel.setTimestamp(e, Date.now());
    }
    async isURLExpired(e) {
      if (!this._maxAgeSeconds) {
        return !1;
      }
      const t = await this._timestampModel.getTimestamp(e),
        a = Date.now() - 1e3 * this._maxAgeSeconds;
      return void 0 === t || t < a;
    }
    async delete() {
      (this._rerunRequested = !1),
        await this._timestampModel.expireEntries(1 / 0);
    }
  }
  class ef {
    _config;
    _cacheExpirations;
    constructor(e = {}) {
      (this._config = e),
        (this._cacheExpirations = new Map()),
        this._config.maxAgeFrom || (this._config.maxAgeFrom = "last-fetched"),
        this._config.purgeOnQuotaError &&
          ((e) => {
            u.add(e);
          })(() => this.deleteCacheAndMetadata());
    }
    _getCacheExpiration(e) {
      if (e === o()) {
        throw new l("expire-custom-caches-only");
      }
      let t = this._cacheExpirations.get(e);
      return (
        t || ((t = new em(e, this._config)), this._cacheExpirations.set(e, t)),
        t
      );
    }
    cachedResponseWillBeUsed({
      event: e,
      cacheName: t,
      request: a,
      cachedResponse: s,
    }) {
      if (!s) {
        return null;
      }
      const r = this._isResponseDateFresh(s),
        n = this._getCacheExpiration(t),
        i = this._config.maxAgeFrom === "last-used",
        c = (async () => {
          i && (await n.updateTimestamp(a.url)), await n.expireEntries();
        })();
      try {
        e.waitUntil(c);
      } catch {}
      return r ? s : null;
    }
    _isResponseDateFresh(e) {
      if (this._config.maxAgeFrom === "last-used") {
        return !0;
      }
      const t = Date.now();
      if (!this._config.maxAgeSeconds) {
        return !0;
      }
      const a = this._getDateHeaderTimestamp(e);
      return a === null || a >= t - 1e3 * this._config.maxAgeSeconds;
    }
    _getDateHeaderTimestamp(e) {
      if (!e.headers.has("date")) {
        return null;
      }
      const t = new Date(e.headers.get("date")).getTime();
      return Number.isNaN(t) ? null : t;
    }
    async cacheDidUpdate({ cacheName: e, request: t }) {
      const a = this._getCacheExpiration(e);
      await a.updateTimestamp(t.url), await a.expireEntries();
    }
    async deleteCacheAndMetadata() {
      for (const [e, t] of this._cacheExpirations) {
        await self.caches.delete(e), await t.delete();
      }
      this._cacheExpirations = new Map();
    }
  }
  const eg = "www.google-analytics.com",
    ew = "www.googletagmanager.com",
    ep = /^\/(\w+\/)?collect/,
    ey = ({ serwist: e, cacheName: t, ...a }) => {
      let s,
        r,
        c = t || i(n.googleAnalytics),
        o = new z("serwist-google-analytics", {
          maxRetentionTime: 2880,
          onSync: async ({ queue: e }) => {
            let t;
            while ((t = await e.shiftRequest())) {
              const { request: s, timestamp: r } = t,
                n = new URL(s.url);
              try {
                const e =
                    s.method === "POST"
                      ? new URLSearchParams(await s.clone().text())
                      : n.searchParams,
                  t = r - (Number(e.get("qt")) || 0),
                  i = Date.now() - t;
                if ((e.set("qt", String(i)), a.parameterOverrides)) {
                  for (const t of Object.keys(a.parameterOverrides)) {
                    const s = a.parameterOverrides[t];
                    e.set(t, s);
                  }
                }
                typeof a.hitFilter == "function" && a.hitFilter.call(null, e),
                  await fetch(
                    new Request(n.origin + n.pathname, {
                      body: e.toString(),
                      method: "POST",
                      mode: "cors",
                      credentials: "omit",
                      headers: { "Content-Type": "text/plain" },
                    })
                  );
              } catch (a) {
                throw (await e.unshiftRequest(t), a);
              }
            }
          },
        });
      for (const t of [
        new es(
          ({ url: e }) => e.hostname === ew && e.pathname === "/gtm.js",
          new ee({ cacheName: c }),
          "GET"
        ),
        new es(
          ({ url: e }) => e.hostname === eg && e.pathname === "/analytics.js",
          new ee({ cacheName: c }),
          "GET"
        ),
        new es(
          ({ url: e }) => e.hostname === ew && e.pathname === "/gtag/js",
          new ee({ cacheName: c }),
          "GET"
        ),
        new es(
          (s = ({ url: e }) => e.hostname === eg && ep.test(e.pathname)),
          (r = new et({ plugins: [o] })),
          "GET"
        ),
        new es(s, r, "POST"),
      ]) {
        e.registerRoute(t);
      }
    };
  class e_ {
    _fallbackUrls;
    _serwist;
    constructor({ fallbackUrls: e, serwist: t }) {
      (this._fallbackUrls = e), (this._serwist = t);
    }
    async handlerDidError(e) {
      for (const t of this._fallbackUrls) {
        if (typeof t == "string") {
          const e = await this._serwist.matchPrecache(t);
          if (void 0 !== e) {
            return e;
          }
        } else if (t.matcher(e)) {
          const e = await this._serwist.matchPrecache(t.url);
          if (void 0 !== e) {
            return e;
          }
        }
      }
    }
  }
  const ex = async (e, t) => {
    try {
      if (t.status === 206) {
        return t;
      }
      const a = e.headers.get("range");
      if (!a) {
        throw new l("no-range-header");
      }
      const s = ((e) => {
          const t = e.trim().toLowerCase();
          if (!t.startsWith("bytes=")) {
            throw new l("unit-must-be-bytes", { normalizedRangeHeader: t });
          }
          if (t.includes(",")) {
            throw new l("single-range-only", { normalizedRangeHeader: t });
          }
          const a = /(\d*)-(\d*)/.exec(t);
          if (!(a && (a[1] || a[2]))) {
            throw new l("invalid-range-values", { normalizedRangeHeader: t });
          }
          return {
            start: a[1] === "" ? void 0 : Number(a[1]),
            end: a[2] === "" ? void 0 : Number(a[2]),
          };
        })(a),
        r = await t.blob(),
        n = ((e, t, a) => {
          let s,
            r,
            n = e.size;
          if ((a && a > n) || (t && t < 0)) {
            throw new l("range-not-satisfiable", { size: n, end: a, start: t });
          }
          return (
            void 0 !== t && void 0 !== a
              ? ((s = t), (r = a + 1))
              : void 0 !== t && void 0 === a
                ? ((s = t), (r = n))
                : void 0 !== a && void 0 === t && ((s = n - a), (r = n)),
            { start: s, end: r }
          );
        })(r, s.start, s.end),
        i = r.slice(n.start, n.end),
        c = i.size,
        o = new Response(i, {
          status: 206,
          statusText: "Partial Content",
          headers: t.headers,
        });
      return (
        o.headers.set("Content-Length", String(c)),
        o.headers.set(
          "Content-Range",
          `bytes ${n.start}-${n.end - 1}/${r.size}`
        ),
        o
      );
    } catch (e) {
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable",
      });
    }
  };
  class eb {
    cachedResponseWillBeUsed = async ({ request: e, cachedResponse: t }) =>
      t && e.headers.has("range") ? await ex(e, t) : t;
  }
  class eE extends Z {
    async _handle(e, t) {
      let a,
        s = await t.cacheMatch(e);
      if (!s) {
        try {
          s = await t.fetchAndCachePut(e);
        } catch (e) {
          e instanceof Error && (a = e);
        }
      }
      if (!s) {
        throw new l("no-response", { url: e.url, error: a });
      }
      return s;
    }
  }
  class eR extends Z {
    constructor(e = {}) {
      super(e),
        this.plugins.some((e) => "cacheWillUpdate" in e) ||
          this.plugins.unshift(J);
    }
    async _handle(e, t) {
      let a,
        s = t.fetchAndCachePut(e).catch(() => {});
      t.waitUntil(s);
      let r = await t.cacheMatch(e);
      if (r) {
      } else {
        try {
          r = await s;
        } catch (e) {
          e instanceof Error && (a = e);
        }
      }
      if (!r) {
        throw new l("no-response", { url: e.url, error: a });
      }
      return r;
    }
  }
  class ev extends es {
    constructor(e, t) {
      super(({ request: a }) => {
        const s = e.getUrlsToPrecacheKeys();
        for (const r of (function* (
          e,
          {
            directoryIndex: t = "index.html",
            ignoreURLParametersMatching: a = [/^utm_/, /^fbclid$/],
            cleanURLs: s = !0,
            urlManipulation: r,
          } = {}
        ) {
          const n = new URL(e, location.href);
          (n.hash = ""), yield n.href;
          const i = ((e, t = []) => {
            for (const a of [...e.searchParams.keys()]) {
              t.some((e) => e.test(a)) && e.searchParams.delete(a);
            }
            return e;
          })(n, a);
          if ((yield i.href, t && i.pathname.endsWith("/"))) {
            const e = new URL(i.href);
            (e.pathname += t), yield e.href;
          }
          if (s) {
            const e = new URL(i.href);
            (e.pathname += ".html"), yield e.href;
          }
          if (r) {
            for (const e of r({ url: n })) {
              yield e.href;
            }
          }
        })(a.url, t)) {
          const t = s.get(r);
          if (t) {
            const a = e.getIntegrityForPrecacheKey(t);
            return { cacheKey: t, integrity: a };
          }
        }
      }, e.precacheStrategy);
    }
  }
  class eq {
    _precacheController;
    constructor({ precacheController: e }) {
      this._precacheController = e;
    }
    cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
      const a =
        t?.cacheKey || this._precacheController.getPrecacheKeyForUrl(e.url);
      return a ? new Request(a, { headers: e.headers }) : e;
    };
  }
  class eS {
    _urlsToCacheKeys = new Map();
    _urlsToCacheModes = new Map();
    _cacheKeysToIntegrities = new Map();
    _concurrentPrecaching;
    _precacheStrategy;
    _routes;
    _defaultHandlerMap;
    _catchHandler;
    _requestRules;
    constructor({
      precacheEntries: e,
      precacheOptions: t,
      skipWaiting: a = !1,
      importScripts: s,
      navigationPreload: r = !1,
      cacheId: i,
      clientsClaim: o = !1,
      runtimeCaching: l,
      offlineAnalyticsConfig: h,
      disableDevLogs: u = !1,
      fallbacks: d,
      requestRules: m,
    } = {}) {
      const {
        precacheStrategyOptions: f,
        precacheRouteOptions: g,
        precacheMiscOptions: w,
      } = ((e, t = {}) => {
        const {
          cacheName: a,
          plugins: s = [],
          fetchOptions: r,
          matchOptions: n,
          fallbackToNetwork: i,
          directoryIndex: o,
          ignoreURLParametersMatching: l,
          cleanURLs: h,
          urlManipulation: u,
          cleanupOutdatedCaches: d,
          concurrency: m = 10,
          navigateFallback: f,
          navigateFallbackAllowlist: g,
          navigateFallbackDenylist: w,
        } = t ?? {};
        return {
          precacheStrategyOptions: {
            cacheName: c(a),
            plugins: [...s, new eq({ precacheController: e })],
            fetchOptions: r,
            matchOptions: n,
            fallbackToNetwork: i,
          },
          precacheRouteOptions: {
            directoryIndex: o,
            ignoreURLParametersMatching: l,
            cleanURLs: h,
            urlManipulation: u,
          },
          precacheMiscOptions: {
            cleanupOutdatedCaches: d,
            concurrency: m,
            navigateFallback: f,
            navigateFallbackAllowlist: g,
            navigateFallbackDenylist: w,
          },
        };
      })(this, t);
      if (
        ((this._concurrentPrecaching = w.concurrency),
        (this._precacheStrategy = new er(f)),
        (this._routes = new Map()),
        (this._defaultHandlerMap = new Map()),
        (this._requestRules = m),
        (this.handleInstall = this.handleInstall.bind(this)),
        (this.handleActivate = this.handleActivate.bind(this)),
        (this.handleFetch = this.handleFetch.bind(this)),
        (this.handleCache = this.handleCache.bind(this)),
        s && s.length > 0 && self.importScripts(...s),
        r &&
          ((e) => {
            self.registration?.navigationPreload &&
              self.addEventListener("activate", (e) => {
                e.waitUntil(
                  self.registration.navigationPreload.enable().then(() => {})
                );
              });
          })(),
        void 0 !== i &&
          ((e) => {
            var t = e;
            for (const e of Object.keys(n)) {
              ((e) => {
                const a = t[e];
                typeof a == "string" && (n[e] = a);
              })(e);
            }
          })({ prefix: i }),
        a
          ? self.skipWaiting()
          : self.addEventListener("message", (e) => {
              e.data && e.data.type === "SKIP_WAITING" && self.skipWaiting();
            }),
        o && self.addEventListener("activate", () => self.clients.claim()),
        e && e.length > 0 && this.addToPrecacheList(e),
        w.cleanupOutdatedCaches &&
          ((e) => {
            self.addEventListener("activate", (t) => {
              t.waitUntil(p(c(e)).then((e) => {}));
            });
          })(f.cacheName),
        this.registerRoute(new ev(this, g)),
        w.navigateFallback &&
          this.registerRoute(
            new en(this.createHandlerBoundToUrl(w.navigateFallback), {
              allowlist: w.navigateFallbackAllowlist,
              denylist: w.navigateFallbackDenylist,
            })
          ),
        void 0 !== h &&
          (typeof h == "boolean"
            ? h && ey({ serwist: this })
            : ey({ ...h, serwist: this })),
        void 0 !== l)
      ) {
        if (void 0 !== d) {
          const e = new e_({ fallbackUrls: d.entries, serwist: this });
          l.forEach((t) => {
            t.handler instanceof Z &&
              !t.handler.plugins.some((e) => "handlerDidError" in e) &&
              t.handler.plugins.push(e);
          });
        }
        for (const e of l) {
          this.registerCapture(e.matcher, e.handler, e.method);
        }
      }
      u && (self.__WB_DISABLE_DEV_LOGS = !0);
    }
    get precacheStrategy() {
      return this._precacheStrategy;
    }
    get routes() {
      return this._routes;
    }
    addEventListeners() {
      self.addEventListener("install", this.handleInstall),
        self.addEventListener("activate", this.handleActivate),
        self.addEventListener("fetch", this.handleFetch),
        self.addEventListener("message", this.handleCache);
    }
    addToPrecacheList(e) {
      const t = [];
      for (const a of e) {
        typeof a == "string"
          ? t.push(a)
          : a && !a.integrity && void 0 === a.revision && t.push(a.url);
        const { cacheKey: e, url: s } = ec(a),
          r = typeof a != "string" && a.revision ? "reload" : "default";
        if (
          this._urlsToCacheKeys.has(s) &&
          this._urlsToCacheKeys.get(s) !== e
        ) {
          throw new l("add-to-cache-list-conflicting-entries", {
            firstEntry: this._urlsToCacheKeys.get(s),
            secondEntry: e,
          });
        }
        if (typeof a != "string" && a.integrity) {
          if (
            this._cacheKeysToIntegrities.has(e) &&
            this._cacheKeysToIntegrities.get(e) !== a.integrity
          ) {
            throw new l("add-to-cache-list-conflicting-integrities", {
              url: s,
            });
          }
          this._cacheKeysToIntegrities.set(e, a.integrity);
        }
        this._urlsToCacheKeys.set(s, e), this._urlsToCacheModes.set(s, r);
      }
      t.length > 0 &&
        console.warn(`Serwist is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`);
    }
    handleInstall(e) {
      return (
        this.registerRequestRules(e),
        y(e, async () => {
          const t = new eo();
          this.precacheStrategy.plugins.push(t),
            await el(
              this._concurrentPrecaching,
              Array.from(this._urlsToCacheKeys.entries()),
              async ([t, a]) => {
                const s = this._cacheKeysToIntegrities.get(a),
                  r = this._urlsToCacheModes.get(t),
                  n = new Request(t, {
                    integrity: s,
                    cache: r,
                    credentials: "same-origin",
                  });
                await Promise.all(
                  this.precacheStrategy.handleAll({
                    event: e,
                    request: n,
                    url: new URL(n.url),
                    params: { cacheKey: a },
                  })
                );
              }
            );
          const { updatedURLs: a, notUpdatedURLs: s } = t;
          return { updatedURLs: a, notUpdatedURLs: s };
        })
      );
    }
    async registerRequestRules(e) {
      if (this._requestRules && e?.addRoutes) {
        try {
          await e.addRoutes(this._requestRules), (this._requestRules = void 0);
        } catch (e) {
          throw e;
        }
      }
    }
    handleActivate(e) {
      return y(e, async () => {
        const e = await self.caches.open(this.precacheStrategy.cacheName),
          t = await e.keys(),
          a = new Set(this._urlsToCacheKeys.values()),
          s = [];
        for (const r of t) {
          a.has(r.url) || (await e.delete(r), s.push(r.url));
        }
        return { deletedCacheRequests: s };
      });
    }
    handleFetch(e) {
      const { request: t } = e,
        a = this.handleRequest({ request: t, event: e });
      a && e.respondWith(a);
    }
    handleCache(e) {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data,
          a = Promise.all(
            t.urlsToCache.map((t) => {
              let a;
              return (
                (a = typeof t == "string" ? new Request(t) : new Request(...t)),
                this.handleRequest({ request: a, event: e })
              );
            })
          );
        e.waitUntil(a),
          e.ports?.[0] && a.then(() => e.ports[0].postMessage(!0));
      }
    }
    setDefaultHandler(e, t = "GET") {
      this._defaultHandlerMap.set(t, ea(e));
    }
    setCatchHandler(e) {
      this._catchHandler = ea(e);
    }
    registerCapture(e, t, a) {
      const s = ((e, t, a) => {
        if (typeof e == "string") {
          const s = new URL(e, location.href);
          return new es(({ url: e }) => e.href === s.href, t, a);
        }
        if (e instanceof RegExp) {
          return new ei(e, t, a);
        }
        if (typeof e == "function") {
          return new es(e, t, a);
        }
        if (e instanceof es) {
          return e;
        }
        throw new l("unsupported-route-type", {
          moduleName: "serwist",
          funcName: "parseRoute",
          paramName: "capture",
        });
      })(e, t, a);
      return this.registerRoute(s), s;
    }
    registerRoute(e) {
      this._routes.has(e.method) || this._routes.set(e.method, []),
        this._routes.get(e.method).push(e);
    }
    unregisterRoute(e) {
      if (!this._routes.has(e.method)) {
        throw new l("unregister-route-but-not-found-with-method", {
          method: e.method,
        });
      }
      const t = this._routes.get(e.method).indexOf(e);
      if (t > -1) {
        this._routes.get(e.method).splice(t, 1);
      } else {
        throw new l("unregister-route-route-not-registered");
      }
    }
    getUrlsToPrecacheKeys() {
      return this._urlsToCacheKeys;
    }
    getPrecachedUrls() {
      return [...this._urlsToCacheKeys.keys()];
    }
    getPrecacheKeyForUrl(e) {
      const t = new URL(e, location.href);
      return this._urlsToCacheKeys.get(t.href);
    }
    getIntegrityForPrecacheKey(e) {
      return this._cacheKeysToIntegrities.get(e);
    }
    async matchPrecache(e) {
      const t = e instanceof Request ? e.url : e,
        a = this.getPrecacheKeyForUrl(t);
      if (a) {
        return (await self.caches.open(this.precacheStrategy.cacheName)).match(
          a
        );
      }
    }
    createHandlerBoundToUrl(e) {
      const t = this.getPrecacheKeyForUrl(e);
      if (!t) {
        throw new l("non-precached-url", { url: e });
      }
      return (a) => (
        (a.request = new Request(e)),
        (a.params = { cacheKey: t, ...a.params }),
        this.precacheStrategy.handle(a)
      );
    }
    handleRequest({ request: e, event: t }) {
      let a,
        s = new URL(e.url, location.href);
      if (!s.protocol.startsWith("http")) {
        return;
      }
      let r = s.origin === location.origin,
        { params: n, route: i } = this.findMatchingRoute({
          event: t,
          request: e,
          sameOrigin: r,
          url: s,
        }),
        c = i?.handler,
        o = e.method;
      if (
        (!c &&
          this._defaultHandlerMap.has(o) &&
          (c = this._defaultHandlerMap.get(o)),
        !c)
      ) {
        return;
      }
      try {
        a = c.handle({ url: s, request: e, event: t, params: n });
      } catch (e) {
        a = Promise.reject(e);
      }
      const l = i?.catchHandler;
      return (
        a instanceof Promise &&
          (this._catchHandler || l) &&
          (a = a.catch(async (a) => {
            if (l) {
              try {
                return await l.handle({
                  url: s,
                  request: e,
                  event: t,
                  params: n,
                });
              } catch (e) {
                e instanceof Error && (a = e);
              }
            }
            if (this._catchHandler) {
              return this._catchHandler.handle({
                url: s,
                request: e,
                event: t,
              });
            }
            throw a;
          })),
        a
      );
    }
    findMatchingRoute({ url: e, sameOrigin: t, request: a, event: s }) {
      for (const r of this._routes.get(a.method) || []) {
        let n,
          i = r.match({ url: e, sameOrigin: t, request: a, event: s });
        if (i) {
          return (
            (Array.isArray((n = i)) && n.length === 0) ||
            (i.constructor === Object && Object.keys(i).length === 0)
              ? (n = void 0)
              : typeof i == "boolean" && (n = void 0),
            { route: r, params: n }
          );
        }
      }
      return {};
    }
  }
  const eD = [
    {
      matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: new eE({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new ef({
            maxEntries: 4,
            maxAgeSeconds: 31_536e3,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: new eR({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new ef({
            maxEntries: 4,
            maxAgeSeconds: 604_800,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: new eR({
        cacheName: "static-font-assets",
        plugins: [
          new ef({
            maxEntries: 4,
            maxAgeSeconds: 604_800,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new eR({
        cacheName: "static-image-assets",
        plugins: [
          new ef({
            maxEntries: 64,
            maxAgeSeconds: 2592e3,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/_next\/static.+\.js$/i,
      handler: new eE({
        cacheName: "next-static-js-assets",
        plugins: [
          new ef({
            maxEntries: 64,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/_next\/image\?url=.+$/i,
      handler: new eR({
        cacheName: "next-image",
        plugins: [
          new ef({
            maxEntries: 64,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:mp3|wav|ogg)$/i,
      handler: new eE({
        cacheName: "static-audio-assets",
        plugins: [
          new ef({
            maxEntries: 32,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
          new eb(),
        ],
      }),
    },
    {
      matcher: /\.(?:mp4|webm)$/i,
      handler: new eE({
        cacheName: "static-video-assets",
        plugins: [
          new ef({
            maxEntries: 32,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
          new eb(),
        ],
      }),
    },
    {
      matcher: /\.(?:js)$/i,
      handler: new eR({
        cacheName: "static-js-assets",
        plugins: [
          new ef({
            maxEntries: 48,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:css|less)$/i,
      handler: new eR({
        cacheName: "static-style-assets",
        plugins: [
          new ef({
            maxEntries: 32,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/_next\/data\/.+\/.+\.json$/i,
      handler: new ee({
        cacheName: "next-data",
        plugins: [
          new ef({
            maxEntries: 32,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:json|xml|csv)$/i,
      handler: new ee({
        cacheName: "static-data-assets",
        plugins: [
          new ef({
            maxEntries: 32,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/api\/auth\/.*/,
      handler: new et({ networkTimeoutSeconds: 10 }),
    },
    {
      matcher: ({ sameOrigin: e, url: { pathname: t } }) =>
        e && t.startsWith("/api/"),
      method: "GET",
      handler: new ee({
        cacheName: "apis",
        plugins: [
          new ef({
            maxEntries: 16,
            maxAgeSeconds: 86_400,
            maxAgeFrom: "last-used",
          }),
        ],
        networkTimeoutSeconds: 10,
      }),
    },
    {
      matcher: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
        e.headers.get("RSC") === "1" &&
        e.headers.get("Next-Router-Prefetch") === "1" &&
        a &&
        !t.startsWith("/api/"),
      handler: new ee({
        cacheName: "pages-rsc-prefetch",
        plugins: [new ef({ maxEntries: 32, maxAgeSeconds: 86_400 })],
      }),
    },
    {
      matcher: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
        e.headers.get("RSC") === "1" && a && !t.startsWith("/api/"),
      handler: new ee({
        cacheName: "pages-rsc",
        plugins: [new ef({ maxEntries: 32, maxAgeSeconds: 86_400 })],
      }),
    },
    {
      matcher: ({ request: e, url: { pathname: t }, sameOrigin: a }) =>
        e.headers.get("Content-Type")?.includes("text/html") &&
        a &&
        !t.startsWith("/api/"),
      handler: new ee({
        cacheName: "pages",
        plugins: [new ef({ maxEntries: 32, maxAgeSeconds: 86_400 })],
      }),
    },
    {
      matcher: ({ url: { pathname: e }, sameOrigin: t }) =>
        t && !e.startsWith("/api/"),
      handler: new ee({
        cacheName: "others",
        plugins: [new ef({ maxEntries: 32, maxAgeSeconds: 86_400 })],
      }),
    },
    {
      matcher: ({ sameOrigin: e }) => !e,
      handler: new ee({
        cacheName: "cross-origin",
        plugins: [new ef({ maxEntries: 32, maxAgeSeconds: 3600 })],
        networkTimeoutSeconds: 10,
      }),
    },
    { matcher: /.*/i, method: "GET", handler: new et() },
  ];
  new eS({
    precacheEntries: [
      {
        revision: "009a21a28d94bd342bc50db431d7bd20",
        url: "/_next/static/IvjXc_ZdhJ_gWeHD686ri/_buildManifest.js",
      },
      {
        revision: "b6652df95db52feb4daf4eca35380933",
        url: "/_next/static/IvjXc_ZdhJ_gWeHD686ri/_ssgManifest.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/0309c2ed-38241dd2d2b9adb0.js",
      },
      { revision: null, url: "/_next/static/chunks/178-2a8a1f26dffea908.js" },
      { revision: null, url: "/_next/static/chunks/276-b1b63218437150e8.js" },
      { revision: null, url: "/_next/static/chunks/362-e7cbb937bf8ac6f0.js" },
      { revision: null, url: "/_next/static/chunks/858-36e5bfbcdf56fa22.js" },
      { revision: null, url: "/_next/static/chunks/93-4832bc8e5490163a.js" },
      { revision: null, url: "/_next/static/chunks/996-e8c82f324af6daed.js" },
      {
        revision: null,
        url: "/_next/static/chunks/app/_global-error/page-9715d8c693fe932e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/_not-found/page-32a942ff362b6fe6.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/about/page-0a95a644d0a44318.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/layout-fef70b11eaf7d2e2.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/manifest.webmanifest/route-9715d8c693fe932e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/app/page-35024fd4a9f19b78.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/framework-2507fa9f962abde7.js",
      },
      { revision: null, url: "/_next/static/chunks/main-24abbaa1f7ea090f.js" },
      {
        revision: null,
        url: "/_next/static/chunks/main-app-94a83c8a9e69fcc2.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-9715d8c693fe932e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-9715d8c693fe932e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-8e2062d992c0c537.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-9715d8c693fe932e.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-9715d8c693fe932e.js",
      },
      {
        revision: "846118c33b2c0e922d7b3a7676f81f6f",
        url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
      },
      {
        revision: null,
        url: "/_next/static/chunks/webpack-b76564a164667f47.js",
      },
      { revision: null, url: "/_next/static/css/feaa05b4340a06aa.css" },
      {
        revision: "25ea4a783c12103f175f5b157b7d96aa",
        url: "/_next/static/media/36966cca54120369-s.p.woff2",
      },
      {
        revision: "9d31c82e794f46a529d94e2fe551fd6f",
        url: "/_next/static/media/3caffeb0b9f2ce38-s.woff2",
      },
      {
        revision: "a0761690ccf4441ace5cec893b82d4ab",
        url: "/_next/static/media/747892c23ea88013-s.woff2",
      },
      {
        revision: "da83d5f06d825c5ae65b7cca706cb312",
        url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
      },
      {
        revision: "7b7c0ef93df188a852344fc272fc096b",
        url: "/_next/static/media/9610d9e46709d722-s.woff2",
      },
      {
        revision: "dea099b7d5a5ea45bd4367f8aeff62ab",
        url: "/_next/static/media/b7387a63dd068245-s.woff2",
      },
      {
        revision: "207f8e9f3761dbd724063a177d906a99",
        url: "/_next/static/media/e1aab0933260df4d-s.woff2",
      },
      {
        revision: "b1622b6fc3e7bd0b9918b8383402d4ff",
        url: "/_next/static/media/f87010aab7de6b46-s.p.woff2",
      },
      {
        revision: "c912e61cae051b90b2f16f652197158e",
        url: "/languages/_manifest.json",
      },
      {
        revision: "b56174c9cfb51fd21e63b499b2a9c53b",
        url: "/languages/arabic.json",
      },
      {
        revision: "53ca3dba67daf74b7626aa729e66ac1d",
        url: "/languages/bangla.json",
      },
      {
        revision: "d6298064751add2a63baf78fe57dff7e",
        url: "/languages/czech.json",
      },
      {
        revision: "aec78bc30ba8546bc3ef349642e831ea",
        url: "/languages/czech_1k.json",
      },
      {
        revision: "e2f9b0960c642671a643417eb89e3176",
        url: "/languages/danish.json",
      },
      {
        revision: "bd2a19053c9eae8638c0482f2dbc18e2",
        url: "/languages/danish_1k.json",
      },
      {
        revision: "618232bf7a79da69133495e807470223",
        url: "/languages/dutch.json",
      },
      {
        revision: "caa0421311f26c9ae8ae670a0db9aae0",
        url: "/languages/dutch_1k.json",
      },
      {
        revision: "47fabdd7bc68a3775ba810df564d363a",
        url: "/languages/english.json",
      },
      {
        revision: "e278cd109cefef0c2a457dfa54fccdd2",
        url: "/languages/english_1k.json",
      },
      {
        revision: "b4f98cd59b66eafc0281f90d6153caba",
        url: "/languages/finnish.json",
      },
      {
        revision: "9ab7889d116f060f471e94befcc384d8",
        url: "/languages/finnish_1k.json",
      },
      {
        revision: "764c533441b086124aedc3a91d6f8ed2",
        url: "/languages/french.json",
      },
      {
        revision: "c1248e2277bce8c763cea3670396265e",
        url: "/languages/french_1k.json",
      },
      {
        revision: "bd459c1f0ab686b44c1cccee681accee",
        url: "/languages/german.json",
      },
      {
        revision: "d75cc3c0aaa6e3cc6672ae8465154d0d",
        url: "/languages/german_1k.json",
      },
      {
        revision: "d684ec252267e886a31ac874f5182675",
        url: "/languages/greek.json",
      },
      {
        revision: "34955bbd9f621e3ce519c078cb522e52",
        url: "/languages/greek_1k.json",
      },
      {
        revision: "703c69d977dc43e5513d79ca9bd2e274",
        url: "/languages/hebrew.json",
      },
      {
        revision: "d9480be736db4a303c5f89ed06508787",
        url: "/languages/hebrew_1k.json",
      },
      {
        revision: "f1937370cec706abdbce9149db180f20",
        url: "/languages/hindi.json",
      },
      {
        revision: "04e6871d7904930cda419254e2a227ca",
        url: "/languages/hindi_1k.json",
      },
      {
        revision: "323203c48a1d38b8acfc319d2e10a1c8",
        url: "/languages/hungarian.json",
      },
      {
        revision: "08aa9a4e784a89800dc5b4168d75012d",
        url: "/languages/hungarian_1k.json",
      },
      {
        revision: "3636282eee8ce91502cfde59efe5b8e4",
        url: "/languages/indonesian.json",
      },
      {
        revision: "ad29d48f80d38d32d6a7608430cfb989",
        url: "/languages/indonesian_1k.json",
      },
      {
        revision: "1da5ed47155f474fcf89b63eef8dcfff",
        url: "/languages/italian.json",
      },
      {
        revision: "76274928a9882dcfeaab65117755960d",
        url: "/languages/italian_1k.json",
      },
      {
        revision: "507ab5c9a88a6bcf39c75c18ed2e911f",
        url: "/languages/korean.json",
      },
      {
        revision: "4a663446c50257f012eb8cda913a4930",
        url: "/languages/korean_1k.json",
      },
      {
        revision: "d19005d386503607b2365fdd920e4c9d",
        url: "/languages/malay.json",
      },
      {
        revision: "958851ace166f9fbf58cc30933b9a3ef",
        url: "/languages/malay_1k.json",
      },
      {
        revision: "c84de13ac313d7396b86f95973fcb6f2",
        url: "/languages/persian.json",
      },
      {
        revision: "651045d65e50de1cef5370a3394420ea",
        url: "/languages/persian_1k.json",
      },
      {
        revision: "d8ca01b95eb4d429804e5e3d91d5c1a6",
        url: "/languages/polish.json",
      },
      {
        revision: "f0b34cdb768344220dd68fb94984d7eb",
        url: "/languages/portuguese.json",
      },
      {
        revision: "55d4aa75f6dc066346e9a375d618b47e",
        url: "/languages/portuguese_1k.json",
      },
      {
        revision: "03c914734cc461d0c92e2707c6457d4e",
        url: "/languages/romanian.json",
      },
      {
        revision: "41247a992f3701182485dd26f4fe0b7f",
        url: "/languages/romanian_1k.json",
      },
      {
        revision: "c8d397f7408e1aa64678771693654e77",
        url: "/languages/russian.json",
      },
      {
        revision: "aedfd1ab2b15c592a2aa81cd46707516",
        url: "/languages/russian_1k.json",
      },
      {
        revision: "a0512886b6dfefa9813797a3880a25d9",
        url: "/languages/spanish.json",
      },
      {
        revision: "c7143d604193ce735edd6140d6ee8876",
        url: "/languages/spanish_1k.json",
      },
      {
        revision: "eca2896bf5610e0cfd1c00f1de47fa69",
        url: "/languages/swedish.json",
      },
      {
        revision: "2eb587d80e8d2811b1db9f6f4239e126",
        url: "/languages/swedish_1k.json",
      },
      {
        revision: "89dd9b78a4626f0ffc7508b88f2629ae",
        url: "/languages/tamil.json",
      },
      {
        revision: "08e625b0e1bf36859e35ee47034a83d2",
        url: "/languages/tamil_1k.json",
      },
      {
        revision: "6c39e2b1ae177531403d846108980731",
        url: "/languages/thai.json",
      },
      {
        revision: "cc6fc0b81d581b476e7eb9405c5caf3f",
        url: "/languages/thai_1k.json",
      },
      {
        revision: "1d3dd38b8f677ecc460dd6fd40dfa764",
        url: "/languages/turkish.json",
      },
      {
        revision: "a5dcd9c3ccefb2a9cdafd81222c39718",
        url: "/languages/turkish_1k.json",
      },
      {
        revision: "9bac392304086784ca75c87845feb9e5",
        url: "/languages/ukrainian.json",
      },
      {
        revision: "0fcd57fb97cb9bc823b89651641e6e7d",
        url: "/languages/ukrainian_1k.json",
      },
      {
        revision: "be2ce16809e1db65f4aec1e7a4f016f9",
        url: "/languages/urdu.json",
      },
      {
        revision: "32e2409576dbbfcba6902a95bc3b8eaf",
        url: "/languages/urdu_1k.json",
      },
      {
        revision: "be042e692fbf0ca8dd7004746dbd9877",
        url: "/languages/vietnamese.json",
      },
      {
        revision: "cb1b47095cad9d3df10eeaa56df32867",
        url: "/languages/vietnamese_1k.json",
      },
      { revision: "1b36fcc46664ad85cab896212ca8809c", url: "/opengraph.png" },
      {
        revision: "124e305bbc1c55e6f71761d049e53c57",
        url: "/sounds/fahhhhh.mp3",
      },
      {
        revision: "0feacbef59c4b55ba8f8db04a117c17f",
        url: "/sounds/sound.ogg",
      },
    ],
    skipWaiting: !0,
    clientsClaim: !0,
    navigationPreload: !1,
    runtimeCaching: eD,
  }).addEventListeners();
})();
