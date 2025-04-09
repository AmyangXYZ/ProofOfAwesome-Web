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
import { Achievement, Review, Block, ChainHead, Membership, Socket, ChainBrief } from "../awesome/api"
import { useEffect, useRef, useState } from "react"
import View from "@/components/View"
import { AddPhotoAlternateOutlined, Close, Info, KeyboardArrowRight, RocketLaunch } from "@mui/icons-material"
import ChainList from "./ChainList"
import { sha256 } from "js-sha256"

const prompt = `You are a reviewer for Proof of Awesome - a blockchain app rewarding real-world achievements with tokens. Each chain has its own independent tokens that can only be used within that chain. You MUST verify that achievements match the chain's theme and purpose before awarding tokens.   
    
CRITICAL: Language Rules
- If claim is in English -> You MUST respond in English ONLY
- If claim is in Chinese (中文) -> You MUST respond in Chinese ONLY
- NO OTHER LANGUAGES ARE ALLOWED
- NEVER mix languages

CRITICAL: Response Consistency Rules
- If you reject a claim, you MUST set coin to 0
- If you award tokens, you MUST NOT use words like "rejected" or "0 tokens" in reasoning
- The token value MUST match the reasoning message
- NEVER award tokens for rejected claims
- NEVER reject claims while awarding tokens

REVIEW RULES:
1. Theme Validation:
    - Achievement MUST match the chain's theme as described in its description
    - Be inclusive of activities that reasonably fit the chain's purpose
    - Consider both direct and related activities within the theme
    - Reject only if achievement clearly doesn't fit the chain's theme

2. Evidence Validation:
    For text-only claims:
    - Accept simple, verifiable tasks with realistic details (e.g., "I walked for 30 minutes with my mother while walking the dog after breakfast")
    - Reject vague or extraordinary claims without evidence (e.g., "I ran 10km in 10 minutes")
    - Higher rewards for claims with:
      * Specific time and duration
      * Location context
      * Social context (with whom)
      * Activity context (what was happening)
      * Weather or environmental conditions
      * Personal context (how it felt, what was learned)
    - Base reward on plausibility and chain rules
    
    For image claims:
    - MUST describe what you see in the image that proves the claim
    - MUST mention if image is unclear or doesn't match claim
    - MUST verify authenticity and relevance to the claim
    - Higher rewards for images showing:
      * Multiple angles or perspectives
      * Before/after comparisons
      * Context (location, time, people)
      * Progress indicators (e.g., fitness app screenshots)
    - Reject (0 tokens) if:
      * Image contradicts or is irrelevant to claim
      * Claim is extraordinary without clear evidence
      * Image quality is too poor to verify
      * Image appears doctored or manipulated
    - Reduce tokens if image only partially proves the claim

3. Realism Check:
    - Reject claims that defy human capabilities
    - Reject claims that would be world records without proper verification
    - Reject claims that would be impossible in the given timeframe
    - Reject claims that would require superhuman abilities
    - Higher rewards for claims that:
      * Show personal growth or learning
      * Include social interaction or community impact
      * Demonstrate consistency or habit formation
      * Show effort or overcoming challenges

RESPONSE FORMAT:
Return a JSON object:
{
  "reward": number,
  "comment": "Concise explanation in matching language (English/Chinese only) in three sentences. MUST include:
                1. For image claims: What you see in the image that proves/disproves the claim
                2. Reward context (e.g. '5 out of 10 tokens', 'halved to 5 tokens', etc)
                3. For rejected claims: Clear explanation of why the claim was rejected
                4. For high-reward claims: Explanation of what details made it more credible"
}

REWARD CALCULATION:
- Fixed reward: "awarded X tokens"
- Range reward: "X out of Y tokens"
- Doubling: "X tokens (doubled from Y)"
- Halving: "X tokens (halved from Y)"
- Progressive: "X tokens (progressed from Y)"
- Rejection: "0 tokens (rejected due to [reason])"
- Bonus: "+X tokens for detailed context`

const reviewScores = {
  1: "Reject",
  2: "Weak Reject",
  3: "Weak Accept",
  4: "Accept",
  5: "Strong Accept",
} as const

