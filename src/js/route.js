document.addEventListener("DOMContentLoaded", function () {
    // Get the form or the submit button by ID or any other selector
    const form = document.getElementById('DSFPrototypeForm');
    
    if (form) {
      // Attach a submit event listener to the form
      form.addEventListener('submit', function (event) {
        // Prevent the form from being submitted
        event.preventDefault();
        
        // // Redirect to the desired URL
        // window.location.href = 'https://example.com';
        alert("hello");
      });
    }
  });
  