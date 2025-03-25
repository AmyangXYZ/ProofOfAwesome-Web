"use client"

import { Socket } from "@/awesome/api"
import { User } from "@/awesome/user"
import UserEntry from "@/awesome/UserEntry"
import Dashboard from "@/awesome/Dashboard"
import { CurrencyBitcoin, DashboardSharp, ExploreOutlined, Menu, Notifications, Person } from "@mui/icons-material"
import { Box, IconButton, Stack, Tab, Tabs } from "@mui/material"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Demo() {
  const [user, setUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false)
  const [tab, setTab] = useState<number>(0)

  useEffect(() => {
    console.log(isOnboarded)
  }, [isOnboarded])

  useEffect(() => {
    const socket = io("https://api.proof-of-awesome.app")
    setSocket(socket)
    socket.on("connect", () => {})
    socket.on("connect_error", () => {
      throw new Error("Failed to connect to WebSocket server")
    })

    return () => {
      socket.off("connect")
      socket.off("connect_error")
      socket.disconnect()
    }
  }, [])

  return (
    <Box>
      <Box
        sx={{
          height: "40px",
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
        <IconButton>
          <Menu />
        </IconButton>
        <Stack direction="row" spacing={0}>
          <IconButton>
            <Person />
          </IconButton>
          <IconButton>
            <Notifications sx={{ fontSize: "1.3rem" }} />
          </IconButton>
        </Stack>
      </Box>

      {socket && !isOnboarded && <UserEntry socket={socket} setUser={setUser} setIsOnboarded={setIsOnboarded} />}
      {socket && user && isOnboarded && (
        <>
          <Dashboard socket={socket} user={user} />
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              borderColor: "divider",
              zIndex: 1000,
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="fullWidth"
              sx={{
                height: "48px",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                backgroundColor: "black",
              }}
            >
              <Tab icon={<DashboardSharp />} sx={{ "&.Mui-selected": { color: "white" } }} />
              <Tab icon={<ExploreOutlined />} sx={{ "&.Mui-selected": { color: "white" } }} />
              <Tab icon={<CurrencyBitcoin />} sx={{ "&.Mui-selected": { color: "white" } }} />
            </Tabs>
          </Box>
        </>
      )}
    </Box>
  )
}
