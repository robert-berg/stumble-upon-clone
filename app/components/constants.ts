// Constants

export const IMAGE = "Image";
export const WEBSITE = "Website";
export const BOOKMARKS = "bookmarks";
export const HISTORY = "history";
export const ENABLED_TOPICS = "enabled_topics";
export const IS_FIRST_LAUNCH = "is_first_launch";
export const DEFAULT = "default";
export const SHOW = "show";
export const SKIP = "skip";
export const imageFileExtensions = [".tif", ".tiff", ".bmp", ".jpg", ".jpeg", ".gif", ".png", ".eps", ".raw", ".cr2", ".nef", ".orf", ".sr2"];

export const topics = [
	{
		title: "Nature",
		sources: [["Reddit", ["https://www.reddit.com/r/nature/.json", "https://www.reddit.com/r/NatureIsFuckingLit/.json"]]]
	},

	{
		title: "Programming",
		sources: [["Reddit", ["https://www.reddit.com/r/programming/.json", "https://www.reddit.com/r/coding/.json", "https://www.reddit.com/r/hackernews/.json"]]]
	},

	{
		title: "Travel",
		sources: [["Reddit", ["https://www.reddit.com/r/travel/.json", "https://www.reddit.com/r/backpacking/.json"]]]
	},
	{
		title: "Machine Learning",
		sources: [["Reddit", ["https://www.reddit.com/r/MachineLearning/.json", "https://www.reddit.com/r/learnmachinelearning/top/.json?t=day"]]]
	},
	{
		title: "Privacy",
		sources: [["Reddit", ["https://www.reddit.com/r/privacy/.json", "https://www.reddit.com/r/netsec/"]]]
	},
	{
		title: "Science",
		sources: [["Reddit", ["https://www.reddit.com/r/Science/.json", "https://www.reddit.com/r/EverythingScience/.json"]]]
	},
	{
		title: "Future",
		sources: [["Reddit", ["https://www.reddit.com/r/Futurology/.json", "https://www.reddit.com/r/longevity/top/.json?t=month"]]]
	},
	{
		title: "Web Development",
		sources: [["Reddit", ["https://www.reddit.com/r/webdev/.json", "https://www.reddit.com/r/web_design/.json"]]]
	},
	{
		title: "Environment",
		sources: [["Reddit", ["https://www.reddit.com/r/Environment/.json", "https://www.reddit.com/r/ecology/.json", "https://www.reddit.com/r/sustainability/.json"]]]
	},
	{
		title: "Politics",
		sources: [["Reddit", ["https://www.reddit.com/r/geopolitics/.json", "https://www.reddit.com/r/socialscience/.json", "https://www.reddit.com/r/WikiLeaks/.json", "https://www.reddit.com/r/moderatepolitics/.json"]]]
	},
	{
		title: "Psychology",
		sources: [["Reddit", ["https://www.reddit.com/r/psychology/.json", "https://www.reddit.com/r/cogsci/top/.json?t=month", "https://www.reddit.com/r/neuroscience/top/.json?t=month"]]]
	},
	{
		title: "Technology",
		sources: [["Reddit", ["https://www.reddit.com/r/technology/.json", "https://www.reddit.com/r/tech/.json"]]]
	},
	{
		title: "Gadgets",
		sources: [["Reddit", ["https://www.reddit.com/r/gadgets/.json", "https://www.reddit.com/r/technews/top/.json?t=week", "https://www.reddit.com/r/Android/.json", "https://www.reddit.com/r/apple/.json"]]]
	},
	{
		title: "Business",
		sources: [["Reddit", ["https://www.reddit.com/r/business/.json", "https://www.reddit.com/r/Economics/.json"]]]
	},
	{
		title: "History",
		sources: [["Reddit", ["https://www.reddit.com/r/AncientCivilizations/.json", "https://www.reddit.com/r/ancienthistory/.json", "https://www.reddit.com/r/HistoryofIdeas/top/.json?t=week", "https://www.reddit.com/r/Archaeology/top/.json?t=week"]]]
	}
];

export const generalTopics = [
	{
		title: "General",
		sources: [["Reddit", ["https://www.reddit.com/r/EarthPorn/.json", "https://www.reddit.com/r/todayilearned/.json", "https://www.reddit.com/r/InternetIsBeautiful/.json"]]]
	}
];
