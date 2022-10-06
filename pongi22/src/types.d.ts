
enum FbEndpoints {
  TEAM = 'team',
  DISCIPLINE = 'discipline',
  SCORE = 'score',
}
type FbEndpoint = `${FbEndpoints}`


type RecordId = string
type Team = {
  id: RecordId,
  name: string
}

type Discipline = {
  id: RecordId,
  name: string
}

type Score = {
  id: RecordId,
  teamId: RecordId,
  disciplineId: RecordId,
  value: number | null
}
