import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Col, Form, Space, Tooltip, type FormItemProps } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';

interface Props extends FormItemProps {
  label: string;
  name: string | (string | number)[];
  placeholder?: string;
  required?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

const EditorComponent = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      if (onChange) {
        onChange(ed.isEmpty ? '' : html);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className='rich-text-editor-container'>
      <div className='rich-text-editor-toolbar'>
        <Space size={2} wrap>
          <Tooltip title='Bold'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
            >
              <BoldOutlined />
            </button>
          </Tooltip>
          <Tooltip title='Italic'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
            >
              <ItalicOutlined />
            </button>
          </Tooltip>
          <Tooltip title='Underline'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'is-active' : ''}
            >
              <UnderlineOutlined />
            </button>
          </Tooltip>
          <Tooltip title='Strikethrough'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'is-active' : ''}
            >
              <StrikethroughOutlined />
            </button>
          </Tooltip>
          <span className='rich-text-separator' />
          <Tooltip title='Heading 2'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
              style={{ fontWeight: 700 }}
            >
              H2
            </button>
          </Tooltip>
          <Tooltip title='Heading 3'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
              style={{ fontWeight: 600 }}
            >
              H3
            </button>
          </Tooltip>
          <span className='rich-text-separator' />
          <Tooltip title='Bullet List'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
              <UnorderedListOutlined />
            </button>
          </Tooltip>
          <Tooltip title='Numbered List'>
            <button
              type='button'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
              <OrderedListOutlined />
            </button>
          </Tooltip>
          <span className='rich-text-separator' />
          <Tooltip title='Undo'>
            <button
              type='button'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <UndoOutlined />
            </button>
          </Tooltip>
          <Tooltip title='Redo'>
            <button
              type='button'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RedoOutlined />
            </button>
          </Tooltip>
        </Space>
      </div>
      <EditorContent editor={editor} className='rich-text-editor-content' />
    </div>
  );
};

export const FormRichText = ({
  label,
  name,
  placeholder,
  required,
  xs = 24,
  sm = 24,
  md = 24,
  lg = 24,
  xl,
  xxl,
  rules,
  ...rest
}: Props) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Item
        name={name}
        label={label}
        rules={[
          { required: required || false, message: `${label} is required` },
          ...(rules || []),
        ]}
        {...rest}
      >
        <EditorComponent placeholder={placeholder} />
      </Form.Item>
    </Col>
  );
};

export default FormRichText;
