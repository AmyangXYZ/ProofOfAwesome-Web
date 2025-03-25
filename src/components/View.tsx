import { Box } from "@mui/material"
import { ReactNode } from "react"
import { Typography } from "@mui/material"

function View({ title, content, footer }: { title: string; content: ReactNode; footer?: ReactNode }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "600px", md: "800px" },
        height: "calc(100vh - 128px)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 50,
        left: {
          xs: 0,
          sm: "calc(50% - 300px)",
          md: "calc(50% - 400px)",
        },
        right: { xs: 0, sm: "auto" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 1, sm: 2 }, mb: { xs: 3, sm: 5 } }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: { xs: 3, sm: 4 }, maxWidth: "100%", overflow: "auto", wordBreak: "break-word" }}>
        {content}
      </Box>

      {footer && (
        <Box
          sx={{
            py: 2,
            position: "fixed",
            maxHeight: "40px",
            bottom: "48px",

            left: { xs: 0, sm: "auto", md: "calc(50% - 300px)" },
            right: 0,
            width: { xs: "100%", sm: "400px", md: "600px" },
            zIndex: 1000,
            bgcolor: "black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  )
}

export default View
