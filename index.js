
const pushToMap = (map, key, client) => {
    if( ! map.has( key ) ){
        map.set( key, new Map() ) ;
    }
    const value = map.get(key);
    value.set(client, true) ;
}
const dispatchToList = (list, data)=>{
    if(!list || list.size == 0){
        return ;
    }
    list.forEach((v,k)=>{
        if( v && k ){
            k(data);
        }
    }) ;
}
const pushToGroup = (listenerList, groupKey, value)=>{
    let itens = [] ;
    if( listenerList.has(groupKey) ){
        itens = listenerList.get(groupKey) ;
    }
    itens.push(value)
    listenerList.set(groupKey, itens) ;
}

class DispatchMessage2Listeners {
    /**
     * 
     * bytes to separate messages
     * @param {*} p_bytesSeparetor 
     * parser method whos get data and returns {header, message}
     * @param {*} parser 
     */
    constructor(){
        //checking parser interface
        this._lastMessages          = new Map() ;
        
        this._listeners             = new Map() ;
        this._listenersMerge        = new Map() ;

        this._listenersGroup        = new Map() ;
        this._logOn                 = false ;
    }
   
    set showLog(v){
        this._logOn = v ;
    }
    //override this if you need change the way to compare
    compare(v1, v2){
        if(v1 === undefined && v2 === undefined){
            return true ;
        }
        if(v1 === undefined  || v2 === undefined ){
            return false ;
        }
        return JSON.stringify(v1) == JSON.stringify(v2) ;
    }
    /**
     * When you get message, call this method.
     * It will send to listener data based in key
     * @param {*} key 
     * @param {*} data 
     */
    dispatchToListeners( key, data ){
        if(!this._listeners.has(key) && !this._listenersMerge.has(key) && !this._listeners.has("*") && !this._listenersMerge.has("*") ){
            if(this._logOn) console.log("has no listener for ", key) ;
            return ;
        }
        var last = this._lastMessages.get(key) ;
        var newstr = data ;
        if( ! this.compare( newstr , last ) ){
            dispatchToList( this._listenersMerge.get("*"), data ) ;
            //is new
            last = newstr;
            this._lastMessages.set(key, last);
            //dispatch to merges
            if(this._logOn) console.log("NEW message")
            dispatchToList( this._listenersMerge.get(key), data ) ;
        } else {
            if(this._logOn) console.log("repeated message")
        }
        dispatchToList( this._listeners.get("*"), data ) ;
        dispatchToList( this._listeners.get(key), data ) ;
    }
    addListenerAll( listener, groupKey = null ){
        return this.addListener("*", listener, groupKey ) ;
    }

    addListenerAllOnChange( listener, groupKey = null ){
        return this.addListenerOnChange("*", listener, groupKey ) ;
    }
    /**
     * Call when get message with method like methodName
     * @param {*} methodName 
     * @param {*} listener 
     */
    addListener( methodName, listener, groupKey = null ){
        if(groupKey){
            //add to a group to posibility remove many listener from group
            pushToGroup(this._listenersGroup, groupKey, {methodName, listener}) ;
            
        }
        pushToMap( this._listeners, methodName, listener ) ;
    }
    /**
     * Call when get message with method like methodName AND value has change
     * @param {*} methodName 
     * @param {*} listener 
     */
    addListenerOnChange( methodName, listener, groupKey = null ){
        if(groupKey){
            //add to a group to posibility remove many listener from group
            pushToGroup(this._listenersGroup, groupKey, {methodName, listener}) ;
            
        }
        pushToMap( this._listenersMerge, methodName, listener ) ;
    }
    /**
     * Remove listener my method name and listener method
     * @param {*} methodName 
     * @param {*} listener 
     */
    removeListener( methodName, listener ){
        if( ! ( this._listenersMerge.has(methodName) ? this._listenersMerge.get(methodName).delete( listener ) : false ) ) {
            return this._listeners.has(methodName)? this._listeners.get(methodName).delete( listener ) : false ;
        }
        return false ;
    }
    /**
     * grouped listeners can be all removed using this method
     * @param {*} group 
     */
    removeListenersByGroup( group ){
        if( this._listenersGroup.has( group ) ){
            let listToRemove = this._listenersGroup.get(group) ;
            listToRemove.forEach((item)=>{
                this.removeListener( item.methodName, item.listener ) ;
            })
        }
    }
}

module.exports = DispatchMessage2Listeners ;