import {
  Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from '@chakra-ui/react'
import Rank from './Rank'

type Props = {
  teams: Team[],
  scores: Score[],
  disciplines: Discipline[]
}

const CELL_PADDING = 5

const TeamTable = ({ teams, scores, disciplines }: Props) => {
  const headers = disciplines.map(({ id, name }: Discipline) => (
    <Th key={id} paddingX={CELL_PADDING}>
      {name}
    </Th>
  ))
  const getScore = (teamId: RecordId, disciplineId: RecordId) =>
    scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId)

  const isGamesStarted = !!scores.some(({ value }) => value != null)
  const sortedTeams: Team[] = teams.sort((a: Team, b: Team) => {
    const rankA = scores.filter(({ teamId }) => teamId === a.id).reduce((acc, score: Score) => acc + Number(score.value), 0)
    const rankB = scores.filter(({ teamId }) => teamId === b.id).reduce((acc, score: Score) => acc + Number(score.value), 0)
    return rankB - rankA
  })

  const rows = sortedTeams.map((team: Team, index) => {
    return (
      <Tr key={team.id}>
        <Td
          paddingX={CELL_PADDING}>
          {isGamesStarted
            ? <Rank rank={index + 1} />
            : '#'
          }
        </Td>
        <Td>{team.name}</Td>
        {disciplines.map(discipline => {
          const score = getScore(team.id, discipline.id)
          return (
            <Td key={score?.id || `${team.id}-${discipline.id}`}>
              {score?.value ?? '-'}
            </Td>
          )
        }
        )}
      </Tr>
    )
  })
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th paddingX={CELL_PADDING} maxWidth={'12ch'}>
              Sijoitus
            </Th>
            <Th paddingX={CELL_PADDING}>
              Joukkue
            </Th>
            {headers}
          </Tr>
        </Thead>
        <Tbody>
          {rows}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TeamTable