export default function Dashboard({ socket, user }: { socket: Socket; user: User }) {
  const topRef = useRef<HTMLDivElement>(null)
  const [chains, setChains] = useState<ChainBrief[]>([])
  const [achievementDescription, setAchievementDescription] = useState<string>("")
  const achievementInputRef = useRef<HTMLInputElement>(null)
  const [selectedChain, setSelectedChain] = useState<string>("")
  const [achievementEvidence, setAchievementEvidence] = useState<string>("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [achievmentAccepted, setAchievmentAccepted] = useState<boolean>(false)
  const [waitingVerification, setWaitingVerification] = useState<boolean>(false)
  const [showPrompt, setShowPrompt] = useState<boolean>(false)
  const [netWorth, setNetWorth] = useState<number>(0)
  const [memberships, setMemberships] = useState<Record<string, Membership>>({})
  const [blocks, setBlocks] = useState<Block[]>([])
  const currentBlockRef = useRef<Block | null>(null)

  useEffect(() => {
    socket.on("chain briefs", (chainBriefs: ChainBrief[]) => {
      if (chainBriefs.length > 0) {
        setSelectedChain(chainBriefs[0].info.name)
        setChains(chainBriefs)
        for (const brief of chainBriefs) {
          user.setChainBrief(brief)
          socket.emit("join chain", brief.info.uuid, user.deriveAddress(brief.info.uuid))
          socket.emit("get blocks", brief.info.uuid, brief.head.latestBlockHeight - 3, brief.head.latestBlockHeight)
        }
      }
    })
    socket.on("chain brief", (chainBrief: ChainBrief) => {
      user.setChain(chainBrief.info)
      setChains(user.getChains())
    })

    socket.on("chain head", (chainHead: ChainHead) => {
      user.setChainHead(chainHead)
      socket.emit("get blocks", chainHead.chainUuid, 0, chainHead.latestBlockHeight)
    })

    socket.on("blocks", (blocks: Block[]) => {
      for (const block of blocks) {
        user.addBlock(block)
      }
    })

    socket.on("achievement reviews", (reviews: Review[]) => {
      setWaitingVerification(false)
      setReviews(reviews)
      console.log("reviews", reviews)
      user.addReviews(reviews)
      if (!reviews.length) {
        return
      }
      const averageScore = reviews.reduce((acc, review) => acc + review.reward, 0) / reviews.length
      if (averageScore > 0) {
        setAchievmentAccepted(true)
        const achievement = user.getAchievement(reviews[0].achievement)
        if (achievement) {
          const block = user.createBlock(achievement.chainUuid, achievement)
          if (block) {
            currentBlockRef.current = block
            socket.emit("new block", block)
          }
        }
      }
    })

    socket.on("block", (block: Block) => {
      user.addBlock(block)
    })

    socket.on("membership", (membership: Membership) => {
      user.setMembership(membership)
      setMemberships((prev) => ({ ...prev, [membership.chainUuid]: membership }))
      setNetWorth(user.netWorth)
    })

    socket.on("new block accepted", () => {
      if (currentBlockRef.current) {
        user.addBlock(currentBlockRef.current)
        setBlocks(user.getBlocks(currentBlockRef.current.chainUuid, 4))
        currentBlockRef.current = null
      }
    })

    socket.on("error", (message: string) => {
      console.error("error", message)
    })

    return () => {
      socket.off("achievement reviews")
      socket.off("chain briefs")
      socket.off("chain brief")
      socket.off("chain head")
      socket.off("blocks")
      socket.off("new block accepted")
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
    setReviews([])
    setWaitingVerification(true)
    setBlocks([])
    const chainUuid = chains.find((chain) => chain.info.name === selectedChain)?.info.uuid ?? ""
    const achievement: Achievement = {
      chainUuid,
      creatorPublicKey: user.publicKey,
      creatorAddress: user.deriveAddress(chainUuid),
      description: achievementDescription,
      evidenceImage: achievementEvidence,
      timestamp: Date.now(),
      signature: "",
    }
    achievement.signature = sha256(
      achievement.chainUuid +
        achievement.creatorPublicKey +
        achievement.creatorAddress +
        achievement.description +
        achievement.evidenceImage +
        achievement.timestamp.toString()
    )
    user.addAchievement(achievement)
    socket.emit("new achievement", achievement)
  }

  return (
    <View
      // title="Dashboard"
      content={
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Box
            ref={topRef}
            sx={{ display: "flex", flexDirection: "column", alignItems: "start", gap: 1, width: "100%" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "warning.main",
                mb: -1,
              }}
            >
              AwesomeCoins
            </Typography>
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
                {netWorth.toFixed(2)}
              </Typography>
            </Box>
            {/* <Box sx={{ display: "flex", gap: 1 }}>
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
                BUY
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
                SELL
              </Button>
            </Box> */}
          </Box>

          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ mt: 1, mb: 1, textDecoration: "line-through", fontWeight: "bold" }}
          >
            🎉 I am thrilled to announce that I have 🏆
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: 100,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              mb: achievementEvidence ? 2 : 0,
              bgcolor: "background.paper",
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={10}
              value={achievementDescription}
              onChange={(e) => setAchievementDescription(e.target.value)}
              placeholder="Ran 2km; cooked dinner; 5 win streak..."
              variant="standard"
              sx={{
                "& .MuiInputBase-root": {
                  px: 2,
                  py: 1.5,
                  pb: 5,
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.9375rem", // Slightly smaller font
                  lineHeight: 1.5,
                  color: "#E0E0E0", // Lighter text color
                },
                "& .MuiInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 6px",
                bgcolor: "background.paper",
              }}
            >
              <IconButton
                onClick={() => document.getElementById("evidence-input")?.click()}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <AddPhotoAlternateOutlined fontSize="small" />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                  id="evidence-input"
                />
              </IconButton>

              <Stack
                direction="row"
                // spacing={0.5}
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  padding: "2px 4px",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#E0E0E0", mb: 0.35 }}>
                  @
                </Typography>
                <Select
                  size="small"
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  sx={{
                    "& .MuiSelect-select": {
                      padding: "0px 4px",
                      fontSize: "0.875rem",
                      color: "#E0E0E0",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      // Dropdown icon
                      fontSize: 16,
                      color: "#E0E0E0",
                    },
                  }}
                >
                  {chains.map((chain) => (
                    <MenuItem key={chain.info.uuid} value={chain.info.name} sx={{ fontSize: "0.875rem" }}>
                      {chain.info.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Box>
          </Box>

          {achievementEvidence && (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                height: 80,
                overflow: "hidden",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Image
                src={achievementEvidence}
                alt="Evidence"
                width={300}
                height={80}
                style={{
                  width: "auto",
                  height: "100%",
                  objectFit: "contain",
                }}
                unoptimized
              />
              <IconButton
                onClick={() => setAchievementEvidence("")}
                size="small"
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}

          <Dialog
            onClose={() => setShowPrompt(false)}
            open={showPrompt}
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
              AI Review Prompt
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

          {reviews.length > 0 && (
            <>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                <Typography variant="subtitle1" color="warning.main" sx={{ fontWeight: "bold" }}>
                  AI Reviews Result:{" "}
                  {
                    reviewScores[
                      (reviews
                        .map((r) => r.score)
                        .sort(
                          (a, b) =>
                            reviews.filter((r) => r.score === b).length - reviews.filter((r) => r.score === a).length
                        )[0] || 3) as keyof typeof reviewScores
                    ]
                  }
                </Typography>
                <IconButton size="small" color="info" onClick={() => setShowPrompt(true)}>
                  <Info fontSize="small" />
                </IconButton>
              </Stack>
              {reviews.map((review, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" color="info" sx={{ fontWeight: "bold" }}>
                      🤖 Reviewer #{index + 1}: {review.reviewerAddress}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                    }}
                    color={review.reward > 0 ? "success" : "error"}
                    textAlign="start"
                  >
                    [{reviewScores[review.score as keyof typeof reviewScores]}] {review.comment}
                  </Typography>
                </Box>
              ))}
            </>
          )}

          {achievmentAccepted && (
            <>
              {/* block append animation */}
              {blocks.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                  }}
                >
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
                      opacity: 0,
                      animation: "appear 0.5s ease-in-out forwards",
                      animationDelay: `1s`,
                      "@keyframes appear": {
                        from: {
                          opacity: 0,
                        },
                        to: {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {blocks.map((block, index) => (
                      <Box
                        key={index}
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
                            width: 18,
                            height: 1.5,
                            bgcolor: "grey.500",
                            ...(index === blocks.length - 1 && {
                              visibility: "hidden",
                              animation: "slideIn 0.5s ease-out 1s forwards",
                              animationDelay: `${1.5}s`,
                              "@keyframes slideIn": {
                                "0%": {
                                  visibility: "hidden",
                                  opacity: 0,
                                  transform: "translateX(20px) scale(0.95)",
                                },
                                "20%": {
                                  visibility: "visible",
                                  opacity: 0.5,
                                },
                                "100%": {
                                  visibility: "visible",
                                  opacity: 1,
                                  transform: "translateX(0) scale(1)",
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
                              animation: "slideIn 0.5s ease-out 1s forwards",
                              animationDelay: `${2}s`,
                              "@keyframes slideIn": {
                                "0%": {
                                  visibility: "hidden",
                                  opacity: 0,
                                  transform: "translateX(20px) scale(0.95)",
                                },
                                "20%": {
                                  visibility: "visible",
                                  opacity: 0.5,
                                },
                                "100%": {
                                  visibility: "visible",
                                  opacity: 1,
                                  transform: "translateX(0) scale(1)",
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 4,
                      mb: -4,
                      opacity: 0,
                      animation: blocks.length > 0 ? "fadeIn 0.5s ease-in forwards" : "none",
                      animationDelay: `${3}s`,
                      "@keyframes fadeIn": {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="warning"
                      sx={{ fontWeight: "bold" }}
                      onClick={() => {
                        // Clear states first
                        setAchievementDescription("")
                        setAchievementEvidence("")
                        setReviews([])
                        setBlocks([])

                        setTimeout(() => {
                          const element = topRef.current
                          if (element) {
                            // Add padding to account for fixed header
                            element.style.scrollMarginTop = "40px"
                            element.scrollIntoView({ behavior: "smooth" })
                          }

                          setTimeout(() => {
                            achievementInputRef.current?.focus()
                          }, 500)
                        }, 50)
                      }}
                    >
                      Have something even cooler?
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}

          <Box sx={{ mt: 10, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                My Chains <KeyboardArrowRight fontSize="small" sx={{ color: "text.secondary" }} />
              </Typography>
            </Box>
            <ChainList chains={chains} memberships={memberships} />
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
              <CircularProgress size={20} color="inherit" />
              AI Reviewing...
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
