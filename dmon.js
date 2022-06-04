// daemon

import * as uws from 'uWebSockets.js'

export class Dmon {
    constructor(djin) {
        this.djin = djin
        this.log = []
    }
    async play(port) {
        let net = uws.App({}).ws('/*', {
            message: (ws, mail) => {
                this.log.push(['i', mail])
                let outs = this.djin.turn(mail)
                for (let out of outs) {
                    this.log.push(['o', out])
                    ws.send(out)
                }
            }
        }).listen(port, console.log)
    }
}
