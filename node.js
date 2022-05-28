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
// net is async and nondeterministic
class Net {
    constructor(peers_, bus_) {
        this.peers = peers_
        this.bus = bus_
    }
    async run() {
        // for each peer
        //   await peer.on msg
        //     bus.push(msg)
        // loop msg=bus.pull()
        //   if msg.type == end
        //     peers[msg.peer].ban()
        //   else
        //     peers[msg.peer].send(msg)
        //   yield // next event loop
    }
    async *poll() {
    }
    async emit() {
    }
}

// the engine is synchronous and deterministic
class Eng {
    let log = []
    let state = null
    step(msg) {
        this.log.push(msg)
        let [next, outs] = this.turn(state, msg)
        this.state = next
        return outs
    }
    turn(state, msg) {
        // implementation
        return state
    }
    repr() {
        return [ this.state, this.log ]
    }
}

// the node is a kind of supervisor of the net/bus/eng abstraction
// it is async and nondeterministic because it interacts with net, its job
// is to route messages into and out of the deterministic engine
class Node {
    constructor(peers_, eng_) {
        this.bus = new Bus()
        this.net = new Net(peers, bus)
        this.eng = eng_
    }
    async run() {
        this.net.start()
        while(true) {
            let msg = await this.bus.poll()
            let outs = this.eng.step(msg)
            for (let out of outs) {
                this.bus.emit(out)
            }
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
