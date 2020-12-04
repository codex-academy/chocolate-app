// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/ceJdALs4M/";

    let model, webcam, labelContainer, maxPredictions;

	const chocNameElem = document.querySelector(".chocName");

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();


        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);
        // setInterval(loop, 2000);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
		const prediction = await model.predict(webcam.canvas);
		
		let highestProb = 0;
		let chocName = "";

		prediction.forEach(function(pred){
			if (pred.probability > highestProb) {
				highestProb = pred.probability;
				chocName = pred.className;
			}
		});
        
        const delayedStoreChocolate = _.debounce(function(){
            storeChocolate(chocName);
        }, 5000);

		if (chocName !== "Nothing"){

            throttledStoreChocolate(chocName);

		}
		
    }

    // ensure that not too many chocolates are added...
    const  throttledStoreChocolate = _.throttle(storeChocolate, 5000);

    function storeChocolate(chocName) {
        const chocModeElem = document.querySelector(".mode:checked");


            if (chocModeElem.value === "buy") {
                axios.post("/api/buy", {
                    name: chocName,
                    qty : 1
                }).then(function(result){
                    // console.log(result.data);
                    if (result.data.status === "error") {
                        chocNameElem.innerHTML = result.data.message;
                    } else {
                        chocNameElem.innerHTML = result.data.message;
                    }
                })
            } if (chocModeElem.value === "eat") {
                axios.post("/api/eat", {
                    name: chocName,
                    qty : 1
                }).then(function(result){
                    // console.log(result.data);
                    if (result.data.status === "error") {
                        chocNameElem.innerHTML = result.data.message;
                    } else {
                        chocNameElem.innerHTML = result.data.message;
                    }
                })
            }
    }