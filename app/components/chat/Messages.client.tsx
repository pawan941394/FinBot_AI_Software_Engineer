import type { Message } from 'ai';
import React from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message;
          const isUserMessage = role === 'user';
          const cleanedContent = content
            .replace(/\[Model: qwen2\.5-coder:3b\]/gi, "")
            .replace(/\[Model: qwen2\.5-coder:7b\]/gi, "")
            .replace(/\[Model: qwen2\.5-coder:14b\]/gi, "")
            .replace(/\[Model: qwen2\.5-coder:32b\]/gi, "")
            .replace(/\[Model: qwen2\.5-coder:0\.5b\]/gi, "")
            .replace("Using: qwen2.5-coder:3b (Ollama)", "")
            .replace("Using: qwen2.5-coder:7b (Ollama)", "")
            .replace("Using: qwen2.5-coder:14b (Ollama)", "")
            .replace("Using: qwen2.5-coder:32b (Ollama)", "")
            .replace("Using: qwen2.5-coder:0.5b (Ollama)", "")
            .replace(/\[Provider: Ollama\]/gi, "")
            .trim();


          console.log("After replacement:", cleanedContent);
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <div
                key={index}
                className={classNames('flex gap-4 p-6 w-full rounded-[calc(0.75rem-1px)]', {
                  'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
                  'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                    isStreaming && isLast,
                  'mt-4': !isFirst,
                })}
              >
                {isUserMessage && (
                  <div className="flex items-center justify-center w-[34px] h-[34px] overflow-hidden bg-white text-gray-600 rounded-full shrink-0 self-start">
                    <div>Fin</div><div className="i-ph text-xl"></div>
                  </div>
                )}
                <div className="grid grid-col-1 w-full">
                  {isUserMessage ? (
                    <UserMessage
                      content={cleanedContent}
                    />
                  ) : (
                      <AssistantMessage
                        content={cleanedContent}
                      />
                    )}
                </div>

              </div>
            );
          })
        : null}
      {isStreaming && (
        <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4"></div>
      )}
    </div>
  );
});
