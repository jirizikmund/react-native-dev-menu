// @flow

'use strict';

import { NativeModules, NativeEventEmitter } from 'react-native';
const { RNDevMenu } = NativeModules;

type RNDevMenuModule = {
  _eventHandlers?: Map<string, () => any>,
  _eventEmitter?: NativeEventEmitter,
  addItem: (name: string, handler: () => any) => void
};

let Module: RNDevMenuModule = {
  addItem(name, handler) {
    if (!__DEV__) {
      return;
    }

    if (!this._eventHandlers) {
      this._eventHandlers = new Map();
    }

    this._eventHandlers.set(name, handler);

    if (!this._eventEmitter) {
      this._eventEmitter = new NativeEventEmitter(RNDevMenu);

      this._eventEmitter.addListener('customDevOptionTap', (name: string) => {
        if (this._eventHandlers) {
          const handler = this._eventHandlers.get(name);

          if (handler) {
            handler();
          }
        }
      });
    }

    RNDevMenu.addItem(name);
  }
};

export default Module;
