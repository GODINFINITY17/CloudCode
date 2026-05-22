import { useEffect, useMemo } from "react";
import Sidebar from "./external/editor/components/sidebar";
import { Code } from "./external/editor/editor/code";
import styled from "@emotion/styled";
import { File, buildFileTree, RemoteFile } from "./external/editor/utils/file-manager";
import { FileTree } from "./external/editor/components/file-tree";
import { Socket } from "socket.io-client";

// credits - https://codesandbox.io/s/monaco-tree-pec7u
export const Editor = ({
    files,
    onSelect,
    selectedFile,
    socket,
    children,
    showSidebar,
    onNewFile
}: {
    files: RemoteFile[];
    onSelect: (file: File) => void;
    selectedFile: File | undefined;
    socket: Socket;
    children?: React.ReactNode;
    showSidebar: boolean;
    onNewFile?: (filename: string) => void;
}) => {
  const rootDir = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0])
    }
  }, [selectedFile])

  return (
    <Main>
      {showSidebar && (
        <Sidebar onNewFile={onNewFile}>
          <FileTree
            rootDir={rootDir}
            selectedFile={selectedFile}
            onSelect={onSelect}
          />
        </Sidebar>
      )}
      <EditorContainer>
        {selectedFile && (
          <TabsBar>
            <Tab>
              {selectedFile.name} <VscClose />
            </Tab>
          </TabsBar>
        )}
        <CodeContainer>
          <Code socket={socket} selectedFile={selectedFile} />
        </CodeContainer>
        {children}
      </EditorContainer>
    </Main>
  );
};

import { VscClose } from "react-icons/vsc";

const TabsBar = styled.div`
  display: flex;
  height: 35px;
  background-color: var(--bg-sidebar);
  border-bottom: 1px solid var(--bg-color);
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 13px;
  border-top: 1px solid var(--border-active);
  cursor: pointer;

  svg {
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: hidden;
`;

const CodeContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;