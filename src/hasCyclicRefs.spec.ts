import { hasCyclicRefs } from './index';

describe('hasCyclicRefs', () => {
  it('should detect cycles', () => {
    class A {
      a = {
        b: { c: [1, 2] },
        d: {
          e: [] as A[]
        },
        f: {
          g: {
            h: {
              g: [3, 4]
            }
          }
        },
      };
    }
    const obj = new A;
    obj.a.d.e.push(obj);
    expect(hasCyclicRefs(obj)).toBe(true);
    expect(hasCyclicRefs(obj, 0)).toBe(false);
    expect(hasCyclicRefs(obj, 1)).toBe(false);
    expect(hasCyclicRefs(obj, 2)).toBe(false);
    expect(hasCyclicRefs(obj, 3)).toBe(true);
  });
});
