var MidiDeLight = new function() {
	var canvas, ctx;

	var KEY_RANGE = {left: 36, right: 96};
	//var KEY_RANGE = {left: 36, right: 84};
	var PARTICLE_SIZE = window.innerWidth/(KEY_RANGE.right - KEY_RANGE.left + 1);
	var MAX_EXTEND_SPEED = 7;

	var p = [];
	var isFirst = [];
	for (var i=0;i<128;i++) {
		isFirst[i] = true;
	}

	var c = [];

	this.init = function() {
		canvas = document.getElementById('world');
		ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx.globalCompositeOperation = "lighter";
		// document.addEventListener('keydown', function() {
		// 	var num = 10;
		// 	var interval = (KEY_RANGE.right - KEY_RANGE.left) / num;
		// 	for (var i=0; i<num; i++) {
		// 		midiKey[KEY_RANGE.left + Math.round(i * interval)] = 128 * i / num;
		// 	}
		// });

		requestAnimationFrame(
			function(){ loop(); requestAnimationFrame(arguments.callee); }
		)
	};

	function getRGBString(r, g, b, a) {
		r = Math.round(r);
		g = Math.round(g);
		b = Math.round(b);
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	}

	function createParticle(x, y, size, impact, color) {
		var radius, rad, speed, dx2, dy2;
		var num = 5 + Math.floor(impact*0.05);

		for (var i=0; i<num; i++) {
			radius = size + ((Math.random() * size) - size/2);
			rad = Math.random() * 360;
			speed = 1 + Math.random() * size/8;
			dx2 = Math.cos(rad) * speed;
			dy2 = Math.sin(rad) * speed;

			p.push( new Particle( radius, x, y, dx2, dy2, color ) );
		}

		// Equal Angle
		// for (var i=0; i<num; i++) {
		// 	radius = size + ((Math.random() * size) - size/2);
		// 	rad = 360 * i / num;
		// 	speed = size/8;
		// 	dx2 = Math.cos(rad) * speed;
		// 	dy2 = Math.sin(rad) * speed;
		//
		// 	p.push( new Particle( radius, x, y, dx2, dy2, color ) );
		// }
	}

	function moveParticle() {
		for (var i=0; i<p.length; i++) {
			p[i].x += p[i].dx;
			p[i].y += p[i].dy;
			p[i].alpha -= 0.02;
		}
	}

	function drawParticle() {
		for (var i=0; i<p.length; i++) {
			if (p[i].alpha <= 0) {
				p.splice(i, 1);
				i--;
				continue;
			}
			ctx.fillStyle = getRGBString(p[i].color.r, p[i].color.g, p[i].color.b, p[i].alpha);

			ctx.beginPath();
			ctx.arc(p[i].x, p[i].y, p[i].r, 0, Math.PI*2, true);
			ctx.fill();
		}
	}

	function extendCircle() {
	    for (var i=0; i<c.length; i++) {
			c[i].r += c[i].speed;
			c[i].alpha -= 0.02;
		}
    }

    function createCircle(x, y, r, size, color) {
		var speed = size;
	    c.push( new Circle(x, y, r, speed, color) );
	}

	function drawCircle() {
		ctx.shadowBlur = 20;

		for (var i=0; i<c.length; i++) {
			if (c[i].alpha <= 0) {
				c.splice(i, 1);
				i--;
				continue;
			}

			ctx.lineWidth = c[i].alpha * 10;
			ctx.strokeStyle = getRGBString(c[i].color.r, c[i].color.g, c[i].color.b, 1);
			ctx.beginPath();
			ctx.arc(c[i].x, c[i].y, c[i].r, 0, Math.PI*2, false);
			ctx.stroke();
		}
		ctx.shadowBlur = 0;
	}

	function loop() {
		ctx.clearRect(0,0,canvas.width,canvas.height);

		for (var i=KEY_RANGE.left; i<=KEY_RANGE.right; i++) {
			if ( midiKey[i] ) {
				var x = (i - KEY_RANGE.left) * PARTICLE_SIZE + PARTICLE_SIZE/2;
				var y = canvas.height - PARTICLE_SIZE - midiKey[i]*(canvas.height/128);

				//var r = 255 * midiKey[i] / 128;
	//			var r;
	//			if (midiKey[i] < 64)
	//				r = 128 * Math.pow(midiKey[i]/64, 2);
	//			else
	//				r = 255 - 128 * Math.pow((128 - midiKey[i])/64, 2);

				var r = 255 - 128 * (Math.cos(Math.PI * midiKey[i] / 128) + 1)
				var g = 255 * (64 - Math.abs(64-midiKey[i])) / 64;
				var b = 255 - r;

				var size = midiKey[i] * PARTICLE_SIZE/64;

				ctx.fillStyle = getRGBString(r, g, b, 1);

				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI*2);
				ctx.fill();
				if (isFirst[i]) {
					createParticle(x, y, size, midiKey[i], {r: r, g: g, b: b});
					createCircle(x, y, 0, size/6, {r: r, g: g, b: b});
					isFirst[i] = false;
				}

			} else {
				isFirst[i] = true;
			}
		}

		moveParticle();
		drawParticle();

		extendCircle();
		drawCircle();
	}

	function Particle(r, x, y, dx, dy, color) {
		this.r = r;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.color = color;
		this.alpha = 1;
	}

	function Circle(x, y, r, speed, color) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.speed = speed;
		this.color = color;
		this.alpha = 1;
	}
};

MidiDeLight.init();
