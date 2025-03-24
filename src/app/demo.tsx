"use client"

import { Socket } from "@/awesome/api"
import { User } from "@/awesome/user"
import UserEntry from "@/awesome/UserEntry"
import { Box } from "@mui/material"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Demo() {
  const [user, setUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      {socketError && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="error">
            {socketError}
          </Typography>
        </Box>
      )}
      {socket && <UserEntry socket={socket} setUser={setUser} />}
    </Box>
  )
}
