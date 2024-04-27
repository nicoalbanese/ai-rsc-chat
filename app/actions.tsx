"use server";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import { experimental_streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  role: "user" | "assistant";
  display: React.ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();
  const stream = createStreamableUI();

  (async () => {
    const result = await experimental_streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [...history.get(), { role: "user", content: input }],
    });
    let text = "";
    for await (const delta of result.textStream) {
      text = text + delta;
      stream.update(<div>{text}</div>);
    }
    stream.done();
  })();

  return {
    role: "assistant",
    display: stream.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
