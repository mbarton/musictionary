window.fbAsyncInit = function() {
  FB.init({
    appId      : app.secret.fb_app_id, // App ID
    channelUrl : 'http://localhost:5000/static/html/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  user_info_el = $('#user_info');

  refresh_connected_users = function(ids_map) {
    $('#connected_users').empty()
    $.each(ids_map, function(key, val) {
      get_user_info(val, function(user_info) {
          $('#connected_users').append('<table><tr><td><img src="' + user_info.pic_square + '" ></td></tr><tr><td>'+user_info.name+'</td></tr></table>');
      });        
    });
  }

  get_user_info = function(id, success) {
        FB.api(
      {
        method: 'fql.query',
        query: 'SELECT uid, name, pic_square FROM user WHERE uid=' + id
      },
      function(response) {
        success(response[0]);
      }
    );
  }

  update_user_info = function(response) {
    if (response.status != 'connected') {
      user_info_el.html('');
      if (app.currentUserId != null) {
        url = "player/" + MusictionaryRoom + "/" + app.currentUserId;
        $.ajax(url, {type: "DELETE"});
      }
      app.currentUserId = null;
      return;
    }

    userId = response.authResponse.userID;
    FB.api(
      {
        method: 'fql.query',
        query: 'SELECT name, pic_square FROM user WHERE uid=' + userId
      },
      function(response) {
        user_info_el.html(
          '<img src="' + response[0].pic_square + '" width="32px" height="32px"> ' +
          response[0].name          
        );
        app.currentUserId = userId;
        url = "player/" + MusictionaryRoom + "/" + userId;

        $.ajax(url, {type: "POST"});
        $.getJSON(url, refresh_connected_users);
      }
    );
  };

  FB.Event.subscribe('auth.login', update_user_info);
  FB.Event.subscribe('auth.logout', update_user_info);
  /*FB.getLoginStatus(update_user_info);*/

};

// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
}(document));

