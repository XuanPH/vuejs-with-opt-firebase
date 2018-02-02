$(function() {
  var images = [];
  $(document).ready(function() {
    // index
    $("#login a").on("click", function () {
      console.log("click");
      var ResidentCode = $('#Resident').val();
      console.log(ResidentCode);
      localStorage.setItem('ResidentCode', ResidentCode);
      window.location.href = './project.html';
    });

    // function loadData() {
    //   var images = localStorage.getItem('images');
    //   if(images === null){
    //     images = JSON.parse(images);
    //     images.forEach((item, index) => {
    //
    //     });
    //   }
    // }


    // debugger;
    // var token = localStorage.getItem('token');
    // console.log(token);
    // if(token === null){
    //   var formData = {
    //     grant_type: 'password',
    //     username: 'user1',
    //     password: '123456',
    //     language: 'vi',
    //     deviceid: 'browser',
    //     userid: '1'
    //   };
    //   $.ajax({
    //     url: "http://app.twin.vn:8181/PMH2018API/Token",
    //     type: 'POST',
    //     headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //     data: formData,
    //     success: function(res) {
    //         console.log(res);
    //         localStorage.setItem('token', res.access_token);
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    //   });
    // }
    $("#uploadImage").on("click", function () {
        $("#fileUpload").get(0).click();
    });
    $('#fileUpload').on("change", function (e) {
      var input = event.target;

      var reader = new FileReader();
      reader.onload = function(){
        var dataURL = reader.result;
        // console.log(dataURL);
        uploadImage(dataURL);
      };
      reader.readAsDataURL(input.files[0]);
    });

    function update_progress(e)
  	{
      console.log(e);
  	  if (e.lengthComputable)
  	  {
  	    var percentage = Math.round((e.loaded/e.total)*100);
  	    console.log("percent " + percentage + '%' );
        $("#progressbar").progressbar({
          value: percentage
        });
  	  }
  	  else
  	  {
  	  	console.log("Unable to compute progress information since the total size is unknown");
  	  }
  	}

    function uploadImage(uri) {
      // console.log(uri);
      var timestamp = (Date.now() / 1000 | 0).toString();
      var api_key = '463634859964193'
      var api_secret = 'qqkYzlRpYy4uECYAeSXImLptdLM'
      var cloud = 'minhpq'
      var hash_string = 'timestamp=' + timestamp + api_secret
      var signature = CryptoJS.SHA1(hash_string).toString();
      var upload_url = 'https://api.cloudinary.com/v1_1/' + cloud + '/image/upload'

      var xhr = new XMLHttpRequest();
      $.LoadingOverlay("show");
      xhr.open('POST', upload_url);
      xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            debugger;
            console.log(JSON.parse(xhr.response));
            var result = JSON.parse(xhr.response);
            var urlTranform = result.secure_url.replace('image/upload/', 'image/upload/c_scale,h_105,q_80,w_151/');
            var img = `<li><img src="${urlTranform}" width="151" height="105" alt="img"></li>`;
            $('#listImage').children(':last').before(img);
            var images = localStorage.getItem('images') || [];
            images = JSON.parse(images);
            images.push(result);
            localStorage.setItem('images', JSON.stringify(images));
            setTimeout(() => {
              $.LoadingOverlay("hide");
            }, 300);
        }
      };
      xhr.onprogress = update_progress;
      var formdata = new FormData();
      formdata.append('file', uri);
      formdata.append('timestamp', timestamp);
      formdata.append('api_key', api_key);
      formdata.append('signature', signature);
      xhr.send(formdata);
    }

    var openPhotoSwipe = function() {
      var pswpElement = document.querySelectorAll('.pswp')[0];
      var images = localStorage.getItem('images') || [];
      images.forEach((item, index) => {
        var itemImage = {
            src: item.secure_url,
            w: item.width,
            h: item.height
        };
      })
      // build items array
      var items = [];

      // define options (if needed)
      var options = {
               // history & focus options are disabled on CodePen
          history: false,
          focus: false,

          showAnimationDuration: 0,
          hideAnimationDuration: 0

      };

      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  };
  function generateSelect() {
      $.ajax({
        url: "http://app.twin.vn:8181/PMH2018API/api/Common/getMaintenance?Language=vi",
        type: 'GET',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        success: function(res) {
            console.log(res);
            if(res && res.result){
              jQuery.each(res.data, function(){
                  $('<option/>', {
                      'value': this.ID,
                      'text': this.Name
                  }).appendTo('#select');
              });
            }
        },
        error: function(err) {
            console.log(err);
        },
      });
  }

  generateSelect();
});
});
