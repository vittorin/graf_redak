if(window.addEventListener) {
    window.addEventListener('load', function () {
        var canvas, context, canvaso, contexto;
		   var action = "up";
    var ctx,points,pointer;
        
        // По умолчанию линия - инструмент по умолчанию
        var tool;
        var tool_default = 'line';

        function init () {
            canvaso = document.getElementById('tablet');
            if (!canvaso) {
                alert('Ошибка! Canvas элемент не найден!');
                return;
            }

            if (!canvaso.getContext) {
                alert('Ошибка! canvas.getContext не найден!');
                return;
            }

            contexto = canvaso.getContext('2d');
            if (!contexto) {
                alert('Ошибка! Не могу получить getContext!');
                return;
            }

            var container = canvaso.parentNode;
            canvas = document.getElementById("tablet");
            if (!canvas) {
                alert('Ошибка! Не могу создать canvas элемент!');
                return;
            }

            canvas.id = 'tablet';
            canvas.width = canvaso.width;
            canvas.height = canvaso.height;
            container.appendChild(canvas);

            context = canvas.getContext('2d');

            // Получаем инструмент из option
            var tool_select = document.getElementById('tools');
            if (!tool_select) {
                alert('Ошибка! Элемент tools не найден!');
                return;
            }
            tool_select.addEventListener('change', ev_tool_change, false);

            // Активируем способ рисования по-умолчанию
            if (tools[tool_default]) {
                tool = new tools[tool_default]();
                tool_select.value = tool_default;
            }

            canvas.addEventListener('mousedown', ev_canvas, false);
            canvas.addEventListener('mousemove', ev_canvas, false);
            canvas.addEventListener('mouseup',   ev_canvas, false);
        }

        function ev_canvas (ev) {
            if (ev.layerX || ev.layerX == 0) {
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX == 0) {
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }

            var func = tool[ev.type];
            if (func) {
                func(ev);
            }
        }
		
		
		


        // Обработчик событий для изменения селекта
        function ev_tool_change (ev) {
            if (tools[this.value]) {
                tool = new tools[this.value]();
            }
        }

        // Эта функция вызывается каждый раз после того, как пользователь
        // завершит рисование. Она очищает imageTemp.
        function img_update () {
            //contexto.drawImage(canvas, 0, 0);
            //context.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Содержит реализацию каждого инструмента рисования
        var tools = {};

       

    // Прямоугольник
    tools.rect = function () {
	
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
            tool.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
            if (!tool.started) {
                return;
            }
			

            var x = Math.min(ev._x,  tool.x0),
            y = Math.min(ev._y,  tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) {
                return;
            }

            context.strokeRect(x, y, w, h);
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                img_update();
            }
        };
    };

	
	// кисть
 
   tools.kist = function(){
      ctx = document.getElementById('tablet').getContext('2d');
      ctx.globalAlpha = 0.1;
      points = new Array(10);
    };
    function mDown(e){
      action = "down";
      points[0] = [e.pageX, e.pageY];
      pointer = 0;
    };
    function mUp(e){
      points = new Array(10);
      action = "up";
    };
    function mMove(e){
      if (action == "down") {
        var nextpoint = pointer;
        if (nextpoint > 9) nextpoint = 0 + 2;
        ctx.beginPath();
        ctx.moveTo(points[pointer][0],points[pointer][1]);
        ctx.lineTo(e.pageX, e.pageY);
        if (points[nextpoint]) {
          ctx.moveTo(points[nextpoint][0] + Math.round(Math.random()*10-5),points[nextpoint][1] + Math.round(Math.random()*10-5));
          ctx.lineTo(e.pageX, e.pageY);
        }
        ctx.stroke();
        pointer = nextpoint;
        points[pointer] = [e.pageX, e.pageY];
      }
    };
 
	
	
	


    // Линия
	
	
    tools.line = function () {
        var tool = this;
        this.started = false;
		

        this.mousedown = function (ev) {
            tool.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
            if (!tool.started) {
                return;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(tool.x0, tool.y0);
            context.lineTo(ev._x,   ev._y);
            context.stroke();
            context.closePath();
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                //img_update();
            }
        };
    };

    init();

}, false); }
