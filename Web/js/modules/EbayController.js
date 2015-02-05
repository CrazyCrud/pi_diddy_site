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
		var url = article.url;
		var name = article.name;
		var location = article.location;
		var description = article.description;
		var time = article.time;
		var imageSrc = article.image;

		var $container = $('<div class="article" url="'+url+'"></div>');
		var $name = $('<div class="article-name">'+name+'</div>');
		var $description = $('<div class="article-description">'+description+'</div>');
		var $time = $('<div class="article-time">'+time+'</div>');
		var $imageContainer = $('<div class="article-image-container"></div>');
		var $image = $('<img src="'+imageSrc+'"></img>');
		var $location = $('<div class="article-location">'+location+'</div>');

		$imageContainer.append($image);
		$container.append($name);
		$container.append($imageContainer);
		$container.append($description);
		$container.append($time);
		$container.append($location);

		return $container;
	}

};

$(EbayController.init);