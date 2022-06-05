import { test } from 'tapzero'
import { Dmon } from './dmon.js'
import { Djin } from './djin.js'
import { Plug, HapiPlug} from './plug.js'

test('dumb plug', t=>{
    let djin = new Djin()
    let plug = new Plug()
    let dmon = new Dmon(djin, plug)
    dmon.play()
})

test('http plug', async t=>{
    let plug = new HapiPlug({ host: 'localhost', port: 7117})
    let djin = new Djin()
    let dmon = new Dmon(djin, plug)
    dmon.play()
})
