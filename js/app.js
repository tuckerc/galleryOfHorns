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
      currentImages = images2;
      images2.sortData();
      images2.renderPage();
    }
    else {
      currentImages = images1;
      images1.sortData();
      images1.renderPage();
    }
  });

  // hook up the event listener on radio buttons
  $('#titleSort').on('click', () => {
    sortOrder = 'title';
    if(currentImages === images1) {
      images2.sortData();
      images2.renderPage();
    }
    else {
      images1.sortData();
      images1.renderPage();
    }
  });
  $('#hornSort').on('click', () => {
    sortOrder = 'horns';
    if(currentImages === images1) {
      images2.sortData();
      images2.renderPage();
    }
    else {
      images1.sortData();
      images1.renderPage();
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
          this.sortData();
          this.renderPage();
        });
    },
    this.sortData = function() {
      if(sortOrder === 'title') {
        this.images.sort((a, b) => {
          if(a.title.toUpperCase() < b.title.toUpperCase()) return -1;
          else if(a.title.toUpperCase() > b.title.toUpperCase()) return 1;
          else return 0;
        });
      }
      else {
        this.images.sort((a, b) => {
          if(a.horns < b.horns) return -1;
          else if(a.horns > b.horns) return 1;
          else return 0;
        });
      }
    },
    this.renderPage = function(keyword) {
      $('main').empty();
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
