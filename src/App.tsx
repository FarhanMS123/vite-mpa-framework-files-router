import { Button, FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import React from 'react'

export default function App() {
    return (<>
        <FluentProvider theme={teamsDarkTheme}>
            <Button>Example</Button>
        </FluentProvider>
    </>);
}