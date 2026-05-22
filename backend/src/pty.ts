import path from "path";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

type Session = {
    terminal: ChildProcessWithoutNullStreams;
    replId: string;
    onData: (data: string, id: number) => void;
    currentLine: string;
};

export class TerminalManager {
    private sessions: { [id: string]: Session } = {};

    constructor() {
        this.sessions = {};
    }
    
    createPty(id: string, replId: string, onData: (data: string, id: number) => void) {
        const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
        const term = spawn(shell, [], {
            cwd: path.join(__dirname, `../tmp/${replId}`),
            env: process.env
        });

        term.on("error", (err) => {
            onData(`Terminal error: ${err.message}\r\n`, 0);
        });

        term.stdout.on("data", (data) => {
            onData(data.toString(), term.pid || 0);
        });

        term.stderr.on("data", (data) => {
            onData(data.toString(), term.pid || 0);
        });

        this.sessions[id] = {
            terminal: term,
            replId,
            onData,
            currentLine: ""
        };
        
        onData("Using basic child_process fallback since node-pty is unavailable.\r\n", term.pid || 0);
        return term;
    }

    write(terminalId: string, data: string) {
        const session = this.sessions[terminalId];
        if (!session) return;

        // Handle terminal input manually for the fallback
        if (data === '\r') {
            // Enter key
            session.terminal.stdin.write(session.currentLine + '\n');
            session.currentLine = "";
            session.onData('\r\n', session.terminal.pid || 0);
        } else if (data === '\x7f' || data === '\b') {
            // Backspace
            if (session.currentLine.length > 0) {
                session.currentLine = session.currentLine.slice(0, -1);
                // Erase character from screen: move back, print space, move back
                session.onData('\b \b', session.terminal.pid || 0);
            }
        } else if (data === '\x03') {
            // Ctrl+C
            session.terminal.kill('SIGINT');
            session.currentLine = "";
            session.onData('^C\r\n', session.terminal.pid || 0);
        } else {
            // Normal character
            session.currentLine += data;
            session.onData(data, session.terminal.pid || 0);
        }
    }

    clear(terminalId: string) {
        this.sessions[terminalId]?.terminal.kill();
        delete this.sessions[terminalId];
    }
}
