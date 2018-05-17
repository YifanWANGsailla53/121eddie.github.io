self.addEventListener('install', event => {//lors du chargement de index.html
  // self.skipwaiting();
  console.log("ServiceWorker en cours d'installation…");
});

self.addEventListener('activate', event => {
	//chargement anticipé des pages puisqu'on vise un fonctionnement offline
	//application experimentale, on ne gère pas les versions de cache
  // self.skipwaiting();
  self.clients.claim();
  console.log("ServiceWorker en cours d'activation");
  event.waitUntil(caches.open('geoLocCaching')
	.then(cache=>{return cache.addAll(['/index.html','/styles.css','/serviceWorker.js','/traitement.js']);}))
	// .catch(e=>{console.log("Error handling cache", e);});
	console.log('ServiceWorker activé!');
	// document.getElementById('serviceWorker').innerHTML=' geoLocCaching actif';
});

//ServiceListener standard qui met en cache tout ce qui passe
//prévoit un chargement online avec mise en cache si quelquechose manque
self.addEventListener('fetch', event => {
  console.log('Redirection de', event.request.url);
    caches.open('geoLocCaching').then(cache=>{
      return cache.match(event.request).then(response=> {
        if (response) {
          console.log('Réponse trouvée dans le cache:', response);
          return response;
        }else{
			console.log('Réponse à charger sur le serveur');
			return fetch(event.request).then(networkResponse=>{
			  cache.put(event.request, networkResponse.clone());
			  document.getElementById("connection").innerHTML="Online";//on vient d'utiliser la connection
			  // return networkResponse;
			});
		}
	  }).catch(error=>{
        // Handles exceptions that arise from match() or fetch().
		// document.getElementById("connection").innerHTML="Perturbé";//il n'y a plus de connection fiable
        console.error('Erreur dans le chargement:', error);
        throw error;
      });
    });
});