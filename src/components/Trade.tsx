import View from "@/components/View"
import { Typography } from "@mui/material"
import { RocketLaunch } from "@mui/icons-material"
import { Button } from "@mui/material"

export default function Trade() {
  return (
    <View
      title="Trade"
      content={<div>Trade</div>}
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
            Trade
          </Typography>
        </Button>
      }
    />
  )
}
