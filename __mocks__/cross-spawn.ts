import { spawn as spawn2 } from 'child_process';

type Args = Parameters<typeof spawn2>;

interface FakeChildProcess {
  args: Args;
  killed: boolean;
  kill: () => void;
}

function kill(this: FakeChildProcess) {
  this.killed = true;
}

export function spawn(...args: Args): FakeChildProcess {
  return Object.assign(
    Object.create({ kill }) as { kill: () => void },
    {
      args,
      killed: false,
    },
  );
}

export default spawn;
