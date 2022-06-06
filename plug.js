// network plugin

import * as hapi from '@hapi/hapi'
import fetch from 'node-fetch'

export { Plug, HapiPlug }

class Plug {
    // resolve when connection has been closed
    async kill() {
        console.log(`plug.kill()`)
    }
    // resolve when handler is wired up and active
    // when : (what:(mail:blob -> back:blob))
    async when(what) {
        console.log(`plug.when(..., ...)`)
    }
    async send(peer, mail) {
        console.log(`plug.send(${peer}, ${mail})`)
    }
}


class HapiPlug extends Plug {
    constructor({ host, port }) {
        super()
        this.host = host
        this.port = port
        this.peers = {self: { url: `http://${host}:${port}`}}
    }
    async when(what) {
        process.on('unhandledRejection', err => {
            console.log(err); process.exit(1)
        })
        this.serv = hapi.server({
            host: this.host, port: this.port
        })
        this.serv.route({
            method: '*',
            path: '/{any*}',
            handler: (request) => {
                let data = JSON.parse(request.payload)
                let back = what(data)
                return back
            }
        })
        await this.serv.start()
        console.log(`listening on ${this.serv.info.uri}`)
    }
    async send(peer, mail) {
        let post = JSON.stringify(mail)
        console.log(`send(${peer}, ${post})`)
        let { url } = this.peers[peer]
        let res = await fetch(url, { method: 'POST', body: post } )
        let body = await res.json()
        console.log('body', body)
        return body
    }
    async stop() {
        this.serv.stop()
    }
}

