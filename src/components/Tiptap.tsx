import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { FaBold, FaItalic, FaStrikethrough, FaListOl, FaListUl, FaQuoteLeft, FaRedo, FaUndo } from 'react-icons/fa'



const buttonConfigs = [
    {
        action: (editor: any) => editor.chain().focus().toggleBold().run(),
        isActive: (editor: any) => editor.isActive('bold'),
        icon: <FaBold />,
        disabled: (editor: any) => !editor.can().chain().focus().toggleBold().run(),
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor: any) => editor.isActive('italic'),
        icon: <FaItalic />,
        disabled: (editor: any) => !editor.can().chain().focus().toggleItalic().run(),
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().toggleStrike().run(),
        isActive: (editor: any) => editor.isActive('strike'),
        icon: <FaStrikethrough />,
        disabled: (editor: any) => !editor.can().chain().focus().toggleStrike().run(),
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().toggleBulletList().run(),
        isActive: (editor: any) => editor.isActive('bulletList'),
        icon: <FaListUl />,
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
        isActive: (editor: any) => editor.isActive('orderedList'),
        icon: <FaListOl />,
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().toggleBlockquote().run(),
        isActive: (editor: any) => editor.isActive('blockquote'),
        icon: <FaQuoteLeft />,
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().setHorizontalRule().run(),
        icon: 'Horizontal Line',
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().undo().run(),
        icon: <FaUndo />,
        disabled: (editor: any) => !editor.can().chain().focus().undo().run(),
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
    {
        action: (editor: any) => editor.chain().focus().redo().run(),
        icon: <FaRedo />,
        disabled: (editor: any) => !editor.can().chain().focus().redo().run(),
        className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
    },
];

const headingConfigs = [1, 2, 3, 4, 5, 6].map(level => ({
    action: (editor: any) => editor.chain().focus().toggleHeading({ level }).run(),
    isActive: (editor: any) => editor.isActive('heading', { level }),
    icon: `h${level}`,
    className: 'text-black bg-transparent rounded-lg border-[1px] p-2 hover:bg-gray-300',
}));



const MenuBar = ({ editor }: { editor: any }) => {

    if (!editor) {
        return null;
    }

    return (
        <div className='flex items-center flex-wrap w-[50vw] gap-2'>
            {buttonConfigs.map(({ action, isActive, icon, disabled, className }, index) => (
                <button
                    key={index}
                    onClick={() => action(editor)}
                    disabled={disabled ? disabled(editor) : false}
                    className={`${isActive && isActive(editor) ? 'is-active' : ''} ${className}`}
                >
                    {icon}
                </button>
            ))}

            {headingConfigs.map(({ action, isActive, icon, className }, index) => (
                <button
                    key={index}
                    onClick={() => action(editor)}
                    className={`${isActive(editor) ? 'is-active' : ''} ${className}`}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};

type TipProp = {
    setContent: (content: string) => void;
}

const Tiptap = (props : TipProp) => {

    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Write Something Here</p>",
        onUpdate({ editor }) {
            props.setContent(editor.getHTML())
        }
    })
    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent className='prose-lg' editor={editor} />
        </>
    )
}

export default Tiptap;