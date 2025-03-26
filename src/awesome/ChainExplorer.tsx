import View from "@/components/View"
import { Typography } from "@mui/material"
import { RocketLaunch } from "@mui/icons-material"
import { Button } from "@mui/material"

export default function ChainExplorer() {
  return (
    <View
      title="Chain Explorer"
      content={<div>ChainExplorer</div>}
      footer={
        <Button
          variant="contained"
          onClick={() => {}}
          size="large"
          startIcon={<RocketLaunch />}
          disabled={false}
          sx={{
            width: "90%",
            background: "white",
            borderRadius: 8,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Join Chain
          </Typography>
        </Button>
      }
    />
  )
}
