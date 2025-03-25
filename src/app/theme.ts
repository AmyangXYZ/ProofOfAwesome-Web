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
      default: "#101214",
      paper: "#101214",
    },
  },
})

export default theme
