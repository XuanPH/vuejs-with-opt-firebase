var header = new Vue({
    el: "#header",
    data: {
        Name : 'AA',
        Phone: '123456789'
    },
    methods : {
        currentUser : function(name,phone){
            return  {
                Name : name,
                Phone: phone
             };
        },
        signOut : function() {
            firebase.auth().signOut();
        }
    }
});
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        header.$data.Name = "logined";
        header.$data.Phone = user.phoneNumber;
    } else {
        window.location.href = 'index.html';
    }
  });