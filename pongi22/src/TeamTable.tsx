import {
  Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from '@chakra-ui/react'

type Props = {
  teams: Team[],
  scores: Score[],
  disciplines: Discipline[]
}

const TeamTable = ({ teams, scores, disciplines }: Props) => {
  const headers = disciplines.map(({ id, name }: Discipline) => (
    <Th key={id}>
      {name}
    </Th>
  ))
  const getScore = (teamId: RecordId, disciplineId: RecordId) =>
    scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId)

  const rows = teams.map((team: Team, index) => {
    return (
      <Tr key={team.id}>
        <Td>#{index + 1}</Td>
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
            <Th>
              Sijoitus
            </Th>
            <Th>
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