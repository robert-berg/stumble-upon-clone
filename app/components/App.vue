<template>
	<Page @loaded="pageLoaded" id="page" backgroundSpanUnderStatusBar="true" actionBarHidden="true" androidStatusBarBackground="#000000">
		<GridLayout id="main-container" :class="{ 'bg-black': currentLink.contentType == 'Image' && startTimeoutFinished !== 0 }" columns="*" rows="*">
			<ActivityIndicator v-if="startTimeoutFinished == 0" width="36" height="36" row="1" col="0" busy="true" @busyChange="onBusyChanged" />

			<Image row="1" col="0" :style="currentLink.contentType !== 'Image' ? { visibility: 'collapsed' } : { visibility: 'visible' }" class="web-container" id="image" />
			<WebView row="1" col="0" :style="currentLink.contentType !== 'Website' ? { visibility: 'collapsed' } : { visibility: 'visible' }" id="webview" ref="webview" class="web-container" @loadStarted="webViewLoaded"> </WebView>
			<fab @tap="fabTap" icon="~/mdi_scatter_plot.png" rippleColor="#f1f1f1" class="fab-button"></fab>
			<GridLayout row="2" height="56" class="bottom-bar" col="0" columns="*, *, *, *, *" rows="*">
				<Image @tap="shareLink" id="nav-share" row="0" col="0" horizontalAlignment="center" class="nav-btn" src="~/baseline_share_black_24dp.png" height="48" />
				<Image v-if="isBookmarked" @tap="removeBookmark" id="nav-bookmark" src="~/baseline_bookmark_filled_primary_24dp.png" class="nav-btn" height="48" row="0" col="1" horizontalalignment="center" text="" />
				<Image v-else @tap="createBookmark" id="nav-bookmark" src="~/baseline_bookmark_border_black_24dp.png" class="nav-btn" height="48" row="0" col="1" horizontalalignment="center" text="" />
				<span row="0" col="2" horizontalalignment="center" />
				<Image @tap="showPreferences" id="nav-preferences" src="~/baseline_filter_list_black_24dp.png" class="nav-btn" height="48" row="0" col="3" horizontalalignment="center" text="" />
				<Image @tap="showMenu" id="nav-more" src="~/baseline_more_vert_black_24dp.png" class="nav-btn" height="48" row="0" col="4" horizontalalignment="center" text="" />
			</GridLayout>
		</GridLayout>
	</Page>
</template>

<script lang="ts">
import BookmarksPage from "./BookmarksPage.vue"
import PreferencesPage from "./PreferencesPage.vue"

