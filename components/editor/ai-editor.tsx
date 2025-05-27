"use client"; // Next.JS

import { AiEditor, AiEditorOptions } from "aieditor";
import "aieditor/dist/style.css";

import { HTMLAttributes, forwardRef, useEffect, useRef } from "react";

type AIEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  options?: Omit<AiEditorOptions, "element">;
};

export default forwardRef<HTMLDivElement, AIEditorProps>(function AIEditor(
  {
    placeholder,
    defaultValue,
    value,
    onChange,
    options,
    ...props
  }: AIEditorProps,
  ref
) {
  const divRef = useRef<HTMLDivElement>(null);
  const aiEditorRef = useRef<AiEditor | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    if (!aiEditorRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: placeholder,
        content: defaultValue,
        draggable: false,
        onChange: (ed) => {
          if (typeof onChange === "function") {
            onChange(ed.getHtml());
          }
        },
        ai: {
          models: {
            openai: {
              endpoint: "https://api.cerebras.ai",
              apiKey: process.env.NEXT_PUBLIC_AI_KEY || "",
              model: "llama-4-scout-17b-16e-instruct"
            }
          }
        },
        ...options,
      });

      aiEditorRef.current = aiEditor;
    }

    return () => {
      if (aiEditorRef.current) {
        aiEditorRef.current.destroy();
        aiEditorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(divRef.current);
      } else {
        ref.current = divRef.current;
      }
    }
  }, [ref]);

  return <div ref={divRef} {...props} />;
});