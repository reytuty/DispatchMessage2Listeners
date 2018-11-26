const DispatchMessage2Listeners = require('./index') ;

const NmeaBuffer = require( 'nmea-buffer' ) ;

//Example 1, parsing NMea messages
const n1 = new DispatchMessage2Listeners( 10, NmeaBuffer.parse ) ;
n1.showLog = true ;
n1.addListener("a", (d)=>{
    console.log("recived a in n1", d.message) ;
} ) ;

n1.addListener("B", (d)=>{
    console.log("recived B in n1", d.message) ;
} ) ;
n1.addListenerAll((d)=>{
    console.log("recived ALL in n1", d.message) ;
} ) ;
n1.addListenerAllOnChange((d)=>{
    console.log("recived ALL on change in n1", d.message) ;
} ) ;
let data = [ ... NmeaBuffer.getMessageBuffer("a", "just for a 1"), ...NmeaBuffer.getMessageBuffer("a", "just for a 2"), ...NmeaBuffer.getMessageBuffer("B", "just for Bs"), ...NmeaBuffer.getMessageBuffer("c", "just for c") ];

n1.parseData(data) ;


//Exemple 2 - parsing using json with method and body attributes
const n2 = new DispatchMessage2Listeners( 10, (data)=>{
    let parsedString = JSON.parse( data.toString() ) ;
    return { header:parsedString.method, message:parsedString.body }
} ) ;
n2.addListener("a",  (d)=>{
    console.log("recived a in n2", d) ;
} )

n2.addListenerOnChange("B",  (d)=>{
    console.log("recived B in n2", d) ;
} )
const Buffer        = require('buffer').Buffer ;

data = [ ... Buffer.from('{"method":"a", "body":"testing 111"}\n'), ... Buffer.from('{"method":"B", "body":"testing 111"}\n') ];

n2.parseData(data) ;

//if you want to force send message to listeners:

n2._dispatchToListeners("B", "message here")
n2._dispatchToListeners("B", "message here")
n2._dispatchToListeners("B", "message here")



const n3 = new DispatchMessage2Listeners( 10, (data)=>{
    let parsedString = JSON.parse( data.toString() ) ;
    return { header:parsedString.method, message:parsedString.body }
} ) ;
var objGroup = {__id:23234234}
n3.addListener("B",  (d)=>{
    console.log("recived B again in n3", d) ;
}, objGroup ) ;

n3.addListenerOnChange("B",  (d)=>{
    console.log("recived B once in n3", d) ;
}, objGroup ) ;

n3._dispatchToListeners("B", "another message again") ;
n3._dispatchToListeners("B", "another message again") ;
n3._dispatchToListeners("B", "another message again") ;
n3.removeListenersByGroup( objGroup ) ;
//just 3 first message neet to recive response
n3._dispatchToListeners("B", "another message again") ;
n3._dispatchToListeners("B", "another message again") ;
n3._dispatchToListeners("B", "another message again") ;