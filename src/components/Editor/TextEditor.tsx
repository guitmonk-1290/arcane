import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

type TextEditorProps = {

};

const TextEditor: React.FC = () => {

    const editorRef = useRef<TinyMCEEditor | null>(null);

    return (
        <>
            <Editor
                apiKey='ut8z9ynns3q1lukvxhzkbc7hcfoerg0e2ur62haaz7jor4mc'
                onInit={(evt, editor) => editorRef.current = editor}
                init={{
                    height: 500,
                    resize: false,
                    branding: false,
                    width: "100%",
                    placeholder: "Text (optional)",
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | ' +
                        'bold italic | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist | ' +
                        'removeformat | image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    images_upload_url: 'postAcceptor.php',
                }}
            />
        </>
    );
}
export default TextEditor;