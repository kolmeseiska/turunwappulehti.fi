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

  const calculateTotalScore = (teamId: RecordId) => scores.filter(score => score.teamId === teamId).reduce((acc, score: Score) => acc + Number(score.value), 0)
  const sortedTeams: Team[] = teams.sort((a: Team, b: Team) => {
    const rankA = calculateTotalScore(a.id)
    const rankB = calculateTotalScore(b.id)
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
        <Td paddingX={CELL_PADDING} isNumeric>
          {calculateTotalScore(team.id)}
        </Td>
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
            <Th paddingX={CELL_PADDING}>
              Pisteet
            </Th>
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