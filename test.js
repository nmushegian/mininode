import { test } from 'tapzero'
import { Dmon } from './dmon.js'
import { Djin } from './djin.js'
import { Plug, HapiPlug, PureHttpPlug } from './plug.js'

test('dumb plug', t=>{
    let djin = new Djin()
    let plug = new Plug()
    let dmon = new Dmon(djin, plug)
    dmon.play()
})

test('hapi plug', async t=>{
    let plug = new HapiPlug({ host: 'localhost', port: 7117})
    let djin = new Djin()
    let dmon = new Dmon(djin, plug)
    await dmon.init()
    await dmon.play()
    let back = await dmon.send('self', ['ann/peer', 'hello'])
    t.equal(back[0], 'ack')
    await dmon.stop()
})

test('purehttp plug', async t=>{
    let plug = new PureHttpPlug({ host: 'localhost', port: 7117})
    let djin = new Djin()
    let dmon = new Dmon(djin, plug)
    await dmon.init()
    await dmon.play()
    let back = await dmon.send('self', ['ann/peer', 'hello'])
    t.equal(back[0], 'ack')
    await dmon.stop()
})
