"use client"

import { Socket } from "@/awesome/api"
import { User } from "@/awesome/user"
import UserEntry from "@/awesome/UserEntry"
import { Menu } from "@mui/icons-material"
import { Box, IconButton, Link } from "@mui/material"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Demo() {
  const [user, setUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false)
  const [socketError, setSocketError] = useState<string | null>(null)

  useEffect(() => {
    const socket = io("https://api.proof-of-awesome.app")
    setSocket(socket)
    socket.on("connect", () => {
      setSocketError(null)
    })
    socket.on("connect_error", () => {
      setSocketError("Failed to connect to WebSocket server")
    })

    socket.on("chain created", () => {})
    socket.on("transaction", () => {})
    socket.on("block", () => {})

    return () => {
      socket.off("connect")
      socket.off("connect_error")
      socket.off("chain created")
      socket.off("transaction")
      socket.off("block")
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <Box>
      <Box
        sx={{
          height: "40px",
          bgcolor: "background.paper",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          px: 2,
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1000,
        }}
      >
        <Link href="/">
          <Box component="img" src="/logo.png" alt="Proof of Awesome" sx={{ height: 32, mt: 0.8 }} />
        </Link>
        <IconButton>
          <Menu />
        </IconButton>
      </Box>
      {socketError && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="error">
            {socketError}
          </Typography>
        </Box>
      )}
      {socket &&
        (!isOnboarded ? (
          <UserEntry socket={socket} setUser={setUser} setIsOnboarded={setIsOnboarded} />
        ) : (
          <Box>
            <Typography variant="h6">Chain created</Typography>
          </Box>
        ))}
    </Box>
  )
}
