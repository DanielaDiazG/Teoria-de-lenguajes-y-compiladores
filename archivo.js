var numProdu = 2;
var gramatica = [];
var terminales = [];
var noTerminales = [];
var proAnulables = [];
var ntAnulables = [];
var arraySeleccion = [];
var arraySiguientes = [];
var tAlfa = [];
var simbEntrada = [];
var simbPila = [];
var transiciones = [];
var configInicial;
var pilaAuto;

function creaFila(){
	var container = document.getElementById("gramatica");

	var elem = document.createElement('label');
	elem.innerHTML = numProdu+". ";    
	container.appendChild(elem);

	
	var input1 = document.createElement("input");
	input1.type = "text";
	input1.size = "1";
	input1.id = "n"+numProdu;
	container.appendChild(input1);

	var elem2 = document.createElement('label');
	elem2.innerHTML = " --> ";    
	container.appendChild(elem2);

	var input2 = document.createElement("input");
	input2.type = "text";
	input2.id = "t"+numProdu;
	container.appendChild(input2);

	var br = document.createElement('br');
	container.appendChild(br);
	numProdu++;

	return false;
}

function construye(){
	gramatica = [];
	terminales = [];
	noTerminales = [];
	proAnulables = [];
	ntAnulables = [];
	arraySiguientes = [];
	arraySeleccion = [];
	tAlfa = [];
	transiciones = [];
	simbPila = [];
	simbEntrada = [];

	var s = "";
	var esS;
	var esQ;
	var esLL1;
	construyeGramatica();
	if (valida() != true) {
		alert(valida());
		return;}
	if(arraysIguales(identifica(),noTerminales) == false ){
		alert("Hay NT que no están definidos");
		return;
	}
	noTerminales = identifica();
	produccionAnulable(null);
	siguientes();
	seleccion();
	esS = validaS();
	if (esS == true) {
		alert("Es S");
		creaAPS();
		imprimirTransiciones();
		ImprimirAF(simbEntrada,transiciones,simbPila);
	}
	else {
		esQ = validaQ();
		if (esQ == true) {
			alert("Es Q");
			creaAPS();
			imprimirTransiciones();
			ImprimirAF(simbEntrada,transiciones,simbPila);

		}
		else{
			esLL1 = validaLL1();
			if (esLL1 == true) {
				alert("Es LL1");
				creaAPS();
				imprimirTransiciones();
				ImprimirAF(simbEntrada,transiciones,simbPila);
			}
			else{
				alert(esS);
				alert(esQ);
				alert(esLL1);
			}
		}
	}
	console.log(transiciones);
}

function construyeGramatica(){
	var k = 0;
	var l = 0;
	var sub = "";
	var subPro = [];
	var produccion = [];
	for (var i = 1; i < numProdu; i++) {
		produccion = [];
		subPro = [];
		l = 0;
		produccion[0] = document.getElementById("n"+i).value;
		produccion[1] = document.getElementById("t"+i).value;
		for (var j = 0; j < produccion[1].length; j++) {
			sub = "";
			if (produccion[1][j] == "<") {
				while(produccion[1][j] != ">"){
					sub += produccion[1][j];
					j++;
				}sub += produccion[1][j];
				subPro[l] = sub;
				l++;
			}else{
				subPro[l] = produccion[1][j];
				l++;
			}
		}
		for (var u = 0; u < subPro.length; u++) {
			produccion[u+1] = subPro[u];
		}
		gramatica[k] = produccion;
		k++;
	}
}

function valida(){
	for (var i = 0; i < gramatica.length; i++) {
		if (gramatica[i][0] == "") return "El lado izquierdo de la producción "+(i+1)+" está vacío";
		if (gramatica[i][1] == "") return "El lado derecho de la producción "+(i+1)+" está vacío";
		if (validaAntilambda(i)) return "Verifique el correcto cierre de <> en la producción "+(i+1);
		if (gramatica[i][0] == gramatica[i][1]) return "La gramática es recursiva a sí misma, no es ni S, ni Q, ni P";
	}
	return true;
}

