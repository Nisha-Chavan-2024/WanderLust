// const coordinate =   JSON.stringify(listing.geometry.coordinates);

   mapboxgl.accessToken =mapToken;

    const map = new mapboxgl.Map({
      container: 'map',
      // Replace YOUR_STYLE_URL with your style URL.
      style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz',
      center: listing.geometry.coordinates, 
      zoom: 9
    });

    //console.log(coordinates);  

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(new mapboxgl.Popup({offset : 25}).setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
      .addTo(map);
    
  // [ 75.90474, 17.676899 ],