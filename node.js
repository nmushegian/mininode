
// net takes a peerDB
// net is async and nondeterministic
class Net {
    this.iq = new Q()
    this.oq = new Q()
    constructor(peerDB) {
        this.peerDB = peerDB
    }
    async run() {
        // connect to peers from peerDB
        //   on ann/peer, add it
        // for each peer
        //   await peer.on msg
        //     iq.enq(msg)
        // loop msg = this.oq.pop()
        //   yield if msg is null
        //   if msg.type == end
        //     msg.from.ban()
        //   else
        //     msg.from.send(msg)
    }
    async *poll() {
        yield this.iq.deq()
    }
    emit(msg) {
        this.oq.enq(msg)
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