function identifica(){
	var k = 0;
	var m = 0;
	var l = 0;
	var noTerminales1 = [];
	for (var i = 0; i < gramatica.length; i++) {
		if (noTerminales1.includes(gramatica[i][0]) == false) noTerminales1.push(gramatica[i][0]);
	}
	for (var i = 0; i < gramatica.length; i++) {
		for (var j = 1; j < gramatica[i].length; j++) {
			if(gramatica[i][j][0] == "<"){
				if(noTerminales.includes(gramatica[i][j]) == false){
					noTerminales[k] = gramatica[i][j];
					k++;
				}
			}else{
				if(terminales.includes(gramatica[i][j]) == false && gramatica[i][j] != "@"){
					terminales[l] = gramatica[i][j];
					l++;
				}if (j != 1 && tAlfa.includes(gramatica[i][j]) == false) {
						tAlfa[m] = gramatica[i][j];
						m++;
					}
			}
		}
	}
	return noTerminales1;
}

function arraysIguales(a, b) {
	for (var i = 0; i < b.length; i++) {
		if(a.includes(b[i]) == false) return false;
	}
	return true
}

function validaAntilambda(i){
	var p = new pila();
	var c;
	for (var j = 0; j < gramatica[i][1].length; j++) {
		c = gramatica[i][1][j];
		if (c == "<") p.apilar(c);
		if (c == ">") {
			var aux = p.desapilar();
			if (aux == null) return false;
		}
	}	
}

function validaS(){
	var nt1 = "";
	var nt2 = "";
	for (var i = 0; i < gramatica.length; i++) {
		if (gramatica[i][1].length > 1) return "No es S: el lado derecho de la producción "+(i+1)+" no empieza con un Terminal";
		if (gramatica[i][1] == "@") return "No es gramática S: el lado derecho de la producción "+(i+1)+" es lambda";
		for (var j = 0; j < gramatica.length; j++) {
			if (i != j) {
				if (gramatica[i][0] == gramatica[j][0]) {
					nt1 = encuentraFinAntilambda(gramatica[i][1]);
					nt2 = encuentraFinAntilambda(gramatica[j][1]);
					if (nt1 == nt2){
						return "No es gramática S: el primer NT del lado derecho de las producciones "+(i+1)+" y "+(j+1)+" son el mismo";
					} 
				}
			}
		}
	}
	return true;
}

function validaQ(){
	var nt1 = "";
	var nt2 = "";
	var sgt = [];
	for (var i = 0; i < gramatica.length; i++) {
		if (gramatica[i][1].length > 1) return "No es Q: el lado derecho de la producción "+(i+1)+" no empieza con un Terminal";
		if (gramatica[i][1] == "@"){
			if(!verificaConjSeleccion(gramatica[i][0])) {
				return "No es gramática Q: los conjuntos de selección del NT "+gramatica[i][0]+" no son disyuntos";
			}
		} 
		for (var j = 0; j < gramatica.length; j++) {
			if (i != j) {
				if (gramatica[i][0] == gramatica[j][0]) {
					nt1 = encuentraFinAntilambda(gramatica[i][1]);
					nt2 = encuentraFinAntilambda(gramatica[j][1]);
					if (nt1 == nt2){
						return "No es gramática Q: el primer NT del lado derecho de las producciones "+(i+1)+" y "+(j+1)+" son el mismo";
					} 
				}
			}
		}
	}
	return true;
}

function validaLL1(){
	for (var i = 0; i < gramatica.length; i++) {
		verificaConjSeleccion(gramatica[i][0]);
	}
	return true;
}

