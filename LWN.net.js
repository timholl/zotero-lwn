{
	"translatorID": "57517a91-b881-4da3-b205-751f6c7e2cae",
	"label": "LWN.net",
	"creator": "Tim Hollmann",
	"target": "^https?://lwn\\.net/",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2025-02-18 14:16:27"
}

function detectWeb(doc, url) {
	if (isNewsItem(doc) || isFeatureArticle(doc) || isGuestArticle(doc)) {
		return 'newspaperArticle';
	}

	return false;
}

async function doWeb(doc, url) {

	if (detectWeb(doc, url) != 'newspaperArticle') {
		return; // Invalid invocation
	}

	let title = getTitle(doc);
	let author = getAuthor(doc);
	let date = ZU.strToISO(getDate(doc));

	if (title === null || author === null || date === null) {
		return;
	}

  // We basically inherit the default 'web' translator and just manually scrape the metadata and add the EPUB attachment.
	let translator = Zotero.loadTranslator('web');
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setDocument(doc);
	translator.setHandler('itemDone', (_obj, item) => {
		item.title = title;
		item.creators.push(ZU.cleanAuthor(author, "author", false));
		item.date = date;

		item.publicationTitle = "LWN.net"; // "Linux Weekly News" is discouraged (see their FAQ)
		item.language = "en-US";

		item.attachments.push({
			title: "Article EPUB",
			url: url + (url.endsWith('/') ? '' : '/') + 'epub',
		});

		item.complete();
	});

	let em = await translator.getTranslatorObject();
	em.itemType = detectWeb(doc, url);
	await em.doWeb(doc, url);

	return;
}

/*
 * Detection of article type
 */

function isNewsItem(doc) {
	return ZU.xpath(doc, '//div[@class="Byline"]').length == 1;
}

function isFeatureArticle(doc) {
	return ZU.xpath(doc, '//div[@class="FeatureByline"]').length == 1;
}

function isGuestArticle(doc) {
	return ZU.xpath(doc, '//div[@class="GAByline"]').length == 1;
}

/*
 * Metadata scraping
 */

function getTitle(doc) {
	return ZU.xpathText(doc, '//div[contains(@class, "PageHeadline")]/h1/text()'');
}

function getAuthor(doc) {

	if (isNewsItem(doc)) {
		let author = ZU.xpathText(doc, '//div[@class="Byline"]').match(/Posted (.*) by (.*)\]/i)[2];

		// regular news items are published with abbreviated author names, so we have to map them back to their full names.
		// Since regular news items should only by authored by the LWN staff themselves (4 people), this should suffice.
		const knownAuthors = {
			'corbet': 'Jonathan Corbet',
			'daroc': 'Daroc Alden',
			'jake': 'Jake Edge',
			'jzb': 'Joe Brockmeier',
		};

		if (knownAuthors.hasOwnProperty(author)) {
			author = knownAuthors[author];
		}

		return author;
	}

	if (isFeatureArticle(doc)) {
		return ZU.xpathText(doc, '//div[@class="FeatureByline"]/b'); // TODO: What is on conferences?
	}

	if (isGuestArticle(doc)) {
		return ZU.xpathText(doc, '//div[@class="GAByline"]/p[2]').match(/contributed by (.*)/i)[1];
	}

	return null; // Error
}

function getDate(doc) {

	if (isNewsItem(doc)) {
		return ZU.xpathText(doc, '//div[@class="Byline"]').match(/Posted (.*) by (.*)\]/i)[1];
	}

	if (isFeatureArticle(doc)) {
		return ZU.trim(ZU.xpathText(doc, '//div[@class="FeatureByline"]/text()[2]'));
	}

	if (isGuestArticle(doc)) {
		return ZU.xpathText(doc, '//div[@class="GAByline"]/p[1]');
	}

	return null; // Error
}

/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/
