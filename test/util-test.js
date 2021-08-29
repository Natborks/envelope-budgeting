const assert = require('assert')

const {getAllEnvelopes, addEnvelope, clearAllEnvelopes, updateEnvelope, transferFunds}= require('../util/util')

describe('util', () => {
    let envelope1 = {}
    let envelope2 = {}

    beforeEach(() => {
        envelope1 = {
            name : "fees",
            amount : 2000
        }

        envelope2 = {
            name : "food",
            amount : 300
        }

        clearAllEnvelopes()

    })

    describe('getAllEnvelopes', () => {

        it('returns empty array if envelope collection is empty', () => {
            const expectedResult = []

            const actualResult = getAllEnvelopes()

            assert.deepEqual(expectedResult, actualResult)
        })

        it('returns all envelopes in envelope collections', () => {
            const expectedEnvelopes = [envelope1, envelope2]
             addEnvelope(envelope1)
             addEnvelope(envelope2)

            const actualEnvelopes = getAllEnvelopes()

            assert.deepEqual(actualEnvelopes, expectedEnvelopes)
        })

    })

    describe('addEnvelope', () => {

        it('adds and envelope to envelope collection', () => {
            const expectedResult = [envelope2]

            addEnvelope(envelope2)
            const actualResult = getAllEnvelopes()

            assert.deepEqual(actualResult, expectedResult)
        } )
    })


    describe('updateEnvelope', () => {
        it('updates envelope with given amount', () => {

            const expectedResult = {name : "food", amount : 500}


            addEnvelope(envelope2)

            const actualResult = updateEnvelope("food", 200)

            assert.deepEqual(actualResult, expectedResult)

        })

        it('returns undefined if envelope is not found', () => {
            const expectedResult = undefined

            addEnvelope(envelope2)

            const actualResult = updateEnvelope("foody", 200)

            assert.deepEqual(actualResult, expectedResult)

        })
    })

    describe('tranferFunds', () => {
        it('transfers funds from one envelope to another', () => {
            const expectedResult = [{name : "fees", amount : 1700}, {name : "food", amount : 600}]

            source = "fees"
            destination = "food"
            amount = 300

            addEnvelope(envelope1)
            addEnvelope(envelope2)

            transferFunds(source, destination, amount)

            const actualResult = getAllEnvelopes()

            assert.deepEqual(actualResult, expectedResult)
        })

        it('does not transer funds if source envelope amount is less amount', () => {
            const expectedResult = [{name : "fees", amount : 200}, {name : "food", amount : 300}]
            source = "food"
            destination = "fees"
            amount = 301
            addEnvelope(envelope1)
            addEnvelope(envelope2)

            assert.throws(() => {
                transferFunds(source, destination, amount)
            }, Error('Not enough funds in source in source envelope'))

        })
    })


})
