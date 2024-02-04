export type Replacements = {
  'circular': string,
  'array': string,
  'object': string,
};
export const replaceCyclicRefs = (obj: unknown, maxDepth = -1, repl: Partial<Replacements> = {}): unknown => {
  const replacements: Replacements = Object.assign({
    'circular': '[Circular]',
    'array': '[Array]',
    'object': '[Object]',
  }, repl);
  const traversed = new Set();
  const replacer = (vertex: unknown, depth = 0): unknown => {
    if (traversed.has(vertex)) {
      return replacements['circular'];
    }
    const depthReached = maxDepth >= 0 && (depth - 1) >= maxDepth;
    if (typeof vertex !== 'object' || vertex === null) {
      return vertex;
    } else if (depthReached) {
      if (Array.isArray(vertex)) return replacements['array'];
      else return Object.keys(vertex).length === 0 ? {} : replacements['object'];
    }
    traversed.add(vertex);
    if (Array.isArray(vertex)) {
      return vertex.map((v) => replacer(v, depth + 1));
    }
    const newObj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(vertex)) {
      newObj[k] = replacer(v, depth + 1);
    }
    return newObj;
  };
  return replacer(obj);
};
