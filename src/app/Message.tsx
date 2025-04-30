import React from "react";

import { Message as MessageI } from "../ai/WebLLM.ts";
import cn from "../utils/classnames.ts";
import nl2brJsx from "../utils/nl2brJsx.tsx";

const icons = {
  assistant: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="-translate-y-1/15"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  ),
  user: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="-translate-y-1/15"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  function: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="-translate-y-1/15"
    >
      <path d="M8 21s-4-3-4-9 4-9 4-9" />
      <path d="M16 3s4 3 4 9-4 9-4 9" />
    </svg>
  ),
  system: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="-translate-y-1/15"
    >
      <path d="M12 6V2H8" />
      <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
      <path d="M2 12h2" />
      <path d="M9 11v2" />
      <path d="M15 11v2" />
      <path d="M20 12h2" />
    </svg>
  ),
};

const Message: React.FC<{
  message: MessageI;
  className?: string;
}> = ({ message, className = "" }) => {
  return (
    <div
      className={cn(
        className,
        "flex",
        message.role === "user" || message.role === "tool"
          ? "flex-row"
          : "flex-row-reverse"
      )}
    >
      <div className="w-19/20 rounded-md border border-gray-300 bg-gray-50 p-4">
        <p className="mb-4 text-xs text-gray-400">
          {message.role === "assistant" ? (
            <span className="flex items-center gap-2">
              {icons.assistant} Agent
            </span>
          ) : message.role === "tool" ? (
            <span className="flex items-center gap-2">
              {icons.function} Tool Call
            </span>
          ) : message.role === "user" ? (
            <span className="flex items-center gap-2">
              {icons.user} User Prompt
            </span>
          ) : message.role === "system" ? (
            <span className="flex items-center gap-2">
              {icons.system} System Prompt
            </span>
          ) : (
            ""
          )}
        </p>
        {nl2brJsx(message?.content?.toString() || "")}
      </div>
    </div>
  );
};

export default Message;
