import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#14b8a6",
    },
    background: {
      default: "#f5f7fa",
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;
