// daemon

export class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
        this.log = []
    }
    mailbox(mail, echo) {
        this.log.push(['i', mail])
        let outs = this.djin.turn(mail)
        for( let out of outs) {
            this.log.push(['o', out])
            echo(out)
        }
    }
    async play() {
        this.plug.open(4000, this.mailbox)
    }
}
