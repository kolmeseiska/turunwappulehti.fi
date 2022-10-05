type TeamKey = string
type Team = {
  id: TeamKey,
  name: string,
  score: number
}
type FirebaseTeamRecord = Record<TeamKey, Omit<Team, 'id'>>
