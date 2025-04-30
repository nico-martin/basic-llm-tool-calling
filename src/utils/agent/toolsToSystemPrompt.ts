import generateSchemaDescription from "./generateSchemaDescription.ts";
import { Tool } from "./tool.ts";

const formatXmlExample = (
  functionName: string,
  example: {
    query: string;
    parameters: object;
  }
) => {
  const parameters: string = Object.entries(example.parameters)
    .map(
      ([name, value]) =>
        `<${name} type="${typeof value === "object" ? "string" : typeof value}">${value}</${name}>`
    )
    .join("");

  return `- "${example.query}" -> Output: <functionCall><name>${functionName}</name><parameters>${parameters}</parameters></functionCall>`;
};

const toolsToSystemPrompt = (tools: Record<string, Tool<any>>): string => {
  const toolDescriptions: Array<string> = Object.entries(tools).map(
    ([name, tool]) => `Tool Name: ${name}
Description ${tool.description}
Parameters: 
  ${generateSchemaDescription(tool.parameters).join("\n  ")}
Examples: 
  ${tool.examples.map((example) => formatXmlExample(name, example)).join("\n  ")}
`
  );

  return `If you think you need to call a tool, you can do that.
  
Available tools:

${toolDescriptions.join("\n\n")}

If you really need to call a function, use the following format:
<functionCall>
  <name>{functionName}</name>
  <parameters>
    <{paramName} type="{type}">{value}</{paramName}>
    <{paramName} type="{type}">{value}</{paramName}>
  </parameters>
</functionCall>

After <functionCall>, share your thoughts with the user. But keep it short.

If you don't need to call a tool, just return the answer.`;
};

export default toolsToSystemPrompt;
