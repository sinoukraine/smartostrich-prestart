export default function(latlng,replyFunc, additionalData) {
  let coords = 'Latitude: ' + latlng.lat + ', ' + 'Longitude: ' + latlng.lng;
  $.ajax({
         type: "GET",
          url: API_DOMIAN7+`reverse.php?format=json&zoom=18&addressdetails=1&lat=${latlng.lat}&lon=${latlng.lng}`,
     dataType: "json",
        async: true,
        cache: false,
      success: function (result) {
          if (result.display_name) {
              replyFunc(result.display_name, additionalData);
          }else{
              replyFunc(coords, additionalData);
          }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          $.ajax({
                 type: "GET",
                  url: API_DOMIAN8+`reverse?format=json&zoom=18&addressdetails=1&lat=${latlng.lat}&lon=${latlng.lng}`,
             dataType: "json",
                async: true,
                cache: false,
              success: function (result) {
                  if (result.display_name) {
                      replyFunc(result.display_name, additionalData);
                  }else{
                      replyFunc(coords, additionalData);
                  }
              },
              error: function(XMLHttpRequest, textStatus, errorThrown){
                  replyFunc(coords, additionalData);
              }
          });
      }
  });
}

 