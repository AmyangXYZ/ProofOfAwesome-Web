import { useRef, useEffect, useState } from "react"
import { validateMnemonic, generateMnemonic } from "bip39"
import {
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  Stack,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment,
} from "@mui/material"
import {
  ContentCopy,
  Key,
  PersonAdd,
  Login,
  CheckCircle,
  Refresh,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"
import { User } from "@/awesome/user"
import { Socket, ChainBrief, Membership, UserInfo } from "@/awesome/api"

export default function UserEntry({ socket, setUser }: { socket: Socket; setUser: (user: User | null) => void }) {
  const [mode, setMode] = useState<"new" | "existing">("new")
  const [generatedMnemonic, setGeneratedMnemonic] = useState("")
  const [inputMnemonic, setInputMnemonic] = useState("")
  const [username, setUsername] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mnemonicCopied, setMnemonicCopied] = useState(false)

  const userRef = useRef<User | null>(null)

  useEffect(() => {
    socket.on("register success", () => {
      setUser(userRef.current)
      userRef.current = null

      resetForm()
      socket.emit("get public chains")
    })

    socket.on(
      "sign in success",
      ({ memberships, chainBriefs }: { memberships: Membership[]; chainBriefs: ChainBrief[] }) => {
        for (const chainBrief of chainBriefs) {
          userRef.current!.joinChain(chainBrief)
        }

        for (const membership of memberships) {
          userRef.current!.setBalance(membership.chainUuid, membership.balance)
        }

        setUser(userRef.current)
        userRef.current = null
        resetForm()
      }
    )

    socket.on("sign in error", (error: string) => {
      setError(error)
      userRef.current = null
    })

    return () => {
      socket.off("register success")
      socket.off("sign in success")
      socket.off("sign in error")
    }
  }, [socket, setUser])

  useEffect(() => {
    if (inputMnemonic.length > 0) {
      if (!validateMnemonic(inputMnemonic)) {
        setError("Invalid mnemonic")
      } else {
        setError(null)
      }
    }
  }, [inputMnemonic])

  const resetForm = () => {
    setUsername("")
    setPassphrase("")
    setGeneratedMnemonic("")
    setInputMnemonic("")
    setError(null)
  }

  const handleSubmit = () => {
    if (mode === "new") {
      if (!username || !passphrase || !generatedMnemonic) {
        setError("Please fill in all fields")
        return
      }
      const user = new User(username, generatedMnemonic, passphrase)
      userRef.current = user
      socket.emit("register", {
        name: user.name,
        publicKey: user.publicKey,
      } satisfies UserInfo)
    } else {
      if (!username || !inputMnemonic) {
        setError("Please fill in all fields")
        return
      }
      const user = new User(username, inputMnemonic, "")
      userRef.current = user
      socket.emit("sign in", {
        name: user.name,
        publicKey: user.publicKey,
      } satisfies UserInfo)
    }
  }

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(generatedMnemonic)
    setMnemonicCopied(true)
    setTimeout(() => setMnemonicCopied(false), 1000)
  }

  return (
    <Box
      sx={{
        width: { xs: "80%", sm: "720px", md: "960px" },
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 0 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          height: "480px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          p: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 500, mb: 3 }}>
            User Authentication
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, newMode) => {
              if (newMode !== null) {
                setMode(newMode)
                resetForm()
              }
            }}
            sx={{
              width: "100%",
              mb: 4,
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "0.95rem",
                py: 1,
              },
            }}
          >
            <ToggleButton value="new" sx={{ flex: 1 }}>
              New User
            </ToggleButton>
            <ToggleButton value="existing" sx={{ flex: 1 }}>
              Existing User
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            <TextField
              size="small"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />

            <TextField
              size="small"
              label="Passphrase (optional)"
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassphrase(!showPassphrase)} edge="end" size="small">
                        {showPassphrase ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />

            {mode === "new" ? (
              <>
                {generatedMnemonic.length > 0 ? (
                  <>
                    <Box sx={{ height: 0 }} />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Stack direction="row" alignItems="center">
                        <Box sx={{ display: "flex", gap: 1, flex: 1, justifyContent: "space-between" }}>
                          {generatedMnemonic
                            .split(" ")
                            .slice(0, 4)
                            .map((word, i) => (
                              <Chip
                                key={i}
                                label={word}
                                size="small"
                                sx={{
                                  width: "70px",
                                }}
                              />
                            ))}
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <Box sx={{ display: "flex", gap: 1, flex: 1, justifyContent: "space-between" }}>
                          {generatedMnemonic
                            .split(" ")
                            .slice(4, 8)
                            .map((word, i) => (
                              <Chip
                                key={i + 4}
                                label={word}
                                size="small"
                                sx={{
                                  width: "70px",
                                }}
                              />
                            ))}
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <Box sx={{ display: "flex", gap: 1, flex: 1, justifyContent: "space-between" }}>
                          {generatedMnemonic
                            .split(" ")
                            .slice(8, 12)
                            .map((word, i) => (
                              <Chip
                                key={i + 8}
                                label={word}
                                size="small"
                                sx={{
                                  width: "70px",
                                }}
                              />
                            ))}
                        </Box>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <IconButton
                        onClick={() => setGeneratedMnemonic(generateMnemonic())}
                        sx={{
                          bgcolor: "action.hover",
                          "&:hover": {
                            bgcolor: "action.selected",
                          },
                        }}
                      >
                        <Refresh sx={{ fontSize: "20px" }} />
                      </IconButton>
                      {!mnemonicCopied ? (
                        <IconButton
                          onClick={handleCopyMnemonic}
                          sx={{
                            bgcolor: "action.hover",
                            "&:hover": {
                              bgcolor: "action.selected",
                            },
                          }}
                        >
                          <ContentCopy sx={{ fontSize: "18px" }} />
                        </IconButton>
                      ) : (
                        <Tooltip title="Mnemonic copied" open={mnemonicCopied}>
                          <IconButton
                            sx={{
                              bgcolor: "action.hover",
                              "&:hover": {
                                bgcolor: "action.selected",
                              },
                            }}
                          >
                            <CheckCircle sx={{ fontSize: "18px" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setGeneratedMnemonic(generateMnemonic())}
                    startIcon={<Key />}
                    fullWidth
                    sx={{
                      borderRadius: 1.5,
                      py: 1,
                      textTransform: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    Generate Mnemonic
                  </Button>
                )}
              </>
            ) : (
              <TextField
                error={error !== null}
                helperText={error || " "}
                multiline
                size="small"
                label="Enter your mnemonic phrase (12 words)"
                value={inputMnemonic}
                onChange={(e) => setInputMnemonic(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            )}
          </Stack>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !username ||
              (mode === "new" && (!passphrase || !generatedMnemonic)) ||
              (mode === "existing" && (!inputMnemonic || error !== null))
            }
            startIcon={mode === "new" ? <PersonAdd /> : <Login />}
            fullWidth
            sx={{
              borderRadius: 1.5,
              py: 1,
              textTransform: "none",
              fontSize: "0.95rem",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {mode === "new" ? "Register" : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
