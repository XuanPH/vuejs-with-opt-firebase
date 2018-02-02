function getUiConfig() {
    return {
      'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccess': function(user, credential, redirectUrl) {
          console.log(user);
          handleSignedInUser(user);
          // Do not redirect.
          return false;
        }
      },
      // Opens IDP Providers sign-in flow in a popup.
      'signInFlow': 'popup',
      'signInOptions': [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: 'image', // another option is 'audio'
            size: 'visible', // other options are 'normal' or 'compact',invisible
            badge: 'inline' // 'bottomright' or 'inline' applies to invisible.
          },
          defaultCountry: 'VN'
        }
      ],
      // Terms of service url.
      'tosUrl': 'https://www.google.com'
    };
  }
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  
  /**
   * Displays the UI for a signed in user.
   * @param {!firebase.User} user
   */
  var handleSignedInUser = function(user) {

    $.get('http://app.twin.vn:8181/PMH2018API/api/authUser/getUserNameByPhone?Phone=' + user.phoneNumber,{},function(res){
      if (res.result){
        createCookie("currentUser",res.data.toString());
      }else {
        alert('Tài khoảng không tồn lại');
        deleteAccount();
        firebase.auth().signOut();
      }
    });
    // document.getElementById('user-signed-in').style.display = 'block';
    // document.getElementById('user-signed-out').style.display = 'none';
    // document.getElementById('name').textContent = user.displayName;
    // document.getElementById('email').textContent = user.email;
    // document.getElementById('phone').textContent = user.phoneNumber;
  
    // localStorage.setItem('ResidentCode', ResidentCode);
    window.location.href = './project.html';
    // alert('Đăng nhập thành công: user: ' + user.phoneNumber);
  };
  
  
  /**
   * Displays the UI for a signed out user.
   */
  var handleSignedOutUser = function() {
    // document.getElementById('user-signed-in').style.display = 'none';
    // document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());  
    setTimeout(() => {
      customCssUI();
    }, 200);
  };
  
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });
  
  /**
   * Deletes the user's account.
   */
  var deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
      if (error.code == 'auth/requires-recent-login') {
        // The user's credential is too old. She needs to sign in again.
        firebase.auth().signOut().then(function() {
          // The timeout allows the message to be displayed after the UI has
          // changed to the signed out state.
          setTimeout(function() {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  };
  
  /**
   * Initializes the app.
   */
  var initApp = function() {
    // document.getElementById('sign-out').addEventListener('click', function() {
    //   firebase.auth().signOut();
    // });
    // document.getElementById('delete-account').addEventListener(
    //     'click', function() {
    //       deleteAccount();
    //     });
    console.log('Load firbase success');
  };
  var customCssUI = function() {
    $("#firebaseui-container .firebaseui-card-header,.firebaseui-card-footer").remove();
    $(".firebaseui-id-secondary-link").remove();
    $(".firebaseui-id-submit").text('Xác minh');
    $(".firebaseui-id-country-selector").css({ display: 'none'});
    $(".mdl-textfield__label").text('Nhập số điện thoại')
    // var cssUi = {
    //   background : "#323232"
    // }
    // $("#firebaseui-container .firebaseui-container").css(cssUi);
  }
  window.addEventListener('load', initApp);