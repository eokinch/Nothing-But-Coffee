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
		url: `http://api.yummly.com/v1/api/recipes?_app_id=${coffeeApp.id}&_app_key=${coffeeApp.key}&q=coffee&allowedCourse[]=course^course-Beverages&excludedCourse[]=course^course-Dessert&${coffeeApp.withAlochol}&maxResult=100`,
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
		console.log(e);
		const titleFormatted = e.recipeName;
		console.log(titleFormatted)
		const getImage = e.smallImageUrls[0];
		const itemDiv = $('<div>').addClass('displayed-item');
		const title = $('<h4>').text(titleFormatted);
		const image = $('<img>').attr('src', `${getImage}`);
		// const ingridentsTitle = $('<p>').text('Show ingredients');
		// const ingridentsList = $('<ul>').addClass('ingridents-list');
		// e.ingredients.forEach((item) => {
		// 	const ingridentItem = $('<li>').text(item)
		// 	ingridentsList.append(ingridentItem);
		// })
		const fullRecipeButton = $(`<button data-id='${e.id}'>`).text('See Full Recipe').addClass('see-full-recipe');
		itemDiv.append(title, image, fullRecipeButton);
		displayResults.append(itemDiv);
	})
	coffeeApp.changeData();
	coffeeApp.fullRecipe();
}

coffeeApp.changeData = () => {
	$('.new-drinks').on('click', () => {
		coffeeApp.reduceData();
	})
}

coffeeApp.fullRecipe = () => {
	$('.see-full-recipe').on('click', function(e) {
		e.preventDefault();
		const recipeId = $(this).data("id");
		$.ajax({
			url: `http://api.yummly.com/v1/api/recipe/${recipeId}?_app_id=${coffeeApp.id}&_app_key=${coffeeApp.key}`,
			method: 'GET',
			dataType: 'Json'

		}).then((res) => {
			console.log(res)
		})
	})
}

$(() => {
	coffeeApp.formSubmit();
})