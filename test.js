import { test } from 'tapzero'
import { Dmon } from './dmon.js'
import { Djin } from './djin.js'

test('mininode', t=>{
    let djin = new Djin()
    let dmon = new Dmon(djin)
    dmon.play()
})
