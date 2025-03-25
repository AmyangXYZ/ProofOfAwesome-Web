import { Button, Typography } from "@mui/material"
import { User } from "./user"
import { ChainBrief, Socket } from "./api"
import { useEffect, useState } from "react"
import View from "@/components/View"
import { PersonAdd } from "@mui/icons-material"

export default function Dashboard({ socket, user }: { socket: Socket; user: User }) {
  const [chains, setChains] = useState<ChainBrief[]>([])
  useEffect(() => {
    console.log(user)
    socket.on("public chains", (chains: ChainBrief[]) => {
      setChains(chains)
    })
    return () => {
      socket.off("public chains")
    }
  }, [socket, user])

  return (
    <View
      title="Dashboard"
      content={<Typography>chains: {JSON.stringify(chains)}</Typography>}
      footer={
        <Button
          variant="contained"
          onClick={() => {}}
          size="large"
          startIcon={<PersonAdd />}
          sx={{
            width: "90%",
            background: "white",
            borderRadius: 8,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Create Chain
          </Typography>
        </Button>
      }
    />
  )
}
