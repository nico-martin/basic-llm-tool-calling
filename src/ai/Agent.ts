import parseXmlFunctionCalls from "../utils/agent/parseXmlFunctionCalls.ts";
import { Tool } from "../utils/agent/tool.ts";
import toolsToSystemPrompt from "../utils/agent/toolsToSystemPrompt.ts";
import { LlmConfig } from "../utils/settings/constants.ts";
import WebLLM, { Conversation } from "./WebLLM.ts";

class Agent {
  public llm = new WebLLM();
  private tools: Record<string, Tool> = {};
  private conversation: Conversation | null = null;

  public addTool = (name: string, tool: Tool) => {
    this.tools[name] = tool;
  };

  public setModel = (model: LlmConfig) => this.llm.setModel(model);

  public setConversation = (systemPrompt: string) => {
    this.conversation = this.llm.createConversation(
      `${systemPrompt}\n\n${toolsToSystemPrompt(this.tools)}`
    );
  };

  public processPrompt = async (
    userPrompt: string,
    maxRounds: number = 5,
    onEngineReady: () => void = () => {},
    temperature: number = 0,
    filterDuplicateFunctionCalls: boolean = false
  ) => {
    if (!this.conversation) {
      return "Conversation not set";
    }
    let nextPrompt: string = userPrompt;
    let finalAnswer: string = "";
    let round = 0;
    const calledFunctions: Array<string> = [];

    while (nextPrompt) {
      round++;
      if (round > maxRounds) {
        nextPrompt = "";
        continue;
      }
      const response = await this.conversation.generate(
        nextPrompt,
        temperature,
        onEngineReady,
        round === 1 ? "user" : "tool"
      );
      const parsed = parseXmlFunctionCalls(response);

      const toolsToCall = parsed.functionCalls
        .filter((func) => func.name in this.tools)
        .filter((func) => !calledFunctions.includes(JSON.stringify(func)))
        .map((func) => this.tools[func.name].execute(func.parameters));

      if (filterDuplicateFunctionCalls) {
        parsed.functionCalls.map((t) =>
          calledFunctions.push(JSON.stringify(t))
        );
      }

      if (toolsToCall.length === 0) {
        nextPrompt = "";
        finalAnswer = parsed.cleanText;
        continue;
      }

      const functionResults = await Promise.all(toolsToCall);
      nextPrompt = functionResults.filter(Boolean).join("\n\n");
    }

    return (
      finalAnswer ||
      "Tell the user that you have not been able to answer the question"
    );
  };
}

export default Agent;
