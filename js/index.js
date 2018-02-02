images = [];

var header = new Vue({
  el : "#header",
  data : {
    listLanguages: [
      {
        langCode : "vi",
        langFlagUrl : "./flags/vi.png"
      },{
        langCode : "en",
        langFlagUrl : "./flags/uk.png"
      },{
        langCode : "kr",
        langFlagUrl : "./flags/sk.png"
      },{
        langCode : "jp",
        langFlagUrl : "./flags/jp.png"
      },{
        langCode : "cn",
        langFlagUrl : "./flags/zh.png"
      }
    ],
    imageChoose : {
      url : "./flags/vi.png"
    }
  },
  mounted : function(){
    this.getUrl();
    onLoad();
  },
  methods : {
    setLanguage : function(langCode){
      eraseCookie("Language");
      createCookie('Language',langCode,3000);
      this.getUrl();
      onShowLang();
      window.location.reload();
    },
    readLanguage : function(){
      return readCookie("Language") || "uk";
    },
    getUrl : function(){
      var lang = this.readLanguage();
      var ic = '';
      this.listLanguages.forEach(function(el){
        if (el.langCode == lang){
          ic = el.langFlagUrl;
        }
      });
      this.imageChoose.url = ic;
    
    }
  }
});