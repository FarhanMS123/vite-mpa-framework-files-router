import TextareaMenu from "~o/libs/TextareaMenu";
import { Input, MenuItem, MenuItemCheckbox, MenuList, Textarea, makeStyles } from "@fluentui/react-components";
import { Providers } from "~/libs/fui_docs/Providers";

const useStyles = makeStyles({
    root: {
        margin: "2rem"
    },
    inputRg: {
        width: "100%"
    }
});

export default function TestTextareaMenu() {
    const styles = useStyles();

    return (
      <Providers>
        <div className={styles.root}>
          <TextareaMenu menu={
            <MenuList>
              <MenuItemCheckbox name="is_role" value="is_role">is_role</MenuItemCheckbox>
              <MenuItem persistOnClick={true}>
                <Input className={styles.inputRg} />
              </MenuItem>
            </MenuList>
          }>
            <Textarea resize="both" />
          </TextareaMenu>
        </div>
      </Providers>
    );
}
