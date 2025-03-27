import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Image from "next/image"
import { User } from "../awesome/user"
import {
  Achievement,
  AchievementVerificationResult,
  Block,
  ChainBrief,
  ChainDetail,
  Membership,
  Socket,
} from "../awesome/api"
import { useEffect, useRef, useState } from "react"
import View from "@/components/View"
import { AddPhotoAlternateOutlined, Close, Info, KeyboardArrowRight, RocketLaunch } from "@mui/icons-material"
import ChainList from "./ChainList"

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
  const verificationResultRef = useRef<HTMLDivElement>(null)
  const [waitingVerification, setWaitingVerification] = useState<boolean>(false)
  const [showPrompt, setShowPrompt] = useState<boolean>(false)
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [blocks, setBlocks] = useState<Block[]>([])

  useEffect(() => {
    socket.on("public chains", (chains: ChainBrief[]) => {
      setSelectedChain(chains[0].info.name)
      // todo: join chain
      for (const chain of chains) {
        console.log("join chain", chain.info.uuid)
        socket.emit("join chain", chain.info.uuid)
      }
    })

    socket.on("join chain success", (chainDetail: ChainDetail) => {
      user.joinChain(chainDetail)
      setBalances((prev) => ({ ...prev, [chainDetail.info.uuid]: 0 }))
      setChains((prev) => [...prev, chainDetail])
    })

    socket.on("achievement verification result", (result: AchievementVerificationResult) => {
      setWaitingVerification(false)
      setAchievementVerificationResult(result)
      if (result.reward > 0) {
        const achievement = user.getAchievement(result.achievementSignature)
        if (achievement) {
          user.addAchievementVerificationResult(result)
          if (result.reward > 0) {
            const block = user.createBlock(achievement.chainUuid, result.achievementSignature)
            if (block) {
              socket.emit("new block", block)
            }
          }
        }
      }
    })

    socket.on("new block created", (block: Block) => {
      user.addBlock(block)
      const chain = user.getChain(block.chainUuid)
      if (chain) {
        const sortedBlocks = chain.recentBlocks.sort((a, b) => a.timestamp - b.timestamp)
        setBlocks(sortedBlocks.slice(-4))
      }
    })

    socket.on("membership update", (membership: Membership) => {
      user.setBalance(membership.chainUuid, membership.balance)
      setBalances((prev) => ({ ...prev, [membership.chainUuid]: membership.balance }))
      setTotalBalance(user.totalBalance)
    })

    socket.on("error", (message: string) => {
      console.error("error", message)
    })

    return () => {
      socket.off("achievement verification result")
      socket.off("join chain success")
      socket.off("public chains")
      socket.off("new block created")
      socket.off("membership update")
      socket.off("error")
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

    try {
      // Create an image element
      const img = document.createElement("img")
      const imageUrl = URL.createObjectURL(file)

      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Calculate new dimensions (max 1200px width/height)
        let width = img.width
        let height = img.height
        const maxSize = 1200

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          } else {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        // Set canvas size and draw image
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with reduced quality
        const base64 = canvas.toDataURL("image/jpeg", 0.8)
        setAchievementEvidence(base64)

        // Cleanup
        URL.revokeObjectURL(imageUrl)
      }

      img.src = imageUrl
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Failed to process image")
    }
  }

  const submitAchievement = () => {
    setAchievementVerificationResult(null)
    setWaitingVerification(true)
    setBlocks([])
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

  useEffect(() => {
    if (achievementVerificationResult && verificationResultRef.current) {
      verificationResultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [achievementVerificationResult])

  return (
    <View
      // title="Dashboard"
      content={
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", gap: 1, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                gap: 1,
                alignItems: "end",
              }}
            >
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
                  minWidth: "50px",
                  py: 0.25,
                  borderRadius: 4,
                  fontSize: "0.72rem",
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
                  minWidth: "50px",
                  py: 0.25,
                  borderRadius: 4,
                  fontSize: "0.72rem",
                  fontWeight: "bold",
                }}
              >
                RECEIVE
              </Button>
            </Box>
          </Box>

          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ mt: 1, textDecoration: "line-through", fontWeight: "bold" }}
          >
            🎉 I am thrilled to announce that I have 🏆
          </Typography>
          <TextField
            label="Achievement"
            value={achievementDescription}
            onChange={(e) => setAchievementDescription(e.target.value)}
            fullWidth
            multiline
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
                    maxHeight: "120px",
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
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
                  maxHeight: "90dvh",
                  borderRadius: 4,
                },
                elevation: 16,
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

          <Box
            ref={verificationResultRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              gap: 1,
            }}
          >
            {achievementVerificationResult && (
              <>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1" color="info" sx={{ fontWeight: "bold" }}>
                    🤖 AI verification result:
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

                {/* block append animation */}
                {blocks.length > 0 && (
                  <>
                    <Typography variant="subtitle1" color="warning.main" sx={{ fontWeight: "bold" }}>
                      🧊 New block #{blocks[blocks.length - 1].height} added to the chain!
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "start",
                        width: "100%",
                        ml: 1,
                      }}
                    >
                      {blocks.map((block, index) => (
                        <Box
                          key={block.hash}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0,
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: block.height > 0 ? "block" : "none",
                              width: 18,
                              height: 1.5,
                              bgcolor: "grey.500",
                              ...(index === blocks.length - 1 && {
                                animation: "slideIn 1s ease-out",
                                "@keyframes slideIn": {
                                  from: {
                                    opacity: 0,
                                    transform: "translateX(20px)",
                                  },
                                  to: {
                                    opacity: 1,
                                    transform: "translateX(0)",
                                  },
                                },
                              }),
                            }}
                          />
                          <Paper
                            elevation={0}
                            sx={{
                              width: 56,
                              py: 0.5,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: index === blocks.length - 1 ? "1px solid gold" : "1px solid gray",
                              ...(index === blocks.length - 1 && {
                                visibility: "hidden",
                                animation: "showAndSlide 1s ease-out 1s forwards",
                                "@keyframes showAndSlide": {
                                  from: {
                                    visibility: "hidden",
                                    transform: "translateX(20px)",
                                  },
                                  to: {
                                    visibility: "visible",
                                    transform: "translateX(0)",
                                  },
                                },
                              }),
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: index === blocks.length - 1 ? "warning.main" : "white",
                              }}
                            >
                              #{block.height}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          <Box sx={{ mt: 10, width: "100%" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", mb: 1 }}>
              My Chains <KeyboardArrowRight fontSize="small" sx={{ color: "text.secondary" }} />
            </Typography>
            <ChainList chains={chains} balances={balances} />
          </Box>
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
