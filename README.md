# RefreshTime

## Usage:

```
//min 300 ms to call someAsincMethod again, no max. Maybe can take more time
const refreshAsinc = new RefreshTime( someAsincMethod, 300 ) ;

function someAsincMethod(){
    //do something asinc...
    let a = new Promise((resolve, reject)=>{
        //random time to resolve 100 > 2000 ms
        setTimeout(()=>{
            resolve();
        }, Math.random()*2000+100)
    }) ;
    //if take 100 ms, call someAsincMethod after 200 more ms until get 300ms, fiz more then 300ms, call when resolved is called
    a.then(refreshAsinc.resolved);
}

refreshAsinc.start() ;

```


## RefreshTime start

Wait start callet to start frequence call

## RefreshTime stop

Call stop method to stop frequence call 

## RefreshTime reset

Start again at the begin


## Diferent progrecive frequences