function creaAPS(){
	var cont = 0;
	simbEntrada = terminales;
	simbEntrada.push("%");

	simbPila = noTerminales;
	for (var i = 0; i < tAlfa.length; i++) {
		if (simbPila.includes(tAlfa[i]) == false) simbPila.push(tAlfa[i]);
	}
	simbPila.push("#");
	/*Transiciones = [número de transición;
	 				 [0,x] = replace(x), 1 = apile, 2 = desapile, 3 = N/A;
	 				  0 = retenga, 1 = avance, 2 = acepte, 3 = rechace;
	 				 símbolo en tope de la pila;
	 				 símbolo de entrada]
	
	*/
	configInicial = "#"+gramatica[0][0];
	var desc;
	var r
	for (var i = 0; i < gramatica.length; i++) {
		if (gramatica[i][1] == "@") {
			for (var k = 0; k < simbEntrada.length; k++) {
				if(arraySeleccion[i].includes(simbEntrada[k])){
					transiciones.push([cont,2,0,gramatica[i][0],simbEntrada[k]]);
					cont++;
				}
			}
			
		}else if(simbEntrada.includes(gramatica[i][1])){
			r = arrayAlReves(gramatica[i].slice(2));
			if(r == null) desc = 2;
			else{
				desc = [0];
				for (var k = 0; k < r.length; k++) {
					desc.push(r[k]);
				}
				if (desc.length == 1) desc = 2;
			} 
			transiciones.push([cont,desc,1,gramatica[i][0],gramatica[i][1]]);
			cont++;
		}else{
			for (var k = 0; k < simbEntrada.length; k++) {
				if(arraySeleccion[i].includes(simbEntrada[k])){
					r = arrayAlReves(gramatica[i].slice(1)).join("");
					if(r == null) desc = 2;
					else desc = [0,r];
					transiciones.push([cont,desc,0,gramatica[i][0],simbEntrada[k]]);
					cont++;
				}
			}
		}
	}
	for (var i = 0; i < tAlfa.length; i++) {
		desc = 2;
		transiciones.push([cont,desc,1,tAlfa[i],tAlfa[i]]);
		cont++;
	}
	transiciones.push([cont,3,2,"#","%"]);
}

function arrayAlReves(arr){
	if (arr == null) return null;
	var newArray = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		newArray.push(arr[i]);
	}
	return newArray;
}

function verificaConjSeleccion(nt){
	var arrSelNula = "";
	var k = 0;
	for (var i = 0; i < arraySeleccion.length; i++) {
		if(gramatica[i][0] == nt){
			arrSelNula += arraySeleccion[i].join("");
			k++;
		}
	}
	if (!sonDisyuntos(arrSelNula)) {
		
		return false;
	}
	return true;
}

function sonDisyuntos(arr){
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			for (var k = 0; k < arr.length; k++) {
				if(i != k){
					if(arr[k].includes(arr[i][j])) return false;
				}
			}
		}
	}
	return true;
}

function seleccion(){
	for (var i = 0; i < gramatica.length; i++) {
		if (proAnulables.includes(i)) {
			var ind = noTerminales.indexOf(gramatica[i][0]);
			var pri = primerosPro(gramatica[i]).split("");
			var aux = [];
			if(pri[0] != null){
				for (var k = 0; k < pri.length; k++) {
					if(arraySiguientes[ind].includes(pri[k]) == false){
						aux.push(pri[k]);
					}
				}
			}
			arraySeleccion[i] = aux.concat(arraySiguientes[ind]);
		}
		else arraySeleccion[i] = primerosPro(gramatica[i]).split("");
	}
	
}

function siguientes(){
	for (var i = 0; i < noTerminales.length; i++) {
		arraySiguientes[i] = siguientesIndv1(noTerminales[i]);
	}while(!buscaNTEnSiguientes()){
		simplificaSiguientes();
	}
}

function buscaNTEnSiguientes(){
	for (var i = 0; i < arraySiguientes.length; i++) {
		for (var j = 0; j < arraySiguientes[i].length; j++) {
			if (arraySiguientes[i][j].length > 1) return false;
		}
	}
	return true;
}

function simplificaSiguientes(){
	var sig = "";
	var nt;
	for (var i = 0; i < arraySiguientes.length; i++) {
		for (var j = 0; j < arraySiguientes[i].length; j++) {
			if (arraySiguientes[i][j].length > 1) {
				nt = noTerminales.indexOf(arraySiguientes[i][j]);
				if (i == noTerminales.indexOf(arraySiguientes[i][j])) {
					arraySiguientes[i].splice(j,1);
					j--;
				}else {
					for (var k = 0; k < arraySiguientes[nt].length; k++) {
						if (arraySiguientes[i].includes(arraySiguientes[nt][k]) == false) {
							arraySiguientes[i].push(arraySiguientes[nt][k]);
						}
					}
					arraySiguientes[i].splice(j,1);
				} 
			}
		}
	}
}

