import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import "xterm/css/xterm.css";

const FIT_ADDON = new FitAddon();

export const TerminalComponent = ({ socket }: { socket: Socket }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'problems'>('terminal');

    useEffect(() => {
        if (!terminalRef || !terminalRef.current || !socket || activeTab !== 'terminal') {
            return;
        }

        socket.emit("requestTerminal");

        const term = new Terminal({
            theme: {
                background: "#000000"
            }
        });
        
        term.loadAddon(FIT_ADDON);
        term.open(terminalRef.current);
        FIT_ADDON.fit();

        const disposable = term.onData((data) => {
            socket.emit("terminalData", { data });
        });

        socket.on("terminal", ({ data }: { data: ArrayBuffer }) => {
            term.write(new Uint8Array(data));
        });

        return () => {
            disposable.dispose();
            socket.off("terminal");
            term.dispose();
        };
    }, [terminalRef, socket, activeTab]);

    return (
        <TerminalContainer>
            <TerminalHeader>
                <Tab className={activeTab === 'terminal' ? 'active' : ''} onClick={() => setActiveTab('terminal')}>Terminal</Tab>
                <Tab className={activeTab === 'output' ? 'active' : ''} onClick={() => setActiveTab('output')}>Output</Tab>
                <Tab className={activeTab === 'problems' ? 'active' : ''} onClick={() => setActiveTab('problems')}>Problems</Tab>
            </TerminalHeader>
            <TerminalContent>
                {activeTab === 'terminal' && <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />}
                {activeTab === 'output' && <div style={{ color: "var(--text-color)", padding: "10px" }}>No output tasks are currently running.</div>}
                {activeTab === 'problems' && <div style={{ color: "var(--text-color)", padding: "10px" }}>No problems have been detected in the workspace.</div>}
            </TerminalContent>
        </TerminalContainer>
    );
};

import styled from "@emotion/styled";

const TerminalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 30vh;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color);
`;

const TerminalHeader = styled.div`
  display: flex;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0 10px;
`;

const Tab = styled.div`
  padding: 8px 16px;
  color: var(--text-header);
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  border-bottom: 1px solid transparent;

  &.active {
    color: var(--text-color);
    border-bottom: 1px solid var(--border-active);
  }

  &:hover {
    color: var(--text-color);
  }
`;

const TerminalContent = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
  padding-left: 10px;
  background-color: var(--bg-color);
`;