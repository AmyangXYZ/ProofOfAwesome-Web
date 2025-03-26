import { Avatar, Box, Typography } from "@mui/material"
import { ChainBrief } from "../awesome/api"

function getColorFromUUID(uuid: string): string {
  // Generate a hash from the UUID
  const hash = uuid.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Convert hash to HSL color with fixed saturation and lightness
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 45%)`
}

export default function ChainList({ chains, balances }: { chains: ChainBrief[]; balances: Record<string, number> }) {
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
          <Box
            sx={{
              bgcolor: "warning.main",
              borderRadius: 1,
              minWidth: 52,
              py: 0.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="black" sx={{ fontSize: "0.8rem" }}>
              {balances[chain.info.uuid] || 0}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
