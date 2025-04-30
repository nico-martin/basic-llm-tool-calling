# Basic LLM Tool Calling

This is a simple example demonstrating how any large language model (LLM) can perform tool-calling through structured output.


The core concept is that the system prompt defines strict rules for how the LLM can call available tools. When the model needs to call a tool, it responds with a specific XML structure. The application then parses this response, identifies any tool calls, executes them, and injects the results back into the conversation.

Under the hood, this setup uses WebLLM to run the models. All supported models have fewer than 10 billion parameters.

In this example, two mock tools are available: getWeather and searchFlight. These return random data to showcase the tool-calling process rather than the functionality of the tools themselves.
