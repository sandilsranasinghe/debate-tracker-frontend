import {createTheme} from "@mui/material/styles";
import {grey, red} from "@mui/material/colors";

const RED_DARK = "#440000";
const BLACK800 = "#1d1d1d";
const BLACK900 = "#111111";

export const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {},
        },
        dark: {
            palette: {
                text: {
                    primary: red[900],
                    secondary: grey[100],
                },
                primary: {
                    main: red[900],
                    dark: RED_DARK,
                },
                secondary: {
                    main: grey[900],
                    dark: BLACK800,
                    light: grey[100],
                },
                background: {
                    paper: BLACK900,
                    default: grey[800],
                },
            },
        },
    },
});
