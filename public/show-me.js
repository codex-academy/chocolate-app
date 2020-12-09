// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/ceJdALs4M/";

    let model, webcam, labelContainer, maxPredictions;

	const chocNameElem = document.querySelector(".chocName");
	const chocolatesElem = document.querySelector(".chocolates");
	const questionElem = document.querySelector(".question");
	const debugElem = document.querySelector(".debugMessage");
    const restartButton = document.querySelector(".restart");

    const startBtn = document.querySelector(".start");
	const stopBtn = document.querySelector(".stop");

    const chocolateListTemplate = Handlebars.compile(document.querySelector(".chocolateListTemplate").innerText);

    restartButton.addEventListener("click", function() {
        lookingForIndex = -1;
        toggleVisibility(restartButton);
        showChocolateQuestion();
    });


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
        toggleVisibility(questionElem);
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

    function ChocolateGame() {

        const showMeList = ["Tex", "Bar One", "Lunch Bar", "KitKat"]
        let lookingForIndex = 0;

        function getQuestion() {
            return "Please show me a " + showMeList[lookingForIndex];
        }

        

    }


    const showMeList = ["Tex", "Bar One", "Lunch Bar", "KitKat"]
    let lookingForIndex = 0
    questionElem.innerHTML = "Please show me a " + showMeList[lookingForIndex];
    const bell = new Audio('audio/bell.mp3');
    const jinglebells = new Audio('audio/jinglebells.mp3');
    const error = new Audio('audio/error.mp3');

    function showChocolateQuestion() {

        lookingForIndex++;
        if (lookingForIndex < showMeList.length) {
            questionElem.innerHTML = "Please show me a " + currentlyLookingFor();
        }  else {
            questionElem.innerHTML = "You know your chocolates!";
            jinglebells.play();
            toggleVisibility(restartButton)
        }
    }

    function currentlyLookingFor() {
        if (lookingForIndex < showMeList.length){
            return showMeList[lookingForIndex]
        }
        return "";
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

        if (highestProb < 0.95){
            return;
        }
        
        checkForChocolateThrottled(chocName);
		
    }

    const checkForChocolateThrottled = _.throttle(checkForChocolate, 4000);

    function checkForChocolate(chocName) {

        if (chocName !== "Nothing"){
            const lookingFor = currentlyLookingFor();
            // debugElem.innerHTML = (lookingFor + " - " + chocName);
            
            if (lookingFor !== "" && chocName === lookingFor) {
                console.log("=================================================");
                webcam.pause();
                chocNameElem.innerHTML = `That's right you showed me a ${lookingFor}!`;
                bell.play();
                chocName = "Nothing";
                
                setTimeout(function(){
                    showChocolateQuestion()
                    chocNameElem.innerHTML = ""
                    webcam.play();
                }, 2500);

            } else {
                error.play();
            }

// 
		}

    }

    // ensure that not too many chocolates are added...

    // showChocolateList();
