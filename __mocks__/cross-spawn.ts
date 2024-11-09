type NodeSpawnFunction = typeof import('node:child_process').spawn;
type SpawnArgs = Parameters<NodeSpawnFunction>;

interface FakeChildProcessProto {
  kill: (this: FakeChildProcess) => void;
  on: (this: FakeChildProcess, event: string, listener: unknown) => void;
  off: (this: FakeChildProcess, event: string, listener: unknown) => void;
}

interface FakeChildProcess extends FakeChildProcessProto {
  args: SpawnArgs;
  killed: boolean;
  listeners: Record<string, unknown[]>;
}

const fakeChildProcessProto: FakeChildProcessProto = {
  kill() {
    this.killed = true;
  },
  on(event, listener) {
    const listeners = this.listeners[event] || (
      this.listeners[event] = []
    );
    listeners.push(listener);
  },
  off(event, listener) {
    const listeners = this.listeners[event];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  },
};

function create<K extends object, P extends object>(props: K, proto: P): K & P {
  return Object.assign(
    Object.create(proto) as P,
    props,
  );
}

export function spawn(...args: SpawnArgs): FakeChildProcess {
  return create(
    { args: args as never },
    create(
      { listeners: {}, killed: false },
      fakeChildProcessProto,
    ),
  );
}

export default spawn;
