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
        }
      };
    
    
    var handleSubmitTitleSearch =  function(event) {
        event.preventDefault();
    
        var searchTerm = $titleSearchText.val().trim();
    
        searchAPI.searchByTitle(searchTerm).then(function(resp) {
    
            // https://presspix.s3.eu-central-1.amazonaws.com/demo_customer/images/gallery_1/20200605_ECBN_Unterstützer_010.jpg
            var data = [];
            data[0] = ["Foto", "Galerie", "Beschreibung", "Keywords"];
            var hitsArray = resp.hits.hits;
            hitsArray.forEach(function(photos) {
              var imageUrl = photos._source['filename'].replace('/tmp/s3/presspix/', '');
              imageUrl = "https://presspix.s3.eu-central-1.amazonaws.com/" + imageUrl;
              data.push([imageUrl, photos._source['headline'], photos._source['caption'], photos._source['keywords']]);
            });
    
              var photosTable = makeTable($("#tableDiv"), data);
        });
      
        // Clear out search field
        $submitTitleSearchButton.val("");
      };
    
    
      function makeTable(container, data) {
        var table = $("<table/>").addClass('table table-striped');
        $.each(data, function(rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function(colIndex, c) { 
                if (colIndex == 0 && rowIndex > 0) {
                  row.append($("<img style='width: auto; height: 100px' src='"+c+"' />"));
                } else {
                  row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
                }
            });
            table.append(row);
        });
        return container.html(table);
    }
    
    // Add event listeners to the submit button
    $submitTitleSearchButton.on("click", handleSubmitTitleSearch);
    });