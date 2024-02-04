export const hasCyclicRefs = (obj: unknown, maxDepth = -1): boolean => {
  const traversed = new Set();
  const hasRefs = (vertex: unknown, depth = 0): boolean => {
    if (traversed.has(vertex)) {
      return true;
    }
    const depthReached = maxDepth >= 0 && (depth - 1) >= maxDepth;
    if (typeof vertex !== 'object' || vertex === null) {
      return false;
    } else if (depthReached) {
      return false;
    }
    traversed.add(vertex);
    const values = Array.isArray(vertex) ? vertex : Object.values(vertex);
    for (const v of values) {
      if (hasRefs(v, depth + 1)) {
        return true;
      }
    }
    return false;
  };
  return hasRefs(obj);
};
