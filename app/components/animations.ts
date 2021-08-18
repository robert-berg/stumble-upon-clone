function animateSize(object, x = 0.85, y = 0.85) {
	object
		.animate({
			scale: { x: x, y: y },
			duration: 165
		})
		.then(() => {
			object.animate({
				scale: { x: 1, y: 1 },
				duration: 165
			});
		});
}

function animateRotation(object, rotations) {
	function rotate360(i, rotations) {
		object
			.animate({
				rotate: 360,
				duration: 300
			})
			.then(() => {
				object.animate({
					rotate: 0,
					duration: 0
				});
			})
			.then(() => {
				if (i < rotations) {
					rotate360(++i, rotations);
				}
			});
	}

	rotate360(0, rotations);
}

export { animateSize };
export { animateRotation };
