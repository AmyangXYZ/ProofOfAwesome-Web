import { Box, Typography, Button, Stack, Container, Grid, Paper } from "@mui/material"
import { EmojiEvents, Psychology, Forum, AttachMoney } from "@mui/icons-material"

export default function Home() {
  return (
    <Box component="main" sx={{ bgcolor: "black", color: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          padding: { xs: "1rem", sm: "2rem" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Abstract blockchain animation background would go here */}
        <Stack direction="row" spacing={{ xs: 0, sm: 2, md: 4 }} alignItems="center">
          <Box
            component="img"
            src="/logo.svg"
            alt="Proof of Awesome"
            sx={{
              height: { xs: 100, sm: 130, md: 160 },
              mb: 2,
              zIndex: 2,
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            align="center"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              fontWeight: "bold",
              mb: 1,
              zIndex: 2,
            }}
          >
            Proof of Awesome
          </Typography>
        </Stack>

        <Typography
          variant="h5"
          align="center"
          sx={{
            maxWidth: "800px",
            mb: 4,
            color: "orange",
            fontWeight: "medium",
            zIndex: 2,
          }}
        >
          Turn your real-world achievements into AI-verified blockchain proof
        </Typography>

        <Container maxWidth="md" sx={{ zIndex: 2 }}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Key features */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <EmojiEvents sx={{ color: "#FFD700" }} />
                <Typography>Publish your achievements on blockchain for permanent recognition</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Psychology sx={{ color: "#00B4D8" }} />
                <Typography>Get your accomplishments validated and rewarded through AI</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Forum sx={{ color: "#4CAF50" }} />
                <Typography>Join themed chains for fitness, learning, creativity, and more</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: "#FF9800" }} />
                <Typography>Earn AwesomeCoins for your verified achievements</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Button
            href="/demo"
            variant="contained"
            size="large"
            color="warning"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
            }}
            component="a"
          >
            Try Web Demo
          </Button>
          <Button
            href="/download"
            variant="outlined"
            size="large"
            color="warning"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
            component="a"
          >
            Download iOS App
          </Button>
        </Stack>

        <Typography
          variant="caption"
          align="center"
          sx={{
            mt: 4,
            opacity: 0.7,
            maxWidth: "600px",
          }}
        >
          ⚠️ Proof of Awesome is self-contained and does not connect to any real-world blockchain networks or
          cryptocurrencies.
        </Typography>
      </Box>

      {/* App Screenshots Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mb: 6, fontWeight: "bold" }}>
          Your Achievements, Verified & Recorded
        </Typography>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#111",
            borderRadius: 4,
            p: 2,
            display: "flex",
            justifyContent: "center",
            mb: 8,
          }}
        >
          <Box
            component="img"
            src="/app-screenshot.png"
            alt="App Screenshot"
            sx={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              borderRadius: 2,
            }}
          />
        </Paper>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#FFD700" }}>
                Create & Verify
              </Typography>
              <Typography>Share your real-world achievements and get them verified through AI analysis</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#00B4D8" }}>
                Join Themed Chains
              </Typography>
              <Typography>Fitness, creativity, learning, gaming - find chains that match your interests</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#4CAF50" }}>
                Build Your Record
              </Typography>
              <Typography>Watch your achievements become blocks in your personal blockchain</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#111", py: 4, textAlign: "center" }}>
        <Typography>© 2025 Proof of Awesome - A blockchain concept project</Typography>
      </Box>
    </Box>
  )
}
