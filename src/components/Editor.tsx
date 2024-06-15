import { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  RED: { color: "red" },
};

const EditorComponent = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedData = localStorage.getItem("editorContent");
    return savedData
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedData)))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  }, [editorState]);

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (input: string, editorState: EditorState) => {
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockText = block.getText().slice(0, selection.getStartOffset());

    const blockTypeMap: Record<string, string> = {
      "#": "header-one",
      "*": "BOLD",
      "**": "RED",
      "***": "UNDERLINE",
      "```": "code-block",
    };

    const blockType = blockTypeMap[blockText];
    if (blockType && input === " ") {
      setEditorState(
        RichUtils.toggleBlockType(editorState, blockType) ||
          RichUtils.toggleInlineStyle(editorState, blockType)
      );
      return "handled";
    }
    return "not-handled";
  };

  const saveContent = () => {
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    alert("Content saved!");
  };

  return (
    <div className="editor-container">
      <div className="header-container">
        <h1>Draft.js Editor By Nilesh Yadav</h1>
        <button onClick={saveContent}>Save</button>
      </div>
      <div className="editor">
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default EditorComponent;
