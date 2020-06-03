class pila{
	constructor(){
		this.primero=null;
		this.tope=null;
	}

	apilar(d){
		var p = new nodoSimple(d);
		if (this.primero==null) {this.primero=p; this.tope=p;}
		else{
			p.asignaLiga(this.primero);
			this.primero=p;
		}
	}

	desapilar(){
		if (this.primero==null) return null;
		var p = this.primero;
		var d = p.retornaDato();
		this.primero=p.retornaLiga();
		return d;
	}

	esVacia(){
		if (this.primero==null) {
			return true;
		}else return false;
	}

	replace(d){
		this.desapilar();
		for (var i = 1; i < d.length; i++) {
			this.apilar(d[i]);
		}
	}

	retornaTope(){return this.tope;}
	retornaPrimero(){return this.primero};
}
