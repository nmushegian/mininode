// daemon

class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
        this.log = []
        this.iq = []
        this.oq = []
    }
    step() {
        let mail = iq.pop()
        let outs = this.djin.turn(mail)
        this.oq = [...outs, ...this.oq]
    }
    async *spin() {
        if (this.iq.length > 0) {
            this.step()
        } else {
            yield
        }
    }
    async play() {
        this.plug.when(mail => {
            this.log.push(['i', mail])
            this.iq = [mail, ...this.iq]
        })
        setInterval(() => {
            let outs = this.oq; this.oq = []; // flush
            for (let out of outs) {
                this.plug.send(out)
            }
        }, 1000)
        spin()
    }
}
