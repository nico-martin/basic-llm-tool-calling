import React from "react";

const About: React.FC = () => (
  <div className="max-w-[700px] space-y-2 p-6">
    <h1 className="text-4xl font-bold">Basic LLM Tool-Calling</h1>
    <p>
      This is a simple example demonstrating how any large language model (LLM)
      can perform tool-calling through structured output.
    </p>
    <br />
    <p>
      The core concept is that the system prompt defines strict rules for how
      the LLM can call available tools. When the model needs to call a tool, it
      responds with a specific XML structure. The application then parses this
      response, identifies any tool calls, executes them, and injects the
      results back into the conversation.
    </p>
    <p>
      Under the hood, this setup uses{" "}
      <a
        href="https://webllm.mlc.ai/"
        target="_blank"
        className="text-indigo-600 underline"
      >
        WebLLM
      </a>{" "}
      to run the models. All supported models have fewer than 10 billion
      parameters.
    </p>
    <p>
      In this example, two mock tools are available: <code>getWeather</code> and{" "}
      <code>searchFlight</code>. These return random data to showcase the
      tool-calling process rather than the functionality of the tools
      themselves.
    </p>
    <p>
      <a
        href="https://github.com/nico-martin/basic-llm-tool-calling"
        target="_blank"
        className="text-indigo-600 underline"
      >
        Find the project on GitHub
      </a>
    </p>
  </div>
);

export default About;
