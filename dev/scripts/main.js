const coffeeApp = {};

coffeeApp.key = '4bba844de5c34fdd2ce7dfe6963d7f05';
coffeeApp.id = '64cb1661';
coffeeApp.withAlochol = '';
coffeeApp.allResults = [];

coffeeApp.formSubmit = () => {
	$('#selection-form').submit( (e) => {
		e.preventDefault();
		const withAlochol = $('input[name=selection2]:checked').val();
		if (withAlochol === 'yes') {
			coffeeApp.withAlochol = 'allowedIngredient[]=wine';
		} else {
			coffeeApp.withAlochol = 'excludedIngredient[]=wine&excludedIngredient[]=kahlúa';
		}
		if(withAlochol === undefined) {
			$('.selection-form_error').css('visibility', 'visible')
		}else{
			coffeeApp.getData();
		}
	})
}

coffeeApp.getData = () => {
	$.ajax({
		url: `http://api.yummly.com/v1/api/recipes?_app_id=${coffeeApp.id}&_app_key=${coffeeApp.key}&q=coffee&allowedCourse[]=course^course-Beverages&excludedCourse[]=course^course-Dessert&${coffeeApp.withAlochol}&requirePictures=true`,
		method: 'GET',
		dataType: 'JSON'
	}).then((data) => {
		data.matches.forEach((x) => {
			coffeeApp.allResults.push(x);
		});
		coffeeApp.reduceData();
	})
}

coffeeApp.reduceData = () => {
	$('.drink-results_displayed').empty();
	const allDrinks = coffeeApp.allResults;
	const getThreeRecipies = _.sample(allDrinks, 3);
	coffeeApp.displayData(getThreeRecipies)
}

coffeeApp.displayData = (data) => {
	const displayResults = $('.drink-results_displayed');
	data.forEach((e) => {
		const titleFormatted = e.recipeName;
		const getImage = e.smallImageUrls[0];
		const itemDiv = $('<div>').addClass('displayed-item');
		const title = $('<h4>').text(titleFormatted);
		const image = $('<img>').attr('src', `${getImage}`);
		const fullRecipeButton = $(`<button data-id='${e.id}'>`).text('See Full Recipe').addClass('see-full-recipe');
		itemDiv.append(title, image, fullRecipeButton);
		displayResults.append(itemDiv);
	})
	coffeeApp.changeData();
	coffeeApp.getFullRecipe();
}

coffeeApp.changeData = () => {
	$('.new-drinks').on('click', () => {
		coffeeApp.reduceData();
	})
}

coffeeApp.getFullRecipe = () => {
	$('.see-full-recipe').on('click', function(e) {
		e.preventDefault();
		const recipeId = $(this).data("id");
		$.ajax({
			url: `http://api.yummly.com/v1/api/recipe/${recipeId}?_app_id=${coffeeApp.id}&_app_key=${coffeeApp.key}`,
			method: 'GET',
			dataType: 'Json'

		}).then((res) => {
			coffeeApp.displayFullRecipe(res)
		})
	})
}

coffeeApp.displayFullRecipe = (data) => {
	console.log(data)
	const name = $('<h3>').text(data.name);
	let rating = '';
	if (data.rating === 1){
			$('.rating').append(
			`<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>`)
	}else if (data.rating === 2){
		$('.rating').append(`
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>`)
	}else if (data.rating === 3){
		$('.rating').append(`
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>`)
	}else if (data.rating === 4){
		$('.rating').append(`
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star-o" aria-hidden="true"></i>`)
	}else if (data.rating === 5){
		$('.rating').append(`
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>
			<i class="fa fa-star" aria-hidden="true"></i>`)
	}else {
		$('.rating').append$(`<p>Not Rated</p>`);
	}
	const time = $('<p>').text(`Prep Time: ${data.totalTime}`);
	const servings = $('<p>').text(`Servings: ${data.numberOfServings}`);
 	const image = $('<img>').attr('src', `${data.images[0].hostedLargeUrl}`).attr('alt', `photo of ${data.name}`);
 	$('.title-time').append(name, time);
	$('.rating-servings').append(servings);
 	$('.recipe-image').append(image);
 	data.ingredientLines.forEach((item) => {
 		const formattedItem = item.toLowerCase();
 		$('.ingredient-list').append(`<li>${formattedItem}</li>`);
 	})
 	if(data.source.sourceDisplayName == undefined){
 		let sourceName = $('<p>').text('Yummly');
 		$('.source').append(sourceName);
 	}else {
 		let sourceName = $('<p>').text(data.source.sourceDisplayName);
 		$('.source').append(sourceName);
 	}
 	const sourceURL = $('<a class="source-recipe">').attr('href', `${data.source.sourceRecipeUrl}`).attr('target', '_blank').text('See Full Recipe and Directions')
 	$('.source').append(sourceURL);
 	
}

$(() => {
	coffeeApp.formSubmit();
})