import styled from '@emotion/styled';
import { VscFiles, VscSearch, VscSourceControl, VscExtensions, VscSettingsGear, VscColorMode } from 'react-icons/vsc';

const Bar = styled.div`
  width: 48px;
  height: 100%;
  background-color: var(--bg-activity);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-right: 1px solid var(--border-color);
`;

const IconGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.div<{ active?: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => (props.active ? 'var(--active-icon)' : 'var(--inactive-icon)')};
  cursor: pointer;
  border-left: 2px solid ${props => (props.active ? 'var(--active-icon)' : 'transparent')};
  box-sizing: border-box;

  &:hover {
    color: var(--active-icon);
  }
`;

export const ActivityBar = ({ toggleSidebar, showSidebar }: { toggleSidebar: () => void, showSidebar: boolean }) => {
  const toggleTheme = () => {
    document.body.classList.toggle('light-theme');
    window.dispatchEvent(new Event('themeChanged'));
  };

  return (
    <Bar>
      <IconGroup>
        <IconWrapper active={showSidebar} onClick={toggleSidebar} title="Explorer">
          <VscFiles size={24} />
        </IconWrapper>
        <IconWrapper title="Search (Coming Soon)">
          <VscSearch size={24} />
        </IconWrapper>
        <IconWrapper title="Source Control (Coming Soon)">
          <VscSourceControl size={24} />
        </IconWrapper>
        <IconWrapper title="Extensions (Coming Soon)">
          <VscExtensions size={24} />
        </IconWrapper>
      </IconGroup>
      <IconGroup>
        <IconWrapper onClick={toggleTheme} title="Toggle Light/Dark Theme">
          <VscColorMode size={24} />
        </IconWrapper>
        <IconWrapper title="Settings">
          <VscSettingsGear size={24} />
        </IconWrapper>
      </IconGroup>
    </Bar>
  );
};
