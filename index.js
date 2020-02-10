(() => { // application code lives inside of iffy

   // our base endpoints
   const urls = {
      login: "http://localhost:3000/api/v1/login",
      signup: "http://localhost:3000/api/v1/users/signup"
      // add new api base endpoints here
   }

   const currentUserInfo = {
       user: {

       },
       userPlaylists: {
         
       }
   }


   document.addEventListener('DOMContentLoaded', function(){

      renderView(createLoginView(), 'login')



   })

   // methods that use fetch to communicate with our rails backend api
     
     // user login

     function postLogin(userData) {
         const configuration = {

         }
     }

     // user signup
     function postSignup(userData) {
         const configuration = {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(userData)
         }
         return fetch(urls.signup, configuration).then(resp => resp.json())
     } 
     

   // methods that use fetch to communicate with external music apis

   // methods used to render the 'view' or 'view' elements
   function renderView(view, viewName) {
      
       const mainElement = document.querySelector("#main")
       mainElement.innerHTML = ""
       mainElement.innerHTML += view

       if (viewName === 'login') attachListenersForLoginView()
       else if (viewName === 'signup') attachListenersForSignupView()
       else if (viewName === 'welcome') attachListenersForWelcomeView()
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
               
                <label for="password">Password</label>
                <input type="password" name="password" id="password" required /><br><br>
              
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
    <label for="email">Email</label>
    <input type="email" name="email" id="email" required>
    <label for="first-name">First Name</label>
     <input type="text" name="first-name" id="first-name" required /><br><br>
     <label for="last-name">Last Name</label>
     <input type="text" name="last-name" id="last-name" required /><br><br>
     <label for="username">Username</label>
     <input type="text" name="username" id="username" required /><br><br>
     <label for="password">Password</label>
     <input type="password" name="password" id="password" required /><br><br>
     <label for="password-confirmation">Password Confirmation</label>
     <input type="password" name="password_confirmation" id="password-confirmation" required /><br><br>
     <input type="submit" value="Signup" />
    </form>
    <a id="login" href="#">Login</a>
   

  </div>
  <div id="signup-errors"></div>
  <div class="grid-item hidden"></div>`

   }

   function createWelcomeView() {
       //debugger
       return `<h1>Welcome, ${currentUserInfo.user.first_name}</h1>`
   }


   // event listeners
   function attachListenersForLoginView() {
       // set listener on submit for logging in user
       const loginFormElement = document.querySelector("#login-form")
       const signupLinkElement = document.querySelector("#signup")
       loginFormElement.addEventListener('submit', function(e){
           e.preventDefault()
           clearToken()
           const email = loginFormElement.querySelector("#email")
           const password = loginFormElement.querySelector("#password")
           const userDataObject = {user_info: {email, password}}
           postLogin(userDataObject).then(data =>{
                   if (data && data.errors) renderLoginErrors(data.errors)
                   else { // no errors, so user will have jwt token, and data
                     saveToken(data.token)
                     saveAllUserDataLocally(data, false)
                     renderView(createWelcomeView(), 'welcome')
                   }
           } )



       })
       // set listener on signup button for rendering signup form
       signupLinkElement.addEventListener('click', function(){
           renderView(createSignupView(), 'signup')
       })


   }

   function attachListenersForWelcomeView() {

   }

   function attachListenersForSignupView() {
    // set listener for signing user up   
    const formElement = document.querySelector("#signup-form")
    const loginLinkElement = document.querySelector("#login")
    formElement.addEventListener('submit', function(e){
        e.preventDefault()
        const firstName = document.querySelector("#first-name").value
        const lastName = document.querySelector("#last-name").value
        const email = document.querySelector("#email").value
        const username = document.querySelector("#username").value
        const password = document.querySelector("#password").value
        const passwordConfirmation = document.querySelector("#password-confirmation").value

        const userData = {user_info: { 
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            username,
            password_confirmation: passwordConfirmation 
         }}
         // handle errors
        
         const errors = validSignupData(userData)
         //debugger
         if (errors.length > 0) renderSignupErrors(errors)
        
         else // sign up the user, render their homepage
            {
                //debugger       
                postSignup(userData).then(userData => {
                    clearToken()
                    //debugger
                    saveToken(userData.token)
                    saveAllUserDataLocally(userData, false)
                    
                    renderView(createWelcomeView(), 'welcome')
                } )
            
            
            }



         
    })
    // set listener for rendering login view
    loginLinkElement.addEventListener('click', function(){
        renderView(createLoginView(), 'login')
    })
}

    

   // helper methods

   function saveAllUserDataLocally(data, doSavePlaylists) {
       // save user data
       saveUserData(data.user)
       // save playlist data
        if (doSavePlaylists) savePlaylistData(data.playlists)
       
   }

   function saveUserData(user) {
       currentUserInfo.user = user
   } 
   


   // validation methods
   function renderSignupErrors(errors) {
    const errorDiv = document.querySelector("#signup-errors")
       //debugger
       if (errors.length > 0) {
          // display errors
          errorDiv.innerHTML = "There are errors for these fields: "
          errorDiv.innerHTML += errors.reduce((memo, error) => {
              memo += (" " + error)
              return memo   
            }, "" ) 
            //
            
          //debugger
          setTimeout(() => {
            // clear the error display
            errorDiv.innerHTML = ""
          }, 5000)
       } 
       
       
      
   }

   function validSignupData(data) {

    const errors = []

    if (!validFirstName(data.user_info.first_name)) errors.push('First Name')
    if (!validLastName(data.user_info.last_name)) errors.push('Last Name')
    if (!validEmail(data.user_info.email)) errors.push('Email')
    if (!validUsername(data.user_info.username)) errors.push('Username')
    if (!validPassword(data.user_info.password)) errors.push('Password')
    if (!validPasswordConfirmation(data.user_info.password, data.user_info.password_confirmation)) errors.push('Password')

     //debugger
    return errors

         

   }

   function validFirstName(name) {
     return true
   }

   function validLastName(name) {
      return true
   }

   function validEmail(email) {
      return true
   }

   function validUsername(username) {
      return true
   }

   function validPassword(password) {
     return true
   }

   function validPasswordConfirmation(password, passwordConfirmation) {
     return password === passwordConfirmation
   }
   // authorization / token stuff
   function saveToken(token) {
       localStorage.setItem('music_token', token)
   }

   function retrieveToken() {
       localStorage.getItem('music_token')
   }

   function clearToken() {
       localStorage.removeItem('music_token')
   }
   




})()