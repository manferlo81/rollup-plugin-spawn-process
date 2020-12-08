import { spawn as spawn2 } from 'child_process';

type Args = Parameters<typeof spawn2>;

interface FakeChildProcessProto {
  kill: (this: FakeChildProcess) => void;
  on: (this: FakeChildProcess, event: string, listener: unknown) => void;
  off: (this: FakeChildProcess, event: string, listener: unknown) => void;
}

interface FakeChildProcess extends FakeChildProcessProto {
  args: Args;
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

// eslint-disable-next-line @typescript-eslint/ban-types
function create<K extends object, P extends object | null>(props: K, proto: P): K & P {
  return Object.assign(
    Object.create(proto) as P,
    props,
  );
}

export function spawn(...args: Args): FakeChildProcess {
  return create(
    { args },
    create(
      { listeners: {}, killed: false },
      fakeChildProcessProto,
    ),
  );
}

export default spawn;
