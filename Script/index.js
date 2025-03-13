function startloader() {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
}
function stopLoader() {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
}

function removeActive() {
  const allActive = document.getElementsByClassName("active");

  for (let button of allActive) {
    button.classList.remove("active");
  }
}

function loadCategories() {
  //fetch the data
  startloader()
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
}

function displayCategories(categoryName) {
  const category = document.getElementById("catergory-container");

  for (let name of categoryName) {
    const item = document.createElement("div");
    item.innerHTML = `
      <button id="${name.category_id}" onclick="categoryVid(${name.category_id})" class="btn btn-sm border-none bg-[#25252526] text-[#252525B2] hover:bg-[#FF1F3D] hover:text-[#fff]">${name.category} </button>

    `;

    category.appendChild(item);
  }
  stopLoader();
}

// modal show details
function loadDetails(id) {
  startloader()
  const urlById = `https://openapi.programming-hero.com/api/phero-tube/video/${id}`;

  fetch(urlById)
    .then((res) => res.json())
    .then((data) => showDetails(data.video));
}

function showDetails(videoDetails) {
  document.getElementById("infoModal").showModal();

  document.getElementById("modalContent").innerHTML = `


    <div class="card bg-base-100 shadow-sm">
  <figure>
    <img
      src="${videoDetails.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${videoDetails.title}</h2>
    <h3 >Author Name is ${videoDetails.authors[0].profile_name}</h3>
   
    
 
  </div>
</div>
  `;
  stopLoader()
}

// category wise video
const categoryVid = (vidId) => {
  startloader()
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${vidId}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const changeColorBtn = document.getElementById(`${vidId}`);
      removeActive(); //to remove other active button
      changeColorBtn.classList.add("active");

      displayVideos(data.category);
    });
};

// load function

function loadVideos(searchWord = "") {
  startloader()
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchWord}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos));
  removeActive(); //to remove other active button
  document.getElementById("allBtn").classList.add("active");
}

// object structure

// {
//   "category_id": "1001",
//   "video_id": "aaah",
//   "thumbnail": "https://i.ibb.co/hY496Db/coloer-of-the-wind.jpg",
//   "title": "Colors of the Wind",
//   "authors": [
//       {
//           "profile_picture": "https://i.ibb.co/6r4cx4P/ethen-clack.png",
//           "profile_name": "Ethan Clark",
//           "verified": true
//       }
//   ],
//   "others": {
//       "views": "233K",
//       "posted_date": "16090"
//   },
//   "description": "Ethan Clark's 'Colors of the Wind' is a vibrant musical exploration that captivates listeners with its rich, expressive melodies and uplifting rhythm. With 233K views, this song is a celebration of nature's beauty and human connection, offering a soothing and enriching experience for fans of heartfelt, nature-inspired music."
// }

// display video

const displayVideos = (allvideos) => {
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML = ""; // to clear all videos when we shift to other category
  if (allvideos.length == 0) {
    stopLoader()
    videoContainer.innerHTML = `
      <div class="col-span-full flex flex-col justify-center items-center p-[7%]">
        <img class="w-[150px]" src="Assets/Icon.png" alt="">
        <h2 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h2>
      </div>
    `;

    return;
  }

  allvideos.forEach((video) => {
    const videoCard = document.createElement("div");

    videoCard.innerHTML = `
        <div >
        <figure class="relative">
          <img class="w-full h-[230px] rounded object-cover"
            src=${video.thumbnail} />

            <span class="absolute bottom-2 right-2 text-white rounded-sm bg-gray-700 text-sm p-2">3 hrs 56 min ago</span>
        </figure>



        <div class="flex gap-3 mt-4">
          
          
            <div class="avatar">
              <div class="w-12 h-12 rounded-full">
                <img src= ${video.authors[0].profile_picture} />
              </div>
            </div>
            <!-- title and authors stuff  -->
            <div class="space-y-1">
              <h2 class="text-xl font-semibold">${video.title}</h2>
              <p class="text-gray-500 flex text-sm font-semibold gap-1">
                ${video.authors[0].profile_name}
                <img id="verifiedSign" class="w-5 h-5 hidden" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">
              </p>

              <p class="text-gray-500 text-sm">${video.others.views} Views</p>

            </div>
         


        </div>


    <button onclick="loadDetails('${video.video_id}')" class="btn btn-block my-2">View Details</button>
      </div>
      `;

    if (video.authors[0].verified === true) {
      videoCard.querySelector("#verifiedSign").classList.remove("hidden");
    }

    videoContainer.append(videoCard);
  });
  stopLoader()
};

document.getElementById("search").addEventListener("keyup", (e) => {
  loadVideos(e.target.value); //search video
});

// all function call

loadCategories();