function siguientesIndv1(nt){
	var activo = false;
	var pros;
	var sgnts = [];
	if (gramatica[0][0] == nt) sgnts.push("%");
	for (var i = 0; i < gramatica.length; i++) {
		for (var j = 1; j < gramatica[i].length; j++) {
			if (gramatica[i][j] == nt) {
				activo = true;
			}
			if(activo == true){
				if (gramatica[i][0] != nt) {
					if (gramatica[i][j+1] == null && gramatica[i][0] != nt){
						if (gramatica[i][j].length > 1) {
							if (sgnts.includes(gramatica[i][0]) == false) sgnts.push(gramatica[i][0]);
							activo = false;
						}
					} 
				}
				if (gramatica[i][j+1] != null){
					if (gramatica[i][j+1].length > 1) {
						pros = primerosNT(gramatica[i][j+1]).split("");
						for (var k = 0; k < pros.length; k++) {
							if (sgnts.includes(pros[k]) == false) sgnts.push(pros[k]);
						}
						if (ntAnulables.includes(gramatica[i][j+1]) == false) {
							activo = false;
						}
					}else{
						if (sgnts.includes(gramatica[i][j+1]) == false) sgnts.push(gramatica[i][j+1]);
						activo = false;
					}
				}
			}
		}
		activo = false;
	}
	return sgnts;
}

function primerosPro(p){
	var pri = "";
	var i = 1;
	if (p[1][0] == "@") return ""; 
	if (p[1][0] != "<") return p[1];
	while(p[i] != null){
		if (p[i].length == 1) {
			pri += p[i];
			break;
		}else if (i ==1 && p[0] == p[1]) {}
		else{
			pri += primerosNT(p[i]);
			if(ntAnulables.includes(p[i]) == false) break;
			if(p[i][0] != "<") {
				pri += p[i];
				break;
			}
		}
		i++;
	}
	return pri;
}

function primerosNT(nt){
	var pri = "";
	var j;
	for (var i = 0; i < gramatica.length; i++) {
		j = 0;
		if(gramatica[i][0] == nt){
			pri += primerosPro(gramatica[i]);
		}
	}
	return pri;
}

function produccionAnulable(l){
	var nts;
	var an = true;
	if(l != null){
		if (gramatica[l][1] == "@") return true;
		for (var j = 1; j < gramatica[l].length; j++) {
			if(gramatica[l][j][0] == "<"){
				if(ntAnulables.includes((gramatica[l][0])) == false){
					if (ntAnulable(gramatica[l][j], l) == false) return false;
				} 
			}else{
				return false;
			}
		}
	}else{
		for (var i = 0; i < gramatica.length; i++) {
			if(gramatica[i][1] == "@"){
				proAnulables.push(i);
				ntAnulables.push(gramatica[i][0]);
			}
		}
		for (var i = 0; i < gramatica.length; i++) {
			an = true;
			for (var j = 1; j < gramatica[i].length; j++) {
				if (gramatica[i][j].length > 1) {
					if (ntAnulables.includes(gramatica[i][j]) == false) {
						if (ntAnulable(gramatica[i][j]) == false) {
							an = false;
							break;
						}
						
					}
				}else if (gramatica[i][j] != "@"){
					an = false;
					break;
				}
			}
			if (proAnulables.includes(i) == false && an == true) {
				proAnulables.push(i);
				if (ntAnulables.includes(gramatica[i][0]) == false) ntAnulables.push(gramatica[i][0]);
			}
		}
	}
	return true;
}

function ntAnulable(nt){
	var k = 0;
	for (var i = 0; i < gramatica.length; i++) {
		if(gramatica[i][0] == nt){
			if (proAnulables.includes(i)) {
				if(ntAnulables.includes(gramatica[i][0]) == false) ntAnulables.push(gramatica[i][0]);
				return true;
			}else if(produccionAnulable(i)) {
				ntAnulables[k] = gramatica[i];
				k++;
			}
		}
	}
	return false;
}


function encuentraFinAntilambda(produccion){
	var k = 0; var j = 0;
	var nt = "";
	var p = new pila();
	do {
		nt += produccion[j];
		if (produccion[j] == "<") {
			p.apilar("<");
		}
		if (produccion[j] == ">") {
			p.desapilar();
		}
		j++;
		k++;
	} while (p.esVacia() == false);
	return nt;
}

