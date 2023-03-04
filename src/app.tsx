import Chat from './chat';
import Setup from './setup';
import { useState } from 'react';

export default function App() {
    const [username, setUsername] = useState<string | null>(null);

    if (username !== null) {
        return <Chat username={username} />;
    }
    return <Setup setUsername={setUsername} />;
}
