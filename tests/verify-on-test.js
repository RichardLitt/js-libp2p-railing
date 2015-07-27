var Lab = require('lab')
// var Code = require('code')
var lab = exports.lab = Lab.script()

var experiment = lab.experiment
var test = lab.test
var before = lab.before
var after = lab.after
// var expect = Code.expect

var multiaddr = require('multiaddr')
var Id = require('ipfs-peer-id')
var Peer = require('ipfs-peer')
var Swarm = require('ipfs-swarm')

var Broadcast = require('./../src')

// var pA
var pB
var swA
var swB

before(function (done) {
  // pA = new Peer(Id.create(), [multiaddr('/ip4/127.0.0.1/tcp/8100')])
  pB = new Peer(Id.create(), [multiaddr('/ip4/127.0.0.1/tcp/8101')])
  swA = new Swarm()
  swB = new Swarm()

  swA.listen(8100, function () {
    swB.listen(8101, function () {
      done()
    })
  })
})

after(function (done) {
  swA.closeListener()
  swB.closeListener()
  done()
})

experiment('With verify on', function () {
  test('Find the other peer', { timeout: 1e3 * 10 }, function (done) {
    var peerList = [
      pB.multiaddrs[0].toString() + '/ipfs/' + pB.id.toB58String()
    ]
    var bA = new Broadcast(peerList, {
      verify: true
    }, swA)

    bA.once('peer', function (peer) {
      done()
    })
  })
})