function verifica(){
	var hilera = document.getElementById("hilera").value;
	var transicion;
	pilaAuto = new pila();
	pilaAuto.apilar(gramatica[0][0]);
	for (var i = 0; i < hilera.length; i++) {
		transicion = buscaTransicion(hilera[i]);
		ejecutaOperacion(transicion[1],hilera[i]);
		if (transicion[2] == 0) i--;
		else if (transicion[2] == 2) {
			alert("Hilera reconocida satisfactoriamente");
			return;
		}else if (transicion[2] == 3){
			alert("Error, hilera incorrecta");
			return;
		}
	}
	if(pilaAuto.esVacia()){
		alert("Hilera reconocida satisfactoriamente");
		return;
	}else{
		alert("Error, hilera incorrecta");
		return;
	}

}

function buscaTransicion(carEntrada){
	for (var i = 0; i < transiciones.length; i++) {
		if(transiciones[i][3] == pilaAuto.retornaPrimero().retornaDato() && transiciones[i][4] == carEntrada){
			return transiciones[i];
		}
	}
}

function ejecutaOperacion(t1,c){
	if(t1 == 1){
		pilaAuto.apilar(c);
	}else if (t1 == 2){
		pilaAuto.desapilar();
	}else if (t1.length > 1){
		pilaAuto.replace(t1);
	}
}
/*Transiciones = [número de transición;
	 				 [0,x] = replace(x), 1 = apile, 2 = desapile, 3 = N/A;
	 				  0 = retenga, 1 = avance, 2 = acepte, 3 = rechace;
	 				 símbolo en tope de la pila;
	 				 símbolo de entrada]
	
	*/

function imprimirTransiciones(){
	var container = document.getElementById("containerTran");	
	for (var i = 0; i < transiciones.length; i++) {
		var elem = document.createElement('label');
		var msg = i+": ";

		if (transiciones[i][1].length > 1) {
			msg += "replace("+transiciones[i][1].slice(1)+"), ";
		}else if (transiciones[i][1] == 1) msg += "apile, ";
		else if (transiciones[i][1] == 2) msg += "desapile, ";

		if (transiciones[i][2] == 0) msg += "retenga";
		else if (transiciones[i][2] == 1) msg += "avance";
		else if (transiciones[i][2] == 2) msg += "acepte";
		else if (transiciones[i][2] == 3) msg += "rechace";

		elem.innerText = msg;    
		container.appendChild(elem);
		var br = document.createElement('br');
		container.appendChild(br);
	}
}

function ImprimirAF(arraySimbol, vector, arrayCol) {

	var container = document.getElementById("container");
	var principalContainer = document.createElement('div');
	var child;
	var columnContainer;

	columnContainer = document.createElement('div');
		var valueSimbol = ".......";
		var simbol = document.createTextNode(valueSimbol);
		child = document.createElement('div');
		child.setAttribute("class", "tableDark")
		child.appendChild(simbol);
		columnContainer.appendChild(child);
		columnContainer.setAttribute("class", "columnContainerDark")
	for (rowSimbol = 0; rowSimbol < arraySimbol.length; rowSimbol++) {
		var valueSimbol = arraySimbol[rowSimbol];
		var simbol = document.createTextNode(valueSimbol);
		child = document.createElement('div');
		child.setAttribute("class", "tableDark");
		child.appendChild(simbol);
		columnContainer.appendChild(child);
		columnContainer.setAttribute("class", "columnContainer")
	};
	principalContainer.appendChild(columnContainer);

	for (var row = 0; row < arrayCol.length; row++) {

		lengColumn = arraySimbol.length;

		columnContainer = document.createElement('div');
		for (var column = 0; column < lengColumn+1; column++) {
			var elem = document.createElement('label');
			child = document.createElement('div');
			if(column == 0){
				elem.innerText = simbPila[row];
				child.setAttribute("class", "tableDark");
			}else{
				elem.innerText = buscarTransicion(row,column);
				child.setAttribute("class", "table");
			}

			child.appendChild(elem);
			columnContainer.appendChild(child);
			columnContainer.setAttribute("class", "columnContainer")
		}
		principalContainer.appendChild(columnContainer);
	}
	
	container.appendChild(principalContainer);
	container.setAttribute("class", "cont")
};

function buscarTransicion(entrada,pila){
	entrada = simbEntrada[entrada];
	pila = simbPila[pila-1];
	for (var i = 0; i < transiciones.length; i++) {
		if(transiciones[i][3] == pila && transiciones[i][4] == entrada) return transiciones[i][0];
	}
	return "";
}