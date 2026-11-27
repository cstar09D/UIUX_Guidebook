export function advanceLoop(time, delta, duration) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const elapsed = Number.isFinite(delta) ? Math.max(0, delta) : 0;
  return (time + elapsed) % duration;
}

export function createPlayback(definitions) {
  const makeEntry = (id, definition) => ({
    id, duration: definition.duration, visible: false,
    snapshot: { time: definition.poster, status: 'ready', started: false },
  });
  const entries = new Map(Object.entries(definitions).map(([id, definition]) => [id, makeEntry(id, definition)]));
  const listeners = new Map();
  let blocked = false, hidden = false, schedule = () => {};
  const update = (entry, patch) => {
    entry.snapshot = { ...entry.snapshot, ...patch };
    listeners.get(entry.id)?.forEach(listener => listener());
  };
  function solve() {
    for (const entry of entries.values()) {
      if (entry.visible && !blocked && !hidden) {
        if (!entry.snapshot.started) update(entry, { time: 0, started: true, status: 'playing' });
        else if (entry.snapshot.status !== 'playing') update(entry, { status: 'playing' });
      } else if (entry.snapshot.status === 'playing') update(entry, { status: 'paused' });
    }
    if ([...entries.values()].some(entry => entry.snapshot.status === 'playing')) schedule();
  }
  return {
    register(id, definition) { if (!entries.has(id)) entries.set(id, makeEntry(id, definition)); },
    getSnapshot: id => entries.get(id).snapshot,
    subscribe(id, listener) {
      if (!listeners.has(id)) listeners.set(id, new Set());
      listeners.get(id).add(listener);
      return () => listeners.get(id).delete(listener);
    },
    setScheduler(callback) { schedule = callback; solve(); },
    setVisible(id, visible) { entries.get(id).visible = visible; solve(); },
    setContext(context) {
      if ('blocked' in context) blocked = context.blocked;
      if ('hidden' in context) hidden = context.hidden;
      solve();
    },
    tick(delta) {
      for (const entry of entries.values()) {
        if (entry.snapshot.status === 'playing') update(entry, { time: advanceLoop(entry.snapshot.time, delta, entry.duration) });
      }
      solve();
    },
    hasActive: () => [...entries.values()].some(entry => entry.snapshot.status === 'playing'),
  };
}
