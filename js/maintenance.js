$(function() {
  $(document).ready(function() {
    function generateData() {
        var ResidentCode = localStorage.getItem('ResidentCode');
        $('#AppointTime').val(moment().format().substring(0, 19));
        $('#ImageUrls').val('');
        $('#CitizenCode').val(ResidentCode);
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
                    }).appendTo('#MaintenanceID');
                });
              }
          },
          error: function(err) {
              console.log(err);
          },
        });
        $('#RequestNote').val('');
        $('#listImage').empty();
        $('#listImage').append('<li id="uploadImage">' +
          '<img src="images/main_img_03.jpg" alt="img">' +
          '<input id="fileUpload" type="file" name="file" style="display: none" accept="image/*" capture="camera">' +
        '</li>');
        $('#form').validate({ // initialize the plugin
            rules: {
                MaintenanceID: {
                    required: true,
                },
                AppointTime: {
                    required: true,
                },
                RequestNote: {
                    required: true,
                },
                ImageUrls: {
                    required: true,
                },
            }
        });
    }

    generateData();

    $("#uploadImage").on("click", function () {
        $("#fileUpload").get(0).click();
    });
    $('#fileUpload').on("change", function (e) {
      var input = event.target;
      var img = document.createElement("img");
      var reader = new FileReader();
      reader.onload = function(e)
      {
          img.src = e.target.result;

          img.onload = function () {
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);

              var MAX_WIDTH = 800;
              var MAX_HEIGHT = 600;
              var width = img.width;
              var height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              var ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, width, height);

              dataurl = canvas.toDataURL("image/jpeg");
              uploadImage(dataurl);
          }
      }
      reader.readAsDataURL(input.files[0]);
    });

    function uploadImage(uri) {
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
            // debugger;
            console.log(JSON.parse(xhr.response));
            var result = JSON.parse(xhr.response);
            var urlTranform = result.secure_url.replace('image/upload/', 'image/upload/c_scale,h_105,q_80,w_151/');
            var img = `<li><img src="${urlTranform}" width="151" height="105" alt="img"></li>`;
            $('#listImage').children(':last').before(img);
            var ImageUrls = $('#ImageUrls').val();
            if(ImageUrls === '') {
              ImageUrls = result.secure_url + '|';
            } else {
              ImageUrls = ImageUrls + '|' + result.secure_url;
            }
             $('#ImageUrls').val(ImageUrls);
            setTimeout(() => {
              $.LoadingOverlay("hide");
            }, 300);
        }
      };
      var formdata = new FormData();
      formdata.append('file', uri);
      formdata.append('timestamp', timestamp);
      formdata.append('api_key', api_key);
      formdata.append('signature', signature);
      xhr.send(formdata);
    }

  $( "#submit" ).click(function() {
    var ImageUrls = $('#ImageUrls').val();
    if(ImageUrls === ""){
      $('#listImage').append('<label id="RequestNote-error" class="error" for="RequestNote">Please take a picture</label>');
    } else {
      $.LoadingOverlay("show");
      $.ajax({
              url: 'http://app.twin.vn:8181/PMH2018API/api/CRM/submit',
              type: 'POST',
              contentType : 'application/x-www-form-urlencoded',
              data: $("#form").serialize(),
              success:function(data){
                  $.LoadingOverlay("hide");
                  if(data.result){
                    generateData();

                    setTimeout(() => {
                      $('#msg').html(data).fadeIn('slow');
                      $('#msg').html("Success").fadeIn('slow') //also show a success message
                      $('#msg').delay(3000).fadeOut('slow');
                    }, 500);
                  }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR, textStatus, errorThrown);
                  $.LoadingOverlay("hide");
              }
      });
    }
  });
});
});
