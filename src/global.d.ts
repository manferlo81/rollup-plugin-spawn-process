import { ChildProcess } from 'child_process';

declare global {
  export namespace NodeJS {
    interface Global {
      [K: string]: { [K: string]: ChildProcess | null };
    }
  }
}
