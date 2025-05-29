"use client"; // Next.JS

import { AiEditor, AiEditorOptions } from "aieditor";
import {uploadImage} from "@/utils/imgService";
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
              endpoint: process.env.NEXT_PUBLIC_AI_ENDPOINT || "",
              apiKey: process.env.NEXT_PUBLIC_AI_KEY || "",
              model: process.env.NEXT_PUBLIC_AI_MODEL || "gpt-4.1-mini",
            }
          }
        },
        image: {
          uploader: async (
            file: File,
            formName: string
          ): Promise<Record<string, any>> => {
            const formData = new FormData();
            formData.append(formName, file);
            try {
              const resp = await uploadImage(file, file.name);
              if (resp.data) {
                return {
                  errorCode: 0,
                  data: {
                    src: resp.data,
                    alt: file.name,
                  },
                };
              } else {
                return {
                  errorCode: 1,
                  data: {},
                };
              }
            } catch (error) {
              return {
                errorCode: 1,
                data: {},
              };
            }
          },
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