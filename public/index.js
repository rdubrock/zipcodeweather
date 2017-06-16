class ZipCode extends React.Component {
  constructor() {
    super()

    this.initialState = {
      inputValue: '',
      zipCode: null,
      city: null,
      temp: null,
      timeZone: null,
      elevation: null,
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
        throw new Error('There was a problem getting your data')
      }
    })
    .then((json) => {
      this.setState(json)
    })
    .catch((error) => {
      this.setState({error: error.message || error})
    })
  }

  render() {
    const {
      zipCode,
      city,
      temp,
      timeZone,
      elevation,
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
      </div>
    )
  }
}

ReactDOM.render(
  <ZipCode />,
  document.getElementById('root')
);
