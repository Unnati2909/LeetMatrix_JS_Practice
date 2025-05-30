document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-btn');
    const usernameInput = document.getElementById('user-input');
    const statsContainer = document.getElementById('stats-container');
    const easyProgressCircle = document.querySelector('.easy-level span');
    const mediumProgressCircle = document.querySelector('.medium-level span');
    const hardProgressCircle = document.querySelector('.hard-level span');
    const easyLabel = document.querySelector('.easy-level p');
    const mediumLabel = document.querySelector('.medium-level p');
    const hardLabel = document.querySelector('.hard-level p');
    // const easyLabel = document.querySelector('.easy-label');
    // const mediumLabel = document.querySelector('.medium-label');
    // const hardLabel = document.querySelector('.hard-label');
    const cardsStatsContainer = document.querySelector('.cards-stats');

    function validUserName(username) {
        if (username.trim() === "") {
            alert("User name should not be empty!");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{3,16}$/;
        if (!username.match(regex)) {
            alert("Invalid username. Try again!");
            return false;
        }
        return true;
    }

    function updateProgress(progressCircle, solvedCount, totalCount, labelElement,labelName) {
    const percentage = (solvedCount / totalCount) * 100;
    const degree = (percentage * 3.6).toFixed(2); // convert percent to degrees
    progressCircle.style.setProperty("--progress-degree", `${degree}deg`);
    progressCircle.textContent = `${Math.round(percentage)}%`;
    // labelElement.textContent = `${solvedCount} / ${totalCount}\n${labelName}`;
    labelElement.innerHTML = `${solvedCount} / ${totalCount}<br>${labelName}`;

}


    function displayDetails(parsedData) {
        if (parsedData.status !== "success") {
            statsContainer.innerHTML = "<p style='color:red;'>Invalid username or profile not found.</p>";
            return;
        }

        const totalEasy = parsedData.totalEasy;
        const totalMedium = parsedData.totalMedium;
        const totalHard = parsedData.totalHard;

        const solvedEasy = parsedData.easySolved;
        const solvedMedium = parsedData.mediumSolved;
        const solvedHard = parsedData.hardSolved;
        const totalSubmissions=solvedEasy + solvedMedium + solvedHard;

        updateProgress(easyProgressCircle, solvedEasy, totalEasy, easyLabel,"Easy");
        updateProgress(mediumProgressCircle, solvedMedium, totalMedium, mediumLabel,"Medium");
        updateProgress(hardProgressCircle, solvedHard, totalHard, hardLabel,"Hard");

        // statsContainer.style.display = "block";
        const statsCards=[
            {label:"Overall Submissions", value: totalSubmissions},
            {label:"Total Easy Submissions", value: parsedData.easySolved},
            {label:"Total Medium submissions", value: parsedData.mediumSolved},
            {label:"Total Hard Submissions", value: parsedData.hardSolved}
            
        ]
        cardsStatsContainer.innerHTML = ""; // Clear previous stats
        statsCards.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${stat.label}</h3><p>${stat.value}</p>`;
            cardsStatsContainer.appendChild(card);
        });
    }

    async function fetchDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user data.");
            }

            const parsedData = await response.json();
            console.log("Data is:", parsedData);
            displayDetails(parsedData);
        } catch (error) {
            statsContainer.innerHTML = `<p style='color:red;'>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if (validUserName(username)) {
            fetchDetails(username);
        }
    });
});
