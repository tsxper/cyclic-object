import { Replacements, replaceCyclicRefs } from './replaceCyclicRefs';

export const toJSON = (obj: unknown, maxDepth = -1, cyclicMarkers: string[] = [], replacements: Partial<Replacements> = {}): string => {
  if (maxDepth === -1) {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      let replaceRefs = false;
      if (e instanceof Error && e.name === 'TypeError') {
        const lookups = ['cyclic', 'circular'].concat(cyclicMarkers);
        const eMsg = e.message.toLowerCase();
        for (const lookup of lookups) {
          if (eMsg.indexOf(lookup) >= 0) {
            replaceRefs = true;
            break;
          }
        }
      }
      if (!replaceRefs) {
        throw e;
      }
    }
  }
  const patched = replaceCyclicRefs(obj, maxDepth, replacements);
  return JSON.stringify(patched);
};
