<html>
	<head>
		<title></title>
		<link rel="stylesheet" type="text/css" href="css/vendor/normalize.css">
		<link rel="stylesheet" type="text/css" href="css/vendor/foundation.css">
		<link rel="stylesheet" type="text/css" href="css/vendor/overrides.css">
		<link rel="stylesheet" type="text/css" href="css/modules/base.css">
		<link rel="stylesheet" type="text/css" href="css/sections/home.css">
		<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div class="index">
			<div class="state-1 color-1">
				<div id="welcome" class="css-animation">
					Zu Verschenken<br/>
					komm n&auml;her
				</div>
			</div>
			<div class="state-2 color-2">
				<div id="info">
					Interesse an gratis Sachen?
				</div>
				<div class="example" id="example-1">
				</div>
				<div class="example" id="example-2">
				</div>
				<div class="example" id="example-3">
				</div>
			</div>
			<div class="state-3 color-3">
				<div id="header">Ebay Kleinanzeigen!</div>
				<div id="article-list"></div>
				<div id="article-fade-left"></div>
				<div id="article-fade-right"></div>
			</div>
			<div class="state-4 color-4">
				<div class="back uppercase"><a href="#" class="button tiny secondary">Back</a></div>
				<div class="container">
					<div class="article-detail-view">
						<div class="article-detail-image">
							
						</div>
						<a href="#" id="generate-qr" class="button info" data-reveal-id="qr-modal">Artikel merken</a>
						<div class="article-detail-main">
							<h1></h1>
							<p class="article-detail-description"></p>
							<span class="article-detail-time uppercase"></span>
							<span class="article-detail-place uppercase"></span>
						</div>
						<div id="qr-modal" class="reveal-modal" data-reveal>
							<h2>Awesome. I have it.</h2>
							<p class="lead">Your couch.  It is mine.</p>
							<p class="text-center"><img id="qr" src=""></p>
							<a class="close-reveal-modal">&#215;</a>
						</div>
					</div>
				</div>
			</div>
			<div class="state-5 color-5"></div>
		</div>
	</body>
	<script type="text/javascript" src="js/vendor/jquery.js"></script>
	<script type="text/javascript" src="js/vendor/kinect.js"></script>
	<script type="text/javascript" src="js/vendor/underscore.js"></script>
	<script type="text/javascript" src="js/vendor/foundation.js"></script>
	<script type="text/javascript" src="js/modules/KinectController.js"></script>
	<script type="text/javascript" src="js/sections/home.js"></script>
	<script type="text/javascript" src="js/modules/EbayController.js"></script>
	<script type="text/javascript" src="js/modules/Animation.js"></script>
</html>