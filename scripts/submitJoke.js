var apiUrl = 'https://92zu8pndu0.execute-api.eu-north-1.amazonaws.com/default/wappulehti-append-joke'

var formElement = document.getElementById('joke-form')
var submitButton = document.getElementById('submit-button')
var errorNotification = document.getElementById('errors')
var errorMessages = document.getElementById('error-messages')
var loadingAnimation = document.getElementById('loading-animation')

function validate () {
  const jokeField = formElement[0]
  submitButton.disabled = jokeField.value?.trim() === ''
}

document.getElementById('joke').addEventListener('keyup', validate)

if(formElement) {
  formElement.addEventListener('submit', function(event) {
    event.preventDefault()

    submitButton.disabled = true
    clearErrors()
    const loadingTimeout = setTimeout(() => {
      submitButton.innerHTML = 'Lähetetään...'
    }, 600)

    var body = {
      joke: formElement[0].value,
      email: formElement[1].value,
      guild: formElement[2].value || 'Muu',
      isFuksi: formElement[3].checked
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
        if(loadingTimeout) {
          clearInterval(loadingTimeout)
        }
        if(res.status !== 200 && res.status !== 400) {
          alert('Pahoittelut! Jotain meni pieleen')
          if(err) {
            console.log(err)
          }
        }
        return res.json()
      })
      .then(data => {       
        if(data.errors) {
          console.warn(data)
          submitButton.disabled = false
          return displayErrors(data.errors)
        }
        formElement[0].value = formElement[1].value = formElement[2].value = ''
        formElement[3].checked = false
        submitButton.innerHTML = 'Lähetetty - Pistä toinen'
        submitButton.disabled = true
      })
  })
}

const clearErrors = () => {
  errorNotification.className = 'error hidden'
  while(errorMessages.firstChild) {
    errorMessages.firstChild.remove()
  }
}

const displayErrors = errors => {
  errorNotification.className = 'error'
  const errorArray = Array.isArray(errors)
    ? errors
    : [error]
  errorArray.forEach(error => {
    const element = document.createElement('div')
    element.innerHTML = error
    errorMessages.append(element)
  })
}
