import Debug from 'debug'
const debug = Debug('test::dmon')
import rlp from 'rlp'

// daemon

export class Dmon {
    constructor(djin, plug) {
        this.djin = djin
        this.plug = plug
        this.nmsgs = 0
    }
    async init() {
        await this.plug.when_(mail => {
            debug(`mailbox`)
            debug(`msg @${this.plug.pubkey}, nmsgs=${this.nmsgs++}`)
            const ty = mail[0].slice(0, 3)
            let res = {}
            if (ty == 'res' || ty == 'ann') {
                res = this.djin.turn(mail)
                this.turnt = mail
            }
            this.prev = mail
            return res
        })
    }
    async play() {
        await this.plug.play()
    }
    async send(peer, mail) {
        return await this.plug.send(peer, mail)
    }
    async stop() {
        return await this.plug.stop()
    }
}
