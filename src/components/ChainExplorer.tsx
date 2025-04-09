import View from "@/components/View"
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Avatar } from "@mui/material"
import { PhoneIphone, ExpandMore } from "@mui/icons-material"
import { User } from "@/awesome/user"
import { useState, useEffect } from "react"
import { ChainBrief } from "@/awesome/api"

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
  const [chainBriefs, setChainBriefs] = useState<ChainBrief[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        const userChains = user.getChains()
        if (userChains.length > 0) {
          setChainBriefs(userChains)

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
          {chainBriefs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography color="text.secondary">No chains available</Typography>
            </Box>
          ) : (
            chainBriefs.map((brief) => (
              <Accordion key={brief.info.uuid}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", width: "95%" }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: getColorFromUUID(brief.info.uuid),
                      }}
                      src={brief.info.logoUrl}
                    >
                      {brief.info.name[0]}
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {brief.info.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {brief.stats.numBlocks} blocks
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {brief.info.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Rules
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {brief.info.rule || "No specific rules defined for this chain."}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Market Cap
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {brief.stats.marketCap} AC ({brief.stats.marketCap} tokens, {brief.stats.midPrice} AC / token)
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Latest block
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Height: {brief.head.latestBlockHeight}. Hash: {brief.head.latestBlockHash.slice(0, 24)}...
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
