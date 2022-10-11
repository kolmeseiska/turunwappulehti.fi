import {
  Box,
  HStack,
  Spinner,
  Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from '@chakra-ui/react'
import { calculateTotalScore } from './helpers'
import Rank from './Rank'
import TeamColors from './TeamColors'
import useScrollHint from './useScrollHint'

type Props = {
  teams: Team[],
  scores: Score[],
  disciplines: Discipline[]
}

const CELL_PADDING_X = 3
const CELL_PADDING_Y = 3

const TeamTable = ({ teams, scores, disciplines }: Props) => {
  const visibleDisciplines = disciplines.filter(({ id }) =>
    scores.some(({ disciplineId, value }) => disciplineId === id && Number.isFinite(value))
  )
  const headers = visibleDisciplines.map(({ id, name }) => (
    <Th key={id} paddingX={CELL_PADDING_X} paddingY={CELL_PADDING_Y} width='14ch'>
      {name}
    </Th>
  ))
  const getScore = (teamId: RecordId, disciplineId: RecordId) =>
    scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId)

  const isGamesStarted = !!scores.some(({ value }) => value != null)

  const sortedTeams: Team[] = teams.sort((a: Team, b: Team) => {
    const rankA = calculateTotalScore(a.id, scores)
    const rankB = calculateTotalScore(b.id, scores)
    return rankB - rankA
  })

  useScrollHint(headers.length ? '#teamTable' : null)

  const rows = sortedTeams.map((team: Team, index) => {
    return (
      <Tr key={team.id}>
        <Td
          paddingX={CELL_PADDING_X}
          paddingY={CELL_PADDING_Y}
        >
          {isGamesStarted
            ? <Rank rank={index + 1} />
            : '#'
          }
        </Td>
        <Td
          paddingX={CELL_PADDING_X}
          paddingY={CELL_PADDING_Y}
          style={{
            position: 'sticky',
            background: '#252525',
            left: 0
          }}
        >
          <HStack>
            <TeamColors colors={team.colors} />
            <Box>
              {team.name}
            </Box>
          </HStack>
        </Td>
        {visibleDisciplines.map(discipline => {
          const score = getScore(team.id, discipline.id)
          return (
            <Td key={score?.id || `${team.id}-${discipline.id}`}>
              {score?.value ?? '-'}
            </Td>
          )
        }
        )}
        <Td paddingX={CELL_PADDING_X} paddingY={CELL_PADDING_Y} isNumeric>
          {calculateTotalScore(team.id, scores)}
        </Td>
      </Tr>
    )
  })

  return (
    <TableContainer id='teamTable' overflowX='auto'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th paddingX={CELL_PADDING_X} paddingY={CELL_PADDING_Y} width='8ch'>
              Sijoitus
            </Th>
            <Th paddingX={CELL_PADDING_X} paddingY={CELL_PADDING_Y} width='12ch' 
          style={{
            position: 'sticky',
            background: '#252525',
            left: 0
          }}>
              Joukkue
            </Th>
            {headers}
            <Th paddingX={CELL_PADDING_X} paddingY={CELL_PADDING_Y} isNumeric>
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