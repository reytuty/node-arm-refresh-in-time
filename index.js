
/**
 * This class previne over call to the same method in async methods
 * 
 * This class avoids repetition and overlap of asynchronous calls having at least the configured frequency
 * The diference of setInterval who overlap even when the call do not end
 * @author Renato Miawaki
 * 
 * @param {Method} p_refreshMethod 
 * @param {Number|Number[]} p_frequence pode passar um array de int, nesse caso ele repete 10x cada uma das etapas
 */
function RefreshTime( p_refreshMethod, p_frequence ){
    var me          = this ;
    var frequence   = p_frequence ;
    var progrecive  = false ;
    if( typeof p_frequence == "object" && p_frequence.length > 0 ){
        frequence = p_frequence ;
        for(var i in frequence ){
            frequence[i] = parseInt(frequence[i]) ;
        }
        progrecive = true ;
    } else {
        frequence = parseInt( p_frequence ) ;
    }
    var method          = p_refreshMethod ;
    var lastTime        = 0 ;
    var stoped          = false ;
    var waiting         = false ;
    var calledTimes     = 0 ;
    var currentIndex    = 0 ;
    var repetitionTimesPerIndex = 10 ;
    this.setRepetitionTimes = (times)=>{
        repetitionTimesPerIndex = (repetitionTimesPerIndex>0)?repetitionTimesPerIndex:1;
    }
    var timeoutId;
    this.getCurrentStage = function(){
        return currentIndex ;
    }
    function refreshCurrent(){
        currentIndex = Math.floor( calledTimes/repetitionTimesPerIndex ) ;
        var limit = frequence.length - 1 ;
        if( currentIndex > limit ){
            currentIndex = limit ;
        }
    }
    function startTimeout(time){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function(){
            waiting = false ;
            lastTime = new Date() ;
            method() ;
        }, time) ;
    }
    function getFrequency(){
        var calledFrequence = frequence ;
        if(progrecive){
            refreshCurrent() ;
            calledFrequence = frequence[ currentIndex ] ;
        }
        return calledFrequence ;
    }
    function getFrequencyLessDiff(){
        var calledFrequence = getFrequency() ;
        //console.log("atualizando",calledTimes);
        var now = new Date() ;
        var diff = (now - lastTime)  ;
        return calledFrequence - diff ;
    }
    /**
     * Precisa chamar o metodo resolved assim que o metodo assincrono se resolver para ser chamado novamente
     */
    this.resolved = function(){
        if(stoped || waiting){
            return ;
        }
        var freqLessDiff = getFrequencyLessDiff();
        calledTimes++ ;
        //avoid int change to negative when limit size
        calledTimes = Math.abs(calledTimes) ;
        if(freqLessDiff < 0 ){
            //passou do ponto, chama de novo
            lastTime = new Date() ;
            method() ;
            return ;
        }
        waiting = true ;
        //chama depois de um tempo
        startTimeout(freqLessDiff);
    }
    var started = false ;
    /**
     * 
     */
    this.start = function(){
        if(started){
            return ;
        }
        started = true ;
        stoped = false ;
        me.resolved() ;
        startTimeout( getFrequencyLessDiff() ) ;
    }
    /**
     * Chamar reset quando quiser que se comporte como no início
     * Para os casos de frequências diferentes para inicio
     */
    this.reset = function(){
        calledTimes = 0 ;
        started = false ;
        me.start() ;
    }
    this.stop = function(){
        clearTimeout(timeoutId);
        started = false ;
        stoped = true ;
    }
}
module.exports = RefreshTime ;