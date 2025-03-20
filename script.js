document.addEventListener("DOMContentLoaded", () => {
    let videocontainer = document.getElementById("video-container");
    let nextbtn = document.getElementById("next-btn");
    let prevbtn = document.getElementById("prev-btn");
    let currentdisplay = document.getElementById("current");

    let currentpage = 1;
    let totalpages = 1;
    let apiurl = "https://api.freeapi.app/api/v1/public/youtube/videos";

    async function rendervideo() {
        const url = `${apiurl}?page=${currentpage}`; //customized url that pass currentpage

        // we use try and catch to avoid code stop working
        try {
            const response = await fetch(url);
            const data = await response.json();

            currentpage = data.data.page;
            totalpages = data.data.totalPages;

            
            prevbtn.disabled = currentpage === 1;
            nextbtn.disabled = currentpage === totalpages;

            currentdisplay.innerText = `Page ${currentpage} of ${totalpages}`;

            const items = data.data.data;
            videocontainer.innerHTML = "";

            //we use for each to render the  video and append them in video container
            items.forEach((item) => {
                let video = document.createElement("div");
                video.classList.add("video-card");

                let videoId = item.items.id;
                let title = item.items.snippet.title || "No title";
                let channelName = item.items.snippet.channelTitle || "Unknown Channel";
                let views = item.items.statistics.viewCount || "0";
                let likes = item.items.statistics.likeCount || "0";
                let thumbnail = item.items.snippet.thumbnails.high.url || "default-thumbnail.jpg";


                //modify the innerHtml
                video.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                        <img src="${thumbnail}" alt="Video Thumbnail" class="video-thumbnail">
                    </a>
                    <div class="video-info">
                        <h3 class="video-title">${title}</h3>
                        <p class="channel-name">${channelName}</p>
                        <p class="video-stats">${views} Views • ${likes} 👍</p>
                    </div>
                `;

                videocontainer.appendChild(video);
            });
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    }

    //call rendervideo to render video when page loads
    rendervideo();

        
    //we add click event on nextbtn to move to next page
    nextbtn.addEventListener("click", () => {
        if (currentpage < totalpages) {
            currentpage++;
            rendervideo();
        }
    });
    
    //we add click event on prevbtn to move to previous page
    prevbtn.addEventListener("click", () => {
        if (currentpage > 1) {
            currentpage--;
            rendervideo();
        }
    });
});
