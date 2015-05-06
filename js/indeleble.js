// GLOBALES JAVASCRIPT
window._Indeleble = {
	mobile: {
		es: undefined,
		esiOS: undefined,
		esAndroid: undefined,
		esBBOS: undefined
	},
	esIE: document.documentElement.className.match(/ ie /i) ? true : false,
	esWebKit: navigator.userAgent.match(/(chrome|safari)/i) ? true : false,
	contadorAnimacionesSalidaTapa: 0,
	cantItemsSalidaTapa: 0,
	eventosCSS3: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd webkitAnimationEnd oanimationend animationend'
};

// Detectar dispositivo móvil y tipo [iOS, Android o BBOS]
function DetectarMobile (){
	var stringNavegador = navigator.userAgent;
	_Indeleble.mobile.es = stringNavegador.match(/mobile/i);

	if(_Indeleble.mobile.es){
		_Indeleble.mobile.esiOS = stringNavegador.match(/(ipod|iphone|ipad)/i);
		_Indeleble.mobile.esAndroid = stringNavegador.match(/android/i);
		_Indeleble.mobile.esBBOS = stringNavegador.match(/blackberry/i);

		$('footer#pieGeneral').css('position','absolute');
		
		if(_Indeleble.mobile.esiOS || _Indeleble.mobile.esAndroid){
			if(window.navigator.standalone !== true) window.addEventListener("load", ocultarBarraDirecciones);
			//window.addEventListener("orientationchange", ocultarBarraDirecciones );
		}else{ return false; }
	}
}

// Ocultar barra de direcciones URL en mobile 
function ocultarBarraDirecciones() {
    if (!window.location.hash) {
        if (document.height <= window.outerHeight + 10) {
            document.body.style.height = (window.outerHeight + 50) +'px';
            setTimeout( function(){ window.scrollTo(94, 1); }, 50 );
        } else {
            setTimeout( function(){ window.scrollTo(94, 1); }, 0 );
        }
    }
}

// Redirección después de animación
function Redireccion (urlString){
	setTimeout(function(){
		if(!_Indeleble.esIE){
			document.location.href = urlString;
		}else{
			window.location.href = urlString;
		}
	}, 600);
}

// Disparador animación en cabecera
function AnimarCabecera($h, $bh, $cnh){
	$h.add($bh).toggleClass('activado');
	$cnh.toggleClass('visible');
}

// Disparador animación después de ver tapas
function AnimarContenido(reinicio){
	var $cajaCont = $('div.container'),
		$adornoPie = $('div#adornoPie');
	
	if(reinicio !== undefined){
		$cajaCont.addClass('enFundido');
		var t = setTimeout(function(){
			$cajaCont.toggleClass('tapaInicial contenidoVista enFundido');
			$adornoPie.toggleClass('visible');
			$('.animacionTapa').addClass('animacionActivada');
		}, 500);
	}else{
		$cajaCont.toggleClass('tapaInicial contenidoVista enFundido');
		$adornoPie.toggleClass('visible');
	}
}

