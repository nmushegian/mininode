// network plugin

import * as hapi from '@hapi/hapi'
import fetch from 'node-fetch'


export { Plug, HapiPlug }

class Plug {
    async play() {
        console.log(`plug.play()`)
    }
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
        this.point = { host, port }
        this.peers = {self: { url: `http://${host}:${port}`}}
        this._init = false
    }
    async when(what) {
        this.serv = hapi.server(this.point)
        this.serv.route({
            method: '*',
            path: '/{any*}',
            handler: (request) => {
                let data = JSON.parse(request.payload)
                let back = what(data)
                return back
            }
        })
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
    async play() {
        await this.serv.start()
        console.log(`listening on ${this.serv.info.uri}`)
    }
    async stop() {
        await this.serv.stop()
    }
}

import purehttp from 'pure-http'
import { raw, text } from 'milliparsec'
import { roll, unroll, rmap } from './deps/coreword/dist/word.js'

export class PureHttpPlug extends Plug {
    constructor({ host, port }) {
        super()
        this.host = host
        this.port = port
        this.peers = {self: {url: `http://${host}:${port}`}}
    }
    async when(what) {
        this.serv = purehttp()
        await this.serv.use(text())
        await this.serv.all('/', (req, res) => {
            let body = unroll(Buffer.from(req.body, 'hex'))
            let back = what(req.body)
            let rollhex = roll(back).toString('hex')
            res.send(rollhex)
        })
    }
    async play() {
        await this.serv.listen(this.port)
    }
    async stop() {
        await this.serv.close()
    }
    async send(peer, mail) {
        let post = roll(rmap(mail, Buffer.from)).toString('hex')
        let { url } = this.peers[peer]
        let res = await fetch(url, { method: 'POST', body: post } )
        let body = await res.text()
        let r = unroll(Buffer.from(body, 'hex'))
        return r
    }
}
