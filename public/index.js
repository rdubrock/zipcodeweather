class ZipCode extends React.Component {
  constructor() {
    super()

    this.initialState = {
      inputValue: '',
      zipCode: null,
      data: null,
      error: null
    }

    this.state = this.initialState
  }

  handleInputChange(e) {
    let value = e.target.value
    if(value.length <=5) {
      this.setState({inputValue: value})
    }
  }

  resetState() {
    this.setState(this.initialState)
  }

  handleSubmit() {
    let zipCode = this.state.inputValue

    if(zipCode.length < 5) {
      this.setState({error: '5 digits are required'})
      return
    }

    this.resetState()

    fetch(`/getTimeAndWeather?zipCode=${zipCode}`)
    .then((response) => {
      if(response.status < 400) {
        return response.json()
      } else {
        response.text().then((error) => {
          console.log(error)
        })
        throw new Error('There was a problem getting your data')
      }
    })
    .then((json) => {
      if(json) {
        this.setState({data: json})
      }
    })
    .catch((error) => {
      this.setState({error: error.message || error})
    })
  }

  render() {
    const {
      data,
      error
    } = this.state

    return (
      <div>
        <h1>Zip Code Time and Weather</h1>
        <input 
          type='number' 
          onChange={this.handleInputChange.bind(this)}
          value={this.state.inputValue}
        />
        <button
          onClick={this.handleSubmit.bind(this)}
        >
          Submit
        </button>
        { error ?
          <h3>{error}</h3>
        : null}
        { data ?
          <p>{`Zip code ${data.zipCode} is located in ${data.city}, at an elevation of ${data.elevation} feet. The time zone is ${data.timeZone}. It is currently ${data.temp} degrees.`}</p>
        : null}
      </div>
    )
  }
}

ReactDOM.render(
  <ZipCode />,
  document.getElementById('root')
);
