import { Spinner } from '@chakra-ui/react'
import { results } from './fixedResults2022'
import TeamTable from './TeamTable'


const ResultService = () => {
  const {
    teams,
    scores,
    disciplines,
  } = results



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