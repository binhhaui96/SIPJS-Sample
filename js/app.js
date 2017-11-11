var simple;
var ua;
var app = angular.module('app', []);
app.controller('indexCtrl', function ($scope) {
    $scope.name = 'binhtroi';
    $scope.mysip = '3600@nguyenphuongha.com';
    $scope.othersip = '3000@nguyenphuongha.com';
    $scope.auth_username = '3600';
    $scope.password = '3600';
    $scope.ws_server = 'ws://nguyenphuongha.com:5066';
    $scope.logs = [];
    $scope.is_registed = false;

    appendLog = function (logType, logMessage) {
        var log = {};
        log['type'] = logType;
        log['message'] = logMessage;
        $scope.logs.push(log);
    }

    $scope.initPhone = function () {
        appendLog("INIT PHONE", "");

        ua = new SIP.UA({
            uri: $scope.mysip,
            wsServers: [$scope.ws_server],
            authorizationUser: $scope.auth_username,
            password: $scope.password,
            displayName: $scope.name,
            register: false
        });

        // Handle UA
        ua.on('connected', function (e) {
            appendLog("INIT PHONE", "Connected to websocket");
            $scope.$apply();
        });

        ua.on('disconnected', function (e) {
            appendLog("INIT PHONE", "Can't connect to websocket");
            $scope.$apply();
        });

        ua.on('registered', function (e) {
            appendLog("INIT PHONE", "Regist success! ");
            $scope.$apply();
            $scope.is_registed = true;
        });

        ua.on('unregistered', function (response, cause) {
            appendLog("INIT PHONE", "Unregist success! ");
            $scope.is_registed = false;
            $scope.$apply();
        });

        ua.on('invite',function(session)
        {
            session.accept({
                media: {
                    constraints: {
                        audio: true,
                        video: false
                    }
                }
            });
        });
        simple = new SIP.WebRTC.Simple({
            ua: ua,
            media: {
                remote: {
                    video: document.getElementById('remoteVideoFrame'),
                  
                }, local: {
                    video: document.getElementById('localVideoFrame')
                }
            },
        });


    };

    $scope.regist = function () {
        ua.register();
    }

    $scope.unregist = function () {
      
        ua.unregister();
    }

    $scope.call = function () {
        var session = ua.invite($scope.othersip, {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: true,
                    video: false
                }
            }
        });
    };

});