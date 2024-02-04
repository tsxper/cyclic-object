import { replaceCyclicRefs } from './index';

describe('replaceCyclicRefs', () => {
  it('should handle objects', () => {
    const s1 = Symbol('s1');
    class A {
      a = 1;
      [s1] = 's1';
    }
    class B extends A {
      b = 2;
      c = {};
      d = { e: {} };
    }
    const b = new B();
    expect(JSON.stringify(replaceCyclicRefs(b))).toBe('{"a":1,"b":2,"c":{},"d":{"e":{}}}');
    expect(JSON.stringify(replaceCyclicRefs(b, 0))).toBe('{"a":1,"b":2,"c":{},"d":"[Object]"}');
    expect(JSON.stringify(replaceCyclicRefs(b, 1))).toBe('{"a":1,"b":2,"c":{},"d":{"e":{}}}');
  });
  it('should handle arrays', () => {
    const a = [
      1,
      2,
      {
        b: [
          3,
          4,
          [5]
        ]
      },
    ];
    expect(JSON.stringify(replaceCyclicRefs(a))).toBe('[1,2,{"b":[3,4,[5]]}]');
    expect(JSON.stringify(replaceCyclicRefs(a, 0))).toBe('[1,2,"[Object]"]');
    expect(JSON.stringify(replaceCyclicRefs(a, 1))).toBe('[1,2,{"b":"[Array]"}]');
    expect(JSON.stringify(replaceCyclicRefs(a, 2))).toBe('[1,2,{"b":[3,4,"[Array]"]}]');
    expect(JSON.stringify(replaceCyclicRefs(a, 3))).toBe('[1,2,{"b":[3,4,[5]]}]');
  });
  it('should handle circular refs', () => {
    class A {
      a = {
        b: {
          c: [1, 2]
        },
        d: [] as A[],
      };
    }
    const a = new A;
    a.a.d.push(a);
    expect(JSON.stringify(replaceCyclicRefs(a))).toBe('{"a":{"b":{"c":[1,2]},"d":["[Circular]"]}}');

    expect(JSON.stringify(replaceCyclicRefs(a, 0))).toBe('{"a":"[Object]"}');
    expect(JSON.stringify(replaceCyclicRefs(a, 0, { "object": "[testObj]" }))).toBe('{"a":"[testObj]"}');

    expect(JSON.stringify(replaceCyclicRefs(a, 1))).toBe('{"a":{"b":"[Object]","d":"[Array]"}}');
    expect(JSON.stringify(replaceCyclicRefs(a, 1, { "array": "[testArr]" }))).toBe('{"a":{"b":"[Object]","d":"[testArr]"}}');

    expect(JSON.stringify(replaceCyclicRefs(a, 2))).toBe('{"a":{"b":{"c":"[Array]"},"d":["[Circular]"]}}');
    expect(JSON.stringify(replaceCyclicRefs(a, 2, { "circular": "[testCirc]" }))).toBe('{"a":{"b":{"c":"[Array]"},"d":["[testCirc]"]}}');

    expect(JSON.stringify(replaceCyclicRefs(a, 3))).toBe('{"a":{"b":{"c":[1,2]},"d":["[Circular]"]}}');
  });
});
