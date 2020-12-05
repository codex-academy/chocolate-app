// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/ceJdALs4M/";

    let model, webcam, labelContainer, maxPredictions;

	const chocNameElem = document.querySelector(".chocName");
	const chocolatesElem = document.querySelector(".chocolates");
    
    const startBtn = document.querySelector(".start");
	const stopBtn = document.querySelector(".stop");

    const chocolateListTemplate = Handlebars.compile(document.querySelector(".chocolateListTemplate").innerText);

    function toggleVisibility(elem){
        elem.classList.toggle("hidden");
    }

    function showChocolateList()  {
        axios
            .get("/api/list")
            .then(function(response){
                const chocolates = response.data.data;
                chocolatesElem.innerHTML = chocolateListTemplate({
                    chocolates
                });
            })
    }

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
        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        toggleVisibility(startBtn);
        toggleVisibility(stopBtn);
        
    }

    async function stop() {
        await webcam.stop();
        document.getElementById("webcam-container").innerHTML = "";
        
        toggleVisibility(startBtn);
        toggleVisibility(stopBtn);
        
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

        if (highestProb < 0.9){
            return;
        }
                
		if (chocName !== "Nothing"){

            throttledStoreChocolate(chocName);

		}
		
    }

    // ensure that not too many chocolates are added...
    const  throttledStoreChocolate = _.throttle(storeChocolate, 2000);

    showChocolateList();

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
            } else if (chocModeElem.value === "eat") {
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
            showChocolateList();
    }