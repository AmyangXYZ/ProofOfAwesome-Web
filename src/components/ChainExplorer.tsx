import View from "@/components/View"
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Avatar } from "@mui/material"
import { PhoneIphone, ExpandMore } from "@mui/icons-material"
import { ChainDetail } from "@/awesome/api"
import { User } from "@/awesome/user"
import { useState, useEffect } from "react"

function getColorFromUUID(uuid: string): string {
  // Generate a hash from the UUID
  const hash = uuid.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Convert hash to HSL color with fixed saturation and lightness
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 45%)`
}

export default function ChainExplorer({ user }: { user: User | null }) {
  const [chains, setChains] = useState<ChainDetail[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        const userChains = user.getChains()
        if (userChains.length > 0) {
          setChains(userChains.sort((a, b) => b.stats.numberOfBlocks - a.stats.numberOfBlocks))
          clearInterval(interval)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [user])

  return (
    <View
      title="Chain Explorer"
      content={
        <Box sx={{ p: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {chains.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography color="text.secondary">No chains available</Typography>
            </Box>
          ) : (
            chains.map((chain) => (
              <Accordion key={chain.info.uuid}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", width: "95%" }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: getColorFromUUID(chain.info.uuid),
                      }}
                      src={chain.info.logoUrl}
                    >
                      {chain.info.name[0]}
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {chain.info.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {chain.stats.numberOfBlocks} blocks
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {chain.stats.numberOfUsers} members
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {chain.info.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                      Rules
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chain.info.rule || "No specific rules defined for this chain."}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                      Latest Block
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Height: {chain.recentBlocks[0].height}, Hash: {chain.recentBlocks[0].hash.slice(0, 16)}...
                      <br />
                      Achievement: {chain.recentBlocks[0].achievement?.description}
                      <br />
                      Creator: {chain.recentBlocks[0].achievement?.userName} [
                      {chain.recentBlocks[0].achievement?.userPublicKey.slice(0, 8)}...]
                      <br />
                      Date: {new Date(chain.recentBlocks[0].timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              p: 3,
              textAlign: "center",
              gap: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <PhoneIphone sx={{ fontSize: 40 }} />
            <Typography variant="body1" color="text.secondary">
              Want to discover more chains or create your own? Download our iOS app to access the full AwesomeChain
              experience!
            </Typography>
          </Box>
        </Box>
      }
    />
  )
}
