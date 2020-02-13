
(() => { // application code lives inside of iffy
   
   let spotifyToken = "";
   // 
   let addSong = null
   // our base endpoints
   const urls = {
      login: "http://localhost:3000/api/v1/users/login",
      signup: "http://localhost:3000/api/v1/users/signup",
      addSongToPlaylist: "http://localhost:3000//api/v1/users",
      deleteSongFromPlaylist: "http://localhost:3000//api/v1/users",
      createPlaylist: "http://localhost:3000//api/v1/users",
      deletePlaylist: "http://localhost:3000//api/v1/users", 
      deleteUser: "http://localhost:3000/api/v1/users",  
      fetchSpotifyToken: "http://localhost:3000/api/v1/users/give_access_token",
      getUserData: "http://localhost:3000/api/v1/users"
      // add new api base endpoints here
   }
   // this object will have all the retrieved info:
   const currentUserInfo = {
       user: {

       },

       songs: [{
           id: 7,
           album_url: "https://i.scdn.co/image/ab67616d000048517645656d7c2dc87d84204986",
           artist: "amazing artist",
           title: "Holy Diver",
           url: "https://open.spotify.com/embed/album/2jVdrR7UYTElDAciwt6qu7?highlight=spotify:track:1mHXSQFVH2wp9YbgJARO0e"
       }],
       
       playlists: [
        {
            "id": 1,
            "title": "playlist1",
            "songs": [
                {
                    "id": 1,
                    "name": "songName1",
                    "artist": "artist1",
                    "album": "album1",
                    "genre": "genre1",
                    "created_at": "2020-02-11T22:21:28.840Z",
                    "updated_at": "2020-02-11T22:21:28.840Z"
                },
                {
                    "id": 6,
                    "name": "songName6",
                    "artist": "artist6",
                    "album": "album6",
                    "genre": "genre6",
                    "created_at": "2020-02-11T22:21:28.860Z",
                    "updated_at": "2020-02-11T22:21:28.860Z"
                }
            ]
        }
    ]
   }


   document.addEventListener('DOMContentLoaded', function(){

    //fetchToken()  
    listForNavbarClicks()
    if (retrieveToken()) getAllUserData().then(data => console.log(data)).then(() => renderView(createWelcomeView(), 'welcome'))
    else renderView(createLoginView(), 'login')


    //()
    


   })

   // methods that use fetch to communicate with our rails backend api

     // delete a playlist

     function deletePlaylist(playlist_id) {

        const fullUrl = urls.deletePlaylist + `/${currentUserInfo.user.id}/playlists/${playlist_id}`
        const configuration = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${retrieveToken()}` 
            }
        }

        return fetch(fullUrl, configuration).then(resp => resp.json())

     }

     // create a playList

     function createPlayList(data) {


        const fullUrl = urls.createPlaylist + ` `

        const configuration = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${retrieveToken()}`
            },
            body: JSON.stringify(data)
        }

        return fetch(fullUrl, configuration).then(resp => resp.json())



     }

     // delete user

     function deleteUser(userId) {
          
         
          
          const fullUrl = urls.deleteUser + `/${userId}`
          const configuration = {
              method: "DELETE",
              headers: {
               "Accept": "application/json",
               "Authorization": `Bearer ${retrieveToken()}`  
              }
            }
          return fetch(fullUrl, configuration).then(resp => resp.json())

     }
     
     // delete Song from users playlist

     function removeSongFromPlaylist(songId, playlist_id) {
         fullUrl = urls.deleteSongFromPlaylist + `/${currentUserInfo.user.id}/playlists/${playlist_id}/songs/${songId}` 
         const configuration = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${retrieveToken()}`
            }
         }

         return fetch(fullUrl, configuration).then(resp => resp.json())
    }

     //  add song to user's playlist
     function addSongToPlaylist(data) {
     
        const fullUrl = urls.addSongToPlaylist + `/${currentUserInfo.user.id}/playlists/${data.play_list_id}/songs`

         const configuration = {
             method: "POST",
             headers: {
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
                 'Authorization': `Bearer ${retrieveToken()}`
             },
             body: JSON.stringify(data.song_info)
         }
         return fetch(fullUrl, configuration).then(resp => resp.json())
     }
     
     // user login

     function postLogin(userData) {
         const configuration = {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Accept': 'application/json'
             },
             body: JSON.stringify(userData)

         }

         return fetch(urls.login, configuration).then(data => data.json())

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

     function getAllUserData() {
         const url = urls.getUserData + `/magic/playlists`
         const configuration = {
             headers: {
                'Authorization': `Bearer ${retrieveToken()}`,
                'Accept': 'application/json' 
             }
         }
         return fetch(url, configuration).then(data => saveAllUserDataLocally(data, true) )  
     }
     

   // methods that use fetch to communicate with external music apis

   // methods used to render the 'view' or 'view' elements
   function renderView(view, viewName) {
       
       const mainElement = document.querySelector("#main")
       mainElement.innerHTML = ""
       mainElement.innerHTML += view

       if (viewName === 'login') {
           attachListenersForLoginView()
           toggleNavBarHidden()
        }
       else if (viewName === 'signup') {
           attachListenersForSignupView()
           toggleNavBarHidden()
        }
       else if (viewName === 'welcome') {
           attachListenersForWelcomeView()
           toggleNavBarHidden()
        } else if (viewName === 'profile') {
            attachListenersForProfileView()
            toggleNavBarHidden()
        } else if (viewName === 'songs') {
            attachListenersForSongsView()
            toggleNavBarHidden()
        }
        //elsif view is 'signup' attach signup listeners, etc.

   }
   // methods used to create the 'views' - e.g., the signup page, the login page, the playlist page etc. 
    function createSongsList() {
        let songLis = ""
        currentUserInfo.songs.forEach((song) => {
            songLis += `<li id="${song.id}">
            <img src="${song.album_url}" />
            <h3>${song.title}</h3>
            <h5>${song.artist}</h5>
            <button>Add to a Playlist</button>
            </li>`
        })
        return songLis
    }
   function createSongsView() {

       return `<div id="song-view">

              <h1>Songs</h1>
               <div id="song-form-container">
                 <form id="song-form" >
                   
                   <input type="text" id="get-songs" placeholder="Track Name" required />
                   <input type="submit" value="Search " />
                 </form>
               </div>
               <div class="songs-container">
                 <ul id="songs-list">${createSongsList()}</ul>
               </div>
               <div id="song-iframe">
                   
               </div>
              </div>
       `
   }

   function createLoginView() {

       return `<div class="grid-item hidden"></div>
               <div id="login-div" class="grid-item">
                <h2>Login</h2>
                <div id="login-error" class="red"></div> 
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
       debugger
       return `<h1>Welcome, ${currentUserInfo.user.first_name}</h1>`
   }


   ///////Donny added code here:
   function renderPlaylistsFromData(userData) {
    const arrOfPlaylists = userData["playlists"]
    const playlistDiv = document.getElementById('playlist-div');
    const playlistUl = document.createElement("UL");    
    playlistDiv.appendChild(playlistUl)    

    //we want just title of playlist.
    const listOfPlaylistTitles = arrOfPlaylists.map(playlist => {
        const playlistLi = document.createElement("LI");
        playlistLi.id = playlist.id
        playlistLi.classList.add('playlist-name')
        playlistUl.appendChild(playlistLi);
        playlistLi.innerText = playlist.title

    });
    return playlistUl;
}
   ////////End of Donny's code

   function createProfileView() {
       return `
            <div id="profile-info">
                <h1>
                    Here is your profile info:
                </h1>
                <button id="delete-user">Delete Account</button>
                
                <p id="profile-first-name">First Name: ${currentUserInfo.user.first_name}</p>
                <p id="profile-last-name">Last Name: ${currentUserInfo.user.last_name}</p>
                <p id="profile-email">email address: ${currentUserInfo.user.email}</p>
                <p>Here are your Playlists:</p>
                <div id="playlist-div">
                    
                
                </div>
                    <div id="search-box-div">
                    
                    </div>
            </div>
       `
   }

  function renderPlaylistView(playlist) {
     //build up html for playlist
     let playListHTML = ""
    //  playlist.songs[0].name
    //  playlist.songs[0].artist
    //  playlist.songs[0].album
    //  playlist.songs[0].genre
    playlist.songs.forEach(song => {
        //get playlist div, make ul plus li for each song
        playListHTML += `<ul>
                           <li>${song.name}</li>
                           <li>${song.artist}</li>
                           <li>${song.album}</li>
                           <li>${song.genre}</li>
                         </ul>
                        `
    })

    return playListHTML
  }
  
  function createSongIFrameHTML(song) {
      return `<iframe src="${song.url}" class="song-play-style"></iframe>`

  }

  function renderSongIFrame(iframe) {

      
      const iframeContainer = document.querySelector("#song-iframe")
      iframeContainer.innerHTML = ""
      iframeContainer.innerHTML = iframe

  }

   //attach listener to profile view /playlist text
   //when user clicks on playlist, he gets directed
   //to a playlist view.


   function attachListenersForSongsView() {
       // listener for clicking on a new song in the list
       const songsList = document.querySelector("#songs-list")
       const songsForm = document.querySelector("#song-form")
       // song form listener
       songsForm.addEventListener('submit', function(e){
           e.preventDefault();
           // fetch the search results
           // then re-render page after setting them in currentUserInfo.songs
       })
       
       
       songsList.addEventListener('click', function(e){
            if (e.target.tagName === 'IMG') {
                const songId = parseInt(e.target.parentElement.id)
                const song = currentUserInfo.songs.find((song) => song.id === songId)
                
                // empty iframe div, replace with new iframe for this song
                renderSongIFrame(createSongIFrameHTML(song))

            }
          
       })
   }

   function attachListenersForProfileView() {
     const playlistName = document.querySelector('#playlist-div');
     playlistName.addEventListener('click', function(e){
         console.log("playlistUl has been clicked!")
         const playlistClickedOnId = parseInt(e.target.id); //this grabs playlist id
         const playlist = currentUserInfo.playlists.find(playlist => {
           
             return playlist.id === playlistClickedOnId;
         })
         
         renderPlaylistView(playlist)
     });
     const deleteUserButton = document.querySelector("#delete-user")
    
      deleteUserButton.addEventListener('click', function(){
        
        deleteUser(currentUserInfo.user.id).then(() => {
            clearToken()
            renderView(createLoginView(), 'login')
        })
       
    })   
       
         // pass in renderProfileView function with variable playlistTitle passed in as an parameter
     
      
    }
    // attach listener for delete button
    
        
 

   // event listeners
   function attachListenersForLoginView() {
       // set listener on submit for logging in user
       const loginFormElement = document.querySelector("#login-form")
       const signupLinkElement = document.querySelector("#signup")
       loginFormElement.addEventListener('submit', function(e){
           e.preventDefault()
           clearToken()
           const email = loginFormElement.querySelector("#email").value
           const password = loginFormElement.querySelector("#password").value
           const userDataObject = {user_info: {email: email, password: password}}
           postLogin(userDataObject).then(data =>{
                   if (data && data.error) renderLoginErrors(data.error)
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

   function renderLoginErrors(error) {
      const errorDiv = document.querySelector("#login-error")
      errorDiv.innerText = error
      setTimeout(() => {
        // clear the error display
        errorDiv.innerHTML = ""
      }, 5000)     
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
        
       
         
        
        
                       
                postSignup(userData).then(userData => {
                    clearToken()
                    
                    if (userData && userData.errors) renderSignupErrors(userData.errors)
                    else {
                        saveToken(userData.token)
                        saveAllUserDataLocally(userData, false)
                        renderView(createWelcomeView(), 'welcome')
                    }
                  
                } )
            
            
            



         
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
   
   function savePlaylistData(playlists) {
       currentUserInfo.playlists = playlists
   }
   


   // validation methods
   function renderSignupErrors(errors) {
    const errorDiv = document.querySelector("#signup-errors")
       
       if (errors.length > 0) {
          // display errors
          errorDiv.innerHTML = "There are errors for these fields: "
          errorDiv.innerHTML += errors.reduce((memo, error) => {
              memo += (" " + error)
              return memo   
            }, "" ) 
            //
            
          
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
       return localStorage.getItem('music_token')
   }

   function clearToken() {
       localStorage.removeItem('music_token')
   }

   //if there is a token i local storage called 'music token'
 //then hide nav bar

function toggleNavBarHidden() {
    
    const navBar = document.getElementById('nav')
    
    if(localStorage.getItem('music_token')) {
        navBar.classList.remove('hidden');
    } else {
        navBar.classList.add('hidden')
    }
}

// NAV BAR PROFILE FUNCTIONALITY
// a. IF the profile item is clicked, renders profile view.
function listForNavbarClicks () {
    const navBar = document.getElementById('nav');

    navBar.addEventListener('click', function(event){
       if(event.target.id === "profile") {
           console.log('profile clicked')
           renderView(createProfileView(), 'profile')
           renderPlaylistsFromData(currentUserInfo)
          

       } else if (event.target.id === "playlist") {
           renderPlaylistView()
           
       } else if (event.target.id === "song-search") {
           console.log("song search clicked")
           //render song search...ignore for now...
           renderView(createSongsView(), 'songs')
       } else if (event.target.id === "logout") {
           //
           clearToken()
           renderView(createLoginView(), 'login')
       }
    })
    

}

function fetchToken() {
   const url = urls.fetchSpotifyToken;
   fetch(url).then(data => data.json())
   .then(data => {
    spotifyToken = data["spotify_token"]
    console.log(spotifyToken)
   }).catch(err => console.log(err))
}

function fetchSongs() {
    fetch("https://api.spotify.com/v1/search?q=holy%20diver&type=track&market=US&limit=10&offset=5", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/js",
            "Authorization" : `Bearer ${spotifyToken}`
        },
        
    })
    .then(res => res.json())
    .then(data => console.log(data))
    
}

})()




// /*
 

// get the link to that spotify url
// put that link on our webpage, with the title of the song
// make sure when you are not logged into spotify, clicking the link



// */





// NAV BAR PLAYLIST FUNCTIONALITY
// a. if the playlist is clicked, renders playlist view



