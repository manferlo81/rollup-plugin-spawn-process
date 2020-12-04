import { spawn as spawn2 } from 'child_process';

type Args = Parameters<typeof spawn2>

export function spawn(...args: Args): Args {
  return args;
}

export default spawn;
