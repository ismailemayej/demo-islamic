"use client";

import React, { useEffect, useRef, useState } from "react";

interface RichSimpleEditorProps {
  initialValue?: string; // HTML string
  placeholder?: string;
  onChange?: (html: string) => void;
  className?: string;
}

export default function RichSimpleEditor({
  initialValue = "",
  onChange,
  className = "",
}: RichSimpleEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState(initialValue);
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialValue;
  }, [initialValue]);

  useEffect(() => {
    const handler = () => {
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });

      const value = editorRef.current?.innerHTML || "";
      setHtml(value);
      onChange?.(value);
    };

    document.addEventListener("selectionchange", handler);
    const el = editorRef.current;
    el?.addEventListener("input", handler);

    return () => {
      document.removeEventListener("selectionchange", handler);
      el?.removeEventListener("input", handler);
    };
  }, [onChange]);

  const exec = (command: "bold" | "italic" | "underline") => {
    editorRef.current?.focus();
    document.execCommand(command);

    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });

    const value = editorRef.current?.innerHTML || "";
    setHtml(value);
    onChange?.(value);
  };

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        exec("bold");
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        exec("italic");
      } else if (e.key.toLowerCase() === "u") {
        e.preventDefault();
        exec("underline");
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 p-1 rounded-md shadow-sm">
        <button
          type="button"
          aria-pressed={active.bold}
          onClick={() => exec("bold")}
          className={`px-2 py-1 rounded-md transition ${
            active.bold
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          aria-pressed={active.italic}
          onClick={() => exec("italic")}
          className={`px-2 py-1 rounded-md transition ${
            active.italic
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          aria-pressed={active.underline}
          onClick={() => exec("underline")}
          className={`px-2 py-1 rounded-md transition ${
            active.underline
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          <span className="underline">U</span>
        </button>
      </div>

      {/* Editable area (Resizable Box Added) */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        spellCheck={true}
        className="
          mt-2 px-3 py-2
          rounded-md border
          bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-400

          min-h-[150px]
          max-h-[70vh]
          overflow-auto

          resize both
        "
        style={{
          resize: "both",
          overflow: "auto",
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData?.getData("text/plain") ?? "";
          document.execCommand("insertText", false, text);
        }}
      />
    </div>
  );
}
