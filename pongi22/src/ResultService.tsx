import { useFirebaseRecords } from './firebaseHooks'
import TeamTable from './TeamTable'


const ResultService = () => {
  const teams = useFirebaseRecords<Team>('team')
  const scores = useFirebaseRecords<Score>('score')
  const disciplines = useFirebaseRecords<Discipline>('discipline')
  return (
    <div id='games'>
      <TeamTable
        teams={teams}
        disciplines={disciplines}
        scores={scores}
      />
    </div>
  )
}

export default ResultService