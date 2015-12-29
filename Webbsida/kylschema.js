function loadEvent(fn) {						//Funktion so gör det möjligt att ladda flera funktioner när sidan laddas.
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = fn;
	}
	else {
		window.onload = function() {
			oldonload();
			fn();
		}
	}
}

var regEvent=(function(){						//Funktion som gör att man kan ska event som funkar i både IE och moderna webbläsare utan något extra arbete.
	var elem=document.createElement('div');
	if(elem.addEventListener){
		return function(elem, eventName, fn){
			elem.addEventListener(eventName, fn, false);
		}
	}
	else if(elem.attachEvent){
		return function(elem, eventName, fn){
			elem.attachEvent('on'+eventName, fn);
		}
	}
})();

function addEvent(elem, eventName, fn){			//Funktion man använder för att lägga till nya event så det automatiskt funker i IE också.
	var cb=(function(){
		return function(event){
			fn.call(this, normaliseEvent(event || window.event));
		}
	})();
	regEvent(elem, eventName, cb);
}

function normaliseEvent(event) {				//Funktion som normaliserar events.
	if (!event.stopPropagation) {
		event.stopPropagation = function() {this.cancelBubble = true;};
		event.preventDefault = function() {this.returnValue = false;};
	}
	if (!event.stop) {
		event.stop = function() {
			this.stopPropagation();
			this.preventDefault();
		};
	}
	if (event.srcElement && !event.target) {
			event.target = event.srcElement;
	}
	return event;
}

