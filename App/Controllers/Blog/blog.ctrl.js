(function () {
	'use strict';

	angular
        .module('app')
        .controller('BlogController', BlogController)
		.directive("scroll", function ($window, page) {
			return function (scope, element, attrs) {

				angular.element($window).bind("scroll", function () {
					if ($(window).scrollTop() + $(window).height() == $(document).outerHeight()) {
						console.log('Scrolled to bottom.');
						page++;
						scope.$apply(attrs.loadMore);
					}					
				});
			};
		})
		.filter('words', function () {
			return function (input, words) {
				if (isNaN(words)) return input;
				if (words <= 0) return '';
				if (input) {
					var inputWords = input.split(/\s+/);
					if (inputWords.length > words) {
						input = inputWords.slice(0, words).join(' ') + '…';
					}
				}
				return input;
			};
		})
		.value('page', 0);

	BlogController.$inject = ['$rootScope', '$http', 'page'];
	function BlogController($rootScope, $http, page) {
		var vm = this;

		vm.loadMore = function (page) {
			console.log('loadMore');
			$http({
				method: 'GET',
				url: '//www.salvationarmyusa.org/nhqblog/news/json/all/false/' + page + '/2',
			})
			.success(function (data, status) {
				vm[posts].push(data.news);
			});
		};

		$http({
			method: 'GET',
			url: '//www.salvationarmyusa.org/nhqblog/news/json/all/false/' + page + '/2',
		})
		.success(function (data, status) {
			vm.posts = data.news;
			$rootScope.posts = vm.posts;
			//console.log($rootScope.posts);
			//console.log(vm.posts);
		})
		.error(function (data, status) {
			vm.posts = [
					{
						"author": "David Jolley",
						"autoPublishStatus": "PROCESSED",
						"content": "<h1 align=\"center\">Substance Abuse Rehabilitation: Walk in One Man, Walk Out Another</h1>\r\n\r\n<h3 align=\"center\"><em>David went from rock bottom to being the hand that lifts others</em></h3>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/9298df6b-38db-4bfe-867e-5575e2706f1d_Wanzie1Small.jpg\" style=\"width: 300px; height: 400px; margin: 10px; float: right;\" />The first time David Wanzie overdosed, his mother had just dropped him off after buying him some groceries. She started driving home, and he went upstairs to shoot heroin.</p>\r\n\r\n<p>A spiritual prompting caused her to turn around and race back, finding David sprawled out, lifeless, on the bathroom floor. Paramedics revived him, only for it to happen two more times, one of those times in his mother&rsquo;s basement.</p>\r\n\r\n<p>David grew up with his mother bringing him to church every week. But with the stresses and hardships that can be a part of a life trying to make ends meet, David turned to marijuana to numb the tension. That quickly turned to a dependence on pain pills, following a back injury at work when he was 18. This left him downing a month&rsquo;s-worth of Vicodin in a week&rsquo;s time. Soon thereafter he turned to heroin.</p>\r\n\r\n<p>&ldquo;<strong>I&rsquo;m grateful for heroin</strong>,&rdquo; he said, with some hesitation. &ldquo;<strong>Heroin brought me to my knees very, very quickly</strong>.&rdquo;</p>\r\n\r\n<p>But just finding himself on his knees wasn&rsquo;t enough. He was arrested for drug possession, placed on bail and entered a rehab facility. Within three days of leaving that facility, he used again.</p>\r\n\r\n<p>To cut a long story short, David owed some money to a drug dealer. In an effort to either get the money to pay him back or to get thrown in prison (he was fine with either option), David robbed a gas station across the street from his house. To his dismay, he wasn&rsquo;t caught. So he did it again. He got luckier the second time, and was thrown in jail.</p>\r\n\r\n<p>After drying out in jail, which David calls the absolute worst experience of his life, <strong>an inmate told him about The Salvation Army Adult Rehabilitation Center</strong>, the ARC. He begged his lawyer and the judge to let him out to attend the program. Thankfully, his furlough request was granted, and he checked into The Salvation Army ARC program in Binghamton, New York, the next day.</p>\r\n\r\n<p>&ldquo;If I had gotten out of jail and went home, I wouldn&rsquo;t have made it,&rdquo; he said.</p>\r\n\r\n<p>That was more than three years ago, now. David has since moved out of the ARC, but still works there as a paid employee. He&rsquo;s an assistant supervisor in the sorting facility, and he works with other men coming through the program, which is by far his favorite part.</p>\r\n\r\n<p>&ldquo;I can&rsquo;t count how many times guys have come through this place and said, &lsquo;I heard you went through the program. Is that true?&rsquo; I love that!&rdquo; he said. &ldquo;It gives them hope!&rdquo;</p>\r\n\r\n<p>He attributes those first few months of his own rehabilitation to James Thorne, head counselor at the ARC, who had the courage to ask David the tough questions at the right times.</p>\r\n\r\n<p>He said Thorne being so bold helped teach him to have courage and confidence in who he was, and that for the first time in his life, after coming to the ARC, he felt worthy of God&rsquo;s grace exactly as he was.</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/6f6c641b-bc9c-40b9-ae01-5f67607a92db_Wanzie2.jpg\" style=\"width: 800px; height: 477px; margin: auto; display: block;\" /></p>\r\n\r\n<p>David is now engaged to a woman he met playing music with, and he&rsquo;s reconnecting with his family. His soft-spoken demeanor could fool almost anyone into believing he had remained the quiet church boy he began his life as.</p>\r\n\r\n<p>Instead, he&rsquo;s a shining example of the change that can occur with the love of God.</p>\r\n\r\n<p>&ldquo;Every Sunday I meet God in a tiny chapel the size of a closet with a bunch of men who are all being given a second chance,&rdquo; he said. &ldquo;I do it for these men, for the glory of God, to maybe spread some light in a very dark place. If I can even lead one person to the presence of God, it will have all been worth it. Being there every day, at The Salvation Army, with these men, is what helps keep me clean and sober. I am forever grateful to God and The Salvation Army for saving my life. <strong>I am supposed to be dead, but instead I have a new life in Christ Jesus</strong>.&rdquo;</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>To learn more about The Salvation Army&rsquo;s Adult Rehabilitation Centers, and to read or watch more stories like David&rsquo;s, go to <a href=\"http://www.salvationarmyusa.org/USN/Adult-Rehabilitation\">www.SalvationArmyUSA.org/USN/Adult-Rehabilitation</a> or <a href=\"http://www.satruck.org/\">www.SATruck.org</a>.&nbsp;</p>\r\n",
						"created": "2016-11-03T09:03:40+0000",
						"customDonateUrl": null,
						"customHeadContent": null,
						"deletionDate": null,
						"description": "David Wanzie went through the ARC program in NY, and is now engaged, happy and close to God.",
						"displayInHeadlines":true,
						"displayLastModified": false,
						"documentType": "News",
						"enableComments": false,
						"expiry": null,
						"flagged": false,
						"headerImage": null,
						"hideAuthor": false,
						"hideInMenu": true,
						"hideTitle": true,
						"id": "8a80803f58201d0101582a49a95402b2",
						"isRecurring": false,
						"lastUpdater": "David.Jolley@usn.salvationarmy.org",
						"minimumRequiredAccessLevel": "READER",
						"modified": "2016-11-04T09:39:01+0000",
						"new": false,
						"owningSiteId": "8a139d864ca3ae81014cbc9634b60505",
						"owningTerritory": {
							"code": "USN",
							"id": "57",
							"name": "USA National"
						},
						"owningTerritoryId": "57",
						"pageType": null,
						"passwordProtected": false,
						"preferredUrl": "http://blog.salvationarmyusa.org/nhqblog/news/Substance_Abuse_Rehabilitation_Walk_In_One_Man_Walk_Out_Another",
						"publishDate": "2016-11-04T09:00:00+0000",
						"published": true,
						"redirectUrl": "",
						"revisionNumber": null,
						"showNavMenu": true,
						"startDate": null,
						"synopsis": "<p>David went from rock bottom to being the hand that lifts others</p>\r\n",
						"template": false,
						"templateId": "8a808086548f948a0154968d2db600e4",
						"thumbFacebookMetaTag": "https://s3.amazonaws.com/usn-cache.salvationarmy.org/6f6c641b-bc9c-40b9-ae01-5f67607a92db_Wanzie2.jpg",
						"thumbnail": "",
						"title": "Substance Abuse Rehabilitation: Walk In One Man, Walk Out Another",
						"urlAlias": "Substance_Abuse_Rehabilitation_Walk_In_One_Man_Walk_Out_Another"
					},
					{
						"author": "David Jolley",
						"autoPublishStatus": "PROCESSED",
						"content": "<h1 align=\"center\">Building Men from the Ground Up at the Adult Rehabilitation Center</h1>\r\n\r\n<h3 align=\"center\"><em>Harry has a brand new foundation, thanks to The Salvation Army</em></h3>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>While every instance of substance abuse is unique, there are similarities, and they aren&rsquo;t pretty.</p>\r\n\r\n<p>Thankfully, The Salvation Army&rsquo;s Adult Rehabilitation Centers run on the sentiment that &ldquo;man may be down but he&rsquo;s never out.&rdquo; And despite feelings of misery, despair and hopelessness, the Army&rsquo;s path of spiritual, emotional and physical transformation can bring a man from his lowest point to a point of confidence, self-esteem and eternal salvation.</p>\r\n\r\n<p>Here&rsquo;s a story of someone closest to the program, and how it changed his life.</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/65e63509-93e1-4ab5-9bce-5e10452dc951_Harry1+Small.jpg\" style=\"width: 800px; height: 430px; margin: auto; display: block;\" /></p>\r\n\r\n<p><strong>Pallasena Hariharan - &ldquo;Harry&rdquo;</strong></p>\r\n\r\n<p>Born in India to a good family, Harry always felt a sense of loneliness. He would spend hours alone on his veranda at home, focusing on nothing specific, but falling further away from connection with his parents and sisters.</p>\r\n\r\n<p>Soon after getting his first job at the U.S. Embassy in India, Harry started drinking with friends. At first his parents chided him, but they eventually grew silent, and Harry assumed it was because they had accepted his lifestyle.</p>\r\n\r\n<p>He met his wife, moved to the United States and started a new life with her, working for the U.S. State Department. Despite his professional success, the joy he felt while traveling for work and even being blessed by Mother Teresa, his drinking and loneliness continued.</p>\r\n\r\n<p>&ldquo;<strong>God was always knocking at the door, but I never paid attention</strong>,&rdquo; Harry remembered.</p>\r\n\r\n<p>In time, he learned that his wife&rsquo;s silence about his drinking was not due to her acceptance of it. She went to Greece for an assignment and asked him not to come, later filing for divorce. He said she realized she was happier without him. What caused his career downfall was when Harry made an open comment about top secret information while at work and under the influence of alcohol. He lost his security clearance, and ultimately his job. Two years later he found himself <strong>financially, mentally, physically and spiritually bankrupt</strong>, and he tried to kill himself.</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/844eeaca-0aab-42c7-b7d9-05c0373fcc31_Harry2.jpg\" style=\"width: 350px; height: 525px; margin: 10px; float: left;\" />After a month of treatment at another facility, his case worker suggested he go to The Salvation Army. Within the first two months, he said, &ldquo;I could see the gradual change coming through, and it was amazing.&rdquo;</p>\r\n\r\n<p>Four years later, Harry is an employee of The Salvation Army, working as supervisor of the &ldquo;Bric-a-Brac&rdquo; (miscellaneous objects) and Housewares Department in a Salvation Army Donation Center and Family Store in Northern Virginia that moves more than 10,000 items every day.</p>\r\n\r\n<p>He&rsquo;s getting ready to move on. He has everything lined up to move into his own apartment in the coming weeks, and the blessing of the ARC to back him up.</p>\r\n\r\n<p>&ldquo;It&rsquo;s like that quote from John F. Kennedy,&rdquo; he said. &ldquo;When I came here, I asked &lsquo;What can The Salvation Army do for me?&rsquo; But now I&rsquo;ve come to a point where <strong>my foundation is strong</strong> and I can say &lsquo;What can I do for The Salvation Army?&rsquo;&rdquo;</p>\r\n\r\n<p>To learn more about The Salvation Army&rsquo;s Adult Rehabilitation Centers, or to read and watch more stories of people whose lives changed through the help of The Salvation Army ARC, go to <a href=\"http://www.satruck.org/\">SATruck.org</a>. You can also find the nearest Donation Center and Family Store in your community, make a donation or schedule a pickup.</p>\r\n",
						"created": "2016-11-02T13:32:16+0000",
						"customDonateUrl": null,
						"customHeadContent": null,
						"deletionDate": null,
						"description": "Pallasena Hariharan rebuilt his personal foundation through The Salvation Army Adult Rehabilitation Center",
						"displayLastModified": false,
						"documentType": "News",
						"enableComments": false,
						"expiry": null,
						"flagged": false,
						"headerImage": null,
						"hideAuthor": true,
						"hideInMenu": true,
						"hideTitle": true,
						"id": "8a80804058201d0501582619376f01b5",
						"isRecurring": false,
						"lastUpdater": "David.Jolley@usn.salvationarmy.org",
						"minimumRequiredAccessLevel": "READER",
						"modified": "2016-11-02T13:39:01+0000",
						"new": false,
						"owningSiteId": "8a139d864ca3ae81014cbc9634b60505",
						"owningTerritory": {
							"code": "USN",
							"id": "57",
							"name": "USA National"
						},
						"owningTerritoryId": "57",
						"pageType": null,
						"passwordProtected": false,
						"preferredUrl": "http://blog.salvationarmyusa.org/nhqblog/news/Building_Men_from_the_Ground_Up_at_the_Adult_Rehabilitation_Center",
						"publishDate": "2016-11-02T13:33:23+0000",
						"published": true,
						"redirectUrl": "",
						"revisionNumber": null,
						"showNavMenu": true,
						"startDate": null,
						"synopsis": "<p>Harry has a brand new foundation, thanks to The Salvation Army</p>\r\n",
						"template": false,
						"templateId": "8a808086548f948a0154968d2db600e4",
						"thumbFacebookMetaTag": "https://s3.amazonaws.com/usn-cache.salvationarmy.org/65e63509-93e1-4ab5-9bce-5e10452dc951_Harry1+Small.jpg",
						"thumbnail": "",
						"title": "Building Men from the Ground Up at the Adult Rehabilitation Center",
						"urlAlias": "Building_Men_from_the_Ground_Up_at_the_Adult_Rehabilitation_Center"
					},
					{
						"author": "David Jolley",
						"autoPublishStatus": "IGNORE",
						"content": "<h1 align=\"center\">Salvation Army Adult Rehabilitation Centers &ndash; Changing Lives One World at a Time</h1>\r\n\r\n<h3 style=\"text-align: center;\"><em>The Salvation Army Family Store of Northern Virginia is a sacred place to those who work and live there</em></h3>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>The Salvation Army Donation Center and Family Store in Northern Virginia is a well-oiled machine, thanks to the word of God and a dedicated group of people.</p>\r\n\r\n<p>Any &ldquo;thrifter&rdquo; coming in the store will acknowledge that it&rsquo;s an impressive setup &ndash; and the numbers back that up. Every day the store sells <strong>4,000 pieces of clothing</strong>, but that&rsquo;s only part of the more than <strong>10,000 new items</strong> placed in the store that morning, which also includes furniture, housewares and electronics. The store had to institute a separate line system just to manage the sale of purses.</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/5d90b256-33d9-4571-9e0f-d2860725f509_NOVA+ARC+visit-Family+Store+sign.jpg\" style=\"width: 600px; height: 379px; margin: 10px; float: right;\" />But with all these numbers, it can be easy for even the most avid thrifter to forget, or not even know, why The Salvation Army runs family stores: to change lives.</p>\r\n\r\n<p>The Northern Virginia Donation Center and Family Store is staffed almost completely by the <strong>108 male beneficiaries</strong> going through the substance abuse rehabilitation program there. The program is called an Adult Rehabilitation Center (ARC), and The Salvation Army operates <strong>141 of them around the country</strong>.*</p>\r\n\r\n<p>Those 108 beneficiaries come from all walks of life. Some have been there a few weeks, while others have been there a few years. But all of them are in various stages of rehabilitation and renewal.</p>\r\n\r\n<p>Pallasena Hariharan, &ldquo;Harry&rdquo; for short, was an alcohol abuser before coming to the ARC four years ago. But you wouldn&rsquo;t know it. He&rsquo;s clean, soft-spoken, hard-working and organized, and acting as the supervisor of the housewares department of the store.</p>\r\n\r\n<p>He was hard-working before, but he had difficulties managing his work and personal life successfully. &nbsp;When he came to The Salvation Army ARC, that changed.</p>\r\n\r\n<p>&ldquo;It&rsquo;s like that quote from John F. Kennedy,&rdquo; he said. &ldquo;When I came here, I asked &lsquo;What can The Salvation Army do for me?&rsquo; But now I&rsquo;ve come to a point where my foundation is strong and I can say &lsquo;What can I do for The Salvation Army?&rsquo;&rdquo;</p>\r\n\r\n<p>And Harry&rsquo;s not the only one. Kenny is the manager of the shoe department, where he and his team inspect, repair, clean and polish the shoes before sending them out to be sold. He said that after years of being dependent on heroin, the ARC provided him an opportunity to stop for a moment, collect himself, and put himself back together by discovering the truths of God.</p>\r\n\r\n<p>Ed, musical director at the ARC, spent more than 25 years destroying his life, he said, and originally planned to leave The Salvation Army after only a couple weeks. That was five years ago.</p>\r\n\r\n<p>&ldquo;If I had ducked out of here after only a couple months, I&rsquo;d be doing drugs again,&rdquo; he said. &ldquo;All of it was still inside of me.&rdquo;</p>\r\n\r\n<p>He calls the ARC an incubator, saying it saved his life by allowing him to focus on himself and his relationship with God. Now he counsels, uplifts and encourages other men coming through the same program he experienced.</p>\r\n\r\n<p><img alt=\"Ed McNair is the musical director at The Salvation Army Northern Virginia ARC. After going through the program, he became a full-time employee and continues to uplift others through music and word.\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/06418b96-523c-4412-91c3-8c1992c4b536_Ed2.jpg\" style=\"width: 800px; height: 444px; margin: auto; display: block;\" /></p>\r\n\r\n<p>And it keeps going. Will has only been there two months, but he has a knack for computers. He tests all the electronics before sending them out to the shelves. Ralph repairs shoes with Kenny. Brandon unloads donations from vehicles as community members come to drop them off. And Joaquin helps sort and hang more than <strong>7,000 pieces of clothing every single day</strong>.</p>\r\n\r\n<p>What&rsquo;s that, you say? The math doesn&rsquo;t add up? Well, any clothing items that don&rsquo;t sell in four weeks are bundled up and sold in bulk to organizations that provide clothing to impoverished areas of Central America, South American and others.</p>\r\n\r\n<p>But running the Family Store is only a bi-product of the real mission of the ARC, said Major Michael Vincent, who has run the Northern Virginia ARC with his wife, Major Judy Vincent, for the past 10 years.</p>\r\n\r\n<p>The ARC runs on the principles of the word of God, with this sentiment: &ldquo;<strong>Man may be down but he&rsquo;s never out</strong>.&rdquo;</p>\r\n\r\n<p>To ensure no man in his program is ever &lsquo;out,&rsquo; Major Vincent emphasizes three prongs to the ARC program: spiritual growth, emotional growth and group fellowship/counseling, and work therapy. The Family Store is the product of that final prong: work therapy.</p>\r\n\r\n<p>He said a man finds his place in life by accomplishing a task, by looking back at something good and being able to say, &lsquo;I did that.&rsquo;</p>\r\n\r\n<p>&ldquo;<strong>You show me a man that can be accountable at work therapy and I&rsquo;ll show you a man that will show up to his daughter&rsquo;s birthday party</strong>,&rdquo; he said.</p>\r\n\r\n<p>It&rsquo;s about the whole man, and every effort in the ARC is directed toward that end: a transformed heart through the word of God.</p>\r\n\r\n<p>&ldquo;You put a man&rsquo;s life together through the power of Jesus Christ, and I assure you his world will come together.&rdquo;</p>\r\n\r\n<p>So, The Salvation Army is not just in the business of selling trinkets. The Salvation Army is in the business of changing worlds, one person&rsquo;s world at a time.</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>To learn more about The Salvation Army&rsquo;s Adult Rehabilitation Centers, or to read and watch more stories of people whose lives have changed through the help of The Salvation Army ARC, go to <a href=\"http://www.satruck.org/\">SATruck.org</a>. You can also find the nearest Donation Center and Family Store in your community, make a donation or schedule a pickup.</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>*Note: Not all Salvation Army Family Stores are connected to Adult Rehabilitation Centers</p>\r\n",
						"created": "2016-10-31T12:02:39+0000",
						"customDonateUrl": null,
						"customHeadContent": null,
						"deletionDate": null,
						"description": "Northern Virginia Salvation Army Adult Rehabilitation Center NOVA ARC",
						"displayLastModified": false,
						"documentType": "News",
						"enableComments": false,
						"expiry": null,
						"flagged": false,
						"headerImage": null,
						"hideAuthor": true,
						"hideInMenu": true,
						"hideTitle": true,
						"id": "8a8080ed580721a101581b7a72460231",
						"isRecurring": false,
						"lastUpdater": "David.Jolley@usn.salvationarmy.org",
						"minimumRequiredAccessLevel": "READER",
						"modified": "2016-10-31T13:12:15+0000",
						"new": false,
						"owningSiteId": "8a139d864ca3ae81014cbc9634b60505",
						"owningTerritory": {
							"code": "USN",
							"id": "57",
							"name": "USA National"
						},
						"owningTerritoryId": "57",
						"pageType": null,
						"passwordProtected": false,
						"preferredUrl": "http://blog.salvationarmyusa.org/nhqblog/news/Adult_Rehabilitation_Centers_Changin_Lives_One_World_at_a_Time",
						"publishDate": "2016-10-31T12:08:06+0000",
						"published": true,
						"redirectUrl": "",
						"revisionNumber": null,
						"showNavMenu": true,
						"startDate": null,
						"synopsis": "<p>The Salvation Army Family Store of Northern Virginia is a sacred place to those who live and work there</p>\r\n",
						"template": false,
						"templateId": "8a808086548f948a0154968d2db600e4",
						"thumbFacebookMetaTag": "https://s3.amazonaws.com/usn-cache.salvationarmy.org/5d90b256-33d9-4571-9e0f-d2860725f509_NOVA+ARC+visit-Family+Store+sign.jpg",
						"thumbnail": "",
						"title": "Adult Rehabilitation Centers - Changing Lives One World at a Time",
						"urlAlias": "Adult_Rehabilitation_Centers_Changin_Lives_One_World_at_a_Time"
					},
					{
						"author": "David Jolley",
						"autoPublishStatus": "IGNORE",
						"content": "<h1 style=\"text-align: center;\">Good Food and a Helping Hand Sustain Many Through Hurricane Matthew</h1>\r\n\r\n<h3 style=\"text-align: center;\"><em>There&rsquo;s No Limit to What a Hot Meal Can Mean to a Family</em></h3>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/407c8ceb-9845-4f62-bdff-ae21cf91d060_Twila2.jpg\" style=\"width: 350px; height: 233px; margin: 10px; float: left;\" />The Salvation Army has provided <strong>more than 210,000 meals</strong> to those affected by Hurricane Matthew in Florida, Georgia, and North and South Carolina. More than <strong>half</strong> of those meals have been distributed in communities of the Carolinas.</p>\r\n\r\n<p>Twila King and her two sons, JaVaris and JaQuandon, have been the recipients of dozens of those meals. They&#39;ve been living in Red Cross shelters for more than two weeks, first at West Columbus High in Cerro Gordo, North Carolina, before being moved to a gym in Fair Bluff. The National Guard brought them there on a Sunday night, when the water in their home was up to their knees.</p>\r\n\r\n<p>She said she knew it was time to go when the water got high enough that she found her two Pomeranian puppies floating atop the water in her living room.</p>\r\n\r\n<p>Since then, her five dogs were taken to a shelter to ride out the rest of the storm and recovery, while Twila and her children would spend the next two weeks, or more, sleeping on cots in the halls of the very high school her son would attend once classes started up again.</p>\r\n\r\n<p>&ldquo;I don&rsquo;t know where we&rsquo;d be without The Salvation Army,&rdquo; she said. &ldquo;Nowhere good.&rdquo;</p>\r\n\r\n<p>The shelter is run by the Red Cross and The Salvation Army has been providing the shelter with hot meals since the shelter opened. Twila says the food is hot, it provides a sense of stability that her family really needs, and above all, her kids like it and there&rsquo;s plenty of it!</p>\r\n\r\n<p><img alt=\"Captain Cathy Michels and JaQuandon share one of many laughs while at the shelter in Cerro Gordo, NC.\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/e5d33c66-47da-4a2e-bdcc-1c7e5dbbe5ec_JaQuandon1.jpg\" style=\"width: 400px; height: 267px; margin: auto; display: block;\" /><br />\r\n&ldquo;When we got here, my son was a size 12-Husky. <strong>He&rsquo;s probably gonna be a 14-Husky by the time we leave</strong>.&rdquo;</p>\r\n\r\n<p>She said her boys being happy and healthy is what matters most to her. Her son, JaQuandon, has developed a close relationship with Captain Cathy Michels, the emotional and spiritual care officer assigned to the shelter. JaQuandon&rsquo;s quiet, but he brightens up and falls into energetic play and excited grins when Captain Michels comes around.</p>\r\n\r\n<p>This work is about providing families in need with a little bit of comfort. The disaster relief spirit is contagious and everyone can give something. Twila gives back by volunteering to wipe down tables, and prep and serve lunch and dinner at the shelter.</p>\r\n\r\n<p>&ldquo;I just like to be helpful. That&rsquo;s all. <strong>I like to help people whenever I can</strong>.&rdquo;</p>\r\n\r\n<p>Please help The Salvation Army continue these efforts by donating at salar.my/HurricaneMatthew or by calling 1-800-SAL-ARMY.</p>\r\n",
						"created": "2016-10-25T11:38:06+0000",
						"customDonateUrl": null,
						"customHeadContent": null,
						"deletionDate": null,
						"description": "Twila King and her sons are sustained physically and emotionally by The Salvation Army at Hurricane Matthew",
						"displayLastModified": false,
						"documentType": "News",
						"enableComments": false,
						"expiry": null,
						"flagged": false,
						"headerImage": null,
						"hideAuthor": true,
						"hideInMenu": true,
						"hideTitle": true,
						"id": "8a80803257e235c60157fc7dcf13036a",
						"isRecurring": false,
						"lastUpdater": "David.Jolley@usn.salvationarmy.org",
						"minimumRequiredAccessLevel": "READER",
						"modified": "2016-10-25T14:01:11+0000",
						"new": false,
						"owningSiteId": "8a139d864ca3ae81014cbc9634b60505",
						"owningTerritory": {
							"code": "USN",
							"id": "57",
							"name": "USA National"
						},
						"owningTerritoryId": "57",
						"pageType": null,
						"passwordProtected": false,
						"preferredUrl": "http://blog.salvationarmyusa.org/nhqblog/news/Good_Food_and_a_Helping_Hand_Sustain_Many_through_Hurricane_Matthew",
						"publishDate": "2016-10-25T11:43:03+0000",
						"published": true,
						"redirectUrl": "",
						"revisionNumber": null,
						"showNavMenu": true,
						"startDate": null,
						"synopsis": "<p>There&#39;s No Limit to What a Hot Meal Can Mean to a Family</p>\r\n",
						"template": false,
						"templateId": "8a808086548f948a0154968d2db600e4",
						"thumbFacebookMetaTag": "https://s3.amazonaws.com/usn-cache.salvationarmy.org/03e9562b-c1d1-4210-88e0-dd453e2b471d_Twila1.jpg",
						"thumbnail": "",
						"title": "Good Food and a Helping Hand Sustain Many through Hurricane Matthew",
						"urlAlias": "Good_Food_and_a_Helping_Hand_Sustain_Many_through_Hurricane_Matthew"
					},
					{
						"author": "David Jolley",
						"autoPublishStatus": "PROCESSED",
						"content": "<h1 style=\"text-align: center;\">Outside-In: Interning at The Salvation Army</h1>\r\n\r\n<h1 style=\"text-align: center;\">for Hurricane Matthew Relief</h1>\r\n\r\n<h3 style=\"text-align: center;\"><em>Hurricane Matthew brought havoc, but Salvation Army volunteers and staff bring peace.</em></h3>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>Lindsay Williams has a lot on her plate. She carries a full-time class load at the University of North Carolina Wilmington, which she attends on campus Tuesdays and Thursdays (she&rsquo;s double majoring in social work and psychology), and works two nights a week at a local restaurant.</p>\r\n\r\n<p>The most recent addition to her schedule is an internship at The Salvation Army Corps Community Center and homeless shelter in Wilmington, North Carolina. Professionally, she hopes to specialize in providing counseling and emotional support to young adults.</p>\r\n\r\n<p>That schedule doesn&rsquo;t let up because Hurricane Matthew came into town. Class is still in session, her place of work still has power, and The Salvation Army certainly isn&rsquo;t taking any breaks. Quite the opposite, indeed. But she doesn&rsquo;t mind the sacrifice.</p>\r\n\r\n<p><img alt=\"\" src=\"https://s3.amazonaws.com/usn-cache.salvationarmy.org/6fe2a5da-3a29-4bf9-a978-216d9ead7a0c_Lindsay1.jpg\" style=\"width: 550px; height: 366px; margin: 10px; float: left;\" /></p>\r\n\r\n<p>&ldquo;Everybody has their lives that they left behind [in order to serve], but it balances out,&rdquo; she said. &ldquo;You get to impact other people. You give up something, (in her case, personal time, sleep, etc.), but somebody else gets something out of it.&rdquo;</p>\r\n\r\n<p>Lindsay is talking beyond the sandwich. Food is a basic need, she said, and providing for basic needs enables those suffering to feel joy, hope, peace, fellowship and confidence in a time when they otherwise may have not. And those feelings happen one person at a time.</p>\r\n\r\n<p>&ldquo;I don&rsquo;t want to change the world. I just want to help one person make a change.&rdquo;</p>\r\n\r\n<p>And each meal provided by The Salvation Army and its supporters is one more meal those affected by Hurricane Matthew don&rsquo;t have to wonder about. Every meal is an opportunity to smile, to feel some relief and to know they&rsquo;re not alone.</p>\r\n\r\n<p>To help The Salvation Army continue to provide relief, support, peace, hope, fellowship and more to those affected by Hurricane Matthew, please donate at <a href=\"https://give.salvationarmyusa.org/site/Donation2;jsessionid=00000000.app363b?idb=1306159367&amp;idb=0&amp;DONATION_LEVEL_ID_SELECTED=1&amp;df_id=17583&amp;mfc_pref=T&amp;17583.donation=form1&amp;NONCE_TOKEN=3645B11E566AA0875937BC4A5B32BF7E\">salar.my/HurricaneMatthew</a>, or call 1-800-SAL-ARMY.</p>\r\n",
						"created": "2016-10-19T12:28:03+0000",
						"customDonateUrl": null,
						"customHeadContent": null,
						"deletionDate": null,
						"description": "Lindsay Williams interns at The Salvation Army in Wilmington, NC, during Hurricane Matthew.",
						"displayLastModified": false,
						"documentType": "News",
						"enableComments": false,
						"expiry": null,
						"flagged": false,
						"headerImage": null,
						"hideAuthor": true,
						"hideInMenu": true,
						"hideTitle": true,
						"id": "8a8080ed57dd27440157ddc560c9003b",
						"isRecurring": false,
						"lastUpdater": "David.Jolley@usn.salvationarmy.org",
						"minimumRequiredAccessLevel": "READER",
						"modified": "2016-10-19T14:35:38+0000",
						"new": false,
						"owningSiteId": "8a139d864ca3ae81014cbc9634b60505",
						"owningTerritory": {
							"code": "USN",
							"id": "57",
							"name": "USA National"
						},
						"owningTerritoryId": "57",
						"pageType": null,
						"passwordProtected": false,
						"preferredUrl": "http://blog.salvationarmyusa.org/nhqblog/news/Interning_at_The_Salvation_Army_during_Hurricane_Matthew",
						"publishDate": "2016-10-19T14:30:00+0000",
						"published": true,
						"redirectUrl": "",
						"revisionNumber": null,
						"showNavMenu": true,
						"startDate": null,
						"synopsis": "<p>Hurricane Matthew brought havoc, but Salvation Army volunteers and staff bring peace.</p>\r\n",
						"template": false,
						"templateId": "8a808086548f948a0154968d2db600e4",
						"thumbFacebookMetaTag": "https://s3.amazonaws.com/usn-cache.salvationarmy.org/6fe2a5da-3a29-4bf9-a978-216d9ead7a0c_Lindsay1.jpg",
						"thumbnail": "",
						"title": "Outside-In: Interning at The Salvation Army during Hurricane Matthew",
						"urlAlias": "Interning_at_The_Salvation_Army_during_Hurricane_Matthew"
					}
				]
		});

		return;

	}

})();