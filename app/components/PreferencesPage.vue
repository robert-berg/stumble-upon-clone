<template>
	<Page @loaded="pageLoaded" backgroundSpanUnderStatusBar="true" actionBarHidden="true" androidStatusBarBackground="#000000">
		<ScrollView orientation="vertical">
			<StackLayout>
				<Label id="preferences-list-title" text="Choose Your Interests" />

				<GridLayout v-for="topic in topics" :key="topic.title" rows="auto" columns="*" class="interest-item">
					<Label row="0" class="preference-item">{{ topic.title }}</Label>
					<Switch row="0" v-model="topic.enabled" checked="false" />
				</GridLayout>

				<Button text="Submit" @tap="submit" />
			</StackLayout>
		</ScrollView>
	</Page>
</template>

<script lang="ts">
const timer = require("tns-core-modules/timer")
const db = require("./db")
import * as dialogs from "tns-core-modules/ui/dialogs"
const nv = require("./navigate")
const arraysEqual = require("./utils").arraysEqual
import * as application from "tns-core-modules/application"
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application"
import { isAndroid } from "tns-core-modules/platform"
require("nativescript-master-technology")

export default {
	props: ["type"],
	data() {
		return {
			topics: [
				{
					enabled: false,
					title: "Technology",
				},
				{
					enabled: false,
					title: "Nature",
				},
				{
					enabled: false,
					title: "Science",
				},
				{
					enabled: false,
					title: "Programming",
				},
				{
					enabled: false,
					title: "Business",
				},
				{
					enabled: false,
					title: "Politics",
				},
				{
					enabled: false,
					title: "Web Development",
				},
				{
					enabled: false,
					title: "Privacy",
				},
				{
					enabled: false,
					title: "Travel",
				},
				{
					enabled: false,
					title: "Machine Learning",
				},
				{
					enabled: false,
					title: "Environment",
				},
				{
					enabled: false,
					title: "Psychology",
				},
				{
					enabled: false,
					title: "Gadgets",
				},
				{
					enabled: false,
					title: "Future",
				},
				{
					enabled: false,
					title: "History",
				},
			],
		}
	},
	created() {
		this.setAlreadyEnabled()
		nv.isStart = false
		nv.beforeClose = () => {
			this.submit(true)
		}

		if (this.type === "Image") {
			if (isAndroid) {
				application.android.on(AndroidApplication.activityBackPressedEvent, (event: AndroidActivityBackPressedEventData) => {
					let enabledNow = []

					this.topics.forEach((topic) => {
						if (topic.enabled) {
							enabledNow.push(topic.title)
						}
					})
					db.updateEnabledTopics(enabledNow)
				})
			}
		}

		nv.backButtonHandler = () => {
			let enabledNow = []

			this.topics.forEach((topic) => {
				if (topic.enabled) {
					enabledNow.push(topic.title)
				}
			})

			return {
				unchanged: arraysEqual(enabledNow, db.readEnabledTopics()),
				saveMethod: () => {
					db.updateEnabledTopics(enabledNow)
					this.$navigateBack()
				},
			}
		}
	},
	mounted() {},
	methods: {
		submit() {
			let enabledNow = []

			if (db.readIsFirstLaunch()) {
				db.updateIsFirstLaunch(false)
			}

			this.topics.forEach((topic) => {
				if (topic.enabled) {
					enabledNow.push(topic.title)
				}
			})

			if (!arraysEqual(enabledNow, db.readEnabledTopics())) {
				db.updateEnabledTopics(enabledNow)
			}
			this.$navigateBack()
			dialogs.alert({
				message: "The changes will take effect after you restart the app",
			})
		},
		pageLoaded(args) {},
		setAlreadyEnabled() {
			const enabledTopics = db.readEnabledTopics()

			enabledTopics.forEach((enabledTopic) => {
				this.topics.forEach((topic) => {
					if (compareStrings(enabledTopic, topic.title)) {
						topic.enabled = true
					}
				})
			})
		},
	},
}

function compareStrings(a, b) {
	return JSON.stringify(a) === JSON.stringify(b)
}
</script>

<style scoped>
#preferences-list-title {
	font-size: 24;
	font-weight: 500;
	margin: 24;
	color: #242d2f;
	opacity: 0.925;
}

.preference-item {
	padding: 12;
	color: #242d2f;
	margin: 8 0 8 16;
	android-elevation: 0;
	z-index: 0;
	font-weight: 500;
	font-size: 16;
	opacity: 0.95;
	horizontal-align: left;
}

button {
	margin: 8 16;
	font-size: 16;
	background-color: #008078;
	color: white;
	font-weight: 500;
}

Switch {
	margin-right: 16;
	horizontal-align: right;
}
</style>
