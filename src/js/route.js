document.addEventListener("DOMContentLoaded", function () {
  // Get the form or the submit button by ID or any other selector
  const form = document.getElementById('DSFPrototypeForm');

  //if form exists
  if (form) {
    // ------- Begin Submit listener ----------
    // Attach a submit event listener to the form
    form.addEventListener('submit', function (event) {
      // Prevent the form from being submitted
      event.preventDefault();

      try {
        // get all data of the form and store in sessionStorage
        var formData = new FormData(form);
        // Store the key/value pairs
        for (var pair of formData.entries()) {
          var inputKey = pair[0];
          var inputValue = formData.getAll(inputKey);
          console.log(inputKey + ', ' + inputValue);
          //save in session store
          sessionStorage[inputKey] = inputValue;
        }
        //if Routes are defined
        if (DSFroutes) {
          // Create an instance of URLSearchParams
          const params = new URLSearchParams(window.location.search);
          //check if route params are passed
          if (params.has('route')) {
            // Get route parameter
            let paramRoute = params.get('route');
            // set default next parameter
            let paramNext = 0;
            //check if next parameter is passed
            if (params.has('next')) {
              // Get next parameter
              paramNext = params.get('next');
            }
            // console.log(paramRoute + paramNext);
            if (DSFroutes[paramRoute]) {
              let nextURL = ""; // Increment `next` by 1 for the URL
              let incrementedNext = 1;
              if (DSFroutes[paramRoute][paramNext]) {
                incrementedNext = parseInt(paramNext, 10) + 1;
              } 
              //construct next URL
              nextURL = `${DSFpathPrefix}/${DSFroutes[paramRoute][paramNext]}?route=${paramRoute}&next=${incrementedNext}`;

              if (nextURL != "") {
                //console.log('nextURL: ' + nextURL);
                window.location.assign(nextURL);
              }
            } else {
              console.error('Error: route is not defined.');
            }
          }
        }
      } catch (error) {
        console.error('An error occurred during form submission:', error);
      }
    });
    // ------- End Submit listener ----------
  }
});


//is.js cdn <script src="https://cdn.jsdelivr.net/npm/is_js@0.9.0/is.min.js"></script>
//is.js example
// const value = "test@example.com";
// if (is["email"](value)) {
//     console.log("This is a valid email address.");
// } else {
//     console.log("Invalid email address.");
// }

//for error
//document.querySelector("#mainContainer article.govcy-col-8").insertAdjacentHTML('afterbegin', `<p>Your new content here</p>`);

//remove stuff with error class
// document.querySelectorAll('.error').forEach(element => element.remove());

//remove only the class reference
//document.querySelectorAll('.error').forEach(element => element.classList.remove('error'));
