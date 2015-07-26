/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgTracks
 * @restrict A
 * @description
 * Optional directive for `vg-media` to add a list of tracks.
 *
 * vgTracks Bindable array with a list of subtitles sources. A track source is an object with five properties: src, kind, srclang, label and default.
 * <pre>
 * {
 *    src: "assets/subs/pale-blue-dot.vtt",
 *    kind: "subtitles",
 *    srclang: "en",
 *    label: "English",
 *    default: "true/false"
 * }
 * </pre>
 */
"use strict";
angular.module("com.2fdevs.videogular")
    .directive("vgTracks",
    [function () {
        return {
            restrict: "A",
            require: "^videogular",
            link: {
                pre: function (scope, elem, attr, API) {
                    var tracks;
                    var trackText;
                    var i;
                    var l;

                    scope.onLoadMetaData = function() {
                        scope.updateTracks();
                    };

                    scope.updateTracks = function() {
                        // Remove previous tracks
                        var oldTracks = API.mediaElement.children();

                        for (i = 0, l = oldTracks.length; i < l; i++) {
                            if (oldTracks[i].remove) {
                                oldTracks[i].remove();
                            }
                        }

                        // Add new tracks
                        if (tracks) {
                            for (i = 0, l = tracks.length; i < l; i++) {
                                var track = document.createElement('track');
                                for (var prop in tracks[i]) {
                                    track[prop] = tracks[i][prop];
                                }

                                track.addEventListener('load', scope.onLoadTrack.bind(scope, track));

                                API.mediaElement[0].appendChild(track);
                            }
                        }
                    };

                    scope.onLoadTrack = function(track) {
                        track.mode = 'showing';
                        API.mediaElement[0].textTracks[0].mode = 'showing'; // thanks Firefox
                    };

                    scope.setTracks = function setTracks(value) {
                        // Add tracks to the API to have it available for other plugins (like controls)
                        tracks = value;
                        API.tracks = value;

                        API.mediaElement[0].addEventListener("loadedmetadata", scope.onLoadMetaData.bind(scope), false);
                    };

                    if (API.isConfig) {
                        scope.$watch(
                            function () {
                                return API.config;
                            },
                            function () {
                                if (API.config) {
                                    scope.setTracks(API.config.tracks);
                                }
                            }
                        );
                    }
                    else {
                        scope.$watch(attr.vgTracks, function (newValue, oldValue) {
                            if ((!tracks || newValue != oldValue)) {
                                scope.setTracks(newValue);
                            }
                        });
                    }
                }
            }
        }
    }
    ]);
