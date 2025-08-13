/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Toggle } from '../ui/toggle'
import { ToggleGroup } from '../ui/toggle-group'
import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  UnderlineIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  value?: string
  placeholder: string
  onChange?: (value: string) => void
}

export default function RichTextEditor({
  value,
  placeholder,
  onChange,
}: Props) {
  const [selection, setSelection] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || placeholder || '',
    onUpdate: () => setSelection(selection + 1),
  })

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        const html = editor.getHTML()
        onChange?.(html)
      })
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <ToggleGroup type="multiple" className="flex gap-2">
        <Toggle
          pressed={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </Toggle>
        <Toggle
          pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </Toggle>
        <Toggle
          pressed={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </Toggle>
        <Toggle
          pressed={editor.isActive('heading', { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2Icon />
        </Toggle>
        <Toggle
          pressed={editor.isActive('heading', { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3Icon />
        </Toggle>
        <Toggle
          pressed={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon />
        </Toggle>
        <Toggle
          pressed={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListIcon />
        </Toggle>
      </ToggleGroup>
      <EditorContent
        editor={editor}
        className="border p-4 rounded min-h-fit *:focus-visible:!outline-0 *:h-full  prose prose-headings:mt-0 prose-p:mt-0"
      />
    </div>
  )
}
