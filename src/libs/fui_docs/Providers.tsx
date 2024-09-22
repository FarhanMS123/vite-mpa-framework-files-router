import React from "react";
import { FluentProvider, makeStyles, mergeClasses, teamsDarkTheme, tokens } from "@fluentui/react-components";
// import { logEvent } from "firebase/analytics";
// import { firebaseConfig, app, analytics } from '~/libs/legacy/firebase';

// import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
// import 'overlayscrollbars/overlayscrollbars.css';
import "~o/libs/tailwind_global.css";
import "~/libs/fui_docs/main.css";

export const useProvidersStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
});


export function Providers({ children }: React.PropsWithChildren) {
  const classes = useProvidersStyles();
  return <>
        <FluentProvider theme={teamsDarkTheme} className={mergeClasses("h-full overflow-auto flex w-full", classes.root)}>
            {/* <OverlayScrollbarsComponent defer> */}
              { children }
            {/* </OverlayScrollbarsComponent> */}
        </FluentProvider>
  </>;
}
