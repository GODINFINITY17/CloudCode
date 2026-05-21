import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { File } from "../utils/file-manager";
import { Socket } from "socket.io-client";

export const Code = ({ selectedFile, socket }: { selectedFile: File | undefined, socket: Socket }) => {
  const [theme, setTheme] = useState(document.body.classList.contains('light-theme') ? 'light' : 'vs-dark');

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(document.body.classList.contains('light-theme') ? 'light' : 'vs-dark');
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  if (!selectedFile)
    return null

  const code = selectedFile.content
  let language = selectedFile.name.split('.').pop()

  if (language === "js" || language === "jsx")
    language = "javascript";
  else if (language === "ts" || language === "tsx")
    language = "typescript"
  else if (language === "py" )
    language = "python"

    function debounce(func: (value: string) => void, wait: number) {
      let timeout: number;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func(value);
        }, wait);
      };
    }

  return (
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={debounce((value) => {
          // Should send diffs, for now sending the whole file
          // PR and win a bounty!
          socket.emit("updateContent", { path: selectedFile.path, content: value });
        }, 500)}
      />
  )
}
