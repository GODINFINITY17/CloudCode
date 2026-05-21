import styled from '@emotion/styled';
import { VscRemote, VscError, VscWarning, VscBell } from 'react-icons/vsc';

const Bar = styled.div`
  width: 100%;
  height: 22px;
  background-color: var(--border-active);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 10;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  height: 100%;
  padding: 0 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const StatusBar = () => {
  return (
    <Bar>
      <Section>
        <Item>
          <VscRemote />
        </Item>
        <Item>
          main*
        </Item>
        <Item>
          <VscError /> 0 <VscWarning /> 0
        </Item>
      </Section>
      <Section>
        <Item>
          Ln 1, Col 1
        </Item>
        <Item>
          Spaces: 4
        </Item>
        <Item>
          UTF-8
        </Item>
        <Item>
          LF
        </Item>
        <Item>
          TypeScript React
        </Item>
        <Item>
          <VscBell />
        </Item>
      </Section>
    </Bar>
  );
};
