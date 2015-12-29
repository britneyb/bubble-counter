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
	var loadedScheme = "";
    g = new Dygraph(document.getElementById("graphdiv"),"");

	addEvent(document.getElementById('openLog'), 'click', function(e){		//Event som lyssnar på "öppna logg"-knappen och skapar sedan en lista
		getLogList();														//av knappar av alla loggar som ligger i databasen.
	});

	function getLogList(){
		var XHR = new XMLHttpRequest();
		XHR.onreadystatechange = function(){
			if (XHR.readyState == 4 && XHR.status == 200) {
                var list = JSON.parse(XHR.responseText);
                document.getElementById('list').innerHTML = "";
                document.getElementById('list').style.display = "initial";
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
        XHR.open("GET", "graphLog.php?type=getLogs", true);
        XHR.send();
	}

	function deleteScheme(name){
		var XHR = new XMLHttpRequest();
		var date = name.match(/(\d+\/\d+\/\d+ \d+:\d+)/ig);
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				alert(XHR.responseText);
				getLogList();
			}
		}
		XHR.open("GET", "graphLog.php?type=deleteLog&date="+date, true);
		XHR.send();
	}

	function loadScheme(name){												//Funktion som körs när man tryckt på en knapp till en logg 
		var XHR = new XMLHttpRequest();										//som sedan tar bort knapparna och lägger fram loggen på ett snyggt sätt.
		var date = name.match(/(\d+\/\d+\/\d+ \d+:\d+)/ig);
		XHR.onreadystatechange = function(){
			if(XHR.readyState == 4 && XHR.status == 200){
				var arr = JSON.parse(XHR.responseText);
				var scheme = arr[0];
				var data = arr[1];
				var str = "Minutes,Temperature\n";
				for(var i = 0; i < data.length; i++) {
					str += data[i]+"\n";
				};
				g = new Dygraph(document.getElementById("graphdiv"),str,{
					title: 'Temperature (C)',
					ylabel: 'Temperature (C)',
					xlabel: 'Minutes',
				});
				document.getElementById('name').innerHTML = "<b>Name:</b> "+scheme[1];
					document.getElementById('date').innerHTML = " <b>Datetime:</b> "+scheme[2];
					document.getElementById('type').innerHTML = " <b>Type:</b> "+scheme[3];
					if(scheme[4] != null)
						document.getElementById('elementHeating').innerHTML = " <b>Number of elements:</b> "+scheme[4];
					else
						document.getElementById('elementHeating').innerHTML = "";
					if(scheme[5] != null)
						document.getElementById('elementKeepWarm').innerHTML = " <b>Number of randomelements:</b> "+scheme[5];
					else
						document.getElementById('elementKeepWarm').innerHTML = "";
					document.getElementById('list').innerHTML = "";
					document.getElementById('list').style.display = "none";
			}
		}
		XHR.open("GET", "graphLog.php?type=loadLog&date="+date, true);
		XHR.send();
	}

	function updateLog(){
		if(loadedScheme != ""){
			var XHR = new XMLHttpRequest();
			XHR.onreadystatechange = function(){
				if(XHR.readyState == 4 && XHR.status == 200){
					var arr = JSON.parse(XHR.responseText);
					var scheme = arr[0];
					var data = arr[1];
					var str = "Minutes,Temperature\n";
					for(var i = 0; i < data.length; i++) {
						str += data[i]+"\n";
					};
					g = new Dygraph(document.getElementById("graphdiv"),str,{
						title: 'Temperature (C)',
						ylabel: 'Temperature (C)',
						xlabel: 'Minutes',
					});
					document.getElementById('name').innerHTML = "<b>Name:</b> "+scheme[1];
					document.getElementById('date').innerHTML = " <b>Datetime:</b> "+scheme[2];
					document.getElementById('type').innerHTML = " <b>Type:</b> "+scheme[3];
					if(scheme[4] != null)
						document.getElementById('elementHeating').innerHTML = " <b>Number of elements:</b> "+scheme[4];
					else
						document.getElementById('elementHeating').innerHTML = "";
					if(scheme[5] != null)
						document.getElementById('elementKeepWarm').innerHTML = " <b>Number of randomelements:</b> "+scheme[5];
					else
						document.getElementById('elementKeepWarm').innerHTML = "";
				}
			}
			XHR.open("GET", "graphLog.php?type=loadLog&date="+loadedScheme, true);
			XHR.send();
		}
	}

	setInterval(updateLog, 1000*60);

	addEvent(document.getElementById('openCurrent'), 'click', function(e){
		var XHR = new XMLHttpRequest();
			XHR.onreadystatechange = function(){
				if(XHR.readyState == 4 && XHR.status == 200){
					var arr = JSON.parse(XHR.responseText);
					var scheme = arr[0];
					var data = arr[1];
					var str = "Minutes,Temperature\n";
					for(var i = 0; i < data.length; i++) {
						str += data[i]+"\n";
					};
					g = new Dygraph(document.getElementById("graphdiv"),str,{
						title: 'Temperature (C)',
						ylabel: 'Temperature (C)',
						xlabel: 'Minutes',
					});
					document.getElementById('name').innerHTML = "<b>Name:</b> "+scheme[1];
					document.getElementById('date').innerHTML = " <b>Datetime:</b> "+scheme[2];
					loadedScheme = scheme[2];
					document.getElementById('type').innerHTML = " <b>Type:</b> "+scheme[3];
					if(scheme[4] != null)
						document.getElementById('elementHeating').innerHTML = " <b>Number of elements:</b> "+scheme[4];
					else
						document.getElementById('elementHeating').innerHTML = "";
					if(scheme[5] != null)
						document.getElementById('elementKeepWarm').innerHTML = " <b>Number of randomelements:</b> "+scheme[5];
					else
						document.getElementById('elementKeepWarm').innerHTML = "";
					document.getElementById('list').innerHTML = "";
					document.getElementById('list').style.display = "none";
				}
			}
			XHR.open("GET", "graphLog.php?type=loadCurrent", true);
			XHR.send();
	});

    addEvent(document.getElementById('mainMenu'), 'click', function(e){
		window.location.href = "index.html";
	});

});