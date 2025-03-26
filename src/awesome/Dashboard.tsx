import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Image from "next/image"
import { User } from "./user"
import { Achievement, AchievementVerificationResult, ChainBrief, Socket } from "./api"
import { useEffect, useState } from "react"
import View from "@/components/View"
import { AddPhotoAlternateOutlined, Close, Info, RocketLaunch } from "@mui/icons-material"

const prompt = `You are a validator for Proof of Awesome - a blockchain app rewarding real-world achievements with AwesomeCoin. Each chain has its own independent AwesomeCoin rewards that can only be used within that chain. You MUST verify that achievements match the chain's theme and purpose before awarding coins.

VALIDATION RULES:

1. Theme Validation:
   - Achievement MUST match the chain's theme as described in its description
   - Be inclusive of activities that reasonably fit the chain's purpose
   - Consider both direct and related activities within the theme
   - Reject only if achievement clearly doesn't fit the chain's theme

2. Evidence Validation:
   For text-only claims:
   - Accept simple, verifiable tasks with realistic details
   - Reject vague or extraordinary claims without evidence
   - Higher rewards for claims with:
     ▸ Specific time and duration
     ▸ Location context
     ▸ Social context (with whom)
     ▸ Activity context (what was happening)
     ▸ Weather or environmental conditions
     ▸ Personal context (how it felt, what was learned)
   - Base reward on plausibility and chain rules
    
   For image claims:
   - MUST describe what you see in the image that proves the claim
   - MUST mention if image is unclear or doesn't match claim
   - MUST verify authenticity and relevance to the claim
   - Higher rewards for images showing:
     ▸ Multiple angles or perspectives
     ▸ Before/after comparisons
     ▸ Context (location, time, people)
     ▸ Progress indicators
   - Reject (0 coins) if:
     ▸ Image contradicts or is irrelevant to claim
     ▸ Claim is extraordinary without clear evidence
     ▸ Image quality is too poor to verify
     ▸ Image appears doctored or manipulated
   - Reduce coins if image only partially proves the claim

3. Realism Check:
   - Reject claims that defy human capabilities
   - Reject claims that would be world records without proper verification
   - Reject claims that would be impossible in the given timeframe
   - Reject claims that would require superhuman abilities
   - Higher rewards for claims that:
     ▸ Show personal growth or learning
     ▸ Include social interaction or community impact
     ▸ Demonstrate consistency or habit formation
     ▸ Show effort or overcoming challenges`

