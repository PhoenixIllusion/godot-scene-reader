
interface SyntaxError {
  expected: string;
  found: string;
  location: string;
  name: "SyntaxError";
}

const StartRules: string[];

interface ParseOptions {
  grammarSource?: string;
  startRule?: string;
}

interface PropFunction {
  method: string;
  args: any[]
}

type PropVal = string | number | boolean | PropFunction | object;

interface Block {
  block: {
    type: string;
    attr: [string,string][]
  },
  props: [
    [string, PropVal]
  ]
}

function parse(input: string, options?: ParseOptions): Block[];

export {
  StartRules,
  SyntaxError,
  parse
};