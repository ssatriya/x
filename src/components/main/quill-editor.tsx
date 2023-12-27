import * as React from "react";

import ReactQuill, { UnprivilegedEditor } from "react-quill";
import { DeltaStatic, Sources } from "quill";

import "react-quill/dist/quill.snow.css";

type QuillEditorProps = {
  focusHandler?: () => void;
  editorValue: DeltaStatic | undefined;
  setCharLength: (value: number) => void;
  setEditorValue: (value: DeltaStatic) => void;
  className: string;
  placeholder: string;
  isModalOpen?: boolean;
  isFocus?: boolean;
};

const QuillEditor = ({
  focusHandler,
  editorValue,
  setCharLength,
  setEditorValue,
  className,
  placeholder,
  isModalOpen = false,
  isFocus = false,
}: QuillEditorProps) => {
  const handleChange = (
    value: string,
    deltaOp: DeltaStatic,
    sources: Sources,
    editor: UnprivilegedEditor
  ) => {
    const characterCount = editor.getLength() - 1;
    const content = editor.getContents();

    setCharLength(characterCount);
    setEditorValue(content);
  };

  const modules = {
    toolbar: false,
  };

  const formats = [
    // <-- commented-out to suppress auto bullets
    // "background",
    // "bold",
    // "color",
    // "font",
    // "code",
    // "italic",
    "link",
    // "size",
    // "strike",
    // "script",
    // "underline",
    // "blockquote",
    // "header",
    // "indent",
    // "list",
    // "align",
    // "direction",
    // "code-block",
    // "formula",
    // "image",
    // "video"
  ];

  const quillRef = React.useRef<ReactQuill>(null);

  React.useEffect(() => {
    if (isModalOpen) {
      quillRef.current?.focus();
    }
  }, [isModalOpen]);

  React.useEffect(() => {
    if (isFocus) {
      quillRef.current?.focus();
    } else {
      quillRef.current?.blur();
    }
  }, [isFocus]);

  return (
    <div className={className}>
      <ReactQuill
        ref={quillRef}
        defaultValue={""}
        modules={modules}
        theme="snow"
        value={editorValue}
        formats={formats}
        onChange={handleChange}
        placeholder={placeholder}
        className="text-xl leading-6"
        onFocus={focusHandler}
      />
    </div>
  );
};
export default QuillEditor;
