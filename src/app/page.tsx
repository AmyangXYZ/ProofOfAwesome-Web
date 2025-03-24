import { Box, Typography, Button } from "@mui/material"
import Demo from "@/app/demo"

export default function Home() {
  return (
    <Box component="main">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          padding: { xs: "1rem", sm: "2rem" },
        }}
      >
        <Box component="img" src="/logo.png" alt="Proof of Awesome" sx={{ height: 72 }} />
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontSize: { xs: "2rem", sm: "3rem" },
          }}
        >
          Proof of Awesome
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            maxWidth: "85%",
            mb: 2,
          }}
        >
          Your blockchain achievement platform
        </Typography>

        <Button
          href="#demo"
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            borderRadius: 2,
          }}
          component="a"
        >
          Try it online
        </Button>
      </Box>

      <Box id="demo" sx={{ minHeight: "100vh" }}>
        <Demo />
      </Box>
    </Box>
  )
}
