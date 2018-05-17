refreshGPS();
var destEmail=localStorage.getItem('destEmail');
var destSMS=localStorage.getItem('destSMS');
var latitude,longitude,precision,miseAjour;//variables globales pour ne pas avoir à les récupèrer à chaque fois dans la DOM
var sujet;
var message;
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
	//mise à jour des coordonnées
	var coord = pos.coords;
	latitude=coord.latitude.toPrecision(6);
	longitude=coord.longitude.toPrecision(6);
	precision=coord.accuracy.toPrecision(6);
	var d=new Date();
	miseAjour=d.getHours()+"h"+d.getMinutes()+":"+d.getSeconds();
	document.getElementById("latitude").innerHTML=latitude;
	document.getElementById("longitude").innerHTML=longitude;
	document.getElementById("precision").innerHTML=precision;
	document.getElementById("miseAjour").innerHTML=miseAjour;
	console.log("Coordonnées mises à jour");
	//mise à jour des variables globales
	sujet='Geolocalisation '+d.getHours()+"h"+d.getMinutes();
	message="Mes coordonnées mesurées par l'appli Web Progressive\r\nLatitude: "+latitude+'\r\nLongitude: '+longitude+'\r\nPrécision: '+precision+'\r\nDernière mise à jour: '+miseAjour;
	console.log("Variables globales mises à jour");
	//mise à jour du fichier téléchargeable
	var d=new Date();
	var blob = new Blob([message], {type: 'text/plain',charset:'utf-8'});
	var url=window.URL.createObjectURL(blob);
	console.log('Blob '+blob+' créee');
	var lien=document.getElementById("telecharger");
	lien.setAttribute('href',url);
	lien.setAttribute('download',sujet+".txt");
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
	//envoi par un site tiers
	// MozMobileMessageManager.send(destSMS, message);
	
	//envoi par l'application SMS par défaut
	var ecMessage=encodeURIComponent(message);
	var sms='sms:'+destSMS+'?body='+ecmessage;//pas de sujet pour les SMS...//& pour iOS
	window.location.href=sms;
	console.log("SMS ouvert dans l'application SMS");
}

function facebook(){//pas encore mise en oeuvre
	console.log("envoi d'une alerte Facebook: pas encore mis en oeuvre");
}