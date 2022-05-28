
// net takes a peer
// net is async and nondeterministic
class Net {
    constructor(peerDB) {
        this.peerDB = peerDB
    }
    async run() {
        // connect to peers from peerDB
        //   on ann/peer, add it
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
        return [state, []]
    }
    repr() {
        return [ this.state, this.log ]
    }
}

// the node is a kind of supervisor of the net/bus/eng abstraction
// it is async and nondeterministic because it interacts with net, its job
// is to route messages into and out of the deterministic engine
class Node {
    constructor(peers) {
        this.net = new Net(peers)
        this.eng = new Eng()
    }
    async run() {
        this.net.start()
        while(true) {
            let msg = await this.net.poll()
            let outs = this.eng.step(msg)
            for (let out of outs) {
                this.bus.emit(out)
            }
        }
    }
    repr() {
        return [
            this.net.repr(),
            this.eng.repr()
        ]
    }
}
