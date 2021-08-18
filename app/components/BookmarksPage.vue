<template>
	<Page backgroundSpanUnderStatusBar="true" actionBarHidden="true" androidStatusBarBackground="#000000">
		<ScrollView orientation="vertical">
			<StackLayout>
				<Label id="bookmark-list-title" text="Bookmarks" />
				<StackLayout @tap="showWebsite($event, bookmark.url)" class="bookmark-item" v-for="bookmark in bookmarks.slice().reverse()" v-bind:key="bookmark.url">
					<Label v-if="bookmark.title" class="bookmark-title" :text="bookmark.title" />
					<Label class="bookmark-url" :text="bookmark.url" />
				</StackLayout>
			</StackLayout>
		</ScrollView>
	</Page>
</template>

<script lang="ts">
import { isAndroid } from "tns-core-modules/platform";
import * as application from "tns-core-modules/application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";

export default {
	props: ["bookmarks"],
	created() {
	},
	methods: {
		listenOnBackPress(callback) {
			if (isAndroid) {
				application.android.on(AndroidApplication.activityBackPressedEvent, (event: AndroidActivityBackPressedEventData) => {
					this.handleBackPress(event);
				});
			}
		},

		handleBackPress(event) {
			event.cancel = false;
		},
		animateBg(object, callback, color = "#f3f3f3") {
			const Color = require("tns-core-modules/color").Color;
			object
				.animate({
					backgroundColor: new Color(color),
					duration: 165
				})
				.then(() => {
					object.animate({
						backgroundColor: new Color("#ffffff"),
						duration: 165
					});
				})
				.then(callback);
		},

		showWebsite(args, bookmark) {
			this.animateBg(args.object, () => {
				this.$modal.close(bookmark);
			});
		}
	}
};
</script>

<style scoped>
#bookmark-list-title {
	font-size: 24;
	font-weight: 500;
	margin: 24;
	color: #242d2f;
	opacity: 0.75;
}

.bookmark-item {
	padding: 12;
	color: #242d2f;
	margin: 8 12;
	font-size: 15;
	border-radius: 4;
	android-elevation: 0;
	z-index: 0;
}

.bookmark-title {
	font-weight: 500;
	color: #242d2f;
	font-size: 16;
	opacity: 0.8;
}

.bookmark-url {
	opacity: 0.75;
}
</style>
