class InsufficientFunds extends Error {
  constructor (message) {
    super(message)
    this.name = 'InsufficientFunds'
  }
}

module.exports = InsufficientFunds
