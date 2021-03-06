define(["jquery", "raphael", "buglet"], function($, $R, Buglet){
	
	function Field(pnlID){var _=this;
		var pnl = $("#"+pnlID);
		_.screen = $R(pnlID);
		
		// отрисовка фона
		_.screen.rect(0, 0, pnl.width(), pnl.height()).attr({fill:"cfc"});
		
		
		// атрибут процесса анимации баглетов
		// определяется один раз для поля при его создании
		_.screen.customAttributes.progress = Buglet.animationProgress;
		
	}

	Field.resize = function(){
		$("#out").css({
			width:$(".toolPanel:not(:hidden)").length?"calc(96vw - 300px)"
				:"96vw"
		});
	}
	
	return Field;
});