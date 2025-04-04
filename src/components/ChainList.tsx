import { Avatar, Box, Typography } from "@mui/material"
import { ChainBrief, Membership } from "../awesome/api"

function getColorFromUUID(uuid: string): string {
  // Generate a hash from the UUID
  const hash = uuid.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Convert hash to HSL color with fixed saturation and lightness
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 45%)`
}

export default function ChainList({
  chains,
  memberships,
}: {
  chains: ChainBrief[]
  memberships: Record<string, Membership>
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {chains.map((chain) => (
        <Box
          key={chain.info.uuid}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            alignItems: "center",
            justifyContent: "space-between",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center" }}>
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {chain.info.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.2,
                }}
              >
                {chain.info.description?.split(/[,.!]/)[0] || ""}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {chain.stats.price} AC / token
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                width: 60,
              }}
            >
              <Typography variant="body2" color="white">
                {memberships[chain.info.uuid]?.tokens || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AC {((memberships[chain.info.uuid]?.tokens || 0) * chain.stats.price).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
