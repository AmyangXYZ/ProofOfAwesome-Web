import View from "@/components/View"
import { Typography, Box } from "@mui/material"
import { PhoneIphone } from "@mui/icons-material"

export default function Market() {
  return (
    <View
      title="Market"
      content={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            textAlign: "center",
            gap: 2,
          }}
        >
          <PhoneIphone sx={{ fontSize: 48, color: "grey.500" }} />
          <Typography variant="h6" color="text.primary">
            Market Available on iOS App
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is a web demo showcasing the core features of AwesomeChain. Download our iOS app to access the full
            trading experience!
          </Typography>
        </Box>
      }
    />
  )
}
