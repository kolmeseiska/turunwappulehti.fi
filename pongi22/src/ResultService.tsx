import { Outlet, useMatch } from '@tanstack/react-location'
import { useEffect, useState } from 'react'
import { onValue, push, ref, set } from "firebase/database"
import { database } from './db'
import { Button } from '@chakra-ui/react'
import TeamList from './TeamList'

const ResultService = () => {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    const teamRef = ref(database, 'teams')
    onValue(teamRef, (snapshot) => {
      const fbData: FirebaseTeamRecord = snapshot.val()
      if (!fbData) {
        return
      }
      const teamsData: Team[] = Object.entries(fbData)
        .reduce((acc, [id, teamDetails]) => {
          if (!id || !teamDetails) {
            return acc
          }
          return acc.concat({ id, name: teamDetails.name, score: teamDetails.score })
        }, [] as Team[])
      setTeams(teamsData)
    })
  }, [])

  const createTeam = () => {
    const postListRef = ref(database, 'teams')
    const newTeamRef = push(postListRef)
    set(newTeamRef, {
      name: 'Turku',
      score: 10
    })
  }
  return (
    <>
      <h1>ResultService</h1>
      <TeamList teams={teams} />
      <Button onClick={createTeam}>
        Create team
      </Button>
    </>
  )
}

export default ResultService