const DispatchMessage2Listeners = require('./index') ;

const NmeaBuffer = require( 'nmea-buffer' ) ;
const Stream2Event = require( 'socketstream2event' ) ;

//Example 1, parsing NMea messages
const n1 = new DispatchMessage2Listeners() ;

let s2e = new Stream2Event( 10 ) ;
s2e.addOnData((data)=>{
    let nmeaMessage = NmeaBuffer.parse(data) ;
    n1.dispatchToListeners( nmeaMessage.header, data ) ;
})

n1.showLog = true ;
n1.addListener("a", (d)=>{
    console.log("\n\n*1 recived A in n1", NmeaBuffer.parse(d).message) ;
} ) ;

n1.addListener("B", (d)=>{
    console.log("\n\n*2 recived B in n1", NmeaBuffer.parse(d).message) ;
} ) ;
n1.addListenerAll((d)=>{
    console.log("\n\n*3 recived becouse listener all message in n1", NmeaBuffer.parse(d).message) ;
} ) ;
n1.addListenerAllOnChange((d)=>{
    console.log("\n\n*4 recived listen all if CHANGE in n1", NmeaBuffer.parse(d).message) ;
} ) ;
let data = [ ... NmeaBuffer.getMessageBuffer("a", "just for A, test 1"), ...NmeaBuffer.getMessageBuffer("a", "just for A test 2"), ...NmeaBuffer.getMessageBuffer("B", "just for Bs"), ...NmeaBuffer.getMessageBuffer("c", "just for c"), ...NmeaBuffer.getMessageBuffer("c", "just for c") ];

s2e.parseData(data) ;

console.log("\n End test n1. \n ................................. \n\n") ;

//Exemple 2 - parsing using json with method and body attributes
const n2 = new DispatchMessage2Listeners() ;
n2.addListener("*",  (d)=>{
    console.log("\n\n*recived * in n2", NmeaBuffer.parse(d)) ;
} )

n2.addListenerOnChange("B",  (d)=>{
    console.log("\n\n*recived B in n2", NmeaBuffer.parse(d)) ;
} )
const Buffer        = require('buffer').Buffer ;

data = [ ... Buffer.from('{"method":"a", "body":"testing 111"}\n'), ... Buffer.from('{"method":"B", "body":"testing 111"}\n') ];

s2e.parseData(data) ;

//if you want to force send message to listeners:

n2.dispatchToListeners("B", "message here")
n2.dispatchToListeners("B", "message here")
n2.dispatchToListeners("B", "message here")

console.log("\n End test n2. \n ................................. \n\n") ;



const n3 = new DispatchMessage2Listeners() ;
var objGroup = {__id:23234234}

n3.addListener("B",  (d)=>{
    console.log("recived B again in n3", d) ;
}, objGroup ) ;

n3.addListenerOnChange("B",  (d)=>{
    console.log("recived B once in n3", d) ;
}, objGroup ) ;

n3.dispatchToListeners("B", "another message again") ;
n3.dispatchToListeners("B", "another message again") ;
n3.dispatchToListeners("B", "another message again") ;
n3.removeListenersByGroup( objGroup ) ;
//just 3 first message neet to recive response
n3.dispatchToListeners("B", "another message again") ;
n3.dispatchToListeners("B", "another message again") ;
n3.dispatchToListeners("B", "another message again") ;

console.log("\n End test n3. \n ................................. \n\n") ;

console.time("n4")
const n4 = new DispatchMessage2Listeners() ;
//when you send object to listeners and need change way to compare:
n4.xcompare = (n1,n2)=>{
    if(!n1 && !n2){
        return true ;
    }
    if(! n1 || !n2 ){
        return false ;
    }
    return (n1.m == n2.m)
}
n4.addListener("C",  (d)=>{
    console.log("recived C again in n4", d) ;
}, objGroup ) ;

n4.addListenerOnChange("C",  (d)=>{
    console.log("recived C once in n4", d) ;
}, objGroup ) ;

for( var i = 0; i < 400; i++){
    n4.dispatchToListeners("C", {m:"another message again"}) ;
}


console.timeEnd("n4")
console.log("\n End test n4. \n ................................. \n\n") ;
