"use client"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  cssVariables: true,
  palette: {
    mode: "dark",
    background: {
      default: "#0f1116",
      paper: "#0f1116",
    },
  },
})

export default theme
