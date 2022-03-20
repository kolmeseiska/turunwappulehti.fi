var apiUrl = 'https://92zu8pndu0.execute-api.eu-north-1.amazonaws.com/default/wappulehti-append-joke'

var formEl = document.getElementById('joke-form')
var submitButton = document.getElementById('submit-button')
var loadingAnimation = document.getElementById('loading-animation')

function validate () {
  submitButton.disabled = formEl[0].value === '' || formEl[1].value === '' || formEl[2].value === '' || formEl[3].value === ''
}

// document.getElementById('name-field').addEventListener('keyup', validate)
// document.getElementById('email-field').addEventListener('keyup', validate)
// document.getElementById('joke-field').addEventListener('keyup', validate)
// document.getElementById('fuksi-field').addEventListener('keyup', validate)

if(formEl) {
  formEl.addEventListener('submit', function(event) {
    event.preventDefault()

    submitButton.disabled = false
    loadingAnimation.className = 'loading'

    var body = {
      joke: formEl[0].value,
      email: formEl[1].value,
      guild: formEl[2].value,
      isFuksi: formEl[3].value
    }

    fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then((res, err) => {
        if(err) console.log(err)
        return res.json()
      })
      .then(data => {
        loadingAnimation.className = 'loading hidden'

        formEl[0].value = formEl[1].value = formEl[2].value = ''
        formElem[3].checked = false

        
        if(data.statusCode !== 200) {
          alert('Jotain meni nyt mönkään')
        }
      })
  })
}
