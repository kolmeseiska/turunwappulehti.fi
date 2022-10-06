import { Button } from '@chakra-ui/react'
import { push, ref, set } from "firebase/database"
import { database } from './db'
import TeamTable from './TeamTable'
import { useFirebaseRecords } from './firebaseHooks'


const ResultService = () => {
  const teams = useFirebaseRecords<Team>('team')
  const scores = useFirebaseRecords<Score>('score')
  const disciplines = useFirebaseRecords<Discipline>('discipline')
  return (
    <TeamTable
      teams={teams}
      disciplines={disciplines}
      scores={scores}
    />
  )
}

export default ResultService