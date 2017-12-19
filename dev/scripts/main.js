const coffeeApp = {};

coffeeApp.key = '4bba844de5c34fdd2ce7dfe6963d7f05';
coffeeApp.id = '64cb1661';
coffeeApp.withAlochol = '';

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
		url: `http://api.yummly.com/v1/api/recipes?_app_id=${coffeeApp.id}&_app_key=${coffeeApp.key}&q=coffee&allowedCourse[]=course^course-Beverages&${coffeeApp.withAlochol}&maxResult=100`,
		method: 'GET',
		dataType: 'JSON'
	}).then((data) => {
		coffeeApp.reduceData(data.matches)
	})
}

coffeeApp.reduceData = (data) => {
	const getThreeRecipies = _.sample(data, 3);

	coffeeApp.displayData(getThreeRecipies)
}

coffeeApp.displayData = (data) => {
	data.forEach((e) => {
		console.log(e)
	})
	// $('.drink-results_displayed')
}

$(() => {
	coffeeApp.formSubmit();
})