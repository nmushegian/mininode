import { test } from 'tapzero'
import { Plug } from './plug.js'
import { Dmon } from './dmon.js'
import { Djin } from './djin.js'

test('mininode', t=>{
    let plug = new Plug()
    let djin = new Djin()
    let dmon = new Dmon(djin, plug)
    dmon.play()
})
