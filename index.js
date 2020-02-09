(() => { // application code lives inside of iffy

   // our base endpoints
   const urls = {
      login: "localhost:3000/login",
      signup: "localhost:3000/signup"
      // add new api base endpoints here
   }


   document.addEventListener('DOMContentLoaded', function(){

      renderView(createLoginView())



   })

   // methods that use fetch to communicate with our rails backend api
     
     // user login

     // user signup

   // methods that use fetch to communicate with external music apis

   // methods used to render the 'view' or 'view' elements
   function renderView(view) {
      
       const mainElement = document.querySelector("#main")
       mainElement.innerHTML = ""
       mainElement.innerHTML += view

   }
   // methods used to create the 'views' - e.g., the signup page, the login page, the playlist page etc.   
   function createLoginView() {

       return `<div id="login" class="">
                 
               <form id="login-form">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" required /><br><br>
                <label for="username">Username</label>
                <input type="text" name="username" id="username" required /><br><br>
                <label for="password">Password</label>
                <input type="password" name="password" id="password" required /><br><br>
                <label for="password_confirmation">Password Confirmation</label>
                <input type="password" name="password_confirmation" id="password_confirmation" required /><br><br>
                <input type="submit" value="Login" />
               </form>
              
       
             </div>`
   }



   // helper methods
   







})()