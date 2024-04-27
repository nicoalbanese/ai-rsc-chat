"use client";

import { useState } from "react";
import { ClientMessage } from "./actions";
import { useActions, useUIState } from "ai/rsc";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div>
      <div>
        {conversation.map((message: ClientMessage, i: number) => (
          <div key={i}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            { role: "user", display: input },
          ]);

          const message = await continueConversation(input);

          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            message,
          ]);
          setInput("");
        }}
      >
        <input
          type="text"
          autoFocus
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
