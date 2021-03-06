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
	
	var steps = [];
	var open = false;

	function addStep(hops, time){				//Funktion som lägger till mäsksteg i arrayen och i listan.
		steps.push([hops,time]);
		updateSteps();
	}

	function updateSteps(){						//Funktion som skriver ut alla steg som finns i arrayen i en lista med ett kryss efter..
		document.getElementById('steps').innerHTML = "";
		for(var i = 0; i < steps.length; i++){
			var newParagraph = document.createElement('p');
			newParagraph.textContent = "Steg " + (i+1) + " " + steps[i][0] + "  Läggs i " + steps[i][1] + " min innan slut";
			var spanDelete = document.createElement("span");
		    spanDelete.id = i;
		    spanDelete.className = "delete";
		    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";
		    spanDelete.onclick = function(){
		    	deleteStep(this.id);
		    }
		    newParagraph.appendChild(spanDelete);
			document.getElementById('steps').appendChild(newParagraph);
		}
	}

	function deleteStep(id){					//Funktion som tar bort ett värde i arrayen och sedan kallar på en funktion som skriver ut arrayen igen.
		steps.splice(id,1);
		updateSteps();
	}

	function checkName(free){					//Funktion som lägger till schemat i databasen om namnet är ledigt.
		if(free == "success"){
			document.getElementById('name').style.backgroundColor = "white";
			alert("Namnet är ledigt");
			if(steps){
				var XHR = new XMLHttpRequest();
				XHR.onreadystatechange = function(){
					if (XHR.readyState == 4 && XHR.status == 200) {
		                alert(XHR.responseText);
		            }
		        }
		        XHR.open("GET", "kokschema.php?type=saveSchedule&name="+document.getElementById('name').value+"&array="+JSON.stringify(steps)+"&total="+document.getElementById('boilTime').value, true);
		        XHR.send();
	    	}
		}
		else{
			if (open){							//Om man har öppnat från databas så visas en div.
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
		XHR.open("GET", "kokschema.php?type=delete&name="+document.getElementById('name').value, true);
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
			XHR.open("GET", "kokschema.php?type=checkName&name="+name.value, true);
			XHR.send();
		}
		else{
			name.style.backgroundColor = "#FF4D4D";
			name.focus();
		}
	}

	function validateTotalTime(totalTime){				//Funktion som kollar så tiden är en siffra över 0.
		if(totalTime.value != ""){
			if(/^\d+$/.test(totalTime.value) && totalTime.value > 0){
				totalTime.style.backgroundColor = "white";
				return true;
			}
			else{
				totalTime.focus();
				totalTime.style.backgroundColor = "#FF4D4D";
				return false;
			}
		}
		else{
			totalTime.focus();
			totalTime.style.backgroundColor = "#FF4D4D";
			return false;
		}
	}

	function validateHops(hops){				//Funktion som kollar så temperaturen är en siffra mellan 0 och 100.
		if(hops.value != "" && /^[a-zA-ZåäöÅÄÖ0-9]+$/.test(hops.value)){
			hops.style.backgroundColor = "white";
			return true;
		}
		else{
			hops.focus();
			alert("Inga mellanslag");
			hops.style.backgroundColor = "#FF4D4D";
			return false;
		}
	}
	
	function validateTime(time){				//Funktion som kollar så tiden är en siffra över 0.
		if(time.value != ""){
			if(/^\d+$/.test(time.value) && time.value > 0 && parseInt(time.value) <= parseInt(document.getElementById('boilTime').value)){
				time.style.backgroundColor = "white";
				return true;
			}
			else{
				time.focus();
				time.style.backgroundColor = "#FF4D4D";
				return false;
			}
		}
		else{
			time.focus();
			time.style.backgroundColor = "#FF4D4D";
			return false;
		}
	}

	function validateTemp(temp){				//Funktion som kollar så temperaturen är en siffra mellan 0 och 100.
		if(temp.value != ""){
			if(/^\d+$/.test(temp.value) && temp.value > 0){
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

	addEvent(document.getElementById('boilTime'), 'keypress', function(e){		//Event som skickar användaren vidare till time-fältet
		if(e.keyCode == 13){												//när man är i temp-fältet och trycker Enter.
			document.getElementById('hops').focus();
		}
	});

	addEvent(document.getElementById('hops'), 'keypress', function(e){		//Event som skickar användaren vidare till time-fältet
		if(e.keyCode == 13){												//när man är i temp-fältet och trycker Enter.
			e.preventDefault();
			document.getElementById('time').focus();
		}
	});

	addEvent(document.getElementById('newStep'),'submit',function(e){	//Event som lyssnar på submitknappen och gör alla checkar för att sedan
		e.preventDefault();
		if (validateTotalTime(document.getElementById('boilTime'))){
			if(validateHops(document.getElementById('hops'))){				//lägga till steget i listan.
				if(validateTime(document.getElementById('time'))){
					addStep(document.getElementById('hops').value, document.getElementById('time').value);
					document.getElementById('hops').value = "";
					document.getElementById('hops').focus();
					document.getElementById('time').value = "";
				}
			}
		}
	});

	addEvent(document.getElementById('saveScheme'), 'click', function(e){	//Event som lyssnar på "spara schema"-knappen och kollar då så namnet är
		validateName(document.getElementById('name'));						//unikt innan det sparas till databasen.
	});

	addEvent(document.getElementById('openScheme'), 'click', function(e){	//Event som lyssnar på "öppna schema"-knappen och skapar sedan en lista
		getSchemes();														//av knappar av alla scheman som ligger i databasen.
	});

	function getSchemes(){
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if (XHR.readyState == 4 && XHR.status == 200) {
                str = XHR.responseText;
                var list = str.match(/(\w+)/ig);
                document.getElementById('list').style.display = "initial";
                document.getElementById('steps').innerHTML = "";
                document.getElementById('name').value = "";
                document.getElementById('name').backgroundColor = "white";
                document.getElementById('hops').value = "";
                document.getElementById('hops').backgroundColor = "white";
                document.getElementById('boilTime').value = "";
                document.getElementById('boilTime').backgroundColor = "white";
                document.getElementById('time').value = "";
                document.getElementById('time').backgroundColor = "white";
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
        XHR.open("GET", "kokschema.php?type=getList", true);
        XHR.send();
	}

	function deleteScheme(name){
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				alert(XHR.responseText);
				getSchemes();
			}
		}
		XHR.open("GET", "kokschema.php?type=delete&name="+name, true);
		XHR.send();
	}

	function loadScheme(name){												//Funktion som körs när man tryckt på en knapp till ett schema 
		steps = [];															//som sedan tar bort knapparna och lägger fram shemat på ett snyggt sätt.
		open = true;
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				str = XHR.responseText;
				var scheme = str.match(/\w+/ig);
				document.getElementById('name').value = scheme.shift();
				document.getElementById('name').style.backgroundColor = "white";
				document.getElementById('boilTime').value = scheme.shift();
				document.getElementById('boilTime').style.backgroundColor = "white";
				document.getElementById('list').innerHTML = "";
				document.getElementById('list').style.display = "none";
				for(var i = 0; i < (scheme.length)/2; i++){
					addStep(scheme[i], scheme[i+((scheme.length)/2)]);
				}
			}
		}
		XHR.open("GET", "kokschema.php?type=getSchedule&name="+name, true);
		XHR.send();
	}

	addEvent(document.getElementById('upLoadScheme'), 'click', function(e){		//Event som lyssnar på "ladda upp"-knappen och skickar namnet och
		var XHR = new XMLHttpRequest();											//alla steg till php.
		if(document.getElementById('name').value != "" && (/^[a-zA-ZåäöÅÄÖ0-9]+$/.test(document.getElementById('name').value))){
			if(steps){
				if(validateTotalTime(document.getElementById('boilTime'))){
					if(validateTemp(document.getElementById('boilTemp'))){
						XHR.onreadystatechange = function(){
							if(XHR.readyState == 4 && XHR.status == 200){
								alert(XHR.responseText);
							}
						}
						XHR.open("GET", "kokschema.php?type=upLoad&name="+document.getElementById('name').value+"&array="+JSON.stringify(steps)+"&temp="+document.getElementById('boilTemp').value+"&total="+document.getElementById('boilTime').value+"&wElements="+document.getElementById('warmingUp').value+"&mWarm="+document.getElementById('mHeating').value, true);
						XHR.send();
					}
				}
				else{
					alert("Otillåten tid");
				}
			}
			else{
				alert("Inga steg");
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