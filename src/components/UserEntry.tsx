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
import View from "@/components/View"

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
          userRef.current!.addMembership(chainBrief, memberships.find((m) => m.chainUuid === chainBrief.info.uuid)!)
        }

        for (const membership of memberships) {
          userRef.current!.setBalance(membership.chainUuid, membership.balance)
        }

        setUser(userRef.current)
        userRef.current = null
        resetForm()
        setIsOnboarded(true)
        socket.emit("get public chains")
      }
    )

    socket.on("sign in error", (error: string) => {
      setError(error)
      userRef.current = null
      setIsOnboarded(false)
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
      const user = new User(username, generatedMnemonic, passphrase)
      if (!user.createWallet()) {
        setError("Invalid mnemonic")
        return
      }
      userRef.current = user
      socket.emit("register", {
        publicKey: user.publicKey,
      } satisfies UserInfo)
    } else {
      const user = new User(username, inputMnemonic, "")
      if (!user.createWallet()) {
        setError("Invalid mnemonic")
        return
      }
      userRef.current = user
      socket.emit("sign in", {
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
    <View
      title="Join the Awesome Network"
      content={
        <Box>
          <Typography
            variant="subtitle2"
            color="warning"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 3, px: 7 }}
          >
            Turn your real-world awesome into AI-verified blockchain proof
          </Typography>
          <Stack spacing={1.5} sx={{ flex: 1 }}>
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
                  borderRadius: 1.5,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 255, 255, 0.15)",
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(0, 255, 255, 0.25)",
                    },
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
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                    <Typography variant="caption" sx={{ textAlign: "center", color: "text.secondary", px: 6 }}>
                      Write down your mnemonic phrase and store it in a safe place. This is the only way to access and
                      recover your account.
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Key />}
                    onClick={() => setGeneratedMnemonic(generateMnemonic())}
                    color="warning"
                    sx={{ borderRadius: 8, alignSelf: "center" }}
                  >
                    <Typography variant="subtitle2">Generate Mnemonic</Typography>
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
      }
      footer={
        <Button
          variant="contained"
          onClick={handleSubmit}
          size="large"
          disabled={
            !username ||
            (mode === "new" && generatedMnemonic.length === 0) ||
            (mode === "existing" && (!inputMnemonic || error !== null))
          }
          startIcon={mode === "new" ? <PersonAdd /> : <Login />}
          sx={{
            width: "90%",
            background: "white",
            borderRadius: 8,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {mode === "new" ? "Register" : "Sign In"}
          </Typography>
        </Button>
      }
    />
  )
}
