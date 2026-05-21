import { useEffect, useState } from 'react';
import { Editor } from './Editor';
import { File, RemoteFile, Type } from './external/editor/utils/file-manager';
import { useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Output } from './Output';
import { TerminalComponent as Terminal } from './Terminal';
import { Socket, io } from 'socket.io-client';
import { EXECUTION_ENGINE_URI } from '../config';

import { ActivityBar } from './ActivityBar';
import { StatusBar } from './StatusBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
`;

const Workspace = styled.div`
  display: flex;
  margin: 0;
  font-size: 16px;
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

function useSocket(replId: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`${EXECUTION_ENGINE_URI}?roomId=${replId}`);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [replId]);

    return socket;
}

export const CodingPage = () => {
    const [searchParams] = useSearchParams();
    const replId = searchParams.get('replId') ?? '';
    const [loaded, setLoaded] = useState(false);
    const socket = useSocket(replId);
    const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [showOutput, setShowOutput] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[]}) => {
                setLoaded(true);
                setFileStructure(rootContent);
            });
        }
    }, [socket]);

    const onSelect = (file: File) => {
        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
            });

        } else {
            socket?.emit("fetchContent", { path: file.path }, (data: string) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    };
    
    const [showSidebar, setShowSidebar] = useState(true);

    const handleNewFile = (filename: string) => {
        socket?.emit("createFile", { path: filename }, () => {
            // After file is created, fetch root directory to update tree
            socket?.emit("fetchDir", "", (data: RemoteFile[]) => {
                setFileStructure(data);
            });
        });
    };

    if (!loaded) {
        return "Loading...";
    }

    return (
        <Container>
            <Workspace>
                <ActivityBar showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />
                <Editor 
                    socket={socket} 
                    selectedFile={selectedFile} 
                    onSelect={onSelect} 
                    files={fileStructure} 
                    showSidebar={showSidebar}
                    onNewFile={handleNewFile}
                >
                    <Terminal socket={socket} />
                </Editor>
            </Workspace>
            <StatusBar />
        </Container>
    );
}
