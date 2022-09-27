
const enroll = document.getElementById('enroll-text')
const enrollStartAt = new Date('2022-09-30T12:00').toISOString()
const now = new Date().toISOString()
if(now < enrollStartAt) {
  enroll.innerHTML = 'Ilmoittautuminen aukeaa 30.9. klo 12.00'
}