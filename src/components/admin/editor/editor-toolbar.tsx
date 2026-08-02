"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  ImagePlus,
  Undo,
  Redo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MediaLibraryDialog } from "@/components/admin/media/media-library-dialog";
import type { MediaItem } from "@/lib/admin/media-actions";

function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(editor.getAttributes("link").href ?? "");
      }}
    >
      <PopoverTrigger
        render={
          <Toggle size="sm" pressed={editor.isActive("link")} aria-label="Link">
            <LinkIcon className="size-4" />
          </Toggle>
        }
      />
      <PopoverContent className="flex w-72 gap-2">
        <Input
          placeholder="https://…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
            setOpen(false);
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
            setOpen(false);
          }}
        >
          Set
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const state = useEditorState({
    editor,
    selector: (ctx) =>
      ctx.editor
        ? {
            heading2: ctx.editor.isActive("heading", { level: 2 }),
            heading3: ctx.editor.isActive("heading", { level: 3 }),
            paragraph: ctx.editor.isActive("paragraph"),
            bold: ctx.editor.isActive("bold"),
            italic: ctx.editor.isActive("italic"),
            underline: ctx.editor.isActive("underline"),
            strike: ctx.editor.isActive("strike"),
            bulletList: ctx.editor.isActive("bulletList"),
            orderedList: ctx.editor.isActive("orderedList"),
            blockquote: ctx.editor.isActive("blockquote"),
            alignLeft: ctx.editor.isActive({ textAlign: "left" }),
            alignCenter: ctx.editor.isActive({ textAlign: "center" }),
            canUndo: ctx.editor.can().undo(),
            canRedo: ctx.editor.can().redo(),
          }
        : null,
  });

  if (!editor || !state) return null;

  function handleImageInsert(item: MediaItem) {
    editor?.chain().focus().setImage({ src: item.url, alt: item.altText }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1.5">
      <Select
        value={state.heading2 ? "h2" : state.heading3 ? "h3" : "p"}
        onValueChange={(value) => {
          const chain = editor.chain().focus();
          if (value === "p") chain.setParagraph().run();
          else if (value === "h2") chain.setHeading({ level: 2 }).run();
          else chain.setHeading({ level: 3 }).run();
        }}
      >
        <SelectTrigger size="sm" className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="p">Paragraph</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      <Toggle size="sm" pressed={state.bold} onPressedChange={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
        <Bold className="size-4" />
      </Toggle>
      <Toggle size="sm" pressed={state.italic} onPressedChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
        <Italic className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={state.underline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
      >
        <Underline className="size-4" />
      </Toggle>
      <Toggle size="sm" pressed={state.strike} onPressedChange={() => editor.chain().focus().toggleStrike().run()} aria-label="Strikethrough">
        <Strikethrough className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      <Toggle
        size="sm"
        pressed={state.bulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
      >
        <List className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={state.orderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Numbered list"
      >
        <ListOrdered className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={state.blockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Quote"
      >
        <Quote className="size-4" />
      </Toggle>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Divider">
        <Minus className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Toggle size="sm" pressed={state.alignLeft} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()} aria-label="Align left">
        <AlignLeft className="size-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={state.alignCenter}
        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
        aria-label="Align center"
      >
        <AlignCenter className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      <LinkPopover editor={editor} />
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => setMediaOpen(true)} aria-label="Insert image">
        <ImagePlus className="size-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button type="button" variant="ghost" size="icon-sm" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">
        <Undo className="size-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">
        <Redo className="size-4" />
      </Button>

      <MediaLibraryDialog open={mediaOpen} onOpenChange={setMediaOpen} onSelect={handleImageInsert} />
    </div>
  );
}
