define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var module = angular.module("main-controller", []);
    var YOUTUBE_EMBED_PREFIX = "https://www.youtube.com/embed/";
    var YOUTUBE_EMBED_SUFFIX = "?rel=0&amp;showinfo=0";
    var YOUTUBE_TIME_SUFFIX = "&t=";
    var YOUTUBE_URL_PREFIX = "https://www.youtube.com/watch?v=";
    var MainController = (function () {
        function MainController($http, $sce) {
            this.currentYear = new Date().getFullYear();
            this.isLoaded = false;
            this.$http = $http;
            this.$sce = $sce;
            this.loadData();
        }
        MainController.prototype.loadData = function () {
            this.$http.get("js/data/data.json")
                .then(function (response) {
                this.data = response.data;
                this.trustVideos(this.data.film);
                this.trustVideos(this.data.standUpShows);
                for (var _i = 0, _a = this.data.improvTeams; _i < _a.length; _i++) {
                    var improvTeam = _a[_i];
                    this.trustVideos(improvTeam.shows);
                }
                for (var _b = 0, _c = this.data.training; _b < _c.length; _b++) {
                    var section = _c[_b];
                    for (var itemIndex in section.items) {
                        section.items[itemIndex] = this.$sce.trustAsHtml(section.items[itemIndex]);
                    }
                }
                this.isLoaded = true;
            }.bind(this));
        };
        MainController.prototype.trustVideos = function (mediaList) {
            for (var _i = 0, mediaList_1 = mediaList; _i < mediaList_1.length; _i++) {
                var media = mediaList_1[_i];
                var startTimeSuffix = "";
                if (media.startTime) {
                    startTimeSuffix = YOUTUBE_TIME_SUFFIX + media.startTime;
                }
                media.youtubeEmbed = this.$sce.trustAsResourceUrl(YOUTUBE_EMBED_PREFIX + media.youtubeId + YOUTUBE_EMBED_SUFFIX + startTimeSuffix);
                media.youtubeLink = this.$sce.trustAsResourceUrl(YOUTUBE_URL_PREFIX + media.youtubeId + startTimeSuffix);
            }
        };
        return MainController;
    }());
    MainController.$inject = ["$http", "$sce"];
    exports.MainController = MainController;
    module.controller("MainController", MainController);
});
//# sourceMappingURL=main.controller.js.map