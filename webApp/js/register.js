function submitForm(register) {
   const formData = new FormData(register);
   fetch('/register', {
       method: 'POST',
       body: formData
   })
   .then(response => {
       if (response.ok) {
           // Handle successful registration
           console.log('Registration successful');
       } else {
           // Handle registration error
           console.error('Registration failed');
       }
   })
   .catch(error => {
       console.error('Error:', error);
   });
}