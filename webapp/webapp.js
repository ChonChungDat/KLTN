angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io'
]).config(function($routeProvider) { 
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'Home'
    });
}).factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('/webapp');	//Tên namespace webapp

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
	
/////////////////////// Những dòng code ở trên phần này là phần cài đặt, các bạn hãy đọc thêm về angularjs để hiểu, cái này không nhảy cóc được nha!
}).controller('Home', function($scope, mySocket) {
	////Khu 1 -- Khu cài đặt tham số 
    //cài đặt một số tham số test chơi
	//dùng để đặt các giá trị mặc định
    $scope.CamBienAS = "";
	$scope.NhietDHT = "";
	$scope.AmDHT = "";
	$scope.amdat = "";
    $scope.leds_status = [0]
	$scope.mbom_status = [0]
	$scope.phsuong_status = [0]
	$scope.reche_status = [0]
	$scope.modeHD = "";
	$scope.ttden = "";
	$scope.ttbom = "";
	$scope.ttsuong = "";
	$scope.modes_status = [0]
	
	////Khu 2 -- Cài đặt các sự kiện khi tương tác với người dùng
	//các sự kiện ng-click, nhấn nút
	$scope.updateSensor  = function() {
		//mySocket.emit("RAIN")
		mySocket.emit("DHT")
		mySocket.emit("BH1750")
		mySocket.emit("AMDAT")
		mySocket.emit("MODE")
	}
	
	//$scope.updateSensor  = function() {
	//	mySocket.emit("DHT")
	//}
	
	
	$scope.changeMODE = function() {
		var den = document.getElementById("led")
		var bom = document.getElementById("bom")
		var suong = document.getElementById("suong")
		//var info = document.getElementById("info")
		den.disabled = !den.disabled
		bom.disabled = !bom.disabled
		suong.disabled = !suong.disabled
		
		//if (den.disabled == true) {info.display = "display"}
		//else {info.display = "none"}
		//(den.disabled)?den.title = "ban phai chuyen sang hover" : den.title = ""
		//(bom.disabled)?bom.title = "ban phai chuyen sang hover" : bom.title = ""
		//(suong.disabled)?suong.title = "ban phai chuyen sang hover" : suong.title = ""
		console.log("send MODE ", $scope.modes_status)
		var json = {
			"mode": $scope.modes_status
		}
		mySocket.emit("MODE", json)
		$scope.ttmode = ($scope.modes_status == 1)  ? "MANUAL" : "AUTO"
		
	}
	
	$scope.changeLED = function() {
		console.log("send LED ", $scope.leds_status)
		var json = {
			"led": $scope.leds_status
		}
		mySocket.emit("LED", json)
		$scope.ttden = ($scope.leds_status == 1)  ? "ON" : "OFF"
		
	}
	
	
	$scope.changeMBOM = function() {
		console.log("send MAYBOM ", $scope.mbom_status)
		
		var json = {
			"maybom": $scope.mbom_status
		}
		mySocket.emit("MAYBOM", json)
		$scope.ttbom = ($scope.mbom_status == 1)  ? "ON" : "OFF"
	}
	
	
	$scope.changePHSUONG = function() {
		console.log("send PHUNSUONG ", $scope.phsuong_status)
		
		var json = {
			"phunsuong": $scope.phsuong_status
		}
		mySocket.emit("PHUNSUONG", json)
		$scope.ttsuong = ($scope.phsuong_status == 1)  ? "ON" : "OFF"
	}
	
	
	
	////Khu 3 -- Nhận dữ liệu từ Arduno gửi lên (thông qua ESP8266 rồi socket server truyền tải!)
	//các sự kiện từ Arduino gửi lên (thông qua esp8266, thông qua server)
	mySocket.on('MODE', function(json) {
		$scope.modeHD = (json.hoatdong == 1) ? "MANUAL" : "AUTO"
	})
	
	mySocket.on('AUTO', function(json) {
		$scope.ttden = (json.den == 1) ? "ON" : "OFF"
		$scope.ttbom = (json.bom == 1) ? "ON" : "OFF"
		$scope.ttsuong = (json.suong == 1) ? "ON" : "OFF"
	})
	
	mySocket.on('MANUAL', function(json) {
		$scope.ttden = (json.den == 1) ? "ON" : "OFF"
		$scope.ttbom = (json.bom == 1) ? "ON" : "OFF"
		$scope.ttsuong = (json.suong == 1) ? "ON" : "OFF"
	})
	
	mySocket.on('LED_STATUS', function(json) {
		$scope.ttden = (json.bom == 1) ? "ON" : "OFF"
	})
	
	mySocket.on('BH1750', function(json) {
		$scope.CamBienAS = (json.ASangLUX)
	})
	
	mySocket.on('DHT', function(json) {
		$scope.NhietDHT = (json.NhietDo) 
		$scope.AmDHT = (json.DoAmKhi)
	})
	
	mySocket.on('AMDAT', function(json) {
		$scope.amdat = (json.AmDat)
	})
	//Khi nhận được lệnh LED_STATUS
	mySocket.on('LED_STATUS', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv LED", json)
		$scope.leds_status = json.data
	})
	//Khi nhận được lệnh MAYBOM_STATUS
	mySocket.on('MAYBOM_STATUS', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv MAYBOM", json)
		$scope.mbom_status = json.data
	})
	
	mySocket.on('PHUNSUONG_STATUS', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv PHUNSSUONG", json)
		$scope.phsuong_status = json.data
	})
	
	//mySocket.on('REMCHE_STATUS', function(json) {
		//Nhận được thì in ra thôi hihi.
	//	console.log("recv REMCHE", json)
	//	$scope.reche_status = json.data
	//})
	
	
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
		 mySocket.emit("BH1750") //Cập nhập trạng thái mưa
		 mySocket.emit("DHT")// Trạng thái nhiệt độ, độ ẩm
		 mySocket.emit("AMDAT")
		 mySocket.emit("MODE")
	})
		
});