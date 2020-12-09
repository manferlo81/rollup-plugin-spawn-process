import { ChildProcess } from 'child_process';
import { EventList } from '.';

interface ProcessStored {
  proc: ChildProcess;
  events: EventList;
}

declare global {
  export namespace NodeJS {
    interface Global {
      [K: string]: { [K: string]: ProcessStored | undefined | null };
    }
  }
}
