'use strict';

$(function() {
  
  let images2 = new ImageContainer(2, 'data/images2.json');
  images2.getData();

  let images1 = new ImageContainer(1, 'data/images.json');
  images1.getData();

  let currentImages = images1;

  // var to track current sort order
  let sortOrder = 'title';

  // add event listener to filter
  $('#dropDownMenu').on('change',() => {
    currentImages.renderPage($('#dropDownMenu').val());
  });

  // add event listener to arrow buttons
  $('.arrow').on('click', () => {
    if(currentImages === images1) {
      images2.renderPage();
      currentImages = images2;
    }
    else {
      images1.renderPage();
      currentImages = images1;
    }
  });

  function Image(img) {
    this.image_url = img.image_url;
    this.title = img.title;
    this.description = img.description;
    this.keyword = img.keyword;
    this.horns = img.horns;
  }

  function ImageContainer(pageNum, path) {
    this.pageNum = pageNum,
    this.path = path,
    this.images = new Array(),
    this.getData = function() {
      $.get(this.path)
        .then(images => {
          images.forEach(img => {
            this.images.push(new Image(img));
          });
        })
        .then( () => {
          this.renderPage();
        });
    },
    this.sortData = function() {
      if(sortOrder === 'title') {
        console.log(this.images);
        this.images.sort((a, b) => {
          return a.title.toUpperCase() < b.title.toUpperCase();
        });
        console.log(this.images);
      }
      else {
        this.images.sort((a, b) => {
          return a.horns < b.horns;
        });
      }
    },
    this.renderPage = function(keyword) {
      $('main').empty();      
      this.sortData();
      // loop through images
      this.images.forEach(image => {
        if(!keyword || (keyword && image.keyword === $('select').first().val())) {
          // Grab the template script
          let theTemplateScript = $("#image-gallery").html();
          // Compile the template
          let theTemplate = Handlebars.compile(theTemplateScript);
          // Pass our data to the template
          var theCompiledHtml = theTemplate(image);
          // Add the compiled html to the page
          $('.content-placeholder').append(theCompiledHtml);
        }
      });
      this.updateSelect();
    },
    this.updateSelect = function() {
      $('option').not(':first').remove();
      let seen = {};
      this.images.forEach(image => {
        // populate select
        if(!seen[image.keyword]) {
          // Grab the template script
          let theTemplateScript = $("#dropDown").html();
          // Compile the template
          let theTemplate = Handlebars.compile(theTemplateScript);
          // Pass our data to the template
          var theCompiledHtml = theTemplate(image);
          // Add the compiled html to the page
          $('#dropDownMenu').append(theCompiledHtml);
          seen[image.keyword] = true;
        }
      });
    };
  }
});
