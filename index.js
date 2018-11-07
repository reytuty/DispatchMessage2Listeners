const Stream2Event = require('socketstream2event') ;

const pushToMap = (map, key, client) => {
    if( ! map.has( key ) ){
        map.set( key, new Map() ) ;
    }
    const value = map.get(key);
    value.set(client, true) ;
}
const dispatchToList = (list, data)=>{
    if(!list || list.size == 0){
        if(this._logOn) console.log("Lista vazia") ;
        return ;
    }
    list.forEach((v,k)=>{
        if( v ){
            k(data);
        }
    }) ;
}

class DispatchMessage2Listeners {

    /**
     * 
     * bytes to separate messages
     * @param {*} p_bytesSeparetor 
     * parser method whos get data and returns {header, message}
     * @param {*} parser 
     */
    constructor( p_bytesSeparetor, parser ){
        //checking parser interface
        if( !parser || ! typeof parser === "function" ){
            throw Error("parser need to be a method whos get data and returns { header, message }") ;
        }
        this._parser                = parser ;
        this._lastMessages          = new Map() ;
        
        this._listeners             = new Map() ;
        this._listenersMerge        = new Map() ;
        this._logOn                 = false ;

        /**
         * nmea patterns 10 = new line to new message
         */
        this._s2e = new Stream2Event( p_bytesSeparetor ) ;
        this._s2e.addOnData( (d)=>{
            this._dataRecived(d) ;
         } ) ;
    }
    /**
     * You can add data here, but just once data per once
     * 
     * @param {*} data 
     */
    _dataRecived(data){
        let d = this._parser( data ) ;
        if(d){
            this._dispatchToListeners( d.header, d.message ) ;
        }
    }
    set showLog(v){
        this._logOn = v ;
    }
    _dispatchToListeners( key, data ){
        if(!this._listeners.has(key) && !this._listenersMerge.has(key)){
            if(this._logOn) console.log("has no listener for ", key) ;
            return ;
        }
        var last = this._lastMessages.get(key) ;
        var newstr = data ;
        if( ! newstr != last){
            //is new
            last = newstr;
            this._lastMessages.set(key, last);
            //dispatch to merges
            var listenerListMerge = this._listenersMerge.get(key) ;
            if(this._logOn) console.log("NEW message")
            dispatchToList( listenerListMerge, data ) ;
        } else {
            if(this._logOn) console.log("repeated message")
        }
        var listenerList = this._listeners.get(key) ;
        dispatchToList( listenerList, data ) ;
    }
    /**
     * You need put stream data here
     * Awais recived data or part of data
     * @param {*} data 
     */
    parseData( data ){
        return this._s2e.parseData( data ) ;
    }
    /**
     * Call when get message with method like methodName
     * @param {*} methodName 
     * @param {*} listener 
     */
    addListener( methodName, listener ){
        pushToMap( this._listeners, methodName, listener ) ;
    }
    /**
     * Call when get message with method like methodName AND value has change
     * @param {*} methodName 
     * @param {*} listener 
     */
    addListenerOnChange( methodName, listener ){
        pushToMap( this._listenersMerge, methodName, listener ) ;
    }
    /**
     * Remove listener my method name and listener method
     * @param {*} methodName 
     * @param {*} listener 
     */
    removeListener( methodName, listener ){
        if( ! listenersMerge.has(methodName)? listenersMerge.get(methodName).delete( listener ) : false ){
            return listeners.has(methodName)? listeners.get(methodName).delete( listener ) : false ;
        }
        return false ;
    }
}

module.exports = DispatchMessage2Listeners ;