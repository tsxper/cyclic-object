import { toJSON } from './index';

describe('toJSON', () => {
  it('should handle simple objects', () => {
    expect(toJSON({ a: 1 })).toBe('{"a":1}');
  });
  it('should handle objects with cyclic refs', () => {
    class A {
      constructor(public a: A[]) { }
    }
    const a: A[] = [];
    const obj = new A(a);
    a.push(obj);
    expect(toJSON(a)).toBe('[{"a":"[Circular]"}]');
    expect(toJSON(a, 0)).toBe('["[Object]"]');
    expect(toJSON(a, 1)).toBe('[{"a":"[Circular]"}]');
    expect(toJSON(a, 1, [], { "circular": "[circularTest]" })).toBe('[{"a":"[circularTest]"}]');
  });
  it('should re-throw', () => {
    const obj = new Proxy({
      k1: '',
    }, {
      get() {
        throw new Error('test');
      }
    });
    expect(() => toJSON(obj)).toThrow();
  });
});
