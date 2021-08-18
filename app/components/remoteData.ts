function useRemoteData(url, callback) {
	const httpModule = require("tns-core-modules/http");

	httpModule.getJSON(url).then(remoteData => {
		callback(remoteData);
	});
}

export function loadLinks(userTopics, topics, callback = null) {
	let resultArr = [];
	topics.forEach(topic => {
		if (userTopics.includes(topic.title)) {
			try {
				topic["sources"].forEach(source => {
					if (source[0] == "Reddit") {
						source[1].forEach(url => {
							loadRedditData(url, resultArr);
						});
					}
				});
			} catch (error) {
				console.error(error);
			}
		}
	});

	if (callback !== null) {
		return callback(resultArr);
	}

	return resultArr;
}

function loadRedditData(url, resultArr) {
	try {
		useRemoteData(url, redditResponse => {
			const posts = redditResponse.data.children;

			posts.forEach(post => {
				const domain = getHostname(post.data.url);

				if (post.data.stickied == false && domain != "reddit.com" && domain != "gfycat.com" && domain != "washingtonpost.com") {
					resultArr.push(post.data.url);
				}
			});
			return resultArr;
		});
	} catch (error) {
		console.error(error);
	}
}

function getHostname(url) {
	const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);

	return (matches && matches[1]).replace(/^(www\.)/, "");
}