export default function Dashboard({ socket, user }: { socket: Socket; user: User }) {
  const [chains, setChains] = useState<ChainBrief[]>([])
  const [achievementDescription, setAchievementDescription] = useState<string>("")
  const [selectedChain, setSelectedChain] = useState<string>("")
  const [achievementEvidence, setAchievementEvidence] = useState<string>("")
  const [achievementVerificationResult, setAchievementVerificationResult] =
    useState<AchievementVerificationResult | null>(null)
  const [waitingVerification, setWaitingVerification] = useState<boolean>(false)
  const [showPrompt, setShowPrompt] = useState<boolean>(false)
  const [totalBalance, setTotalBalance] = useState<number>(0)

  useEffect(() => {
    socket.on("public chains", (chains: ChainBrief[]) => {
      setChains(chains)
      setSelectedChain(chains[0].info.name)
    })
    socket.on("achievement verification result", (result: AchievementVerificationResult) => {
      setWaitingVerification(false)
      setAchievementVerificationResult(result)
      if (result.reward > 0) {
        const achievement = user.getAchievement(result.achievementSignature)
        if (achievement) {
          user.addAchievementVerificationResult(result)
          user.setBalance(achievement.chainUuid, (user.getBalance(achievement.chainUuid) ?? 0) + result.reward)
        }
      }
      setTotalBalance(user.totalBalance())
    })

    return () => {
      socket.off("achievement verification result")
    }
  }, [socket, user])

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setAchievementEvidence(base64)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error converting image:", error)
      alert("Failed to process image")
    }
  }

  const submitAchievement = () => {
    setWaitingVerification(true)
    const achievement: Achievement = {
      chainUuid: chains.find((chain) => chain.info.name === selectedChain)?.info.uuid ?? "",
      userAddress: user.deriveAddress(selectedChain),
      description: achievementDescription,
      evidenceImage: achievementEvidence,
      timestamp: Date.now(),
      signature: "",
    }
    achievement.signature = user.signAchievement(achievement)
    user.addAchievement(achievement)
    socket.emit("new achievement", achievement)
  }

  return (
    <View
      // title="Dashboard"
      content={
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
          <Stack direction="column" alignItems="start" width="90%" gap={1} sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "warning.main",
                }}
              >
                {totalBalance}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: "warning.main",
                  mb: 0.15,
                }}
              >
                AwesomeCoins
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                color="warning"
                sx={{
                  minWidth: "55px",
                  height: "26px",
                  borderRadius: 4,
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                SEND
              </Button>
              <Button
                variant="contained"
                size="small"
                color="warning"
                sx={{
                  minWidth: "55px",
                  height: "26px",
                  borderRadius: 4,
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                RECEIVE
              </Button>
            </Box>
          </Stack>

          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ textDecoration: "line-through", fontWeight: "bold" }}
          >
            🎉 I am thrilled to announce that I have 🏆
          </Typography>
          <TextField
            label="Achievement"
            value={achievementDescription}
            onChange={(e) => setAchievementDescription(e.target.value)}
            fullWidth
            multiline
            sx={{ width: "90%", borderRadius: 8 }}
          />

          <Box>
            {achievementEvidence ? (
              <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <Image
                  src={achievementEvidence}
                  alt="Evidence"
                  width={300}
                  height={120}
                  style={{
                    width: "80%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                  unoptimized
                />
                <IconButton
                  onClick={() => setAchievementEvidence("")}
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 10,
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => document.getElementById("evidence-input")?.click()}
                  endIcon={<AddPhotoAlternateOutlined sx={{ mb: 0.4 }} />}
                  sx={{ px: 1.5, py: 0.5 }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                    id="evidence-input"
                  />
                  Evidence
                </Button>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              <span style={{ position: "relative", top: "-1.5px" }}>@</span>Chain
            </Typography>
            <Select size="small" value={selectedChain} onChange={(e) => setSelectedChain(e.target.value)}>
              {chains.map((chain) => (
                <MenuItem key={chain.info.uuid} value={chain.info.name} sx={{ fontSize: "0.9rem" }}>
                  {chain.info.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Dialog
            onClose={() => setShowPrompt(false)}
            open={showPrompt}
            maxWidth="md"
            slotProps={{
              paper: {
                sx: {
                  width: "90%",
                  maxHeight: "70vh",
                  borderRadius: 4,
                },
              },
            }}
          >
            <DialogTitle
              sx={{
                py: 1,
                px: 2,
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "warning.main",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              AI Verification Prompt
              <IconButton size="small" color="warning" onClick={() => setShowPrompt(false)}>
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box
                component="pre"
                sx={{
                  pb: 1,
                  px: 2,
                  m: 0,
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                  overflowX: "auto",
                }}
              >
                {prompt}
              </Box>
            </DialogContent>
          </Dialog>
          {achievementVerificationResult && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "90%",
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="info" sx={{ fontWeight: "bold" }}>
                  AI verification result:
                </Typography>
                <IconButton size="small" color="info" onClick={() => setShowPrompt(true)}>
                  <Info fontSize="small" />
                </IconButton>
              </Stack>

              <Typography
                variant="body2"
                sx={{ fontWeight: "bold" }}
                color={achievementVerificationResult.reward > 0 ? "success" : "error"}
                textAlign="start"
              >
                {achievementVerificationResult.reward > 0 ? "✅ " : "❌ "}
                {achievementVerificationResult.message}
              </Typography>
            </Box>
          )}
        </Box>
      }
      footer={
        <Button
          variant="contained"
          onClick={submitAchievement}
          size="large"
          startIcon={!waitingVerification && <RocketLaunch />}
          disabled={waitingVerification}
          sx={{
            width: "90%",
            background: "white",
            borderRadius: 8,
          }}
        >
          {waitingVerification ? (
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, fontWeight: "bold" }}>
              <CircularProgress size={24} color="inherit" />
              Verifying by AI
            </Box>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Publish My Awesome
            </Typography>
          )}
        </Button>
      }
    />
  )
}
