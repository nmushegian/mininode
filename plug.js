
// transport plugin

class Plug {
    // when( mailbox : msg -> () )
    when(mailbox) {
        // http.server.onMessage(msg => { mailbox(msg) } )
    }
    send(mail) {
        // http.request(..., mail)
    }
}
