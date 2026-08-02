"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import { EditorToolbar } from "./editor-toolbar";

export function RichTextEditor({
  defaultValue,
  onChange,
  invalid,
}: {
  defaultValue: string;
  onChange: (html: string, json: unknown) => void;
  invalid?: boolean;
}) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: { class: "prose-content min-h-[50vh] max-w-none px-4 py-3 focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChangeRef.current(editor.getHTML(), editor.getJSON());
      }, 200);
    },
  });

  // The editor is uncontrolled — content is set once from `defaultValue`.
  // Only reset it when an external change happens (e.g. form.reset() after
  // discarding edits); feeding `defaultValue` back in on every render would
  // reset the ProseMirror doc and destroy the caret on every keystroke.
  const lastExternalValue = useRef(defaultValue);
  useEffect(() => {
    if (!editor) return;
    if (defaultValue !== lastExternalValue.current && defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue);
    }
    lastExternalValue.current = defaultValue;
  }, [defaultValue, editor]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`rounded-lg border ${invalid ? "border-destructive" : ""}`}>
      <EditorToolbar editor={editor} />
      <div className="max-h-[60vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
