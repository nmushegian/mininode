// every thing has a `repr` which is a concrete representation

// regular queue
class Q {
    constructor() { this.q = [] }
    enq(v) {
        this.q.push(v)
    }
    deq() {
        if (this.q.length == 0) {
            return null
        } else {
            let head = this.q[0]
            this.q = this.q.slice(1)
            return head
        }
    }
    repr() {
        return this.q
    }
}

// net mediates interactions between the bus and the network
class Net {
    constructor(peers_, bus_) {
        this.peers = peers_
        this.bus = bus_
    }
    start() {
        // for each peer
        //   peer.on msg
        //     bus.push(msg)
        // loop msg=bus.pull()
        //   if msg.type == end
        //     peers[msg.peer].ban()
        //   else
        //     peers[msg.peer].send(msg)
    }
    repr() {
        return [this.peers]
    }
}

// bus is a pair of queues between the network and the engine
class Bus {
    constructor() {
        this.iq = new Q() // in queue
        this.oq = new Q() // out queue
        this.log = []
    }

    // eng -> bus
    emit(msg) {
        this.log.push(['emit', msg])
        oq.enq(msg)
    }
    // eng <- bus
    poll() {
        let msg = iq.deq()
        this.log.push(['poll', msg])
        return msg
    }

    // net <- bus
    pull() {
        let msg = oq.deq()
        this.log.push(['pull', msg])
        return msg
    }
    // net -> bus
    push(msg) {
        this.log.push(['push', msg])
        this.iq.enq(msg)
    }

    repr() {
        return [this.iq.repr(), this.oq.repr()]
    }
}

class Eng {
    step(msg) {
        let msg = this.bus.poll()
        // apply to state
        return [] // return some messages
    }
}

// the node is then just a kind of supervisor of the net/bus/eng abstraction
class Node {
    constructor(peers_, eng_) {
        this.bus = new Bus()
        this.net = new Net(peers, bus)
        this.eng = eng_
    }
    step() {
        let msg = this.bus.poll()
        let outs = this.eng.step(msg)
        for (let out of outs) {
            this.bus.emit(out)
        }
    }
    repr() {
        return [
            this.net.repr(),
            this.bus.repr(),
            this.eng.repr()
        ]
    }
}
