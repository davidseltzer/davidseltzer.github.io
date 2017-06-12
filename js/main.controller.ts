/// <reference path="definitely-typed/angular/index.d.ts" />

let module: angular.IModule = angular.module("main-controller", []);

const YOUTUBE_EMBED_PREFIX: string = "https://www.youtube.com/embed/";
const YOUTUBE_EMBED_SUFFIX: string = "?rel=0&amp;showinfo=0";
const YOUTUBE_TIME_SUFFIX: string = "&t=";
const YOUTUBE_URL_PREFIX: string = "https://www.youtube.com/watch?v=";

export interface ImprovTeam {
	name: string;
	type: string;
	dateRange: string;
	shows: Array<MediaInfo>;
}

export interface MediaInfo {
	startTime: string;
	subtitle: string;
	title: string;
	youtubeEmbed: string;
	youtubeId: string;
	youtubeLink: string;
}

export interface TrainingSection {
	heading: string;
	dateRange: string;
	location: string;
	items: Array<string>;
	icon: string;
}

export interface Data {
	film: Array<MediaInfo>;
	improvTeams: Array<ImprovTeam>;
	standUpShows: Array<MediaInfo>;
	training: TrainingSection;
}

export class MainController {

	public currentYear: number = new Date().getFullYear();
	public data: Data;
	public isLoaded: boolean = false;

	$http: angular.IHttpService;
	$sce: angular.ISCEService;

	static $inject: Array<string> = ["$http", "$sce"];

	constructor($http: angular.IHttpService, $sce: angular.ISCEService) {
		this.$http = $http;
		this.$sce = $sce;
		this.loadData();
	}

	private loadData() {

		this.$http.get("js/data/data.json")
		 .then(function(response: angular.IHttpPromiseCallbackArg<Data>){
			 this.data = response.data;

			 // trust video urls
			 this.trustVideos(this.data.film);
			 this.trustVideos(this.data.standUpShows);

			 for (let improvTeam of this.data.improvTeams) {
				 this.trustVideos(improvTeam.shows);
			 }

			 // trust resume items
			 for (let section of this.data.training) {
				 for (let itemIndex in section.items) {
					 section.items[itemIndex] = this.$sce.trustAsHtml(section.items[itemIndex]);
				 }
			 }

			 this.isLoaded = true;
		 }.bind(this));
	}

	private trustVideos(mediaList: Array<MediaInfo>): void {

		for (let media of mediaList) {

			let startTimeSuffix: string = "";
			if (media.startTime) {
				startTimeSuffix = YOUTUBE_TIME_SUFFIX + media.startTime;
			}

			media.youtubeEmbed = this.$sce.trustAsResourceUrl(YOUTUBE_EMBED_PREFIX + media.youtubeId + YOUTUBE_EMBED_SUFFIX + startTimeSuffix);
			media.youtubeLink = this.$sce.trustAsResourceUrl(YOUTUBE_URL_PREFIX + media.youtubeId + startTimeSuffix);
		}
	}
}

module.controller("MainController", MainController);