loadEvent(function(){							//Alla funktioner innanför här laddas in samtidigt som sidan.
	var open = false;							//Bool som kollar om man har öppnat ett schema från databasen eller inte.

	function checkName(free){					//Funktion som lägger till schemat i databasen om namnet är ledigt.
		if(free == "success"){
			document.getElementById('name').style.backgroundColor = "white";
			alert("Namnet är ledigt");
			if(validateTemp(document.getElementById('temp'))){
				var XHR = new XMLHttpRequest();
				XHR.onreadystatechange = function(){
					if (XHR.readyState == 4 && XHR.status == 200) {
		                alert(XHR.responseText);
		            }
		        }
		        XHR.open("GET", "kylschema.php?type=saveSchedule&name="+document.getElementById('name').value+"&temp="+document.getElementById('temp').value, true);
		        XHR.send();
	    	}
		}
		else{
			if(open){							//Om man har öppnat från databas så visas en div.
				document.getElementById('edited').style.display = "initial";
			}
			else{
				alert("Namnet är upptaget");
				document.getElementById('name').style.backgroundColor = "#FF4D4D";
				document.getElementById('name').focus();
			}
		}
	}

	addEvent(document.getElementById('yes'), 'click', function(e){			//Tar bort nuvarande schema i databasen och lägger till den med nya värden.
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				alert(XHR.responseText);
				document.getElementById('edited').style.display = "none";
				open = false;
				checkName("success");
			}
		}
		XHR.open("GET", "kylschema.php?type=delete&name="+document.getElementById('name').value, true);
		XHR.send();
	});

	addEvent(document.getElementById('no'), 'click', function(e){		//Gömmer en div och visar att man borde byta namn.	
		document.getElementById('edited').style.display = "none";
		document.getElementById('name').style.backgroundColor = "#FF4D4D";
		document.getElementById('name').focus();
	});

	function validateName(name){				//Funktion som kollar om namnet är giltligt och sedan om det redan finns i databasen.
		if(name.value != "" && (/^[a-zA-ZåäöÅÄÖ0-9]+$/.test(name.value))){
			var XHR = new XMLHttpRequest();
			XHR.onreadystatechange = function(){
				if (XHR.readyState == 4 && XHR.status == 200) {
					checkName(XHR.responseText);
				}
			};
			XHR.open("GET", "kylschema.php?type=checkName&name="+name.value, true);
			XHR.send();
		}
		else{
			name.style.backgroundColor = "#FF4D4D";
			name.focus();
		}
	}

	function validateTemp(temp){				//Funktion som kollar så temperaturen är en siffra mellan 0 och 100.
		if(temp.value != ""){
			if(/^\d+$/.test(temp.value) && temp.value > 0 && temp.value <= 100){
				temp.style.backgroundColor = "white";
				return true;
			}
			else{
				temp.focus();
				temp.style.backgroundColor = "#FF4D4D";
				return false;
			}
		}
		else{
			temp.focus();
			temp.style.backgroundColor = "#FF4D4D";
			return false;
		}
	}

	addEvent(document.getElementById('name'), 'keypress', function(e){		//Event som trycker på en knapp när man trycker enter.
		if(e.keyCode == 13){
			document.getElementById('temp').focus();
		}
	});

	addEvent(document.getElementById('saveScheme'), 'click', function(e){	//Event som lyssnar på "spara schema"-knappen och kollar då så namnet är
		validateName(document.getElementById('name'));						//unikt innan det sparas till databasen.
	});

	addEvent(document.getElementById('openScheme'), 'click', function(e){	//Event som lyssnar på "öppna schema"-knappen och skapar sedan en lista
		getSchemesList();													//av knappar av alla scheman som ligger i databasen.
	});

	function getSchemesList(){
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if (XHR.readyState == 4 && XHR.status == 200) {
                str = XHR.responseText;
                var list = str.match(/(\w+)/ig);
                document.getElementById('list').style.display = "initial";
                document.getElementById('name').value = "";
                document.getElementById('name').backgroundColor = "white";
                document.getElementById('temp').value = "";
                document.getElementById('temp').backgroundColor = "white";
                document.getElementById('list').innerHTML = "";
				for(var i = 0; i < list.length; i++){
					var newParagraph = document.createElement('p');
					var newButton = document.createElement('button');
					newButton.id = "listButton"+i;
					newButton.onclick = function(){
						loadScheme(this.textContent);
					}
					newButton.textContent = list[i];
					var spanDelete = document.createElement("span");
				    spanDelete.id = list[i];
				    spanDelete.className = "delete";
				    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";
				    spanDelete.onclick = function(){
				    	deleteScheme(this.id);
				    }
					newParagraph.appendChild(newButton)
					newParagraph.appendChild(spanDelete);
					
					document.getElementById('list').appendChild(newParagraph);
				}
            }
        }
        XHR.open("GET", "kylschema.php?type=getList", true);
        XHR.send();
	}

	function deleteScheme(name){
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				alert(XHR.responseText);
				getSchemesList();
			}
		}
		XHR.open("GET", "kylschema.php?type=delete&name="+name, true);
		XHR.send();
	}

	function loadScheme(name){												//Funktion som körs när man tryckt på en knapp till ett schema 
		open = true;														//som sedan tar bort knapparna och lägger fram shemat på ett snyggt sätt.
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				str = XHR.responseText;
				var scheme = str.match(/\w+/ig);
				document.getElementById('name').value = scheme[0];
				document.getElementById('name').style.backgroundColor = "white";
				document.getElementById('temp').value = scheme[1];
				document.getElementById('temp').style.backgroundColor = "white";
				document.getElementById('list').innerHTML = "";
				document.getElementById('list').style.display = "none";
			}
		}
		XHR.open("GET", "kylschema.php?type=getSchedule&name="+name, true);
		XHR.send();
	}

	addEvent(document.getElementById('upLoadScheme'), 'click', function(e){		//Event som lyssnar på "ladda upp"-knappen och skickar namnet och
		var XHR = new XMLHttpRequest();											//alla steg till php.
		if(document.getElementById('name').value != "" && (/^[a-zA-ZåäöÅÄÖ0-9]+$/.test(document.getElementById('name').value))){
			if(document.getElementById('temp').value != ""){
				XHR.onreadystatechange = function(){
					if(XHR.readyState == 4 && XHR.status == 200){
						alert(XHR.responseText);
					}
				}
				XHR.open("GET", "kylschema.php?type=upLoad&name="+document.getElementById('name').value+"&temp="+document.getElementById('temp').value, true);
				XHR.send();
			}
			else{
				alert("Fyll i temperatur");
			}
		}
		else{
			alert("Otillåtet namn");
		}
	});

	addEvent(document.getElementById('mainMenu'), 'click', function(e){
		window.location.href = "index.html";
	});
});