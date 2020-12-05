# rollup-plugin-spawn-process

A rollup plugin to spawn a process

## Install

```bash
npm install rollup-plugin-spawn-process
```

## Plugin

```typescript
function spawnProcess({ ...options }): Plugin;
```

See the [Options](#options) section for available options.

## Usage

```javascript
// rollup.config.js
import { spawnProcess } from 'rollup-plugin-spawn-process';

export default {
  ...
  plugins: [
    spawnProcess(options),
  ],
  ...
};
```

## Options

### command

```typescript
string
default "node"
```

The command to be passed to the `spawn` method.

### args

```typescript
string[]
default [bundleOutputFile]
```

The arguments to be passed to the `spawn` method.

### key

```typescript
string
default "spawn-process"
```

The key to be used to store the process into the plugin context.

### storeGlobal

```typescript
boolean | string
default false
```

Whether or not to use a global variable to store the process. If a string is passed it will be used as a key to store the process into the global scope.

### setup

```typescript
function (process: ChildProcess): void
```

A function to be called right after a new process has been created. It will receive the newly created process as only argument.

Usually used for process setup such as adding event listeners.

### cleanup

```typescript
function (process: ChildProcess): void
```

A function to be called right before a process will be created. It will receive the previously created process or null as only argument.

Usually used for process cleanup such as removing event listeners or killing the previous process before a new one is created.

## LICENSE

MIT &copy; 2020 [Manuel Fernández](https://github.com/manferlo81)
