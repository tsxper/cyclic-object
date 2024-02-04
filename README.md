# @tsxper/cyclic-object
Check if given object has cyclic refs to a given depth.
Replace circular references and convert cyclic objects to JSON.

[![NPM Version](https://img.shields.io/npm/v/@tsxper/cyclic-object.svg?style=flat-square)](https://www.npmjs.com/package/@tsxper/cyclic-object)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
![npm type definitions](https://img.shields.io/npm/types/@tsxper/cyclic-object)
[![NPM Downloads](https://img.shields.io/npm/dt/@tsxper/cyclic-object.svg?style=flat-square)](https://www.npmjs.com/package/@tsxper/cyclic-object)

## Usage

```bash
npm i @tsxper/cyclic-object
```

Configure object with cyclic ref.
```TypeScript
class A {
  constructor(public a: A[]) { }
}
const a: A[] = [];
const obj = new A(a);
a.push(obj);
```

Convert to JSON.
```TypeScript
import { toJSON } from '@tsxper/cyclic-object';
const jsonStr = toJSON(a); // '[{"a":"[Circular]"}]'
```

Replace cyclic 
```TypeScript
import { replaceCyclicRefs } from '@tsxper/cyclic-object';
const newObj = replaceCyclicRefs(a); // [{"a":"[Circular]"}]
```

Detect cyclic 
```TypeScript
import { hasCyclicRefs } from '@tsxper/cyclic-object';
const isCyclic = hasCyclicRefs(a); // true
```

## Interfaces
```TypeScript
hasCyclicRefs: (obj: unknown, maxDepth?: number) => boolean;

replaceCyclicRefs: (obj: unknown, maxDepth?: number, repl?: Partial<Replacements>) => unknown;

toJSON: (obj: unknown, maxDepth?: number, cyclicMarkers?: string[], replacements?: Partial<Replacements>) => string;
```

Where:
- obj [required]: input.
- maxDepth [optional]: starting from 0, -1 is disabled (default).
- cyclicMarkers [optional]: list of strings that detects JSON.stringify TypeError is related to cyclic refs. By default calling *toJSON()* will try to convert input to json string. In case there is an error related to cyclic references than object will be normalized through calling *replaceCyclicRefs()*.
- replacements [optional]: object, set custom replacements for 'array', 'object' and 'circular' when calling *replaceCyclicRefs()*.