// Acciones cuando el DOM esté listo
jQuery(document).ready(function($){

	DetectarMobile();

	var $header = $('header#cabeceraGeneral'),
		$cajaNavHeader = $('nav#cajaNavegacionCabecera',$header),
		$btnHeader = $('button#btnActivarMenuCabecera'),
		$footer = $('footer#pieGeneral'),
		$cuerpo = $('div#cuerpoGeneral');

	$btnHeader.click(function(){ AnimarCabecera($header, $(this), $cajaNavHeader);	});

	$footer.add($cuerpo).click(function(e){
		if($header.hasClass('activado')){
			e.preventDefault();
			var $this = $(e.target),
				esEnlace = $this.is('a');
			AnimarCabecera($header, $btnHeader, $cajaNavHeader);
			if(esEnlace) Redireccion($this.attr('href'));
		}
	});

	$('a.linksNavCabecera', $cajaNavHeader).click(function(e){
		e.preventDefault();
		if($(this).hasClass('noEnlaza')) return false;
		var urlString = $(this).attr('href');
		AnimarCabecera($header, $btnHeader, $cajaNavHeader);
		Redireccion(urlString);
	});

	$('button#btnVolver').click(function(){
		AnimarContenido(true);
	});

	if($('div#cajaControlesGaleriaPortafolio').length > 0){

		$('button.enlacesTiposServicios').click(function(){
			var $this = $(this);

			if($this.hasClass('activado')) return false;

			$('div.cajaCarousel')
				.removeClass('carouselActivo')
				.filter(function(){
					return $(this).is($this.data('target')) === true;
				})
				.addClass('carouselActivo').carousel(0);
			$this.addClass('activado').siblings().removeClass('activado');
		});

		$('button.carousel-control.control-num').each(function(i,el){
			var $this = $(el),
				$carousel = $($this.data('target')),
				nro = parseInt($this.text()) - 1;
			$this.click(function(){
				$carousel.carousel(nro);
			});
		});

		$('button.imgsMinPortafolio').each(function(i,el){
			$(el).click(function(ev){
				var patrones = {
						inicio: _Indeleble.esWebKit === true ? 'url(' : 'url("',
						medio: _Indeleble.esWebKit === true ? ')' : '")'
					},
					urlImg = $(this).css('backgroundImage').replace(patrones.inicio,'').replace(patrones.medio,'').replace('.png','_grande.png'),
					$img = $('img#imgModalPortafolio','div#modalPortafolio'),
					$p = $('p.cargando','div#modalPortafolio');

				if($img.attr('src') === undefined || $img.attr('src') !== urlImg){
					var nimg = new Image();

					nimg.alt = "Imagen del Portafolio";
					nimg.onload = function(){
						nimg.className = 'invisible';
						nimg.id = 'imgModalPortafolio';
						nimg.height = 600;
						nimg.width = 800;
						$img.addClass('invisible').replaceWith(this);
						$p.removeClass('visible');
						$(this).removeClass('invisible');
					};
					nimg.src = '';
					nimg.src = urlImg;
					/*$img.addClass('invisible').one('load',function(e){
						$p.removeClass('visible');
						$(this).removeClass('invisible');
					}).attr('src',urlImg);*/
				}else{
					$p.removeClass('visible');
					$img.removeClass('invisible');
				}
			});
		});

		$('div#modalPortafolio').on('hidden', function(){
			$('p',this).addClass('visible');
			$('img',this).addClass('invisible');
		});

	}

	if($('div#cajaControlesSemiPopupsServicios').length > 0){

		var $cajasInfografias = $('div.cajasInfografias'),
			$cajaAzul = $('div.cajasContenedorasBiseladas');

		$('button#btnCerrar',$cajaAzul).click(function(){
			$cajaAzul.removeClass('visible');
		});

		$('button.enlacesTiposServicios').click(function(){
			var $this = $(this);
			$cajasInfografias
				.removeClass('infografiaActiva')
				.filter(function(){
					return $(this).is($this.data('target')) === true;
				})
				.addClass('infografiaActiva');
			$cajaAzul.addClass('visible');
		});

	}

});

jQuery(window).load(function(){

	if($('div.tapaInicial').length > 0){

		$('.animacionTapa').addClass('animacionActivada').filter(function(){
			return $(this).is('button') === true;
		}).click(function(){

			$('div.container').addClass('enFundido');
			var $itemsAnimados = $('.animacionTapa.animacionActivada');

			_Indeleble.cantItemsSalidaTapa = $itemsAnimados.length;

			if(!_Indeleble.esIE){
				$itemsAnimados.one(_Indeleble.eventosCSS3, function(){
					_Indeleble.contadorAnimacionesSalidaTapa = _Indeleble.contadorAnimacionesSalidaTapa === null ? null : _Indeleble.contadorAnimacionesSalidaTapa + 1;
					if(_Indeleble.contadorAnimacionesSalidaTapa < _Indeleble.cantItemsSalidaTapa || _Indeleble.contadorAnimacionesSalidaTapa === null) return false;
					_Indeleble.contadorAnimacionesSalidaTapa = 0;
					var t = setTimeout(function(){ AnimarContenido(); }, 500);
				});
			}

			$itemsAnimados.toggleClass('animacionActivada');

			if(_Indeleble.esIE){
				AnimarContenido();
			}
		});

	}

});