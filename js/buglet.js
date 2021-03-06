define(["jquery", "html", "settings", "scheme", "vector"], function($, $H, $S, Scheme, Vector){
	
	function Buglet(name, field, pos, direction){
		this.init(name, field, pos, direction);
	}
	
	// процесс анимации движения баглета
	Buglet.animationProgress = function (v) {
		var path = this.data("mypath"),
			buglet = this.data("buglet"),
			offset = {x:buglet.iconSize.w/2, y:buglet.iconSize.h/2};

		if (!path) return{transform: "t0,0"};

		
		var len = path.getTotalLength();
		var point = path.getPointAtLength(v * len);

		var alpha = point.alpha;
		alpha = alpha%360;
		
		var prevDir = buglet.direction;
		buglet.direction = Math.abs(buglet.direction - alpha)>340?alpha:
						Math.abs(buglet.direction - alpha)>120?alpha-180:
						alpha;
		
		buglet.pos.x = point.x;
		buglet.pos.y = point.y;
		
		
		return {
			transform: "t " + point.x + "," + point.y + 
			" r " + [buglet.posDirection(buglet.direction), -offset.x, -offset.y].join(",")
		};
	};
	
	
	Buglet.instances = [];
	
	$.extend(Buglet.prototype, {
		init: function(name, field, pos, direction){var _=this;
			_.index = Buglet.instances.length;
			_.name = name;
			_.field = field;
			_.scheme = new Scheme(_);
			_.pos = pos;
			_.direction = direction;
			_.icon = null;
			Buglet.instances.push(_);
			_.spawnPos = {pos:{x:pos.x, y:pos.y}, direction:direction};
		},
		posDirection:function(direction){
			return direction;
			return direction>180?-direction-180:direction;
			return direction<=0?180-direction:direction;
		},
		show: function(){var _=this;
			_.icon = _.field.screen.set();
			_.iconSize = {
				w: 40,
				h: 20
			};
			
			// отрисовка пиктухи (относительно нуля)
 			_.icon.push(_.field.screen.path([
				"M", -20, -10,
				"L", 10, -10,
				"L", 20, 0,
				"L", 10, 10,
				"L", -20, 10,
				"L", -10, 0,
				"z"
			]).attr({fill:"#fff"}));
			_.icon.push(_.field.screen.rect(-4, 2.5-_.iconSize.h/2, 10, 15).attr({fill:"#0f0"}));
			
			_.setPos(_.pos, _.direction);
		},
		setPos: function(pos, direction){var _=this;
			// позиционирование пиктухи
			_.icon.transform(["t", pos.x, pos.y, "r", _.posDirection(direction), -_.iconSize.w/2, -_.iconSize.h/2]);
		},
		start: function(){var _=this;
			_.scheme.exec();
		},
		move: function(newPos){var _=this;
			var vertex = Vector.point(_.pos, _.direction, Vector.length(_.pos.x, _.pos.y, newPos.x, newPos.y)/2);
			
			var trace = _.field.screen.path(["M", _.pos.x, _.pos.y, "Q", vertex.x, vertex.y, newPos.x, newPos.y])
				.attr({stroke:"#f00", "stroke-width": $S.showPath?1:0});
			
			_.icon.data("mypath", trace);
			_.icon.data("buglet", _);
			_.icon.attr("progress", 0);
			_.icon.animate(
				{ progress: 1 }, 
				Scheme.delay() - 50, /* небольшая пауза перед запуском следующей команды */
				function(){if($S.deleteOldPath) trace.remove();}
			);
		},
		respawn: function(){ // при респавне должны сохраняться кое-какие характеристики баглета
			this.setPos(this.spawnPos.pos, this.spawnPos.direction);
		},
		hurt:function(){}
	});
	
	
	return Buglet;
});