import { Button, Menu, MenuPopover, MenuProps, MenuTrigger, MenuTriggerProps, makeStyles, mergeClasses } from "@fluentui/react-components";
import { MoreVerticalFilled } from "@fluentui/react-icons";
import React, { type ReactNode } from "react";

export const useChatParserStyles = makeStyles({
    root: {
        position: "relative",
        width: "fit-content",
    },
    topRight: {
        top: 0,
        right: 0,
        position: "absolute",
        zIndex: 1,
        opacity: 0.4,
        "&:hover": {
            opacity: 1,
        }
    },

});

export default function TextareaMenu({ children, attrMenu, menu, className }: {
    attrMenu?: Partial<MenuProps & Pick<MenuTriggerProps, "disableButtonEnhancement">>;
    menu?: ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const styles = useChatParserStyles();

    return <div className={mergeClasses(styles.root, className)}>
        <div className={styles.topRight}>
            <Menu {...attrMenu}>
                <MenuTrigger disableButtonEnhancement={attrMenu?.disableButtonEnhancement ?? true}>
                    <Button icon={<MoreVerticalFilled />} size="small" />
                </MenuTrigger>
                <MenuPopover>
                    { menu }
                </MenuPopover>
            </Menu>
        </div>
        { children }
    </div>;
}