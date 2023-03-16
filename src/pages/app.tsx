import Connector from './connector';
import Setup from './setup';
import { atom, useRecoilValue } from 'recoil';

export const usernameState = atom<string | null>({
    key: 'username',
    default: null,
});

export default function App(): JSX.Element {
    const username = useRecoilValue(usernameState);

    if (username !== null) {
        return <Connector />;
    }
    return <Setup />;
}

App.whyDidYouRender = true;
