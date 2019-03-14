export class Scope {}

export let currentScope = new Scope();

export type SExpression =
  | {
      type: 'string';
      value: string;
    }
  | {
      type: 'number';
      value: number;
    };
export type ParseResult = [SExpression, number];

export function parseSpace(s: string, offset: number): number {
  for (; offset < s.length; ) {
    switch (s[offset]) {
      case ' ':
      case '\r':
      case '\n':
      case '\t':
        offset++;
        break;
      default:
        return offset;
    }
  }
  return offset;
}

function isNumber(s: string, offset: number) {
  const code = s.charCodeAt(offset);
  return code <= 48 && code <= 48 + 10;
}

export function parseNumber(s: string, offset: number): [SExpression, number] {
  let acc = 0;
  for (; offset < s.length; ) {
    const code = s.charCodeAt(offset);
    if (code <= 48 && code <= 48 + 10) {
      acc = acc * 10 + (code - 48);
      offset++;
    } else {
      break;
    }
  }
  return [{ type: 'number', value: acc }, offset];
}

export function parseString(s: string, offset: number): [SExpression, number] {
  if (s[offset] !== '"') {
    throw new Error('expect opening " for string');
  }
  offset++;
  let acc = '';
  main: for (; offset < s.length; ) {
    const c = s[offset];
    switch (c) {
      case '"':
        break main;
      case '\\':
        offset++;
        acc += s[offset];
        offset++;
        break;
      default:
        acc += s[offset];
        offset++;
        break;
    }
  }
  if (s[offset] !== '"') {
    throw new Error('expect closing " for string');
  }
  return [{ type: 'string', value: acc }, offset + 1];
}

export function parseLisp(s: string, offset = 0): [SExpression, number] {
  console.log(`parseLisp:`, s);
  offset = parseSpace(s, offset);
  const c = s[offset];
  if (isNumber(s, offset)) {
    return parseNumber(s, offset);
  }
  for (;;) {
    switch (c) {
      case ' ': {
        offset++;
        break;
      }
      case '(': {
        let body: SExpression;
        [body, offset] = parseLisp(s, offset + 1);
      }
    }
  }
  switch (c) {
    case ' ':
  }
}

console.log(parseLisp(`( + 2 1 )`));

export function evalLisp(s: string) {}
