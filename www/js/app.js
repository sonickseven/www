// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// var chatHist=io.connect('http://'+moreInfo.url+':3000/HistChat'), notifi=io.connect('http://'+moreInfo.url+':3000/notific');

var olds=[{opt:'0 a 9 años', id: 1}, {opt:'10 años o mas', id: 2}], moreInfo={};
moreInfo.url='qdigitalwit.esy.es';
angular.module('todo', ['ionic'])
.factory('ajax',['$http', function($http){
	//funcion que se llama para enviar o pedir datos a mysql
	//como ve tiene unos parametros
	this.call = function(data, url, method){
		return $http({//acomodar este codido a lo que esta haciendo
			method: method,
			url: url,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
		})
	}
	return this
}])
.run(function($ionicPlatform, $rootScope, $http) {
	$rootScope.ajax=function(data, url,cb, method){
		$http({
			method: method,
			url: url,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
		}).success(cb);
	}

	$rootScope.$on('$stateChangeStart', 
	function(event, toState, toParams, fromState, fromParams){
		//detecta los cambios de las ventanas de un celular
		changeSreen();
		switch(toState.name){
			case 'editQuot':
			console.log(toParams.cotiId, 'se hizo el cambio de stado');
			break;
			case 'infoCoti':
			console.log(toParams.cotiId, 'se hizo para sifgseuirg iyg');
			break;
		}
	});
	//esto viene por defecto en la aplicación
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});

})
.config(function($stateProvider, $urlRouterProvider) {
	//son las rutas de las ventanas de la apilcación
	$urlRouterProvider.otherwise('/login')
	$stateProvider
	.state('/admin', {cache:false, url: '/admin',templateUrl: './templates/admin.html',controller:'adm'})
	.state('/login', {url: '/login',	templateUrl: './templates/login.html',controller: 'login'})
	.state('coti1', {url: '/coti1', templateUrl: './templates/newClient.html', controller: 'cotiza'})
	.state('coti2', {url: '/coti2', templateUrl: './templates/newQuoted.html', controller: 'cotiza2'})
	.state('queryQuot', {cache:false, url: '/queryQuot', templateUrl: './templates/queryQuoted.html'})
	.state('resultCoti', {cache:false, url: '/resultCoti', templateUrl: './templates/resultQuote.html'})
	.state('infoCoti', {cache:false, url: '/infoCoti:cotiId', templateUrl: './templates/quotedAllInfo.html'})
	.state('newUser', {cache:false, url: '/newUser', templateUrl: './templates/newUser.html'})
	.state('/', {cache:false, url: '/', templateUrl: './templates/connect.html'})
	.state('allUsers', {cache:false, url: '/allUsers', templateUrl: './templates/allUsers.html'})
	.state('infoUser', {cache:false, url: '/infoUser:userId', templateUrl: './templates/allInfoUser.html'})
	.state('chPass', {cache:false, url: '/chPass', templateUrl: './templates/changePass.html'})
	.state('editQuot', {cache:false, url: '/editQuot:cotiId', templateUrl: './templates/editQout.html'})
	.state('editUser', {cache:false, url: '/editUser:usId', templateUrl: './templates/editUser.html'})
})
//es el panel de administrador
.controller('adm', function($scope, $http, $state, ajax){
	if(moreInfo.user){
		ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&user='+moreInfo.user+'&opt=5&qryopt=1', 'get')
		.success(function(a){
			if(a.length>0){
				$scope.panelAmd=a[0].peId==='1'?false: true;
			}else
				$scope.panelAmd=true;
		});
	}else
		$state.go('/login');
	
})
//es el panel donde se edita un usuario
.controller('editUser', function($scope, ajax, $stateParams, $state, $ionicPopup){
	var cod=$stateParams.usId;
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=5&qryopt=1&user='+cod, 'get')
	.success(function(a){
		$scope.user=a[0];
	})
	//cuando el usuario le clickea en el boton de actualizar
	//envia los datos al servidor y regresan al telefono
	$scope.editUser=function(){
		$scope.user.roll=se('input.editrolluser:checked').value;
		$scope.user.opt=3;
		ajax.call($scope.user, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=updates&class=procesos', 'put')
		.success(function(a){
			if(a.res)
				window.history.back();
			else
				$ionicPopup.alert({
					title: 'Error',
					template: 'Ha ocurrido un error por favor Informar al Ingeniero eror: '+a.res
				});
		})
	}
})
//la segunda parte de la cotizacion, donde esta el vehiculo y la clase de vehiculo
.controller('cotiza2', function($scope, $state, $ionicPopup, $timeout, ajax){
	$scope.olding=true;
	$scope.subt=true;
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=1','get')
	.success(function(data){
		$scope.marcas=data;
	});
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=0','get')
	.success(function(data){
		$scope.infos=data;
	});
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=3','get')
	.success(function(data){
		$scope.tvs=data;
	});
	//cuando el usuario escoje la clase de vehiculo, hace un actualización, en la cual
	//se sabe si la clase de vehiculo tiene edad o subtipo
	$scope.update=function(){
		ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?id='+$scope.coti.tpVehicle+'&fnt=gets&class=procesos&opt=2','get')
		.success(function(data){
			if(data.res!==0){
				if(data[0].old==='1'){
					$scope.olding=false;
					$scope.olds=olds;
				}else
					$scope.olding=true;
				$scope.subt=false;
				$scope.stps=data;
			}else{
				$scope.subt=true;
				$scope.olding=true;
			}
		});
	}
	//cuando se le da guardar, se envia los datos al servidor y este guarda en mysql,
	//despues trae el valor de la cotización y se lo envia en la siguiente ventana
	$scope.newQuote=function(form){
		if(form.$valid){
			$scope.coti.subt=$scope.coti.subt||0;
			$scope.coti.old=$scope.coti.old||0;
			$scope.coti.opt=0;
			$scope.coti.client=moreInfo.client;
			$scope.coti.user=moreInfo.user;
			$scope.coti.modelo=se('input.moldeloCarro').value;
			ajax.call($scope.coti, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?&fnt=posting&class=procesos','post')
			.success(function(a){
				if(a.res===1){
					moreInfo.totalValor=a.total;
					$scope.coti={};
					$state.go('resultCoti');
				}else
					$ionicPopup.alert({
						title: 'Error',
						template: 'Ha ocurrido un error por favor Informar al Ingeniero eror: '+a.res
					});
			});
		}else{
			var myPopup=$ionicPopup.alert({
				title: 'Error :O',
				template:'Ningún Campo puede quedar vacio!!!'
			});
			$timeout(function() {
				myPopup.close(); //close the popup after 3 seconds for some reason
			}, 2000);
		}
	}
})
//actualiza la couta y el cliente
.controller('udateQouted', function($scope, $stateParams, $ionicPopup, $location, $rootScope, ajax){
	var cod=$stateParams.cotiId,
		updQuot={};
	$rootScope.ajax({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=4&qry=2&id='+cod, function(a){
		updQuot.idClient=a[0].idClient;
		updQuot.idVehicle=a[0].idVehicle;
		$scope.quo=a[0];
	}, 'get');
	$scope.updateQuot=function(opt){
		if(opt){
			$scope.quo.change=$scope.quo.change||0;
			$scope.quo.subt=$scope.quo.subt||0;
			$scope.quo.old=$scope.quo.old||0;
			$scope.quo.opt=2;
			$scope.quo.idVehicle=updQuot.idVehicle;
			$scope.quo.qry=0;
			$rootScope.ajax($scope.quo, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=updates&class=procesos', function(a){
				if(a.res===2||a.res===3)
					$ionicPopup.alert({
						title: 'Bien hecho',
						template:'<strong>Se ha actualizado La cotizacion</strong>'
					})
					.then(function(){
						$location.path('/infoCoti'+cod);
					});
				else
					$ionicPopup.alert({
						title: 'Error',
						template:'<strong>Error numero :'+a.res+'</strong>'
					})
			}, 'put');
		}else{
			$scope.quo.opt=1
			$scope.quo.qry=1;
			$scope.quo.clId=updQuot.idClient;
			$rootScope.ajax($scope.quo, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=updates&class=procesos', function(a){
				if(a.res===1)
					$ionicPopup.alert({
						title: 'Bien hecho',
						template:'<strong>Se ha actualizado el Cliente</strong>'
					})
					.then(function(){
						$location.path('/infoCoti'+cod);
					});
				else
					$ionicPopup.alert({
						title: 'Error',
						template:'<strong>Error numero :'+a.res+'</strong>'
					})
			}, 'put');
		}
		console.log(opt)
		console.log($scope.quo);
	}
	//cuando el usuario escoje la clase de vehiculo, hace un actualización, en la cual
	//se sabe si la clase de vehiculo tiene edad o subtipo
	$scope.updates=function(){
		$scope.quo.change=1;
		$rootScope.ajax({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?id='+$scope.quo.tpVehicle+'&fnt=gets&class=procesos&opt=2', function(data){
			if(data.res!==0){
				if(data[0].old==='1'){
					$scope.olding=false;
					$scope.olds=olds;
				}else{
					$scope.quo.old=undefined;
					$scope.olding=true;
				}
				$scope.subt=false;
				$scope.stps=data;
			}else{
				$scope.subt=true;
				$scope.olding=true;
			}
		}, 'get');
	}
	$scope.olding=true;
	$scope.subt=true;
	$rootScope.ajax({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=1', function(data){
		$scope.marcas=data;
	}, 'get');
	$rootScope.ajax({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=0', function(data){
		$scope.infos=data;
	}, 'get');
	$rootScope.ajax({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=3', function(data){
		$scope.tvs=data;
	}, 'get');
	//
	$scope.update=function(){
		$rootScope.ajax({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?id='+$scope.quo.tpVehicle+'&fnt=gets&class=procesos&opt=2', function(data){
			if(data.res!==0){
				if(data[0].old==='1'){
					$scope.olding=false;
					$scope.olds=olds;
				}else
					$scope.olding=true;
				$scope.subt=false;
				$scope.stps=data;
			}else{
				$scope.subt=true;
				$scope.olding=true;
			}
		}, 'get');
	}
})
//cambia la contraseña del usuario
.controller('chPass', function($scope, $ionicPopup, $state, ajax){//es para cambiar la comtraseña
	$scope.newPass=function(){
		if(moreInfo.user!==undefined){
			if($scope.pass.newPass===$scope.pass.confPass){
				$scope.pass.user=moreInfo.user;
				$scope.pass.opt=0;
				ajax.call($scope.pass, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=updates&class=procesos','put').
				success(function(a){
					if(a.res===2)
						var myPopup=$ionicPopup.alert({
							title: 'Ok perfecto',
							template:'<strong>Se ha cambiado correctamente la contraseña</strong>'
						})
						.then(function(){
							$scope.pass={};
							$state.go('/admin');
						});
					else
						$ionicPopup.alert({
							title: 'Error',
							template:'<strong>Error numero :'+a.res+'</strong>'
						})
						.then(function(){
							$scope.pass={};
							$state.go('/admin');
						});
				});
			}else
				var myPopup=$ionicPopup.alert({
					title: 'Error',
					template:'<strong>Las contraseñas no son iguales</strong>'
				})
				.then(function(){
					$scope.pass={};
				});
		}else{
			var myPopup=$ionicPopup.alert({
				title: 'Error de sesión',
				template:'<strong>Por favor iniciar sesión</strong>'
			})
			.then(function(){
				$scope.pass={};
				$state.go('/login');
			});
		}
	}
})
//muestra toda la información del usuario, cuando el usuario administrador va a ver toda la informacion
//de otro usuario, eso si despues de estar en la ventana de consulta
.controller('infoUser', function($scope, $stateParams, ajax){
	var idUs=$stateParams.userId;
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&user='+idUs+'&opt=5&qryopt=1','get').
	success(function(a){
		$scope.infoUser=a[0];
	});
})
.controller('allUsers', function($scope, ajax){
	seacuUsrerer('', validateArrayAjax);
	$scope.searchUser=function(searchQu){
		seacuUsrerer(searchQu, validateArrayAjax);
	}
	function validateArrayAjax(a){
		if(a.length>0)
			$scope.faber=a;
		else
			$scope.faber=[{nameUser: 'No hay resultados',
							identy: 'Sin resultados',
							perfil: 'Sin resultados'
						}];
	}
	function seacuUsrerer(str, cb){
		ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&user='+str+'&opt=5&qryopt=0','get')
		.success(cb)
	}
})
.controller('queryQouts', function($scope, $ionicPopup, ajax){
	$scope.searchQuod=function(input){
		ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=4&qry=1&name='+$scope.searchQu,'get')
		.success(function(a){
			if(a.length>0)
				$scope.cotis=a;
			else
				$scope.cotis=[{nameCl: 'Sin Resultados',
								marca: 'Sin Resultados',
								precio: 'Sin Resultados',
								placa: 'Sin Resultados'
							}];
		});
	}
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=4&qry=0','get')
	.success(function(a){
		$scope.cotis=a;
	}, 'get');
	//es para eliminar 
	// $scope.onItemDelete = function(item){
	// 	var confirmPopup = $ionicPopup.confirm({
	// 		title: 'Eliminar Cotización',
	// 		template: 'Estas seguro de eliminar esta cotización?'
	// 	});
	// 	confirmPopup.then(function(res){
	// 		if(res){
	// 			ajax($http, {opt:0, id:item.idCoti}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=drops&class=procesos', function(a){
	// 				console.log(a);
	// 				$scope.cotis.splice($scope.cotis.indexOf(item), 1);
	// 			}, 'delete');
	// 		}else {
	// 			console.log('You are not sure');
	// 		}
	// 	});
	// };
})
.controller('connecter', function($scope, $timeout, $ionicPopup, $state, ajax){
	$scope.gifLoad=true;
	$scope.connecting=function(){
		$scope.gifLoad=false;
		moreInfo.url=$scope.con.ipdir;
		ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?connect=1','get')
		.success(function(a){
			$scope.con={}
			$ionicPopup.alert({
				title: 'Exito',
				template:'<strong>Se ha logrado la conexión</strong>'
			})
			.then(function(){
				$state.go('/login');
			});
		})
		.error(function(a){
			$scope.gifLoad=true;
			$scope.con={}
			$ionicPopup.alert({
				title: 'Error :O',
				template:'<strong>No se ha hecho la conexión</strong>'
			});
		})
	}
})
.controller('newuser', function($scope, ajax, $ionicPopup, $timeout){
	$scope.newUser=function(){
		var reset={};
		$scope.user.roll=se('input.rollUser:checked').value;
		if($scope.user.td===undefined){
			$ionicPopup.alert({
				title: 'Error',
				template: 'Por favor selecciona un tipo de documento'
			});
		}else{
			$scope.user.opt=3;
			ajax.call($scope.user, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=login&class=procesos','post')
			.success(function(a){
				if(a.res===1){
					var myPopup=$ionicPopup.alert({
						title: 'Inseción :)',
						template:'<strong>Se ha insertado un usuario :D</strong>'
					});
					$scope.user=reset;
					$timeout(function() {
						myPopup.close(); //close the popup after 3 seconds for some reason
					}, 3000);
				}else{
					var myPopup=$ionicPopup.alert({
						title: 'Error :O',
						template:'<strong>No se ha insertado el usuario ): !!</strong>'
					});
					$timeout(function() {
						myPopup.close(); //close the popup after 3 seconds for some reason
					}, 3000);
				}
			});
		}
	}
})
//muestra toda la información de la cuota y tambien la opción de editarla 
.controller('allInfoQuod', function($scope, $stateParams, ajax){
	ajax.call({}, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=gets&class=procesos&opt=4&qry=2&id='+$stateParams.cotiId,'get')
	.success(function(a){
		$scope.quot=a[0];
	});
})
//muestra el resultado de la cotizacion, el precio
.controller('resultQuote', function($scope, $window){
	if($window.innerWidth>478)
		se('img.headerimg').style.width='44%';
	else
		se('img.headerimg').style.width='100%';
	se('.mainContent').style.height='calc(100% - '+se('img.headerimg').scrollHeight+'px)';
	$scope.totalCost=moreInfo.totalValor;
	
})
//for login cel
.controller('login', function($scope, $ionicPopup, ajax, $state){
	changeSreen();
	$scope.send=function(){
		serialize(se('form.formlogin'), function(datos){
			datos.opt=0;
			ajax.call(datos, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=login&class=procesos', 'post')
			.success(function(data){
				if(data.res===1){
					moreInfo.user=data.user;
					$ionicPopup.alert({
						title: 'OK',
						template: 'Te has logeado con exito'
					}).then(function(res){
						$state.go('/admin');
					});
				}else
					$ionicPopup.alert({
						title: 'Error',
						template: 'El usuario o la contraseña estan incorrectas'
					});
			});
		});
	}
})
//paso 1 para la creación de una cotización, aca se crea el cliente
//en el paso dos se crea el vehiculo
.controller('cotiza', function($scope, $state, $ionicPopup, $timeout, ajax){
	changeSreen();
	$scope.signIn=function(){
		$scope.user.opt=1;
		ajax.call($scope.user, 'http://'+moreInfo.url+'/appSoat/protected/process/mobile.php?fnt=login&class=procesos','post')
		.success(function(data, status, headers, config){
			if(data.res===1){
				moreInfo.client=data.client;
				$scope.user={};
				$state.go('coti2');
			}
			else{
				var myPopup=$ionicPopup.alert({
					title: 'Error :O',
					template:'Ha Ocurido un error!!'
				});
				$timeout(function() {
					myPopup.close(); //close the popup after 3 seconds for some reason
				}, 3000);
			}
		});
	};
})
//no deja poner letras en los campos donde solo hay numeros(telefono, identidicaion, etc)
.directive('isNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attr, ngModelCtrl) {
			function fromUser(text){
				var transformedInput = text.replace(/[^0-9]/g, '');
				if(transformedInput !== text) {
					ngModelCtrl.$setViewValue(transformedInput);
					ngModelCtrl.$render();
				}
				return transformedInput;  // or return Number(transformedInput)
			}
			ngModelCtrl.$parsers.push(fromUser);
		}
	};
})
//cambia el ancho de la imagen de transfiriendo
function changeSreen(){
	//change dimention of main content
	se('.mainContent').style.height='calc(100% - '+se('img.headerimg').scrollHeight+'px)';
	se('img.headerimg').style.width='45%';//change dimention of imgBanner
}
// function ajax(http, data, url, cb, method){
// 	http({
// 		method: method,
// 		url: url,
// 		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
// 		data: data
// 	}).success(cb);
// }
function serialize(elem1, cb){
	data={};
	[].forEach.call(elem1.querySelectorAll('input, select, textarea'), function(elem){
		if(elem.tagName.match(/(INPUT|SELECT|TEXTAREA)/g))
			data[elem.name]=elem.value;
	});
	cb(data)
}
function si(tag, cb){
	[].forEach.call(document.querySelectorAll(tag), function(elem) {
		cb(elem);
	});
}
function se(tag){
	return document.querySelector(tag);
}