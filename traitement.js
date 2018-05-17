refreshGPS();
var mois=['jan','fev','mar','avr','mai','jui','jul','aug','sep','oct','nov','dec'];
var destEmail=localStorage.getItem('destEmail');
var destSMS=localStorage.getItem('destSMS');
var latitude
var longitude
var precision
var miseAjour;//variables globales pour ne pas avoir à les récupèrer à chaque fois dans la DOM
var message;
var connection=(window.navigator.onLine?'online':'offline');
console.log('connection:'+connection);
document.getElementById('connection').innerHTML=connection;
document.getElementById('destEmail').value=destEmail;
document.getElementById('destSMS').value=destSMS;

function refreshGPS(){
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(success, error, options);
	} else {
	  window.alert('Votre navigateur ne supporte pas la géolocalisation');
	}
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
	//mise à jour de l'état de connection
	connection=(window.navigator.onLine?'online':'offline');
	console.log('connection:'+connection);
	document.getElementById('connection').innerHTML=connection;
	//mise à jour des coordonnées
	var coord = pos.coords;
	latitude=coord.latitude.toPrecision(6);
	longitude=coord.longitude.toPrecision(6);
	precision=coord.accuracy.toPrecision(6);
	var d=new Date();
	//29 avr 2018 19h37:05
	var secDouble=(d.getSeconds()<10?'0':'')+d.getSeconds();
	miseAjour=d.getHours()+"h"+d.getMinutes()+":"+secDouble+', le'+d.getDay()+' '+mois[d.getMonth()]+' '+d.getFullYear();
	console.log('miseAjour:'+miseAjour);
	document.getElementById("latitude").innerHTML=latitude;
	document.getElementById("longitude").innerHTML=longitude;
	document.getElementById("precision").innerHTML=precision;
	document.getElementById("miseAjour").innerHTML=miseAjour;
	console.log("Coordonnées mises à jour");
	//mise à jour des variables globales
	message="Mes coordonnées mesurées par l'appli Web Progressive\r\nLatitude: "+latitude+'\r\nLongitude: '+longitude+'\r\nPrécision: '+precision+'\r\nDernière mise à jour: '+miseAjour;
	console.log("Variables globales mises à jour");
	//mise à jour du fichier téléchargeable
	var d=new Date();
	var blob = new Blob([message], {type: 'text/plain',charset:'utf-8'});
	var url=window.URL.createObjectURL(blob);
	console.log('Blob '+blob+' créee');
	var lien=document.getElementById("telecharger");
	lien.setAttribute('href',url);
	lien.setAttribute('download','Geolocalisation '+miseAjour+".txt");
	console.log('Lien de téléchargement mis à jour');
}

function error(err) {
  console.warn('ERROR(${err.code}): ${err.message}');
}

function email(){
	if(document.getElementById('destEmail').value!=destEmail){
		destEmail=document.getElementById('destEmail').value;
		localStorage.setItem('destEmail',destEmail);
		console.log("Destinataire Email enregistré");
	}
	var subject='mes coordonnees';
	var ecMessage=encodeURIComponent(message);
	var email='mailto:'+destEmail+'?subject='+subject+'&body='+ecMessage;
	// confirmation=window.confirm(email);
	// if(confirmation==true){
	window.location.href=email;
	console.log("Email ouvert dans l'application de messagerie");
}

function sms(){
	if(document.getElementById('destSMS').value!=destSMS){
		console.log("Destinataire SMS enregistré");
		destSMS=document.getElementById('destSMS').value;
		localStorage.setItem('destSMS',destSMS);
	}
	var ecMessage=encodeURIComponent(message);
	console.log(ecMessage);
	var sms='sms:'+destSMS+'?body='+ecMessage;//& pour iOS
	console.log(sms);
	//var sms='sms:0649624189?body=message';//& pour iOS
	window.location.href=sms;
	console.log("SMS ouvert dans l'application SMS");
}
