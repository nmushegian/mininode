import {expect as want} from 'chai';
import {Dmon} from '../dmon.js';
import {Djin} from '../djin.js'
import {SockPlug, HapiPlug, PureHttpPlug} from '../plug.js'
import Debug from 'debug'
const debug = Debug('test::dmon')
import rlp from 'rlp'

const spin = async (f, ...args) => {
    while (true) {
        await (new Promise(resolve => setTimeout(resolve, 0)))
        const res = f(...args)
        if (res != null) {
            return res
        }
    }
}

const localhost = '127.0.0.1'
for (const PlugType of [SockPlug, HapiPlug, PureHttpPlug]) {
    describe(`dmon test (${PlugType.name})`, () => {
        let ali, bob, cat
        let ALI, BOB, CAT
        beforeEach(async () => {
            ali = new Dmon(new Djin(null), new PlugType(localhost, 10334));
            bob = new Dmon(new Djin(null), new PlugType(localhost, 10335));
            cat = new Dmon(new Djin(null), new PlugType(localhost, 10336));
            ALI = ali.plug.pubkey
            BOB = bob.plug.pubkey
            CAT = cat.plug.pubkey
            for (const dmon of [ali, bob, cat]) {
                await dmon.play()
                await dmon.init()
            }
            debug(`created nodes ali@${ALI}, bob@${BOB}, cat@${CAT}`)
            want(ALI).to.not.eql(BOB)
        });
        afterEach(async () => {
            ali.plug.stop()
            bob.plug.stop()
            cat.plug.stop()
        })

        const fmt = (x) => rlp.decode(rlp.encode(x))
        const fmtmail = (mail) => [mail[0], fmt(mail[1])]

        describe('basic', () => {
            beforeEach(async () => {
                ali.plug.setPeer(BOB, localhost, bob.plug.point.port)
                ali.plug.setPeer(CAT, localhost, cat.plug.point.port)
            })
            it(`end ${PlugType.name}`, async () => {
                debug(`end @${ALI} -> @${BOB}`)
                const mail = ['endq29g48i', 'ok']
                want(ali.plug.peers[BOB]).to.eql(bob.plug.point)
                await ali.plug.send(BOB, mail)
                debug(`sent mail ${mail}`)
                want(ali.plug.peers[BOB]).to.eql(undefined)
                want(ali.plug.actives.indexOf(BOB)).to.eql(-1)
                const prev = await spin(() => bob.prev)
                debug(`spun`)
                want(prev).to.eql(fmtmail(mail))
                want(bob.turnt).to.eql(undefined)
            });

            it(`ann ${PlugType.name}`, async () => {
                // TODO ann subset
                const mail = ['ann1893789wrusoilfoui89vs89', '']
                debug(`ann ${ALI} -> ${BOB}, ${CAT}`)
                await ali.plug.send('', mail)
                for (const dmon of [bob, cat]) {
                    want(ali.plug.peers[dmon.plug.pubkey]).to.eql(dmon.plug.point)
                    const prev = await spin(() => dmon.prev)
                    debug(`spun ${prev}`)
                    want(prev).to.eql(fmtmail(mail))
                    want(dmon.turnt).to.eql(fmtmail(mail))
                }
            })

            it(`req ${PlugType.name}`, async () => {
                const mail = JSON.parse(JSON.stringify(['req/aew782i181', '']))
                ali.plug.send('', mail)
                for (const dmon of [bob, cat]) {
                    want(ali.plug.peers[dmon.plug.pubkey]).to.eql(dmon.plug.point)
                    const prev = await spin(() => dmon.prev)
                    want(prev).to.eql(fmtmail(mail))
                    want(dmon.turnt).to.eql(undefined)
                }
            })

            it(`res ${PlugType.name}`, async () => {
                const mail = JSON.parse(JSON.stringify(['res/aew782i181', '']))
                ali.plug.send(BOB, mail)
                const prev = await spin(() => bob.prev)
                debug("RES ", prev, mail)
                want(prev).to.eql(fmtmail(mail))
                want(bob.turnt).to.eql(fmtmail(mail))
            })
        })
    })
}
