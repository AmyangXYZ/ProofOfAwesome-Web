import { Box, Typography, Button, Stack, Container, Grid2 as Grid, Paper } from "@mui/material"
import { Psychology, Forum, Verified, CompareArrows } from "@mui/icons-material"

export default function Home() {
  return (
    <Box component="main" sx={{ bgcolor: "black", color: "white" }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 2, sm: 2 },
          padding: { xs: "1rem", sm: "2rem" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 2, md: 4 }}
          alignItems="center"
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          <Box
            component="img"
            src="/logo.svg"
            alt="Proof of Awesome"
            sx={{
              height: { xs: 80, sm: 130, md: 160 },
              width: { xs: 80, sm: 130, md: 160 },
              mb: { xs: 0, sm: 2 },
              zIndex: 2,
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            align="center"
            sx={{
              fontSize: { xs: "2rem", sm: "3.5rem", md: "4rem" },
              fontWeight: "bold",
              mb: { xs: 0, sm: 1 },
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
            mb: { xs: 3, sm: 4 },
            color: "orange",
            fontWeight: "medium",
            zIndex: 2,
            fontSize: { xs: "1.125rem", sm: "1.5rem", md: "1.75rem" },
            px: { xs: 2, sm: 0 },
          }}
        >
          Transform your real-world achievements into verifiable digital assets
        </Typography>

        <Container maxWidth="md" sx={{ zIndex: 2 }}>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Verified sx={{ color: "#4CAF50", fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } }} />
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" } }}>
                  Mine blocks through real-world achievements instead of computation
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Psychology sx={{ color: "#00B4D8", fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } }} />
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" } }}>
                  Academic-style AI consensus validates your accomplishments
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CompareArrows sx={{ color: "#FFD700", fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } }} />
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" } }}>
                  Trade achievement tokens in a stable, dynamic market
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Forum sx={{ color: "#FF9800", fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } }} />
                <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" } }}>
                  Join themed chains and build your achievement record
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            width: "100%",
            maxWidth: "400px",
            px: { xs: 2, sm: 0 },
          }}
        >
          <Button
            href="/demo"
            variant="contained"
            size="small"
            color="warning"
            fullWidth
            sx={{
              py: { xs: 0.75, sm: 1, md: 1.25 },
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              minHeight: 0,
            }}
            component="a"
          >
            Try Web Demo
          </Button>
          <Button
            href="/download"
            variant="outlined"
            size="small"
            color="warning"
            fullWidth
            sx={{
              py: { xs: 0.75, sm: 1, md: 1.25 },
              borderRadius: 2,
              borderWidth: 2,
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              minHeight: 0,
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
            mt: { xs: 2, sm: 3 },
            opacity: 0.7,
            maxWidth: "600px",
            px: { xs: 2, sm: 0 },
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          }}
        >
          ⚠️ Proof of Awesome is self-contained and does not connect to any real-world blockchain networks or
          cryptocurrencies.
        </Typography>
      </Box>

      {/* Achievement Mining Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          bgcolor: "#111",
          py: { xs: 4, sm: 6 },
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={3}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }, fontWeight: "bold" }}
                >
                  Exploring New Frontiers in Blockchain
                </Typography>
                <Typography sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, color: "gray.300" }}>
                  While traditional blockchain mining has revolutionized digital value exchange, we&apos;re exploring an
                  exciting new direction: using AI-powered validation to turn your real-world achievements into
                  blockchain assets. Transform your daily wins, fitness goals, and creative projects into meaningful
                  digital proof of accomplishment.
                </Typography>
                <Box
                  component="img"
                  src="/mining-comparison.png"
                  alt="Mining Comparison"
                  sx={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "auto",
                    borderRadius: 2,
                  }}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#000",
                    p: 3,
                    borderRadius: 4,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#4CAF50", fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" } }}
                    >
                      Computational Mining
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                      • Elegant mathematical foundations
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                      • Secure decentralized networks
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                      • Powers cryptocurrency innovation
                    </Typography>
                  </Stack>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#000",
                    p: 3,
                    borderRadius: 4,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#00B4D8", fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" } }}
                    >
                      Achievement Mining
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                      • Personal accomplishments as blocks
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                      • AI-powered validation system
                    </Typography>
                    <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                      • Social proof meets blockchain
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* AI Consensus Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: { xs: 4, sm: 6 },
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                component="img"
                src="/ai-review.png"
                alt="AI Review System"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={3}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }, fontWeight: "bold" }}
                >
                  Academic-Style Consensus
                </Typography>
                <Typography sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, color: "gray.300" }}>
                  Like academic paper reviews, achievements undergo thorough validation through multiple independent AI
                  reviewers and a meta-AI &quot;TPC Chair&quot;.
                </Typography>
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#111",
                      p: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#00B4D8", fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" } }}
                      >
                        Multi-AI Review Process
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Thematic relevance evaluation
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Evidence quality assessment
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Achievement difficulty analysis
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#111",
                      p: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#4CAF50", fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" } }}
                      >
                        Consensus Formation
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Meta-AI synthesis of reviews
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Community governance for complex cases
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Fraud prevention through multi-model approach
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Market System Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          bgcolor: "#111",
          py: { xs: 4, sm: 6 },
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={3}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }, fontWeight: "bold" }}
                >
                  Stable Yet Dynamic Market
                </Typography>
                <Typography sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, color: "gray.300" }}>
                  Experience real crypto trading mechanics with achievement-backed tokens. Our hybrid market system
                  combines stability with authentic price discovery.
                </Typography>
                <Stack spacing={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#000",
                      p: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#FFD700", fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" } }}
                      >
                        Price Discovery
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Order book mid price from actual trades
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Market maker reserve price as baseline
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Dynamic spread mechanism
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#000",
                      p: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#FF9800", fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" } }}
                      >
                        Trading Features
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Real-time order matching
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Portfolio tracking and analytics
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }}>
                        • Achievement token management
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                component="img"
                src="/trading.png"
                alt="Trading Interface"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#000", py: { xs: 2, sm: 3 }, textAlign: "center", px: 2 }}>
        <Typography sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "1rem" } }}>
          © 2025 Proof of Awesome - A blockchain concept project
        </Typography>
      </Box>
    </Box>
  )
}
