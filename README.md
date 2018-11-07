# DispatchMessage2Listeners


## For use in stream

```

const DispatchMessage2Listeners = require('./DispatchMessage2Listeners.js') ;

const NmeaBuffer = require( 'nmea-buffer' ) ;

//Example 1, parsing NMea messages
const n1 = new DispatchMessage2Listeners( 10, NmeaBuffer.parse ) ;
n1.showLog = true ;
n1.addListener("a", (d)=>{
    console.log("recived a in n1", d) ;
} ) ;

n1.addListener("B", (d)=>{
    console.log("recived B in n1", d) ;
} ) ;

let data = [ ... NmeaBuffer.getMessageBuffer("a", "testing 123"), ...NmeaBuffer.getMessageBuffer("a", "testing 456"), ...NmeaBuffer.getMessageBuffer("B", "testing 789") ];

n1.parseData(data) ;


//Exemple 2 - parsing using json with method and body attributes
const n2 = new DispatchMessage2Listeners( 10, (data)=>{
    let parsedString = JSON.parse( data.toString() ) ;
    return { header:parsedString.method, message:parsedString.body }
} ) ;
n2.addListener("a",  (d)=>{
    console.log("recived a in n2", d) ;
} )

n2.addListener("B",  (d)=>{
    console.log("recived B in n2", d) ;
} )
const Buffer        = require('buffer').Buffer ;

data = [ ... Buffer.from('{"method":"a", "body":"testing 111"}\n'), ... Buffer.from('{"method":"B", "body":"testing 111"}\n') ];

n2.parseData(data) ;

//if you want to force send message to listeners:

n2._dispatchToListeners("B", "message here")

```

