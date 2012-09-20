window.fbAsyncInit = function() {
  FB.init({
    appId      : app.secret.fb_app_id, // App ID
    channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  user_info_el   = document.getElementById('user_info'),
  update_user_info = function(response) {
    if (response.status != 'connected') {
      user_info_el.innerHTML = '';
      return;
    }

    FB.api(
      {
        method: 'fql.query',
        query: 'SELECT name, pic_square FROM user WHERE uid=' + response.authResponse.userID
      },
      function(response) {
        user_info_el.innerHTML = (
          '<img src="' + response[0].pic_square + '" width="32px" height="32px"> ' +
          response[0].name
        );
      }
    );
  };

  FB.Event.subscribe('auth.login', update_user_info);
  FB.Event.subscribe('auth.logout', update_user_info);
  FB.getLoginStatus(update_user_info);

};

// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
}(document));