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

export default function UserEntry({
  socket,
  setUser,
  setIsOnboarded,
}: {
  socket: Socket
  setUser: (user: User | null) => void
  setIsOnboarded: (isOnboarded: boolean) => void
}) {
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
      setIsOnboarded(true)
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
        setIsOnboarded(true)
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
  }, [socket, setUser, setIsOnboarded])

  useEffect(() => {
    if (inputMnemonic.length > 0) {
      if (!validateMnemonic(inputMnemonic)) {
        setError("Invalid mnemonic")
      } else {
        setError(null)
      }
    }
  }, [inputMnemonic])

  useEffect(() => {
    if (passphrase.length > 0) {
      setGeneratedMnemonic(generateMnemonic())
    }
  }, [passphrase])

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
        width: { xs: "100%", sm: "400px", md: "600px" },
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 50,
        left: {
          xs: 0,
          sm: "calc(50% - 200px)",
          md: "calc(50% - 300px)",
        },
        right: { xs: 0, sm: "auto" },
        bottom: 0,
      }}
    >
      <Box
        sx={{
          px: { xs: 3, sm: 4 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Content Header */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 8 }}>
          <Typography variant="h5" sx={{ color: "rgba(255, 255, 255, 0.95)" }}>
            Join the Network
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={3} sx={{ flex: 1 }}>
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
                "& .MuiToggleButton-root": {
                  border: "none",
                  py: 1,

                  color: "rgba(255, 255, 255, 0.87)",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 255, 255, 0.15)",
                    color: "rgba(0, 255, 255, 0.9)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 255, 255, 0.25)",
                    },
                  },
                  "&:hover": {
                    color: "rgba(0, 255, 255, 0.9)",
                  },
                },
              }}
            >
              <ToggleButton value="new" sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  New User
                </Typography>
              </ToggleButton>
              <ToggleButton value="existing" sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Existing User
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              size="small"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
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
            />

            {mode === "new" ? (
              <>
                {generatedMnemonic.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {[0, 4, 8].map((start) => (
                        <Stack key={start} direction="row" spacing={1}>
                          {generatedMnemonic
                            .split(" ")
                            .slice(start, start + 4)
                            .map((word, i) => (
                              <Chip key={i + start} label={word} size="small" sx={{ flex: 1 }} />
                            ))}
                        </Stack>
                      ))}
                    </Box>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton onClick={() => setGeneratedMnemonic(generateMnemonic())}>
                        <Refresh />
                      </IconButton>
                      {!mnemonicCopied ? (
                        <IconButton onClick={handleCopyMnemonic}>
                          <ContentCopy sx={{ fontSize: "1.15rem" }} />
                        </IconButton>
                      ) : (
                        <Tooltip title="Mnemonic copied" open={mnemonicCopied}>
                          <IconButton>
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Key />}
                    onClick={() => setGeneratedMnemonic(generateMnemonic())}
                    fullWidth
                    sx={{ textTransform: "none" }}
                  >
                    <Typography variant="body1">Generate Mnemonic</Typography>
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
              />
            )}
          </Stack>
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Box
        sx={{
          py: 3,
          display: "flex",
          position: "fixed",
          bottom: 0,
          left: { xs: 0, sm: "auto", md: "calc(50% - 300px)" },
          right: 0,
          width: { xs: "100%", sm: "400px", md: "600px" },
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !username ||
            (mode === "new" && generatedMnemonic.length === 0) ||
            (mode === "existing" && (!inputMnemonic || error !== null))
          }
          startIcon={mode === "new" ? <PersonAdd /> : <Login />}
          sx={{
            py: 1.5,

            width: "80%",
          }}
        >
          {mode === "new" ? "Register" : "Sign In"}
        </Button>
      </Box>
    </Box>
  )
}
