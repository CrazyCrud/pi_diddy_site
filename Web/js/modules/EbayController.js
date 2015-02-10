var EbayController = {
	
	URL: "ebay/api.php",

	articles: {
	    "city": "regensburg", 
	    "count": 0, 
	    "data": []
	},

	loadArticles: function(page){
		if(!page)page=1;
		var url = EbayController.URL;
		if(page>1){
			url += "?page="+page;
		}
		$.get(url, EbayController.onArticlesLoaded);
	},

	onArticlesLoaded: function(data){
		var examples = [];
		for(var i=0; i<3&&i<data.data.length; i++){
			examples[i] = data.data[i];
		}
		EbayView.fillExampleArticles(examples);
		EbayView.fillArticleList(data.data);
	},

	init: function(){
		EbayController.loadArticles();
	}

};

var EbayView = {
	elements: {
		articleDetailView: $(".article-detail-view"),
		articleDetailImage: $(".article-detail-image"),
		articleDetailMain: $(".article-detail-main"),
		articleDetailDescription: $(".article-detail-description")
	},

	fillExampleArticles: function(articles){
		for(var i=0; i<articles.length; i++){
			var article = EbayView.createView(articles[i]);
			$("#example-"+(i+1)).append(article);
		}
	},

	fillArticleList: function(articles){
		$("#article-list").empty();
		for(var i=0; i<articles.length; i++){
			$("#article-list").append(EbayView.createView(articles[i]));
		}
	},

	createView: function(article){
		var info = {
			url: article.url,
			name: article.name,
			location: article.location,
			description: article.description,
			time: article.time,
			imageSrc: article.image
		};

		var $container = $('<div class="article" url="' + info.url + '"></div>');
		var $name = $('<div class="article-name">' + info.name + '</div>');
		var $description = $('<div class="article-description">' + info.description + '</div>');
		var $time = $('<div class="article-time">' + info.time + '</div>');
		var $imageContainer = $('<div class="article-image-container"></div>');
		//var $image = $('<img src="' + info.imageSrc + '"></img>');
		var $location = $('<div class="article-location">' + info.location + '</div>');

		//$imageContainer.append($image);
		$imageContainer.css('background-image', 'url(' + info.imageSrc + ')');
		$container.append($name);
		$container.append($imageContainer);
		$container.append($description);
		$container.append($time);
		$container.append($location);

		$container.click(function(event) {
			Home.changeToState(4);
			EbayView.onViewArticle(info);
		});;

		return $container;
	},

	onViewArticle: function(info){
		EbayView.elements.articleDetailMain.find('h1').html(info.name);
		EbayView.elements.articleDetailImage.css('background-image', 'url(' + info.imageSrc + ')');
		EbayView.elements.articleDetailDescription.html(info.description);
	}
};

$(EbayController.init);