

MusictionaryFacebook = function(secret) {

  var self = {};

  $(function(){
    $('#share-button').click(function(){
      self.postToFeed();
    });
  });

  self.postToFeed = function() {
    /*
    var obj = {
      method: 'feed',
      message: 'This is the message'
      link: document.location.href
      /*picture: '',
      name: 'Musictionary',
      caption: 'Musictionary',
      description: 'Using Dialogs to interact with users.'*/
/*    };

    function callback(response) {
      alert(response['post_id']);
    }
    FB.ui(obj, callback);
    */

     FB.ui({ method: 'feed', 
            message: 'Facebook for Websites is super-cool'});

  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : secret.fb_app_id, // App ID
      channelUrl : secret.channel_file, // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    var user_info_el = $('#user_info');

    refresh_connected_users = function(ids_map) {
      $('#connected_users').empty()
      $.each(ids_map, function(key, val) {
        get_user_info(val, function(user_info) {
            $('#connected_users').append('<div class="user_info_item"><img src="' + user_info.pic_square + '" /><div><a href="https://www.facebook.com/'+user_info.username+'">'+user_info.name+'</a></div></div>');
        });        
      });
    }

    get_user_info = function(id, success) {
          FB.api(
        {
          method: 'fql.query',
          query: 'SELECT uid, username, name, pic_square FROM user WHERE uid=' + id
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
          var url = "player/" + MusictionaryRoom + "/" + app.currentUserId;
          $.ajax(url, {type: "DELETE"});
        }
        app.currentUserId = null;
        return;
      }

      var userId = response.authResponse.userID;
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
          var url = "player/" + MusictionaryRoom + "/" + userId;

          $.ajax(url, {type: "POST"});
          $.getJSON(url, refresh_connected_users);
        }
      );
    };

    FB.Event.subscribe('auth.login', update_user_info);
    FB.Event.subscribe('auth.logout', update_user_info);
    /*FB.getLoginStatus(update_user_info);*/
  };


  return self;
};

// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
}(document));

