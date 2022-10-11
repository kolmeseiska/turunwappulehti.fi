import { Spinner } from '@chakra-ui/react'
import { useFirebaseRecords } from './firebaseHooks'
import TeamTable from './TeamTable'


const ResultService = () => {
  const teams = useFirebaseRecords<Team>('team')
  const scores = useFirebaseRecords<Score>('score')
  const disciplines = useFirebaseRecords<Discipline>('discipline')

  const isLoading = !teams.length || !disciplines.length
  return (
    <div id='games'>
      {isLoading
        ? <Spinner />
        : (
          <TeamTable
            teams={teams}
            disciplines={disciplines}
            scores={scores}
          />
        )}
    </div>
  )
}

export default ResultService