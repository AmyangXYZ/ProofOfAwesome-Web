import { Avatar, Box, Typography } from "@mui/material"
import { ChainInfo, Membership } from "../awesome/api"

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
  chains: ChainInfo[]
  memberships: Record<string, Membership>
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {chains.map((chain) => (
        <Box
          key={chain.uuid}
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
                bgcolor: getColorFromUUID(chain.uuid),
              }}
              src={chain.logoUrl}
            >
              {chain.name[0]}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {chain.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.2,
                }}
              >
                {chain.description?.split(/[,.!]/)[0] || ""}
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
              {memberships[chain.uuid]?.balance || 0}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
