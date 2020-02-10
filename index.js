(() => { // application code lives inside of iffy

   // our base endpoints
   const urls = {
      login: "localhost:3000/api/v1/login",
      signup: "localhost:3000/api/v1/signup"
      // add new api base endpoints here
   }


   document.addEventListener('DOMContentLoaded', function(){

      renderView(createLoginView(), 'login')



   })

   // methods that use fetch to communicate with our rails backend api
     
     // user login

     // user signup

   // methods that use fetch to communicate with external music apis

   // methods used to render the 'view' or 'view' elements
   function renderView(view, viewName) {
      
       const mainElement = document.querySelector("#main")
       mainElement.innerHTML = ""
       mainElement.innerHTML += view

       if (viewName === 'login') attachListenersForLoginView()
       else if (viewName === 'signup') attachListenersForSignupView()
       // elsif view is 'signup' attach signup listeners, etc.

   }
   // methods used to create the 'views' - e.g., the signup page, the login page, the playlist page etc.   
   function createLoginView() {

       return `<div class="grid-item hidden"></div>
               <div id="login-div" class="grid-item">
                <h2>Login</h2> 
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
               <a id="signup" href="#">Signup</a>
              
       
             </div>
             <div class="grid-item hidden"></div>`
   }

   function createSignupView() {

    return `<div class="grid-item hidden"></div>
    <div id="signup-div" class="grid-item">
     <h2>Signup</h2> 
    <form id="signup-form">
    <label for="first-name">First Name</label>
     <input type="text" name="first-name" id="first-name" required /><br><br>
     <label for="last-name">Last Name</label>
     <input type="text" name="last-name" id="last-name" required /><br><br>
     <label for="username">Username</label>
     <input type="text" name="username" id="username" required /><br><br>
     <label for="password">Password</label>
     <input type="password" name="password" id="password" required /><br><br>
     <label for="password_confirmation">Password Confirmation</label>
     <input type="password" name="password_confirmation" id="password_confirmation" required /><br><br>
     <input type="submit" value="Signup" />
    </form>
    <a id="login" href="#">Login</a>
   

  </div>
  <div class="grid-item hidden"></div>`

   }


   // event listeners
   function attachListenersForLoginView() {
       // set listener on submit for logging in user
       const loginFormElement = document.querySelector("#login-form")
       const signupLinkElement = document.querySelector("#signup")
       loginFormElement.addEventListener('submit', function(){
           // do stuff
       })
       // set listener on signup button for rendering signup form
       signupLinkElement.addEventListener('click', function(){
           renderView(createSignupView(), 'signup')
       })


   }

   function attachListenersForSignupView() {
    // set listener for signing user up   
    const formElement = document.querySelector("#signup-form")
    const loginLinkElement = document.querySelector("#login")
    formElement.addEventListener('submit', function(){
        // do stuff
    })
    // set listener for rendering login view
    loginLinkElement.addEventListener('click', function(){
        renderView(createLoginView(), 'login')
    })
}



   // helper methods
   







})()