import * as application from "tns-core-modules/application"
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application"
import { isAndroid } from "tns-core-modules/platform"
import { Menu } from "nativescript-menu"
const api = require("./remoteData")
import * as socialShareModule from "nativescript-social-share"
import { readEnabledTopics } from "./db"
const constants = require("./constants")
const db = require("./db")
const animateSize = require("./animations").animateSize
const nv = require("./navigate")
import * as dialogs from "tns-core-modules/ui/dialogs"
import { WebViewExt, LoadFinishedEventData } from "@nota/nativescript-webview-ext"
const View = require("ui/core/view").View
require("nativescript-master-technology")
const utils = require("utils/utils")
export default {
	components: {
		BookmarksPage,
		PreferencesPage,
	},

	data() {
		return {
			links: [],
			additionalLinks: [],
			overwriteLink: null,
			loadedWebView: null,
			history: [],
			loadedPage: null,
			loadedPageHeight: null,
			bookmarks: [],
			linksLoadFinished: false,
			adsDisplayRate: 7,
			contentLoadCounter: 0,
			smartBannerHeight: null,
			startTimeoutFinished: 0,
		}
	},
	created() {
		this.retrieveLinks()
		this.history = db.readHistory()
		this.retrieveBookmarks()
	},

	mounted() {
		setTimeout(() => {
			if (!(this.linksLeft > 0)) {
				this.updatedGetCurrentLink()
			}
		}, 200)
	},

	methods: {
		listenOnBackPress(callback) {
			if (isAndroid) {
				application.android.on(AndroidApplication.activityBackPressedEvent, (event: AndroidActivityBackPressedEventData) => {
					if (nv.isStart === true) {
						this.handleBackPress(event)
					} else {
						nv.closePage()
					}
				})
			}
		},

		handleBackPress(event) {
			event.cancel = true
			if (this.currentLink.contentType == "Image") {
				application.android.foregroundActivity.finish()
			} else {
				const wv = this.loadedPage.getViewById("webview")

				if (this.loadedWebView == null) {
					application.android.foregroundActivity.finish()
					return
				} else if (wv == null) {
					application.android.foregroundActivity.finish()
					return
				} else {
					try {
						application.android.foregroundActivity.finish()
					} catch (error) {
						console.error(error)
					}
				}
			}
		},
		webViewLoaded(args) {
			try {
				args.object.android.getSettings().setDisplayZoomControls(false)
				this.loadedWebView = args.object
			} catch (error) {
				console.error(error)
			}
		},
		shareLink(args) {
			try {
				animateSize(args.object)
				socialShareModule.shareUrl(this.currentLink.url, "via stumble_upon_clone", "How would you like to share?")
			} catch (e) {
				console.error(e)
			}
		},

		showPreferences(args) {
			if (args) {
				animateSize(args.object)
			}

			nv.openPage(
				this.$navigateTo(PreferencesPage, {
					props: { type: this.currentLink.contentType },
				}).then((data) => {
					if (data) {
						this.overwriteLink = data
						this.updatedGetCurrentLink
					}
				}),
				() => {
					dialogs.alert({					
						message: "The changes will take effect after you restart the app"
					})
			
				}
			)
		},
		createBookmark(args) {
			animateSize(args.object)

			try {
				let title = "Image"
				if (this.currentLink.contentType == constants.WEBSITE) {
					title = this.loadedWebView.android.getTitle()
				}

				let bm = [
					this.bookmarks,
					{
						url: this.currentLink.url,
						title: title,
					},
				]

				db.updateBookmarks(flatten(bm))
				this.bookmarks.push({
					url: this.currentLink.url,
					title: title,
				})
			} catch (e) {
				console.error(e)
			}
		},
		removeBookmark(args) {
			animateSize(args.object)
			this.bookmarks = this.bookmarks.filter((bookmark) => {
				return bookmark.url != this.currentLink.url
			})

			db.updateBookmarks(this.bookmarks)
		},
		pageLoaded(args) {
			var page = args.object
			this.loadedPage = page

			page.on("layoutChanged", () => {
				this.loadedPageHeight = page.getActualSize().height

				if (this.loadedPageHeight > 720) {
					this.smartBannerHeight = 90
				} else if (this.loadedPageHeight > 400) {
					this.smartBannerHeight = 50
				} else {
					this.smartBannerHeight = 32
				}
			})

			this.listenOnBackPress()
		},
		fabTap(args) {
			animateSize(args.object, 0.9, 0.9)
			this.contentLoadCounter += 1

			this.overwriteLink = null

			if (this.linksLeft <= 5) {
				try {
					this.appendGeneralLinks()
				} catch (error) {
					console.error(error)
				}
			}
			try {
				let h = db.readHistory()

				h.push(this.currentLink.url)

				db.updateHistory(flatten(h))
				this.history = db.readHistory()
			} catch (e) {
				console.error(e)
			}

			this.updatedGetCurrentLink()
		},
		showMenu(args) {
			animateSize(args.object)

			Menu.popup({
				view: args.object,
				actions: ["Bookmarks", "Rate This App"],
			})
				.then((action) => {
					switch (action.id) {
						case 0:
							nv.openPage(
								this.$showModal(BookmarksPage, {
									fullscreen: true,
									props: {
										bookmarks: db.readBookmarks(),
									},
								}).then((data) => {
									setTimeout(() => {
										nv.isStart = true
									}, 2000)
									if (data) {
										this.overwriteLink = data
										this.updatedGetCurrentLink()
									}
								}),
								() => {
									this.$modal.close(null)
								}
							)

							break

						case 1:
							gotoPlayStore()
							break

						default:
					}
				})
				.catch(console.error)
		},

		retrieveLinks() {
			let enabledTopics = db.readEnabledTopics()
			if (enabledTopics.length === 0) {
				enabledTopics = ["Nature", "Future", "Technology", "Privacy"] // default if no interest is set
			}

			this.links = api.loadLinks(enabledTopics, constants.topics)
			setTimeout(() => {
				if (this.linksLeft < 10 || db.readEnabledTopics().length == 0) {
					this.appendGeneralLinks()
				}
			}, 1500)
		},

		retrieveBookmarks() {
			this.bookmarks = db.readBookmarks()
		},

		appendGeneralLinks() {
			if (this.additionalLinks.length == 0) {
				this.additionalLinks = api.loadLinks(["General"], constants.generalTopics)
			}
		},
		getContentType(url) {
			const re = /(?:\.([^.]+))?$/

			if (constants.imageFileExtensions.includes(re.exec(url)[0])) {
				return constants.IMAGE
			} else {
				return constants.WEBSITE
			}
		},
		updatedGetCurrentLink() {
			const page = this.loadedPage
			const updateWebContent = () => {
				setTimeout(() => {
					var image = page.getViewById("image")
					var webview = page.getViewById("webview")

					if (this.currentLink.contentType == "Image" && this.currentLink.url !== undefined) {
						image.src = this.currentLink.url
						webview.src = ""
					} else if (this.currentLink.contentType == "Website" && this.currentLink.url !== undefined) {
						webview.src = this.currentLink.url
						image.src = ""
					}

					this.startTimeoutFinished = 1
				}, 50)
			}

			setTimeout(() => {
				if (page) {
					updateWebContent()
				} else {
					this.updatedGetCurrentLink()
				}
			}, 50)
		},
	},

	computed: {
		currentLink() {
			if (this.overwriteLink !== null) {
				return { url: this.overwriteLink, contentType: this.getContentType(this.overwriteLink) }
			}

			var linkArr = this.randomLinkOrder.slice(0)

			if (this.links.length > 0) {
				for (let index = 0; index < this.links.length; index += 1) {
					if (!this.history.includes(linkArr[index])) {
						return { url: linkArr[index], contentType: this.getContentType(linkArr[index]) }
					}
				}
			} else {
				return { url: undefined, contentType: constants.WEBSITE }
			}
		},
		randomLinkOrder() {
			let l = this.links.concat(this.additionalLinks)

			return l.sort(function() {
				return 0.5 - Math.random()
			})
		},

		linksLeft() {
			let counter = 0
			for (let index = 0; index < this.randomLinkOrder.length; index += 1) {
				if (!this.history.includes(this.randomLinkOrder[index])) {
					counter++
				}
			}

			return counter
		},

		isBookmarked() {
			for (let index = 0; index < this.bookmarks.length; index += 1) {
				const bookmark = this.bookmarks[index]

				if (bookmark.url === this.currentLink.url) {
					return true
				}
				if (index === this.bookmarks.length) {
					return false
				}
			}
		},
	},
}

function flatten(arr) {
	return arr.reduce(function(flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
	}, [])
}
function gotoPlayStore() {
	let androidPackageName = application.android.packageName
	let uri = android.net.Uri.parse("market://details?id=" + androidPackageName)
	let myAppLinkToMarket = new android.content.Intent(android.content.Intent.ACTION_VIEW, uri)
	// Launch the PlayStore
	application.android.foregroundActivity.startActivity(myAppLinkToMarket)
}
</script>

<style scoped>
.bg-black {
	background-color: black;
}

.bottom-bar {
	height: 56;
	vertical-align: bottom;
	background-color: #fcfcfc;
}

.web-container {
	margin: 0 0 56 0;
}

.fab-button {
	height: 64;
	width: 64;
	margin: 15;
	background-color: #008078;
	horizontal-align: center;
	vertical-align: bottom;
}

.nav-btn {
	border-color: transparent;
	border-width: 1;
	android-elevation: 0;
	z-index: 0;
	opacity: 0.75;
	padding: 34px;
}

.hidden {
	visibility: collapsed;
}

.notopmargin {
	margin-top: 0;
}

#ad-container {
	height: 56;
	top: 0;
	width: 100%;
	vertical-align: top;
}

#main-container {
	margin-top: 0;
}
</style>
