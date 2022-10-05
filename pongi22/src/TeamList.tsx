import { List, ListIcon, ListItem } from '@chakra-ui/react'
import React from 'react'

type Props = {
  teams: Team[]
}

const TeamList = ({ teams }: Props) => {
  return (
    <List spacing={3}>
      {teams.map(team => (
        <ListItem key={team.id}>
          {team.name} - {team.score}
        </ListItem>
      ))}
    </List>
  )
}

export default TeamList