import View from "@/components/View"
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Avatar } from "@mui/material"
import { PhoneIphone, ExpandMore } from "@mui/icons-material"
import { User } from "@/awesome/user"
import { useState, useEffect } from "react"
import { ChainHead, ChainInfo } from "@/awesome/api"

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
  const [chainInfos, setChainInfos] = useState<ChainInfo[]>([])
  const [chainHeads, setChainHeads] = useState<ChainHead[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        const userChains = user.getChains()
        if (userChains.length > 0) {
          setChainInfos(userChains)
          setChainHeads(userChains.map((chain) => user.getChainHead(chain.uuid)))

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
          {chainInfos.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography color="text.secondary">No chains available</Typography>
            </Box>
          ) : (
            chainInfos.map((chain) => (
              <Accordion key={chain.uuid}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", width: "95%" }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: getColorFromUUID(chain.uuid),
                      }}
                      src={chain.logoUrl}
                    >
                      {chain.name[0]}
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {chain.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {chainHeads.find((head) => head.chainUuid === chain.uuid)?.numberOfBlocks} blocks
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {chainHeads.find((head) => head.chainUuid === chain.uuid)?.numberOfUsers} members
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
                      {chain.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                      Rules
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chain.rule || "No specific rules defined for this chain."}
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
