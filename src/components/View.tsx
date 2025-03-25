import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"

function View({ title, content, footer }: { title?: string; content: ReactNode; footer?: ReactNode }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "600px", md: "800px" },
        height: footer ? "calc(100dvh - 40px - 40px - 48px - 10px)" : "calc(100dvh - 40px - 40px - 10px)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 40,
        left: {
          xs: 0,
          sm: "calc(50% - 300px)",
          md: "calc(50% - 400px)",
        },
        right: { xs: 0, sm: "auto" },
      }}
    >
      <Box sx={{ flex: 1, px: { xs: 2, sm: 4 }, maxWidth: "100%", overflow: "auto", wordBreak: "break-word" }}>
        {title && (
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mt: 1, mb: 4 }}>
            {title}
          </Typography>
        )}
        {content}
      </Box>

      {footer && (
        <Box
          sx={{
            position: "fixed",
            height: "40px",
            bottom: "48px",
            left: { xs: 0, sm: "auto", md: "calc(50% - 300px)" },
            right: 0,
            width: { xs: "100%", sm: "400px", md: "600px" },
            zIndex: 1001,
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
