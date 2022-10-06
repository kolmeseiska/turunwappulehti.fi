import React, { useEffect } from 'react'
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table as ChTable,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable
} from '@tanstack/react-table'
import { useFirebaseRecords, useMutateFirebaseRecord } from '../firebaseHooks'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (scoreData: Score | null, id?: RecordId) => void
  }
}
const scoreColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const score = getValue() as { scoreId: RecordId, value: number }
    const [value, setValue] = React.useState<number | null>(score?.value ?? null)
    const onBlur = () => {
      const scoreData: Score = {
        id: score.scoreId,
        disciplineId: id,
        teamId: row.original.teamId,
        value: value == null ? null : Number(value)
      }
      table.options.meta?.updateData(scoreData, score.scoreId)
    }
    React.useEffect(() => {
      setValue(score?.value)
    }, [score?.value])

    return (
      <NumberInput
        value={value ?? ''}
        onChange={(__string, valueAsNumber) => Number.isFinite(valueAsNumber) ? setValue(valueAsNumber) : setValue(null)}
        onBlur={onBlur}
        min={0}
        max={20}
        maxW={20}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )
  },
}

const createRecordHandler = (value: string, setValue: Function, mutateRecord: Function) => {
  if (value.length) {
    try {
      mutateRecord({ name: value })
      setValue('')
    } catch (error) {
      console.error(`Something went wrong with creating ${value}`)
      console.error(error)
    }
  }
}
function AdminTable() {
  const teams = useFirebaseRecords<Team>('team')
  const scores = useFirebaseRecords<Score>('score')
  const disciplines = useFirebaseRecords<Discipline>('discipline')

  const data = React.useMemo(() => {
    const getScore = (teamId: RecordId, disciplineId: RecordId): Score | null =>
      scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId) || null
    return teams.map(team => {
      return {
        teamId: team.id,
        teamName: team.name,
        ...disciplines.reduce((acc, discipline) => {
          const score = getScore(team.id, discipline.id)
          return {
            ...acc,
            [discipline.id]: {
              scoreId: score?.id || null,
              value: score?.value || null
            }
          }
        }, {})
      }
    })
  }, [teams, disciplines, scores])

  const headers = React.useMemo<ColumnDef<any>[]>(() =>
    disciplines.map(discipline => ({
      header: discipline.name,
      accessorKey: discipline.id,
      cell: scoreColumn.cell
    })), [disciplines])

  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      header: '#',
      cell: ({ row }) => `#${row.index + 1}`,
    },
    {
      header: 'Joukkue',
      accessorKey: 'teamName',
    },
    ...headers
  ], [headers])


  const [newTeam, setNewTeam] = React.useState('')
  const [newDiscipline, setNewDiscipline] = React.useState('')

  const mutateTeam = useMutateFirebaseRecord<Team>('team')
  const mutateDiscipline = useMutateFirebaseRecord<Discipline>('discipline')
  const mutateScore = useMutateFirebaseRecord<Score>('score')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: mutateScore,
    },
    debugTable: true,
  })


  const onClickCreateTeam = () => createRecordHandler(newTeam, setNewTeam, mutateTeam)
  const onClickCreateDiscipline = () => createRecordHandler(newDiscipline, setNewDiscipline, mutateDiscipline)
  return (
    <div className="p-2">
      <TableContainer className="h-2" overflowX>
        <ChTable variant='striped' colorScheme='gray' size='sm'>
          <Thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      paddingX={3}
                      style={{
                        width: header.getSize()
                      }}
                    >
                      {
                        header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )
                      }
                    </Th>
                  )
                })}
                <Th>
                  <InputGroup>
                    <Input
                      value={newDiscipline as string}
                      onChange={e => setNewDiscipline(e.target.value)}
                      placeholder='Laji'
                      minWidth={40}
                    />
                    <InputRightElement>
                      <IconButton
                        size='sm'
                        aria-label='Lisää laji'
                        icon={<AddIcon />}
                        disabled={!newDiscipline.length}
                        onClick={onClickCreateDiscipline}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Th>
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row: any) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell: any) => {
                    return (
                      <Td
                        key={cell.id}
                        paddingX={3}
                        style={{
                          width: cell.column.getSize()
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    )
                  })}
                  <Td />
                </Tr>
              )
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td>
                <InputGroup>
                  <Input
                    value={newTeam as string}
                    onChange={e => setNewTeam(e.target.value)}
                    placeholder='Joukkueen nimi'
                  />
                  <InputRightElement>
                    <IconButton
                      size='sm'
                      aria-label='Lisää joukkue'
                      icon={<AddIcon />}
                      disabled={!newTeam.length}
                      onClick={onClickCreateTeam}
                    />
                  </InputRightElement>
                </InputGroup>
              </Td>
            </Tr>
          </Tfoot>
        </ChTable>
      </TableContainer>
    </div >
  )
}

export default AdminTable