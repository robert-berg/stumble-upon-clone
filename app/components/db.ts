const appSettings = require("tns-core-modules/application-settings");
import { HISTORY, BOOKMARKS, ENABLED_TOPICS, IS_FIRST_LAUNCH } from "./constants";

function saveData(key, value) {
	appSettings.setString(key, JSON.stringify(value));
}

function readData(key, defaultValue) {
	return JSON.parse(appSettings.getString(key, JSON.stringify(defaultValue)));
}

export function updateHistory(history) {
	saveData(HISTORY, history);
}

export function readHistory() {
	return readData(HISTORY, []);
}

export function updateBookmarks(bookmarks) {
	saveData(BOOKMARKS, bookmarks);
}

export function readBookmarks() {
	return readData(BOOKMARKS, []);
}

export function updateEnabledTopics(topics) {
	saveData(ENABLED_TOPICS, topics);
}

export function readEnabledTopics() {
	return readData(ENABLED_TOPICS, []);
}

export function readIsFirstLaunch() {
	return readData(IS_FIRST_LAUNCH, true);
}

export function updateIsFirstLaunch(value: Boolean) {
	saveData(IS_FIRST_LAUNCH, value);
}
