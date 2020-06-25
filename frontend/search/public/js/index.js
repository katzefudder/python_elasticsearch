$(document).ready(function () {

    // Get references to page elements
    var $titleSearchText = $("#search");
    var $submitTitleSearchButton = $("#submitSearchTitle");
    var $logParagraph = $("#log").hide();
    
    // The searchAPI object contains methods for each kind of request we'll make
    var searchAPI = {
        searchByTitle: function(title) {
          return $.ajax({
            url: "/search/" + title,
            type: "GET"
          });
        },
        getAllPictures: function() {
          return $.ajax({
            url: "/getAllPictures/",
            type: "GET"
          });
        }
    };
    
    var handleSubmitTitleSearch = function(event) {
        event.preventDefault();
        var searchTerm = $titleSearchText.val().trim();
        searchAPI.searchByTitle(searchTerm).then(function(resp) {
          console.log(resp);
            var results = handleResults(resp.hits.hits);        
            var photosTable = makeTable($("#tableDiv"), results);
        });
    };

    searchAPI.getAllPictures().then(function(resp) {
      var results = handleResults(resp.hits.hits);        
      var photosTable = makeTable($("#tableDiv"), results);
    });
    
    // Add event listeners to the submit button
    $submitTitleSearchButton.on("click", handleSubmitTitleSearch);
  });

  function handleResults(results) {
    var data = [];
    data[0] = ["Foto", "Galerie", "Beschreibung", "Original"];
    var hitsArray = results;
    hitsArray.forEach(function(photos) {
      // /tmp/s3/presspix/demo_customer/images/gallery_2/20200516_Fanclub_RT_003.jpg
      var originalImage = photos._source['filename'].replace('/tmp/s3/presspix/', '');
      var imageUrl = originalImage.replace('images/', 'thumbnails/max/');
      imageUrl = "https://presspix.s3.eu-central-1.amazonaws.com/" + imageUrl;
      originalImage = "https://presspix.s3.eu-central-1.amazonaws.com/" + originalImage;

      data.push([imageUrl, photos._source['headline'], photos._source['caption'], originalImage]);
    });
    return data;
  }

  function makeTable(container, data) {
    var table = $("<table/>").addClass('table table-striped');
    $.each(data, function(rowIndex, r) {
        var row = $("<tr/>");
        $.each(r, function(colIndex, c) { 
            if (colIndex == 0 && rowIndex > 0) {
              row.append($("<td><img style='width: auto; height: 100px' src='"+c+"' /></td>"));
            } 
            else if (colIndex == data[0].length - 1 && rowIndex > 0) {
              row.append($("<td><a href='"+c+"' download target='blank'>download</a></td>"));
            }
            else {
              row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
            }
        });
        table.append(row);
    });
    return container.html(table);
  }