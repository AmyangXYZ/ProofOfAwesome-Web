"use client"

import { Socket } from "@/awesome/api"
import { User } from "@/awesome/user"
import UserEntry from "@/components/UserEntry"
import Dashboard from "@/components/Dashboard"
import Market from "@/components/Market"
import { DashboardSharp, ExploreOutlined, GitHub, Notifications, Person, Storefront } from "@mui/icons-material"
import { Box, IconButton, Link, Stack, Tab, Tabs } from "@mui/material"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import ChainExplorer from "@/components/ChainExplorer"

export default function Demo() {
  const [user, setUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<"dashboard" | "chainExplorer" | "market">("dashboard")

  useEffect(() => {
    const socket = io("https://api.proof-of-awesome.app")
    // const socket = io("http://localhost:3000")
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
        <Link href="https://github.com/AmyangXYZ/ProofOfAwesome-Web">
          <IconButton>
            <GitHub />
          </IconButton>
        </Link>

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
        <Box>
          <Box sx={{ position: "relative", minHeight: "100vh" }}>
            <Box
              sx={{
                position: "absolute",
                opacity: currentView === "dashboard" ? 1 : 0,
                pointerEvents: currentView === "dashboard" ? "auto" : "none",
              }}
            >
              <Dashboard socket={socket} user={user} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                opacity: currentView === "chainExplorer" ? 1 : 0,
                pointerEvents: currentView === "chainExplorer" ? "auto" : "none",
              }}
            >
              <ChainExplorer user={user} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                opacity: currentView === "market" ? 1 : 0,
                pointerEvents: currentView === "market" ? "auto" : "none",
              }}
            >
              <Market />
            </Box>
          </Box>
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
              value={currentView}
              onChange={(_, newView) => setCurrentView(newView)}
              variant="fullWidth"
              sx={{
                height: "48px",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                backgroundColor: "black",
              }}
            >
              <Tab value="dashboard" icon={<DashboardSharp />} sx={{ "&.Mui-selected": { color: "white" } }} />
              <Tab value="chainExplorer" icon={<ExploreOutlined />} sx={{ "&.Mui-selected": { color: "white" } }} />
              <Tab value="market" icon={<Storefront />} sx={{ "&.Mui-selected": { color: "white" } }} />
            </Tabs>
          </Box>
        </Box>
      )}
    </Box>
  )
}
