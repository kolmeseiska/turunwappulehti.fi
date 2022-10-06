
// Espoo (vihreä)
// Joensuu (Beige)
// Jyväskylä (vaaleanpunainen)
// Kuopio (Ruskea)
// Lahti (harmaa)
// Lappeenranta (violetti)
// Mikkeli (oranssi)
// Oulu (sateenkari)
// Pori (punamusta)
// Rauma (keltainen)
// Rovaniemi (valkoinen)
// Seinäjoki (sinivalkoinen)
// Tampere (punainen)
// Turku (sininen)
// Vaasa (Turkoosi)



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
  // TODO: add colors
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
