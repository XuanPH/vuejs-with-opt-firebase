var $lang_choose;
var $lang_ul;
var $lang_choose_img;
var baseFlagsUrl = './flags';
var multilang;

$(document).ready(function(){
	$lang_choose = $("#lang_choose");
	$lang_ul = $("#ul_lang");
	$lang_choose_img = $("#lang_choose_img");
});

function onShowLang(){
	if($lang_ul.css('display') != 'none')
	{
		$lang_ul.hide(200);
	}else {
		$lang_ul.show(200);
	}
}
// function onChangeLang(obj)
// {
// 	$(obj).find('img').each(function(){
// 		$lang_choose_img.attr('src',(baseFlagsUrl + '/' + $(obj).data().lang + '.png'));
// 	});
// 	$lang_ul.hide(200);
// 	multilang.setLanguage($(obj).data().lang);
// 	createCookie('Language',$(obj).data().lang,3000);
// 	refreshLabels();
// }
function onLoad() {
	var lang = readCookie("Language") || "uk";
	multilang = new MultiLang('languages.json', lang, this.refreshLabels);	
	$("#" + lang).trigger('click');
}
function initList() {			
	refreshLabels();
}
function refreshLabels() {
	var allnodes = document.body.getElementsByTagName("*");
	for (var i=0, max=allnodes.length; i < max; i++) {
		var idname = allnodes[i] !== undefined ? allnodes[i].id : '';
		if (idname != '' && idname.split('_')[0] == 'twlang') {
			allnodes[i].textContent = multilang.get(idname);
		};
	};
}