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
		articleDetailDescription: $(".article-detail-description"),
		articleDetailTime: $(".article-detail-time"),
		articleDetailPlace: $(".article-detail-place"),
		articleQR: $("#qr"),
		loadingOverlay: $(".loading-overlay")
	},

	placeholderImage: 'assets/img/placeholder.jpg',

	fillExampleArticles: function(articles){
		$(".example").empty();
		for(var i=0; i<articles.length; i++){
			var article = EbayView.createView(articles[i]);
			$("#example-"+(i+1)).append(article);
		}
	},

	fillArticleList: function(articles){
		$(".articles-container").empty();
		for(var i=0; i<articles.length; i++){
			$(".articles-container").append(EbayView.createView(articles[i]));
		}
		var max = $(".articles-container").width() - $("#article-list").width();
		$("#slider").slider({
			animate: true,
			value: 0,
			min: 0,
			max: max,
			orientation: "horizontal",
			change: function( event, ui ) {
				console.log(ui.value);
				$(".articles-container").animate({'left': '-' + ui.value + 'px'}, 700)
				//$(".articles-container").css('left', '-' + ui.value + 'px');
			}
		});
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
		var $time = $('<div class="article-time label secondary">' + info.time + '</div>');
		var $imageContainer = $('<div class="article-image-container"></div>');
		//var $image = $('<img src="' + info.imageSrc + '"></img>');
		var $location = $('<div class="article-location label secondary">' + info.location + '</div>');

		//$imageContainer.append($image);
		$imageContainer.css('background-image', 'url(' + info.imageSrc + ')');
		$container.append($name);
		$container.append($imageContainer);
		$container.append($description);
		$container.append($time);
		$container.append($location);

		$container.click(function(event) {
			EbayView.elements.loadingOverlay.show();
			Home.changeToState(4);
			EbayView.onViewArticle(info);
		});;

		return $container;
	},

	onViewArticle: function(info){
		if(info.imageSrc.length < 1){
			EbayView.elements.articleDetailImage.css('background-image', 'url(' + EbayView.placeholderImage + ')');
		}else{
			EbayView.elements.articleDetailImage.css('background-image', 'url(' + info.imageSrc + ')');
		}
		
		$.get(EbayController.URL + '?single=' + info.url, function(data) {
			data = data.data;
			EbayView.elements.articleDetailMain.find('h1').html(data.name);
			EbayView.elements.articleDetailDescription.html(data.description);
			EbayView.elements.articleDetailTime.html(info.time);
			EbayView.elements.articleDetailPlace.html(info.location);
			EbayView.elements.articleQR.attr('src', 'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=' + info.url + '&qzone=1&margin=0&size=400x400&ecc=L');
		}).fail(function(data){
			data = data.data;
			EbayView.elements.articleDetailMain.find('h1').html(data.name);
			EbayView.elements.articleDetailDescription.html(data.description);
			EbayView.elements.articleDetailTime.html(info.time);
			EbayView.elements.articleDetailPlace.html(info.location);
			EbayView.elements.articleQR.attr('src', 'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=' + info.url + '&qzone=1&margin=0&size=400x400&ecc=L');
		})
		.always(function(data){
			EbayView.elements.loadingOverlay.fadeOut('slow', function() {
				
			});
		});
	}
};

$(EbayController.init);