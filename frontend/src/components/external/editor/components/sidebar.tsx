import React, {ReactNode, useState} from 'react';
import styled from "@emotion/styled";
import { VscNewFile } from 'react-icons/vsc';

export const Sidebar = ({children, onNewFile}: { children: ReactNode, onNewFile?: (filename: string) => void }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (newFileName.trim() && onNewFile) {
        onNewFile(newFileName.trim());
      }
      setIsCreating(false);
      setNewFileName('');
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFileName('');
    }
  };

  return (
    <Aside>
      <SidebarHeader>
        <span>EXPLORER</span>
        <ActionIcon title="New File" onClick={() => setIsCreating(true)}>
          <VscNewFile />
        </ActionIcon>
      </SidebarHeader>
      {isCreating && (
        <InputWrapper>
          <FileNameInput
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsCreating(false)}
            placeholder="Filename..."
          />
        </InputWrapper>
      )}
      {children}
    </Aside>
  )
}

const ActionIcon = styled.div`
  cursor: pointer;
  color: var(--text-color);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--active-icon);
  }
`;

const SidebarHeader = styled.div`
  padding: 10px 20px;
  font-size: 11px;
  color: var(--text-header);
  letter-spacing: 1px;
  font-weight: 600;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover > div {
    opacity: 1;
  }
`;

const InputWrapper = styled.div`
  padding: 0 20px;
  margin-bottom: 10px;
`;

const FileNameInput = styled.input`
  width: 100%;
  background-color: var(--bg-color);
  border: 1px solid var(--border-active);
  color: var(--text-color);
  padding: 4px;
  font-size: 13px;
  outline: none;
`;

const Aside = styled.aside`
  width: 250px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  padding-top: 3px;
`

export default Sidebar
