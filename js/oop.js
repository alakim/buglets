﻿define([], function(){
	// **************************************************************************************************************
	//
	//   Решение из статьи http://javascript.ru/tutorial/object/inheritance#nasledovanie-na-klassah-funkciya-extend
	//
	// **************************************************************************************************************
	
	function inherit(Child, Parent) {
		var F = function(){};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.superclass = Parent.prototype;
	}
	
	
	// копирует все свойства из src в dst,
	// включая те, что в цепочке прототипов src до Object
	function mixin(dst, src){
		// tobj - вспомогательный объект для фильтрации свойств,
		// которые есть у объекта Object и его прототипа
		var tobj = {}
		for(var x in src){
			// копируем в dst свойства src, кроме тех, которые унаследованы от Object
			if((typeof tobj[x] == "undefined") || (tobj[x] != src[x])){
				dst[x] = src[x];
			}
		}
		// В IE пользовательский метод toString отсутствует в for..in
		if(document.all && !document.isOpera){
			var p = src.toString;
			if(typeof p == "function" && p != dst.toString && p != tobj.toString &&
			p != "\nfunction toString() {\n    [native code]\n}\n"){
				dst.toString = src.toString;
			}
		}
	}

	return {
		inherit: inherit,
		mixin: mixin
	};
});