export default {
    getItem(key){
    	 var name = key + "=";
    	 if(document.cookie){
			  var ca = document.cookie.split(';');
			  if(ca.length>0){
				  for(var i=0; i<ca.length; i++)
					  {
					    var c = ca[i].trim();
					    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
					  }
			  }
			  }
    },
    setItem(key, value){
    	if(document.cookie){
    		var ca = document.cookie.split(';');

			if(ca.length>0){

			  for(var i=0; i<ca.length; i++)
			  {
			    var c = ca[i].trim();
			    if (c.indexOf(key)==0){
			    	var oldVal = c.substring(key.length+1,c.length);
			    	c=c.replace(oldVal,value);
			    	ca[i]=c
			    }
			  }
			  document.cookie = ca.join(';')

			}
    	}else{
    		document.cookie = key + "=" + value
    	}
    },
    removeItem(key){
    	var ca = document.cookie.split(';');
		  for(var i=0; i<ca.length; i++)
		  {
		    var c = ca[i].trim();
		    if (c.indexOf(key)==0){
		    	ca.splice(1,1)
		    }
		  }
		  return ca.join(';');
    },
    getAll(){},
    clear(){
        this.getItem(setItem, '');
    },
    key(n){},
    forEach(cb){},
    has(key){},
    deleteAllExpires(){}
}
