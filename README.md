# rollup-plugin-spawn-process

A rollup plugin to spawn a process

## Install

```bash
npm install rollup-plugin-spawn-process
```

## Usage

```javascript
// rollup.config.js
import { spawnProcess } from 'rollup-plugin-spawn-process';

export default {
  ...
  plugins: [
    spawnProcess({ ...options }),
  ],
  ...
};
```

See the [Options](#options) section for available options.

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

If not specified, the plugin will try to find the output file of your bundle or use an empty array if no file found.

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

Whether or not to use a global variable to store the plugin context. If a string is passed it will be used as a key to store the plugin context into the global scope otherwise "ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT" will be used.

#### The reason behind this option

When rollup is in watch mode and `rollup.config.js` if modified rollup will reload the config file causing plugins to be recreated, it causes the plugin context to be recreated as well, and since the previous process was stored in the previous local plugin context it wont be detected, nor passed to the [`cleanup`](#cleanup) method, nor killed before the new one is created, which will result in two (or more) instances of the running process.

Setting this option to `true` (or a `string`) will prevent this behavior.

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

A function to be called right before a new process will be created. It will receive the previously created process as only argument.

Usually used for process cleanup such as removing event listeners or some general cleanup before a new process is created.

## LICENSE

MIT &copy; 2020 [Manuel Fernández](https://github.com/manferlo81)
